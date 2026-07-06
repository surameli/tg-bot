import { Keyboard } from "grammy";

const mainMenuKeyboard = new Keyboard()
  .text("📚 Register as Tutor").text("👨‍👩‍👧 Register as Parent").row()
  .text("👤 My Profile").text("📋 Complete Profile").row()
  .text("❓ Help").text("❌ Cancel")
  .resized();

export default function registerStartCommand(bot) {
  bot.api.setMyCommands([
    { command: "start",            description: "🏠 Go to main menu" },
    { command: "register",         description: "📝 Register as a tutor" },
    { command: "complete_profile", description: "📋 Complete your tutor profile" },
    { command: "profile",          description: "👤 View your full profile" },
    { command: "help",             description: "❓ Show available commands" },
    { command: "cancel",           description: "❌ Cancel current registration" },
  ]);

  bot.command("start", async (ctx) => {
    const firstName = ctx.from?.first_name || "there";
    await ctx.reply(
      `👋 Welcome, ${firstName}!\n\nI'm *Fidel Tutor Bot* — connecting parents with qualified tutors.\n\nWhat would you like to do?`,
      { parse_mode: "Markdown", reply_markup: mainMenuKeyboard }
    );
  });
}
