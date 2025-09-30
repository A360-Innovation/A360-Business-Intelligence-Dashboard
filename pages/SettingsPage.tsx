
import React from 'react';
import { mockClinicSettings, mockUsers } from '../data/settingsData';
import DashboardCard from '../components/DashboardCard';
import { Button } from '../components/ui/button';
import { UserPlus } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { cn } from '../lib/utils';

const SettingsPage: React.FC = () => {

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">Settings</h1>
                <p className="text-muted-foreground mt-1">Manage your clinic settings and team members.</p>
            </header>

            <main className="space-y-8">
                <DashboardCard
                    title="General Settings"
                    tooltipText="Manage your clinic's basic information."
                >
                    <div className="max-w-md space-y-4">
                         <div>
                            <label htmlFor="clinicName" className="text-sm font-medium text-muted-foreground">Clinic Name</label>
                            <input
                                type="text"
                                id="clinicName"
                                value={mockClinicSettings.name}
                                disabled
                                className="mt-1 w-full bg-secondary/50 border border-border rounded-md h-9 px-3 text-sm cursor-not-allowed"
                            />
                        </div>
                         <div>
                            <label htmlFor="website" className="text-sm font-medium text-muted-foreground">Website</label>
                            <input
                                type="text"
                                id="website"
                                value={mockClinicSettings.website}
                                disabled
                                className="mt-1 w-full bg-secondary/50 border border-border rounded-md h-9 px-3 text-sm cursor-not-allowed"
                            />
                        </div>
                        <div className="pt-2">
                           <Button disabled>Save Changes</Button>
                        </div>
                    </div>
                </DashboardCard>

                <DashboardCard
                    title="User Management"
                    tooltipText="Add, edit, and manage user accounts and permissions for your team."
                    headerContent={
                        <Button variant="outline" size="sm">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Add User
                        </Button>
                    }
                >
                   <div className="overflow-x-auto -mx-6">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border text-left text-muted-foreground">
                                    <th className="font-semibold p-4">Name</th>
                                    <th className="font-semibold p-4">Role</th>
                                    <th className="font-semibold p-4">Status</th>
                                    <th className="font-semibold p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockUsers.map((user) => (
                                    <tr key={user.id} className="border-b border-border last:border-b-0 hover:bg-accent">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <img src={user.avatarUrl} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
                                                <div>
                                                    <p className="font-semibold text-foreground">{user.name}</p>
                                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-muted-foreground">{user.role}</td>
                                        <td className="p-4">
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    user.status === 'Active' ? 'border-success/50 bg-success/5 text-success' : 'border-amber-500/50 bg-amber-500/5 text-amber-600'
                                                )}
                                            >
                                                {user.status}
                                            </Badge>
                                        </td>
                                        <td className="p-4 text-right">
                                            <Button variant="ghost" size="sm" className="text-primary">Edit</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                   </div>
                </DashboardCard>
            </main>
        </div>
    );
};

export default SettingsPage;
