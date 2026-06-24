export interface CityPin {
  id: string;
  name: string;
  zoneId: string;
  x: number;
  y: number;
}

export interface ZoneData {
  id: string;
  name: string;
  wilayahKey: string;
}

export const zones: ZoneData[] = [
  { id: 'bodebek', name: 'Bodebek', wilayahKey: 'Wilayah Bodebek' },
  { id: 'purwasuka', name: 'Purwasuka', wilayahKey: 'Wilayah Purwasuka' },
  { id: 'bandung-raya', name: 'Bandung Raya', wilayahKey: 'Wilayah Bandung Raya' },
  { id: 'ciayumajakuning', name: 'Ciayumajakuning', wilayahKey: 'Wilayah Ciayumajakuning' },
  { id: 'priangan-timur', name: 'Priangan Timur', wilayahKey: 'Wilayah Priangan Timur' },
];

export const cityPins: CityPin[] = [
  { id: 'depok', name: 'Depok', zoneId: 'bodebek', x: 175, y: 230 },
  { id: 'karawang', name: 'Karawang', zoneId: 'purwasuka', x: 375, y: 140 },
  { id: 'bandung', name: 'Bandung', zoneId: 'bandung-raya', x: 385, y: 290 },
  { id: 'cirebon', name: 'Cirebon', zoneId: 'ciayumajakuning', x: 605, y: 170 },
  { id: 'tasikmalaya', name: 'Tasikmalaya', zoneId: 'priangan-timur', x: 610, y: 350 },
];

export const zoneToWilayah: Record<string, string> = {
  bodebek: 'Wilayah Bodebek',
  purwasuka: 'Wilayah Purwasuka',
  'bandung-raya': 'Wilayah Bandung Raya',
  ciayumajakuning: 'Wilayah Ciayumajakuning',
  'priangan-timur': 'Wilayah Priangan Timur',
};

export const cityToWilayah: Record<string, string> = {
  depok: 'Wilayah Bodebek',
  karawang: 'Wilayah Purwasuka',
  bandung: 'Wilayah Bandung Raya',
  cirebon: 'Wilayah Ciayumajakuning',
  tasikmalaya: 'Wilayah Priangan Timur',
};
