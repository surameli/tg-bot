import { Markup } from "telegraf";

const GRADES = [
    "Grade 1-4",
    "Grade 5-8",
    "Grade 9-10",
    "Grade 11-12"
];

export function gradeKeyboard(selected = []) {

    const buttons = GRADES.map(grade => [

        Markup.button.callback(

            `${selected.includes(grade) ? "✅" : "⬜"} ${grade}`,

            `grade:${grade}`

        )

    ]);

    buttons.push([
        Markup.button.callback("✅ Done", "grade_done")
    ]);

    return Markup.inlineKeyboard(buttons);

}