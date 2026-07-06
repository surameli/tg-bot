import { InlineKeyboard }  from "grammy";
import { isValidEmail, isValidPhone, isValidFullName, isValidPassword } from "../src/utils/validation.js";
import { genderKeyboard }     from "../src/keyboards/registerKeyboard.js";
import { cityKeyboard }       from "../src/keyboards/cityKeyboard.js";
import { getSubCityKeyboard } from "../src/keyboards/subCityKeyboard.js";
import { subjectKeyboard }    from "../src/keyboards/subjectkeyboard.js";
import { gradeKeyboard }      from "../src/keyboards/gradeKeyboard.js";
import { dayKeyboard }        from "../src/keyboards/dayKeyboard.js";
import { timeKeyboard }       from "../src/keyboards/timeKeyboard.js";
import { educationKeyboard }  from "../src/keyboards/educationKeyboard.js";
import bcrypt                 from "bcrypt";

import { createTutor, getTutorByEmail, getTutorByTelegramId } from "../src/models/tutorModel.js";
import { createTutorProfessional }                            from "../src/models/tutorProffessionalModels.js";
import { createTutorDocument }                                from "../src/models/tutorDocumentModel.js";

const removeKeyboard = { reply_markup: { remove_keyboard: true } };

// ─── Document definitions ─────────────────────────────────────────────────────
const DOCUMENTS = [
  { key: "cv",           label: "Curriculum Vitae (CV)",         hint: "Upload your CV in PDF or Word format.",                              required: true  },
  { key: "degree",       label: "University Degree / Diploma",   hint: "Upload a clear scan or photo of your highest qualification.",       required: true  },
  { key: "nationalId",   label: "National ID / Passport",        hint: "Upload a clear photo of your National ID or passport.",             required: true  },
  { key: "certificates", label: "Certificates & Qualifications", hint: "Upload any additional certificates.\nType /skip if you have none.", required: false },
];

// ─── Inline multi-select helper ───────────────────────────────────────────────
async function multiSelect(conversation, ctx, {
  prompt, callbackPrefix, doneCallback, keyboardFn, emptyError,
}) {
  const selected = [];
  const sent = await ctx.reply(prompt, { reply_markup: keyboardFn(selected) });

  while (true) {
    ctx = await conversation.wait();
    const cbData = ctx.callbackQuery?.data;
    if (!cbData) continue;

    if (cbData === doneCallback) {
      if (selected.length === 0) {
        await ctx.answerCallbackQuery({ text: emptyError, show_alert: true });
        continue;
      }
      await ctx.answerCallbackQuery();
      await ctx.api.editMessageText(
        ctx.chat.id, sent.message_id,
        `✅ ${prompt}\n\n${selected.join(", ")}`
      );
      return selected;
    }

    if (cbData.startsWith(`${callbackPrefix}:`)) {
      const value = cbData.slice(callbackPrefix.length + 1);
      const idx = selected.indexOf(value);
      if (idx === -1) selected.push(value); else selected.splice(idx, 1);
      await ctx.answerCallbackQuery();
      await ctx.api.editMessageReplyMarkup(ctx.chat.id, sent.message_id, {
        reply_markup: keyboardFn(selected),
      });
    }
  }
}

// ─── File ID extractor ────────────────────────────────────────────────────────
function extractFileId(message) {
  if (message?.document) return message.document.file_id;
  if (message?.photo)    return message.photo[message.photo.length - 1].file_id;
  return null;
}

