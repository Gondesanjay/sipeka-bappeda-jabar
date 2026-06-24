import React from 'react';
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
} from 'recharts';
import { Building2, Target, Wallet, AlertTriangle } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { MapVisualization } from './MapVisualization';
import { IntegritasDataWidget } from './IntegritasDataWidget';
import {
  getDashboardMetrics,
  getTopDinasBudget,
  getNotifications,
  formatShortRupiah,
} from '../data/mockData';

interface DashboardViewProps {
  filters: {
    tahun: number;
    kuartal: number;
    opd: string;
    wilayah: string;
  };
  onCardClick?: (type: string) => void;
  onWilayahChange?: (wilayah: string) => void;
}

const EWS_COLORS = {
  green: '#10B981',
  amber: '#F59E0B',
  red: '#EF4444',
};

export const DashboardView: React.FC<DashboardViewProps> = ({ filters, onCardClick, onWilayahChange }) => {
  const metrics = getDashboardMetrics(filters);
  const budgetData = getTopDinasBudget(filters);
  const notifications = getNotifications();

  const chartData = budgetData.map((item) => ({
    name: item.dinas,
    fullName: item.dinas,
    Target: item.target / 1e9,
    Realisasi: item.realisasi / 1e9,
  }));

  const ewsPieData = [
    { name: 'Hijau (Aman)', value: metrics.hijauCount, color: EWS_COLORS.green },
    { name: 'Kuning (Waspada)', value: metrics.kuningCount, color: EWS_COLORS.amber },
    { name: 'Merah (Kritis)', value: metrics.kritisCount, color: EWS_COLORS.red },
  ];

  const handleMetricClick = (type: string) => {
    if (onCardClick) {
      onCardClick(type);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <MetricCard
          icon={Building2}
          label="Total Program"
          value={metrics.totalPrograms}
          subtext="+12 dari kuartal lalu"
          trend={{ value: 4.8, direction: 'up' }}
        />
        <MetricCard
          icon={Target}
          label="Realisasi Fisik"
          value={`${metrics.realisasiFisik}%`}
          trend={{ value: 2.3, direction: 'up' }}
        />
        <MetricCard
          icon={Wallet}
          label="Serapan Anggaran"
          value={formatShortRupiah(metrics.serapanAnggaran)}
          subtext={`Target: ${formatShortRupiah(metrics.targetAnggaran)}`}
          trend={{ value: 1.2, direction: 'up' }}
        />
        <MetricCard
          icon={AlertTriangle}
          label="Status Kritis"
          value={metrics.kritisCount}
          subtext="Membutuhkan Perhatian"
          variant="danger"
          onClick={() => handleMetricClick('kritis')}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-card border border-slate-100 p-6">
          <h3 className="text-h3 text-slate-800 mb-4">Tren Target vs Realisasi (Top 5 OPD)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis type="number" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={{ stroke: '#E2E8F0' }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={190}
                  tick={{ fill: '#64748B', fontSize: 11, fontWeight: 500 }}
                  axisLine={{ stroke: '#E2E8F0' }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(15,23,42,.12)',
                  }}
                  formatter={(value) => {
                    const numValue = typeof value === 'number' ? value : 0;
                    return [`${numValue.toFixed(1)} Miliar`, ''];
                  }}
                  labelFormatter={(label, payload) => payload?.[0]?.payload?.fullName || label}
                />
                <defs>
                  <linearGradient id="gradTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E2E8F0" stopOpacity={1} />
                    <stop offset="100%" stopColor="#CBD5E1" stopOpacity={1} />
                  </linearGradient>
                  <linearGradient id="gradRealisasi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1E3A8A" stopOpacity={1} />
                    <stop offset="100%" stopColor="#0F2444" stopOpacity={1} />
                  </linearGradient>
                </defs>
                <Bar dataKey="Target" fill="url(#gradTarget)" radius={[6, 6, 6, 6]} barSize={14} />
                <Bar dataKey="Realisasi" fill="url(#gradRealisasi)" radius={[6, 6, 6, 6]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-8 mt-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-200"></span>
              <span className="text-sm text-slate-600">Target Anggaran</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary"></span>
              <span className="text-sm text-slate-600">Realisasi Anggaran</span>
            </div>
          </div>
        </div>

        {/* EWS Summary */}
        <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6">
          <h3 className="text-h3 text-slate-800 mb-4">Ringkasan EWS</h3>

          {/* Donut Chart */}
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ewsPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {ewsPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(15,23,42,.12)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Status Summary */}
          <div className="space-y-3 mt-4">
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="text-sm text-emerald-800">Hijau</span>
              </div>
              <span className="font-semibold text-emerald-800 tabular-nums">{metrics.hijauCount} Program</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="text-sm text-amber-800">Kuning</span>
              </div>
              <span className="font-semibold text-amber-800 tabular-nums">{metrics.kuningCount} Program</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-rose-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span className="text-sm text-rose-800">Merah</span>
              </div>
              <span className="font-semibold text-rose-800 tabular-nums">{metrics.kritisCount} Program</span>
            </div>
          </div>

          {/* Recent Notifications */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <h4 className="text-sm font-semibold text-slate-800 mb-3">Notifikasi Terbaru</h4>
            <div className="space-y-2">
              {notifications.slice(0, 3).map((notif) => (
                <div
                  key={notif.id}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <span
                    className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0
                      ${notif.status === 'red' ? 'bg-rose-500' : 'bg-amber-500'}`}
                  />
                  <div className="min-w-0">
                    <p className="text-sm text-slate-700 line-clamp-1">{notif.programName.split(' ').slice(0, 4).join(' ')}...</p>
                    <p className="text-xs text-slate-400">{notif.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Map Visualization Section */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-5">
        <div className="lg:col-span-7">
          <MapVisualization filters={filters} onWilayahSelect={onWilayahChange} />
        </div>
        <div className="lg:col-span-3">
          <IntegritasDataWidget />
        </div>
      </div>
    </div>
  );
};
