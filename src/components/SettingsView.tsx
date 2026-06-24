import React from 'react';
import { Globe, Bell, Shield, HelpCircle } from 'lucide-react';

export const SettingsView: React.FC = () => {
  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-h2 text-slate-800">Pengaturan</h2>
          <p className="text-sm text-slate-500 mt-1">Konfigurasi preferensi aplikasi</p>
        </div>

        {/* Settings Sections */}
        <SettingsCard
          icon={Bell}
          title="Notifikasi"
          description="Kelola preferensi pemberitahuan sistem EWS"
        >
          <div className="space-y-3">
            <SettingsToggle label="Notifikasi Email" description="Kirim email untuk status kritis" enabled={true} />
            <SettingsToggle label="Push Notification" description="Notifikasi browser real-time" enabled={true} />
            <SettingsToggle label="Ringkasan Harian" description="Laporan ringkasan setiap pagi" enabled={false} />
          </div>
        </SettingsCard>

        <SettingsCard
          icon={Globe}
          title="Tampilan"
          description="Pengaturan bahasa dan tema"
        >
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Bahasa</label>
              <select className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700
                focus:outline-none focus:ring-2 focus:ring-primary">
                <option>Bahasa Indonesia</option>
                <option>English</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Format Tanggal</label>
              <select className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700
                focus:outline-none focus:ring-2 focus:ring-primary">
                <option>DD/MM/YYYY</option>
                <option>MM/DD/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </SettingsCard>

        <SettingsCard
          icon={Shield}
          title="Keamanan"
          description="Pengaturan keamanan akun"
        >
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <p className="text-sm font-medium text-slate-700">Ubah Kata Sandi</p>
              <p className="text-xs text-slate-400 mt-0.5">Perbarui kata sandi akun Anda</p>
            </button>
            <SettingsToggle label="Autentikasi Dua Faktor" description="Tambahan lapisan keamanan" enabled={false} />
          </div>
        </SettingsCard>

        <SettingsCard
          icon={HelpCircle}
          title="Bantuan & Dukungan"
          description="Panduan penggunaan dan kontak support"
        >
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <p className="text-sm font-medium text-slate-700">Panduan Pengguna</p>
              <p className="text-xs text-slate-400 mt-0.5">Manual lengkap SIPEKA</p>
            </button>
            <button className="w-full text-left px-4 py-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <p className="text-sm font-medium text-slate-700">Hubungi Admin</p>
              <p className="text-xs text-slate-400 mt-0.5">support@bappeda.go.id</p>
            </button>
          </div>
        </SettingsCard>

        {/* Version Info */}
        <div className="text-center py-4">
          <p className="text-xs text-slate-400">SIPEKA v1.0.0 - Bappeda Provinsi 2026</p>
        </div>
      </div>
    </div>
  );
};

interface SettingsCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}

const SettingsCard: React.FC<SettingsCardProps> = ({
  icon: Icon,
  title,
  description,
  children,
}) => (
  <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-slate-800">{title}</h3>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
    </div>
    <div className="pt-4 border-t border-slate-100">{children}</div>
  </div>
);

interface SettingsToggleProps {
  label: string;
  description: string;
  enabled: boolean;
}

const SettingsToggle: React.FC<SettingsToggleProps> = ({ label, description, enabled }) => {
  const [isEnabled, setIsEnabled] = React.useState(enabled);

  return (
    <label className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
      <div>
        <p className="text-sm font-medium text-slate-700">{label}</p>
        <p className="text-xs text-slate-400 mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => setIsEnabled(!isEnabled)}
        className={`relative w-11 h-6 rounded-full transition-colors
          ${isEnabled ? 'bg-primary' : 'bg-slate-300'}`}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform
            ${isEnabled ? 'translate-x-5' : ''}`}
        />
      </button>
    </label>
  );
};
