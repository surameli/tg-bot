import { InlineKeyboard } from "grammy";

const GRADES = ["Grade 1-4", "Grade 5-8", "Grade 9-10", "Grade 11-12"];

export function gradeKeyboard(selected = []) {
  const kb = new InlineKeyboard();
  for (const grade of GRADES) {
    const checked = selected.includes(grade);
    kb.text(`${checked ? "✅" : "⬜"} ${grade}`, `grade:${grade}`).row();
  }
  kb.text("✅ Done", "grade_done");
  return kb;
}
