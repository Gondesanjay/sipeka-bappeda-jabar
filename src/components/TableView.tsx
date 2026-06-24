import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, CheckCircle2, AlertTriangle, AlertCircle, AlertOctagon } from 'lucide-react';
import { programs, formatShortRupiah, matchesWilayahFilter, type Program } from '../data/mockData';
import { EWSBadge } from './EWSBadge';
import { DetailProyekModal } from './DetailProyekModal';

interface TableViewProps {
  filters: {
    tahun: number;
    kuartal: number;
    opd: string;
    wilayah: string;
  };
  viewType?: 'realisasi' | 'serapan';
}

type SortField = 'name' | 'dinas' | 'paguAnggaran' | 'realisasiKeuangan' | 'realisasiFisik' | 'deviasi';
type SortDirection = 'asc' | 'desc';

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

const getRealisasiStatus = (program: Program) => {
  const deviasi = program.realisasiFisik - 50;
  if (program.realisasiFisik >= 80 || deviasi >= 10) return 'green';
  if (program.realisasiFisik >= 40 || deviasi >= -10) return 'amber';
  return 'red';
};

const getSerapanStatus = (program: Program) => {
  const penyerapanPersen = program.paguAnggaran > 0
    ? (program.realisasiKeuangan / program.paguAnggaran) * 100
    : 0;

  if (penyerapanPersen >= 80) return 'green';
  if (penyerapanPersen >= 30) return 'amber';
  return 'red';
};

