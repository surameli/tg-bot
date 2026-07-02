import { Scenes, Markup } from "telegraf";
import  {isValidEmail, isNotEmpty , isValidPhone ,isPositiveNumber ,isValidFullName} from "../src/utils/validation.js";
import { genderKeyboard } from "../src/keyboards/registerKeyboard.js";
import { educationKeyboard } from "../src/keyboards/educationKeyboard.js";
import { cityKeyboard } from "../src/keyboards/cityKeyboard.js";
import  {gradeKeyboard} from "../src/keyboards/gradeKeyboard.js";
import { getSubCityKeyboard } from "../src/keyboards/subCityKeyboard.js";
import { subjectKeyboard } from "../src/keyboards/subjectkeyboard.js";
import { dayKeyboard } from "../src/keyboards/dayKeyboard.js";
import {timeKeyboard} from "../src/keyboards/timeKeyboard.js";

const registerScene = new Scenes.WizardScene(

    "register-scene",

    // STEP 1
    async (ctx)=>{

        ctx.wizard.state.data = {};

        ctx.wizard.state.data.telegramId = ctx.from.id;
        ctx.wizard.state.data.telegramUsername = ctx.from.username || "";

        await ctx.reply(
             "👤 Enter your full name:\n\nYou can cancel anytime by typing /cancel."
       );

        return ctx.wizard.next();

    },

    // STEP 2 full name
    async (ctx) => {

    if (ctx.message?.text === "/cancel") {
        await ctx.reply("❌ Registration cancelled.", Markup.removeKeyboard());
        return ctx.scene.leave();
    }

    const fullName = ctx.message.text.trim();

    if (!isNotEmpty(fullName)) {
        await ctx.reply("❌ Full name cannot be empty.\n\nPlease enter your full name.");
        return;
    }
    if (!isValidFullName(fullName)) {
    await ctx.reply(
        "❌ Please enter your full name.\n\nExample:\nSurafel Melliyon"
    );
    return;
}

    ctx.wizard.state.data.fullName = fullName;

    await ctx.reply(
        "Select your gender:",
        genderKeyboard
    );

    return ctx.wizard.next();
},

    // STEP 3 gender
  async (ctx) => {

    if (ctx.message?.text === "/cancel") {
        await ctx.reply("❌ Registration cancelled.", Markup.removeKeyboard());
        return ctx.scene.leave();
    }

    const gender = ctx.message.text;

    if (!["Male", "Female"].includes(gender)) {
        await ctx.reply("❌ Please select Male or Female using the keyboard.");
        return;
    }

    ctx.wizard.state.data.gender = gender;

    await ctx.reply("📞 Enter your phone number:");

    return ctx.wizard.next();
},

    // STEP 4 phone Number
  async (ctx) => {

    if (ctx.message?.text === "/cancel") {
        await ctx.reply("❌ Registration cancelled.", Markup.removeKeyboard());
        return ctx.scene.leave();
    }

    const phone = ctx.message.text.trim();

    if (!isValidPhone(phone)) {
        await ctx.reply(
            "❌ Invalid phone number.\n\nExample:\n0912345678\nor\n+251912345678"
        );
        return;
    }

    ctx.wizard.state.data.phone = phone;

    await ctx.reply("📧 Enter your email:");

    return ctx.wizard.next();
},
    // STEP 5 email
   async (ctx) => {

    if (ctx.message?.text === "/cancel") {
        await ctx.reply("❌ Registration cancelled.", Markup.removeKeyboard());
        return ctx.scene.leave();
    }

    const email = ctx.message.text.trim();

    if (!isValidEmail(email)) {
        await ctx.reply("❌ Invalid email address.\n\nPlease enter a valid email.");
        return;
    }

    ctx.wizard.state.data.email = email;

    await ctx.reply("🏙 Enter your city:", cityKeyboard);

    return ctx.wizard.next();
},

    // STEP 6
    // async (ctx)=>{
    //     if (ctx.message?.text === "/cancel") {
    //     await ctx.reply("❌ Registration cancelled.");
    //     Markup.removeKeyboard()
    //      return ctx.scene.leave();
    //     }


    //     ctx.wizard.state.data.location = [];

    //     await ctx.reply("📚 Which subjects do you teach?\n\nYou can cancel anytime by typing /cancel:" , subjectKeyboard([]));

    //     return ctx.wizard.next();

    // },

    // STEP 6 - Save City
async (ctx) => {

    if (ctx.message?.text === "/cancel") {
        await ctx.reply(
            "❌ Registration cancelled.",
            Markup.removeKeyboard()
        );
        return ctx.scene.leave();
    }

    // Save the selected city
    ctx.wizard.state.data.location = {
        city: ctx.message.text
    };

    await ctx.reply(
        "🏘 Select your sub-city:",
        getSubCityKeyboard(ctx.message.text)
    );

    return ctx.wizard.next();

},
// STEP 7 - Save Sub-city
async (ctx) => {

    if (ctx.message?.text === "/cancel") {
        await ctx.reply(
            "❌ Registration cancelled.",
            Markup.removeKeyboard()
        );
        return ctx.scene.leave();
    }

    // Save sub-city
    ctx.wizard.state.data.location.subCity = ctx.message.text;

    // Initialize subjects
    ctx.wizard.state.data.subjects = [];

    await ctx.reply(
        "📚 Which subjects do you teach?\n\nPress ✅ Done when finished.",
        subjectKeyboard([])
    );

    return ctx.wizard.next();

},

    // STEP 7
    async (ctx)=>{
        if (ctx.message?.text === "/cancel") {
        await ctx.reply("❌ Registration cancelled.");
        Markup.removeKeyboard()
         return ctx.scene.leave();
        }


        ctx.wizard.state.data.gradeLevels = [];

         await ctx.reply(
                "🎓 Select the grade levels you teach.\n\nPress ✅ Done when finished.",
              gradeKeyboard([])
            );

                ctx.wizard.next();
    },

    // STEP 8
    async (ctx)=>{
        if (ctx.message?.text === "/cancel") {
        await ctx.reply("❌ Registration cancelled.");
        Markup.removeKeyboard()
         return ctx.scene.leave();
        }

        const experience = ctx.message.text.trim();

         if (!isPositiveNumber(experience)) {
             await ctx.reply("❌ Please enter a valid number of years.");
             return;
}

        ctx.wizard.state.data.gradeLevels = Number(experience);

        await ctx.reply("💼 Years of teaching experience:\n\nYou can cancel anytime by typing /cancel.");

        return ctx.wizard.next();

    },

    // STEP 9
    async (ctx)=>{
        if (ctx.message?.text === "/cancel") {
        await ctx.reply("❌ Registration cancelled.");
        Markup.removeKeyboard()
         return ctx.scene.leave();
        }

        ctx.wizard.state.data.experience = ctx.message.text;

        await ctx.reply("🎓 Highest education level:\n\nYou can cancel anytime by typing /cancel", educationKeyboard  );

        return ctx.wizard.next();

    },

    // STEP 10


    // async (ctx)=>{

    //     if (ctx.message?.text === "/cancel") {
    //     await ctx.reply("❌ Registration cancelled.");
    //     Markup.removeKeyboard()
    //      return ctx.scene.leave();
    //     }

    //     ctx.wizard.state.data.education = ctx.message.text;

    //     await ctx.reply("📅 Availability schedule:\n\nYou can cancel anytime by typing /cancel  ", dayKeyboard);

    //     return ctx.wizard.next();

    // },
    // STEP 10 - Choose Day
async (ctx) => {

    if (ctx.message?.text === "/cancel") {
        await ctx.reply(
            "❌ Registration cancelled.",
            Markup.removeKeyboard()
        );
        return ctx.scene.leave();
    }

    // Save education
 ctx.wizard.state.data.availableDays = [];

await ctx.reply(
    "📅 Select your available day(s).\n\nPress ✅ Done when finished.",
    dayKeyboard([])
);

return ctx.wizard.next();

},

    // STEP 11 - Choose Time
async (ctx) => {

    if (ctx.message?.text === "/cancel") {
        await ctx.reply(
            "❌ Registration cancelled.",
            Markup.removeKeyboard()
        );
        return ctx.scene.leave();
    }

    // Save selected day
    ctx.wizard.state.data.availableDay = ctx.message.text;

    await ctx.reply(
        "⏰ Select your available time:",
        timeKeyboard
    );

    return ctx.wizard.next();

},

// STEP 12 - Expected Payment
async (ctx) => {

    if (ctx.message?.text === "/cancel") {
        await ctx.reply(
            "❌ Registration cancelled.",
            Markup.removeKeyboard()
        );
        return ctx.scene.leave();
    }

    // Save selected time
    ctx.wizard.state.data.availableTime = ctx.message.text;

    await ctx.reply(
        "💰 Enter your expected payment range:"
    );

    return ctx.wizard.next();

},
    // // STEP 11
    // async (ctx)=>{

    //     if (ctx.message?.text === "/cancel") {
    //     await ctx.reply("❌ Registration cancelled.");
    //     Markup.removeKeyboard()
    //      return ctx.scene.leave();
    //     }

    //     ctx.wizard.state.data.availability = ctx.message.text;

    //     await ctx.reply("💰 Expected payment range:\n\nYou can cancel anytime by typing /cancel.");

    //     return ctx.wizard.next();

    // },

    // STEP 13
    async (ctx)=>{

        if (ctx.message?.text === "/cancel") {
        await ctx.reply("❌ Registration cancelled.");
        Markup.removeKeyboard()

         return ctx.scene.leave();
        }

        ctx.wizard.state.data.expectedPayment = ctx.message.text;

        const data = ctx.wizard.state.data;

        await ctx.reply(`
✅ Registration Completed

👤 Full Name: ${data.fullName}

👤 Gender: ${data.gender}

📞 Phone: ${data.phone}

📧 Email: ${data.email}

🏙 Location: ${data.location}

📚 Subjects: ${data.subjects}

🎓 Grade Levels: ${data.gradeLevels}

💼 Experience: ${data.experience}

🎓 Education: ${data.education}

📅 Availability: ${data.availability}

💰 Expected Payment: ${data.expectedPayment}

🆔 Telegram Username: @${data.telegramUsername}
`);

        console.log(data);

        return ctx.scene.leave();

    }

);


