import { Keyboard } from "grammy";

export const genderKeyboard = new Keyboard()
  .text("Male").text("Female")
  .resized()
  .oneTime();
