export const profile = {
  name: "Bradley Kubie",
  title: "Software Engineer",
  location: "St. George, UT",
  email: "bradleykubie6@gmail.com",
  phone: "208-270-2029",
  summary:
    "I am a software engineer with 7+ years of experience building reliable software.",
  personalSummary:
    "Outside of work, I love golfing, boating, and camping with my family. I also enjoy playing video games, staying active, and spending as much time outdoors as I can.",
  strengths: [
    {
      title: "Cross-border product delivery",
      description:
        "Designing the integrations, workflows, and supporting infrastructure needed to connect merchants with landed-cost, duty, tax, and shipping services.",
    },
    {
      title: "White-label partner launches",
      description:
        "Shipping branded commerce applications for major shipping carriers, from onboarding and platform registration through release and merchant adoption.",
    },
    {
      title: "Hands-on technical ownership",
      description:
        "Balancing implementation, troubleshooting, stakeholder communication, and platform compliance to keep complex integrations stable in production.",
    },
  ],
};

export const featuredHighlights = [
  { label: "Years building production software", value: "7+" },
  { label: "Commerce platforms across recent work", value: "5" },
  { label: "Focus: shipping, duties, and tax workflows", value: "End-to-end" },
];

export const aboutSections = [
  {
    title: "What I build",
    description:
      "I work on software that connects storefronts, carriers, and backend systems. That includes rate delivery, landed-cost calculations, checkout experiences, order processing, label workflows, and merchant onboarding for cross-border commerce.",
  },
  {
    title: "How I work",
    description:
      "My approach is pragmatic and detail-oriented. I like building systems that are straightforward to operate, resilient when integrations are messy, and clear enough for product, support, and partner teams to work with effectively.",
  },
  {
    title: "What I value",
    description:
      "Reliable releases, strong technical communication, and steady iteration. I enjoy taking ambiguous integration problems and turning them into production-ready software that merchants and partners can trust.",
  },
];

export const experienceEntries = [
  {
    company: "Zonos",
    location: "St. George, Utah",
    role: "Software Engineer",
    period: "November 2021 - Present",
    summary:
      "Building and maintaining cross-border commerce integrations for major storefront platforms and shipping partners.",
    highlights: [
      "Build and maintain integrations across Shopify, BigCommerce, Magento, WooCommerce, and Salesforce Commerce Cloud that connect merchant stores to Zonos landed-cost, duty, and tax services.",
      "Led development of a carrier-branded BigCommerce Duty & Tax white-label app, including partner account setup, carrier ID registration, and app store submission.",
      "Led and helped build a carrier-branded Shopify white-label app, covering rating, order processing, label workflows, and merchant onboarding.",
      "Developed Shopify checkout UI extensions for tax ID capture, currency conversion, and cart-attribute syncing of Zonos data.",
      "Shipped a WooCommerce plugin for a carrier global checkout integration, including WordPress.org SVN submission, trademark review, and queue-based order processing in PHP.",
      "Owned technical merchant communications for complex integration issues, release notes, configuration guidance, and Shopify App Store compliance reviews.",
    ],
  },
  {
    company: "The Church of Jesus Christ of Latter-day Saints",
    location: "Salt Lake City, Utah",
    role: "Software Engineer",
    period: "May 2018 - November 2021",
    summary:
      "Delivered software for high-availability systems in a mission-critical environment with close cross-functional collaboration.",
    highlights: [
      "Designed and delivered technology solutions for mission-critical, high-availability applications in collaboration with analysts, development teams, and infrastructure specialists.",
      "Partnered with product managers and functional analysts to evaluate and improve software interfaces and overall system performance.",
      "Identified performance bottlenecks and drove continuous-improvement recommendations across the application stack.",
      "Gathered stakeholder feedback throughout the project lifecycle and addressed concerns to keep delivery on track.",
    ],
  },
];

export const education = {
  degree: "Bachelor of Science in Information Technology",
  school: "Brigham Young University - Idaho",
  location: "Rexburg, Idaho",
  period: "2014-01 to 2018-05",
  gpa: "3.5",
};

export const skillGroups = [
  {
    title: "Languages and application development",
    skills: [
      "JavaScript",
      "TypeScript",
      "Node.js",
      "PHP",
      "Java",
      "Spring",
      "React",
      "Next.js",
    ],
  },
  {
    title: "Commerce platforms and APIs",
    skills: [
      "Shopify App Extensions",
      "Shopify Checkout Extensions",
      "BigCommerce",
      "Magento",
      "WooCommerce",
      "Salesforce Commerce Cloud",
      "GraphQL",
      "REST API design",
    ],
  },
  {
    title: "Shipping and cross-border domain expertise",
    skills: [
      "Landed cost",
      "HS codes",
      "DDP/DDU workflows",
      "White-label app development",
    ],
  },
  {
    title: "Infrastructure and delivery",
    skills: [
      "AWS Lambda",
      "AWS SSM",
      "AWS SSO",
      "Docker",
      "MySQL",
      "PostgreSQL",
      "MongoDB",
      "Datadog",
      "CI/CD",
      "Build releases",
      "Agile",
      "Scrum",
    ],
  },
];
