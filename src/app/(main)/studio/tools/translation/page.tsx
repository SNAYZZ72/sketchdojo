"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Loader2, Languages, FileText, Upload } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Language options
const languages = [
  { value: "en", label: "English" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "zh", label: "Chinese (Simplified)" },
  { value: "zh-tw", label: "Chinese (Traditional)" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "ru", label: "Russian" },
];

interface TranslationEntry {
  id: string;
  original: string;
  translated: string;
}

export default function TranslationTool() {
  const [sourceLanguage, setSourceLanguage] = useState("ja");
  const [targetLanguage, setTargetLanguage] = useState("en");
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [activeTab, setActiveTab] = useState("text");
  
  // For glossary tab
  const [glossaryEntries, setGlossaryEntries] = useState<TranslationEntry[]>([
    { id: "1", original: "主人公", translated: "Protagonist" },
    { id: "2", original: "魔法使い", translated: "Wizard" },
    { id: "3", original: "冒険", translated: "Adventure" },
  ]);
  const [newGlossaryTerm, setNewGlossaryTerm] = useState("");
  const [newGlossaryTranslation, setNewGlossaryTranslation] = useState("");

  const handleTranslate = async () => {
    if (!sourceText) return;
    
    setIsTranslating(true);
    setTranslatedText("");
    
    try {
      // TODO: Implement actual API call to your translation service
      // This is a placeholder for demonstration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock result - in real implementation, this would be the result from your translation API
      const mockTranslation = sourceLanguage === "ja" && targetLanguage === "en" 
        ? "This is a mock translation from Japanese to English. In a real implementation, this would be returned from a translation API."
        : `Translated from ${languages.find(l => l.value === sourceLanguage)?.label} to ${languages.find(l => l.value === targetLanguage)?.label}. ${sourceText}`;
      
      setTranslatedText(mockTranslation);
    } catch (error) {
      console.error("Failed to translate text:", error);
    } finally {
      setIsTranslating(false);
    }
  };

  const addGlossaryEntry = () => {
    if (!newGlossaryTerm || !newGlossaryTranslation) return;
    
    setGlossaryEntries([
      ...glossaryEntries,
      {
        id: Date.now().toString(),
        original: newGlossaryTerm,
        translated: newGlossaryTranslation
      }
    ]);
    
    setNewGlossaryTerm("");
    setNewGlossaryTranslation("");
  };

  const removeGlossaryEntry = (id: string) => {
    setGlossaryEntries(glossaryEntries.filter(entry => entry.id !== id));
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Translation Tool</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="text">Text Translation</TabsTrigger>
          <TabsTrigger value="glossary">Translation Glossary</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Source Text</CardTitle>
                <CardDescription>
                  Enter the text you want to translate
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex justify-between mb-2">
                  <Label htmlFor="source-language">Source Language</Label>
                  <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                    <SelectTrigger id="source-language" className="w-[180px]">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((language) => (
                        <SelectItem key={language.value} value={language.value}>
                          {language.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Textarea
                  placeholder="Enter text to translate..."
                  className="flex-1 min-h-[250px]"
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                />
              </CardContent>
            </Card>
            
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Translated Text</CardTitle>
                <CardDescription>
                  Your translated content will appear here
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex justify-between mb-2">
                  <Label htmlFor="target-language">Target Language</Label>
                  <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                    <SelectTrigger id="target-language" className="w-[180px]">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((language) => (
                        <SelectItem key={language.value} value={language.value}>
                          {language.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 bg-secondary/20 rounded-md p-3 min-h-[250px]">
                  {isTranslating ? (
                    <div className="h-full flex flex-col items-center justify-center gap-2">
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <p className="text-sm text-muted-foreground">Translating...</p>
                    </div>
                  ) : translatedText ? (
                    <div className="whitespace-pre-wrap">{translatedText}</div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                      <Languages className="h-16 w-16 mb-2 opacity-20" />
                      <p>Translated text will appear here</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={handleTranslate}
                  disabled={!sourceText || isTranslating}
                >
                  {isTranslating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Translating...
                    </>
                  ) : (
                    "Translate"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Upload Manga Pages for Translation</CardTitle>
              <CardDescription>
                Automatically extract and translate text from your manga pages
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-primary/20 rounded-md">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Drag & drop files here</p>
              <p className="text-sm text-muted-foreground mb-4 text-center">
                Upload your manga pages to extract text and translate them automatically
              </p>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Browse Files
              </Button>
              <p className="text-xs text-muted-foreground mt-4">
                Supports PNG, JPG, and PDF files
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="glossary" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Translation Glossary</CardTitle>
              <CardDescription>
                Maintain consistent translations for specific terms across your manga
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="glossary-term" className="mb-2 block">Original Term</Label>
                    <Textarea 
                      id="glossary-term"
                      placeholder="Enter original term"
                      value={newGlossaryTerm}
                      onChange={(e) => setNewGlossaryTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="glossary-translation" className="mb-2 block">Translation</Label>
                    <Textarea 
                      id="glossary-translation"
                      placeholder="Enter preferred translation"
                      value={newGlossaryTranslation}
                      onChange={(e) => setNewGlossaryTranslation(e.target.value)}
                    />
                  </div>
                  <div className="flex items-end pb-1">
                    <Button onClick={addGlossaryEntry} disabled={!newGlossaryTerm || !newGlossaryTranslation}>
                      Add Term
                    </Button>
                  </div>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Original Term</TableHead>
                      <TableHead>Translation</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {glossaryEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">{entry.original}</TableCell>
                        <TableCell>{entry.translated}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => removeGlossaryEntry(entry.id)}
                          >
                            <span className="sr-only">Delete</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="M3 6h18"></path>
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                            </svg>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 