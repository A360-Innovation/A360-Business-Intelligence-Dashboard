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
  const formatContent = (c: string): string => {
    if (!c || c === 'loading') {
      return c;
    }
  
    let text = c;
    let sources: string[] = [];
  
    // --- Phase 1: Deep Cleaning & Source Extraction ---
    // Unified regex to capture UUIDs from various formats like [t:...], (t:...), Int:...
    // It also handles both standard hyphens and en-dashes (–).
    const allEvidenceRegex = /(?:\[t:|\(t:|\bInt:)([a-f0-9-–]+)/g;
    
    // Extract all matching IDs into the sources array
    const matches = Array.from(text.matchAll(allEvidenceRegex));
    if (matches.length > 0) {
      sources = matches.map(match => match[1]);
    }

    // Now, remove all known evidence patterns from the text to clean it up.
    // This is done separately to robustly handle variations in surrounding characters.
    text = text.replace(/\[t:[a-f0-9-–]+\]/g, '');
    text = text.replace(/\(t:[a-f0-9-–]+\)/g, '');
    text = text.replace(/\bInt:[a-f0-9-–]+\b/g, '');
    
    text = text.replace(/Group\)Patients/g, 'Group) Patients');
  
    // --- Phase 2: Intelligent Splitting ---
    // Fix run-on words (e.g., "end.Start" -> "end. Start")
    text = text.replace(/([a-z0-9.,?"'\)])([A-Z])/g, '$1 $2');
    text = text.replace(/([a-z0-9.,?"'\)])([A-Z])/g, '$1 $2'); // Run twice
  
    // Fix run-on numbered lists (e.g., "wrinkles.2. Volume Loss")
    text = text.replace(/(\.)(\d+\.\s)/g, '$1\n\n$2');
  
    // Keywords that should start a new major section (heading)
    const majorSectionKeywords = [
        'Headline', 'Body', 'Opportunity Snapshot', 'Ranked Opportunities', 
        'Ranked Concerns', 'Ranked List', 'Direct Answer', 'Red Flags to Avoid',
        'Special Summer Offer', 'Call to Action', 'Hashtags',
        'Summary of Key Patient Concerns'
    ];
    // Keywords that should be bullet points
    const listItemKeywords = [
        'Product/Service', 'Relevance', 'Consultation trigger', 'Introduction script', 
        'Example from Data', 'Clinical justification', 'Frequency missed', 'Frequency', 
        'Revenue impact', 'Evidence', 'Success indicators', 'Why it matters', 
        'Micro-script solution', 'When to use', 'Impact', 'Should have said', 'Expected outcome'
    ];
  
    // Insert newlines before keywords to create structure
    const allKeywords = [...majorSectionKeywords, ...listItemKeywords];
    const keywordRegex = new RegExp(`(?<!\n)\\s*(${allKeywords.join('|')})`, 'g');
    text = text.replace(keywordRegex, '\n\n$1');
  
    // --- Phase 3: Markdown Conversion & Final Cleanup ---
    // First, clean up all asterisks used incorrectly for emphasis or as separators.
    text = text.replace(/\*\*(.*?)\*\*/g, '$1'); // Replace **Word** with just Word
    text = text.replace(/\s*\*\s*/g, ' '); // " * " -> " "
    text = text.replace(/\*$/gm, ''); // trailing * at end of line
    text = text.replace(/\.\*/g, '.'); // .* -> .
    text = text.replace(/:\*/g, ':'); // :* -> :
    text = text.replace(/\* /g, ' '); // "* " -> " "
    text = text.replace(/\*/g, ''); // Remove any remaining asterisks

    // Now, apply correct Markdown formatting
    text = text.split('\n').map(line => {
        line = line.trim();
        if (!line) return line;

        // Convert major sections to headings
        const majorKeywordMatch = majorSectionKeywords.find(kw => line.startsWith(kw));
        if (majorKeywordMatch) {
            const restOfLine = line.substring(majorKeywordMatch.length).replace(/^:\s*/, '').trim();
            return `### ${majorKeywordMatch}\n${restOfLine}`;
        }

        // Convert list items to bullets with bolded keywords
        const listItemKeywordMatch = listItemKeywords.find(kw => line.startsWith(kw));
        if (listItemKeywordMatch) {
            const restOfLine = line.substring(listItemKeywordMatch.length).replace(/^:\s*/, '').trim();
            return `\n- **${listItemKeywordMatch}:** ${restOfLine}`;
        }
        
        // Handle numbered lists that might have been missed
        if (line.match(/^\d+\.\s/)) {
            return `\n${line}`;
        }

        return line;
    }).join('\n');
  
    // --- Phase 4: Final Polishing ---
    text = text.replace(/\n{3,}/g, '\n\n').trim(); // Collapse extra newlines
    
    // --- Phase 5: Append Sources ---
    if (sources.length > 0) {
        const uniqueSources = [...new Set(sources)];
        text += `\n\n### Sources\n${uniqueSources.map(s => `- \`${s}\``).join('\n')}`;
    }

    return text;
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