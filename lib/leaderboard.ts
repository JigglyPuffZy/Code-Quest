export type BoardEntry = {
  id: string;
  username: string;
  avatar: string;
  xp: number;
  streak: number;
};

export const demoRivals: BoardEntry[] = [
  { id: "demo-lumen", username: "Lumen", avatar: "luna", xp: 1840, streak: 12 },
  { id: "demo-kite", username: "Kite", avatar: "byte", xp: 1420, streak: 6 },
  { id: "demo-bramble", username: "Bramble", avatar: "moss", xp: 990, streak: 4 },
  { id: "demo-sable", username: "Sable", avatar: "rune", xp: 760, streak: 9 },
  { id: "demo-io", username: "Io", avatar: "volt", xp: 540, streak: 2 },
  { id: "demo-pixel", username: "Pixel", avatar: "fox", xp: 310, streak: 1 },
];
