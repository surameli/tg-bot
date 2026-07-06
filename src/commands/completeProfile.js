export default function registerCompleteProfileCommand(bot) {
  bot.command("complete_profile", async (ctx) => {
    await ctx.conversation.enter("completeProfileConversation");
  });
}
