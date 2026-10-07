export const HELPLINE = "+2348154260210";

export const MISSION =
  "To create safe spaces and provide support services to children and adults affected by sexual violence through community-based projects, child empowerment programs, health and wellness initiatives, and advocacy for social justice, ultimately fostering a culture of peace, justice, and empowerment for all.";

export const HERO_MISSION =
  "Creating safe spaces and provide support services to children and adults affected by sexual violence through community-based projects, child empowerment programs, health and wellness initiatives, and advocacy for social justice, ultimately fostering a culture of peace, justice, and empowerment for all.";

export const VISION =
  "A world where every individual lives free from sexual assault, abuse, and trafficking, with access to safe spaces, support, justice, and empowerment.";

export const OVERVIEW =
  "Larsen Advocacy and Empowerment Foundation (LAEF) is a non-governmental organization committed to ending sexual violence and child trafficking. We are dedicated to the prevention of abuse and the protection of survivors through advocacy, education, empowerment, community-based initiatives, and comprehensive survivor support services. We believe every child and every survivor deserves safety, justice, and the opportunity to heal and thrive.";

export const FOUNDER_MESSAGE =
  "As a survivor of sexual violence, building Larsen Advocacy & Empowerment Foundation has been deeply personal for me. It is a source of hope and relief to know that we are working towards a future where no child or young person has to experience what I went through, where no survivor is silenced, and where abuse does not go unanswered... We are building more than an organisation. We are building an ecosystem where survivors and vulnerable people can find safety, dignity, healing, justice, support, and the opportunity to rebuild their lives.";

export const PILLARS = [
  {
    title: "Response",
    body: "We provide direct intervention and support for survivors of sexual violence.",
  },
  {
    title: "Prevention",
    body: "We implement preventive measures through advocacy, education, and community service to reduce the incidence of violence.",
  },
  {
    title: "Empowerment",
    body: "We equip survivors, children, and vulnerable communities with the knowledge, skills, psychosocial support, and resources they need to heal, rebuild their lives, and live independently with dignity.",
  },
];

export const IMPACT = [
  { value: 1700, suffix: "+", label: "boys reached via Omokunrinnimi across Lagos, Ogun, Ondo, Oyo, and Benue States" },
  { value: 4200, suffix: "+", label: "people and 7 communities reached via Focus March" },
  { value: 6000, suffix: "+", label: "people and 6+ communities reached via Bank 200" },
  { value: 5000, suffix: "+", label: "clothing donations received (e.g., from Unilever)" },
];

export const CORE_VALUES = [
  { title: "Transparency", body: "We uphold honesty and ethical practices in all we do" },
  { title: "Compassion", body: "We lead with empathy and honor diverse experiences" },
  {
    title: "Support",
    body: "We provide compassionate support to the communities we serve and to members of our organization",
  },
  {
    title: "Social Justice & Equality",
    body: "We advocate for policy reforms to address the root causes of inequality and injustice and to promote fairness for all",
  },
  { title: "Partnership", body: "We value collaboration, teamwork, shared goals, and inclusive processes" },
  {
    title: "Sustainable Impact",
    body: "We strive to create lasting, positive change in the communities we serve",
  },
];

export const STORY_TIMELINE = [
  {
    year: "March 29, 2014",
    title: "Established as Victorious Foundation",
    body: "The organisation was established on March 29, 2014 as Victorious Foundation, with its first major project a visit to Heritage Home.",
  },
  {
    year: "2016",
    title: "Stop the Silence Against Child Sexual Abuse",
    body: "The team joined the Stop the Silence Against Child Sexual Abuse campaign in Lagos, deepening its commitment to child protection advocacy.",
  },
  {
    year: "2018",
    title: "Larsen Advocacy and Empowerment Foundation",
    body: "Larsen Advocacy and Empowerment Foundation was officially established, led by founder Miss Omotoyosi Omolade Fadayomi.",
  },
  {
    year: "Today",
    title: "LAEF Care Plus Clinic",
    body: "Survivor support is anchored by LAEF Care Plus Clinic alongside our community programmes across Nigeria.",
  },
];

export type Program = {
  slug: string;
  name: string;
  tagline: string;
  body: string[];
  ctas: string[];
  callout?: { title: string; body: string };
  image: "march" | "women" | "community";
};

