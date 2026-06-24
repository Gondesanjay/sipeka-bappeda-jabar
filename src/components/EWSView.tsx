import React, { useState, useMemo } from 'react';
import { ProgramCard } from './ProgramCard';
import { DetailProyekModal } from './DetailProyekModal';
import { EWSStatus, programs, Program } from '../data/mockData';

interface EWSViewProps {
  filters: {
    tahun: number;
    kuartal: number;
    opd: string;
    wilayah: string;
  };
}

type FilterStatus = 'all' | EWSStatus;

const statusLabels: Record<FilterStatus, string> = {
  all: 'Semua',
  green: 'Hijau',
  amber: 'Kuning',
  red: 'Merah',
};

const statusCounts = (filteredPrograms: Program[]) => ({
  all: filteredPrograms.length,
  green: filteredPrograms.filter((p) => p.status === 'green').length,
  amber: filteredPrograms.filter((p) => p.status === 'amber').length,
  red: filteredPrograms.filter((p) => p.status === 'red').length,
});

const tabStyles = {
  all: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
  green: 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100',
  amber: 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100',
  red: 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100',
};

const activeTabStyles = {
  all: 'bg-primary text-white',
  green: 'bg-emerald-600 text-white border-emerald-600',
  amber: 'bg-amber-600 text-white border-amber-600',
  red: 'bg-rose-600 text-white border-rose-600',
};

export const EWSView: React.FC<EWSViewProps> = ({ filters }) => {
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');
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

    if (activeFilter !== 'all') {
      result = result.filter((p) => p.status === activeFilter);
    }

    // Sort: red first, then amber, then green
    const statusOrder = { red: 0, amber: 1, green: 2 };
    result.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

    return result;
  }, [filters, activeFilter]);

  const counts = useMemo(
    () =>
      statusCounts(
        programs.filter(
          (p) =>
            p.tahun === filters.tahun &&
            p.kuartal === filters.kuartal &&
            (!filters.opd || p.dinas === filters.opd) &&
            (!filters.wilayah || p.wilayah === filters.wilayah)
        )
      ),
    [filters]
  );

  const handleProgramClick = (programId: string) => {
    const program = programs.find((item) => item.id === programId) ?? null;
    setSelectedProgram(program);
    setIsModalOpen(Boolean(program));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProgram(null);
  };

  const filterOptions: FilterStatus[] = ['all', 'red', 'amber', 'green'];

  return (
    <div className="p-6 space-y-5">
      {/* Filter Pills */}
      <div className="flex flex-wrap items-center gap-3">
        {filterOptions.map((status) => {
          const isActive = activeFilter === status;

          return (
            <button
              key={status}
              onClick={() => setActiveFilter(status)}
              className={`px-4 py-2 rounded-xl font-medium text-sm flex items-center gap-2
                transition-all duration-200 ${isActive ? activeTabStyles[status] : tabStyles[status]}`}
            >
              <span dangerouslySetInnerHTML={{
                __html: status === 'green' ? '🟢' : status === 'amber' ? '🟡' : status === 'red' ? '🔴' : ''
              }} />
              <span>{statusLabels[status]}</span>
              <span
                className={`px-2 py-0.5 rounded-md text-xs font-semibold
                  ${isActive
                    ? 'bg-white/20'
                    : status === 'green'
                      ? 'bg-emerald-200/50'
                      : status === 'amber'
                        ? 'bg-amber-200/50'
                        : status === 'red'
                          ? 'bg-rose-200/50'
                          : 'bg-slate-200'
                  }`}
              >
                {counts[status]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-2">
        {filteredPrograms.map((program) => (
          <ProgramCard
            key={program.id}
            program={program}
            onClick={() => handleProgramClick(program.id)}
          />
        ))}
      </div>

      {filteredPrograms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400">Tidak ada program ditemukan untuk filter yang dipilih.</p>
        </div>
      )}

      <DetailProyekModal isOpen={isModalOpen} program={selectedProgram} onClose={handleCloseModal} />
    </div>
  );
};
