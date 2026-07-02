import { Scenes, Markup } from "telegraf";
import {
    isValidEmail,
    isValidPhone,
    isValidFullName,
    isValidPassword
} from "../src/utils/validation.js";

import { genderKeyboard } from "../src/keyboards/registerKeyboard.js";
import { cityKeyboard } from "../src/keyboards/cityKeyboard.js";
import { getSubCityKeyboard } from "../src/keyboards/subCityKeyboard.js";

const tutorBasicScene = new Scenes.WizardScene(

"tutor-basic-scene",

// STEP 1
async (ctx) => {

    ctx.wizard.state.data = {};

    ctx.wizard.state.data.telegramId = ctx.from.id;
    ctx.wizard.state.data.telegramUsername = ctx.from.username || "";

    await ctx.reply(
        "👤 Enter your full name:"
    );

    return ctx.wizard.next();

},

// STEP 2
async (ctx) => {

    const fullName = ctx.message.text.trim();

    if (!isValidFullName(fullName)) {

        await ctx.reply(
            "❌ Please enter your full name."
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

// STEP 3
async (ctx) => {

    const gender = ctx.message.text;

    if (!["Male", "Female"].includes(gender)) {

        await ctx.reply(
            "❌ Please choose Male or Female."
        );

        return;
    }

    ctx.wizard.state.data.gender = gender;

    await ctx.reply(
        "📞 Enter your phone number:"
    );

    return ctx.wizard.next();

},

// STEP 4
async (ctx) => {

    const phone = ctx.message.text.trim();

    if (!isValidPhone(phone)) {

        await ctx.reply(
            "❌ Invalid phone number."
        );

        return;
    }

    ctx.wizard.state.data.phone = phone;

    await ctx.reply(
        "📧 Enter your email:"
    );

    return ctx.wizard.next();

},

// STEP 5
async (ctx) => {

    const email = ctx.message.text.trim();

    if (!isValidEmail(email)) {

        await ctx.reply(
            "❌ Invalid email."
        );

        return;
    }

    ctx.wizard.state.data.email = email;

    await ctx.reply(
        "🔒 Create a password:\n\nMust be at least 8 characters with letters and numbers."
    );

    return ctx.wizard.next();

},

// STEP 6 - Password confirmation
async (ctx) => {

    const password = ctx.message.text.trim();

    if (!isValidPassword(password)) {
        await ctx.reply(
            "❌ Password must be at least 8 characters and contain both letters and numbers.\n\nPlease try again:"
        );
        return;
    }

    ctx.wizard.state.data.password = password;

    await ctx.reply("🔒 Confirm your password:");

    return ctx.wizard.next();

},

// STEP 7 - Confirm password
async (ctx) => {

    const confirm = ctx.message.text.trim();

    if (confirm !== ctx.wizard.state.data.password) {
        await ctx.reply(
            "❌ Passwords do not match.\n\nPlease enter your password again:"
        );
        ctx.wizard.selectStep(5);
        return;
    }

    await ctx.reply(
        "🏙 Select your city:",
        cityKeyboard
    );

    return ctx.wizard.next();

},

// STEP 8 - City
async (ctx) => {

    ctx.wizard.state.data.location = {
        city: ctx.message.text
    };

    await ctx.reply(
        "🏘 Select your sub-city:",
        getSubCityKeyboard(ctx.message.text)
    );

    return ctx.wizard.next();

},

// STEP 9 - Sub-city
async (ctx) => {

    ctx.wizard.state.data.location.subCity = ctx.message.text;

    await ctx.reply(

`✅ Basic Information Completed

Now let's continue with your professional information.`,

Markup.removeKeyboard()

    );

    // Move to Professional Scene
    return ctx.scene.enter(
        "tutor-professional-scene",
        ctx.wizard.state.data
    );

}

);

export default tutorBasicScene;