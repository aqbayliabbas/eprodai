import { FileImage } from "lucide-react";

export function Hero() {
  return (
    <div className="relative bg-gradient-to-b from-primary/10 to-background pt-20 pb-10 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="inline-block rounded-lg bg-primary/10 p-3 text-primary">
            <FileImage className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            YouTube Thumbnail Generator
          </h1>
          <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Create eye-catching YouTube thumbnails in seconds with AI. Upload reference images, customize your text, and download your perfect thumbnail.
          </p>
        </div>
      </div>
    </div>
  );
}