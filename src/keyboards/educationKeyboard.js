import { Markup } from "telegraf";

export const educationKeyboard = Markup.keyboard([
    ["Diploma"],
    ["Bachelor"],
    ["Master"],
    ["PhD"]
])
.resize()
.oneTime();