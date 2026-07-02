import { Scenes, Markup } from "telegraf";
import { subjectKeyboard } from "../src/keyboards/subjectkeyboard.js";
import { gradeKeyboard } from "../src/keyboards/gradeKeyboard.js";
import { dayKeyboard } from "../src/keyboards/dayKeyboard.js";
import { timeKeyboard } from "../src/keyboards/timeKeyboard.js";
import { educationKeyboard } from "../src/keyboards/educationKeyboard.js";

const tutorProfessionalScene = new Scenes.WizardScene(
  "tutor-professional-scene",

  async (ctx) => {
    ctx.wizard.state.data = { ...ctx.scene.state };
    ctx.wizard.state.data.subjects = [];
    ctx.wizard.state.data.gradeLevels = [];
    ctx.wizard.state.data.availableDays = [];

    await ctx.reply("📚 Select the subjects you teach:", subjectKeyboard([]));
    return ctx.wizard.next();
  },

  async (ctx) => {
    if (!ctx.message?.text) {
      return;
    }

    ctx.wizard.state.data.experience = ctx.message.text;

    await ctx.reply("🎓 Enter your highest education level:", educationKeyboard);
    return ctx.wizard.next();
  },

  async (ctx) => {
    if (!ctx.message?.text) {
      return;
    }

    ctx.wizard.state.data.education = ctx.message.text;

    await ctx.reply("📅 Select the days you are available:", dayKeyboard([]));
    return ctx.wizard.next();
  },

  async (ctx) => {
    if (ctx.message?.text === "/cancel") {
      await ctx.reply("❌ Registration cancelled.", Markup.removeKeyboard());
      return ctx.scene.leave();
    }

    ctx.wizard.state.data.availableTime = ctx.message.text;

    await ctx.reply("💰 Enter your expected payment range:");
    return ctx.wizard.next();
  },

  async (ctx) => {
    if (ctx.message?.text === "/cancel") {
      await ctx.reply("❌ Registration cancelled.", Markup.removeKeyboard());
      return ctx.scene.leave();
    }

    ctx.wizard.state.data.expectedPayment = ctx.message.text;

    await ctx.reply(
      "✅ Professional information saved.\n\nNow let's upload your documents.",
      Markup.removeKeyboard()
    );

    return ctx.scene.enter("tutor-document-scene", ctx.wizard.state.data);
  }
);

tutorProfessionalScene.action(/subject:(.+)/, async (ctx) => {
  await ctx.answerCbQuery();

  const subject = ctx.match[1];
  const selected = ctx.wizard.state.data.subjects || [];
  ctx.wizard.state.data.subjects = selected;

  const index = selected.indexOf(subject);
  if (index === -1) {
    selected.push(subject);
  } else {
    selected.splice(index, 1);
  }

  await ctx.editMessageReplyMarkup(subjectKeyboard(selected).reply_markup);
});

tutorProfessionalScene.action("subject_done", async (ctx) => {
  await ctx.answerCbQuery();

  if (ctx.wizard.state.data.subjects.length === 0) {
    return ctx.answerCbQuery("Please select at least one subject.", { show_alert: true });
  }

  await ctx.editMessageText(
    "✅ Subjects selected:\n\n" + ctx.wizard.state.data.subjects.join(", ")
  );

  ctx.wizard.state.data.gradeLevels = [];

  await ctx.reply(
    "🎓 Select the grade levels you teach.\n\nPress ✅ Done when finished.",
    gradeKeyboard([])
  );
});

tutorProfessionalScene.action(/grade:(.+)/, async (ctx) => {
  await ctx.answerCbQuery();

  const grade = ctx.match[1];
  const selected = ctx.wizard.state.data.gradeLevels || [];
  ctx.wizard.state.data.gradeLevels = selected;

  const index = selected.indexOf(grade);
  if (index === -1) {
    selected.push(grade);
  } else {
    selected.splice(index, 1);
  }

  await ctx.editMessageReplyMarkup(gradeKeyboard(selected).reply_markup);
});

tutorProfessionalScene.action("grade_done", async (ctx) => {
  await ctx.answerCbQuery();

  if (ctx.wizard.state.data.gradeLevels.length === 0) {
    return ctx.answerCbQuery("Please select at least one grade.", { show_alert: true });
  }

  await ctx.editMessageText(
    "✅ Grade Levels:\n\n" + ctx.wizard.state.data.gradeLevels.join(", ")
  );

  await ctx.reply("💼 Enter your years of teaching experience:");
  ctx.wizard.selectStep(1);
});

tutorProfessionalScene.action(/day:(.+)/, async (ctx) => {
  await ctx.answerCbQuery();

  const day = ctx.match[1];
  const selected = ctx.wizard.state.data.availableDays || [];
  ctx.wizard.state.data.availableDays = selected;

  const index = selected.indexOf(day);
  if (index === -1) {
    selected.push(day);
  } else {
    selected.splice(index, 1);
  }

  await ctx.editMessageReplyMarkup(dayKeyboard(selected).reply_markup);
});

tutorProfessionalScene.action("day_done", async (ctx) => {
  await ctx.answerCbQuery();

  if (ctx.wizard.state.data.availableDays.length === 0) {
    return ctx.answerCbQuery("Please select at least one day.", { show_alert: true });
  }

  await ctx.editMessageText(
    "✅ Available Days:\n\n" + ctx.wizard.state.data.availableDays.join(", ")
  );

  await ctx.reply("⏰ Select your available time:", timeKeyboard);
  ctx.wizard.selectStep(3);
});

export default tutorProfessionalScene;