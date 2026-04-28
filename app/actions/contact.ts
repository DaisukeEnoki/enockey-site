"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// ユーザー入力を HTML に埋め込む前にエスケープ（XSS・HTMLインジェクション対策）
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendContactEmail(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  // ハニーポットチェック: 値が入っていたらボット
  const honeypot = formData.get("_website") as string;
  if (honeypot) {
    return { success: false, error: "送信に失敗しました。" };
  }

  // 送信時間チェック: ページ表示から3秒未満はボットとみなす
  const loadedAt = Number(formData.get("_loadedAt"));
  if (!loadedAt || Date.now() - loadedAt < 3000) {
    return { success: false, error: "送信に失敗しました。" };
  }

  if (!name || !email || !message) {
    return { success: false, error: "すべての項目を入力してください" };
  }

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "enockey.info@gmail.com",
      subject: `【enockey.com】${name}さんからのお問い合わせ`,
      // ユーザー入力はすべて escapeHtml() でサニタイズしてから HTML に埋め込む
      html: `
        <h2>お問い合わせが届きました</h2>
        <p><strong>お名前:</strong> ${escapeHtml(name)}</p>
        <p><strong>メールアドレス:</strong> ${escapeHtml(email)}</p>
        <p><strong>メッセージ:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
      `,
    });

    return { success: true };
  } catch {
    return { success: false, error: "送信に失敗しました。しばらく経ってから再度お試しください。" };
  }
}
