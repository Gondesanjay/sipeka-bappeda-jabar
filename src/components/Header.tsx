import React, { useState } from 'react';
import { Bell, ChevronDown, FileText, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ViewType } from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { yearOptions, quarterOptions, opdList, programs, formatShortRupiah, getAvailableWilayahOptions, getFilteredPrograms } from '../data/mockData';

interface HeaderProps {
  currentView: ViewType;
  notificationCount: number;
  onNotificationClick: () => void;
  filters: {
    tahun: number;
    kuartal: number;
    opd: string;
    wilayah: string;
  };
  onFiltersChange: (filters: {
    tahun: number;
    kuartal: number;
    opd: string;
    wilayah: string;
  }) => void;
}

const viewLabels: Record<ViewType, string> = {
  dashboard: 'Dashboard Eksekutif',
  ews: 'Early Warning System',
  realisasi: 'Data Realisasi Fisik',
  serapan: 'Data Serapan Anggaran',
  laporanEvaluasi: 'Laporan Evaluasi',
  notifikasi: 'Notifikasi',
  pengaturan: 'Pengaturan',
};

export const Header: React.FC<HeaderProps> = ({
  currentView,
  notificationCount,
  onNotificationClick,
  filters,
  onFiltersChange,
}) => {
  const [showExport, setShowExport] = useState(false);
  const { user } = useAuth();
  const availableWilayahOptions = getAvailableWilayahOptions(getFilteredPrograms(filters, programs));

  const getStatusLabel = (status: 'green' | 'amber' | 'red') => {
    if (status === 'green') return 'AMAN';
    if (status === 'amber') return 'WASPADA';
    return 'KRITIS';
  };

  const getReportData = () => {
    const filteredPrograms = getFilteredPrograms(filters, programs);

    if (currentView === 'serapan') {
      const headers = ['Nama Kegiatan', 'Dinas/OPD', 'Pagu Anggaran', 'Realisasi Keuangan', 'Persentase Penyerapan', 'Status'];
      const rows = filteredPrograms.map((program) => {
        const penyerapanPersen = program.paguAnggaran > 0
          ? (program.realisasiKeuangan / program.paguAnggaran) * 100
          : 0;

        return [
          program.name,
          program.dinas,
          formatShortRupiah(program.paguAnggaran),
          formatShortRupiah(program.realisasiKeuangan),
          `${penyerapanPersen.toFixed(1)}%`,
          getStatusLabel(program.status),
        ];
      });

      return { headers, rows, title: `Laporan Serapan Anggaran ${filters.tahun}` };
    }

    const headers = ['Nama Kegiatan', 'Dinas/OPD', 'Realisasi Fisik', 'Deviasi', 'Status'];
    const rows = filteredPrograms.map((program) => {
      const deviasi = program.realisasiFisik - 50;
      const deviasiLabel = `${deviasi >= 0 ? '+' : ''}${deviasi.toFixed(0)}%`;

      return [
        program.name,
        program.dinas,
        `${program.realisasiFisik.toFixed(0)}%`,
        deviasiLabel,
        getStatusLabel(program.status),
      ];
    });

    return { headers, rows, title: `Laporan Realisasi Fisik ${filters.tahun}` };
  };

  const handleExportExcel = () => {
    const { headers, rows, title } = getReportData();
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/\s+/g, '_')}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    setShowExport(false);
  };

  const handleExportPDF = () => {
    const { headers, rows, title } = getReportData();
    const doc = new jsPDF();
    const dateText = `Tanggal cetak: ${new Date().toLocaleDateString('id-ID')}`;

    doc.setFontSize(16);
    doc.text(title, 14, 16);
    doc.setFontSize(10);
    doc.text(dateText, 14, 24);

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 32,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [15, 23, 42], textColor: 255 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      theme: 'striped',
    });

    doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
    setShowExport(false);
  };

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-400">Home</span>
        <span className="text-slate-300">/</span>
        <span className="text-sm font-semibold text-slate-800">{viewLabels[currentView]}</span>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        {/* Year Filter */}
        <select
          value={filters.tahun}
          onChange={(e) => onFiltersChange({ ...filters, tahun: Number(e.target.value) })}
          className="h-9 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            cursor-pointer hover:border-slate-300 transition-colors"
        >
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              Tahun {year}
            </option>
          ))}
        </select>

        {/* Quarter Filter */}
        <select
          value={filters.kuartal}
          onChange={(e) => onFiltersChange({ ...filters, kuartal: Number(e.target.value) })}
          className="h-9 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            cursor-pointer hover:border-slate-300 transition-colors"
        >
          {quarterOptions.map((q) => (
            <option key={q.value} value={q.value}>
              {q.label}
            </option>
          ))}
        </select>

        {/* OPD Filter */}
        <select
          value={filters.opd}
          onChange={(e) => onFiltersChange({ ...filters, opd: e.target.value })}
          className="h-9 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            cursor-pointer hover:border-slate-300 transition-colors max-w-[200px] truncate"
        >
          <option value="">Semua OPD</option>
          {opdList.map((opd) => (
            <option key={opd} value={opd}>
              {opd}
            </option>
          ))}
        </select>

        {/* Wilayah Filter */}
        <select
          value={filters.wilayah}
          onChange={(e) => onFiltersChange({ ...filters, wilayah: e.target.value })}
          className="h-9 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            cursor-pointer hover:border-slate-300 transition-colors"
        >
          <option value="">Semua Wilayah</option>
          {availableWilayahOptions.map((group) => (
            <option key={group.wilayah} value={group.wilayah}>
              {group.label}
            </option>
          ))}
        </select>

        {(currentView === 'realisasi' || currentView === 'serapan') && (
          <div className="relative">
            <button
              onClick={() => setShowExport(!showExport)}
              className="h-9 px-4 bg-primary text-white rounded-lg text-sm font-medium
                flex items-center gap-2 hover:bg-primary-hover transition-colors"
            >
              Ekspor Laporan
              <ChevronDown className="w-4 h-4" />
            </button>

            {showExport && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-pop border border-slate-100 py-2 z-50">
                <button
                  onClick={handleExportPDF}
                  className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50
                  flex items-center gap-3 transition-colors"
                >
                  <FileText className="w-4 h-4 text-rose-500" />
                  Download PDF
                </button>
                <button
                  onClick={handleExportExcel}
                  className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50
                  flex items-center gap-3 transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  Download Excel
                </button>
              </div>
            )}
          </div>
        )}

        {/* Notification */}
        <button
          onClick={onNotificationClick}
          className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-50
            text-slate-600 hover:text-slate-900 transition-colors"
        >
          <Bell className="w-5 h-5" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px]
              font-bold rounded-full flex items-center justify-center">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-100">
          <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center">
            <span className="text-primary font-semibold text-sm">
              {user?.avatar || 'IR'}
            </span>
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-medium text-slate-800">
              {user?.name || 'Ikmal Rizal'}
            </p>
            <p className="text-xs text-slate-500">
              {user?.role || 'Kepala Bappeda'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
