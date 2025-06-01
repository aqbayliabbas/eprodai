"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Trash2, Copy } from "lucide-react";
import { GeneratedThumbnail } from "@/components/thumbnail-generator";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface ThumbnailHistoryProps {
  history: GeneratedThumbnail[];
}

export function ThumbnailHistory({ history }: ThumbnailHistoryProps) {
  const { toast } = useToast();
  const [thumbnailToDelete, setThumbnailToDelete] = useState<string | null>(null);

  if (history.length === 0) {
    return (
      <Card className="p-6 text-center">
        <h3 className="text-lg font-medium mb-2">No Thumbnails Yet</h3>
        <p className="text-muted-foreground">
          Your generated thumbnails will appear here.
        </p>
      </Card>
    );
  }

  const handleDownload = async (thumbnail: GeneratedThumbnail) => {
    try {
      // In a real app, we'd handle the actual image
      const response = await fetch(thumbnail.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `youtube-thumbnail-${thumbnail.id}.jpg`;
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
    }
  };

  const handleCopy = (thumbnail: GeneratedThumbnail) => {
    // In a real application, this would duplicate the thumbnail settings
    toast({
      title: "Settings copied",
      description: "Thumbnail settings have been copied to the generator."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Your Thumbnail History</h3>
        <p className="text-sm text-muted-foreground">{history.length} thumbnails</p>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {history.map((thumbnail) => (
          <Card key={thumbnail.id} className="overflow-hidden group">
            <div className="relative aspect-video">
              <img
                src={thumbnail.imageUrl}
                alt={thumbnail.mainText}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                <h4 className="text-white font-bold line-clamp-2 drop-shadow-md">
                  {thumbnail.mainText}
                </h4>
                {thumbnail.subtitleText && (
                  <p className="text-white/80 text-sm mt-1 drop-shadow-md line-clamp-1">
                    {thumbnail.subtitleText}
                  </p>
                )}
              </div>
              
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button 
                  size="sm" 
                  variant="secondary"
                  onClick={() => handleCopy(thumbnail)}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
                <Button 
                  size="sm"
                  onClick={() => handleDownload(thumbnail)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => setThumbnailToDelete(thumbnail.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete thumbnail?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this
                        thumbnail from your history.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            <div className="p-4">
              <div className="text-xs text-muted-foreground">
                Created {formatDistanceToNow(thumbnail.createdAt, { addSuffix: true })}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}