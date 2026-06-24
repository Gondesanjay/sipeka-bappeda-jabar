import React, { useCallback, useMemo, useState } from 'react';
import * as ReactSimpleMaps from 'react-simple-maps';

import { programs, formatShortRupiah, EWSStatus, matchesWilayahFilter } from '../data/mockData';

const { ComposableMap, Geographies, Geography } = ReactSimpleMaps;
const MarkerComponent = (ReactSimpleMaps as unknown as { Marker?: React.ComponentType<any> }).Marker as React.ComponentType<any>;
import { zones } from '../data/indonesiaMapData';

export interface MapVisualizationProps {
  filters: {
    tahun: number;
    kuartal: number;
    opd: string;
    wilayah: string;
  };
  onWilayahSelect?: (wilayah: string) => void;
}

type WilayahKey = 'bodebek' | 'purwasuka' | 'bandung-raya' | 'ciayumajakuning' | 'priangan-timur';

type StatusColors = Record<EWSStatus, { solid: string; glow: string; label: string; bg: string }>;

const statusColors: StatusColors = {
  green: {
    solid: '#10B981',
    glow: 'rgba(16,185,129,0.45)',
    label: 'AMAN',
    bg: 'rgba(16,185,129,0.12)',
  },
  amber: {
    solid: '#F59E0B',
    glow: 'rgba(245,158,11,0.45)',
    label: 'WASPADA',
    bg: 'rgba(245,158,11,0.12)',
  },
  red: {
    solid: '#EF4444',
    glow: 'rgba(239,68,68,0.45)',
    label: 'KRITIS',
    bg: 'rgba(239,68,68,0.12)',
  },
};

type RadarPin = {
  pinId: string;
  pinName: string;
  wilayahKey: WilayahKey;
  coordinates: [number, number]; // [lon, lat]
  status: EWSStatus;
};

// Tooltip + label placement still uses overlay percent positions.
// Coordinates are used for semantic correctness and future refinement.
const RADAR_PINS: RadarPin[] = [
  { pinId: 'bandung', pinName: 'Bandung', wilayahKey: 'bandung-raya', coordinates: [107.6191, -6.9175], status: 'amber' },
  { pinId: 'bogor', pinName: 'Bogor', wilayahKey: 'bodebek', coordinates: [106.7972, -6.5971], status: 'green' },
  { pinId: 'depok', pinName: 'Depok', wilayahKey: 'bodebek', coordinates: [106.8272, -6.4025], status: 'red' },
  { pinId: 'bekasi', pinName: 'Bekasi', wilayahKey: 'bodebek', coordinates: [106.9896, -6.2383], status: 'amber' },
  { pinId: 'cirebon', pinName: 'Cirebon', wilayahKey: 'ciayumajakuning', coordinates: [108.5520, -6.7320], status: 'green' },
  { pinId: 'tasikmalaya', pinName: 'Tasikmalaya', wilayahKey: 'priangan-timur', coordinates: [108.2089, -7.3274], status: 'red' },
  { pinId: 'sukabumi', pinName: 'Sukabumi', wilayahKey: 'priangan-timur', coordinates: [106.9272, -6.9237], status: 'amber' },
  { pinId: 'purwakarta', pinName: 'Purwakarta', wilayahKey: 'purwasuka', coordinates: [107.4475, -6.5387], status: 'green' },
  { pinId: 'garut', pinName: 'Garut', wilayahKey: 'priangan-timur', coordinates: [107.9087, -7.2279], status: 'red' },
  { pinId: 'indramayu', pinName: 'Indramayu', wilayahKey: 'ciayumajakuning', coordinates: [108.3200, -6.3275], status: 'amber' },
];

interface WilayahStats {
  status: EWSStatus;
  projects: number;
  budget: number;
  absorption: number;
  realisasiFisik: number;
  wilayahLabel: string;
}

