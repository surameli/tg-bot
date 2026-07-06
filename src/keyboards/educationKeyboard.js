import { Keyboard } from "grammy";

export const educationKeyboard = new Keyboard()
  .text("Diploma").row()
  .text("Bachelor").row()
  .text("Master").row()
  .text("PhD")
  .resized()
  .oneTime();