registerScene.action(/subject:(.+)/, async (ctx) => {

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

    await ctx.editMessageReplyMarkup(
        subjectKeyboard(selected).reply_markup
    );

});


registerScene.action("subject_done", async (ctx) => {

    await ctx.answerCbQuery();

    if (ctx.wizard.state.data.subjects.length === 0) {

        return ctx.answerCbQuery(
            "Please select at least one subject.",
            { show_alert: true }
        );

    }

    await ctx.editMessageText(
        "✅ Subjects selected:\n\n" +
        ctx.wizard.state.data.subjects.join(", ")
    );

   // Initialize selected grade levels
ctx.wizard.state.data.gradeLevels = [];

// Send the grade keyboard
await ctx.reply(
    "🎓 Select the grade levels you teach.\n\nPress ✅ Done when finished.",
    gradeKeyboard([])
);

// Move to the next wizard step
return ctx.wizard.next();
});


registerScene.action(/grade:(.+)/, async (ctx) => {

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

    await ctx.editMessageReplyMarkup(
        gradeKeyboard(selected).reply_markup
    );

});

registerScene.action("grade_done", async (ctx) => {

    await ctx.answerCbQuery();

    if (ctx.wizard.state.data.gradeLevels.length === 0) {

        return ctx.answerCbQuery(
            "Please select at least one grade.",
            { show_alert: true }
        );

    }

    await ctx.editMessageText(
        "✅ Grade Levels:\n\n" +
        ctx.wizard.state.data.gradeLevels.join(", ")
    );

    await ctx.reply(
        "💼 Enter your years of teaching experience:"
    );

    ctx.wizard.next();

});

registerScene.action(/day:(.+)/, async (ctx) => {
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

    await ctx.editMessageReplyMarkup(
        dayKeyboard(selected).reply_markup
    );
});


registerScene.action("day_done", async (ctx) => {
    await ctx.answerCbQuery();

    if (ctx.wizard.state.data.availableDays.length === 0) {
        return ctx.answerCbQuery(
            "Please select at least one day.",
            { show_alert: true }
        );
    }

    await ctx.editMessageText(
        "✅ Available Days:\n\n" +
        ctx.wizard.state.data.availableDays.join(", ")
    );

    await ctx.reply(
        "⏰ Select your available time:",
        timeKeyboard
    );

    return ctx.wizard.next();
});
export default registerScene;