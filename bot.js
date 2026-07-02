import dotenv from "dotenv";
import { session, Telegraf  } from "telegraf";
import { Scenes } from "telegraf";
import registerScene from "./scenes/registerScene.js";
import parentRegisterScene from "./scenes/parentRegisterScene.js";
import tutorBasicScene from "./scenes/tutorBasicScene.js";
import tutorProfessionalScene from "./scenes/tutorProfessionalScene.js";
import tutorDocumentScene from "./scenes/tutorDocumentScene.js";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

const stage = new Scenes.Stage([
  // registerScene,
  parentRegisterScene,
  tutorBasicScene,
  tutorProfessionalScene,
  tutorDocumentScene,
]);

bot.use(session());
bot.use(stage.middleware());


export default bot;