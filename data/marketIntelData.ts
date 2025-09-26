import { MarketIntelData } from '../types';

export const marketIntelData: MarketIntelData = {
    competitorPricing: [
        { treatment: "Botox (per unit)", ourPrice: 14, competitorAvg: 15, marketRange: "$12 - $18" },
        { treatment: "Lip Filler (1 syringe)", ourPrice: 750, competitorAvg: 700, marketRange: "$650 - $900" },
        { treatment: "Chemical Peel", ourPrice: 250, competitorAvg: 300, marketRange: "$200 - $450" },
        { treatment: "IPL Photofacial", ourPrice: 400, competitorAvg: 425, marketRange: "$350 - $550" },
    ],
    socialTrends: [
        { name: "Glass Skin Facials", platform: "TikTok", volume: "High", summary: "Focus on achieving a luminous, poreless look is trending. Highlight treatments like Hydrafacials and light chemical peels." },
        { name: "Trap Tox (Trapezius Botox)", platform: "Instagram", volume: "Medium", summary: "Users are interested in neck/shoulder slimming for aesthetic purposes. An emerging off-label use case." },
        { name: "Under-eye Filler Alternatives", platform: "TikTok", volume: "High", summary: "Growing discussion around PRP/PRF and polynucleotides for under-eye rejuvenation as an alternative to traditional fillers." },
    ],
    shareOfVoice: [
        { name: "Aesthetics360", value: 35 },
        { name: "Competitor A", value: 28 },
        { name: "Competitor B", value: 20 },
        { name: "Competitor C", value: 12 },
        { name: "Others", value: 5 },
    ],
    topSearchTerms: [
        "best medspa near me",
        "botox deals",
        "natural lip filler results",
        "acne scar treatment",
        "coolsculpting vs liposuction",
        "microneedling cost",
    ]
};
