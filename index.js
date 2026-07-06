import dotenv from "dotenv";
dotenv.config();

import bot from "./bot.js";
import { connectDB } from "./src/database/db.js";

import registerStartCommand          from "./src/commands/start.js";
import registerHelpCommand           from "./src/commands/help.js";
import registerCommand               from "./src/commands/register.js";
import registerCancelCommand         from "./src/commands/cancel.js";
import registerCompleteProfileCommand from "./src/commands/completeProfile.js";
import registerProfileCommand         from "./src/commands/profile.js";
import registerMenuHandler           from "./src/handlers/menuHandler.js";

async function startBot() {
  await connectDB();

  registerMenuHandler(bot);
  registerStartCommand(bot);
  registerHelpCommand(bot);
  registerCommand(bot);
  registerCancelCommand(bot);
  registerCompleteProfileCommand(bot);
  registerProfileCommand(bot);

  console.log("🤖 Fidel Tutor Bot is running...");
  await bot.start();
}

startBot();

process.once("SIGINT",  () => bot.stop());
process.once("SIGTERM", () => bot.stop());
