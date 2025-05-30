'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const generateThumbnail = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a description for your thumbnail');
      return;
    }

    try {
      setLoading(true);
      setImageUrl(''); // Clear previous image

      const response = await fetch('/api/generate-thumbnail', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: `Create a YouTube thumbnail image with the following description: ${prompt}. Make it eye-catching, professional, and suitable for YouTube. Include space for text overlay.`
        }),
      });

      // First try to parse the response as JSON
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
      setImageUrl(''); // Clear any partial results
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
