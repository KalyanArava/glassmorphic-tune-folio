export type Song = {
  id: number;
  title: string;
  artist: string;
  duration: string;
  seconds: number;
  hue: number;
};

const raw: [string, string, string, number][] = [
  ["Inthandham", "Sita Ramam", "4:12", 18],
  ["Oh Sita Hey Rama", "Sita Ramam", "3:58", 32],
  ["Adigaa", "Hi Nanna", "4:26", 210],
  ["Samayama", "Hi Nanna", "4:05", 195],
  ["Naa Roja Nuvve", "Kushi", "4:33", 45],
  ["Aradhya", "Kushi", "3:47", 8],
  ["Nee Kannu Neeli Samudram", "Uppena", "4:41", 240],
  ["Priyathama Priyathama", "Majili", "4:18", 285],
  ["Inthandham - Reprise", "Sita Ramam", "2:54", 25],
  ["Kadalalle", "Dear Comrade", "4:37", 160],
  ["Vintunnava", "Ye Maaya Chesave", "5:02", 220],
  ["Yenti Yenti", "Geetha Govindam", "4:22", 340],
  ["Maate Vinadhuga", "Taxiwaala", "4:09", 300],
  ["Nee Neeli Kannullona", "Dear Comrade", "4:48", 175],
  ["Samajavaragamana", "Ala Vaikunthapurramuloo", "3:52", 60],
];

export const songs: Song[] = raw.map(([title, artist, duration, hue], i) => {
  const parts = duration.split(":").map(Number);
  const m = parts[0] ?? 0;
  const s = parts[1] ?? 0;
  return { id: i + 1, title, artist, duration, seconds: m * 60 + s, hue };
});
