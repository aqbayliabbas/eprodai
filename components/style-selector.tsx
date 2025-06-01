"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { ThumbnailStyle } from "@/components/thumbnail-generator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Predefined thumbnail styles
const thumbnailStyles: ThumbnailStyle[] = [
  {
    id: "modern",
    name: "Modern & Clean",
    description: "Clean design with bold text and minimal elements",
    colors: ["#3B82F6", "#EF4444", "#FFFFFF"],
    textPlacement: "center",
    backgroundStyle: "gradient",
  },
  {
    id: "vibrant",
    name: "Vibrant & Bold",
    description: "Eye-catching colors with dynamic text placement",
    colors: ["#8B5CF6", "#EC4899", "#FBBF24"],
    textPlacement: "bottom-right",
    backgroundStyle: "colorful",
  },
  {
    id: "minimal",
    name: "Minimalist",
    description: "Simple and elegant with focus on the subject",
    colors: ["#111827", "#E5E7EB", "#F9FAFB"],
    textPlacement: "bottom",
    backgroundStyle: "solid",
  },
  {
    id: "gaming",
    name: "Gaming",
    description: "Energetic and bold design perfect for gaming content",
    colors: ["#10B981", "#6366F1", "#F43F5E"],
    textPlacement: "angled",
    backgroundStyle: "dynamic",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Clean and trustworthy design for business content",
    colors: ["#0369A1", "#1E40AF", "#F3F4F6"],
    textPlacement: "left",
    backgroundStyle: "subtle",
  },
];

interface StyleSelectorProps {
  selectedStyle: ThumbnailStyle | null;
  setSelectedStyle: (style: ThumbnailStyle) => void;
}

export function StyleSelector({ selectedStyle, setSelectedStyle }: StyleSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Thumbnail Style</h3>
      <p className="text-sm text-muted-foreground">
        Choose a design style for your thumbnail:
      </p>
      
      <div className="grid gap-3">
        {thumbnailStyles.map((style) => (
          <div
            key={style.id}
            className={cn(
              "relative flex cursor-pointer rounded-lg border p-4 hover:border-primary",
              selectedStyle?.id === style.id ? "border-primary" : "border-border"
            )}
            onClick={() => setSelectedStyle(style)}
          >
            <div className="flex flex-1 items-start justify-between">
              <div>
                <div className="flex items-center">
                  <h4 className="font-medium">{style.name}</h4>
                  {selectedStyle?.id === style.id && (
                    <Check className="h-5 w-5 text-primary ml-2" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {style.description}
                </p>
                <div className="flex mt-2 gap-2">
                  {style.colors.map((color, index) => (
                    <div
                      key={index}
                      className="h-5 w-5 rounded-full border border-border"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <Badge variant="outline" className="ml-3">
                {style.backgroundStyle}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}