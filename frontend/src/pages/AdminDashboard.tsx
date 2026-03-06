import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

interface Stats {
    total: number;
    served: number;
    pending: number;
}

interface Queue {
    id: number;
    queueNumber: string;
    status: string;
    timeSlot: string;
    date: string;
    service: {
        name: string;
    };
}

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<Stats>({ total: 0, served: 0, pending: 0 });
    const [queues, setQueues] = useState<Queue[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [selectedStatus, setSelectedStatus] = useState<string>('PENDING'); // Default to PENDING or ALL
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            // Fetch Stats
            const statsRes = await api.get(`/admin/stats?date=${selectedDate}`);
            setStats(statsRes.data);

            // Fetch Queues
            let query = `/admin/queues?date=${selectedDate}`;
            if (selectedStatus !== 'ALL') {
                query += `&status=${selectedStatus}`;
            }
            const queuesRes = await api.get(query);
            setQueues(queuesRes.data);
        } catch (error) {
            console.error('Failed to fetch data', error);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000); // Polling every 5s
        return () => clearInterval(interval);
    }, [selectedDate, selectedStatus]);

    const handleCall = async (id: number) => {
        try {
            await api.put(`/admin/queues/${id}/call`);
            fetchData();
        } catch (error) {
            console.error('Error calling queue', error);
        }
    };

    const handleComplete = async (id: number) => {
        try {
            await api.put(`/admin/queues/${id}/complete`);
            fetchData();
        } catch (error) {
            console.error('Error completing queue', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Queue Management Dashboard</h1>
                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-white rounded-lg shadow px-4 py-2">
                        <span className="mr-2 text-gray-600 font-medium">Date:</span>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="outline-none text-gray-800"
                        />
                    </div>
                    <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 shadow transition">
                        Logout
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500 transform hover:scale-105 transition duration-200">
                    <h3 className="text-gray-500 text-sm font-medium">Total Queues</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.total}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500 transform hover:scale-105 transition duration-200">
                    <h3 className="text-gray-500 text-sm font-medium">Served</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.served}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500 transform hover:scale-105 transition duration-200">
                    <h3 className="text-gray-500 text-sm font-medium">Pending</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.pending}</p>
                </div>
            </div>

            {/* Queue List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-semibold text-gray-800">Queue List</h2>
                    <div className="flex gap-2">
                        {['ALL', 'PENDING', 'SERVING', 'COMPLETED', 'CANCELLED'].map(status => (
                            <button
                                key={status}
                                onClick={() => setSelectedStatus(status)}
                                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${selectedStatus === status
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Queue No.</th>
                                <th className="px-6 py-3">Service</th>
                                <th className="px-6 py-3">Time Slot</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {queues.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                                        No queues found for this date/status.
                                    </td>
                                </tr>
                            ) : (
                                queues.map((queue) => (
                                    <tr key={queue.id} className="border-b bg-white hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {new Date(queue.date).toLocaleDateString('th-TH')}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900">{queue.queueNumber}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                {queue.service.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium">{queue.timeSlot}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${queue.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                    queue.status === 'SERVING' ? 'bg-blue-100 text-blue-800' :
                                                        queue.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                                            'bg-gray-100 text-gray-800'
                                                }`}>
                                                {queue.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleCall(queue.id)}
                                                disabled={queue.status !== 'PENDING'}
                                                className={`mr-2 px-3 py-1 text-white text-xs rounded transition ${queue.status === 'PENDING'
                                                        ? 'bg-blue-600 hover:bg-blue-700 shadow-sm'
                                                        : 'bg-gray-300 cursor-not-allowed'
                                                    }`}
                                            >
                                                Call
                                            </button>
                                            <button
                                                onClick={() => handleComplete(queue.id)}
                                                disabled={queue.status !== 'SERVING'}
                                                className={`px-3 py-1 text-white text-xs rounded transition ${queue.status === 'SERVING'
                                                        ? 'bg-green-600 hover:bg-green-700 shadow-sm'
                                                        : 'bg-gray-300 cursor-not-allowed'
                                                    }`}
                                            >
                                                Complete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
