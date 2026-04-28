"use client";

import { useRef, useState, useTransition, useEffect } from "react";
import { sendContactEmail } from "../actions/contact";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  // ページ表示時刻を記録（useEffect で初期化してレンダー中の副作用を回避）
  const loadedAt = useRef<number>(0);
  useEffect(() => {
    loadedAt.current = Date.now();
  }, []);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      // ページ表示から3秒未満の送信はボットとみなす
      formData.append("_loadedAt", String(loadedAt.current));

      const result = await sendContactEmail(formData);
      if (result.success) {
        setStatus("success");
        formRef.current?.reset();
      } else {
        setStatus("error");
        setErrorMessage(result.error ?? "エラーが発生しました");
      }
    });
  }

  if (status === "success") {
    return (
      <div className="p-6 bg-green-50 rounded-lg text-green-800 text-sm">
        送信しました。ありがとうございます。2〜3営業日以内にご返信します。
      </div>
    );
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-col gap-5">
      {/* ハニーポット: CSSで非表示。ボットが入力したら送信を拒否する */}
      <div style={{ display: "none" }} aria-hidden="true">
        <input name="_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">お名前</label>
        <input
          name="name"
          type="text"
          required
          placeholder="山田 太郎"
          className="border border-gray-300 rounded-md px-4 py-2 text-sm outline-none focus:border-gray-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">メールアドレス</label>
        <input
          name="email"
          type="email"
          required
          placeholder="your@email.com"
          className="border border-gray-300 rounded-md px-4 py-2 text-sm outline-none focus:border-gray-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">メッセージ</label>
        <textarea
          name="message"
          required
          rows={6}
          placeholder="ご依頼内容をご記入ください"
          className="border border-gray-300 rounded-md px-4 py-2 text-sm outline-none focus:border-gray-500 resize-none"
        />
      </div>

      {status === "error" && (
        <p className="text-red-500 text-sm">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="py-3 rounded-md text-sm font-medium text-white transition-opacity disabled:opacity-50"
        style={{ backgroundColor: "#ff6a45" }}
      >
        {isPending ? "送信中..." : "送信する"}
      </button>
    </form>
  );
}
