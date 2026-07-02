import { Markup } from "telegraf";

export const genderKeyboard = Markup.keyboard([
    ["Male", "Female"]
])
.resize()
.oneTime();