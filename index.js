import dotenv from "dotenv";
import bot from "./bot.js";

import registerStartCommand from "./src/commands/start.js";
import registerHelpCommand from "./src/commands/help.js";
import registerCommand from "./src/commands/register.js";
import registerCancelCommand from "./src/commands/cancel.js";
import registerMenuHandler from "./src/handlers/menuHandler.js";
import { connectDB } from "./src/database/db.js";

dotenv.config();

async function startBot() {
  await connectDB();

  // Register handlers
  registerMenuHandler(bot);

  // Register commands
  registerStartCommand(bot);
  registerHelpCommand(bot);
  registerCommand(bot);
  registerCancelCommand(bot);

  // Launch the bot
  await bot.launch();

  console.log("🤖 Tutor Bot is running...");
}

startBot();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));