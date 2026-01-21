import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  DocumentTextIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowPathIcon,
  EnvelopeIcon,
  BriefcaseIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import DashboardSkeleton from '../components/dashboard-components/DashboardSkeleton';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';

interface DashboardData {
  overview: {
    totalApplications: number;
    responseRate: number;
    interviewRate: number;
    offerRate: number;
  };
  pipeline: {
    pending: number;
    inProcess: number;
    rejected: number;
    successful: number;
  };
  weeklyActivity: {
    applicationsThisWeek: number;
    responsesThisWeek: number;
    avgDaysToResponse: number;
    followUpsNeeded: number;
  };
  lastWeekApplications: Record<string, number>;
}

interface ApiResponse {
  success: boolean;
  data: DashboardData;
  lastUpdated: string;
}

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const { admin } = useSelector((state: RootState) => state.auth);

  // Fetch data from your API
  const fetchData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/job-applications/dashboard-stats`, {
        credentials: 'include'
      });
      const data: ApiResponse = await response.json();
      if (data.success) {
        setDashboardData(data.data);
        setLastUpdated(data.lastUpdated);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  // Initial load
  useEffect(() => {
    fetchData().then(() => {
      setIsLoading(false);
    });
  }, []);

  // Refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  };

  const StatCard = ({ title, value, change, icon: Icon, color = 'text-blue-600' }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {change > 0 ? (
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-600 mr-1" />
              ) : (
                <ArrowTrendingDownIcon className="h-4 w-4 text-red-600 mr-1" />
              )}
              <span className={`text-sm font-medium ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(change)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last week</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  // Show skeleton while loading
  if (isLoading || isRefreshing || !dashboardData) {
    return (
      <div className="relative">
        {isRefreshing && (
          <div className="absolute top-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-center p-4">
              <ArrowPathIcon className="h-5 w-5 text-gray-600 animate-spin mr-2" />
              <span className="text-gray-600 font-medium">Refreshing data...</span>
            </div>
          </div>
        )}
        <DashboardSkeleton />
      </div>
    );
  }

  // Prepare chart data from YOUR API data
  const pipelineChartData = [
    { name: 'Pending', value: dashboardData.pipeline.pending, color: '#f59e0b' },
    { name: 'In Process', value: dashboardData.pipeline.inProcess, color: '#3b82f6' },
    { name: 'Rejected', value: dashboardData.pipeline.rejected, color: '#ef4444' },
    { name: 'Successful', value: dashboardData.pipeline.successful, color: '#10b981' }
  ];

  // Convert lastWeekApplications object to array for bar chart
  const lastWeekApplicationsData = Object.entries(dashboardData.lastWeekApplications)
    .map(([date, count]) => ({
      date,
      applications: count
    }));

  const weeklyActivityData = [
    { name: 'Applications', value: dashboardData.weeklyActivity.applicationsThisWeek, color: '#3b82f6' },
    { name: 'Responses', value: dashboardData.weeklyActivity.responsesThisWeek, color: '#10b981' },
    { name: 'Follow-ups', value: dashboardData.weeklyActivity.followUpsNeeded, color: '#f59e0b' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Job Search Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Track your job applications and responses
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex cursor-pointer items-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
          >
            <ArrowPathIcon
              className={`h-4 w-4 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`}
            />
            <span className="text-sm font-medium text-gray-700">
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </span>
          </button>
          <div className="text-right">
            <p className="text-xs sm:text-sm text-gray-500">Last updated</p>
            <p className="text-sm font-semibold text-gray-900">
              {lastUpdated ? new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Applications"
          value={dashboardData.overview.totalApplications}
          icon={DocumentTextIcon}
          color="text-blue-600"
        />
        <StatCard
          title="Response Rate"
          value={`${dashboardData.overview.responseRate.toFixed(1)}%`}
          icon={EnvelopeIcon}
          color="text-green-600"
        />
        <StatCard
          title="Interview Rate"
          value={`${dashboardData.overview.interviewRate.toFixed(1)}%`}
          icon={BriefcaseIcon}
          color="text-purple-600"
        />
        <StatCard
          title="Offer Rate"
          value={`${dashboardData.overview.offerRate.toFixed(1)}%`}
          icon={StarIcon}
          color="text-yellow-600"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Pipeline */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Pipeline</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pipelineChartData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
                labelLine={false}
              >
                {pipelineChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Last Week Applications - BAR CHART */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Applications Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={lastWeekApplicationsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                stroke="#6b7280"
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                formatter={(value) => [value, 'Applications']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Bar
                dataKey="applications"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                name="Applications"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week's Activity</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
            <DocumentTextIcon className="h-8 w-8 text-blue-600 mb-2" />
            <div className="text-2xl font-bold text-gray-900">{dashboardData.weeklyActivity.applicationsThisWeek}</div>
            <div className="text-sm font-medium text-gray-700">Applications Sent</div>
          </div>
          <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg">
            <EnvelopeIcon className="h-8 w-8 text-green-600 mb-2" />
            <div className="text-2xl font-bold text-gray-900">{dashboardData.weeklyActivity.responsesThisWeek}</div>
            <div className="text-sm font-medium text-gray-700">Responses</div>
          </div>
          <div className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg">
            <ClockIcon className="h-8 w-8 text-yellow-600 mb-2" />
            <div className="text-2xl font-bold text-gray-900">{dashboardData.weeklyActivity.avgDaysToResponse.toFixed(1)}</div>
            <div className="text-sm font-medium text-gray-700">Avg. Days to Response</div>
          </div>
          <div className="flex flex-col items-center p-4 bg-red-50 rounded-lg">
            <ArrowPathIcon className="h-8 w-8 text-red-600 mb-2" />
            <div className="text-2xl font-bold text-gray-900">{dashboardData.weeklyActivity.followUpsNeeded}</div>
            <div className="text-sm font-medium text-gray-700">Follow-ups Needed</div>
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {pipelineChartData.map((item, index) => (
            <div key={index} className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{item.value}</div>
              <div className="flex items-center mt-2">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm font-medium text-gray-700">{item.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;