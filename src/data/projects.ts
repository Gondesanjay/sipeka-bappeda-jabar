import type { EWSStatus } from './mockData';

export type ProyekStatus = EWSStatus;

export interface Proyek {
    id: string;
    nama: string;
    opd: string;
    pagu: number;
    realisasi: number;
    fisik: number;
    wilayah: string;
    status: ProyekStatus;
}

const OPD_LIST = [
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

const WILAYAH_LIST = [
    'Wilayah Bodebek',
    'Wilayah Purwasuka',
    'Wilayah Bandung Raya',
    'Wilayah Ciayumajakuning',
    'Wilayah Priangan Timur',
];

const TEMPLATE_KEGIATAN = [
    'Pembangunan',
    'Pemeliharaan',
    'Pengadaan',
    'Rehabilitasi',
    'Program',
    'Pelatihan',
];

const TEMPLATE_URAIAN = [
    'Jembatan',
    'Gedung Sekolah',
    'Rumah Sakit',
    'Jalan',
    'Irigasi',
    'Drainase',
    'Pasar',
    'Terminal',
    'Taman',
    'Lapangan',
];

function pick<T>(arr: readonly T[], idx: number): T {
    return arr[idx % arr.length];
}

function toStatus(fisik: number): ProyekStatus {
    if (fisik >= 80) return 'green';
    if (fisik >= 30) return 'amber';
    return 'red';
}

export function generateProjects(count = 50): Proyek[] {
    const items: Proyek[] = [];

    for (let i = 0; i < count; i++) {
        const wilayah = pick(WILAYAH_LIST, i * 7);
        const opd = pick(OPD_LIST, i * 3);
        const fisik = (i * 11) % 101; // 0..100 deterministik

        const pagu = (700 + ((i * 137) % 4500)) * 1_000_000; // 700jt..~5200jt

        // realisasi: turunan dari fisik dengan variasi
        const multiplier = 0.75 + (((i * 29) % 36) / 100); // 0.75..1.10
        const realisasi = Math.min(pagu, Math.round(pagu * (fisik / 100) * multiplier));

        const nama = `${pick(TEMPLATE_KEGIATAN, i)} ${pick(TEMPLATE_URAIAN, i + 2)} ${wilayah} Tahun 2026`;

        items.push({
            id: `PRJ-${String(i + 1).padStart(3, '0')}`,
            nama,
            opd,
            pagu,
            realisasi,
            fisik,
            wilayah,
            status: toStatus(fisik),
        });
    }

    return items;
}

// default dataset 50 proyek
export const projects: Proyek[] = generateProjects(50);

