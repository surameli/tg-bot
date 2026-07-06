import { InlineKeyboard } from "grammy";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function dayKeyboard(selected = []) {
  const kb = new InlineKeyboard();
  for (const day of DAYS) {
    const checked = selected.includes(day);
    kb.text(`${checked ? "✅" : "⬜"} ${day}`, `day:${day}`).row();
  }
  kb.text("✅ Done", "day_done");
  return kb;
}
