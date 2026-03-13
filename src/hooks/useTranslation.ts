
// A mock translation hook. In a real app, this would be implemented with a library like i18next.
export const useTranslation = () => {
    const t = (key: string) => {
        const translations: { [key: string]: string } = {
            'aiCenter.newChat': 'New Chat',
            'aiCenter.workspace': 'Recent Chats',
            'aiCenter.welcomeTitle': 'Hi, Elizabeth!',
            'aiCenter.welcomeSubtitle': 'How can I assist you today?',
            
            'aiCenter.prompt1': 'Summarize key patient concerns for the 25-35 age group this month.',
            'aiCenter.prompt2': 'What are the top 3 up-selling opportunities based on recent consultations?',
            'aiCenter.prompt3': 'Identify common objections to filler treatments and suggest effective responses.',
            'aiCenter.prompt4': 'Generate marketing copy for a summer campaign targeting pigmentation issues.',

            'aiCenter.newBannerText': 'You can now ask complex questions about your clinic data.',
            'aiCenter.placeholder': 'Ask about trends, opportunities, or a specific consultation...',
            'aiCenter.promptLibrary': 'Prompt Library',
            'aiCenter.improvePrompt': 'Improve Prompt',
            'aiCenter.starter1': 'What were the most common objections last month?',
            'aiCenter.starter2': 'Draft a follow-up email for Botox patients.',
            'aiCenter.starter3': 'Which practitioner has the highest satisfaction score?',
        };
        return translations[key] || key.split('.').pop() || key;
    };
    return { t };
};
