import { Scenes, Markup } from "telegraf";

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Extract the best available file_id from a Telegram message.
 * Accepts documents, photos, and images sent as files.
 *
 * @param {import("telegraf").Context} ctx
 * @returns {string | null}
 */
function extractFileId(ctx) {
  if (ctx.message?.document) {
    return ctx.message.document.file_id;
  }
  if (ctx.message?.photo) {
    // Telegram sends multiple resolutions; take the highest quality one
    const photos = ctx.message.photo;
    return photos[photos.length - 1].file_id;
  }
  return null;
}

/**
 * Prompt the user to upload a document for a given document type.
 *
 * @param {import("telegraf").Context} ctx
 * @param {string} label  Human-readable document name
 * @param {string} hint   Extra guidance shown under the label
 */
async function promptUpload(ctx, label, hint) {
  await ctx.reply(
    `📎 *${label}*\n\n${hint}\n\nSend the file as a document or photo.\nType /skip to skip this document.`,
    {
      parse_mode: "Markdown",
      ...Markup.removeKeyboard(),
    }
  );
}

// ─── Document Upload Steps ───────────────────────────────────────────────────

const DOCUMENTS = [
  {
    key: "cv",
    label: "Curriculum Vitae (CV)",
    hint: "Upload your CV in PDF or Word format.",
  },
  {
    key: "degree",
    label: "University Degree / Diploma",
    hint: "Upload a clear scan or photo of your highest qualification.",
  },
  {
    key: "nationalId",
    label: "National ID / Passport",
    hint: "Upload a clear photo of your National ID or passport.",
  },
  {
    key: "certificates",
    label: "Certificates & Qualifications",
    hint: "Upload any additional certificates (send as one file or photo).\nType /skip if you have none.",
  },
];

// ─── Scene ───────────────────────────────────────────────────────────────────

const tutorDocumentScene = new Scenes.WizardScene(
  "tutor-document-scene",

  // ── STEP 0  Intro + ask for CV ──────────────────────────────────────────
  async (ctx) => {
    ctx.wizard.state.data = { ...ctx.scene.state };
    ctx.wizard.state.data.documents = {};

    await ctx.reply(
      "📂 *Document Upload*\n\nPlease upload the required documents one by one.\nType /cancel at any time to cancel registration.",
      { parse_mode: "Markdown" }
    );

    await promptUpload(ctx, DOCUMENTS[0].label, DOCUMENTS[0].hint);
    return ctx.wizard.next();
  },

  // ── STEP 1  Receive CV → ask for Degree ────────────────────────────────
  async (ctx) => {
    if (ctx.message?.text === "/cancel") {
      await ctx.reply("❌ Registration cancelled.", Markup.removeKeyboard());
      return ctx.scene.leave();
    }

    const fileId = extractFileId(ctx);

    if (!fileId) {
      await ctx.reply(
        "❌ Please send a document or photo file.\n\nType /skip to skip this document."
      );
      return;
    }

    ctx.wizard.state.data.documents.cv = fileId;

    await ctx.reply("✅ CV received.");
    await promptUpload(ctx, DOCUMENTS[1].label, DOCUMENTS[1].hint);
    return ctx.wizard.next();
  },

  // ── STEP 2  Receive Degree → ask for National ID ────────────────────────
  async (ctx) => {
    if (ctx.message?.text === "/cancel") {
      await ctx.reply("❌ Registration cancelled.", Markup.removeKeyboard());
      return ctx.scene.leave();
    }

    const fileId = extractFileId(ctx);

    if (!fileId) {
      await ctx.reply(
        "❌ Please send a document or photo file.\n\nType /skip to skip this document."
      );
      return;
    }

    ctx.wizard.state.data.documents.degree = fileId;

    await ctx.reply("✅ Degree received.");
    await promptUpload(ctx, DOCUMENTS[2].label, DOCUMENTS[2].hint);
    return ctx.wizard.next();
  },

  // ── STEP 3  Receive National ID → ask for Certificates ──────────────────
  async (ctx) => {
    if (ctx.message?.text === "/cancel") {
      await ctx.reply("❌ Registration cancelled.", Markup.removeKeyboard());
      return ctx.scene.leave();
    }

    const fileId = extractFileId(ctx);

    if (!fileId) {
      await ctx.reply(
        "❌ Please send a document or photo file.\n\nType /skip to skip this document."
      );
      return;
    }

    ctx.wizard.state.data.documents.nationalId = fileId;

    await ctx.reply("✅ National ID received.");
    await promptUpload(ctx, DOCUMENTS[3].label, DOCUMENTS[3].hint);
    return ctx.wizard.next();
  },

  // ── STEP 4  Receive Certificates → Complete registration ─────────────────
  async (ctx) => {
    if (ctx.message?.text === "/cancel") {
      await ctx.reply("❌ Registration cancelled.", Markup.removeKeyboard());
      return ctx.scene.leave();
    }

    const fileId = extractFileId(ctx);

    if (ctx.message?.text === "/skip") {
      ctx.wizard.state.data.documents.certificates = null;
    } else if (!fileId) {
      await ctx.reply(
        "❌ Please send a document or photo file.\n\nType /skip if you have no certificates."
      );
      return;
    } else {
      ctx.wizard.state.data.documents.certificates = fileId;
    }

    await ctx.reply("✅ Certificates received.");

    // ── Build summary ──────────────────────────────────────────────────────
    const data = ctx.wizard.state.data;
    const docs = data.documents;

    const docSummary = DOCUMENTS.map((d) => {
      const value = docs[d.key];
      return `${value ? "✅" : "⏭"} ${d.label}: ${value ? "Uploaded" : "Skipped"}`;
    }).join("\n");

    await ctx.reply(
      `🎉 *Registration Complete!*\n\n` +
        `Your profile has been submitted for review.\n\n` +
        `*📂 Documents:*\n${docSummary}\n\n` +
        `We will verify your documents and notify you within 24–48 hours.`,
      {
        parse_mode: "Markdown",
        ...Markup.removeKeyboard(),
      }
    );

    // Log the full registration data (replace with DB save in production)
    console.log("📋 New tutor registration:", JSON.stringify(data, null, 2));

    return ctx.scene.leave();
  }
);

export default tutorDocumentScene;
