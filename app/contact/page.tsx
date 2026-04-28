// Server Component: フォームロジックは ContactForm (Client) に委譲
import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "enockey へのお仕事のご依頼・ご相談はこちらから。",
  openGraph: {
    title: "Contact | enockey",
    description: "enockey へのお仕事のご依頼・ご相談はこちらから。",
  },
};

export default function Contact() {
  return (
    <main className="px-8 py-12 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-2" style={{ color: "#1a1a1a" }}>
        Contact
      </h1>
      <p className="text-gray-500 mb-8 text-sm">お仕事のご依頼・ご相談はこちらから</p>
      <ContactForm />
    </main>
  );
}
