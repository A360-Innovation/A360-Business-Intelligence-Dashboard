
import { User, ClinicSettings } from '../types';

export const mockClinicSettings: ClinicSettings = {
    name: "Aesthetics360 Demo Clinic",
    website: "https://www.aesthetics360.com",
};

export const mockUsers: User[] = [
  {
    id: 1,
    name: "Dr. Olivia Chen",
    email: "olivia.chen@aesthetics360.com",
    avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&q=80",
    role: 'Admin',
    status: 'Active',
  },
  {
    id: 2,
    name: "Michael Ramirez",
    email: "michael.ramirez@aesthetics360.com",
    avatarUrl: "https://images.unsplash.com/photo-1622253692010-333f2da60710?w=200&h=200&fit=crop&q=80",
    role: 'Practitioner',
    status: 'Active',
  },
  {
    id: 3,
    name: "Sophia Nguyen",
    email: "sophia.nguyen@aesthetics360.com",
    avatarUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16e?w=200&h=200&fit=crop&q=80",
    role: 'Practitioner',
    status: 'Active',
  },
    {
    id: 4,
    name: "Dr. Ben Carter",
    email: "ben.carter@aesthetics360.com",
    avatarUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&h=200&fit=crop&q=80",
    role: 'Manager',
    status: 'Active',
  },
  {
    id: 5,
    name: "emily.davis@aesthetics360.com",
    email: "emily.davis@aesthetics360.com",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&q=80",
    role: 'Practitioner',
    status: 'Pending',
  },
];
