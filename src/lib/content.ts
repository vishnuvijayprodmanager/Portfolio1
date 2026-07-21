// Shape of all editable site content. One object drives the whole portfolio.

export type SocialLink = { label: string; url: string };
export type Stat = { value: string; label: string };
export type Metric = { value: string; label: string };

// A viewable document: base64 PDF bytes, base64 page images, or a URL to an
// already-hosted PDF (used for the pre-seeded library docs in public/library).
export type DocRef =
  | { type: "pdf"; data: string }
  | { type: "images"; pages: string[] }
  | { type: "pdf-url"; url: string };

export type Project = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  role: string;
  status: string;
  outcome: string;
  outcomes?: string[];
  metrics: Metric[];
  tags: string[];
  link?: string;
  image?: string;
  deck?: DocRef | null;
};

export type Principle = { title: string; description: string };

export type Testimonial = {
  name: string;
  role: string;
  company: string;
  quote: string;
  avatar?: string;
  link?: string;
};

export type LibraryDoc = {
  id: string;
  cat: string;
  title: string;
  desc: string;
  doc?: DocRef | null;
};

export type WorldItem = {
  id: string;
  emo: string;
  cap: string;
  x: number;
  y: number;
  img?: string;
};

export type Content = {
  meta: {
    name: string;
    role: string;
    tagline: string;
    bio: string;
    location: string;
    email: string;
    phone: string;
    resumeUrl: string;
    available: boolean;
  };
  social: SocialLink[];
  stats: Stat[];
  aboutHeading: string;
  aboutBody: string;
  projects: Project[];
  approachHeading: string;
  approachSub?: string;
  approach: Principle[];
  testimonialsHeading: string;
  testimonialsSub?: string;
  testimonials: Testimonial[];
  library: LibraryDoc[];
  librarySub: string;
  world: WorldItem[];
  worldSub: string;
};

