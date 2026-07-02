import { Markup } from "telegraf";

export const timeKeyboard = Markup.keyboard([
    ["8:00 - 10:00"],
    ["10:00 - 12:00"],
    ["12:00 - 2:00"],
    ["2:00 - 4:00"],
    ["4:00 - 6:00"],
    ["6:00 - 8:00"]
])
.resize()
.oneTime();