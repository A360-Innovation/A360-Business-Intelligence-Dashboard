import { ForecastDataPoint, EmergingConcern, CampaignSimulation } from '../types';

export const demandForecastData: ForecastDataPoint[] = [
    { month: 'Apr', Botox: 120, Fillers: 95, Peel: 60 },
    { month: 'May', Botox: 135, Fillers: 102, Peel: 72 },
    { month: 'Jun', Botox: 142, Fillers: 106, Peel: 75 },
    { month: 'Jul', Botox: 130, Fillers: 98, Peel: 68 },
    { month: 'Aug', Botox: 138, Fillers: 105, Peel: 77 },
    { month: 'Sep', Botox: 140, Fillers: 110, Peel: 80 },
    // Forecasted Data
    { month: 'Oct', Botox_forecast: 145, Fillers_forecast: 115, Peel_forecast: 85 },
    { month: 'Nov', Botox_forecast: 150, Fillers_forecast: 120, Peel_forecast: 90 },
    { month: 'Dec', Botox_forecast: 165, Fillers_forecast: 130, Peel_forecast: 100 },
    { month: 'Jan', Botox_forecast: 155, Fillers_forecast: 125, Peel_forecast: 95 },
    { month: 'Feb', Botox_forecast: 160, Fillers_forecast: 128, Peel_forecast: 98 },
    { month: 'Mar', Botox_forecast: 170, Fillers_forecast: 135, Peel_forecast: 105 },
];

export const emergingConcernsData: EmergingConcern[] = [
    { name: "Jawline Slimming (Masseter Botox)", growth: 45, summary: "Increasing requests for facial slimming and teeth grinding solutions." },
    { name: "Bio-remodeling Agents (e.g., Profhilo)", growth: 30, summary: "Patients are asking about injectable skincare for hydration and skin quality." },
    { name: "Preventative 'Baby Botox'", growth: 25, summary: "Younger demographics (25-30) are seeking preventative treatments." },
    { name: "Non-Invasive Body Contouring", growth: 18, summary: "Interest is growing in treatments for small, stubborn fat pockets." },
];

export const campaignSimulations: CampaignSimulation[] = [
    { treatment: 'Botox', campaign: '20% Discount', predictedIncrease: 25, summary: 'A 20% discount is projected to significantly boost bookings, especially among new patients, but may slightly lower profit margins per treatment.' },
    { treatment: 'Botox', campaign: 'Social Media Push', predictedIncrease: 15, summary: 'An influencer-led social media campaign can drive high awareness and attract a younger demographic, leading to steady growth.' },
    { treatment: 'Botox', campaign: 'Educational Webinar', predictedIncrease: 10, summary: 'A webinar builds trust and attracts highly-qualified leads, though the volume may be lower than a discount-based campaign.' },
    { treatment: 'Chemical Peel', campaign: '20% Discount', predictedIncrease: 35, summary: 'Peels are highly responsive to discounts, especially when marketed as a "seasonal refresh." Expect a high volume of bookings.' },
    { treatment: 'Chemical Peel', campaign: 'Social Media Push', predictedIncrease: 20, summary: 'Visual "before and after" content on social media is very effective for peels, driving both new and returning clients.' },
    { treatment: 'Chemical Peel', campaign: 'Educational Webinar', predictedIncrease: 12, summary: 'Webinars explaining the different types of peels can demystify the process and attract clients seeking specific solutions for texture or pigmentation.' },
    { treatment: 'Dermal Fillers', campaign: '20% Discount', predictedIncrease: 18, summary: 'A discount can convert hesitant patients but may attract price-shoppers. Best used for specific filler types like lips.' },
    { treatment: 'Dermal Fillers', campaign: 'Social Media Push', predictedIncrease: 22, summary: 'Focusing on natural-looking results and practitioner expertise on social media builds trust and drives high-quality leads.' },
    { treatment: 'Dermal Fillers', campaign: 'Educational Webinar', predictedIncrease: 15, summary: 'An in-depth webinar on facial anatomy and filler techniques positions the clinic as a premium provider, attracting serious clients.' },
];
