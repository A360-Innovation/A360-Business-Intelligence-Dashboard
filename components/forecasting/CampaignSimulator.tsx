
import React, { useState, useMemo } from 'react';
import { CampaignSimulation } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ChevronDown, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CampaignSimulatorProps {
  simulations: CampaignSimulation[];
}

const CampaignSimulator: React.FC<CampaignSimulatorProps> = ({ simulations }) => {
  const treatments = useMemo(() => [...new Set(simulations.map(s => s.treatment))], [simulations]);
  const campaigns = useMemo(() => [...new Set(simulations.map(s => s.campaign))], [simulations]);

  const [selectedTreatment, setSelectedTreatment] = useState(treatments[0]);
  const [selectedCampaign, setSelectedCampaign] = useState(campaigns[0]);
  const [result, setResult] = useState<CampaignSimulation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSimulate = () => {
    setIsLoading(true);
    const foundSimulation = simulations.find(s => s.treatment === selectedTreatment && s.campaign === selectedCampaign);
    setTimeout(() => {
        setResult(foundSimulation || null);
        setIsLoading(false);
    }, 500);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-primary" />
          Campaign Impact Simulator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Select Treatment</label>
            <div className="relative mt-1">
                <select 
                    value={selectedTreatment}
                    onChange={(e) => setSelectedTreatment(e.target.value)}
                    className="appearance-none w-full bg-secondary border border-transparent rounded-md h-9 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                    {treatments.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Select Campaign Type</label>
             <div className="relative mt-1">
                <select 
                    value={selectedCampaign}
                    onChange={(e) => setSelectedCampaign(e.target.value)}
                    className="appearance-none w-full bg-secondary border border-transparent rounded-md h-9 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                    {campaigns.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
          <Button onClick={handleSimulate} className="w-full" disabled={isLoading}>
            {isLoading ? 'Simulating...' : 'Run Simulation'}
          </Button>
        </div>
        
        {result && !isLoading && (
            <div className="mt-6 pt-4 border-t border-border animate-fade-in">
                <h4 className="font-semibold text-foreground">Simulation Result:</h4>
                <div className="text-center bg-primary/10 p-4 rounded-lg my-2">
                    <p className="text-sm text-primary font-semibold">Predicted Demand Increase</p>
                    <p className="text-4xl font-bold text-primary">+{result.predictedIncrease}%</p>
                </div>
                <p className="text-sm text-muted-foreground italic">{result.summary}</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
};

// Add fade-in animation to tailwind config in index.html if it's not there
// This is just a suggestion, for this app structure we can't edit index.html
// @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
// .animate-fade-in { animation: fade-in 0.5s ease-out; }

export default CampaignSimulator;
