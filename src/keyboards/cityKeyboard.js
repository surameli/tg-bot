import { Markup } from "telegraf";

export const cityKeyboard = Markup.keyboard([
    ["Addis Ababa", "Adama"],
    ["Hawassa", "Bahir Dar"],
    ["Dire Dawa", "Mekelle"]
])
.resize()
.oneTime();