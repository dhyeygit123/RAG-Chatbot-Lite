// src/components/company/CompanyHome.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { MessageSquare, Users, TrendingUp, Clock } from 'lucide-react';

export default function CompanyHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalQAs: 0,
    totalChats: 0,
    todayChats: 0,
    avgResponseTime: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get(`/analytics/company/${user.companyId}`);
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Q&As',
      value: stats.totalQAs,
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Conversations',
      value: stats.totalChats,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Today\'s Chats',
      value: stats.todayChats,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Avg Response Time',
      value: `${stats.avgResponseTime}s`,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-1">Welcome back! Here's your chatbot overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/company/qa"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900 mb-1">Manage Q&As</h3>
              <p className="text-sm text-gray-600">Add, edit, or remove questions and answers</p>
            </a>
            <a
              href="/company/settings"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900 mb-1">Customize Chatbot</h3>
              <p className="text-sm text-gray-600">Change appearance and settings</p>
            </a>
            <a
              href="/company/analytics"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900 mb-1">View Analytics</h3>
              <p className="text-sm text-gray-600">Track performance and user interactions</p>
            </a>
            <a
              href="/company/settings"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900 mb-1">Get Embed Code</h3>
              <p className="text-sm text-gray-600">Copy code to add chatbot to your website</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}