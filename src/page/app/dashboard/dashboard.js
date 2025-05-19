import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import api from '../../../api';
import { authAxios } from "../../../config/axios-config";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { FaUsers, FaGavel, FaWallet, FaClock } from 'react-icons/fa';

const CustomBarLabel = ({ x, y, width, height, value, name }) => {
  const isMobile = window.innerWidth < 768;
  if (!isMobile) return null;

  return (
    <text
      x={x + width / 2}
      y={y + height / 2}
      fill="white"
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize={10}
      transform={`rotate(-90 ${x + width / 2} ${y + height / 2})`}
    >
      {name}
    </text>
  );
};

const CustomXAxisTick = ({ x, y, payload }) => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={isMobile ? -8 : 16}
        textAnchor={isMobile ? null : 'middle'}
        fill="#64748b"
        fontSize={12}
        transform={isMobile ? 'rotate(-90)' : 'rotate(0)'}
      >
        {payload.value}
      </text>
    </g>
  );
};

const Dashboard = ({ stats: dashboardStats }) => {
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  
  const [stats, setStats] = useState(dashboardStats || {
    totalUsers: 0,
    totalBalance: 0,
    totalProfit: 0,
    liveAuctions: 0,
    scheduledAuctions: 0,
    listedProducts: 0,
    paymentPending: 0,
    deliveryPending: 0,
  });

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const [balanceResponse, profitResponse] = await Promise.all([
          authAxios.get(`${api.app.adminWallet.getAdminWalletBalance}`),
          authAxios.get(`${api.app.adminWallet.getAdminProfit}`)
        ]);
        
        setStats(prevStats => ({
          ...prevStats,
          totalBalance: balanceResponse?.data || 0,
          totalProfit: profitResponse?.data?.adminProfit || 0
        }));
      } catch (error) {
        console.error('Error fetching wallet data:', error);
      }
    };

    fetchWalletData();
  }, []);

  const [metricsData, setMetricsData] = useState([
    { name: 'Users', value: stats.totalUsers, color: '#6366f1' },
    { name: 'Live', value: stats.liveAuctions, color: '#06b6d4' },
    { name: 'Scheduled', value: stats.scheduledAuctions, color: '#8b5cf6' },
    { name: 'Listed', value: stats.listedProducts, color: '#f43f5e' },
    { name: 'Payment', value: stats.paymentPending, color: '#f59e0b' },
    { name: 'Delivery', value: stats.deliveryPending, color: '#10b981' }
  ]);

  const statusData = useMemo(() => [
    { name: 'Live Auctions', value: stats.liveAuctions, color: '#06b6d4' },
    { name: 'Scheduled', value: stats.scheduledAuctions, color: '#8b5cf6' },
    { name: 'Payment Pending', value: stats.paymentPending, color: '#f59e0b' },
    { name: 'Delivery Pending', value: stats.deliveryPending, color: '#10b981' }
  ], [stats.liveAuctions, stats.scheduledAuctions, stats.paymentPending, stats.deliveryPending]);

  useEffect(() => {
    if (dashboardStats?.data) {
      const data = dashboardStats.data;
      setStats(prevStats => ({
        ...prevStats,
        totalUsers: data.totalUsers || 0,
        liveAuctions: data.liveAuctions || 0,
        scheduledAuctions: data.scheduledAuctions || 0,
        listedProducts: data.listedProducts || 0,
        paymentPending: data.paymentPending || 0,
        deliveryPending: typeof data.deliveryPending === 'object' ? (data.deliveryPending?._sum?.amount || 0) : (data.deliveryPending || 0)
      }));
    }
  }, [dashboardStats]);

  useEffect(() => {
    // Update metrics data when stats change
    setMetricsData([
      { name: 'Users', value: stats.totalUsers, color: '#4BC0C0' },
      { name: 'Live', value: stats.liveAuctions, color: '#36A2EB' },
      { name: 'Scheduled', value: stats.scheduledAuctions, color: '#9966FF' },
      { name: 'Listed', value: stats.listedProducts, color: '#FF6384' },
      { name: 'Payment', value: stats.paymentPending, color: '#FF9F40' },
      { name: 'Delivery', value: stats.deliveryPending, color: '#C9CBCF' }
    ]);
  }, [stats]);

  const StatCard = ({ title, value, icon: Icon }) => (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary/20">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-xl md:text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className="bg-primary/10 p-3 rounded-full transform transition-transform duration-300 hover:scale-110">
          <Icon className="text-primary-dark text-xl md:text-2xl" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 mx-auto max-w-[1920px]">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
        <div className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <StatCard title="Total Users" value={stats.totalUsers} icon={FaUsers} />
        <StatCard title="Total Balance" value={`AED ${Number(stats.totalBalance).toFixed(2)}`} icon={FaWallet} />
        <StatCard title="Total Profit" value={`AED ${Number(stats.totalProfit).toFixed(2)}`} icon={FaWallet} />
        <StatCard title="Live Auctions" value={stats.liveAuctions} icon={FaGavel} />
        <StatCard title="Scheduled Auctions" value={stats.scheduledAuctions} icon={FaClock} />
        <StatCard title="Listed Products" value={stats.listedProducts} icon={FaGavel} />
        <StatCard title="Payment Pending" value={stats.paymentPending} icon={FaClock} />
        <StatCard title="Delivery Pending" value={stats.deliveryPending} icon={FaClock} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Total Balance Chart */}
        <div className="bg-white p-4 md:p-6 lg:p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-primary/20 group">
          <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 group-hover:text-primary-dark transition-colors duration-300">Total Balance Overview</h2>
          </div>
          <div className="h-[400px] w-full overflow-x-hidden">
            <ResponsiveContainer width="100%" height="100%" className="-ml-4 md:ml-0">
              <BarChart
                data={[{ name: 'Total Balance', value: Number(stats.totalBalance), color: '#0284c7' }]}
                margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="name" />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                    padding: '12px'
                  }}
                  formatter={(value) => [`AED ${value.toFixed(2)}`, 'Amount']}
                />
                <Bar
                  dataKey="value"
                  fill="#4BC0C0"
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                >
                  <Cell fill="#0284c7">
                    <animate attributeName="fill" values="#0284c7;#0369a1;#0284c7" dur="2s" repeatCount="indefinite" />
                  </Cell>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          </div>
        </div>

        {/* Total Profit Chart */}
        <div className="bg-white p-4 md:p-6 lg:p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-primary/20 group">
          <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 group-hover:text-primary-dark transition-colors duration-300">Total Profit Overview</h2>
          </div>
          <div className="h-[400px] w-full overflow-x-hidden">
            <ResponsiveContainer width="100%" height="100%" className="-ml-4 md:ml-0">
              <BarChart
                data={[{ name: 'Total Profit', value: Number(stats.totalProfit), color: '#16a34a' }]}
                margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="name" />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                    padding: '12px'
                  }}
                  formatter={(value) => [`AED ${value.toFixed(2)}`, 'Amount']}
                />
                <Bar
                  dataKey="value"
                  fill="#FF6384"
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                >
                  <Cell fill="#FF6384">
                    <animate attributeName="fill" values="#FF6384;#FF4757;#FF6384" dur="2s" repeatCount="indefinite" />
                  </Cell>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          </div>
        </div>

        {/* Other Metrics Chart */}
        <div className="lg:col-span-2 bg-white p-4 md:p-6 lg:p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-primary/20 group">
          <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 group-hover:text-primary-dark transition-colors duration-300">Platform Metrics Overview</h2>
          </div>
          <div className="h-[500px] w-full overflow-x-hidden">
            <ResponsiveContainer width="100%" height="100%" className="-ml-4 md:ml-0">
              <BarChart
                data={metricsData}
                margin={isMobileView ?
                  { top: 20, right: 10, left: 0, bottom: 80 } :
                  { top: 20, right: 40, left: 40, bottom: 80 }
                }
                barGap={8}
                barCategoryGap={30}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                {!isMobileView && (
                  <XAxis
                    dataKey="name"
                    tick={<CustomXAxisTick />}
                    height={60}
                    tickLine={false}
                  />)}
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                    padding: '12px'
                  }}
                  labelStyle={{ color: '#1e293b', fontWeight: 500 }}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: '20px',
                    fontSize: '12px',
                    color: '#64748b'
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="#4BC0C0"
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                  maxBarSize={30}
                  label={<CustomBarLabel />}
                >
                  {metricsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          </div>
        </div>

        {/* Auction Status Distribution */}
        <div className="lg:col-span-2 bg-white p-4 md:p-6 lg:p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-primary/20 group">
          <div className="flex flex-col h-full">
          <h2 className="text-xl font-bold text-gray-800 group-hover:text-primary-dark transition-colors duration-300 mb-6">Auction Status Distribution</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                    padding: '12px'
                  }}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: '20px',
                    fontSize: '12px',
                    color: '#64748b'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