export const MapVisualization: React.FC<MapVisualizationProps> = ({ filters, onWilayahSelect }) => {
  const [hoveredPinId, setHoveredPinId] = useState<string | null>(null);
  const [hoveredGeographyKey, setHoveredGeographyKey] = useState<string | null>(null);

  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    data:
    | {
      wilayahLabel: string;
      projects: number;
      budget: number;
      absorption: number;
      realisasiFisik: number;
      status: EWSStatus;
      wilayahKey: WilayahKey;
    }
    | null;
  }>({ visible: false, x: 0, y: 0, data: null });

  const filteredPrograms = useMemo(() => {
    let result = programs.filter((p) => p.tahun === filters.tahun && p.kuartal === filters.kuartal);
    if (filters.opd) result = result.filter((p) => p.dinas === filters.opd);
    if (filters.wilayah) result = result.filter((p) => matchesWilayahFilter(p, filters.wilayah));
    return result;
  }, [filters]);

  const pinStatsByWilayah = useMemo<Partial<Record<WilayahKey, WilayahStats>>>(() => {
    const stats: Partial<Record<WilayahKey, WilayahStats>> = {};

    const wilayahKeys = zones.map((z) => z.id) as WilayahKey[];

    wilayahKeys.forEach((wKey) => {
      const wilayahLabel = zones.find((z) => z.id === wKey)?.wilayahKey || wKey;
      const items = filteredPrograms.filter((p) => p.wilayah === wilayahLabel);

      const totalBudget = items.reduce((sum, p) => sum + p.paguAnggaran, 0);
      const totalAbsorption = items.reduce((sum, p) => sum + p.realisasiKeuangan, 0);
      const avgRealisasi = items.length ? items.reduce((sum, p) => sum + p.realisasiFisik, 0) / items.length : 0;

      let status: EWSStatus = 'green';
      if (avgRealisasi < 30) status = 'red';
      else if (avgRealisasi < 80) status = 'amber';

      stats[wKey] = {
        status,
        projects: items.length,
        budget: totalBudget,
        absorption: totalAbsorption,
        realisasiFisik: Math.round(avgRealisasi * 10) / 10,
        wilayahLabel,
      };
    });

    return stats;
  }, [filteredPrograms]);

  const triggerWilayahSelect = useCallback(
    (wilayahKey: WilayahKey) => {
      const wilayahLabel = zones.find((z) => z.id === wilayahKey)?.wilayahKey;
      if (onWilayahSelect && wilayahLabel) onWilayahSelect(wilayahLabel);
    },
    [onWilayahSelect]
  );

  const handlePinEnter = useCallback(
    (e: React.MouseEvent, pin: RadarPin) => {
      setHoveredPinId(pin.pinId);
      const container = (e.currentTarget as HTMLElement).closest('.map-container') as HTMLDivElement | null;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const relX = ((e.clientX - rect.left) / rect.width) * 100;
      const relY = ((e.clientY - rect.top) / rect.height) * 100;

      const s = pinStatsByWilayah[pin.wilayahKey];
      if (!s) return;

      setTooltip({
        visible: true,
        x: relX,
        y: relY,
        data: {
          wilayahLabel: pin.pinName,
          projects: s.projects,
          budget: s.budget,
          absorption: s.absorption,
          realisasiFisik: s.realisasiFisik,
          status: pin.status ?? s.status,
          wilayahKey: pin.wilayahKey,
        },
      });
    },
    [pinStatsByWilayah]
  );

  const handlePinMove = useCallback((e: React.MouseEvent) => {
    const container = (e.currentTarget as HTMLElement).closest('.map-container') as HTMLDivElement | null;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * 100;
    const relY = ((e.clientY - rect.top) / rect.height) * 100;
    setTooltip((prev) => (prev.visible ? { ...prev, x: relX, y: relY } : prev));
  }, []);

  const handlePinLeave = useCallback(() => {
    setHoveredPinId(null);
    setTooltip({ visible: false, x: 0, y: 0, data: null });
  }, []);

  const geographyFill = useCallback(
    (wilayahKey: WilayahKey, isHovered: boolean) => {
      const s = pinStatsByWilayah[wilayahKey];
      if (!s) return '#1e293b';
      if (filters.wilayah && s.wilayahLabel === filters.wilayah) return statusColors[s.status].solid;
      if (isHovered) {
        // Hover bright transition effect
        return `color-mix(in srgb, ${statusColors[s.status].solid} 55%, #1e293b 45%)`;
      }
      return '#1e293b';
    },
    [filters.wilayah, pinStatsByWilayah]
  );

  return (
    <div className="map-container relative w-full h-full min-h-[360px] rounded-xl overflow-hidden border border-slate-700/50 bg-slate-900">
      {/* Background enhancement layers */}
      <div
        className="absolute inset-0 opacity-30 grayscale invert brightness-200 pointer-events-none"
        style={{
          backgroundImage: 'url("/west-java-map.svg")',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-slate-900/90 to-transparent z-20 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 flex items-start justify-between px-5 pt-4 z-30 pointer-events-none">
        <div>
          <h3 className="text-[15px] font-semibold text-white opacity-95 tracking-tight">Visualisasi Spasial Realisasi</h3>
          <p className="text-[11px] text-white/40 mt-0.5">Provinsi Jawa Barat</p>
        </div>
      </div>

      {/* Peta */}
      <div className="relative z-10 w-full h-full">
        <ComposableMap
          projection="geoMercator"
          width={900}
          height={520}
          viewBox="0 0 900 520"
          projectionConfig={{ scale: 9000, center: [107.6, -6.9] }}
          style={{ width: '100%', height: '100%' }}
        >
          <Geographies geography="/jabar.geojson">
            {({ geographies }: { geographies: unknown[] }) =>
              geographies.map((geo) => {
                const props = (geo as unknown as { properties?: Record<string, unknown> }).properties || {};
                const regionName: string = (props.NAME_1 ?? props.VARNAME_1 ?? props.NAME ?? '') as string;

                const wilayahKey: WilayahKey = (() => {
                  const lc = String(regionName).toLowerCase();
                  if (lc.includes('bek')) return 'bodebek';
                  if (lc.includes('karang')) return 'purwasuka';
                  if (lc.includes('bandung')) return 'bandung-raya';
                  if (lc.includes('cirebon')) return 'ciayumajakuning';
                  if (lc.includes('tasik')) return 'priangan-timur';
                  return 'bandung-raya';
                })();

                const g = geo as unknown as { rsmKey?: string };
                const isHovered = hoveredGeographyKey === g.rsmKey;
                const fill = geographyFill(wilayahKey, isHovered);

                return (
                  <Geography
                    key={String((geo as unknown as { rsmKey?: unknown }).rsmKey ?? '')}
                    geography={geo as unknown as Record<string, unknown>}
                    fill={fill}
                    stroke="#334155"
                    strokeWidth={1}
                    style={{
                      default: { outline: 'none', transition: 'fill 200ms ease, filter 200ms ease' },
                      hover: {
                        fill,
                        outline: 'none',
                        filter: 'brightness(1.25) drop-shadow(0px 0px 10px rgba(255,255,255,0.18))',
                        cursor: 'pointer',
                      },
                      pressed: { fill },
                    }}
                    onMouseEnter={() => setHoveredGeographyKey(String((geo as unknown as { rsmKey?: unknown }).rsmKey ?? ''))}
                    onMouseLeave={() => setHoveredGeographyKey(null)}
                    onClick={() => triggerWilayahSelect(wilayahKey)}
                  />
                );
              })
            }
          </Geographies>

          {RADAR_PINS.map((pin) => {
            const s = pinStatsByWilayah[pin.wilayahKey];
            if (!s) return null;
            const isHovered = hoveredPinId === pin.pinId;
            const pinStatus = pin.status ?? s.status;
            const pinColors = statusColors[pinStatus];

            return (
              <MarkerComponent key={pin.pinId} coordinates={pin.coordinates}>
                <g
                  className="cursor-pointer"
                  onMouseEnter={(e) => handlePinEnter(e, pin)}
                  onMouseMove={handlePinMove}
                  onMouseLeave={handlePinLeave}
                  onClick={() => triggerWilayahSelect(pin.wilayahKey)}
                >
                  <circle
                    r={isHovered ? 16 : 12}
                    className="animate-ping"
                    style={{ fill: pinColors.solid, opacity: 0.3 }}
                  />
                  <circle
                    r={isHovered ? 16 : 12}
                    className="animate-ping"
                    style={{ fill: pinColors.solid, opacity: 0.15, animationDelay: '0.7s' }}
                  />
                  <circle
                    r={isHovered ? 5.5 : 4.5}
                    style={{
                      fill: pinColors.solid,
                      stroke: 'white',
                      strokeWidth: 1.2,
                      boxShadow: `0 0 12px ${pinColors.glow}`,
                    }}
                  />
                </g>
              </MarkerComponent>
            );
          })}
        </ComposableMap>
      </div>


      {/* Tooltip glassmorphism (pin) */}
      {tooltip.visible && tooltip.data && (
        <div
          className="absolute z-50 pointer-events-none"
          style={{ left: `${tooltip.x}%`, top: `${tooltip.y}%`, transform: 'translate(-50%, -100%)' }}
        >
          <div className="bg-slate-900/90 backdrop-blur-md border border-white/[0.10] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.50)] px-4 py-3 min-w-[220px] -mt-3">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: statusColors[tooltip.data.status].solid }} />
              <span className="text-sm font-semibold text-white">{tooltip.data.wilayahLabel}</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/40">Proyek Aktif</span>
                <span className="text-white font-medium tabular-nums">{tooltip.data.projects}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/40">Serapan Anggaran</span>
                <span className="text-white font-medium tabular-nums">{formatShortRupiah(tooltip.data.absorption)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/40">Total Pagu</span>
                <span className="text-white font-medium tabular-nums">{formatShortRupiah(tooltip.data.budget)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/40">Realisasi Fisik</span>
                <span className="text-white font-medium tabular-nums">{tooltip.data.realisasiFisik}%</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-1.5 mt-1 border-t border-white/[0.06]">
                <span className="text-white/40">Status</span>
                <span
                  className="font-semibold text-[10px] tracking-wider"
                  style={{ color: statusColors[tooltip.data.status].solid }}
                >
                  {statusColors[tooltip.data.status].label}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer narrative */}
      <div className="absolute bottom-0 left-0 right-0 px-5 py-3 bg-slate-900/70 backdrop-blur-sm border-t border-white/[0.06] z-20">
        <p className="text-xs text-white/70 leading-relaxed font-medium">
          Pantau serapan anggaran berdasarkan titik lokasi proyek pembangunan secara real-time di seluruh wilayah administratif.
        </p>
      </div>

      {/* Legend */}
      <div className="absolute bottom-14 right-4 z-20 flex flex-col gap-1.5">
        <span className="text-[9px] font-semibold text-white/30 tracking-wider">STATUS REALISASI</span>
        {([
          { color: '#10B981', label: 'AMAN', sub: '> 80%' },
          { color: '#F59E0B', label: 'WASPADA', sub: '30-80%' },
          { color: '#EF4444', label: 'KRITIS', sub: '< 30%' },
        ] as const).map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2 px-2.5 py-1 rounded-lg"
            style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
          >
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-[9px] font-medium text-white/70">{item.label}</span>
            <span className="text-[9px] text-white/30">{item.sub}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

