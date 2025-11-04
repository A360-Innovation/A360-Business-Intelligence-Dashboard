

import React, { useState, useMemo, useEffect } from 'react';
import { useClinicPerformanceData } from '../hooks/useClinicPerformanceData';
import Loader from '../components/icons/Loader';
// Fix: Corrected component import path from non-existent 'DatePicker' to 'DateRangePicker'.
import DateRangePicker from '../components/ui/DateRangePicker';
import DashboardCard from '../components/DashboardCard';
import { cn } from '../lib/utils';
import { ClinicPerformanceData } from '../types';
import { ArrowUp, ArrowDown, ChevronDown } from 'lucide-react';

type SortKey = keyof ClinicPerformanceData | null;

const ClinicPerformancePage: React.FC = () => {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);
    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    const [filters, setFilters] = useState({
        from_day: formatDate(oneMonthAgo),
        to_day: formatDate(today),
        clinic: 'All Clinics',
    });
    
    const [clinics, setClinics] = useState<string[]>([]);
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' }>({ key: 'totalConsultations', direction: 'descending' });

     useEffect(() => {
        const fetchClinics = async () => {
            try {
                const response = await fetch('https://rag-aesthetic-production.up.railway.app/clinics/');
                if (!response.ok) throw new Error('Failed to fetch clinics');
                const data = await response.json();
                setClinics(['All Clinics', ...(data.clinics || [])]);
            } catch (error) {
                console.error('Error fetching clinics:', error);
                setClinics(['All Clinics']);
            }
        };
        fetchClinics();
    }, []);

    const { performanceData, loading, error } = useClinicPerformanceData(filters);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Fix: Added a handler for the DateRangePicker component.
    const handleDateRangeChange = (range: { from: Date; to: Date }) => {
        setFilters({
            ...filters,
            from_day: formatDate(range.from),
            to_day: formatDate(range.to),
        });
    };

    const sortedData = useMemo(() => {
        let sortableItems = [...performanceData];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                const aValue = a[sortConfig.key!];
                const bValue = b[sortConfig.key!];

                if (aValue === null) return 1;
                if (bValue === null) return -1;
                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [performanceData, sortConfig]);

    const requestSort = (key: SortKey) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const SortableHeader: React.FC<{ sortKey: SortKey; label: string; className?: string }> = ({ sortKey, label, className }) => (
        <th className={cn("font-semibold p-3 cursor-pointer", className)} onClick={() => requestSort(sortKey)}>
            <div className="flex items-center">
                {label}
                {sortConfig.key === sortKey && (
                    sortConfig.direction === 'ascending' ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />
                )}
            </div>
        </th>
    );

    const renderScore = (score: number | null) => {
        if (score === null || score === undefined) return <span className="text-muted-foreground">-</span>;
        const pct = Math.round(score * 100);
        let colorClass = '';
        if (pct >= 90) colorClass = 'text-success font-semibold';
        else if (pct >= 80) colorClass = 'text-primary font-semibold';
        else if (pct >= 70) colorClass = 'text-warning font-semibold';
        else colorClass = 'text-destructive font-semibold';
        return <span className={colorClass}>{pct}%</span>;
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-foreground">Clinic Performance Comparison</h1>
                <p className="text-muted-foreground mt-1">Compare key metrics across all clinic locations.</p>
            </header>
            
            {/* Fix: Replaced two DatePicker components with a single DateRangePicker for consistency. */}
            <div className="p-4 bg-card border border-border rounded-lg flex flex-col sm:flex-row items-center gap-4 mb-6">
                <div className="w-full sm:w-auto">
                    <label className="text-xs font-medium text-muted-foreground">Date Range</label>
                     <DateRangePicker
                        date={{
                            from: new Date(filters.from_day + 'T00:00:00'),
                            to: new Date(filters.to_day + 'T00:00:00')
                        }}
                        onDateChange={handleDateRangeChange}
                     />
                </div>
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
            </div>

            <main>
                 {loading && (
                    <div className="flex items-center justify-center h-64">
                        <div className="flex flex-col items-center gap-4">
                            <Loader />
                            <p className="text-muted-foreground">Loading Performance Data...</p>
                        </div>
                    </div>
                )}
                {error && (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center p-6 bg-destructive/10 border border-destructive rounded-lg">
                            <h2 className="text-lg font-semibold text-destructive">Failed to Load Data</h2>
                            <p className="text-destructive/80 mt-1">{error}</p>
                        </div>
                    </div>
                )}
                {!loading && !error && (
                    <DashboardCard title="Performance by Clinic" tooltipText="Aggregated metrics for each clinic in the selected date range.">
                         <div className="overflow-x-auto -mx-6">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border text-left text-muted-foreground">
                                        <SortableHeader sortKey="clinicName" label="Clinic" />
                                        <SortableHeader sortKey="totalConsultations" label="Consultations" className="text-center" />
                                        <SortableHeader sortKey="avgSatisfaction" label="Avg. Satisfaction" className="text-center" />
                                        <SortableHeader sortKey="avgEducation" label="Avg. Education" className="text-center" />
                                        <SortableHeader sortKey="totalObjections" label="Objections" className="text-center" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedData.length > 0 ? sortedData.map((clinic) => (
                                        <tr key={clinic.clinicName} className="border-b border-border last:border-b-0 hover:bg-accent">
                                            <td className="p-3 font-medium text-foreground">{clinic.clinicName}</td>
                                            <td className="p-3 text-center font-semibold text-foreground">{clinic.totalConsultations}</td>
                                            <td className="p-3 text-center">{renderScore(clinic.avgSatisfaction)}</td>
                                            <td className="p-3 text-center">{renderScore(clinic.avgEducation)}</td>
                                            <td className="p-3 text-center">{clinic.totalObjections}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="text-center p-8 text-muted-foreground">
                                                No performance data found for the selected dates.
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

export default ClinicPerformancePage;