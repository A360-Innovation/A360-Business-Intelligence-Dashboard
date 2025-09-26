
export interface TreatmentAnalysis {
  keyMetrics: { title: string; value: string }[];
  objections: { title: string; description: string }[];
  effectiveScripts: { title: string; script: string }[];
  crossSell: { name: string; rationale: string }[];
}

export const treatmentAnalysisData: { [key: string]: TreatmentAnalysis } = {
  'Botox': {
    keyMetrics: [
      { title: "Recommendations", value: "140" },
      { title: "Target Age Group", value: "36-60" },
      { title: "Avg. Satisfaction", value: "94%" },
      { title: "Conversion Rate", value: "82%" },
    ],
    objections: [
      { title: "Fear of 'Frozen' Look", description: "Patients worry about losing natural facial expressions." },
      { title: "Cost Concerns", description: "Per-unit pricing can seem high for first-time patients." },
      { title: "Pain/Needle Phobia", description: "Anxiety about the injection process." },
    ],
    effectiveScripts: [
      { title: "For 'Frozen' Look", script: "'Our philosophy is to start conservatively. We aim for a refreshed, natural look, not a frozen one. We can always add more at your 2-week follow-up if you like.'" },
      { title: "For Cost", script: "'Think of it as an investment in yourself. The results last 3-4 months, which breaks down to just a few dollars a day. We also offer financing options to make it more manageable.'" },
    ],
    crossSell: [
      { name: "Dermal Fillers", rationale: "Addresses volume loss while Botox treats dynamic wrinkles." },
      { name: "Chemical Peel", rationale: "Improves overall skin texture, enhancing the smooth appearance from Botox." },
    ]
  },
  'Dermal Fillers': {
    keyMetrics: [
      { title: "Recommendations", value: "110" },
      { title: "Target Age Group", value: "46-60+" },
      { title: "Avg. Satisfaction", value: "95%" },
      { title: "Conversion Rate", value: "78%" },
    ],
    objections: [
      { title: "Fear of Unnatural Look", description: "Concern about looking 'puffy' or 'overdone'." },
      { title: "Bruising & Swelling", description: "Worry about downtime and visible side effects." },
      { title: "Cost of Treatment", description: "Higher upfront cost compared to some other treatments." },
    ],
    effectiveScripts: [
        { title: "For Unnatural Look", script: "'We specialize in natural-looking results. The goal is to restore volume you've lost, not to create something that wasn't there. We'll use a precise amount to achieve a subtle, youthful lift.'" },
        { title: "For Downtime", script: "'Minor swelling and bruising are possible, but typically resolve within a few days. We can provide you with aftercare instructions to minimize this.'" },
    ],
    crossSell: [
      { name: "Botox", rationale: "A perfect combination to treat both static (filler) and dynamic (Botox) wrinkles for a total facial rejuvenation." },
      { name: "Laser Resurfacing", rationale: "Improves skin quality on the surface, while fillers work on the underlying structure." },
    ]
  },
  'Chemical Peel': {
    keyMetrics: [
      { title: "Recommendations", value: "80" },
      { title: "Target Age Group", value: "26-45" },
      { title: "Avg. Satisfaction", value: "91%" },
      { title: "Conversion Rate", value: "88%" },
    ],
    objections: [
      { title: "Downtime (Peeling)", description: "Patients are concerned about visible peeling and social downtime." },
      { title: "Sun Sensitivity", description: "Worry about post-treatment care and sun exposure risks." },
    ],
    effectiveScripts: [
        { title: "For Downtime", script: "'We have different strengths of peels. For a lighter peel, you might just experience some mild flaking for a couple of days, which is easily manageable. We can choose the right one for your schedule.'" },
    ],
    crossSell: [
      { name: "IPL Photofacial", rationale: "Peels address texture while IPL targets specific pigmentation issues like sunspots." },
    ]
  },
  'IPL Photofacial': {
    keyMetrics: [
      { title: "Recommendations", value: "65" },
      { title: "Target Age Group", value: "26-45" },
      { title: "Avg. Satisfaction", value: "93%" },
      { title: "Conversion Rate", value: "85%" },
    ],
    objections: [
      { title: "Number of Sessions", description: "Patients sometimes expect results after a single session." },
      { title: "Temporary Darkening", description: "Concern about sunspots getting darker before they flake off." },
    ],
    effectiveScripts: [
      { title: "For Number of Sessions", script: "'IPL works best as a series of treatments. Most patients see the best results after 3-5 sessions, spaced a month apart. This gradual approach ensures a safe and effective outcome.'" },
    ],
    crossSell: [
      { name: "Dermal Fillers", rationale: "After improving skin clarity with IPL, fillers can restore volume for a complete anti-aging effect." },
    ]
  },
  'Laser Resurfacing': {
    keyMetrics: [
      { title: "Recommendations", value: "37" },
      { title: "Target Age Group", value: "46-60" },
      { title: "Avg. Satisfaction", value: "96%" },
      { title: "Conversion Rate", value: "75%" },
    ],
    objections: [
      { title: "Significant Downtime", description: "The most common concern due to the ablative nature of some lasers." },
      { title: "Cost of Procedure", description: "Often one of the more expensive single treatments." },
    ],
    effectiveScripts: [
        { title: "For Downtime", script: "'You are right, there is social downtime of about 5-7 days. However, the results are significant and long-lasting. Think of it as a reset for your skin. We will provide a full aftercare kit to make your recovery as smooth as possible.'" },
    ],
    crossSell: [
      { name: "Botox/Fillers", rationale: "Used post-recovery to maintain results and address wrinkles that resurfacing doesn't target." },
    ]
  },
};
