
import React from 'react';
import { Button } from './ui/button';
import { X } from 'lucide-react';

interface NarrativePaneProps {
  isOpen: boolean;
  title: string;
  content: string;
  onClose: () => void;
}

const NarrativePane: React.FC<NarrativePaneProps> = ({ isOpen, title, content, onClose }) => {
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
          <div className="mt-6 prose prose-slate max-w-none flex-grow overflow-y-auto">
            <p className="text-muted-foreground">{content}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default NarrativePane;