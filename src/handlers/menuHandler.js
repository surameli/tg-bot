import { Markup } from "telegraf";

export default function registerMenuHandler(bot) {

  // ── Register as Tutor ──────────────────────────────────────────────────────
  bot.hears("📚 Register as Tutor", async (ctx) => {
    await ctx.scene.enter("tutor-basic-scene");
  });

  // ── Register as Parent ─────────────────────────────────────────────────────
  bot.hears("👨‍👩‍👧 Register as Parent", async (ctx) => {
    await ctx.scene.enter("parent-register-scene");
  });

  // ── Help button ────────────────────────────────────────────────────────────
  bot.hears("❓ Help", async (ctx) => {
    await ctx.reply(
      `*Available Commands*\n\n` +
      `/start    — 🏠 Go to main menu\n` +
      `/register — 📝 Register as a tutor\n` +
      `/help     — ❓ Show this message\n` +
      `/cancel   — ❌ Cancel current registration`,
      { parse_mode: "Markdown" }
    );
  });

  // ── Cancel button ──────────────────────────────────────────────────────────
  bot.hears("❌ Cancel", async (ctx) => {
    if (ctx.scene?.current) {
      await ctx.reply("❌ Registration cancelled.", Markup.removeKeyboard());
      return ctx.scene.leave();
    }
    await ctx.reply("There is no active registration to cancel.");
  });

}
