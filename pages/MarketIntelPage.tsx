import React from 'react';
import { marketIntelData } from '../data/marketIntelData';
import CompetitorPricingTable from '../components/market/CompetitorPricingTable';
import SocialMediaTrends from '../components/market/SocialMediaTrends';
import ShareOfVoiceChart from '../components/market/ShareOfVoiceChart';
import TopSearchTerms from '../components/market/TopSearchTerms';

const MarketIntelPage: React.FC = () => {
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">Market Intelligence & Competition</h1>
                <p className="text-muted-foreground mt-1">Analyze your position in the local market and stay ahead of trends.</p>
            </header>
            <main className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <CompetitorPricingTable data={marketIntelData.competitorPricing} />
                    <ShareOfVoiceChart data={marketIntelData.shareOfVoice} />
                </div>
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SocialMediaTrends data={marketIntelData.socialTrends} />
                    <TopSearchTerms data={marketIntelData.topSearchTerms} />
                </div>
            </main>
        </div>
    );
};

export default MarketIntelPage;
