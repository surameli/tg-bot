export default function registerCancelCommand(bot) {
  bot.command("cancel", async (ctx) => {
    const active = await ctx.conversation.active();
    if (Object.keys(active).length > 0) {
      await ctx.conversation.exit();
      await ctx.reply("❌ Registration cancelled.", { reply_markup: { remove_keyboard: true } });
    } else {
      await ctx.reply("There is no active registration to cancel.");
    }
  });
}
