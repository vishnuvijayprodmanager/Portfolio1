"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Content } from "@/lib/content";

type Msg = { text: string; from: "bot" | "me" };

const SUGGESTIONS = ["What has he shipped?", "His approach?", "Current role?", "How do I contact him?"];

function answer(q: string, content: Content): string {
  const D = content;
  const linkedin = D.social.find((s) => s.label.toLowerCase() === "linkedin")?.url || "";

  if (/contact|email|reach|hire|phone|call|linkedin|touch/.test(q))
    return `Easiest ways to reach him:\n• Email: ${D.meta.email}\n• Phone: ${D.meta.phone}\n• LinkedIn: ${linkedin}\n\nOr use the form at the bottom — it lands in his inbox dashboard.`;

  if (/project|work|shipped|built|case|showcase/.test(q))
    return (
      "Featured work:\n\n" +
      D.projects
        .map((p, i) => `${i + 1}. ${p.title} [${p.status}] — ${p.description}${p.deck ? " (slides available — open the project!)" : ""}`)
        .join("\n\n")
    );

  if (/deck|slide|ppt|presentation|prd|guesstimate|library|document|case stud/.test(q)) {
    const wd = D.projects.filter((p) => p.deck);
    const ld = D.library.filter((d) => d.doc);
    const out: string[] = [];
    if (wd.length) out.push(`Projects with viewable decks: ${wd.map((p) => p.title).join(", ")} — hit "View the slides" on the card.`);
    if (ld.length) out.push(`In the Library: ${ld.map((d) => `${d.title} (${d.cat})`).join(", ")} — open them right on the site.`);
    return out.length
      ? out.join("\n\n")
      : `The Library section lists his case studies, PRDs and guesstimates — documents are being uploaded. Meanwhile, ask Vishnu directly at ${D.meta.email}.`;
  }

  if (/approach|process|principle|how (do|does) he work|method/.test(q))
    return D.approach.map((a, i) => `0${i + 1} ${a.title} — ${a.description}`).join("\n\n");

  if (/review|testimonial|word|recommend/.test(q))
    return "People he's worked with say:\n\n" + D.testimonials.map((t) => `"${t.quote}" — ${t.name}`).join("\n\n");

  if (/role|job|experience|edelweiss|company|current/.test(q))
    return `He's a ${D.meta.role} based in ${D.meta.location}. Favorite stat: feedback loops he implemented drove a 30% lift in adoption.`;

  if (/who|about|vishnu|background|story/.test(q))
    return D.aboutHeading.replace(/\*/g, "") + "\n\n" + D.aboutBody;

  if (/world|chai|cricket|hobby|life|fun/.test(q))
    return "From his My World canvas: " + D.world.map((w) => `${w.emo} ${w.cap}`).join(" · ") + ". Go drag it around — it's fun.";

  if (/hi|hello|hey/.test(q)) return "Hello! Ask me about Vishnu's projects, approach, experience, or how to get in touch.";

  return `I'm grounded in this site, so I'm best on Vishnu's projects, approach, experience and contact info. Try a suggestion below — or email ${D.meta.email}.`;
}

export default function ChatWidget({ content }: { content: Content }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [msgs, typing]);

  function botSay(text: string) {
    setTyping(true);
    const delay = Math.min(1400, 350 + text.length * 4);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { text, from: "bot" }]);
    }, delay);
  }

  function ask(raw: string) {
    const q = raw.trim();
    if (!q) return;
    setMsgs((m) => [...m, { text: q, from: "me" }]);
    setInput("");
    botSay(answer(q.toLowerCase(), content));
  }

  function openPanel() {
    setOpen(true);
    if (!msgs.length) {
      botSay("Hey, I'm Vishnu's assistant 👋 I know everything on this site — projects, approach, experience. What would you like to know?");
    }
  }

  return (
    <>
      {!open && (
        <button
          onClick={openPanel}
          className="fixed right-4 bottom-4 z-[90] rounded-full bg-accent px-5.5 py-3.5 font-mono text-xs font-medium tracking-[0.08em] text-black uppercase shadow-[0_14px_40px_-12px_rgba(255,183,3,0.55)] sm:right-8 sm:bottom-8"
        >
          ✦ Ask my AI
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-label="Chat with Vishnu's AI assistant"
          className="glass fixed right-2.5 bottom-2.5 z-[95] flex h-[min(560px,calc(100svh-40px))] w-[min(400px,calc(100vw-20px))] flex-col overflow-hidden rounded-[20px] sm:right-8 sm:bottom-8"
        >
          <div className="flex items-center justify-between border-b border-line px-4.5 py-4">
            <div className="flex items-center gap-3">
              <Image
                src="/images/vishnu-portrait.jpg"
                alt=""
                width={38}
                height={38}
                className="h-9.5 w-9.5 rounded-full border border-accent object-cover"
              />
              <div>
                <h3 className="text-sm font-extrabold">VV Assistant</h3>
                <div className="font-mono text-[10px] tracking-[0.12em] text-accent uppercase">● Online · knows this site</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="text-lg text-ink-soft">
              ✕
            </button>
          </div>

          <div ref={bodyRef} className="flex flex-1 flex-col gap-2.5 overflow-y-auto p-4">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                  m.from === "bot"
                    ? "self-start rounded-bl-sm border border-line bg-surface"
                    : "self-end rounded-br-sm bg-accent font-medium text-black"
                }`}
              >
                {m.text}
              </div>
            ))}
            {typing && (
              <div className="flex max-w-[85%] items-center gap-1 self-start rounded-2xl rounded-bl-sm border border-line bg-surface px-3.5 py-3">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink-soft"
                    style={{ animationDelay: `${i * 0.18}s` }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 px-4 pb-2.5">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => ask(s)}
                className="rounded-full border border-line px-3 py-1.5 font-mono text-[10px] tracking-[0.06em] text-ink-soft uppercase hover:border-accent hover:text-accent"
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex gap-2 border-t border-line p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && ask(input)}
              placeholder="Ask about projects, approach, experience…"
              aria-label="Your question"
              className="flex-1 rounded-full border border-line bg-surface px-4 py-2.5 text-sm text-ink outline-none focus:border-accent"
            />
            <button
              onClick={() => ask(input)}
              aria-label="Send"
              className="w-10.5 rounded-full bg-accent text-base font-bold text-black"
            >
              ↑
            </button>
          </div>
        </div>
      )}
    </>
  );
}
