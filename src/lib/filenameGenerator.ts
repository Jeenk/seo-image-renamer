/**
 * Generates SEO-friendly filenames from original files and keywords
 */
export function generateFilename(originalFile: File, keywords: string, index: number): string {
  // Extract file extension from the original file
  const fileExtension = originalFile.name.split('.').pop() || '';
  
  // Sanitize keywords: remove special characters, replace spaces with hyphens, convert to lowercase
  const sanitizedKeywords = keywords
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-')     // Replace multiple spaces with a single hyphen
    .trim();                  // Remove leading/trailing whitespace
  
  // If no keywords provided, use the sanitized original filename without extension
  if (!sanitizedKeywords) {
    const originalNameWithoutExtension = originalFile.name
      .substring(0, originalFile.name.lastIndexOf('.'))
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
    
    return `${originalNameWithoutExtension}-${index}.${fileExtension}`;
  }
  
  // Combine keywords with index to ensure uniqueness
  return `${sanitizedKeywords}-${index}.${fileExtension}`;
} 