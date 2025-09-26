
import React from 'react';
import { demandForecastData, emergingConcernsData, campaignSimulations } from '../data/forecastingData';
import DemandForecastChart from '../components/forecasting/DemandForecastChart';
import EmergingConcerns from '../components/forecasting/EmergingConcerns';
import CampaignSimulator from '../components/forecasting/CampaignSimulator';

const ForecastingPage: React.FC = () => {
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">Forecasting & Future Trends</h1>
                <p className="text-muted-foreground mt-1">Anticipate patient demand and emerging market interests to stay ahead.</p>
            </header>
            <main className="space-y-6">
                <DemandForecastChart data={demandForecastData} />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <EmergingConcerns concerns={emergingConcernsData} />
                    </div>
                    <div>
                        <CampaignSimulator simulations={campaignSimulations} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ForecastingPage;
