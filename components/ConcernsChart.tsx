import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Concern } from '../types';
import DashboardCard from './DashboardCard';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';

const COLORS = ['hsl(212, 33%, 49%)', 'hsl(211, 35%, 60%)', 'hsl(214, 32%, 74%)', 'hsl(217, 33%, 86%)'];
const DRILLDOWN_COLORS = ['hsl(212, 33%, 39%)', 'hsl(212, 33%, 49%)', 'hsl(211, 35%, 60%)', 'hsl(214, 32%, 74%)'];

interface ConcernsChartProps {
  data: Concern[];
  onSliceClick: (name: string) => void;
}

const ConcernsChart: React.FC<ConcernsChartProps> = ({ data, onSliceClick }) => {
  const [drilldownData, setDrilldownData] = useState<Concern[] | null>(null);
  const [drilldownTitle, setDrilldownTitle] = useState('');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handlePieClick = (entry: Concern) => {
    onSliceClick(entry.name);
    if (entry.breakdown) {
      setDrilldownData(entry.breakdown);
      setDrilldownTitle(`Breakdown of ${entry.name}`);
      setActiveIndex(null); // Reset hover on drilldown
    }
  };

  const handleBack = () => {
    setDrilldownData(null);
    setDrilldownTitle('');
    setActiveIndex(null); // Reset hover on back
  };

  const onPieEnter = (_: unknown, index: number) => {
    setActiveIndex(index);
  };
  
  const onPieLeave = () => {
    setActiveIndex(null);
  };

  const activeData = drilldownData || data;
  const activeTitle = drilldownTitle || "Top Patient Concerns";
  const activeColors = drilldownData ? DRILLDOWN_COLORS : COLORS;
  const hoveredData = activeIndex !== null ? activeData[activeIndex] : null;

  return (
    <DashboardCard
      title={activeTitle}
      tooltipText="Concerns are identified from consultation transcripts using Natural Language Processing (NLP) tagging."
      headerContent={drilldownData && (
        <Button variant="link" size="sm" onClick={handleBack} className="text-sm font-semibold h-auto p-0">
          <ArrowLeft className="mr-1 h-3 w-3" />
          Back to Top-Level
        </Button>
      )}
    >
      <div className="w-full flex flex-col md:flex-row items-center -mt-4 md:h-[350px]">
        {/* Chart Container */}
        <div className="w-full md:w-1/2 h-[250px] md:h-full relative">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <PieChart>
              <Pie
                data={activeData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                paddingAngle={5}
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                onClick={(data) => handlePieClick(data)}
                className="cursor-pointer"
              >
                {activeData.map((_entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={activeColors[index % activeColors.length]}
                    stroke="hsl(var(--card))"
                    strokeWidth={4}
                    style={{ transition: 'opacity 0.2s' }}
                    fillOpacity={activeIndex !== null && activeIndex !== index ? 0.3 : 1}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none text-center transition-opacity duration-200 w-[120px]">
              {hoveredData ? (
                  <>
                      <span className="text-3xl font-bold text-foreground">{hoveredData.value}%</span>
                      <span className="text-xl font-bold text-foreground leading-tight break-words w-full">{hoveredData.name}</span>
                  </>
              ) : (
                   <>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Top Concern</span>
                      <span className="text-xl font-bold text-foreground leading-tight break-words w-full">{activeData[0]?.name}</span>
                   </>
              )}
          </div>
        </div>
        
        {/* Custom Legend Container */}
        <div className="w-full md:w-1/2 flex flex-col justify-center space-y-3 mt-4 md:mt-0 pt-4 md:pt-0 md:pl-6 border-t md:border-t-0 md:border-l border-border">
          {activeData.map((entry, index) => (
            <div
              key={`legend-${index}`}
              className={cn(
                "flex items-center text-sm transition-all duration-200 cursor-pointer transform",
                activeIndex !== null && activeIndex !== index ? "opacity-60" : "opacity-100 scale-105"
              )}
              onMouseEnter={() => onPieEnter(null, index)}
              onMouseLeave={onPieLeave}
              onClick={() => handlePieClick(entry)}
            >
              <span
                className="h-3 w-3 rounded-full mr-3 flex-shrink-0"
                style={{ backgroundColor: activeColors[index % activeColors.length] }}
              ></span>
              <span className="text-muted-foreground flex-1 truncate pr-2">{entry.name}</span>
              <span className="font-semibold text-foreground text-right">
                {entry.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
};

export default ConcernsChart;