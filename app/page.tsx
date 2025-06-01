'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Download, Upload, X, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';

export default function Home() {
  // Drag-and-drop state
  const [isDragging, setIsDragging] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [refining, setRefining] = useState(false);
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag-and-drop and file input handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => {
    let files: FileList | null = null;
    if ('dataTransfer' in e) {
      files = e.dataTransfer.files;
      e.preventDefault();
      setIsDragging(false);
    } else if ('target' in e && (e.target as HTMLInputElement).files) {
      files = (e.target as HTMLInputElement).files;
    }
    if (!files) return;

    const newImages: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
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
      fileInputRef.current.value = '';
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(',')[1];
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
      toast.error('Please enter a product description');
      return;
    }

    try {
      setRefining(true);
      const response = await fetch('/api/refine-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: prompt.trim(),
          referenceImages: referenceImages 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refine product description');
      }

      const data = await response.json();
      setPrompt(data.refinedPrompt);
      toast.success('Product description refined successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to refine product description. Please try again.');
    } finally {
      setRefining(false);
    }
  };

  const generateProductImage = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a product description');
      return;
    }

    if (referenceImages.length === 0) {
      toast.error('Please upload at least one reference image');
      return;
    }

    try {
      setLoading(true);
      setImageUrl('');

      const response = await fetch('/api/generate-thumbnail', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: `Create a professional product image with the following description: ${prompt}. Make it suitable for e-commerce, with clean background and professional lighting.`,
          referenceImages: referenceImages
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        const text = await response.text();
        console.error('Raw response:', text);
        throw new Error('Invalid response format from server');
      }

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to generate product image');
      }

      if (!data.imageUrl) {
        throw new Error('No image URL received from server');
      }

      setImageUrl(data.imageUrl);
      toast.success('Product image generated successfully!');
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to generate product image. Please try again.');
      setImageUrl('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-blue-50 flex flex-col items-center justify-center p-4">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-blue-900 drop-shadow-sm mb-2">
          Product Image Generator
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Instantly create professional e-commerce images. Enter a description, upload reference photos, and get a stunning product image.
        </p>
      </header>
      <Card className="w-full max-w-2xl shadow-2xl border-2 border-blue-100">
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
                className="flex-1 min-h-[100px] bg-blue-50/50 border-blue-200 focus:ring-blue-400"
                disabled={loading || refining}
                aria-disabled={loading || refining}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={refinePrompt}
                disabled={loading || refining || !prompt.trim()}
                className="h-10 mt-1"
                aria-label="Refine description"
              >
                {refining ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </section>

          {/* Reference Images Section */}
          <section aria-labelledby="images-label">
            <label id="images-label" className="text-base font-semibold text-blue-900 mb-1 block">Reference Images</label>
            <p className="text-sm text-muted-foreground mb-2">Drag & drop or upload product images to merge and enhance</p>
            <div
              className={`flex flex-wrap gap-3 p-3 rounded-lg border-2 border-dashed transition-colors ${isDragging ? 'border-blue-400 bg-blue-50/50' : 'border-blue-200 bg-white'}`}
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={e => { e.preventDefault(); setIsDragging(false); }}
              onDrop={handleFileUpload}
              tabIndex={0}
              aria-label="Drop reference images here"
            >
              {referenceImages.map((img, index) => (
                <div key={index} className="relative w-28 h-28 group shadow-sm">
                  <img
                    src={`data:image/png;base64,${img}`}
                    alt={`Reference ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg border border-blue-200"
                  />
                  <button
                    onClick={() => removeReferenceImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow group-hover:scale-110 transition"
                    aria-label={`Remove reference image ${index + 1}`}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-28 h-28 flex flex-col items-center justify-center gap-1 border-blue-200"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                aria-label="Add reference image"
              >
                <Upload size={24} />
                <span className="text-xs">Add Image</span>
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileUpload}
                disabled={loading}
              />
            </div>
          </section>

          {/* Generate Button */}
          <Button
            onClick={generateProductImage}
            disabled={!prompt.trim() || loading || referenceImages.length === 0}
            className="w-full text-lg py-6 bg-blue-700 hover:bg-blue-800 text-white font-semibold shadow"
            aria-busy={loading}
          >
            {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {loading ? 'Generating...' : 'Generate Product Image'}
          </Button>

          {/* Result Section */}
          {imageUrl && (
            <section aria-labelledby="result-label" className="pt-6 border-t border-blue-100">
              <h3 id="result-label" className="text-lg font-bold text-blue-900 mb-3">Generated Product Image</h3>
              <div className="relative aspect-square w-full max-w-xs mx-auto overflow-hidden rounded-xl border-2 border-blue-200 bg-blue-50 flex items-center justify-center">
                <img
                  src={imageUrl}
                  alt="Generated product"
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  className="w-full border-blue-200"
                  onClick={() => window.open(imageUrl, '_blank')}
                  aria-label="Download full size image"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Full Size
                </Button>
              </div>
            </section>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
