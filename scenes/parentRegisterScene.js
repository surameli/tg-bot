import { Scenes, Markup } from "telegraf";
import {
    isValidFullName,
    isValidPhone,
    isValidEmail,
    isValidPassword
} from "../src/utils/validation.js";

import { cityKeyboard } from "../src/keyboards/cityKeyboard.js";
import { getSubCityKeyboard } from "../src/keyboards/subCityKeyboard.js";

const parentRegisterScene = new Scenes.WizardScene(
    "parent-register-scene",

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
     // STEP 2 full name
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
            "📞 Enter your phone number:"
        );

        return ctx.wizard.next();

    },
    // STEP 3 phone number
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
    // STEP 4 email

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
    // STEP 5 - Password confirmation
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
    // STEP 6 - Confirm password
    async (ctx) => {

        const confirm = ctx.message.text.trim();

        if (confirm !== ctx.wizard.state.data.password) {
            await ctx.reply(
                "❌ Passwords do not match.\n\nPlease enter your password again:"
            );
            ctx.wizard.selectStep(4);
            return;
        }

        await ctx.reply(
            "🏙 Select your city:",
            cityKeyboard
        );

        return ctx.wizard.next();

    },
    // STEP 5 city
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
    // STEP 6 sub-city
        async (ctx) => {

        ctx.wizard.state.data.location.subCity = ctx.message.text;

        const data = ctx.wizard.state.data;

        await ctx.reply(

`✅ Parent Registration Completed

👤 Full Name: ${data.fullName}

📞 Phone: ${data.phone}

📧 Email: ${data.email}

🏙 City: ${data.location.city}

🏘 Sub-city: ${data.location.subCity}

🆔 Telegram: @${data.telegramUsername}`,

Markup.removeKeyboard()

        );

        console.log(data);

        return ctx.scene.leave();

    }

);

export default parentRegisterScene;