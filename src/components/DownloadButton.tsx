import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { ProcessedImage } from '@/hooks/useFileProcessing';
import { createAndDownloadZip } from '@/lib/zipUtils';
import { toast } from 'sonner';
import { Download } from 'lucide-react';

interface DownloadButtonProps {
  images: ProcessedImage[];
  zipFilename?: string;
}

export function DownloadButton({ images, zipFilename = 'renamed-images.zip' }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleDownload = async () => {
    if (images.length === 0) {
      setError('No images to download');
      return;
    }

    setIsDownloading(true);
    setError(null);
    setProgress(10); // Initial progress
    const downloadToastId = toast.loading('Preparing download...');

    try {
      // Simulate progress for better UX (actual zipping is usually quick)
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 10;
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 200);

      // Create and download the ZIP file
      await createAndDownloadZip(images, zipFilename);
      
      // Clean up and finish progress
      clearInterval(progressInterval);
      setProgress(100);
      
      toast.success('Download complete!', { id: downloadToastId });

      // Reset after a short delay
      setTimeout(() => {
        setProgress(0);
        setIsDownloading(false);
      }, 1000);
    } catch (err) {
      toast.error('Failed to create ZIP file', { id: downloadToastId });
      console.error('Download error:', err);
      setIsDownloading(false);
      setProgress(0);
    }
  };

  const isReady = images.length > 0;

  return (
    <div className="space-y-4">
      <Button 
        onClick={handleDownload} 
        disabled={isDownloading || !isReady}
        className={`w-full ${isReady ? 'bg-green-600 hover:bg-green-700' : ''}`}
      >
        {isDownloading ? 'Downloading...' : (
          <span className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            {`Download ${images.length} Image${images.length !== 1 ? 's' : ''}`}
          </span>
        )}
      </Button>
      
      {isDownloading && progress > 0 && progress < 100 && (
        <Progress value={progress} className="h-2" />
      )}
      
      {error && !isDownloading && (
        <Alert variant="destructive" className="mt-2">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
} 