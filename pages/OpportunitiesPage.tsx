import React, { useState } from 'react';
import { useOpportunitiesData } from '../hooks/useOpportunitiesData';
import Loader from '../components/icons/Loader';
import FilterBar from '../components/opportunities/FilterBar';
import OpportunityCard from '../components/opportunities/OpportunityCard';
import { useClinicsList } from '../hooks/useClinicsList';
import { useAuth } from '../contexts/AuthContext';

const OpportunitiesPage: React.FC = () => {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    const { isSuperAdmin } = useAuth();

    const [filters, setFilters] = useState({
        type: 'objection_handling',
        day_from: formatDate(oneMonthAgo),
        day_to: formatDate(today),
        clinic: 'All Clinics',
    });
    
    const { clinics } = useClinicsList();
    const { opportunities, loading, error } = useOpportunitiesData({
        ...filters,
        clinic: isSuperAdmin ? filters.clinic : '',
    });

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-foreground">Opportunities Hub</h1>
                <p className="text-muted-foreground mt-1">Review key moments from consultations to refine your skills and strategies.</p>
            </header>
            
            <FilterBar 
                filters={filters} 
                setFilters={setFilters}
                clinics={clinics}
                isSuperAdmin={isSuperAdmin}
            />

            <div className="mt-6">
                {loading && (
                    <div className="flex items-center justify-center h-64">
                        <div className="flex flex-col items-center gap-4">
                            <Loader />
                            <p className="text-muted-foreground">Loading Opportunities...</p>
                        </div>
                    </div>
                )}
                {error && (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center p-6 bg-destructive/10 border border-destructive rounded-lg">
                            <h2 className="text-lg font-semibold text-destructive">Failed to Load Opportunities</h2>
                            <p className="text-destructive/80 mt-1">{error}</p>
                        </div>
                    </div>
                )}
                {!loading && !error && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {opportunities.length > 0 ? (
                            opportunities.map((opp) => (
                                <OpportunityCard key={opp.transcript_id + opp.turn_index} opportunity={opp} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-16">
                                <h3 className="text-lg font-semibold text-foreground">No Opportunities Found</h3>
                                <p className="text-muted-foreground mt-1">Try adjusting your filters or checking back later.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OpportunitiesPage;