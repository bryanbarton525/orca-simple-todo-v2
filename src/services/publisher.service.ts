import nodemailer from 'nodemailer';
import { WebhookClient } from 'discord.js';
import webPush from 'web-push';
import { config } from 'dotenv';
import { setTimeout as sleep } from 'timers/promises';
config();

const MAX_RETRIES = 5;
const INITIAL_BACKOFF_MS = 100;

interface Article {
  title: string;
  url: string;
  summary?: string;
}

const smtpTransport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const discordClient = new WebhookClient({
  url: process.env.DISCORD_WEBHOOK_URL || ''
});

const vapidPublicKey = process.env.VAPID_PUBLIC_KEY || '';
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || '';
webPush.setVapidDetails('mailto:admin@example.com', vapidPublicKey, vapidPrivateKey);

async function retry<T>(fn: () => Promise<T>, attempt = 0): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (attempt >= MAX_RETRIES) throw err;
    const backoff = INITIAL_BACKOFF_MS * 2 ** attempt;
    console.warn(`Attempt ${attempt + 1} failed, retrying in ${backoff}ms:`, err);
    await sleep(backoff);
    return retry(fn, attempt + 1);
  }
}

export async function publishArticle(article: Article): Promise<void> {
  const { title, url, summary } = article;
  const message = `New article: ${title}\n${url}${summary ? '\n\n' + summary : ''}`;

  // 1. Email
  await retry(() =>
    smtpTransport.sendMail({
      from: process.env.SMTP_FROM || 'no-reply@example.com',
      to: process.env.NOTIFY_EMAILS?.split(',') || [],
      subject: `📢 ${title}`,
      text: message,
    })
  );

  // 2. Discord
  await retry(() =>
    discordClient.send(message)
  );

  // 3. Push
  const pushSubscription = JSON.parse(process.env.PUSH_SUBSCRIPTION || '{}');
  if (pushSubscription && pushSubscription.endpoint) {
    const payload = JSON.stringify({ title, url, summary });
    await retry(() => webPush.sendNotification(pushSubscription, payload));
  }

  console.log('Published article:', title);
}