// ─── Phase 2 + 3: Professional & Documents ───────────────────────────────────
// Extracted so it can be reused by completeProfileConversation
async function runProfessionalAndDocuments(conversation, ctx, data) {

  // ── City ───────────────────────────────────────────────────────────────────
  await ctx.reply("🏙 Select your city:", { reply_markup: cityKeyboard });
  while (true) {
    ctx = await conversation.wait();
    if (ctx.message?.text === "/cancel") { await ctx.reply("❌ Registration cancelled.", removeKeyboard); return false; }
    if (!ctx.message?.text) continue;
    data.location = { city: ctx.message.text };
    break;
  }

  // ── Sub-city ───────────────────────────────────────────────────────────────
  await ctx.reply("🏘 Select your sub-city:", { reply_markup: getSubCityKeyboard(data.location.city) });
  while (true) {
    ctx = await conversation.wait();
    if (ctx.message?.text === "/cancel") { await ctx.reply("❌ Registration cancelled.", removeKeyboard); return false; }
    if (!ctx.message?.text) continue;
    data.location.subCity = ctx.message.text;
    break;
  }

  // ── Subjects ───────────────────────────────────────────────────────────────
  data.subjects = await multiSelect(conversation, ctx, {
    prompt: "📚 Select the subjects you teach:",
    callbackPrefix: "subject", doneCallback: "subject_done",
    keyboardFn: subjectKeyboard, emptyError: "Please select at least one subject.",
  });

  // ── Grade levels ───────────────────────────────────────────────────────────
  data.gradeLevels = await multiSelect(conversation, ctx, {
    prompt: "🎓 Select the grade levels you teach:",
    callbackPrefix: "grade", doneCallback: "grade_done",
    keyboardFn: gradeKeyboard, emptyError: "Please select at least one grade level.",
  });

  // ── Experience ─────────────────────────────────────────────────────────────
  await ctx.reply("💼 Enter your years of teaching experience:", removeKeyboard);
  while (true) {
    ctx = await conversation.wait();
    if (ctx.message?.text === "/cancel") { await ctx.reply("❌ Registration cancelled.", removeKeyboard); return false; }
    const val = ctx.message?.text?.trim() ?? "";
    if (!val || isNaN(val) || Number(val) < 0) { await ctx.reply("❌ Please enter a valid number (e.g. 3)."); continue; }
    data.experience = Number(val);
    break;
  }

  // ── Education ──────────────────────────────────────────────────────────────
  await ctx.reply("🎓 Select your highest education level:", { reply_markup: educationKeyboard });
  while (true) {
    ctx = await conversation.wait();
    if (ctx.message?.text === "/cancel") { await ctx.reply("❌ Registration cancelled.", removeKeyboard); return false; }
    if (!["Diploma", "Bachelor", "Master", "PhD"].includes(ctx.message?.text)) {
      await ctx.reply("❌ Please select from the keyboard."); continue;
    }
    data.education = ctx.message.text;
    break;
  }

  // ── Available days ─────────────────────────────────────────────────────────
  data.availableDays = await multiSelect(conversation, ctx, {
    prompt: "📅 Select the days you are available:",
    callbackPrefix: "day", doneCallback: "day_done",
    keyboardFn: dayKeyboard, emptyError: "Please select at least one day.",
  });

  // ── Available time ─────────────────────────────────────────────────────────
  await ctx.reply("⏰ Select your available time:", { reply_markup: timeKeyboard });
  while (true) {
    ctx = await conversation.wait();
    if (ctx.message?.text === "/cancel") { await ctx.reply("❌ Registration cancelled.", removeKeyboard); return false; }
    if (!ctx.message?.text) continue;
    data.availableTime = ctx.message.text;
    break;
  }

  // ── Expected payment ───────────────────────────────────────────────────────
  await ctx.reply("💰 Enter your expected payment range (e.g. 500-1000 ETB/hr):", removeKeyboard);
  while (true) {
    ctx = await conversation.wait();
    if (ctx.message?.text === "/cancel") { await ctx.reply("❌ Registration cancelled.", removeKeyboard); return false; }
    if (!ctx.message?.text?.trim()) continue;
    data.expectedPayment = ctx.message.text.trim();
    break;
  }

  // ── Save professional info ─────────────────────────────────────────────────
  const profResult = await conversation.external(async () => {
    try {
      await createTutorProfessional({
        tutor_id:         data.tutorId,
        city:             data.location.city,
        sub_city:         data.location.subCity,
        subjects:         JSON.stringify(data.subjects),
        grade_levels:     JSON.stringify(data.gradeLevels),
        experience:       data.experience,
        education:        data.education,
        available_days:   JSON.stringify(data.availableDays),
        available_time:   data.availableTime,
        expected_payment: data.expectedPayment,
      });
      return { ok: true };
    } catch (err) { return { error: err.message }; }
  });

  if (profResult.error) {
    await ctx.reply("❌ Failed to save professional information.\n\nError: " + profResult.error);
    return false;
  }

  await ctx.reply(
    "✅ *Professional Information Saved!*\n\nNow let's upload your documents.",
    { parse_mode: "Markdown", ...removeKeyboard }
  );

  // ── Document upload ────────────────────────────────────────────────────────
  await ctx.reply(
    "📂 *Document Upload*\n\nPlease upload the required documents one by one.\nType /cancel at any time to stop.",
    { parse_mode: "Markdown" }
  );

  for (const doc of DOCUMENTS) {
    await ctx.reply(
      `📎 *${doc.label}*\n\n${doc.hint}\n\nSend as document or photo.` +
      (doc.required ? "" : "\nType /skip to skip."),
      { parse_mode: "Markdown" }
    );

    while (true) {
      ctx = await conversation.wait();
      if (ctx.message?.text === "/cancel") { await ctx.reply("❌ Registration cancelled.", removeKeyboard); return false; }
      if (!doc.required && ctx.message?.text === "/skip") {
        data.documents[doc.key] = null;
        await ctx.reply(`⏭ ${doc.label} skipped.`);
        break;
      }
      const fileId = extractFileId(ctx.message);
      if (!fileId) {
        await ctx.reply(`❌ Please send a file.` + (doc.required ? "" : "\n\nType /skip to skip."));
        continue;
      }
      data.documents[doc.key] = fileId;
      await ctx.reply(`✅ ${doc.label} received.`);
      break;
    }
  }

  // ── Save documents ─────────────────────────────────────────────────────────
  const docResult = await conversation.external(async () => {
    try {
      for (const [key, fileId] of Object.entries(data.documents)) {
        if (!fileId) continue;
        await createTutorDocument({
          tutor_id: data.tutorId, document_type: key,
          telegram_file_id: fileId, file_name: key,
        });
      }
      return { ok: true };
    } catch (err) { return { error: err.message }; }
  });

  if (docResult.error) {
    await ctx.reply("❌ Failed to save documents.\n\nError: " + docResult.error);
    return false;
  }

  return true; // success
}

