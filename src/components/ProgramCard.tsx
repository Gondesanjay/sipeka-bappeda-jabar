import React from 'react';
import { Building2, ArrowRight } from 'lucide-react';
import { Program } from '../data/mockData';
import { ProgressBar } from './ProgressBar';
import { formatShortRupiah } from '../data/mockData';

interface ProgramCardProps {
  program: Program;
  onClick?: () => void;
}

const borderColor = {
  green: 'border-l-emerald-500',
  amber: 'border-l-amber-500',
  red: 'border-l-rose-500',
};

export const ProgramCard: React.FC<ProgramCardProps> = ({
  program,
  onClick,
}) => {
  const serapanPercentage = ((program.realisasiKeuangan / program.paguAnggaran) * 100).toFixed(0);

  return (
    <div
      className={`bg-white rounded-2xl shadow-card border border-slate-100 border-l-4
        ${borderColor[program.status]} transition-all duration-300 ease-in-out hover:shadow-pop hover:-translate-y-0.5`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-base font-semibold text-slate-800 line-clamp-2 leading-tight">
            {program.name}
          </h3>
        </div>

        <div className="flex items-center gap-2 text-slate-500 mb-4">
          <Building2 className="w-4 h-4" />
          <span className="text-sm">{program.dinas}</span>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-500">Realisasi Fisik</span>
            </div>
            <ProgressBar value={program.realisasiFisik} status={program.status} />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Serapan Anggaran</span>
              <span className="text-sm font-semibold text-slate-700 tabular-nums">
                {serapanPercentage}%
              </span>
            </div>
            <div className="mt-1 text-xs text-slate-400">
              {formatShortRupiah(program.realisasiKeuangan)} / {formatShortRupiah(program.paguAnggaran)}
            </div>
          </div>
        </div>

        <button
          onClick={onClick}
          className="mt-5 w-full py-2.5 px-5 rounded-full border border-slate-200 text-slate-700 font-medium
            text-sm flex items-center justify-center gap-2 transition-all duration-300 ease-in-out
            hover:border-slate-300 hover:text-slate-900 hover:scale-[1.02] hover:shadow-md
            active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-1"
        >
          <span>Tinjau Data</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
