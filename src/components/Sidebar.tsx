import React from 'react';
import {
  LayoutDashboard,
  AlertTriangle,
  BarChart3,
  Wallet,
  ClipboardList,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export type ViewType = 'dashboard' | 'ews' | 'realisasi' | 'serapan' | 'laporanEvaluasi' | 'notifikasi' | 'pengaturan';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  notificationCount: number;
  collapsed?: boolean;
  onToggle?: () => void;
}

interface NavItem {
  id: ViewType;
  icon: React.ElementType;
  label: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'ews', icon: AlertTriangle, label: 'Early Warning System' },
  { id: 'realisasi', icon: BarChart3, label: 'Realisasi Fisik' },
  { id: 'serapan', icon: Wallet, label: 'Serapan Anggaran' },
  { id: 'laporanEvaluasi', icon: ClipboardList, label: 'Laporan Evaluasi' },
  { id: 'notifikasi', icon: Bell, label: 'Notifikasi' },
  { id: 'pengaturan', icon: Settings, label: 'Pengaturan' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  notificationCount,
  collapsed = false,
  onToggle,
}) => {
  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-white border-r border-slate-100
        transition-all duration-300 z-40 flex flex-col
        ${collapsed ? 'w-16' : 'w-64'}`}
    >
      {/* Logo */}
      <div className={`h-16 flex items-center border-b border-slate-100 ${collapsed ? 'justify-center' : 'px-6'}`}>
        {collapsed ? (
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <div>
              <h1 className="font-bold text-primary text-lg">SIPEKA BAPPEDA</h1>
              <p className="text-xs text-slate-400">Jawa Barat</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            const Icon = item.icon;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                    ${collapsed ? 'justify-center' : ''}
                    ${isActive
                      ? 'bg-primary-container text-primary font-medium'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  title={collapsed ? item.label : undefined}
                >
                  <div className="relative">
                    <Icon className="w-5 h-5" />
                    {item.id === 'notifikasi' && notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px]
                        font-bold rounded-full flex items-center justify-center">
                        {notificationCount > 9 ? '9+' : notificationCount}
                      </span>
                    )}
                  </div>
                  {!collapsed && <span className="text-sm">{item.label}</span>}
                  {isActive && !collapsed && (
                    <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Toggle */}
      {onToggle && (
        <div className="p-3 border-t border-slate-100">
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg
              text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="text-xs">Collapse</span>
              </>
            )}
          </button>
        </div>
      )}
    </aside>
  );
};
