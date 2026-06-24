import React from 'react';
import { X, Building2, Wallet, TrendingUp, FileText } from 'lucide-react';
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, LabelList } from 'recharts';
import { Program, formatShortRupiah } from '../data/mockData';

interface DetailProyekModalProps {
    isOpen: boolean;
    program: Program | null;
    onClose: () => void;
}

const statusMeta: Record<Program['status'], { label: string; badgeClass: string }> = {
    green: { label: 'Aman', badgeClass: 'bg-emerald-500/10 text-emerald-400' },
    amber: { label: 'Waspada', badgeClass: 'bg-amber-500/10 text-amber-400' },
    red: { label: 'Kritis', badgeClass: 'bg-rose-500/10 text-rose-400' },
};

export const DetailProyekModal: React.FC<DetailProyekModalProps> = ({ isOpen, program, onClose }) => {
    if (!isOpen || !program) return null;

    const status = statusMeta[program.status];
    const progressPercent = Math.min(Math.max(program.realisasiFisik, 0), 100);
    const barColorClass = progressPercent >= 80 ? 'bg-green-500' : progressPercent >= 30 ? 'bg-yellow-500' : 'bg-red-500';
    const paguValue = program.paguAnggaran / 1e6;
    const serapanValue = program.realisasiKeuangan / 1e6;
    const serapanPersen = paguValue > 0 ? (serapanValue / paguValue) * 100 : 0;
    const serapanBarColor = serapanPersen > 90 ? '#ef4444' : '#f59e0b';
    const chartData = [
        {
            name: 'Pagu',
            pagu: paguValue,
            serapan: 0,
        },
        {
            name: 'Serapan',
            pagu: 0,
            serapan: serapanValue,
        },
    ];

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm px-4"
            onClick={onClose}
        >
            <div
                className={`w-full max-w-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 shadow-2xl rounded-2xl p-6 transition-all duration-300 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium text-slate-400">Detail Proyek</p>
                        <h3 className="text-xl font-semibold text-white mt-1">{program.name}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                        aria-label="Tutup detail proyek"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                    <div className="flex items-center justify-between text-sm text-slate-400">
                        <span>Realisasi Fisik</span>
                        <span className="font-semibold text-white">{progressPercent.toFixed(0)}%</span>
                    </div>
                    <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-800">
                        <div className={`h-full rounded-full transition-all duration-500 ${barColorClass}`} style={{ width: `${progressPercent}%` }} />
                    </div>
                    <div className="mt-2 flex justify-between text-xs text-slate-500">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                    </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                        <div className="flex items-center gap-2 text-slate-400">
                            <Building2 className="w-4 h-4" />
                            <span className="text-sm">Nama Proyek</span>
                        </div>
                        <p className="mt-2 text-sm font-semibold text-white">{program.name}</p>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                        <div className="flex items-center gap-2 text-slate-400">
                            <FileText className="w-4 h-4" />
                            <span className="text-sm">Dinas Terkait</span>
                        </div>
                        <p className="mt-2 text-sm font-semibold text-white">{program.dinas}</p>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                        <div className="flex items-center gap-2 text-slate-400">
                            <Wallet className="w-4 h-4" />
                            <span className="text-sm">Pagu Anggaran</span>
                        </div>
                        <p className="mt-2 text-sm font-semibold text-white">{formatShortRupiah(program.paguAnggaran)}</p>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                        <div className="flex items-center gap-2 text-slate-400">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-sm">Serapan Anggaran</span>
                        </div>
                        <p className="mt-2 text-sm font-semibold text-white">{formatShortRupiah(program.realisasiKeuangan)}</p>
                    </div>
                </div>

                <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                    <div className="mb-3 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400">Perbandingan Anggaran</p>
                            <p className="text-xs text-slate-500">Pagu vs Serapan dalam jutaan rupiah • Serapan {serapanPersen.toFixed(1)}%</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.badgeClass}`}>
                            {status.label}
                        </span>
                    </div>
                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} barCategoryGap={10}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis domain={['auto', 'auto']} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(148, 163, 184, 0.12)' }}
                                    contentStyle={{
                                        backgroundColor: '#0f172a',
                                        border: '1px solid #334155',
                                        borderRadius: '10px',
                                        color: '#f8fafc',
                                    }}
                                    formatter={(value: number) => [`Rp ${(value).toFixed(0)} jt`, '']}
                                />
                                <Bar dataKey="pagu" fill="#3b82f6" radius={[6, 6, 0, 0]}>
                                    <LabelList dataKey="pagu" position="top" formatter={(value: number) => `${value.toFixed(0)} jt`} fill="#e2e8f0" />
                                </Bar>
                                <Bar dataKey="serapan" fill={serapanBarColor} radius={[6, 6, 0, 0]}>
                                    <LabelList dataKey="serapan" position="top" formatter={(value: number) => `${value.toFixed(0)} jt`} fill="#f8fafc" />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-sm text-slate-400">Status Laporan</p>
                            <p className="mt-1 text-sm font-semibold text-white">{status.label}</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.badgeClass}`}>
                            {status.label}
                        </span>
                    </div>
                    <p className="mt-3 text-sm text-slate-400">
                        Data proyek ini berasal dari sumber mock data sistem EWS dan dapat digunakan untuk tinjauan cepat sebelum evaluasi lanjutan.
                    </p>
                </div>
            </div>
        </div>
    );
};
