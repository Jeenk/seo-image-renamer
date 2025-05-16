// Using Google's Gemini API for generating SEO-friendly filenames
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_PROJECT_ID = import.meta.env.VITE_GEMINI_PROJECT_ID;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/projects/${GEMINI_PROJECT_ID}/models/gemini-pro:generateContent`;

if (!GEMINI_API_KEY || !GEMINI_PROJECT_ID) {
  console.warn('Google Gemini API configuration missing. Please set both VITE_GEMINI_API_KEY and VITE_GEMINI_PROJECT_ID in your .env file');
}

/**
 * Generate SEO-optimized filenames based on keywords and additional instructions
 * @param keywords - User provided keywords
 * @param count - Number of filenames to generate
 * @returns Array of SEO-optimized filenames without extensions
 */
export async function generateHumanLikeFilenames(
  keywords: string,
  count: number = 4,
  _aiInstructions: string = ''
): Promise<string[]> {
  if (!keywords.trim()) {
    return Array(count).fill('image'); // Default fallback if no keywords
  }

  try {
    // Create a prompt for the AI model
    const prompt = `Generate exactly ${count} SEO-optimized, human-friendly image filenames based on these keywords: "${keywords}".

Guidelines:
- Create unique, descriptive filenames
- Use hyphens to separate words (no spaces or underscores)
- Keep it under 60 characters per filename
- Make it sound natural and human-readable
- No file extensions or special characters except hyphens
- Each filename should be on a new line
- Only output the filenames, nothing else

Example for "coffee shop":
cozy-coffee-shop-interior
barista-making-espresso
coffee-beans-background
modern-cafe-ambiance

Filenames for "${keywords}":`;

    if (!GEMINI_API_KEY || !GEMINI_PROJECT_ID) {
      throw new Error('Google Gemini API configuration missing');
    }

    // Call Google Gemini API
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GEMINI_API_KEY}`,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 200,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Gemini API Error:', error);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json();
    const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Parse the response into an array of filenames
    let filenames: string[] = generatedText
      .split('\n')
      .map((name: string) => name.trim())
      .filter((name: string) => name.length > 0 && !name.startsWith('```') && !name.endsWith('```'))
      .map((name: string) => {
        // Clean up the filename
        return name
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')  // Remove special characters except spaces and hyphens
          .replace(/\s+/g, '-')      // Replace spaces with hyphens
          .replace(/--+/g, '-')      // Replace multiple hyphens with single hyphen
          .replace(/^-+|-+$/g, '')   // Remove leading/trailing hyphens
          .trim();
      })
      .filter((name: string) => name.length > 0 && name !== 'f' && name !== 'filenames:'); // Remove any empty strings or common artifacts

    // If we don't have enough filenames, generate some fallback ones
    if (filenames.length < count) {
      const fallbackCount = count - filenames.length;
      const fallbackFilenames = await generateFallbackFilenames(keywords, fallbackCount);
      filenames = [...filenames, ...fallbackFilenames];
    }

    // Make sure we have exactly the requested number of unique filenames
    const uniqueFilenames = [...new Set(filenames)];
    while (uniqueFilenames.length < count) {
      uniqueFilenames.push(`${keywords.toLowerCase().replace(/\s+/g, '-')}-${uniqueFilenames.length + 1}`);
    }

    return uniqueFilenames.slice(0, count);
  } catch (error) {
    console.error('Error generating filenames with AI:', error);
    // Fallback to basic names if AI fails
    return generateFallbackFilenames(keywords, count);
  }
}

/**
 * Generate fallback filenames when AI generation fails
 */
async function generateFallbackFilenames(keywords: string, count: number): Promise<string[]> {
  if (!keywords.trim()) {
    return Array(count).fill('image');
  }
  
  const baseName = keywords
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  return Array(count)
    .fill(0)
    .map((_, i) => `${baseName}-${i + 1}`);
}

/**
 * Shuffle an array using the Fisher-Yates algorithm
 * Used to randomize filename assignments
 */
export function shuffleArray<T>(array: T[]): T[] {
  if (!array || array.length <= 1) return array;
  
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
