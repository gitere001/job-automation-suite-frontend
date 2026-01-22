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
  Cell,
  Legend,
  AreaChart,
  Area
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
  CursorArrowRaysIcon,
  HandThumbUpIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/outline';
import DashboardSkeleton from '../components/dashboard-components/DashboardSkeleton';

interface DashboardData {
  overview: {
    totalApplications: number;
    totalManual: number;
    totalAutomated: number;
    manualPercentage: number;
    automatedPercentage: number;
    responseRate: number;
    interviewRate: number;
    offerRate: number;
  };
  performanceByType: {
    manual: {
      responseRate: number;
      interviewRate: number;
      offerRate: number;
      avgDaysToResponse: number;
    };
    automated: {
      responseRate: number;
      interviewRate: number;
      offerRate: number;
      avgDaysToResponse: number;
    };
  };
  pipeline: {
    pending: number;
    inProcess: number;
    rejected: number;
    successful: number;
    byType: {
      manual: {
        pending: number;
        inProcess: number;
        successful: number;
      };
      automated: {
        pending: number;
        inProcess: number;
        successful: number;
      };
    };
  };
  weeklyActivity: {
    applicationsThisWeek: number;
    manualAppsThisWeek: number;
    automatedAppsThisWeek: number;
    responsesThisWeek: number;
    avgDaysToResponse: number;
    followUpsNeeded: number;
  };
  lastWeekApplications: {
    manual: Record<string, number>;
    automated: Record<string, number>;
    total: Record<string, number>;
  };
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

