import { isValidFullName, isValidPhone, isValidEmail } from "../src/utils/validation.js";
// import Parent from "../src/models/Parent.js";

const removeKeyboard = { reply_markup: { remove_keyboard: true } };

/**
 * parentRegisterConversation
 * Collects: full name, phone, email — simple 3-step flow.
 */
export async function parentRegisterConversation(conversation, ctx) {
  const data = {
    telegramId: ctx.from.id,
    telegramUsername: ctx.from?.username || "",
  };

  // ── Full name ──────────────────────────────────────────────────────────────
  await ctx.reply("👋 Welcome to Parent Registration!\n\n👤 Step 1/3 — Enter your full name:");
  while (true) {
    const { message } = await conversation.wait();
    if (message?.text === "/cancel") { await ctx.reply("❌ Registration cancelled.", removeKeyboard); return; }
    const fullName = message?.text?.trim() ?? "";
    if (!isValidFullName(fullName)) { await ctx.reply("❌ Please enter your full name (first and last)."); continue; }
    data.fullName = fullName;
    break;
  }

  // ── Phone ──────────────────────────────────────────────────────────────────
  await ctx.reply("📞 Step 2/3 — Enter your phone number:");
  while (true) {
    const { message } = await conversation.wait();
    if (message?.text === "/cancel") { await ctx.reply("❌ Registration cancelled.", removeKeyboard); return; }
    const phone = message?.text?.trim() ?? "";
    if (!isValidPhone(phone)) { await ctx.reply("❌ Invalid phone number.\n\nExample: 0912345678  or  +251912345678"); continue; }
    data.phone = phone;
    break;
  }

  // ── Email ──────────────────────────────────────────────────────────────────
  await ctx.reply("📧 Step 3/3 — Enter your email:");
  while (true) {
    const { message } = await conversation.wait();
    if (message?.text === "/cancel") { await ctx.reply("❌ Registration cancelled.", removeKeyboard); return; }
    const email = message?.text?.trim() ?? "";
    if (!isValidEmail(email)) { await ctx.reply("❌ Invalid email address. Please try again."); continue; }
    data.email = email;
    break;
  }

  // ── Summary ────────────────────────────────────────────────────────────────
  await ctx.reply(
    `✅ *Parent Registration Completed!*\n\n` +
    `👤 Name: ${data.fullName}\n` +
    `📞 Phone: ${data.phone}\n` +
    `📧 Email: ${data.email}\n` +
    `🆔 Telegram: @${data.telegramUsername}\n\n` +
    `We will get in touch with you shortly.`,
    { parse_mode: "Markdown", ...removeKeyboard }
  );

  console.log("📋 New parent registration:", JSON.stringify(data, null, 2));
}
