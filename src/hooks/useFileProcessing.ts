import { useState, useEffect } from 'react';
import { generateFilename } from '@/lib/filenameGenerator';
import { generateHumanLikeFilenames, shuffleArray } from '@/lib/geminiService';

export interface ProcessedImage {
  originalFile: File;
  newFilename: string;
  previewUrl: string;
}

export function useFileProcessing() {
  // State for uploaded files, keywords, and processed images
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [keywords, setKeywords] = useState<string>('');
  const [aiInstructions, setAiInstructions] = useState<string>('');
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Handle file upload
  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    setError(null);
    
    // Convert FileList to array and filter for image files
    const fileArray = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    if (fileArray.length === 0) {
      setError('No valid image files selected');
      return;
    }
    
    // Append new files to existing ones, or replace if needed (currently replaces)
    setUploadedFiles(fileArray);
  };
  
  // Handle keywords change
  const handleKeywordsChange = (value: string) => {
    setKeywords(value);
  };

  // Handle AI instructions change
  const handleAiInstructionsChange = (value: string) => {
    setAiInstructions(value);
  };
  
  // Function to remove an image by index
  const removeImageByIndex = (indexToRemove: number) => {
    // Find the image to remove to revoke its URL
    const imageToRemove = processedImages[indexToRemove];
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.previewUrl);
    }

    // Update uploaded files state
    setUploadedFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    // The useEffect will automatically update processedImages
  };
  
  // Clear all data
  const clearAll = () => {
    processedImages.forEach(image => {
      URL.revokeObjectURL(image.previewUrl);
    });
    setUploadedFiles([]);
    setKeywords('');
    setAiInstructions('');
    setProcessedImages([]);
    setError(null);
  };

  // Process files when uploadedFiles, keywords or AI instructions change
  useEffect(() => {
    // Revoke previous object URLs before processing new ones
    const urlsToRevoke = processedImages.map(img => img.previewUrl);

    if (uploadedFiles.length === 0) {
      setProcessedImages([]); // Clear processed images if no files are uploaded
      urlsToRevoke.forEach(url => URL.revokeObjectURL(url)); // Revoke URLs when clearing
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    let processed: ProcessedImage[] = [];

    // Generate filenames with Gemini AI
    const generateFilenames = async () => {
      try {
        // Create preview URLs for all files
        const previewUrls = uploadedFiles.map(file => URL.createObjectURL(file));
        
        // Generate human-like filenames using Gemini
        let filenames: string[] = [];
        
        if (keywords.trim()) {
          // Try to get AI-generated filenames
          filenames = await generateHumanLikeFilenames(
            keywords,
            aiInstructions,
            uploadedFiles.length
          );
          
          // Randomly assign the filenames to images
          filenames = shuffleArray(filenames);
        }
        
        // Process each file with its new filename
        processed = uploadedFiles.map((file, index) => {
          // Get file extension
          const fileExtension = file.name.split('.').pop() || '';
          
          // Use AI-generated name or fall back to basic name generator
          const newFilename = filenames[index] 
            ? `${filenames[index]}.${fileExtension}` 
            : generateFilename(file, keywords, index);
          
          return { originalFile: file, newFilename, previewUrl: previewUrls[index] };
        });
        
        setProcessedImages(processed);
      } catch (err) {
        setError('Error processing images');
        console.error('Error processing images:', err);
        
        // Fall back to basic filename generator
        processed = uploadedFiles.map((file, index) => {
          const newFilename = generateFilename(file, keywords, index);
          const previewUrl = URL.createObjectURL(file);
          return { originalFile: file, newFilename, previewUrl };
        });
        
        setProcessedImages(processed);
      } finally {
        setIsProcessing(false);
        // Revoke URLs from the *previous* state after the new state is set
        urlsToRevoke.forEach(url => URL.revokeObjectURL(url));
      }
    };

    // Start the async filename generation
    generateFilenames();

    // Cleanup function: Revoke URLs of the *current* state when effect re-runs or unmounts
    return () => {
      processed.forEach(image => URL.revokeObjectURL(image.previewUrl));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedFiles, keywords, aiInstructions]); // Rerun when files, keywords, or AI instructions change

  return {
    uploadedFiles,
    keywords,
    aiInstructions,
    processedImages,
    isProcessing,
    error,
    handleFileUpload,
    handleKeywordsChange,
    handleAiInstructionsChange,
    removeImageByIndex,
    clearAll
  };
} 