import { useState, useRef } from 'react';
import type { DragEvent, ChangeEvent } from 'react'; // Use type-only imports
import { Button } from '@/components/ui/button'; // Button might not be needed anymore
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UploadCloud } from 'lucide-react';
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  onFileUpload: (files: FileList | null) => void;
  error: string | null;
  fileCount: number;
}

export function ImageUploader({ onFileUpload, error, fileCount }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    onFileUpload(e.target.files);
  };

  const handleSelectFilesClick = () => {
    fileInputRef.current?.click();
  };

  // Drag and Drop Handlers
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target === e.currentTarget) {
       setIsDragging(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
     setIsDragging(true);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFileUpload(files);
       if (fileInputRef.current) {
         fileInputRef.current.value = "";
       }
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="file-upload">Upload Images</Label>
      <div
        className={cn(
          "relative flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
          isDragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/50",
          error ? "border-destructive" : ""
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleSelectFilesClick} // Allow clicking the area too
      >
        <Input
          ref={fileInputRef}
          id="file-upload"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="sr-only" // Hide the default input visually but keep it accessible
        />
        <div className="text-center space-y-2">
           <UploadCloud className={cn("mx-auto h-10 w-10", isDragging ? "text-primary" : "text-muted-foreground")} />
          <p className="font-semibold">
            {isDragging ? "Drop images here" : "Drag & drop images or click to select"}
          </p>
          <p className="text-xs text-muted-foreground">
            {fileCount > 0 ? `${fileCount} image${fileCount !== 1 ? 's' : ''} selected` : "Supports multiple image files"}
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
} 