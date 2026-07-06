import { Keyboard } from "grammy";

const SUB_CITIES = {
  "Addis Ababa": [["Bole", "Yeka"], ["Arada", "Lideta"], ["Kolfe", "Kirkos"], ["Akaky Kaliti", "Nifas Silk"]],
  "Adama":       [["01", "02"], ["03", "04"]],
  "Hawassa":     [["Tabor", "Menaharia"]],
  "Bahir Dar":   [["Belay Zeleke", "Shum Abo"]],
  "Dire Dawa":   [["Kezira", "Sabian"]],
  "Mekelle":     [["Hadnet", "Ayder"]],
};

export function getSubCityKeyboard(city) {
  const rows = SUB_CITIES[city] || [["Other"]];
  const kb = new Keyboard();
  for (const row of rows) {
    for (const label of row) kb.text(label);
    kb.row();
  }
  return kb.resized().oneTime();
}
