import { useFileProcessing } from '@/hooks/useFileProcessing';
import { ImageUploader } from '@/components/ImageUploader';
import { KeywordInput } from '@/components/KeywordInput';
import { AIInstructionsInput } from '@/components/AIInstructionsInput';
import { ImagePreview } from '@/components/ImagePreview';
import { DownloadButton } from '@/components/DownloadButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';


function App() {
  
  const {
    uploadedFiles,
    keywords,
    aiInstructions,
    processedImages,
    isProcessing,
    error,
    handleFileUpload,
    handleKeywordsChange,
    handleAiInstructionsChange,
    removeImageByIndex: originalRemoveImageByIndex,
    clearAll: originalClearAll
  } = useFileProcessing();

  const handleRemoveImage = (index: number) => {
    const imageName = processedImages[index]?.originalFile.name || 'Image';
    originalRemoveImageByIndex(index);
    toast.error(`${imageName} removed.`, {
      action: {
        label: 'Dismiss',
        onClick: () => toast.dismiss()
      }
    });
  };

  const handleClearAll = () => {
    const hadImages = processedImages.length > 0;
    originalClearAll();
    if (hadImages) {
      toast.success("Cleared all images and keywords.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-10 py-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">SEO Image Renamer</h1>
            <p className="text-sm text-muted-foreground">Rename images for better SEO</p>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Controls</CardTitle>
                <CardDescription>Upload images and enter keywords</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ImageUploader 
                  onFileUpload={handleFileUpload} 
                  error={error} 
                  fileCount={uploadedFiles.length} 
                />
                
                <KeywordInput 
                  value={keywords} 
                  onChange={handleKeywordsChange} 
                />
                
                <AIInstructionsInput
                  value={aiInstructions}
                  onChange={handleAiInstructionsChange}
                />
                
                <div className="flex flex-col gap-4">
                  <DownloadButton 
                    images={processedImages}
                    zipFilename="renamed-images.zip" 
                  />
                  
                  <Button 
                    variant="outline"
                    onClick={handleClearAll}
                    disabled={isProcessing || processedImages.length === 0}
                    className="w-full"
                  >
                    Clear All
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How to Use</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 list-decimal list-inside text-sm text-muted-foreground">
                  <li>Select images using the button above.</li>
                  <li>Enter descriptive SEO keywords.</li>
                  <li>Optionally add AI instructions for processing.</li>
                  <li>Preview the new filenames.</li>
                  <li>Click the (X) on a preview to remove it.</li>
                  <li>Download the renamed images as a ZIP.</li>
                </ol>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <ImagePreview 
              images={processedImages} 
              onRemoveImage={handleRemoveImage}
            />
          </div>
        </div>
      </main>
      
      <footer className="py-4 border-t border-border mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} SEO Image Renamer
        </div>
      </footer>
      
      <Toaster richColors />
    </div>
  );
}

export default App;
