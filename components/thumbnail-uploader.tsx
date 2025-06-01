"use client";

import { useState, useRef } from "react";
import { Upload, X, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UploadedImage } from "@/components/thumbnail-generator";

interface ThumbnailUploaderProps {
  referenceImages: UploadedImage[];
  setReferenceImages: React.Dispatch<React.SetStateAction<UploadedImage[]>>;
}

export function ThumbnailUploader({
  referenceImages,
  setReferenceImages,
}: ThumbnailUploaderProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) handleFiles(Array.from(files));
  };

  const handleFiles = (files: File[]) => {
    if (referenceImages.length + files.length > 5) {
      toast({
        title: "Too many images",
        description: "You can only upload up to 5 reference images.",
        variant: "destructive",
      });
      return;
    }

    const validFiles = files.filter(file => file.type.startsWith("image/"));
    
    if (validFiles.length < files.length) {
      toast({
        title: "Invalid file type",
        description: "Only image files are accepted.",
        variant: "destructive",
      });
    }

    const newImages = validFiles.map(file => {
      return new Promise<UploadedImage>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            dataUrl: e.target?.result as string,
            file
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newImages).then(images => {
      setReferenceImages(prev => [...prev, ...images]);
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFiles(Array.from(files));
  };

  const removeImage = (index: number) => {
    setReferenceImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Reference Images</h3>
      <p className="text-sm text-muted-foreground">
        Upload 3-5 reference thumbnails to inspire your design.
      </p>
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          isDragging ? "border-primary bg-primary/5" : "border-border"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple
          className="hidden"
        />
        <div className="flex flex-col items-center">
          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm font-medium mb-1">
            Drag and drop your images here
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            or
          </p>
          <Button 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()}
          >
            Browse Files
          </Button>
        </div>
      </div>

      {referenceImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {referenceImages.map((image, index) => (
            <div 
              key={index} 
              className="relative rounded-md overflow-hidden aspect-video group"
            >
              <img
                src={image.dataUrl}
                alt={`Reference ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}