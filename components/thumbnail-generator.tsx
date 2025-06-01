"use client";

import { useState } from "react";
import { ThumbnailUploader } from "@/components/thumbnail-uploader";
import { ThumbnailCustomizer } from "@/components/thumbnail-customizer";
import { ThumbnailPreview } from "@/components/thumbnail-preview";
import { ThumbnailHistory } from "@/components/thumbnail-history";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StyleSelector } from "@/components/style-selector";
import { useToast } from "@/hooks/use-toast";

export type UploadedImage = {
  dataUrl: string;
  file: File;
};

export type ThumbnailStyle = {
  id: string;
  name: string;
  description: string;
  colors: string[];
  textPlacement: string;
  backgroundStyle: string;
};

export type GeneratedThumbnail = {
  id: string;
  imageUrl: string;
  mainText: string;
  subtitleText?: string;
  createdAt: Date;
};

export function ThumbnailGenerator() {
  const { toast } = useToast();
  const [referenceImages, setReferenceImages] = useState<UploadedImage[]>([]);
  const [mainText, setMainText] = useState("");
  const [subtitleText, setSubtitleText] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<ThumbnailStyle | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedThumbnail, setGeneratedThumbnail] = useState<string | null>(null);
  const [history, setHistory] = useState<GeneratedThumbnail[]>([]);

  const handleGenerateThumbnail = async () => {
    if (referenceImages.length === 0) {
      toast({
        title: "No reference images",
        description: "Please upload at least one reference image.",
        variant: "destructive",
      });
      return;
    }

    if (!mainText) {
      toast({
        title: "No main text",
        description: "Please enter some main text for your thumbnail.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // In a real implementation, this would call the Gemini API
      // For now, we'll simulate a response with a timeout
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Simulate a generated thumbnail (would be from Gemini API)
      const mockThumbnailUrl = "https://images.pexels.com/photos/1037992/pexels-photo-1037992.jpeg";
      setGeneratedThumbnail(mockThumbnailUrl);
      
      // Add to history
      const newThumbnail = {
        id: Date.now().toString(),
        imageUrl: mockThumbnailUrl,
        mainText,
        subtitleText,
        createdAt: new Date(),
      };
      
      setHistory((prev) => [newThumbnail, ...prev]);
      
      toast({
        title: "Thumbnail generated!",
        description: "Your thumbnail has been successfully created.",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "There was an error generating your thumbnail. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setReferenceImages([]);
    setMainText("");
    setSubtitleText("");
    setSelectedStyle(null);
    setGeneratedThumbnail(null);
  };

  return (
    <div className="container px-4 py-10 md:px-6">
      <Tabs defaultValue="generator" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generator">Generator</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="generator" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Card className="p-6">
                <ThumbnailUploader 
                  referenceImages={referenceImages}
                  setReferenceImages={setReferenceImages}
                />
              </Card>
              <Card className="p-6">
                <ThumbnailCustomizer
                  mainText={mainText}
                  setMainText={setMainText}
                  subtitleText={subtitleText}
                  setSubtitleText={setSubtitleText}
                  handleGenerateThumbnail={handleGenerateThumbnail}
                  handleReset={handleReset}
                  isGenerating={isGenerating}
                />
              </Card>
              <Card className="p-6">
                <StyleSelector 
                  selectedStyle={selectedStyle} 
                  setSelectedStyle={setSelectedStyle} 
                />
              </Card>
            </div>
            <div>
              <Card className="p-6">
                <ThumbnailPreview
                  generatedThumbnail={generatedThumbnail}
                  mainText={mainText}
                  subtitleText={subtitleText}
                  isGenerating={isGenerating}
                />
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="history" className="mt-6">
          <ThumbnailHistory history={history} />
        </TabsContent>
      </Tabs>
    </div>
  );
}