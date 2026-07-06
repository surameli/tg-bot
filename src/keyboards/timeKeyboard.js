import { Keyboard } from "grammy";

export const timeKeyboard = new Keyboard()
  .text("8:00 - 10:00").row()
  .text("10:00 - 12:00").row()
  .text("12:00 - 2:00").row()
  .text("2:00 - 4:00").row()
  .text("4:00 - 6:00").row()
  .text("6:00 - 8:00")
  .resized()
  .oneTime();
