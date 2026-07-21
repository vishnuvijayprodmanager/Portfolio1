"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Content } from "@/lib/content";
import { useToast } from "./Toast";

export default function ContactCTA({ content }: { content: Content }) {
  const { meta, social } = content;
  const linkedin = social.find((s) => s.label.toLowerCase() === "linkedin")?.url;
  const [submitting, setSubmitting] = useState(false);
  const { toast, ToastEl } = useToast();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setSubmitting(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
        }),
      });
      if (res.ok) {
        toast("Message sent ✓");
        form.reset();
      } else {
        toast("Couldn't send — try again");
      }
    } catch {
      toast("Couldn't send — try again");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="contact" className="border-t border-line px-6 py-[clamp(70px,9vw,130px)] text-center sm:px-16">
      <motion.h2
        className="text-[clamp(40px,8vw,110px)] leading-[0.95] font-black tracking-tight lowercase"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
      >
        let&apos;s build the <span className="text-accent">next thing</span>
      </motion.h2>

      <div className="mt-11 grid grid-cols-1 gap-7 text-left sm:grid-cols-2 sm:gap-18">
        <div className="flex flex-col gap-3.5">
          <a href={`mailto:${meta.email}`} className="text-[clamp(17px,2.1vw,26px)] font-extrabold tracking-tight hover:text-accent">
            {meta.email}
          </a>
          <a href={`tel:${meta.phone.replace(/\s/g, "")}`} className="text-[clamp(17px,2.1vw,26px)] font-extrabold tracking-tight hover:text-accent">
            {meta.phone}
          </a>
          {linkedin && (
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-[clamp(17px,2.1vw,26px)] font-extrabold tracking-tight hover:text-accent">
              LinkedIn ↗
            </a>
          )}
          <span className="font-mono text-xs tracking-[0.12em] text-ink-soft uppercase">{meta.location}</span>
        </div>

        <form onSubmit={onSubmit} className="grid gap-3">
          <div className="grid gap-1.5">
            <label htmlFor="f-name" className="font-mono text-[11px] tracking-[0.14em] text-ink-soft uppercase">
              Your name
            </label>
            <input
              id="f-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              className="w-full rounded-xl border border-line bg-surface px-4 py-3.5 text-[15px] text-ink outline-none focus:border-accent"
            />
          </div>
          <div className="grid gap-1.5">
            <label htmlFor="f-email" className="font-mono text-[11px] tracking-[0.14em] text-ink-soft uppercase">
              Your email
            </label>
            <input
              id="f-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-xl border border-line bg-surface px-4 py-3.5 text-[15px] text-ink outline-none focus:border-accent"
            />
          </div>
          <div className="grid gap-1.5">
            <label htmlFor="f-msg" className="font-mono text-[11px] tracking-[0.14em] text-ink-soft uppercase">
              Your message
            </label>
            <textarea
              id="f-msg"
              name="message"
              required
              className="min-h-[110px] w-full resize-y rounded-xl border border-line bg-surface px-4 py-3.5 text-[15px] text-ink outline-none focus:border-accent"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="btn-amber justify-self-start rounded-full bg-accent px-7 py-3.5 font-mono text-[13px] font-medium tracking-[0.06em] text-black uppercase disabled:opacity-60"
          >
            {submitting ? "Sending…" : "Send message"}
          </button>
        </form>
      </div>
      {ToastEl}
    </section>
  );
}
