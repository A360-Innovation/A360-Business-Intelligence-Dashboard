
import React from 'react';
import { CompetitorPricing } from '../../types';
import { cn } from '../../lib/utils';
import DashboardCard from '../DashboardCard';

interface CompetitorPricingTableProps {
  data: CompetitorPricing[];
}

const CompetitorPricingTable: React.FC<CompetitorPricingTableProps> = ({ data }) => {
    return (
        <DashboardCard
            title="Local Competitor Pricing"
            tooltipText="Compare your prices with the local market average to identify pricing adjustment opportunities and competitive positioning."
        >
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-border text-left text-muted-foreground">
                            <th className="font-semibold p-2">Treatment</th>
                            <th className="font-semibold p-2 text-center">Our Price</th>
                            <th className="font-semibold p-2 text-center">Competitor Avg.</th>
                            <th className="font-semibold p-2 text-right">Market Range</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => {
                            const isFavorable = item.ourPrice < item.competitorAvg;
                            return (
                            <tr key={item.treatment} className="border-b border-border last:border-b-0">
                                <td className="p-2 font-medium text-foreground">{item.treatment}</td>
                                <td className="p-2 text-center font-bold text-primary">${item.ourPrice.toFixed(2)}</td>
                                <td className={cn("p-2 text-center", isFavorable ? 'text-success' : 'text-destructive')}>
                                    ${item.competitorAvg.toFixed(2)}
                                </td>
                                <td className="p-2 text-right text-muted-foreground">{item.marketRange}</td>
                            </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </DashboardCard>
    );
};

export default CompetitorPricingTable;
