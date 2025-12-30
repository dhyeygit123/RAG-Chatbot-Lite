import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Home, MessageSquare, Settings, BarChart3 } from 'lucide-react';
import { cn } from '../lib/utils';

// Sub-pages - You need to import these
import CompanyHome from '../components/company/CompanyHome';
import QAManagement from '../components/company/QAManagement';
import CompanySettings from '../components/company/CompanySettings';
import CompanyAnalytics from '../components/company/CompanyAnalytics';

export default function CompanyDashboard() {
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/company', icon: Home },
    { name: 'Q&A Management', href: '/company/qa', icon: MessageSquare },
    { name: 'Settings', href: '/company/settings', icon: Settings },
    { name: 'Analytics', href: '/company/analytics', icon: BarChart3 },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar Navigation */}
      <aside className="lg:w-64 shrink-0">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <item.icon className={cn('w-5 h-5 mr-3', isActive ? 'text-blue-700' : 'text-gray-400')} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <Routes>
          <Route index element={<CompanyHome />} />
          <Route path="qa" element={<QAManagement />} />
          <Route path="settings" element={<CompanySettings />} />
          <Route path="analytics" element={<CompanyAnalytics />} />
        </Routes>
      </div>
    </div>
  );
}