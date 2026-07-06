export default function registerMenuHandler(bot) {
  // ── Register as Tutor ──────────────────────────────────────────────────────
  bot.hears("📚 Register as Tutor", async (ctx) => {
    await ctx.conversation.enter("tutorRegisterConversation");
  });

  // ── Register as Parent ─────────────────────────────────────────────────────
  bot.hears("👨‍👩‍👧 Register as Parent", async (ctx) => {
    await ctx.conversation.enter("parentRegisterConversation");
  });

  // ── Complete Profile button (re-enters phase 2 for tutors who paused) ──────
  bot.hears("📋 Complete Profile", async (ctx) => {
    await ctx.conversation.enter("completeProfileConversation");
  });

  // ── Help button ────────────────────────────────────────────────────────────
  bot.hears("❓ Help", async (ctx) => {
    await ctx.reply(
      `*Available Commands*\n\n` +
      `/start            — 🏠 Go to main menu\n` +
      `/register         — 📝 Register as a tutor\n` +
      `/complete_profile — 📋 Finish your tutor registration\n` +
      `/profile          — 👤 View your full profile\n` +
      `/help             — ❓ Show this message\n` +
      `/cancel           — ❌ Cancel current registration`,
      { parse_mode: "Markdown" }
    );
  });

  // ── Cancel button ──────────────────────────────────────────────────────────
  bot.hears("❌ Cancel", async (ctx) => {
    const active = await ctx.conversation.active();
    if (Object.keys(active).length > 0) {
      await ctx.conversation.exit();
      await ctx.reply("❌ Registration cancelled.", { reply_markup: { remove_keyboard: true } });
    } else {
      await ctx.reply("There is no active registration to cancel.");
    }
  });
}
