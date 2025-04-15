# config.py — pour IA générative de webtoon 

# === PROMPTS DE BASE PAR GENRE ===
GENRE_PROMPTS = {
    "romance": "Crée une histoire romantique avec des personnages attachants, une tension amoureuse croissante, des malentendus touchants et une évolution émotionnelle.",
    "fantasy": "Imagine un monde magique où un héros découvre un pouvoir ou est transporté ailleurs. Intègre apprentissage, montée en puissance et un affrontement épique.",
    "action": "Crée un thriller haletant avec un conflit initial, de l’enquête, des trahisons et un climax tendu. L’intensité monte à chaque épisode.",
    "horreur": "Écris une histoire mystérieuse avec une ambiance oppressante, des secrets dérangeants, et des twists psychologiques choquants."
}

# === STRUCTURE D’UN ÉPISODE DE WEBTOON ===
EPISODE_STRUCTURE = {
    "intro": {
        "description": "Hook percutant (10-20 sec de lecture). Cliffhanger visuel si ongoing.",
        "prompt": "Commence par une scène intrigante ou choquante. Elle doit piquer la curiosité ou poser une tension immédiate."
    },
    "developpement": {
        "description": "60-80% de l’épisode. Intrigue, dialogues, tension, émotion selon le genre.",
        "prompt": "Fais avancer l’intrigue avec des interactions dynamiques. Intègre 1 ou 2 moments forts maximum."
    },
    "climax": {
        "description": "Fin punchline ou teasing de l’épisode suivant.",
        "prompt": "Conclue avec un retournement, un cliffhanger ou une révélation puissante."
    }
}

# === STRUCTURE PAR ARC — PAR GENRE ===
GENRE_STRUCTURE = {
    "Romance": {
        "intro": "Rencontre, tension légère",
        "middle": "Premiers obstacles, moments de rapprochement",
        "climax": "Rupture / obstacle / rival inattendu",
        "end": "Résolution et amour scellé ou tragédie"
    },
    "Fantasy": {
        "intro": "Monde réel → téléportation ou révélation de pouvoir, Introduction du monde et des règles",
        "middle": "Apprentissage, Entrainement, exploration, montée en puissance",
        "climax": "Guerre, complot, trahison ou révélation de pouvoir",
        "end": "Combat final, retour au monde réel ou nouveau statut"
    },
    "Action": {
        "intro": "Conflit ou crime initial",
        "middle": "Investigation, Chasse, énigmes, tensions",
        "climax": "Trahison, tension maximale, twist majeur",
        "end": "Vérité révélée, twist final, victoire amère ou tragique"
    },
    "Horreur": {
        "intro": "Atmosphère étrange, premiers signes de danger léger",
        "middle": "Découverte de secrets, meurtres ou phénomènes ou de mal profonds",
        "climax": "Vérité choquante, perte mentale",
        "end": "Soit résolution flou, soit fin ouverte flippante"
    }
}

# === AGENTS NARRATIFS ===
AGENTS = {
    "perturbateur": {
        "description": "Ajoute un événement imprévu (degré 1 à 10)",
        "prompt": "Ajoute un événement perturbateur d’intensité {level} qui oblige le héros à modifier ses plans."
    },
    "twist_master": {
        "description": "Ajoute un retournement narratif choquant",
        "prompt": "Insère un twist qui change notre compréhension d’un personnage ou événement."
    },
    "dilemme_moral": {
        "description": "Choix difficile à conséquences lourdes",
        "prompt": "Propose un dilemme moral au héros, influençant profondément la suite."
    },
    "mutation_de_genre": {
        "description": "Changement de ton ou de genre narratif",
        "prompt": "Fais basculer l’histoire vers un autre genre, de manière fluide et cohérente."
    },
    "flashback_lore": {
        "description": "Ajoute un souvenir ou une révélation du lore",
        "prompt": "Intègre un flashback révélant des infos clés sur un perso ou le monde."
    },
    "faux_espoir": {
        "description": "Victoire temporaire ou illusion brisée",
        "prompt": "Ajoute un moment de bonheur ou de victoire qui se révèle trompeur."
    },
    "relation_dynamics": {
        "description": "Fait évoluer une relation entre personnages",
        "prompt": "Modifie les liens entre deux persos avec une tension, un secret ou un rapprochement."
    }
}

# === FONCTIONS ===
def get_genre_prompt(genre: str):
    return GENRE_PROMPTS.get(genre.lower(), "Genre inconnu.")

def get_episode_prompt(section: str):
    return EPISODE_STRUCTURE.get(section, {}).get("prompt", "Section inconnue.")

def get_arc_steps(genre: str):
    return ARC_STRUCTURE.get(genre.lower(), [])

def get_agent_prompt(agent_name: str, **kwargs):
    agent = AGENTS.get(agent_name)
    if not agent:
        return "Agent inconnu."
    return agent["prompt"].format(**kwargs) if kwargs else agent["prompt"]
