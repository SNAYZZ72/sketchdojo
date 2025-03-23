"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Play, Pause, Save, Mic, VolumeX, Volume2 } from "lucide-react";

// Voice presets for the tool
const voicePresets = [
  { id: "male-1", name: "Male 1 - Deep", category: "male" },
  { id: "male-2", name: "Male 2 - Young", category: "male" },
  { id: "male-3", name: "Male 3 - Elderly", category: "male" },
  { id: "female-1", name: "Female 1 - Soft", category: "female" },
  { id: "female-2", name: "Female 2 - Strong", category: "female" },
  { id: "female-3", name: "Female 3 - Young", category: "female" },
  { id: "child-1", name: "Child 1", category: "child" },
  { id: "child-2", name: "Child 2", category: "child" },
];

interface SavedVoiceClip {
  id: string;
  name: string;
  text: string;
  voice: string;
  duration: number;
  createdAt: Date;
}

export default function VoiceActingTool() {
  const [selectedVoice, setSelectedVoice] = useState("female-1");
  const [scriptText, setScriptText] = useState("");
  const [voiceName, setVoiceName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [pitch, setPitch] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(100);
  const [savedClips, setSavedClips] = useState<SavedVoiceClip[]>([
    {
      id: "1",
      name: "Hero Introduction",
      text: "I am the protector of this realm, and I will not let you harm these people!",
      voice: "male-1",
      duration: 5.2,
      createdAt: new Date("2023-03-15")
    },
    {
      id: "2",
      name: "Villain Threat",
      text: "You think you can stop me? You have no idea what powers I possess!",
      voice: "male-2",
      duration: 4.8,
      createdAt: new Date("2023-03-16")
    },
  ]);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const handleGenerateVoice = async () => {
    if (!scriptText) return;
    
    setIsGenerating(true);
    
    try {
      // TODO: Implement actual API call to your voice generation service
      // This is a placeholder for demonstration
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // In a real implementation, this would set an audio source from your voice API
      // For now, we'll just use a static audio file
      if (audioRef.current) {
        audioRef.current.src = "/placeholder-audio.mp3"; // Replace with actual audio source
        audioRef.current.load();
      }
      
      // Add to saved clips
      if (voiceName) {
        const newClip = {
          id: Date.now().toString(),
          name: voiceName,
          text: scriptText,
          voice: selectedVoice,
          duration: 5.0, // Mock duration
          createdAt: new Date()
        };
        setSavedClips([newClip, ...savedClips]);
        setVoiceName("");
      }
    } catch (error) {
      console.error("Failed to generate voice:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const playClip = (clip: SavedVoiceClip) => {
    if (audioRef.current) {
      // In a real implementation, this would play the saved clip
      audioRef.current.src = "/placeholder-audio.mp3"; // Replace with actual clip source
      audioRef.current.load();
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const deleteClip = (id: string) => {
    setSavedClips(savedClips.filter(clip => clip.id !== id));
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Voice Acting Generator</h1>
      </div>
      
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create Voice</TabsTrigger>
          <TabsTrigger value="library">Voice Library</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Voice Script</CardTitle>
                <CardDescription>
                  Enter the text you want to convert to speech
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Voice clip name (optional)"
                  value={voiceName}
                  onChange={(e) => setVoiceName(e.target.value)}
                />
                <Textarea
                  placeholder="Enter your script text here..."
                  className="min-h-[200px]"
                  value={scriptText}
                  onChange={(e) => setScriptText(e.target.value)}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Voice Settings</CardTitle>
                <CardDescription>
                  Customize your AI voice
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="voice-select">Voice Type</Label>
                  <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                    <SelectTrigger id="voice-select">
                      <SelectValue placeholder="Select voice" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="header-male" disabled className="font-semibold">
                        Male Voices
                      </SelectItem>
                      {voicePresets.filter(v => v.category === 'male').map((voice) => (
                        <SelectItem key={voice.id} value={voice.id}>
                          {voice.name}
                        </SelectItem>
                      ))}
                      
                      <SelectItem value="header-female" disabled className="font-semibold mt-2">
                        Female Voices
                      </SelectItem>
                      {voicePresets.filter(v => v.category === 'female').map((voice) => (
                        <SelectItem key={voice.id} value={voice.id}>
                          {voice.name}
                        </SelectItem>
                      ))}
                      
                      <SelectItem value="header-child" disabled className="font-semibold mt-2">
                        Child Voices
                      </SelectItem>
                      {voicePresets.filter(v => v.category === 'child').map((voice) => (
                        <SelectItem key={voice.id} value={voice.id}>
                          {voice.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="pitch-slider">Pitch Adjustment</Label>
                    <span className="text-sm text-muted-foreground">{pitch > 0 ? `+${pitch}` : pitch}</span>
                  </div>
                  <Slider
                    id="pitch-slider"
                    defaultValue={[0]}
                    min={-10}
                    max={10}
                    step={1}
                    onValueChange={(value) => setPitch(value[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="speed-slider">Speech Speed</Label>
                    <span className="text-sm text-muted-foreground">{speed}x</span>
                  </div>
                  <Slider
                    id="speed-slider"
                    defaultValue={[1]}
                    min={0.5}
                    max={2}
                    step={0.1}
                    onValueChange={(value) => setSpeed(value[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="volume-slider">Volume</Label>
                    <span className="text-sm text-muted-foreground">{volume}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <VolumeX className="h-4 w-4 text-muted-foreground" />
                    <Slider
                      id="volume-slider"
                      defaultValue={[100]}
                      max={100}
                      step={5}
                      className="flex-1"
                      onValueChange={(value) => setVolume(value[0])}
                    />
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Generated Voice</CardTitle>
              <CardDescription>
                Listen to your AI-generated voice
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-10">
              {isGenerating ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p className="text-sm text-muted-foreground">Generating voice...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <audio ref={audioRef} className="hidden">
                    Your browser does not support the audio element.
                  </audio>
                  <Button 
                    size="lg" 
                    className="h-16 w-16 rounded-full"
                    onClick={handlePlayPause}
                    disabled={!scriptText || isGenerating}
                  >
                    {isPlaying ? (
                      <Pause className="h-8 w-8" />
                    ) : (
                      <Play className="h-8 w-8 ml-1" />
                    )}
                  </Button>
                  <p className="text-sm text-muted-foreground mt-4">
                    {scriptText ? "Click to play generated voice" : "Enter script text and generate voice first"}
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                onClick={handleGenerateVoice}
                disabled={!scriptText || isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-4 w-4" />
                    Generate Voice
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="library" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Saved Voice Clips</CardTitle>
              <CardDescription>
                Your library of generated voice clips
              </CardDescription>
            </CardHeader>
            <CardContent>
              {savedClips.length === 0 ? (
                <div className="text-center py-12">
                  <Mic className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
                  <p className="text-muted-foreground mt-4">No voice clips saved yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Create and save voice clips to see them here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedClips.map((clip) => (
                    <Card key={clip.id} className="overflow-hidden">
                      <div className="p-4 flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{clip.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1 max-w-md">
                            {clip.text}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {voicePresets.find(v => v.id === clip.voice)?.name || clip.voice}
                            </span>
                            <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {clip.duration.toFixed(1)}s
                            </span>
                            <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {clip.createdAt.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => playClip(clip)}>
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => deleteClip(clip.id)}>
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
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 