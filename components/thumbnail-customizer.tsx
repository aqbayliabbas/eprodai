"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Wand2, RotateCcw } from "lucide-react";

interface ThumbnailCustomizerProps {
  mainText: string;
  setMainText: (text: string) => void;
  subtitleText: string;
  setSubtitleText: (text: string) => void;
  handleGenerateThumbnail: () => void;
  handleReset: () => void;
  isGenerating: boolean;
}

export function ThumbnailCustomizer({
  mainText,
  setMainText,
  subtitleText,
  setSubtitleText,
  handleGenerateThumbnail,
  handleReset,
  isGenerating,
}: ThumbnailCustomizerProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Thumbnail Text</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="main-text">Main Text</Label>
          <div className="relative">
            <Input
              id="main-text"
              placeholder="Enter main headline text (40 chars max)"
              value={mainText}
              onChange={(e) => setMainText(e.target.value.slice(0, 40))}
              maxLength={40}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
              {mainText.length}/40
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="subtitle-text">Subtitle (optional)</Label>
          <div className="relative">
            <Input
              id="subtitle-text"
              placeholder="Enter subtitle text (20 chars max)"
              value={subtitleText}
              onChange={(e) => setSubtitleText(e.target.value.slice(0, 20))}
              maxLength={20}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
              {subtitleText.length}/20
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 pt-4">
          <Button
            onClick={handleGenerateThumbnail}
            disabled={isGenerating || !mainText}
            className="flex-1"
          >
            <Wand2 className="mr-2 h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate Thumbnail"}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={isGenerating}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}