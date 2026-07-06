import { Bot, session } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";
import dotenv from "dotenv";
dotenv.config();

import { tutorRegisterConversation, completeProfileConversation } from "./scenes/tutorRegisterScene.js";
import { parentRegisterConversation } from "./scenes/parentRegisterScene.js";

const bot = new Bot(process.env.BOT_TOKEN);

bot.use(session({ initial: () => ({}) }));

bot.use(conversations());
bot.use(createConversation(tutorRegisterConversation));
bot.use(createConversation(completeProfileConversation));
bot.use(createConversation(parentRegisterConversation));

export default bot;
