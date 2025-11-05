import React from 'react';
import { Reservation, ContactSubmission, MenuItem } from '../types';
import { AdminTab } from './AdminPanel';

interface DashboardProps {
  reservations: Reservation[];
  contactSubmissions: ContactSubmission[];
  menuItems: MenuItem[];
  setActiveTab: (tab: AdminTab) => void;
}

interface StatCardProps {
    icon: string;
    title: string;
    value: string | number;
    subtitle?: string;
    color: string;
    onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, subtitle, color, onClick }) => (
    <div onClick={onClick} className={`bg-white p-6 rounded-lg shadow-md flex items-start transition-transform transform hover:scale-105 ${onClick ? 'cursor-pointer' : ''}`}>
        <div className={`p-3 rounded-full mr-4 ${color}`}>
            <i data-lucide={icon} className="w-6 h-6 text-white"></i>
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
            {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
    </div>
);


const Dashboard: React.FC<DashboardProps> = ({ reservations, contactSubmissions, menuItems, setActiveTab }) => {
    const pendingReservations = reservations.filter(r => r.status === 'Pendente');
    
    const upcomingReservations = reservations
        .filter(r => (r.status === 'Pendente' || r.status === 'Confirmada') && new Date(`${r.date}T${r.time}`) >= new Date())
        .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
    
    const nextReservation = upcomingReservations[0];

    const allActivities = [
        ...reservations.map(r => ({ ...r, type: 'Reserva', date: r.submittedAt })),
        ...contactSubmissions.map(c => ({ ...c, type: 'Contato', date: c.submittedAt }))
    ].sort((a, b) => b.date.toDate() - a.date.toDate());

    const recentActivities = allActivities.slice(0, 5);
    
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    icon="calendar-clock" 
                    title="Reservas Pendentes" 
                    value={pendingReservations.length} 
                    color="bg-yellow-500"
                    onClick={() => setActiveTab('reservas')}
                />
                <StatCard 
                    icon="calendar-check" 
                    title="Próxima Reserva" 
                    value={nextReservation ? `${new Date(nextReservation.date).toLocaleDateString('pt-BR', {timeZone:'UTC'})}` : '-'}
                    subtitle={nextReservation ? `${nextReservation.name} (${nextReservation.guests}p)` : 'Nenhuma reserva futura'}
                    color="bg-blue-500"
                />
                 <StatCard 
                    icon="inbox" 
                    title="Novas Mensagens" 
                    value={contactSubmissions.length} 
                    color="bg-indigo-500"
                    onClick={() => setActiveTab('contatos')}
                />
                <StatCard 
                    icon="utensils-crossed" 
                    title="Itens no Cardápio" 
                    value={menuItems.length} 
                    color="bg-green-500"
                    onClick={() => setActiveTab('cardapio')}
                />
            </div>

            {/* Recent Activity */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Atividade Recente</h2>
                <div className="bg-white p-4 rounded-lg shadow-md">
                   <ul className="divide-y divide-gray-200">
                        {recentActivities.length > 0 ? recentActivities.map(activity => (
                             <li key={activity.id} className="py-4 flex items-center">
                                <div className={`p-3 rounded-full mr-4 ${activity.type === 'Reserva' ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                    <i data-lucide={activity.type === 'Reserva' ? 'calendar' : 'message-square'} className="w-5 h-5"></i>
                                </div>
                                <div className="flex-grow">
                                    <p className="text-sm font-medium text-gray-900">
                                        Nova {activity.type}: <span className="font-bold">{activity.name}</span>
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {activity.date?.toDate().toLocaleString('pt-BR')}
                                    </p>
                                </div>
                                {activity.type === 'Reserva' && (
                                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${(activity as Reservation).status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {(activity as Reservation).status}
                                    </span>
                                )}
                             </li>
                        )) : (
                            <p className="text-center text-gray-500 py-4">Nenhuma atividade recente.</p>
                        )}
                   </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;