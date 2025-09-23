import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from 'recharts';
import { Concern } from '../types';
import DashboardCard from './DashboardCard';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';

interface ConcernsChartProps {
  data: Concern[];
  onSliceClick: (name: string) => void;
}

const COLORS = ['#547BA3', '#7795B9', '#9AB3D0', '#BDD1E6', '#E0EEFA'];
const DRILLDOWN_COLORS = ['#416288', '#324D6A', '#23384C', '#15232D'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card p-2 border border-border rounded shadow-sm">
        <p className="font-semibold text-card-foreground">{`${payload[0].name}: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

const ConcernsChart: React.FC<ConcernsChartProps> = ({ data, onSliceClick }) => {
  const [drilldownData, setDrilldownData] = useState<Concern[] | null>(null);
  const [drilldownTitle, setDrilldownTitle] = useState('');

  const handlePieClick = (entry: any) => {
    onSliceClick(entry.name);
    if (entry.breakdown) {
      setDrilldownData(entry.breakdown);
      setDrilldownTitle(`Breakdown of ${entry.name}`);
    }
  };

  const handleBack = () => {
    setDrilldownData(null);
    setDrilldownTitle('');
  };

  const activeData = drilldownData || data;
  const activeTitle = drilldownTitle || "Patient Concerns";
  const activeColors = drilldownData ? DRILLDOWN_COLORS : COLORS;

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
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <RechartsTooltip content={<CustomTooltip />} />
            <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right" />
            <Pie
              data={activeData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={110}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              onClick={(e) => handlePieClick(e)}
              className="cursor-pointer"
            >
              {activeData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={activeColors[index % activeColors.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
};

export default ConcernsChart;