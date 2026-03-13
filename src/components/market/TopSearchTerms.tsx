
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import DashboardCard from '../DashboardCard';

interface TopSearchTermsProps {
  data: string[];
}

const TopSearchTerms: React.FC<TopSearchTermsProps> = ({ data }) => {
    return (
        <DashboardCard
            title="Top Local Search Terms"
            tooltipText="Discover what potential patients are searching for online to optimize your SEO and web content strategy."
            className="h-full"
        >
            <ul className="space-y-2">
                {data.map((term, index) => (
                    <li key={index} className="flex items-center text-sm">
                        <span className="text-muted-foreground font-semibold w-6">{index + 1}.</span>
                        <span className="text-foreground bg-secondary px-2 py-1 rounded-md">{term}</span>
                    </li>
                ))}
            </ul>
        </DashboardCard>
    );
};

export default TopSearchTerms;
