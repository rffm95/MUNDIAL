export interface Prize {
  id: number;
  label: string;
  country?: string;
  award?: string;
  isWin: boolean;
  color: string;
  flag?: string;
}

export const PRIZES: Prize[] = [
  { id: 0, label: "Portugal", country: "Portugal", award: "Metro (11 finos)", isWin: true, color: "#e42518", flag: "https://flagcdn.com/w160/pt.png" },
  { id: 1, label: "Tenta outra vez", isWin: false, color: "#1a1a1a" },
  { id: 2, label: "Brasil", country: "Brasil", award: "Régua (5 finos)", isWin: true, color: "#009739", flag: "https://flagcdn.com/w160/br.png" },
  { id: 3, label: "Tenta outra vez", isWin: false, color: "#1a1a1a" },
  { id: 4, label: "Espanha", country: "Espanha", award: "3 finos", isWin: true, color: "#ffc400", flag: "https://flagcdn.com/w160/es.png" },
  { id: 5, label: "Tenta outra vez", isWin: false, color: "#1a1a1a" },
  { id: 6, label: "Argentina", country: "Argentina", award: "3 finos", isWin: true, color: "#74acdf", flag: "https://flagcdn.com/w160/ar.png" },
  { id: 7, label: "Tenta outra vez", isWin: false, color: "#1a1a1a" },
  { id: 8, label: "EUA", country: "EUA", award: "1 fino", isWin: true, color: "#3c3b6e", flag: "https://flagcdn.com/w160/us.png" },
  { id: 9, label: "Tenta outra vez", isWin: false, color: "#1a1a1a" },
  { id: 10, label: "França", country: "França", award: "1 fino", isWin: true, color: "#002395", flag: "https://flagcdn.com/w160/fr.png" },
  { id: 11, label: "Tenta outra vez", isWin: false, color: "#1a1a1a" },
];
