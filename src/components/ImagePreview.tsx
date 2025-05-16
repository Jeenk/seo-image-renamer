import type { ProcessedImage } from '@/hooks/useFileProcessing';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { FileImage, X } from 'lucide-react';

interface ImagePreviewProps {
  images: ProcessedImage[];
  onRemoveImage: (index: number) => void;
}

export function ImagePreview({ images, onRemoveImage }: ImagePreviewProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Preview</CardTitle>
        <CardDescription>
          {images.length > 0 
            ? `Showing ${images.length} image${images.length !== 1 ? 's' : ''} with new filenames.`
            : "Upload images and enter keywords to see a preview."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto">
        {images.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-64 border-2 border-dashed border-border rounded-lg">
            <FileImage className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Image previews will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <Card key={index} className="overflow-hidden relative group">
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 z-10 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onRemoveImage(index)}
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </Button>

                <CardContent className="p-0">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={image.previewUrl}
                      alt={`Preview of ${image.newFilename}`}
                      className="object-cover w-full h-full transition-transform group-hover:scale-105"
                    />
                  </div>
                </CardContent>
                <div className="p-2 text-xs border-t bg-background/80">
                  <div className="truncate">
                    <span className="font-medium text-muted-foreground">Original: </span>
                    {image.originalFile.name}
                  </div>
                  <div className="truncate">
                    <span className="font-medium">New: </span>
                    {image.newFilename}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 