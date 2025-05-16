# SEO Image Renamer

A modern web application to quickly rename image files for better SEO and download them as a ZIP file.

## Features

- Drag and drop or select multiple images
- Generate SEO-friendly filenames based on provided keywords
- Preview original and renamed files
- Download all renamed images as a ZIP file
- Modern UI with dark mode support

## Tech Stack

- React with TypeScript
- Vite for fast development and building
- Tailwind CSS for styling
- ShadCN UI for customizable UI components
- JSZip for ZIP file creation
- File-Saver for downloading files

## Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm (v10+)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/seo-image-renamer.git
   cd seo-image-renamer
   ```

2. Install dependencies
   ```bash
   pnpm install
   ```

3. Start the development server
   ```bash
   pnpm run dev
   ```

4. Build for production
   ```bash
   pnpm run build
   ```

## How to Use

1. Open the application in your browser
2. Click "Select Images" to upload your image files
3. Enter keywords that describe your images in the SEO Keywords field
4. Preview the renamed files in the right panel
5. Click "Download Renamed Images" to get a ZIP file with all renamed images
6. Use "Clear All" to start over with new images

## License

MIT

## Acknowledgements

- [ShadCN UI](https://ui.shadcn.com/) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [JSZip](https://stuk.github.io/jszip/) for ZIP file creation in the browser
- [File-Saver](https://github.com/eligrey/FileSaver.js/) for client-side file downloads