  const StatCard = ({ title, value, change, icon: Icon, color = 'text-blue-600', subtext = '' }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {subtext && (
            <p className="text-sm text-gray-500 mt-1">{subtext}</p>
          )}
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

  // Prepare application type distribution data
  const applicationTypeData = [
    { name: 'Manual', value: dashboardData.overview.totalManual, color: '#8b5cf6' },
    { name: 'Automated', value: dashboardData.overview.totalAutomated, color: '#0ea5e9' }
  ];

  // Convert lastWeekApplications object to array for bar chart - with stacked data
  const lastWeekApplicationsData = Object.entries(dashboardData.lastWeekApplications.total)
    .map(([date, totalCount]) => ({
      date,
      total: totalCount,
      manual: dashboardData.lastWeekApplications.manual[date] || 0,
      automated: dashboardData.lastWeekApplications.automated[date] || 0
    }));

  const weeklyActivityData = [
    { name: 'Applications', value: dashboardData.weeklyActivity.applicationsThisWeek, color: '#3b82f6' },
    { name: 'Responses', value: dashboardData.weeklyActivity.responsesThisWeek, color: '#10b981' },
    { name: 'Follow-ups', value: dashboardData.weeklyActivity.followUpsNeeded, color: '#f59e0b' }
  ];

  // Performance comparison data
  const performanceComparisonData = [
    {
      name: 'Response Rate',
      manual: dashboardData.performanceByType.manual.responseRate,
      automated: dashboardData.performanceByType.automated.responseRate,
    },
    {
      name: 'Interview Rate',
      manual: dashboardData.performanceByType.manual.interviewRate,
      automated: dashboardData.performanceByType.automated.interviewRate,
    },
    {
      name: 'Offer Rate',
      manual: dashboardData.performanceByType.manual.offerRate,
      automated: dashboardData.performanceByType.automated.offerRate,
    },
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

      {/* Overview Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Applications"
          value={dashboardData.overview.totalApplications}
          subtext={`${dashboardData.overview.manualPercentage}% manual • ${dashboardData.overview.automatedPercentage}% automated`}
          icon={DocumentTextIcon}
          color="text-blue-600"
        />
        <StatCard
          title="Response Rate"
          value={`${dashboardData.overview.responseRate.toFixed(1)}%`}
          subtext={`Manual: ${dashboardData.performanceByType.manual.responseRate.toFixed(1)}% • Auto: ${dashboardData.performanceByType.automated.responseRate.toFixed(1)}%`}
          icon={EnvelopeIcon}
          color="text-green-600"
        />
        <StatCard
          title="Interview Rate"
          value={`${dashboardData.overview.interviewRate.toFixed(1)}%`}
          subtext={`Manual: ${dashboardData.performanceByType.manual.interviewRate.toFixed(1)}% • Auto: ${dashboardData.performanceByType.automated.interviewRate.toFixed(1)}%`}
          icon={BriefcaseIcon}
          color="text-purple-600"
        />
        <StatCard
          title="Offer Rate"
          value={`${dashboardData.overview.offerRate.toFixed(1)}%`}
          subtext={`Manual: ${dashboardData.performanceByType.manual.offerRate.toFixed(1)}% • Auto: ${dashboardData.performanceByType.automated.offerRate.toFixed(1)}%`}
          icon={StarIcon}
          color="text-yellow-600"
        />
      </div>

      {/* Application Type & Pipeline Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Application Pipeline */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Pipeline</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pipelineChartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
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
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Application Type Distribution */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Type Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={applicationTypeData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(1)}%)`}
                labelLine={false}
              >
                {applicationTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                formatter={(value, name, props) => [
                  `${value} applications`,
                  props.payload.name
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-1">
                <HandThumbUpIcon className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">Manual</span>
              </div>
              <div className="text-xl font-bold text-gray-900">{dashboardData.overview.totalManual}</div>
              <div className="text-sm text-gray-600">{dashboardData.overview.manualPercentage.toFixed(1)}% of total</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-1">
                <ComputerDesktopIcon className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Automated</span>
              </div>
              <div className="text-xl font-bold text-gray-900">{dashboardData.overview.totalAutomated}</div>
              <div className="text-sm text-gray-600">{dashboardData.overview.automatedPercentage.toFixed(1)}% of total</div>
            </div>
          </div>
        </div>

        {/* Performance Comparison */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance by Type</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={performanceComparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#6b7280" tick={{ fontSize: 12 }} />
              <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                formatter={(value) => [`${value}%`, 'Rate']}
              />
              <Legend />
              <Bar dataKey="manual" name="Manual" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="automated" name="Automated" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Last Week Applications - STACKED BAR CHART */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
          <h3 className="text-lg font-semibold text-gray-900">Applications Last 7 Days</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
              <span className="text-sm text-gray-600">Manual</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-sm text-gray-600">Automated</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
              <span className="text-sm text-gray-600">Total</span>
            </div>
          </div>
        </div>
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
              formatter={(value, name) => [
                `${value} applications`,
                name === 'manual' ? 'Manual' : name === 'automated' ? 'Automated' : 'Total'
              ]}
            />
            <Legend />
            <Bar
              dataKey="manual"
              name="Manual"
              stackId="a"
              fill="#8b5cf6"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="automated"
              name="Automated"
              stackId="a"
              fill="#0ea5e9"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="total"
              name="Total"
              fill="#d1d5db"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Weekly Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week's Activity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
            <DocumentTextIcon className="h-8 w-8 text-blue-600 mb-2" />
            <div className="text-2xl font-bold text-gray-900">{dashboardData.weeklyActivity.applicationsThisWeek}</div>
            <div className="text-sm font-medium text-gray-700">Total Applications</div>
            <div className="text-xs text-gray-500 mt-1">
              {dashboardData.weeklyActivity.manualAppsThisWeek} manual • {dashboardData.weeklyActivity.automatedAppsThisWeek} auto
            </div>
          </div>
          <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg">
            <EnvelopeIcon className="h-8 w-8 text-green-600 mb-2" />
            <div className="text-2xl font-bold text-gray-900">{dashboardData.weeklyActivity.responsesThisWeek}</div>
            <div className="text-sm font-medium text-gray-700">Responses</div>
            <div className="text-xs text-gray-500 mt-1">This week</div>
          </div>
          <div className="flex flex-col items-center p-4 bg-purple-50 rounded-lg">
            <ClockIcon className="h-8 w-8 text-purple-600 mb-2" />
            <div className="text-2xl font-bold text-gray-900">{dashboardData.weeklyActivity.avgDaysToResponse.toFixed(1)}</div>
            <div className="text-sm font-medium text-gray-700">Avg. Days to Response</div>
            <div className="text-xs text-gray-500 mt-1">
              Manual: {dashboardData.performanceByType.manual.avgDaysToResponse} • Auto: {dashboardData.performanceByType.automated.avgDaysToResponse}
            </div>
          </div>
          <div className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg">
            <ArrowPathIcon className="h-8 w-8 text-yellow-600 mb-2" />
            <div className="text-2xl font-bold text-gray-900">{dashboardData.weeklyActivity.followUpsNeeded}</div>
            <div className="text-sm font-medium text-gray-700">Follow-ups Needed</div>
            <div className="text-xs text-gray-500 mt-1">Next 2 days</div>
          </div>
          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
            <CursorArrowRaysIcon className="h-8 w-8 text-gray-600 mb-2" />
            <div className="text-2xl font-bold text-gray-900">{dashboardData.pipeline.inProcess}</div>
            <div className="text-sm font-medium text-gray-700">In Process</div>
            <div className="text-xs text-gray-500 mt-1">
              {dashboardData.pipeline.byType.manual.inProcess} manual • {dashboardData.pipeline.byType.automated.inProcess} auto
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Manual Pipeline Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <HandThumbUpIcon className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Manual Applications Pipeline</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-xl font-bold text-gray-900">{dashboardData.pipeline.byType.manual.pending}</div>
              <div className="text-sm font-medium text-gray-700">Pending</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-gray-900">{dashboardData.pipeline.byType.manual.inProcess}</div>
              <div className="text-sm font-medium text-gray-700">In Process</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-xl font-bold text-gray-900">{dashboardData.pipeline.byType.manual.successful}</div>
              <div className="text-sm font-medium text-gray-700">Successful</div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Response Rate</span>
              <span className="font-semibold text-gray-900">{dashboardData.performanceByType.manual.responseRate.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-gray-600">Avg. Response Days</span>
              <span className="font-semibold text-gray-900">{dashboardData.performanceByType.manual.avgDaysToResponse}</span>
            </div>
          </div>
        </div>

        {/* Automated Pipeline Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <ComputerDesktopIcon className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Automated Applications Pipeline</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-xl font-bold text-gray-900">{dashboardData.pipeline.byType.automated.pending}</div>
              <div className="text-sm font-medium text-gray-700">Pending</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-gray-900">{dashboardData.pipeline.byType.automated.inProcess}</div>
              <div className="text-sm font-medium text-gray-700">In Process</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-xl font-bold text-gray-900">{dashboardData.pipeline.byType.automated.successful}</div>
              <div className="text-sm font-medium text-gray-700">Successful</div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Response Rate</span>
              <span className="font-semibold text-gray-900">{dashboardData.performanceByType.automated.responseRate.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-gray-600">Avg. Response Days</span>
              <span className="font-semibold text-gray-900">{dashboardData.performanceByType.automated.avgDaysToResponse}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
