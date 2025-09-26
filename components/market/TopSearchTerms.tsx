import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Search } from 'lucide-react';

interface TopSearchTermsProps {
  data: string[];
}

const TopSearchTerms: React.FC<TopSearchTermsProps> = ({ data }) => {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Search className="h-5 w-5 mr-2 text-primary" />
                    Top Local Search Terms
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2">
                    {data.map((term, index) => (
                        <li key={index} className="flex items-center text-sm">
                            <span className="text-muted-foreground font-semibold w-6">{index + 1}.</span>
                            <span className="text-foreground bg-secondary px-2 py-1 rounded-md">{term}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
};

export default TopSearchTerms;
