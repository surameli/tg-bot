import { InlineKeyboard } from "grammy";

const SUBJECTS = [
  "Mathematics", "Physics", "Chemistry", "Biology",
  "English", "ICT", "History", "Geography", "Economics",
];

export function subjectKeyboard(selected = []) {
  const kb = new InlineKeyboard();
  for (const subject of SUBJECTS) {
    const checked = selected.includes(subject);
    kb.text(`${checked ? "✅" : "⬜"} ${subject}`, `subject:${subject}`).row();
  }
  kb.text("✅ Done", "subject_done");
  return kb;
}
