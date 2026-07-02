export default function registerCommand(bot) {

    bot.command("register", (ctx) => {

        ctx.scene.enter("register-scene");

    });

}