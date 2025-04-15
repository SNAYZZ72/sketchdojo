import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain.chat_models import init_chat_model
from langchain_core.messages import HumanMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableLambda, RunnableSequence
from config import GENRE_STRUCTURE 
import random

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Modèle IA
model = init_chat_model("gpt-4o-mini", model_provider="openai")

# Requête de génération
class PromptRequest(BaseModel):
    idea: str
    genre: str

#  Prompt template
system_template = "{system_message}"
prompt_template = ChatPromptTemplate.from_messages(
    [("system", system_template), ("user", "{text}")]
)


def split_episode_agent():
    prompt = ChatPromptTemplate.from_messages([
        ("system", "Tu es un scénariste expert en webtoon. Tu dois découper un épisode en 3 scènes (panels), qui couvrent l’évolution de lépisode donné. tu repondra sous forme de liste de json, avec aucun texte en dehors du json. pas de json''' non plus et les ', \" doivent être échappé pour ne pas casser le json."),
        ("user", "Voici ce qui s'est passé dans l'épisode précedent : {previous_episode_text}. Et voici l'episode que tu dois découper : {episode_text}")
    ])
    chain = prompt | model | RunnableLambda(lambda x: json.loads(x.content))
    return chain
#  Agent 1: Générer image prompt
def image_prompt_agent():
    prompt = ChatPromptTemplate.from_messages([
        ("system", "Tu es un expert en création de prompts visuels. Crée un prompt à partir de cette scène : {description}")
    ])
    chain = prompt | model | RunnableLambda(lambda x: x.content.strip())
    return chain

#  Agent 2: Embellir les dialogues
# def dialogue_enhancer_agent():
#     prompt = ChatPromptTemplate.from_messages([
#         ("system", "Tu es un dialoguiste expert. Améliore ce dialogue tout en respectant la personnalité du personnage."),
#         ("user", "Personnage: {character}\nDialogue: {text}")
#     ])
#     chain = prompt | model | RunnableLambda(lambda x: x.content.strip())
#     return chain



def build_episode_pipeline():
    splitter = split_episode_agent()
    image_prompter = image_prompt_agent()

    def process_episode(episode):
        panels = splitter.invoke({"episode_text": episode["content"], "previous_episode_text": episode.get("previous_episode_text", "")})
        print(panels)
        for panel in panels:
            panel["image_prompt"] = image_prompter.invoke({"description": panel["description"]})
        return panels

    return RunnableLambda(process_episode)

#  Endpoint principal
@app.post("/generate")
def generate(request: PromptRequest):
    genre = request.genre.capitalize()
    idea = request.idea

    if genre not in GENRE_STRUCTURE:
        return {"error": "Genre not supported."}

    story_structure = GENRE_STRUCTURE[genre]
    system_message = f"""You are an expert Webtoon writer. Structure a story in the genre of {genre}, using this narrative path:
ARC 1 - Intro: {story_structure['intro']}
ARC 2 - Middle: {story_structure['middle']}
ARC 3 - Climax: {story_structure['climax']}
ARC 4 - End: {story_structure['end']}
For now Write the Arc 1 which is the Intro. Write 3 episodes with strong emotional rhythm, twists, and cliffhangers. Format it clearly by episode.

**Output format**
You must write the story in json format with the following structure:
{{
    "episode_1": {{
        "title": "Episode 1 Title",
        "content": "Episode 1 content..."
        "dialogues": [
            {{"character": "Character 1", "text": "Dialogue 1"}},
            {{"character": "Character 2", "text": "Dialogue 2"}}
        ],
    }},
    "episode_2": {{
        "title": "Episode 2 Title",
        "content": "Episode 2 content..."
        "previous_episode_text": "Episode 1 summary",
    }},
    "episode_3": {{
        "title": "Episode 3 Title",
        "content": "Episode 3 content..."
        "previous_episode_text": "Episode 1 et 2 summary",
    }}
    ...
}}
no text outside the json format.
Don't add json array brackets.
Don't add any other text outside the json format.
"""

    full_prompt = prompt_template.invoke({
        "system_message": system_message,
        "text": f"Write a story based on the following idea: {idea}"
    })

    response = model.invoke(full_prompt)

    try:
        episodes_json = json.loads(response.content)
    except Exception as e:
        return {"error": "Model output is not valid JSON", "raw": response.content}

    # Pipeline execution
    episode_pipeline = build_episode_pipeline()
    episodes_processed = {}

    for key, episode in episodes_json.items():
        episodes_processed[key] = {
            "title": episode["title"],
            "panels": episode_pipeline.invoke(episode)
        }

    return {"arc_panels": episodes_processed}