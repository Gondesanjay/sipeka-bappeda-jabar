export type EWSStatus = 'green' | 'amber' | 'red';

export interface Program {
  id: string;
  name: string;
  dinas: string;
  paguAnggaran: number;
  realisasiKeuangan: number;
  realisasiFisik: number;
  tahun: number;
  kuartal: number;
  status: EWSStatus;
  wilayah: string;
  kotaKabupaten: string;
  lastUpdated: string;
}


export interface DinasBudget {
  dinas: string;
  target: number;
  realisasi: number;
}

export interface Notification {
  id: string;
  programId: string;
  programName: string;
  dinas: string;
  status: EWSStatus;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface ProgramFilters {
  tahun: number;
  kuartal: number;
  opd?: string;
  wilayah?: string;
}

export const dinasList = [
  'Dinas Pekerjaan Umum dan Penataan Ruang',
  'Dinas Pendidikan dan Kebudayaan',
  'Dinas Kesehatan',
  'Dinas Perhubungan',
  'Dinas Komunikasi dan Informatika',
  'Dinas Pariwisata dan Ekonomi Kreatif',
  'Dinas Perumahan dan Kawasan Permukiman',
  'Dinas Lingkungan Hidup',
  'Dinas Sosial',
  'Dinas Kependudukan dan Pencatatan Sipil',
  'Dinas Tenaga Kerja dan Transmigrasi',
  'Dinas Pemberdayaan Perempuan dan Perlindungan Anak',
  'Dinas Ketahanan Pangan',
  'Dinas Perpustakaan dan Kearsipan',
  'Badan Perencanaan Pembangunan Daerah',
  'Badan Pengelolaan Keuangan dan Aset Daerah',
];

export const wilayahGroups = [
  { value: 'bodebek', label: 'Bodebek', wilayah: 'Wilayah Bodebek', cities: ['Kota Bogor', 'Kab. Bogor', 'Kota Depok', 'Kab. Bekasi', 'Kota Bekasi'] },
  { value: 'purwasuka', label: 'Purwasuka', wilayah: 'Wilayah Purwasuka', cities: ['Karawang', 'Purwakarta', 'Subang', 'Bekasi'] },
  { value: 'bandung-raya', label: 'Bandung Raya', wilayah: 'Wilayah Bandung Raya', cities: ['Bandung', 'Kab. Bandung', 'Bandung Barat', 'Cimahi'] },
  { value: 'ciayumajakuning', label: 'Ciayumajakuning', wilayah: 'Wilayah Ciayumajakuning', cities: ['Cirebon', 'Kab. Cirebon', 'Indramayu', 'Majalengka', 'Kuningan'] },
  { value: 'priangan-timur', label: 'Priangan Timur', wilayah: 'Wilayah Priangan Timur', cities: ['Tasikmalaya', 'Garut', 'Ciamis', 'Banjar'] },
  { value: 'sukabumi-raya', label: 'Sukabumi Raya', wilayah: 'Wilayah Sukabumi Raya', cities: ['Sukabumi', 'Kab. Sukabumi', 'Cianjur', 'Bogor'] },
] as const;

export const wilayahList = wilayahGroups.map((group) => group.wilayah);

export const opdList = dinasList;

export const yearOptions = [2026, 2025, 2024];

export const quarterOptions = [
  { value: 1, label: 'Kuartal 1' },
  { value: 2, label: 'Kuartal 2' },
  { value: 3, label: 'Kuartal 3' },
  { value: 4, label: 'Kuartal 4' },
];

// NOTE: dataset mock digenerate diganti dengan generator sederhana dari ./projects
import { projects as generatedProjects } from './projects';

const programTemplates = [
  { prefix: 'Pembangunan', items: ['Jembatan', 'Gedung Sekolah', 'Rumah Sakit', 'Jalan', 'Irigasi', 'Drainase', 'Pasar', 'Terminal'] },
  { prefix: 'Pemeliharaan', items: ['Jalan', 'Jembatan', 'Gedung Pemerintahan', 'Taman', 'Lapangan'] },
  { prefix: 'Pengadaan', items: ['Alat Kesehatan', 'Peralatan Sekolah', 'Kendaraan Operasional', 'Sistem Informasi', 'Perlengkapan Kantor'] },
  { prefix: 'Rehabilitasi', items: ['Fasilitas Kesehatan', 'Fasilitas Pendidikan', 'Infrastruktur Jalan', 'Permukiman'] },
  { prefix: 'Program', items: ['Pengentasan Kemiskinan', 'Pemberdayaan UMKM', 'Pendidikan Berkualitas', 'Kesehatan Masyarakat', 'Perlindungan Sosial'] },
  { prefix: 'Pelatihan', items: ['Peningkatan Kapasitas ASN', 'Keahlian Vokasi', 'Kewirausahaan', 'Pertanian Modern'] },
];

function getEWSStatus(realization: number): EWSStatus {
  if (realization >= 80) return 'green';
  if (realization >= 30) return 'amber';
  return 'red';
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Generator sederhana (50 proyek) dari ./projects
function generateProgramsFromProjects(): Program[] {
  // projects.ts berisi data deterministik (50 item) dengan tahun 2026
  // Kita mapping ke struktur Program agar UI dashboard tetap bekerja.
  return generatedProjects.map((p, idx) => {
    const tahun = 2026;
    const kuartal = ((idx % 4) + 1);

    return {
      id: `PRG-${String(idx + 1).padStart(4, '0')}`,
      name: p.nama,
      dinas: p.opd,
      paguAnggaran: p.pagu,
      realisasiKeuangan: p.realisasi,
      realisasiFisik: p.fisik,
      tahun,
      kuartal,
      status: p.status,
      wilayah: p.wilayah,
      kotaKabupaten: 'Kota/Kab.',
      lastUpdated: new Date(2026, 5, 17 - (idx % 30)).toISOString().split('T')[0],
    };
  });
}

export const programs: Program[] = generateProgramsFromProjects();


export const getProgramsByYear = (year: number): Program[] =>
  programs.filter((p) => p.tahun === year);

export const getProgramsByQuarter = (year: number, quarter: number): Program[] =>
  programs.filter((p) => p.tahun === year && p.kuartal === quarter);

export const getProgramsByOPD = (opd: string): Program[] =>
  programs.filter((p) => p.dinas === opd);

export const getProgramsByWilayah = (wilayah: string): Program[] =>
  programs.filter((p) => matchesWilayahFilter(p, wilayah));

export const getProgramsByStatus = (status: EWSStatus): Program[] =>
  programs.filter((p) => p.status === status);

export const getWilayahGroupByValue = (value: string) => {
  const normalized = value.trim().toLowerCase();
  return wilayahGroups.find((group) => group.value === normalized || group.label.toLowerCase() === normalized || group.wilayah.toLowerCase() === normalized);
};

export const matchesWilayahFilter = (program: Program, wilayahFilter?: string) => {
  if (!wilayahFilter) return true;

  const normalized = wilayahFilter.trim().toLowerCase();
  const group = getWilayahGroupByValue(wilayahFilter);
  if (!group) {
    return program.wilayah.toLowerCase() === normalized || program.wilayah.toLowerCase() === `wilayah ${normalized}`;
  }

  return program.wilayah === group.wilayah
    || program.wilayah === group.label
    || Boolean(program.kotaKabupaten && group.cities.some((city) => city.toLowerCase() === program.kotaKabupaten.toLowerCase()));
};

export const getAvailableWilayahOptions = (sourcePrograms: Program[] = programs) =>
  wilayahGroups.filter((group) => sourcePrograms.some((program) => matchesWilayahFilter(program, group.value)));

export const getFilteredPrograms = (filters: ProgramFilters, sourcePrograms: Program[] = programs) =>
  sourcePrograms.filter((program) => {
    const matchesYear = program.tahun === filters.tahun;
    const matchesQuarter = program.kuartal === filters.kuartal;
    const matchesOpd = !filters.opd || program.dinas === filters.opd;
    const matchesWilayah = matchesWilayahFilter(program, filters.wilayah);
    return matchesYear && matchesQuarter && matchesOpd && matchesWilayah;
  });

export const getDashboardMetrics = (filtersOrYear: number | ProgramFilters, quarter?: number) => {
  const filters: ProgramFilters = typeof filtersOrYear === 'number'
    ? { tahun: filtersOrYear, kuartal: quarter ?? 1, opd: '', wilayah: '' }
    : filtersOrYear;

  const filtered = getFilteredPrograms(filters);

  const totalPrograms = filtered.length;
  const realisasiFisik = filtered.reduce((sum, p) => sum + p.realisasiFisik, 0) / (totalPrograms || 1);
  const totalPagu = filtered.reduce((sum, p) => sum + p.paguAnggaran, 0);
  const totalRealisasi = filtered.reduce((sum, p) => sum + p.realisasiKeuangan, 0);
  const kritisCount = filtered.filter((p) => p.status === 'red').length;
  const hijauCount = filtered.filter((p) => p.status === 'green').length;
  const kuningCount = filtered.filter((p) => p.status === 'amber').length;

  return {
    totalPrograms,
    realisasiFisik: Math.round(realisasiFisik * 10) / 10,
    serapanAnggaran: totalRealisasi,
    targetAnggaran: totalPagu,
    kritisCount,
    hijauCount,
    kuningCount,
  };
};

export const getTopDinasBudget = (filtersOrYear: number | ProgramFilters, quarter?: number): DinasBudget[] => {
  const filters: ProgramFilters = typeof filtersOrYear === 'number'
    ? { tahun: filtersOrYear, kuartal: quarter ?? 1, opd: '', wilayah: '' }
    : filtersOrYear;

  const filtered = getFilteredPrograms(filters);
  const dinasMap = new Map<string, { target: number; realisasi: number }>();

  filtered.forEach((p) => {
    const existing = dinasMap.get(p.dinas) || { target: 0, realisasi: 0 };
    dinasMap.set(p.dinas, {
      target: existing.target + p.paguAnggaran,
      realisasi: existing.realisasi + p.realisasiKeuangan,
    });
  });

  return Array.from(dinasMap.entries())
    .map(([dinas, data]) => ({
      dinas: dinas.replace('Dinas ', '').replace('Badan ', ''),
      target: data.target,
      realisasi: data.realisasi,
    }))
    .sort((a, b) => b.target - a.target)
    .slice(0, 5);
};

export const getNotifications = (): Notification[] => {
  const critical = programs.filter((p) => p.status === 'red').slice(0, 5);
  const warning = programs.filter((p) => p.status === 'amber').slice(0, 3);

  const notifications: Notification[] = [...critical, ...warning].map((p, idx) => ({
    id: `NOTIF-${String(idx + 1).padStart(4, '0')}`,
    programId: p.id,
    programName: p.name,
    dinas: p.dinas,
    status: p.status,
    message: p.status === 'red'
      ? 'Realisasi fisik di bawah 30% - Perlu perhatian segera'
      : 'Realisasi fisik di bawah target - Perlu review',
    timestamp: p.lastUpdated,
    read: false,
  }));

  return notifications;
};

export const formatRupiah = formatCurrency;

export const formatShortRupiah = (value: number): string => {
  if (value >= 1e12) {
    return `Rp ${(value / 1e12).toFixed(1)} T`;
  }
  if (value >= 1e9) {
    return `Rp ${(value / 1e9).toFixed(1)} M`;
  }
  if (value >= 1e6) {
    return `Rp ${(value / 1e6).toFixed(0)} jt`;
  }
  return formatRupiah(value);
};
