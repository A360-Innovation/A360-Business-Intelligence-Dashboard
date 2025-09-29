import React from 'react';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Loader from './icons/Loader';

interface NarrativePaneProps {
  isOpen: boolean;
  title: string;
  content: string;
  onClose: () => void;
}

const NarrativePane: React.FC<NarrativePaneProps> = ({ isOpen, title, content, onClose }) => {
  // Fix for common markdown formatting issues from API responses
  const formatContent = (c: string): string => {
    if (c === 'loading') {
      return c;
    }
    // Process each line to fix common markdown heading issues.
    return c.split('\n').map(line => {
        // Trim whitespace from the start of the line.
        const trimmedLine = line.trimStart();
        // Match lines that start with one or more '#' characters.
        const match = trimmedLine.match(/^(#+)(.*)/);
        if (match) {
            const hashes = match[1]; // The '#' characters
            const content = match[2].trim(); // The heading text
            return `${hashes} ${content}`; // Reconstruct with a single space
        }
        return line; // Return original line if it's not a heading
    }).join('\n');
  };

  const formattedContent = formatContent(content);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-foreground/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      ></div>

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-card shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center pb-4 border-b border-border">
            <h2 className="text-xl font-bold text-foreground">{title}</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-4 flex-grow overflow-y-auto prose prose-sm max-w-none text-muted-foreground
            prose-p:leading-loose prose-p:my-6
            prose-ul:my-6 prose-ul:list-disc prose-ul:pl-5 prose-ul:space-y-4
            prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-5 prose-ol:space-y-4
            prose-li:marker:text-primary
            prose-headings:font-semibold prose-headings:text-foreground
            prose-h1:text-xl prose-h1:font-bold prose-h1:mt-8 prose-h1:mb-6 prose-h1:pb-2 prose-h1:border-b prose-h1:border-border prose-h1:first:mt-0
            prose-h2:text-lg prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-6 prose-h2:first:mt-0
            prose-h3:text-base prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-4
            prose-strong:font-bold prose-strong:text-foreground
            prose-a:text-primary hover:prose-a:text-primary/80
            prose-blockquote:mt-6 prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:bg-secondary/50 prose-blockquote:text-foreground/90
            prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:text-sm">
            {content === 'loading' ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                <Loader />
                <p>Generating analysis with AI...</p>
              </div>
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{formattedContent}</ReactMarkdown>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NarrativePane;