/**
 * src/lib/telegramApprovalBot.ts
 * 
 * Telegram Bot API Integration Core for Human-in-the-Loop AI Decisions:
 * 1. Sends formatted decision notifications with interactive inline buttons to Admin Telegram.
 * 2. Parses callback button clicks and text prompt replies from Telegram.
 * 3. Updates Approval Queue status dynamically.
 */

import { ApprovalTicket, approveTicket, rejectTicket, getApprovalTicketById, setTicketTelegramMessageId } from './approvalQueueManager';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

/**
 * Sends a Telegram notification with inline action buttons to Admin Telegram
 */
export async function sendTelegramApprovalRequest(ticket: ApprovalTicket): Promise<{ success: boolean; messageId?: number }> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('[Telegram Bot] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID missing in env. Simulated mode active.');
    return { success: true, messageId: 9999 };
  }

  const messageText = `🚨 *HUMAN APPROVAL REQUIRED* 🚨\n\n` +
    `*Action:* ${ticket.actionType}\n` +
    `*Title:* ${ticket.title}\n` +
    `*Summary:* ${ticket.summary}\n\n` +
    `*Ticket ID:* \`${ticket.id}\`\n\n` +
    `👇 *Review decision or reply with custom prompt:*`;

  const inlineKeyboard = {
    inline_keyboard: [
      [
        { text: '✅ APPROVE', callback_data: `approve_${ticket.id}` },
        { text: '❌ REJECT', callback_data: `reject_${ticket.id}` },
      ],
      [
        { text: '💬 REPLY WITH PROMPT', callback_data: `prompt_${ticket.id}` },
      ],
    ],
  };

  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: messageText,
        parse_mode: 'Markdown',
        reply_markup: inlineKeyboard,
      }),
    });

    const json = await res.json();
    if (json.ok && json.result?.message_id) {
      await setTicketTelegramMessageId(ticket.id, json.result.message_id);
      return { success: true, messageId: json.result.message_id };
    }
  } catch (err: any) {
    console.error('[Telegram Bot] Failed to send Telegram message:', err.message);
  }

  return { success: false };
}

/**
 * Handles Telegram Webhook Updates (Callback Queries & Message Replies)
 */
export async function processTelegramWebhookUpdate(update: any): Promise<{ handled: boolean; action?: string; ticketId?: string }> {
  if (!update) return { handled: false };

  // Handle Callback Button Click
  if (update.callback_query) {
    const callback = update.callback_query;
    const data = callback.data || '';
    const callbackId = callback.id;

    if (data.startsWith('approve_')) {
      const ticketId = data.replace('approve_', '');
      await approveTicket(ticketId);
      await answerTelegramCallback(callbackId, '✅ Decision Approved!');
      await editTelegramMessage(callback.message.chat.id, callback.message.message_id, `✅ *DECISION APPROVED*\nTicket ID: \`${ticketId}\``);
      return { handled: true, action: 'APPROVE', ticketId };
    }

    if (data.startsWith('reject_')) {
      const ticketId = data.replace('reject_', '');
      await rejectTicket(ticketId, 'Rejected via Telegram button');
      await answerTelegramCallback(callbackId, '❌ Decision Rejected');
      await editTelegramMessage(callback.message.chat.id, callback.message.message_id, `❌ *DECISION REJECTED*\nTicket ID: \`${ticketId}\``);
      return { handled: true, action: 'REJECT', ticketId };
    }

    if (data.startsWith('prompt_')) {
      const ticketId = data.replace('prompt_', '');
      await answerTelegramCallback(callbackId, '💬 Please type and send your custom prompt/instruction!');
      return { handled: true, action: 'PROMPT_WAIT', ticketId };
    }
  }

  // Handle Text Reply with Custom Prompt
  if (update.message && update.message.text) {
    const text = update.message.text.trim();
    const replyToMessage = update.message.reply_to_message;

    if (replyToMessage && replyToMessage.text) {
      const match = replyToMessage.text.match(/APPR-\d+-\d+/);
      if (match) {
        const ticketId = match[0];
        await approveTicket(ticketId, text);
        await sendTelegramTextMessage(update.message.chat.id, `✅ *Decision Approved with Custom Prompt!*\n\n*Ticket ID:* \`${ticketId}\`\n*Custom Prompt Instruction:* "${text}"`);
        return { handled: true, action: 'APPROVE_WITH_PROMPT', ticketId };
      }
    }
  }

  return { handled: false };
}

/**
 * Answers a Telegram callback query
 */
async function answerTelegramCallback(callbackQueryId: string, text: string): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN) return;
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ callback_query_id: callbackQueryId, text }),
    });
  } catch (_) {}
}

/**
 * Edits an existing Telegram message
 */
async function editTelegramMessage(chatId: number | string, messageId: number, text: string): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN) return;
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/editMessageText`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, message_id: messageId, text, parse_mode: 'Markdown' }),
    });
  } catch (_) {}
}

/**
 * Sends a plain text message to Telegram
 */
async function sendTelegramTextMessage(chatId: number | string, text: string): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN) return;
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
    });
  } catch (_) {}
}
