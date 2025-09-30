import React from 'react';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Loader from './icons/Loader';
import { cn } from '../lib/utils';

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
  
    let formattedText = c;

    // Specific formatting for "Opportunity Snapshot"
    if (formattedText.includes('Opportunity Snapshot')) {
      // Main Headers
      formattedText = formattedText
        .replace(/Opportunity Snapshot:/g, '## Opportunity Snapshot')
        .replace(/Ranked Opportunities:/g, '### Ranked Opportunities');
      
      // Numbered list for each opportunity
      formattedText = formattedText.replace(/(\d+)\. (Product\/Service:)/g, '\n\n$1. **$2**');
      
      // Key-value pairs within each opportunity
      const labels = [
        "Relevance", "Consultation trigger", "Introduction script",
        "Clinical justification", "Frequency missed", "Revenue impact",
        "Success indicators"
      ];
      
      labels.forEach(label => {
        const regex = new RegExp(`(\\*)?\\s*(${label}):`, 'gi');
        formattedText = formattedText.replace(regex, '\n- **$2:**');
      });
      
      return formattedText;
    }

    // Default formatting for other content (e.g., fixing headings)
    return c.split('\n').map(line => {
        const trimmedLine = line.trimStart();
        const match = trimmedLine.match(/^(#+)(.*)/);
        if (match) {
            const hashes = match[1];
            const contentText = match[2].trim();
            return `${hashes} ${contentText}`;
        }
        return line;
    }).join('\n');
  };

  const formattedContent = formatContent(content);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClick={onClose}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"></div>

      {/* Modal Panel */}
      <div
        className={cn(
          "relative w-full max-w-4xl max-h-[90vh] bg-card rounded-xl shadow-xl transform transition-all duration-300 overflow-hidden",
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        )}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center pb-4 border-b border-border flex-shrink-0">
            <h2 className="text-xl font-bold text-foreground">{title}</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-4 flex-grow min-w-0 overflow-y-auto pb-5 prose max-w-none 
            prose-p:leading-relaxed prose-p:my-4 prose-p:break-words
            prose-ul:my-4 prose-ul:list-disc prose-ul:pl-5 prose-ul:space-y-2 
            prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-5 prose-ol:space-y-2 
            prose-li:marker:text-primary prose-li:break-words
            prose-headings:font-semibold prose-headings:text-foreground 
            prose-h1:text-xl prose-h1:font-bold prose-h1:mt-6 prose-h1:mb-4 prose-h1:pb-2 prose-h1:border-b prose-h1:border-border prose-h1:first:mt-0 
            prose-h2:text-lg prose-h2:font-bold prose-h2:mt-6 prose-h2:mb-4 prose-h2:first:mt-0 
            prose-h3:text-base prose-h3:font-semibold prose-h3:mt-4 prose-h3:mb-2 
            prose-strong:font-bold prose-strong:text-foreground 
            prose-a:text-primary hover:prose-a:underline 
            prose-blockquote:my-4 prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:bg-secondary/50 prose-blockquote:text-foreground/90 
            prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:text-sm
            prose-table:w-full prose-table:my-4 prose-table:border-collapse 
            prose-thead:border-b prose-thead:border-border 
            prose-th:p-2 prose-th:text-left prose-th:font-semibold prose-th:text-foreground 
            prose-tbody:divide-y prose-tbody:divide-border 
            prose-tr:hover:bg-secondary/50 
            prose-td:p-2">
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
    </div>
  );
};

export default NarrativePane;
