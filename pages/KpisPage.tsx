import React, { useState, useEffect } from 'react';
import { useKpisData } from '../hooks/useKpisData';
import Loader from '../components/icons/Loader';
import DatePicker from '../components/DatePicker';
import { ChevronDown } from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import { cn } from '../lib/utils';
import { KpiData } from '../types';
import { useClinicsList } from '../hooks/useClinicsList';
import { useAuth } from '../contexts/AuthContext';

const KpisPage: React.FC = () => {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    const { isSuperAdmin } = useAuth();

    const [filters, setFilters] = useState({
        from_day: formatDate(oneMonthAgo),
        to_day: formatDate(today),
        clinic: 'All Clinics',
    });
    
    const { clinics } = useClinicsList();
    const { kpis, loading, error } = useKpisData({
        ...filters,
        clinic: isSuperAdmin ? filters.clinic : '',
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const renderKpiValue = (value: number | null, isPercent = false) => {
        if (value === null || value === undefined) return <span className="text-muted-foreground">-</span>;
        if (isPercent) return `${Math.round(value * 100)}%`;
        return value;
    };
    
    const getColorForScore = (score: number | null) => {
        if (score === null || score === undefined) return '';
        const pct = score * 100;
        if (pct >= 90) return 'text-success font-semibold';
        if (pct >= 80) return 'text-primary font-semibold';
        if (pct >= 70) return 'text-warning font-semibold';
        return 'text-destructive font-semibold';
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-foreground">Daily Key Performance Indicators (KPIs)</h1>
                <p className="text-muted-foreground mt-1">Track daily aggregated metrics from all consultations.</p>
            </header>
            
            <div className="p-4 bg-card border border-border rounded-lg flex flex-col sm:flex-row items-center gap-4 mb-6">
                <div className="w-full sm:w-auto">
                    <label htmlFor="from_day" className="text-xs font-medium text-muted-foreground">From</label>
                    <DatePicker id="from_day" name="from_day" value={filters.from_day} onChange={handleFilterChange} />
                </div>
                <div className="w-full sm:w-auto">
                     <label htmlFor="to_day" className="text-xs font-medium text-muted-foreground">To</label>
                     <DatePicker id="to_day" name="to_day" value={filters.to_day} onChange={handleFilterChange} />
                </div>
                {isSuperAdmin && (
                    <div className="w-full sm:w-auto">
                        <label htmlFor="clinic" className="text-xs font-medium text-muted-foreground">Clinic</label>
                        <div className="relative mt-1">
                            <select
                                id="clinic"
                                name="clinic"
                                value={filters.clinic}
                                onChange={handleFilterChange}
                                className="appearance-none h-9 w-full sm:w-48 rounded-md border border-input bg-card pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                                {clinics.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        </div>
                    </div>
                )}
            </div>

            <main>
                 {loading && (
                    <div className="flex items-center justify-center h-64">
                        <div className="flex flex-col items-center gap-4">
                            <Loader />
                            <p className="text-muted-foreground">Loading KPIs...</p>
                        </div>
                    </div>
                )}
                {error && (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center p-6 bg-destructive/10 border border-destructive rounded-lg">
                            <h2 className="text-lg font-semibold text-destructive">Failed to Load KPIs</h2>
                            <p className="text-destructive/80 mt-1">{error}</p>
                        </div>
                    </div>
                )}
                {!loading && !error && (
                    <DashboardCard title="KPI Breakdown by Day" tooltipText="Daily aggregated metrics from all processed consultations.">
                         <div className="overflow-x-auto -mx-6">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border text-left text-muted-foreground">
                                        <th className="font-semibold p-3">Date</th>
                                        {isSuperAdmin && <th className="font-semibold p-3">Clinic</th>}
                                        <th className="font-semibold p-3 text-center">Transcripts</th>
                                        <th className="font-semibold p-3 text-center">Avg. Satisfaction</th>
                                        <th className="font-semibold p-3 text-center">Avg. Education</th>
                                        <th className="font-semibold p-3 text-center">Objections</th>
                                        <th className="font-semibold p-3">Top Problems</th>
                                        <th className="font-semibold p-3">Top Procedures</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {kpis.length > 0 ? kpis.map((kpi: KpiData) => (
                                        <tr key={kpi.day + (kpi.clinic || '')} className="border-b border-border last:border-b-0 hover:bg-accent">
                                            <td className="p-3 font-medium text-foreground whitespace-nowrap">{new Date(kpi.day + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                            {isSuperAdmin && <td className="p-3 text-muted-foreground">{kpi.clinic}</td>}
                                            <td className="p-3 text-center font-semibold text-foreground">{kpi.transcripts_count}</td>
                                            <td className={cn("p-3 text-center", getColorForScore(kpi.avg_satisfaction))}>{renderKpiValue(kpi.avg_satisfaction, true)}</td>
                                            <td className={cn("p-3 text-center", getColorForScore(kpi.avg_education_effectiveness))}>{renderKpiValue(kpi.avg_education_effectiveness, true)}</td>
                                            <td className="p-3 text-center">{renderKpiValue(kpi.objections_count)}</td>
                                            <td className="p-3 text-muted-foreground">{(kpi.top_problems || []).join(', ') || '-'}</td>
                                            <td className="p-3 text-muted-foreground">{(kpi.top_procedures || []).join(', ') || '-'}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={isSuperAdmin ? 8 : 7} className="text-center p-8 text-muted-foreground">
                                                No KPI data found for the selected filters.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                       </div>
                    </DashboardCard>
                )}
            </main>
        </div>
    );
};

export default KpisPage;