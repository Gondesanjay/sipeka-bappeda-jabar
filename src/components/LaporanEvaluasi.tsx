import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Calendar, FileText } from 'lucide-react';
import { programs } from '../data/mockData';

interface LaporanEvaluasiProps {
  filters: {
    tahun: number;
    kuartal: number;
    opd: string;
    wilayah: string;
  };
}

type SortField = 'name' | 'targetSelesai' | 'statusLaporan';
type SortDirection = 'asc' | 'desc';

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

// Mock status laporan
const statusLaporanOptions = ['Belum Dikirim', 'Dalam Review', 'Disetujui', 'Revisi Diminta'];
const getRandomStatus = (id: string): string => {
  const index = id.charCodeAt(0) % statusLaporanOptions.length;
  return statusLaporanOptions[index];
};

// Mock target selesai dates
const getTargetSelesai = (id: string): string => {
  const index = id.charCodeAt(0) % 12;
  const month = String(index + 1).padStart(2, '0');
  return `2026-${month}-15`;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
};

const getStatusBadgeClass = (status: string): string => {
  switch (status) {
    case 'Belum Dikirim':
      return 'bg-slate-100 text-slate-700';
    case 'Dalam Review':
      return 'bg-amber-100 text-amber-700';
    case 'Disetujui':
      return 'bg-emerald-100 text-emerald-700';
    case 'Revisi Diminta':
      return 'bg-rose-100 text-rose-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
};

export const LaporanEvaluasi: React.FC<LaporanEvaluasiProps> = ({ filters }) => {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const filteredPrograms = useMemo(() => {
    let result = programs.filter(
      (p) => p.tahun === filters.tahun && p.kuartal === filters.kuartal
    );

    if (filters.opd) {
      result = result.filter((p) => p.dinas === filters.opd);
    }

    if (filters.wilayah) {
      result = result.filter((p) => p.wilayah === filters.wilayah);
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
        case 'targetSelesai':
          return getTargetSelesai(p.id);
        case 'statusLaporan':
          return getRandomStatus(p.id);
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
      return sortDirection === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

    return result;
  }, [filters, search, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredPrograms.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedPrograms = filteredPrograms.slice(startIndex, startIndex + rowsPerPage);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const SortableHeader: React.FC<{ field: SortField; label: string }> = ({ field, label }) => (
    <th
      onClick={() => handleSort(field)}
      className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer
        hover:text-slate-700 transition-colors"
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
              placeholder="Cari proyek atau OPD..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                placeholder:text-slate-400"
            />
          </div>
          <div className="text-sm text-slate-500">
            Menampilkan <span className="font-semibold">{filteredPrograms.length}</span> proyek
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <SortableHeader field="name" label="Nama Proyek" />
                <SortableHeader field="targetSelesai" label="Target Selesai" />
                <SortableHeader field="statusLaporan" label="Status Laporan" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedPrograms.map((program) => {
                const targetSelesai = getTargetSelesai(program.id);
                const statusLaporan = getRandomStatus(program.id);

                return (
                  <tr
                    key={program.id}
                    className="hover:bg-slate-50/50 transition-colors duration-300 ease-in-out"
                  >
                    <td className="px-4 py-5">
                      <div className="max-w-xs">
                        <p className="text-sm font-medium text-slate-800 line-clamp-2">{program.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{program.dinas}</p>
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-sm">{formatDate(targetSelesai)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium
                        ${getStatusBadgeClass(statusLaporan)}`}>
                        <FileText className="w-3.5 h-3.5" />
                        {statusLaporan}
                      </span>
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

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-2 py-1.5 text-xs rounded-lg font-medium transition-colors ${currentPage === pageNum
                      ? 'bg-primary text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                  {pageNum}
                </button>
              );
            })}

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
    </div>
  );
};
