import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/LoginPage';
import { Sidebar, ViewType } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { EWSView } from './components/EWSView';
import { TableView } from './components/TableView';
import { LaporanEvaluasi } from './components/LaporanEvaluasi';
import { NotificationsView } from './components/NotificationsView';
import { SettingsView } from './components/SettingsView';
import { DetailProyekModal } from './components/DetailProyekModal';
import { programs, type Program } from './data/mockData';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filters, setFilters] = useState({
    tahun: 2026,
    kuartal: 1,
    opd: '',
    wilayah: '',
  });
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleWilayahChange = (wilayah: string) => {
    setFilters((prev) => ({ ...prev, wilayah }));
  };

  const handleMetricClick = (type: string) => {
    if (type === 'kritis') {
      setCurrentView('ews');
    }
  };

  const handleNavigateToProject = (projectId: string) => {
    const project = programs.find((item) => item.id === projectId) ?? null;
    setSelectedProgram(project);
    setIsDetailModalOpen(Boolean(project));
    setCurrentView('realisasi');
  };

  const handleCloseProjectModal = () => {
    setIsDetailModalOpen(false);
    setSelectedProgram(null);
  };

  const notificationCount = 8;

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView filters={filters} onCardClick={handleMetricClick} onWilayahChange={handleWilayahChange} />;
      case 'ews':
        return <EWSView filters={filters} />;
      case 'realisasi':
        return <TableView filters={filters} viewType="realisasi" />;
      case 'serapan':
        return <TableView filters={filters} viewType="serapan" />;
      case 'laporanEvaluasi':
        return <LaporanEvaluasi filters={filters} />;
      case 'notifikasi':
        return <NotificationsView onNavigateToProject={handleNavigateToProject} />;
      case 'pengaturan':
        return <SettingsView />;
      default:
        return <DashboardView filters={filters} onCardClick={handleMetricClick} onWilayahChange={handleWilayahChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-surface flex animate-fade-in">
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        onViewChange={handleViewChange}
        notificationCount={notificationCount}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300
          ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}
      >
        {/* Header */}
        <Header
          currentView={currentView}
          notificationCount={notificationCount}
          onNotificationClick={() => setCurrentView('notifikasi')}
          filters={filters}
          onFiltersChange={handleFilterChange}
        />

        {/* Content */}
        <main className="min-h-[calc(100vh-4rem)]">
          {renderView()}
        </main>
      </div>

      <DetailProyekModal isOpen={isDetailModalOpen} program={selectedProgram} onClose={handleCloseProjectModal} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
