'use client';

import { useEffect, useState } from 'react';
import { BarChart3, FileText, Target, CheckCircle, Star, Clock, TrendingUp } from 'lucide-react';
import type { DashboardStats } from '@/lib/types';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Mock user ID - in real app, get from auth context
  const userId = 'mock-user-id';

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch(`/api/dashboard?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setStats(data.stats);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [userId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-slate-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="card">
          <p className="text-slate-600">Failed to load dashboard data.</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Schemes',
      value: stats.totalSchemes,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Favorites',
      value: stats.userFavorites,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Applied',
      value: stats.appliedSchemes,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Completed',
      value: stats.completedSchemes,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="text-sm text-slate-600">
          Welcome back! Here's your ESG compliance overview.
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">{stat.title}</p>
                  <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">ESG Plans</h2>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Active Plans</span>
              <span className="font-medium">{stats.activePlans}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Pending Audits</span>
              <span className="font-medium">{stats.pendingAudits}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold">Progress Overview</h2>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Completion Rate</span>
                <span>{stats.totalSchemes > 0 ? Math.round((stats.completedSchemes / stats.totalSchemes) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${stats.totalSchemes > 0 ? (stats.completedSchemes / stats.totalSchemes) * 100 : 0}%` 
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Application Rate</span>
                <span>{stats.totalSchemes > 0 ? Math.round((stats.appliedSchemes / stats.totalSchemes) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${stats.totalSchemes > 0 ? (stats.appliedSchemes / stats.totalSchemes) * 100 : 0}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        {stats.recentActivity.length > 0 ? (
          <div className="space-y-3">
            {stats.recentActivity.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div>
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-slate-600">
                    {activity.type} • {activity.status}
                  </p>
                </div>
                <div className="text-xs text-slate-500">
                  {new Date(activity.timestamp).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-600 text-center py-4">No recent activity</p>
        )}
      </div>
    </div>
  );
}