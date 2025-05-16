import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface ProcessedImage {
  originalFile: File;
  newFilename: string;
  previewUrl: string;
}

/**
 * Creates a ZIP file containing all processed images with their new filenames
 * and initiates download
 */
export async function createAndDownloadZip(
  processedImages: ProcessedImage[], 
  zipFilename: string = 'renamed-images.zip'
): Promise<void> {
  // Return early if no images provided
  if (!processedImages.length) {
    throw new Error('No images to zip');
  }

  try {
    // Initialize JSZip
    const zip = new JSZip();
    
    // Add each file to the zip with its new filename
    processedImages.forEach(({ originalFile, newFilename }) => {
      zip.file(newFilename, originalFile);
    });
    
    // Generate the ZIP file as a blob
    const zipBlob = await zip.generateAsync({ 
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 } // Balanced compression (0-9)
    });
    
    // Trigger file download
    saveAs(zipBlob, zipFilename);
  } catch (error) {
    console.error('Error creating ZIP file:', error);
    throw error;
  }
} 