import { getContent } from "@/lib/data";
import DeckViewerProvider from "@/components/DeckViewerContext";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import MarqueeStrip from "@/components/MarqueeStrip";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Library from "@/components/Library";
import Approach from "@/components/Approach";
import Testimonials from "@/components/Testimonials";
import MyWorld from "@/components/MyWorld";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getContent();

  return (
    <DeckViewerProvider>
      <Nav />
      <main className="min-h-screen">
        <Hero content={content} />
        <MarqueeStrip text="About me" />
        <About content={content} />
        <MarqueeStrip text="Projects showcase" />
        <Projects content={content} />
        <MarqueeStrip text="The library" />
        <Library content={content} />
        <MarqueeStrip text="My approach" />
        <Approach content={content} />
        <MarqueeStrip text="Don't just take my word" />
        <Testimonials content={content} />
        <MarqueeStrip text="My world" />
        <MyWorld content={content} />
        <ContactCTA content={content} />
        <Footer content={content} />
      </main>
      <ChatWidget content={content} />
    </DeckViewerProvider>
  );
}
