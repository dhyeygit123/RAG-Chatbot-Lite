import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { MessageSquare, TrendingUp, XCircle } from 'lucide-react';
import { formatDate } from '../../lib/utils';

export default function CompanyAnalytics() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState({
    totalChats: 0,
    matchedChats: 0,
    unmatchedChats: 0,
    matchRate: 0,
    recentChats: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data } = await api.get(`/analytics/company/${user.companyId}`);
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Analytics</h2>
        <p className="text-gray-600 mt-1">Monitor your chatbot performance</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Conversations
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalChats}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Matched Queries
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.matchedChats}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Match Rate
            </CardTitle>
            <div className={`h-4 w-4 ${analytics.matchRate > 70 ? 'text-green-600' : 'text-orange-600'}`}>
              {analytics.matchRate > 70 ? <TrendingUp /> : <XCircle />}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.matchRate}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Conversations</CardTitle>
        </CardHeader>
        <CardContent>
          {analytics.recentChats.length > 0 ? (
            <div className="space-y-4">
              {analytics.recentChats.map((chat, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium text-gray-900">User: {chat.userMessage}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      chat.matched 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {chat.matched ? 'Matched' : 'Not matched'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Bot: {chat.botResponse}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDate(chat.timestamp)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              No conversations yet
            </p>
          )}
        </CardContent>
      </Card>

      {analytics.unmatchedChats > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-900">Unmatched Queries</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-800">
              You have <strong>{analytics.unmatchedChats}</strong> unmatched queries. 
              Consider adding more Q&As to improve your chatbot's performance.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 