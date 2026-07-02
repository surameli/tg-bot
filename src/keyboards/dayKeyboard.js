import { Markup } from "telegraf";

const DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
];

export function dayKeyboard(selected = []) {

    const buttons = DAYS.map(day => [

        Markup.button.callback(

            `${selected.includes(day) ? "✅" : "⬜"} ${day}`,

            `day:${day}`

        )

    ]);

    buttons.push([
        Markup.button.callback("✅ Done", "day_done")
    ]);

    return Markup.inlineKeyboard(buttons);

}