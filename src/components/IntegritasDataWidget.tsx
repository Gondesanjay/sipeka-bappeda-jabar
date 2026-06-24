import React from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export const IntegritasDataWidget: React.FC = () => {
  return (
    <div className="relative w-full h-full min-h-[320px] rounded-xl overflow-hidden bg-[#0F2444] border border-white/5 flex flex-col">
      {/* Background subtle pattern */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative z-10 flex flex-col h-full p-6">
        {/* Shield icon */}
        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-white/90 tracking-wide mb-3">
          Integritas Data
        </h3>

        {/* Description text */}
        <p className="text-sm text-white/50 leading-relaxed flex-1">
          Sistem secara otomatis memverifikasi setiap transaksi dengan pagu murni yang ditetapkan APBD untuk mencegah over-budgeting.
        </p>

        {/* Action link */}
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#60A5FA] hover:text-[#93C5FD] transition-colors duration-200 group"
        >
          <span>Pelajari Protokol</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  );
};