export const PROGRAMS: Program[] = [
  {
    slug: "omokunrinnimi-initiative",
    name: "Omokunrinnimi Initiative",
    tagline: "Raising boys who know, grow, protect and lead.",
    body: [
      "The Omokunrinnimi Initiative is a Larsen Advocacy & Empowerment Foundation programme focused on empowering boys and young men across Nigeria through education, mentorship, health awareness, child protection, and personal development.",
      "We create safe spaces for boys aged 8–18 where they can ask questions, learn about their bodies and boundaries, build healthy relationships, and grow into young men who protect rather than harm.",
    ],
    ctas: ["SPONSOR OMOKUNRINIMI", "PARTNER WITH US"],
    image: "community",
  },
  {
    slug: "heart-mender-series",
    name: "Heart Mender Series",
    tagline: "Knowledge and confidence for every young person.",
    body: [
      "The Heart Mender Series is a school-based programme designed to equip young people with the knowledge and confidence to understand, protect, and advocate for themselves.",
      "Through our MINE Manual, a person-centred educational resource, students learn about body autonomy, consent, safe disclosure, and where to find help.",
    ],
    ctas: ["BRING HEART MENDER TO YOUR SCHOOL"],
    image: "community",
  },
  {
    slug: "finfit-fellowship",
    name: "Larsen Women FinFit Fellowship",
    tagline: "Financial independence as a form of protection.",
    body: [
      "The Larsen Women FinFit Fellowship empowers women with the knowledge, skills, and support needed to recognise financial abuse, strengthen financial independence, and build sustainable financial futures.",
      "Fellows move through practical sessions on saving, budgeting, income growth, and long-term planning, supported by a peer community.",
    ],
    ctas: ["JOIN THE FINFIT FELLOWSHIP"],
    image: "women",
  },
  {
    slug: "omosuyi-storytelling",
    name: "LAEF Conversations / Omosuyi Storytelling Panel Session",
    tagline: "Safe conversations on trauma, healing, and resilience.",
    body: [
      "The Omosuyi Storytelling Panel Session creates a safe and meaningful space for conversations around adverse childhood experiences, trauma, healing, and resilience.",
      "Each session brings survivors, professionals, and community voices together so that lived experience can inform prevention and care.",
    ],
    ctas: ["PARTNER WITH US", "HOST AN OMOSUYI SESSION"],
    image: "community",
  },
  {
    slug: "focus-march-carnival",
    name: "Focus March Against Sexual Violence (#SayNoToRape Carnival)",
    tagline: "Education, advocacy, art, and community engagement.",
    body: [
      "The Focus March Against Sexual Violence, also known as the #SayNoToRape Carnival, is an annual community outreach initiative that uses education, advocacy, art, and community engagement to raise awareness and prevent sexual violence.",
      "The march moves through markets, schools, and neighbourhoods, turning public space into a place of learning and solidarity.",
    ],
    ctas: ["SUPPORT THE CAMPAIGN", "PARTNER WITH US", "BRING THE CARNIVAL TO YOUR COMMUNITY"],
    image: "march",
  },
  {
    slug: "bank-200",
    name: "Bank 200 Community Aid Project",
    tagline: "Clothing. Dignity. Protection. Empowerment.",
    body: [
      "The Bank 200 Community Aid Project is a community-focused social impact initiative supporting vulnerable children, women, men, and families.",
      "Donated clothing is sorted, cleaned, and distributed with dignity through the Bank 200 Charity Cloth Bank.",
    ],
    ctas: ["SUPPORT BANK 200", "PARTNER WITH US", "DONATE CLOTHING"],
    callout: {
      title: "Team Card",
      body: "A team card is a pooled donation by a group of people, church, mosque, business, school, or organization to support Bank 200 Charity Cloth Bank.",
    },
    image: "march",
  },
  {
    slug: "community-champions",
    name: "Community Champions Project",
    tagline: "Raising Young Protectors, One Community at a Time.",
    body: [
      "The Community Champions Project equips children and young people with the knowledge, confidence, and skills to become positive voices for child protection and safety within their communities.",
      "Champions are trained, mentored, and supported to lead safety conversations where they live and learn.",
    ],
    ctas: ["SUPPORT COMMUNITY CHAMPIONS", "PARTNER WITH US"],
    image: "community",
  },
];

export type Staff = {
  id: string;
  name: string;
  title: string;
  bio: string;
};

export const STAFF: Staff[] = [
  {
    id: "s1",
    name: "Miss Omotoyosi Omolade Fadayomi",
    title: "Founder & Executive Director",
    bio: "A survivor-advocate leading LAEF's vision for prevention, protection, and survivor-centred care across Nigeria.",
  },
  {
    id: "s2",
    name: "Adebola Ijaiya",
    title: "Director of Programmes",
    bio: "Oversees programme design and delivery across Omokunrinnimi, Heart Mender, and Community Champions.",
  },
  {
    id: "s3",
    name: "Chinaza Okereke",
    title: "Survivor Support Lead, LAEF Care Plus Clinic",
    bio: "Coordinates psychosocial support, referrals, and case follow-up for survivors reaching our helpline.",
  },
  {
    id: "s4",
    name: "Tunde Bakare",
    title: "Advocacy & Partnerships Manager",
    bio: "Builds partnerships with schools, faith groups, businesses, and government stakeholders.",
  },
  {
    id: "s5",
    name: "Halima Yusuf",
    title: "Community Engagement Officer",
    bio: "Leads the Focus March and Bank 200 outreach teams across participating communities.",
  },
  {
    id: "s6",
    name: "Grace Aluko",
    title: "Finance & Operations Officer",
    bio: "Manages transparent stewardship of donations, team cards, and programme budgets.",
  },
];

