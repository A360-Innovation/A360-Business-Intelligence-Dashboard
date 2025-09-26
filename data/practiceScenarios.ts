import { Scenario } from '../types';

export const practiceScenarios: Scenario[] = [
  { 
    id: 1, 
    title: 'Nervous First-Timer', 
    description: 'Patient is new to aesthetics and anxious about getting lip fillers. Goal: Build trust and educate.', 
    difficulty: 'Beginner', 
    persona: {
      name: 'Anxious Amy',
      avatarUrl: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=200&h=200&fit=crop&q=80',
    },
    initialMessage: "Hi, I've been thinking about getting lip fillers, but I'm really nervous. I don't want to look 'done' or unnatural. What do you think?",
  },
  { 
    id: 2, 
    title: 'Price-Conscious Client', 
    description: 'Patient wants a "liquid facelift" but has a strict budget. Goal: Handle cost objections and create a phased plan.', 
    difficulty: 'Intermediate', 
    persona: {
      name: 'Budgeting Ben',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&q=80'
    },
    initialMessage: "I saw a 'liquid facelift' on Instagram and I want one, but my budget is pretty tight, around $800. Can we make that work?",
  },
  { 
    id: 3, 
    title: 'The Know-It-All', 
    description: 'Patient has done extensive online research and challenges your recommendations. Goal: Assert expertise while maintaining rapport.', 
    difficulty: 'Advanced', 
    persona: {
        name: 'Researcher Rachel',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&q=80'
    },
    initialMessage: "Okay, so I've read that I need Voluma in my cheeks and Juvederm Ultra for my lips. I also read that a 'lip flip' is better than filler. Let's start there.",
  },
  { 
    id: 4, 
    title: 'Upsell Opportunity', 
    description: 'Patient comes for Botox but is a perfect candidate for complementary treatments. Goal: Introduce and explain benefits without being pushy.', 
    difficulty: 'Intermediate', 
    persona: {
        name: 'Candidate Cathy',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&q=80'
    },
    initialMessage: "I'm just here for my usual Botox in my forehead. Let's just do that quickly, please.",
  },
];
