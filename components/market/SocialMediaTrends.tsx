
import React from 'react';
import { SocialTrend } from '../../types';
import { cn } from '../../lib/utils';
import DashboardCard from '../DashboardCard';

interface SocialMediaTrendsProps {
  data: SocialTrend[];
}

const platformStyles = {
    TikTok: 'bg-black text-white border-black',
    Instagram: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent'
};

const SocialMediaTrends: React.FC<SocialMediaTrendsProps> = ({ data }) => {
    return (
        <DashboardCard
            title="Social Media Buzz"
            tooltipText="Detect the latest trends and conversation topics on social media to create relevant and timely marketing campaigns."
            className="h-full"
        >
            <div className="space-y-4">
                {data.map(trend => (
                    <div key={trend.name} className="flex items-start gap-3">
                        <div>
                            <h4 className="font-semibold text-foreground flex items-center">{trend.name}
                              <span className={cn("ml-2 text-xs font-semibold px-2 py-0.5 rounded-full border", platformStyles[trend.platform])}>
                                {trend.platform}
                              </span>
                            </h4>
                            <p className="text-sm text-muted-foreground mt-0.5">{trend.summary}</p>
                        </div>
                    </div>
                ))}
            </div>
        </DashboardCard>
    );
};

export default SocialMediaTrends;
