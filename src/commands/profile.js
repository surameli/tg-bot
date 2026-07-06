import { InlineKeyboard } from "grammy";
import { getTutorByTelegramId }         from "../models/tutorModel.js";
import { getTutorProfessionalByTutorId } from "../models/tutorProffessionalModels.js";
import { getTutorDocuments }             from "../models/tutorDocumentModel.js";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseJson(value) {
  if (!value) return [];
  try { return JSON.parse(value); } catch { return [value]; }
}

function statusBadge(status) {
  const badges = { Pending: "🟡 Pending", Approved: "🟢 Approved", Rejected: "🔴 Rejected" };
  return badges[status] ?? "🟡 Pending";
}

// ─── Profile builder ──────────────────────────────────────────────────────────

async function sendFullProfile(ctx, telegramId) {
  const tutor = await getTutorByTelegramId(telegramId);

  if (!tutor) {
    await ctx.reply(
      "❌ No profile found.\n\nUse 📚 *Register as Tutor* from the menu to get started.",
      { parse_mode: "Markdown" }
    );
    return;
  }

  // ── Basic info section ─────────────────────────────────────────────────────
  let text =
    `👤 *Your Tutor Profile*\n` +
    `${"─".repeat(28)}\n\n` +
    `*Basic Information*\n` +
    `👤 Name: ${tutor.full_name}\n` +
    `⚧ Gender: ${tutor.gender}\n` +
    `📞 Phone: ${tutor.phone}\n` +
    `📧 Email: ${tutor.email}\n` +
    `🆔 Telegram: @${tutor.telegram_username || "—"}\n`;

  const prof = await getTutorProfessionalByTutorId(tutor.id);

  if (prof) {
    const subjects     = parseJson(prof.subject).join(", ")     || "—";
    const grades       = parseJson(prof.grade).join(", ")       || "—";
    const availDays    = parseJson(prof.available_days).join(", ") || "—";

    text +=
      `\n*Location*\n` +
      `🏙 City: ${prof.city}\n` +
      `🏘 Sub-city: ${prof.sub_city}\n` +
      `\n*Professional Information*\n` +
      `📚 Subjects: ${subjects}\n` +
      `🎓 Grades: ${grades}\n` +
      `💼 Experience: ${prof.experience} year(s)\n` +
      `🎓 Education: ${prof.education}\n` +
      `📅 Available Days: ${availDays}\n` +
      `⏰ Available Time: ${prof.available_time}\n` +
      `💰 Expected Payment: ${prof.expected_payment ?? "—"}\n`;
  } else {
    text += `\n⚠️ *Professional information not yet completed.*\n`;
  }

  // ── Documents section ──────────────────────────────────────────────────────
  const docs = await getTutorDocuments(tutor.id);
  const DOC_LABELS = {
    cv:           "Curriculum Vitae (CV)",
    degree:       "University Degree / Diploma",
    nationalId:   "National ID / Passport",
    certificates: "Certificates & Qualifications",
  };

  text += `\n*Documents*\n`;
  if (docs.length === 0) {
    text += `⚠️ No documents uploaded yet.\n`;
  } else {
    for (const doc of docs) {
      const label = DOC_LABELS[doc.document_type] ?? doc.document_type;
      text += `✅ ${label}\n`;
    }
  }

  // ── Status ─────────────────────────────────────────────────────────────────
  text += `\n*Account Status:* ${statusBadge(tutor.status ?? "Pending")}`;

  // ── Action buttons ─────────────────────────────────────────────────────────
  const kb = new InlineKeyboard();
  if (!prof) {
    kb.text("📋 Complete Profile", "go_complete_profile");
  }

  await ctx.reply(text, {
    parse_mode: "Markdown",
    reply_markup: kb.length > 0 ? kb : undefined,
  });

  // Send document files so the user can see/download them
  if (docs.length > 0) {
    await ctx.reply("📎 *Your uploaded documents:*", { parse_mode: "Markdown" });
    for (const doc of docs) {
      const label = DOC_LABELS[doc.document_type] ?? doc.document_type;
      await ctx.replyWithDocument(doc.telegram_file_id, {
        caption: `📄 ${label}`,
      });
    }
  }
}

// ─── Command & button handler ─────────────────────────────────────────────────

export default function registerProfileCommand(bot) {
  // /profile command
  bot.command("profile", async (ctx) => {
    await sendFullProfile(ctx, ctx.from.id);
  });

  // "👤 My Profile" reply keyboard button
  bot.hears("👤 My Profile", async (ctx) => {
    await sendFullProfile(ctx, ctx.from.id);
  });

  // Inline button from profile view — goes to complete profile conversation
  bot.callbackQuery("go_complete_profile", async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.conversation.enter("completeProfileConversation");
  });
}
