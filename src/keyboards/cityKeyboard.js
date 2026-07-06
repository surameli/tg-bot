import { Keyboard } from "grammy";

export const cityKeyboard = new Keyboard()
  .text("Addis Ababa").text("Adama").row()
  .text("Hawassa").text("Bahir Dar").row()
  .text("Dire Dawa").text("Mekelle")
  .resized()
  .oneTime();
