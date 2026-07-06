export default function registerCommand(bot) {
  bot.command("register", async (ctx) => {
    await ctx.conversation.enter("tutorRegisterConversation");
    // await ctx.conversation.enter("tutorBasicConversation");
  });
}
