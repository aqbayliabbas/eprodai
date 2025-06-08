"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Download, Upload, X, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import DashboardProfileDropdown from "./DashboardProfileDropdown";

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
    <div className="w-full min-h-screen bg-[#f9f6f1] flex flex-col px-10 pb-12">
      {/* Dashboard Header */}
      <header className="sticky top-0 z-30 w-full bg-[#f9f6f1] shadow-sm flex items-center justify-between px-8 py-4 mb-10">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-[#6B46C1] tracking-tight">EPROD</span>
        </div>
        {/* Profile Dropdown */}
        <DashboardProfileDropdown />
      </header>
      <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-10 bg-[#f9f6f1] p-6 rounded-2xl shadow-lg border-2 border-purple-100">
        {/* Left: Prompt & Upload */}
        <div className="flex-1 flex flex-col gap-8">
          {/* Prompt Section */}
          <section aria-labelledby="prompt-label">
            <label id="prompt-label" htmlFor="prompt" className="text-base font-semibold text-[#212121] mb-1 block">
              Product Description
            </label>
            <div className="flex gap-2 items-start">
              <textarea
                id="prompt"
                placeholder="e.g., A sleek modern coffee mug in matte black finish with ergonomic handle, photographed on a white background with soft lighting"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                className="w-full min-h-[120px] rounded-xl bg-[#f9f6f1] shadow p-4 text-base placeholder:text-[#a89b8c] appearance-none outline-none border-none focus:ring-2 focus:ring-purple-400 transition-all duration-200 resize-none scrollbar-none overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                /* Hide scrollbar for Webkit browsers */
                /* ::-webkit-scrollbar { display: none; } */
                spellCheck={false}
                autoComplete="off"
              />
              <Button type="button" variant="outline" size="icon" disabled={refining} onClick={refinePrompt}>
                {refining ? <Loader2 className="animate-spin w-4 h-4" /> : <Wand2 className="w-4 h-4" />}
              </Button>
            </div>
          </section>
          {/* Reference Images Section */}
          <section>
            <label className="text-base font-semibold text-[#212121] mb-1 block">Reference Images</label>
            <div
              className={`border-2 border-dashed rounded-lg p-4 flex flex-wrap gap-4 min-h-[120px] items-center justify-center transition ${isDragging ? "border-purple-700 bg-[#f9f6f1]" : "border-purple-200"}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
              onDrop={handleFileUpload}
            >
              <label className="flex flex-col items-center justify-center cursor-pointer w-full h-48 border border-purple-200 rounded-lg hover:bg-[#f9f6f1] transition p-0 m-0">
                <Upload className="w-10 h-10 text-blue-400 mb-2" />
                <span className="text-base text-blue-600 font-medium">Add Image</span>
                <input type="file" accept="image/*" multiple className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                <span className="block mt-2 text-sm text-[#a89b8c]">Drag and drop or click to upload images</span>
              </label>
              {referenceImages.map((img, idx) => (
                <div key={idx} className="relative w-32 h-32 border border-purple-200 rounded-lg overflow-hidden group">
                  <img
                    src={`data:image/png;base64,${img}`}
                    alt={`Reference ${idx + 1}`}
                    className="object-cover w-full h-full"
                  />
                  <button
                    className="absolute top-1 right-1 bg-[#f9f6f1] rounded-full p-1 shadow hover:bg-red-100 transition"
                    onClick={() => removeReferenceImage(idx)}
                    type="button"
                  >
                    <X className="w-4 h-4 text-red-400 group-hover:text-red-600" />
                  </button>
                </div>
              ))}
            </div>
          </section>
          {/* Generate Button */}
          <Button className="w-full bg-purple-700 text-white font-bold py-3 rounded-xl shadow hover:bg-purple-800 transition text-lg mt-2" onClick={generateProductImage} disabled={loading || refining}>
            {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2 inline" /> : <Download className="w-5 h-5 mr-2 inline" />} Generate Product Image
          </Button>
        </div>
        {/* Right: Image Result */}
        <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] bg-white/60 rounded-xl border border-purple-100 p-6">
          {imageUrl ? (
            <div className="flex flex-col items-center">
              <img src={imageUrl} alt="Generated Product" className="rounded-xl shadow-lg max-w-full max-h-[400px] object-contain mb-4" />
              <Button
                className="mt-4"
                onClick={() => {
                  const a = document.createElement('a');
                  a.href = imageUrl;
                  a.download = 'product-image.png';
                  a.click();
                }}
              >
                <span>Download Image</span>
              </Button>
            </div>
          ) : (
            <div className="text-[#212121] opacity-60 text-center">Your generated product image will appear here.</div>
          )}
        </div>
      </div>
    </div>
  );
}