// ═════════════════════════════════════════════════════════════════════════════
//  MAIN REGISTRATION CONVERSATION  (Phase 1 → pause choice → Phase 2+3)
// ═════════════════════════════════════════════════════════════════════════════
export async function tutorRegisterConversation(conversation, ctx) {
  const data = {
    telegramId:       ctx.from.id,
    telegramUsername: ctx.from?.username || "",
    documents:        {},
  };

  // ── Full name ──────────────────────────────────────────────────────────────
  await ctx.reply("👋 Welcome to Tutor Registration!\n\n👤 Step 1/6 — Enter your full name:");
  while (true) {
    ctx = await conversation.wait();
    if (ctx.message?.text === "/cancel") { await ctx.reply("❌ Registration cancelled.", removeKeyboard); return; }
    const fullName = ctx.message?.text?.trim() ?? "";
    if (!isValidFullName(fullName)) { await ctx.reply("❌ Please enter your full name (first and last).\n\nExample: Surafel Meliyon"); continue; }
    data.fullName = fullName;
    break;
  }

  // ── Gender ─────────────────────────────────────────────────────────────────
  await ctx.reply("👤 Step 2/6 — Select your gender:", { reply_markup: genderKeyboard });
  while (true) {
    ctx = await conversation.wait();
    if (ctx.message?.text === "/cancel") { await ctx.reply("❌ Registration cancelled.", removeKeyboard); return; }
    if (!["Male", "Female"].includes(ctx.message?.text)) { await ctx.reply("❌ Please choose Male or Female."); continue; }
    data.gender = ctx.message.text;
    break;
  }

  // ── Phone ──────────────────────────────────────────────────────────────────
  await ctx.reply("📞 Step 3/6 — Enter your phone number:", removeKeyboard);
  while (true) {
    ctx = await conversation.wait();
    if (ctx.message?.text === "/cancel") { await ctx.reply("❌ Registration cancelled.", removeKeyboard); return; }
    const phone = ctx.message?.text?.trim() ?? "";
    if (!isValidPhone(phone)) { await ctx.reply("❌ Invalid phone number.\n\nExample: 0912345678  or  +251912345678"); continue; }
    data.phone = phone;
    break;
  }

  // ── Email ──────────────────────────────────────────────────────────────────
  await ctx.reply("📧 Step 4/6 — Enter your email:");
  while (true) {
    ctx = await conversation.wait();
    if (ctx.message?.text === "/cancel") { await ctx.reply("❌ Registration cancelled.", removeKeyboard); return; }
    const email = ctx.message?.text?.trim() ?? "";
    if (!isValidEmail(email)) { await ctx.reply("❌ Invalid email address. Please try again."); continue; }
    data.email = email;
    break;
  }

  // ── Password ───────────────────────────────────────────────────────────────
  await ctx.reply("🔒 Step 5/6 — Create a password:\n\nMust be at least 8 characters with letters and numbers.");
  while (true) {
    ctx = await conversation.wait();
    if (ctx.message?.text === "/cancel") { await ctx.reply("❌ Registration cancelled.", removeKeyboard); return; }
    const password = ctx.message?.text?.trim() ?? "";
    if (!isValidPassword(password)) { await ctx.reply("❌ Password must be at least 8 characters with letters and numbers.\n\nPlease try again:"); continue; }
    data.password = password;
    break;
  }

  // ── Confirm password ───────────────────────────────────────────────────────
  await ctx.reply("🔒 Step 6/6 — Confirm your password:");
  while (true) {
    ctx = await conversation.wait();
    if (ctx.message?.text === "/cancel") { await ctx.reply("❌ Registration cancelled.", removeKeyboard); return; }
    if (ctx.message?.text?.trim() !== data.password) { await ctx.reply("❌ Passwords do not match. Please try again:"); continue; }
    break;
  }

  // ── Save basic info ────────────────────────────────────────────────────────
  const basicResult = await conversation.external(async () => {
    try {
      const existing = await getTutorByEmail(data.email);
      if (existing) return { error: "email_taken" };
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const tutorId = await createTutor({
        telegram_id:       data.telegramId,
        telegram_username: data.telegramUsername,
        full_name:         data.fullName,
        gender:            data.gender,
        phone:             data.phone,
        email:             data.email,
        password:          hashedPassword,
      });
      return { tutorId };
    } catch (err) { return { error: err.message }; }
  });

  if (basicResult.error === "email_taken") {
    await ctx.reply("❌ This email is already registered.");
    return;
  }
  if (basicResult.error) {
    await ctx.reply("❌ Failed to save basic information. Please try again later.");
    return;
  }

  data.tutorId = basicResult.tutorId;

  // ══════════════════════════════════════════════════════════════
  //  PAUSE POINT — let the tutor choose: continue now or later
  // ══════════════════════════════════════════════════════════════
  const pauseKeyboard = new InlineKeyboard()
    .text("▶️ Continue Registration", "resume_registration")
    .text("👤 View My Profile", "view_profile");

  await ctx.reply(
    `✅ *Basic Information Saved!*\n\n` +
    `👤 ${data.fullName}\n` +
    `📞 ${data.phone}\n` +
    `📧 ${data.email}\n\n` +
    `What would you like to do next?\n\n` +
    `You can also continue later with /complete\\_profile`,
    { parse_mode: "Markdown", reply_markup: pauseKeyboard }
  );

  // Wait for the inline button choice
  while (true) {
    ctx = await conversation.wait();
    const cb = ctx.callbackQuery?.data;

    if (cb === "view_profile") {
      await ctx.answerCallbackQuery();
      await ctx.api.editMessageReplyMarkup(ctx.chat.id, ctx.callbackQuery.message.message_id, {
        reply_markup: new InlineKeyboard(),
      });
      await ctx.reply(
        `👤 *Your Profile*\n\n` +
        `Name: ${data.fullName}\n` +
        `Gender: ${data.gender}\n` +
        `Phone: ${data.phone}\n` +
        `Email: ${data.email}\n\n` +
        `📋 *Status:* Basic info saved ✅\n` +
        `⚠️ Professional info & documents not yet completed.\n\n` +
        `Use /complete\\_profile to finish your registration.`,
        { parse_mode: "Markdown", ...removeKeyboard }
      );
      return; // exit — they'll use /complete_profile later
    }

    if (cb === "resume_registration") {
      await ctx.answerCallbackQuery();
      await ctx.api.editMessageReplyMarkup(ctx.chat.id, ctx.callbackQuery.message.message_id, {
        reply_markup: new InlineKeyboard(),
      });
      break; // proceed to phase 2
    }

    // ignore any other update (text messages, etc.)
  }

  // ══════════════════════════════════════════════════════════════
  //  PHASES 2 & 3 — PROFESSIONAL INFO + DOCUMENTS
  // ══════════════════════════════════════════════════════════════
  const success = await runProfessionalAndDocuments(conversation, ctx, data);
  if (!success) return;

  // ── Final summary ──────────────────────────────────────────────────────────
  const docSummary = DOCUMENTS.map((d) => {
    const v = data.documents[d.key];
    return `${v ? "✅" : "⏭"} ${d.label}: ${v ? "Uploaded" : "Skipped"}`;
  }).join("\n");

  await ctx.reply(
    `🎉 *Registration Complete!*\n\n` +
    `Your profile has been submitted for review.\n\n` +
    `*📂 Documents:*\n${docSummary}\n\n` +
    `We will verify your documents and notify you within 24–48 hours.`,
    { parse_mode: "Markdown", ...removeKeyboard }
  );
}

