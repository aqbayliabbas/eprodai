'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Download, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
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
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const removeReferenceImage = (index: number) => {
    setReferenceImages(referenceImages.filter((_, i) => i !== index));
  };

  const generateThumbnail = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a description for your thumbnail');
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
          prompt: `Create a YouTube thumbnail image with the following description: ${prompt}. Make it eye-catching, professional, and suitable for YouTube. Include space for text overlay.`,
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
        throw new Error(data.error || data.details || 'Failed to generate thumbnail');
      }

      if (!data.imageUrl) {
        throw new Error('No image URL received from server');
      }

      setImageUrl(data.imageUrl);
      toast.success('Thumbnail generated successfully!');
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to generate thumbnail. Please try again.');
      setImageUrl('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>YouTube Thumbnail Generator</CardTitle>
          <CardDescription>
            Generate eye-catching thumbnails for your YouTube videos using AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="prompt" className="text-sm font-medium">
                Describe your thumbnail
              </label>
              <Input
                id="prompt"
                placeholder="e.g., A futuristic city skyline with flying cars and neon lights"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Reference Images (Optional)</label>
              <div className="flex flex-wrap gap-2">
                {referenceImages.map((img, index) => (
                  <div key={index} className="relative w-24 h-24">
                    <img
                      src={`data:image/png;base64,${img}`}
                      alt={`Reference ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeReferenceImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-24 h-24 flex flex-col items-center justify-center gap-1"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
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
            </div>

            <Button
              onClick={generateThumbnail}
              disabled={!prompt.trim() || loading}
              className="w-full"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Generating...' : 'Generate Thumbnail'}
            </Button>
          </div>

          {imageUrl && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Generated Thumbnail</h3>
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                <img
                  src={imageUrl}
                  alt="Generated thumbnail"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.open(imageUrl, '_blank')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Open Full Size
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