// Default content seeded from the user's existing portfolio. Acts as the
// fallback when no database row exists yet, so the site always renders.
export const defaultContent: Content = {
  meta: {
    name: "Vishnu Vijay",
    role: "Product Manager",
    tagline:
      "I build CRMs, lead-management systems and distribution platforms that move millions in business — currently shaping products at Edelweiss Life from Mumbai.",
    bio: "Product Manager with 30+ months turning ambiguous problems into shipped products. I work end-to-end: discovery, roadmap, stakeholder alignment and technical delivery.",
    location: "Bangalore, India",
    email: "vishnuvijay.prodmanager@gmail.com",
    phone: "+91 8591378585",
    resumeUrl: "/resume/VishnuVijay_Resume.pdf",
    available: true,
  },
  social: [
    { label: "LinkedIn", url: "https://www.linkedin.com/in/vishnu-vijay95/" },
    { label: "Email", url: "mailto:vishnuvijay.prodmanager@gmail.com" },
  ],
  stats: [
    { value: "30+", label: "Months in product" },
    { value: "30%", label: "Lift in adoption rates" },
    { value: "6+", label: "Zero-to-one products shipped" },
  ],
  aboutHeading: "I turn messy, ambiguous problems into products people actually use.",
  aboutBody:
    "As a Product Manager at Edelweiss Life, I lead SaaS platforms from concept to launch — running stakeholder interviews and competitive analysis to define the roadmap, then driving the build with engineering and design. I specialise in CRMs, in-house distribution apps and custom dialer systems, and I care most about closing the loop between user feedback and what ships next.",
  projects: [
    {
      id: "sme-need-analysis",
      title: "SME — Need Analysis Tool",
      subtitle: "Progressive web app helping Indian SMEs choose the right business insurance",
      description:
        "A guided needs-analysis PWA that walks small and medium businesses through their risk profile and recommends appropriate cover. Built for an HDFC Life distribution context with offline-friendly performance.",
      role: "Drove the product from discovery to launch — stakeholder interviews, competitive analysis, roadmap and feature prioritization.",
      status: "Shipped",
      outcome: "Simplified a complex advisory flow into a few guided steps",
      outcomes: [
        "Launched as a PWA serving SME advisors across India",
        "Standardized need-analysis flow for business insurance recommendations",
      ],
      metrics: [
        { value: "PWA", label: "Offline-friendly" },
        { value: "SME", label: "Target segment" },
      ],
      tags: ["Product Management", "Insurance", "PWA", "HDFC Life"],
      deck: null,
    },
    {
      id: "insta-insure",
      title: "Insta Insure",
      subtitle: "Pre-approved digital insurance offers for HDFC Bank customers",
      description:
        "A platform surfacing pre-approved, personalised insurance offers to existing bank customers — turning a slow underwriting journey into an instant, digital purchase experience.",
      role: "Owned the end-to-end journey for pre-approved offers, aligning bank and insurer stakeholders. Worked on Bank API for customer validation and better offer generation for customers — removing third-party API dependency.",
      status: "Shipped",
      outcome: "Compressed the buy journey to near-instant for eligible customers",
      outcomes: [
        "Enabled instant, pre-approved insurance offers inside the bank journey",
        "Simplified issuance for eligible customers",
        "Designed fallback journey for non-eligible customers",
      ],
      metrics: [
        { value: "Instant", label: "Pre-approved flow" },
        { value: "Digital", label: "End-to-end" },
      ],
      tags: ["Insurance", "Pre-approved offer", "HDFC Bank", "Platform"],
      deck: null,
    },
    {
      id: "distribution-app",
      title: "Distribution Application",
      subtitle: "Enterprise platform for internal and external distribution stakeholders",
      description:
        "An in-house distribution application unifying lead management, CRM and a custom dialer for sales teams — with third-party integrations to keep the funnel and follow-ups in one place.",
      role: "Led end-to-end product development — discovery, roadmap, prioritization and launch.",
      status: "In production",
      outcome: "30% improvement in adoption through tight feedback loops",
      outcomes: [
        "30% improvement in adoption and user satisfaction via feedback loops",
        "Unified lead-to-login platform from Bank CRM to Edelweiss Life Login system through API integrations and SSO logins",
      ],
      metrics: [
        { value: "30%", label: "Adoption lift" },
        { value: "CRM", label: "+ Dialer + LMS" },
      ],
      tags: ["SaaS", "CRM", "Distribution", "B2B"],
      deck: null,
    },
  ],
  approachHeading: "How I work",
  approachSub: "30+ months of shipping gets you a few grey hairs — and some hard-won lessons.",
  approach: [
    {
      title: "Start from the problem",
      description:
        "I interview stakeholders and study the competition before writing a single requirement, so the roadmap solves the real problem — not the loudest one.",
    },
    {
      title: "Navigate ambiguity",
      description:
        "Most of the interesting work has no clear brief. I'm comfortable framing the question, making a call, and adjusting as evidence comes in.",
    },
    {
      title: "Ship and learn",
      description:
        "I bias toward getting something real in front of users quickly, then use feedback loops to improve adoption and satisfaction release over release.",
    },
    {
      title: "Bridge business and tech",
      description:
        "I translate between leadership, sales and engineering — keeping everyone pointed at the same outcome and unblocking delivery.",
    },
    {
      title: "Own the whole lifecycle",
      description:
        "Discovery, definition, delivery and adoption — I stay accountable end-to-end rather than handing off at the spec.",
    },
    {
      title: "Build for scale",
      description:
        "CRMs and distribution tools have to grow with the org. I design flows and integrations that hold up as teams and volume expand.",
    },
  ],
  testimonialsHeading: "What people say",
  testimonialsSub:
    "Kind words from the people I've built with — managers, engineers and stakeholders.",
  testimonials: [
    {
      name: "Nilesh Nikam",
      role: "Stakeholder",
      company: "Edelweiss Life",
      quote:
        "I had the pleasure of working with Vishnu on multiple initiatives at Edelweiss Life Insurance. He is dedicated and customer-focused Digital Product Manager with strong analytical skills and a collaborative approach. He consistently demonstrated ownership, effectively managed stakeholders, and delivered practical digital solutions that created business value. He is dependable, proactive, and a great team player.\n\nI highly recommend Vishnu and wish him continued success in his professional journey.",
      avatar: "/images/testimonials/nilesh-nikam.jpg",
    },
    {
      name: "Akhil Reghunath",
      role: "Manager",
      company: "HDFC Life",
      quote:
        "I had the pleasure of working with Vishnu at HDFC Life and was impressed by his proactive attitude, ownership, and enthusiasm for driving new initiatives. He consistently looked for opportunities to improve processes and deliver better outcomes while bringing a strong product mindset to problem-solving. He is collaborative, quick to learn, and always focused on creating value for both customers and the business. I'm confident he will be a valuable addition to any Product Management, Business Analysis, or Digital Transformation team.",
    },
    {
      name: "Sunil Vazhapally",
      role: "Vendor Project Management Lead",
      company: "",
      quote:
        "I managed the delivery team on our side during the API integration project with Vishnu's team at Edelweiss Life, and he was one of the more straightforward client-side PMs I've worked with — which, in vendor delivery, is worth a lot.\n\nA lot of client PMs either over-specify to the point where there's no room for us to flag technical tradeoffs, or under-specify and then move the goalposts mid-sprint. Vishnu did neither. He came into scoping conversations having already done the vendor evaluation homework — he understood our platform's actual constraints, not just what the sales deck promised, and that made the requirements discussions fast and honest. When we hit friction points on the integration — data format mismatches, auth handling, edge cases neither side had fully mapped upfront — he engaged directly instead of routing everything through email chains, and he was fair about distinguishing 'this is a genuine gap in the original scope' from 'this is scope creep on my end,' which isn't always the case with client stakeholders.",
    },
    {
      name: "Sudesh Gupta",
      role: "Head of IT Product",
      company: "Edelweiss Life",
      quote:
        "I worked closely with Vishnu on the lead management platform rollout for our field operations team, and what stood out most was how well he bridged the gap between business ambition and technical reality. Most PMs hand engineering a requirements doc and disappear until the sprint review. Vishnu didn't — he sat with us early, understood the constraints of integrating with existing systems, and came back with requirements that already accounted for edge cases: sync failures, partial data states, exception flows that usually get discovered the hard way, three sprints in.",
    },
  ],
  library: [
    {
      id: "d1",
      cat: "Case Study",
      title: "Google Maps — Product Case Study",
      desc: "A product teardown of Google Maps — what works, where it falls short, and how it could evolve.",
      doc: null,
    },
    {
      id: "d2",
      cat: "Case Study",
      title: "Netflix — Case Study 2026",
      desc: "A strategic deep-dive into Netflix's product and business positioning heading into 2026.",
      doc: null,
    },
    {
      id: "d3",
      cat: "PRD",
      title: "Insta Insure — pre-approved offers",
      desc: "Requirements doc for the pre-approved sum-assured journey.",
      doc: null,
    },
    {
      id: "d4",
      cat: "Guesstimate",
      title: "Market sizing — chai in Mumbai",
      desc: "A structured market-sizing walkthrough, assumptions to answer.",
      doc: null,
    },
  ],
  librarySub:
    "Case studies, PRDs, guesstimates and decks — the actual documents, viewable right here.",
  world: [
    { id: "w1", emo: "☕", cap: "Coffee, always", x: 6, y: 10 },
    { id: "w2", emo: "📸", cap: "Photography & cinematography", x: 38, y: 4 },
    { id: "w3", emo: "🏍️", cap: "Royal Enfield Himalayan rides", x: 70, y: 12 },
    { id: "w4", emo: "📊", cap: "Dashboards I overcheck", x: 14, y: 48 },
    { id: "w5", emo: "🎧", cap: "Lo-fi while writing PRDs", x: 46, y: 42 },
    { id: "w6", emo: "📒", cap: "Notion everything", x: 76, y: 50 },
    { id: "w7", emo: "🥟", cap: "Dosa Supremacy", x: 26, y: 76 },
    { id: "w8", emo: "🗺️", cap: "Roadmaps, literal & product", x: 58, y: 78 },
  ],
  worldSub: "A short snapshot of the things I need to function in this world.",
};