export const TableView: React.FC<TableViewProps> = ({ filters, viewType = 'realisasi' }) => {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const filteredPrograms = useMemo(() => {
    let result = programs.filter(
      (p) => p.tahun === filters.tahun && p.kuartal === filters.kuartal
    );

    if (filters.opd) {
      result = result.filter((p) => p.dinas === filters.opd);
    }

    if (filters.wilayah) {
      result = result.filter((p) => matchesWilayahFilter(p, filters.wilayah));
    }

    if (search.trim()) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.dinas.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    const sortValue = (p: typeof result[0]): string | number => {
      switch (sortField) {
        case 'name':
          return p.name;
        case 'dinas':
          return p.dinas;
        case 'paguAnggaran':
          return p.paguAnggaran;
        case 'realisasiKeuangan':
          return p.realisasiKeuangan;
        case 'realisasiFisik':
          return p.realisasiFisik;
        case 'deviasi':
          return p.realisasiFisik - 50;
        default:
          return p.name;
      }
    };

    result.sort((a, b) => {
      const aVal = sortValue(a);
      const bVal = sortValue(b);
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      const aNum = typeof aVal === 'number' ? aVal : 0;
      const bNum = typeof bVal === 'number' ? bVal : 0;
      return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
    });

    return result;
  }, [filters, search, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredPrograms.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedPrograms = filteredPrograms.slice(startIndex, startIndex + rowsPerPage);
  const isSerapanView = viewType === 'serapan';

  const totalPagu = filteredPrograms.reduce((sum, program) => sum + program.paguAnggaran, 0);
  const totalCapaianValue = isSerapanView
    ? filteredPrograms.length > 0
      ? filteredPrograms.reduce((acc, program) => {
        const penyerapanPersen = program.paguAnggaran > 0
          ? (program.realisasiKeuangan / program.paguAnggaran) * 100
          : 0;
        return acc + penyerapanPersen;
      }, 0) / filteredPrograms.length
      : 0
    : filteredPrograms.length > 0
      ? filteredPrograms.reduce((sum, program) => sum + program.realisasiFisik, 0) / filteredPrograms.length
      : 0;
  const totalCapaian = `${totalCapaianValue.toFixed(1)}%`;
  const kritisCount = filteredPrograms.filter((program) => (isSerapanView ? getSerapanStatus(program) : getRealisasiStatus(program)) === 'red').length;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handleOpenModal = (program: Program) => {
    setSelectedProgram(program);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProgram(null);
  };

  const SortableHeader: React.FC<{ field: SortField; label: string; className?: string }> = ({ field, label, className }) => (
    <th
      onClick={() => handleSort(field)}
      className={`px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer
        hover:text-slate-700 transition-colors ${className ?? ''}`}
    >
      <div className="flex items-center gap-1">
        <span>{label}</span>
        <div className="flex flex-col">
          <ChevronLeft className={`w-3 h-2 rotate-90 ${sortField === field && sortDirection === 'asc' ? 'text-primary' : 'text-slate-300'
            }`} />
          <ChevronLeft className={`w-3 h-2 -rotate-90 ${sortField === field && sortDirection === 'desc' ? 'text-primary' : 'text-slate-300'
            }`} />
        </div>
      </div>
    </th>
  );

  return (
    <div className="p-6 space-y-4">
      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-card border border-slate-100 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari kegiatan atau OPD..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                placeholder:text-slate-400"
            />
          </div>
          <div className="text-sm text-slate-500">
            Menampilkan <span className="font-semibold">{filteredPrograms.length}</span> kegiatan
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: 'Total Pagu',
            value: formatShortRupiah(totalPagu),
            accent: 'from-sky-500/20 via-sky-400/10 to-slate-900/80',
            icon: <CheckCircle2 className="w-5 h-5" />,
          },
          {
            title: isSerapanView ? 'Total Realisasi/Capaian' : 'Rata-rata Realisasi Fisik',
            value: totalCapaian,
            accent: 'from-emerald-500/20 via-emerald-400/10 to-slate-900/80',
            icon: <AlertTriangle className="w-5 h-5" />,
          },
          {
            title: 'Proyek Kritis',
            value: `${kritisCount} Proyek`,
            accent: 'from-rose-500/20 via-rose-400/10 to-slate-900/80',
            icon: <AlertOctagon className="w-5 h-5" />
          },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-white/40 bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgba(15,23,42,0.08)] p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            <div className={`inline-flex rounded-xl bg-gradient-to-r ${card.accent} p-2 ${card.title === 'Total Pagu' ? 'bg-blue-100 text-blue-600' : card.title === 'Total Realisasi/Capaian' || card.title === 'Rata-rata Realisasi Fisik' ? 'bg-emerald-100 text-emerald-600' : card.title === 'Proyek Kritis' ? 'bg-rose-100 text-rose-600' : 'text-slate-700'}`}>
              {card.icon}
            </div>
            <p className="mt-3 text-sm text-slate-500">{card.title}</p>
            <p className="mt-1 text-lg font-semibold text-slate-800">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <SortableHeader field="name" label="Nama Kegiatan" />
                <SortableHeader field="dinas" label="Dinas/OPD" />
                {isSerapanView ? (
                  <>
                    <SortableHeader field="paguAnggaran" label="Pagu Anggaran" className="bg-sky-50/80 text-sky-700 min-w-[170px]" />
                    <SortableHeader field="realisasiKeuangan" label="Realisasi Keuangan" className="bg-sky-50/80 text-sky-700 min-w-[180px]" />
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide bg-sky-50/80 text-sky-700 min-w-[170px]">
                      Persentase Penyerapan
                    </th>
                  </>
                ) : (
                  <>
                    <SortableHeader field="realisasiFisik" label="Realisasi Fisik" className="bg-emerald-50/80 text-emerald-700 min-w-[160px]" />
                    <SortableHeader field="deviasi" label="Deviasi" className="bg-emerald-50/80 text-emerald-700 min-w-[120px]" />
                  </>
                )}
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedPrograms.map((program) => {
                const deviasi = program.realisasiFisik - 50;
                const isNegative = deviasi < 0;
                const penyerapanPersen = program.paguAnggaran > 0
                  ? (program.realisasiKeuangan / program.paguAnggaran) * 100
                  : 0;
                const displayStatus = isSerapanView ? getSerapanStatus(program) : getRealisasiStatus(program);

                return (
                  <tr
                    key={program.id}
                    className="cursor-pointer hover:bg-sky-50/70 transition-colors duration-200 ease-in-out"
                    onClick={() => handleOpenModal(program)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        handleOpenModal(program);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                  >
                    <td className="px-4 py-5">
                      <div className="max-w-xs">
                        <p className="text-sm font-medium text-slate-800 line-clamp-2">{program.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{program.id}</p>
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <p className="text-sm text-slate-600">{program.dinas}</p>
                    </td>
                    {isSerapanView ? (
                      <>
                        <td className="px-4 py-5 bg-sky-50/40">
                          <span className="text-sm font-semibold text-slate-700 tabular-nums">
                            {formatShortRupiah(program.paguAnggaran)}
                          </span>
                        </td>
                        <td className="px-4 py-5 bg-sky-50/40">
                          <span className="text-sm font-semibold text-slate-700 tabular-nums">
                            {formatShortRupiah(program.realisasiKeuangan)}
                          </span>
                        </td>
                        <td className="px-4 py-5 bg-sky-50/60">
                          <span className={`text-sm font-semibold tabular-nums ${penyerapanPersen >= 80 ? 'text-emerald-600' : penyerapanPersen >= 30 ? 'text-amber-600' : 'text-rose-600'}`}>
                            {penyerapanPersen.toFixed(1)}%
                          </span>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-5 bg-emerald-50/40">
                          <span className="text-sm font-semibold text-primary tabular-nums">
                            {program.realisasiFisik.toFixed(0)}%
                          </span>
                        </td>
                        <td className="px-4 py-5 bg-emerald-50/40">
                          <span className={`text-sm font-semibold tabular-nums ${isNegative ? 'text-red-500' : 'text-green-500'}`}>
                            {isNegative ? '' : '+'}{deviasi.toFixed(0)}%
                          </span>
                        </td>
                      </>
                    )}
                    <td className="px-4 py-5">
                      <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${displayStatus === 'green' ? 'bg-green-500/10 text-green-500' : displayStatus === 'amber' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'}`}>
                        {displayStatus === 'green' ? <CheckCircle2 className="w-3.5 h-3.5" /> : displayStatus === 'amber' ? <AlertTriangle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                        <span>{displayStatus === 'green' ? 'AMAN' : displayStatus === 'amber' ? 'WASPADA' : 'KRITIS'}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {paginatedPrograms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">Tidak ada data ditemukan.</p>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Menampilkan</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="h-8 px-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700
                focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {ROWS_PER_PAGE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <span className="text-sm text-slate-500">dari {filteredPrograms.length} entri</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1 mx-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium
                      ${currentPage === pageNum
                        ? 'bg-primary text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className="text-slate-400">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="w-8 h-8 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <DetailProyekModal isOpen={isModalOpen} program={selectedProgram} onClose={handleCloseModal} />
    </div>
  );
};
