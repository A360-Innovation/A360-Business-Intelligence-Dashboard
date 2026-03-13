
import React from 'react';

interface ScoreIndicatorProps {
  score: number;
  label: string;
}

const ScoreIndicator: React.FC<ScoreIndicatorProps> = ({ score, label }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  let strokeColor = 'hsl(var(--primary))';
  if (score < 70) strokeColor = 'hsl(var(--warning))';
  if (score < 40) strokeColor = 'hsl(var(--destructive))';

  return (
    <div>
        <svg width="80" height="80" viewBox="0 0 80 80" className="mx-auto">
            <circle
                stroke="hsl(var(--secondary))"
                fill="transparent"
                strokeWidth="6"
                r={radius}
                cx="40"
                cy="40"
            />
            <circle
                stroke={strokeColor}
                fill="transparent"
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                r={radius}
                cx="40"
                cy="40"
                transform="rotate(-90 40 40)"
                style={{ transition: 'stroke-dashoffset 0.3s ease-in-out' }}
            />
            <text x="50%" y="50%" textAnchor="middle" dy=".3em" className="text-xl font-bold fill-current text-foreground">
                {score}
            </text>
        </svg>
        <p className="text-xs text-muted-foreground font-semibold mt-1">{label}</p>
    </div>
  );
};

export default ScoreIndicator;
