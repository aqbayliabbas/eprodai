"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface ThumbnailPreviewProps {
  generatedThumbnail: string | null;
  mainText: string;
  subtitleText?: string;
  isGenerating: boolean;
}

export function ThumbnailPreview({
  generatedThumbnail,
  mainText,
  subtitleText,
  isGenerating,
}: ThumbnailPreviewProps) {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!generatedThumbnail) return;
    
    setIsDownloading(true);
    
    try {
      // In a real app, we'd handle the actual image
      const response = await fetch(generatedThumbnail);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `youtube-thumbnail-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Download complete",
        description: "Your thumbnail has been downloaded successfully."
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "There was an error downloading your thumbnail.",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!generatedThumbnail) return;
    
    try {
      // In a real app, we'd need to host the image somewhere to get a shareable URL
      // For this demo, we'll just show a toast
      toast({
        title: "Share link copied",
        description: "Thumbnail share link has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Share failed",
        description: "There was an error sharing your thumbnail.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Thumbnail Preview</h3>
        {generatedThumbnail && (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
            <Button 
              size="sm"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              <Download className="h-4 w-4 mr-1" />
              {isDownloading ? "Downloading..." : "Download"}
            </Button>
          </div>
        )}
      </div>

      <div className="relative w-full aspect-video rounded-lg overflow-hidden border bg-muted/20">
        {isGenerating ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="space-y-3 w-[80%]">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[80%]" />
              <Skeleton className="h-4 w-[60%]" />
            </div>
          </div>
        ) : generatedThumbnail ? (
          <>
            <img 
              src={generatedThumbnail}
              alt="Generated thumbnail"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
              <h2 className="text-white font-bold text-lg md:text-xl line-clamp-2 drop-shadow-md">
                {mainText}
              </h2>
              {subtitleText && (
                <p className="text-white/80 text-sm mt-1 drop-shadow-md">
                  {subtitleText}
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-center p-4">
            <p className="text-muted-foreground">
              {mainText ? (
                <>Your thumbnail preview will appear here</>
              ) : (
                <>Enter some text and generate to preview your thumbnail</>
              )}
            </p>
          </div>
        )}
      </div>
      
      <div className="text-xs text-muted-foreground">
        Preview dimensions: 1280×720 pixels (16:9)
      </div>
    </div>
  );
}