// ═════════════════════════════════════════════════════════════════════════════
//  COMPLETE PROFILE CONVERSATION  (for tutors who paused after basic info)
// ═════════════════════════════════════════════════════════════════════════════
export async function completeProfileConversation(conversation, ctx) {
  // Look up the tutor by telegram ID
  const tutorRow = await conversation.external(() =>
    getTutorByTelegramId(ctx.from.id)
  );

  if (!tutorRow) {
    await ctx.reply(
      "❌ No account found for your Telegram ID.\n\nPlease register first using /register.",
      removeKeyboard
    );
    return;
  }

  await ctx.reply(
    `👋 Welcome back, *${tutorRow.full_name}*!\n\nLet's complete your professional information.`,
    { parse_mode: "Markdown", ...removeKeyboard }
  );

  const data = {
    tutorId:          tutorRow.id,
    telegramId:       tutorRow.telegram_id,
    telegramUsername: tutorRow.telegram_username,
    fullName:         tutorRow.full_name,
    documents:        {},
  };

  const success = await runProfessionalAndDocuments(conversation, ctx, data);
  if (!success) return;

  const docSummary = DOCUMENTS.map((d) => {
    const v = data.documents[d.key];
    return `${v ? "✅" : "⏭"} ${d.label}: ${v ? "Uploaded" : "Skipped"}`;
  }).join("\n");

  await ctx.reply(
    `🎉 *Registration Complete!*\n\n` +
    `Your profile has been submitted for review.\n\n` +
    `*📂 Documents:*\n${docSummary}\n\n` +
    `We will verify your documents and notify you within 24–48 hours.`,
    { parse_mode: "Markdown", ...removeKeyboard }
  );
}
