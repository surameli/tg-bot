import { Markup } from "telegraf";

const SUBJECTS = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "ICT",
    "History",
    "Geography",
    "Economics"
];

export function subjectKeyboard(selected = []) {

    const buttons = SUBJECTS.map(subject => {

        const checked = selected.includes(subject);

        return [
            Markup.button.callback(
                `${checked ? "✅" : "⬜"} ${subject}`,
                `subject:${subject}`
            )
        ];

    });

    buttons.push([
        Markup.button.callback("✅ Done", "subject_done")
    ]);

    return Markup.inlineKeyboard(buttons);

}