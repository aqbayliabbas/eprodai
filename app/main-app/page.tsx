"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Download, Upload, X, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

export default function MainAppPage() {
  // --- Product Image Generator logic copied from previous dashboard ---
  const [isDragging, setIsDragging] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [refining, setRefining] = useState(false);
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>
  ) => {
    let files: FileList | null = null;
    if ("dataTransfer" in e) {
      files = e.dataTransfer.files;
      e.preventDefault();
      setIsDragging(false);
    } else if ("target" in e && (e.target as HTMLInputElement).files) {
      files = (e.target as HTMLInputElement).files;
    }
    if (!files) return;
    const newImages: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file`);
        continue;
      }
      try {
        const base64 = await fileToBase64(file);
        newImages.push(base64);
      } catch (error) {
        toast.error(`Failed to process ${file.name}`);
      }
    }
    setReferenceImages([...referenceImages, ...newImages]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(",")[1];
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const removeReferenceImage = (index: number) => {
    setReferenceImages(referenceImages.filter((_, i) => i !== index));
  };

  const refinePrompt = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a product description");
      return;
    }
    try {
      setRefining(true);
      const response = await fetch("/api/refine-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt.trim(), referenceImages }),
      });
      if (!response.ok) {
        throw new Error("Failed to refine product description");
      }
      const data = await response.json();
      setPrompt(data.refinedPrompt);
      toast.success("Product description refined successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to refine product description. Please try again.");
    } finally {
      setRefining(false);
    }
  };

  const generateProductImage = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a product description");
      return;
    }
    if (referenceImages.length === 0) {
      toast.error("Please upload at least one reference image");
      return;
    }
    try {
      setLoading(true);
      setImageUrl("");
      const response = await fetch("/api/generate-thumbnail", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `Create a professional product image with the following description: ${prompt}. Make it suitable for e-commerce, with clean background and professional lighting.`,
          referenceImages,
        }),
      });
      let data;
      try {
        data = await response.json();
      } catch (e) {
        console.error("Failed to parse response as JSON:", e);
        const text = await response.text();
        console.error("Raw response:", text);
        throw new Error("Invalid response format from server");
      }
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate product image");
      }
      setImageUrl(data.imageUrl);
      toast.success("Product image generated!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to generate product image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <header className="mb-8 mt-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-blue-900 drop-shadow-sm mb-2">
          Product Image Generator
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Instantly create professional e-commerce images. Enter a description, upload reference photos, and get a stunning product image.
        </p>
      </header>
      <Card className="w-full max-w-2xl mx-auto shadow-2xl border-2 border-blue-100">
        <CardContent className="space-y-8 p-8">
          {/* Prompt Section */}
          <section aria-labelledby="prompt-label">
            <label id="prompt-label" htmlFor="prompt" className="text-base font-semibold text-blue-900 mb-1 block">
              Product Description
            </label>
            <div className="flex gap-2 items-start">
              <Textarea
                id="prompt"
                placeholder="e.g., A sleek modern coffee mug in matte black finish with ergonomic handle, photographed on a white background with soft lighting"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full min-h-[80px]"
              />
              <Button type="button" variant="outline" size="icon" disabled={refining} onClick={refinePrompt}>
                {refining ? <Loader2 className="animate-spin w-4 h-4" /> : <Wand2 className="w-4 h-4" />}
              </Button>
            </div>
          </section>
          {/* Reference Images Section */}
          <section>
            <label className="text-base font-semibold text-blue-900 mb-1 block">Reference Images</label>
            <div
              className={`border-2 border-dashed rounded-lg p-4 flex flex-wrap gap-4 min-h-[120px] items-center justify-center transition ${isDragging ? "border-blue-500 bg-blue-50" : "border-blue-200"}`}
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={e => { e.preventDefault(); setIsDragging(false); }}
              onDrop={handleFileUpload}
            >
              <label className="flex flex-col items-center justify-center cursor-pointer w-32 h-32 border border-blue-200 rounded-lg hover:bg-blue-50 transition">
                <Upload className="w-8 h-8 text-blue-400 mb-2" />
                <span className="text-xs text-blue-600">Add Image</span>
                <input type="file" accept="image/*" multiple className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
              </label>
              {referenceImages.map((img, idx) => (
                <div key={idx} className="relative w-32 h-32 border border-blue-200 rounded-lg overflow-hidden group">
                  <img
                    src={`data:image/png;base64,${img}`}
                    alt={`Reference ${idx + 1}`}
                    className="object-cover w-full h-full"
                  />
                  <button
                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-100 transition"
                    onClick={() => removeReferenceImage(idx)}
                    type="button"
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </section>
          {/* Generate Button */}
          <Button
            className="w-full"
            onClick={generateProductImage}
            disabled={loading || !prompt.trim() || referenceImages.length === 0}
          >
            {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Download className="w-4 h-4 mr-2" />}
            Generate Product Image
          </Button>
          {/* Generated Image */}
          {imageUrl && (
            <div className="flex flex-col items-center mt-8">
              <img src={imageUrl} alt="Generated Product" className="rounded-lg shadow-lg max-w-xs" />
              <Button
                asChild
                className="mt-4"
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = imageUrl;
                  a.download = "product-image.png";
                  a.click();
                }}
              >
                <span>Download Image</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
