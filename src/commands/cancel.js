export default function registerCancelCommand(bot) {
  bot.command("cancel", async (ctx) => {
    // Check if the user is currently inside a scene
    if (ctx.scene.current) {
      await ctx.reply("❌ Registration cancelled.");
      return ctx.scene.leave();
    }

    await ctx.reply("There is no active registration to cancel.");
  });
}