export type GalleryItem = {
  id: string;
  caption: string;
  category: "Focus March" | "Bank 200" | "Omokunrinnimi" | "Heart Mender" | "Community Champions";
  year: "2026" | "2025" | "2024";
  tone: number;
};

export const GALLERY: GalleryItem[] = [
  { id: "g1", caption: "#SayNoToRape Carnival street march, Lagos", category: "Focus March", year: "2026", tone: 0 },
  { id: "g2", caption: "Community sensitisation stand at the carnival", category: "Focus March", year: "2025", tone: 1 },
  { id: "g3", caption: "Bank 200 cloth distribution day", category: "Bank 200", year: "2026", tone: 2 },
  { id: "g4", caption: "Sorting donated clothing at the Charity Cloth Bank", category: "Bank 200", year: "2025", tone: 3 },
  { id: "g5", caption: "Omokunrinnimi mentorship circle for boys aged 8–18", category: "Omokunrinnimi", year: "2026", tone: 4 },
  { id: "g6", caption: "School visit in Ogun State", category: "Omokunrinnimi", year: "2024", tone: 5 },
  { id: "g7", caption: "MINE Manual classroom session", category: "Heart Mender", year: "2025", tone: 6 },
  { id: "g8", caption: "Students pledge to speak up", category: "Heart Mender", year: "2024", tone: 7 },
  { id: "g9", caption: "Community Champions training weekend", category: "Community Champions", year: "2026", tone: 8 },
  { id: "g10", caption: "Young protectors lead a safety walk", category: "Community Champions", year: "2025", tone: 9 },
  { id: "g11", caption: "Partner handover of clothing donations", category: "Bank 200", year: "2024", tone: 10 },
  { id: "g12", caption: "Carnival performers raise awareness through art", category: "Focus March", year: "2024", tone: 11 },
];

export type Donation = {
  id: string;
  donor: string;
  email: string;
  amount: number;
  fund: string;
  source: string;
  status: "Successful" | "Pending";
  date: string;
};

export const DONATIONS: Donation[] = [
  { id: "D-1041", donor: "Bukola Adeyemi", email: "bukola.a@example.com", amount: 250000, fund: "General Donation", source: "Individual", status: "Successful", date: "2026-09-22" },
  { id: "D-1042", donor: "Grace Chapel Youth", email: "youth@gracechapel.example", amount: 480000, fund: "Support Bank 200", source: "Team Card — Grace Chapel", status: "Successful", date: "2026-09-21" },
  { id: "D-1043", donor: "Emeka Nwosu", email: "emeka.n@example.com", amount: 75000, fund: "Sponsor Omokunrinnimi", source: "Individual", status: "Pending", date: "2026-09-20" },
  { id: "D-1044", donor: "Unilever Nigeria", email: "csr@unilever.example", amount: 1200000, fund: "Support Bank 200", source: "Corporate Partner", status: "Successful", date: "2026-09-18" },
  { id: "D-1045", donor: "Fatima Bello", email: "fatima.b@example.com", amount: 30000, fund: "Support Campaign", source: "Individual", status: "Successful", date: "2026-09-17" },
  { id: "D-1046", donor: "Ikeja Business Circle", email: "hello@ibc.example", amount: 650000, fund: "General Donation", source: "Team Card — IBC", status: "Pending", date: "2026-09-15" },
  { id: "D-1047", donor: "Tolu Ogunleye", email: "tolu.o@example.com", amount: 100000, fund: "Sponsor Omokunrinnimi", source: "Individual", status: "Successful", date: "2026-09-14" },
  { id: "D-1048", donor: "St. Mary's School", email: "admin@stmarys.example", amount: 210000, fund: "Support Campaign", source: "Team Card — St. Mary's", status: "Successful", date: "2026-09-12" },
];

export const HELPLINE_INQUIRIES = [
  { id: "H-301", time: "08:42", topic: "Survivor referral — Lagos Mainland", status: "Escalated to Care Plus Clinic" },
  { id: "H-302", time: "11:05", topic: "School safeguarding question", status: "Resolved" },
  { id: "H-303", time: "14:27", topic: "Request for counselling appointment", status: "Follow-up scheduled" },
  { id: "H-304", time: "19:58", topic: "Anonymous disclosure support", status: "Ongoing support" },
];

export const MONTHLY_DONATIONS = [
  { month: "Apr", amount: 1.2 },
  { month: "May", amount: 1.8 },
  { month: "Jun", amount: 1.5 },
  { month: "Jul", amount: 2.4 },
  { month: "Aug", amount: 2.1 },
  { month: "Sep", amount: 3.0 },
];

export const ADMIN_USERS = [
  { id: "u1", name: "Omotoyosi Fadayomi", email: "founder@laef.example", role: "Super-Admin", active: true },
  { id: "u2", name: "Adebola Ijaiya", email: "programmes@laef.example", role: "Admin", active: true },
  { id: "u3", name: "Grace Aluko", email: "finance@laef.example", role: "Admin", active: true },
  { id: "u4", name: "Tunde Bakare", email: "partnerships@laef.example", role: "Admin", active: false },
];