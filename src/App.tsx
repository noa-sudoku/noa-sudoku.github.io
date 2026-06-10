import { useEffect, useMemo, useState, type ReactNode } from "react";

type Lang = "ko" | "en";
type Theme = "light" | "dark";
type Page = "home" | "features" | "support" | "privacy";

const APP_STORE_URL =
  "https://apps.apple.com/kr/app/noa-sudoku-%EA%B4%91%EA%B3%A0-%EC%97%86%EB%8A%94-%EC%8A%A4%EB%8F%84%EC%BF%A0/id6756256696?itscg=30200&itsct=apps_box_badge&mttnsubad=6756256696";
const SHORT_URL = "https://apple.co/4ed2g25";

const appStoreBadge = {
  ko: {
    black:
      "https://toolbox.marketingtools.apple.com/api/v2/badges/download-on-the-app-store/black/ko-kr?releaseDate=1765238400",
    white:
      "https://toolbox.marketingtools.apple.com/api/v2/badges/download-on-the-app-store/white/ko-kr?releaseDate=1765238400",
    width: 265,
    alt: "App Store에서 다운로드"
  },
  en: {
    black:
      "https://toolbox.marketingtools.apple.com/api/v2/badges/download-on-the-app-store/black/en-us?releaseDate=1765238400",
    white:
      "https://toolbox.marketingtools.apple.com/api/v2/badges/download-on-the-app-store/white/en-us?releaseDate=1765238400",
    width: 245,
    alt: "Download on the App Store"
  }
} satisfies Record<Lang, { black: string; white: string; width: number; alt: string }>;

const copy = {
  ko: {
    home: "홈",
    features: "기능",
    support: "지원",
    subtitle: "광고 없는 스도쿠",
    privacy: "개인정보",
    preferences: "표시 설정",
    language: "언어",
    theme: "테마",
    light: "라이트",
    dark: "다크",
    heroLead: "Noa Sudoku",
    heroTitle: "조용하게 풀고, 기록은 가볍게 남깁니다.",
    heroBody:
      "광고, 배너, 복잡한 장식 없이 스도쿠에만 집중할 수 있는 iPhone, iPad용 앱입니다.",
    badgeLabel: "다운로드",
    shortLinkLabel: "짧은 링크",
    menu: "메뉴",
    close: "닫기",
    sectionTitle: "필요한 기능만 남긴 스도쿠",
    sectionBody:
      "새 게임, 난이도별 기록, 날짜별 기록, 힌트와 되돌리기. 매일 풀기에 필요한 흐름만 담았습니다.",
    sectionMore: "더보기 ->",
    copyright: "© 2025 TaeHwan Kim. All rights reserved."
  },
  en: {
    home: "Home",
    features: "Features",
    support: "Support",
    subtitle: "Ad-free Sudoku",
    privacy: "Privacy",
    preferences: "Display settings",
    language: "Language",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    heroLead: "Noa Sudoku",
    heroTitle: "A quiet Sudoku app for focused play.",
    heroBody:
      "Built for iPhone and iPad without ads, banners, or visual noise between you and the board.",
    badgeLabel: "Download",
    shortLinkLabel: "Short link",
    menu: "Menu",
    close: "Close",
    sectionTitle: "Only what Sudoku needs",
    sectionBody:
      "New games, difficulty records, daily history, hints, and undo. The app keeps the daily solving loop simple.",
    sectionMore: "More ->",
    copyright: "© 2025 TaeHwan Kim. All rights reserved."
  }
} satisfies Record<Lang, Record<string, string>>;

const features = [
  {
    ko: ["광고 없음", "배너와 팝업 없이 보드에 집중합니다."],
    en: ["No ads", "No banners or popups interrupt the board."]
  },
  {
    ko: ["기록", "난이도별 최고 기록과 날짜별 기록을 확인합니다."],
    en: ["Records", "Track best scores by difficulty and daily play."]
  },
  {
    ko: ["도움", "힌트와 되돌리기는 필요할 때만 씁니다."],
    en: ["Help", "Hints and undo stay available when needed."]
  }
] satisfies Array<Record<Lang, [string, string]>>;

const featurePageContent = {
  ko: {
    overline: "Features / 기능 소개",
    title: "필요한 기능만 남긴 스도쿠",
    body:
      "보드에 집중하고, 기록은 가볍게 남기고, 필요할 때만 도움을 쓰도록 흐름을 단순하게 정리했습니다.",
    items: [
      {
        title: "광고 없는 플레이",
        body: "광고 SDK, 배너, 팝업 없이 스도쿠 보드와 기록에만 집중합니다."
      },
      {
        title: "난이도별 퍼즐",
        body: "쉬움부터 마스터까지 매일 풀기 좋은 난이도를 골라 시작할 수 있습니다."
      },
      {
        title: "기록과 캘린더",
        body: "난이도별 최고 기록과 날짜별 플레이 기록을 한눈에 확인합니다."
      },
      {
        title: "필요할 때만 쓰는 도움",
        body: "힌트, 되돌리기, 메모 기능은 풀이 흐름을 방해하지 않도록 필요한 순간에만 꺼내 씁니다."
      },
      {
        title: "위젯과 알림",
        body: "홈 화면 위젯과 리마인더로 매일 풀기 흐름을 가볍게 이어갈 수 있습니다."
      },
      {
        title: "iCloud 동기화",
        body: "iCloud를 사용할 수 있는 환경에서는 클리어 기록과 일부 통계가 Apple 계정의 개인 데이터베이스로 동기화될 수 있습니다."
      }
    ]
  },
  en: {
    overline: "Features",
    title: "Sudoku, stripped down to what matters",
    body:
      "Noa Sudoku keeps the board focused, the records lightweight, and help available only when you need it.",
    items: [
      {
        title: "Ad-free play",
        body: "No ad SDKs, banners, or popups. The board and your records stay in focus."
      },
      {
        title: "Difficulty levels",
        body: "Start a puzzle that fits the day, from Easy through Master."
      },
      {
        title: "Records and calendar",
        body: "Review best times by difficulty and daily play history without extra clutter."
      },
      {
        title: "Help when needed",
        body: "Hints, undo, and notes stay available without getting in the way of solving."
      },
      {
        title: "Widgets and reminders",
        body: "Home screen widgets and reminders help you keep a simple daily solving rhythm."
      },
      {
        title: "iCloud sync",
        body:
          "When iCloud is available, clear records and related statistics can sync through your Apple account's private database."
      }
    ]
  }
} satisfies Record<Lang, { overline: string; title: string; body: string; items: Array<{ title: string; body: string }> }>;

const supportContent = {
  ko: {
    overline: "Support / 지원",
    title: "도움이 필요하신가요?",
    body:
      "앱 사용 중 문제가 있거나 개인정보 처리방침 관련 문의가 있다면 아래 이메일로 보내 주세요.",
    contactTitle: "지원 요청",
    contactBody:
      "상황을 재현하는 방법, 화면 캡처, 앱 버전, 기기 모델, iOS 버전, 발생 화면을 함께 적어 주시면 확인이 빠릅니다.",
    emailLabel: "이메일 보내기",
    questions: [
      {
        q: "광고가 있나요?",
        a: "아니요. Noa Sudoku는 광고 SDK, 배너, 팝업 광고를 사용하지 않습니다."
      },
      {
        q: "기록과 iCloud 데이터는 어떻게 저장되나요?",
        a: "기록은 기본적으로 사용자의 기기 안에 저장됩니다. iCloud / CloudKit을 사용하는 경우 데이터는 사용자의 Apple 계정에 연결된 개인 데이터베이스에 저장되며, 개발자는 사용자의 개인 iCloud 데이터에 접근할 수 없습니다."
      }
    ]
  },
  en: {
    overline: "Support",
    title: "Need help with Noa Sudoku?",
    body:
      "If something is not working or you have a privacy-related question, send an email and include the details below.",
    contactTitle: "Contact support",
    contactBody:
      "For faster troubleshooting, include how to reproduce the issue, a screenshot if useful, the app version, device model, iOS version, and where the issue happened.",
    emailLabel: "Send email",
    questions: [
      {
        q: "Does Noa Sudoku include ads?",
        a: "No. Noa Sudoku does not use ad SDKs, banners, or popup ads."
      },
      {
        q: "How are records and iCloud data stored?",
        a: "Records are primarily stored on your device. When iCloud / CloudKit is used, data is stored in the private database associated with your Apple account, and the developer cannot access your personal iCloud data."
      }
    ]
  }
} satisfies Record<
  Lang,
  {
    overline: string;
    title: string;
    body: string;
    contactTitle: string;
    contactBody: string;
    emailLabel: string;
    questions: Array<{ q: string; a: string }>;
  }
>;

const policyContent = {
  ko: {
    title: "개인정보 처리방침",
    updated: "최종 업데이트: 2026-06-10",
    intro: [
      'Noa Sudoku(이하 "본 앱")는 회원가입을 요구하지 않으며, 이름·전화번호·주소·위치정보·광고 식별자와 같은 개인정보를 수집하지 않습니다.'
    ],
    sections: [
      {
        title: "1. 개인정보 수집 여부",
        paragraphs: [
          "본 앱은 사용자의 이름, 이메일 주소, 전화번호, 주소, 위치 정보, 광고 식별자 등 개인정보를 수집하지 않습니다.",
          "앱 사용 중 생성되는 퍼즐 진행 상태, 난이도, 기록, 통계, 알림 설정 등은 앱 기능 제공을 위해 사용자의 기기 안에 저장될 수 있으며, 개발자가 운영하는 별도 서버로 전송되지 않습니다.",
          "문의하기 기능을 사용하는 경우, 사용자가 직접 작성한 이메일 내용과 사용자가 전송을 선택한 경우 이메일 본문에 포함되는 앱 버전, 기기 모델, iOS 버전 등의 진단 정보가 이메일을 통해 개발자에게 전송될 수 있습니다."
        ]
      },
      {
        title: "2. 데이터 저장",
        paragraphs: [
          "게임 데이터는 기본적으로 사용자의 기기 안에 저장됩니다.",
          "iCloud를 사용할 수 있는 환경에서는 클리어 기록 및 일부 통계 데이터가 사용자의 Apple 계정에 연결된 iCloud(CloudKit private database)를 통해 동기화될 수 있습니다."
        ]
      },
      {
        title: "3. 제3자 제공 및 외부 서비스",
        paragraphs: [
          "본 앱은 광고 SDK, 외부 분석 도구, 소셜 로그인 SDK를 사용하지 않습니다.",
          "다만 앱 기능 제공을 위해 Apple이 제공하는 다음 서비스를 사용할 수 있습니다."
        ],
        bullets: ["iCloud / CloudKit", "로컬 알림 기능", "App Store 리뷰 요청 기능", "메일 앱을 통한 문의 전송"],
        closing: [
          "본 앱은 이용자의 데이터를 광고 목적으로 제3자에게 판매하거나 제공하지 않습니다.",
          "iCloud / CloudKit에 저장되는 데이터는 사용자의 Apple 계정에 연결된 개인 데이터베이스에 저장되며, 개발자는 사용자의 개인 iCloud 데이터에 접근할 수 없습니다."
        ]
      },
      {
        title: "4. 알림",
        paragraphs: ["본 앱은 사용자가 허용한 경우에만 로컬 알림을 보냅니다."],
        bullets: ["매일 리마인더 알림", "다시 풀어보기 알림"],
        closing: "알림 권한은 언제든지 iOS 설정에서 변경할 수 있습니다."
      },
      {
        title: "5. 아동의 개인정보",
        paragraphs: ["본 앱은 아동을 대상으로 개인정보를 수집하지 않습니다."]
      },
      {
        title: "6. 문의",
        paragraphs: ["개인정보 처리방침과 관련하여 문의사항이 있으시면 아래 연락처로 문의해 주세요."],
        email: "iam@xoghks.com"
      }
    ]
  },
  en: {
    title: "Privacy Policy",
    updated: "Last updated: 2026-06-10",
    intro: [
      'Noa Sudoku ("the App") does not require account registration and does not collect common personal information such as your name, phone number, address, location data, or advertising identifiers.'
    ],
    sections: [
      {
        title: "1. Personal Information Collection",
        paragraphs: [
          "The App does not collect personal information such as your name, email address, phone number, address, location data, or advertising identifiers.",
          "Game data created while using the App, such as puzzle progress, difficulty, records, statistics, and notification settings, may be stored on your device to provide app features and is not sent to a developer-operated server.",
          "If you use the contact feature, the email content you choose to send, and diagnostic information such as app version, device model, and iOS version if you choose to send the prefilled email, may be sent to the developer by email."
        ]
      },
      {
        title: "2. Data Storage",
        paragraphs: [
          "Game data is primarily stored on your device.",
          "When iCloud is available, clear records and related statistics may be synced through iCloud (CloudKit private database) associated with your Apple account."
        ]
      },
      {
        title: "3. Third-Party Services",
        paragraphs: [
          "The App does not use advertising SDKs, third-party analytics SDKs, or social login services.",
          "However, the App may use Apple-provided services required for app features, including:"
        ],
        bullets: ["iCloud / CloudKit", "Local notifications", "App Store review prompts", "Email through the Mail app"],
        closing: [
          "The App does not sell your data or share it with third parties for advertising purposes.",
          "Data stored in iCloud / CloudKit is stored in the private database associated with your Apple account, and the developer cannot access your personal iCloud data."
        ]
      },
      {
        title: "4. Notifications",
        paragraphs: ["The App only sends local notifications if you allow notification access.", "These may include:"],
        bullets: ["Daily reminder notifications", "Return reminder notifications"],
        closing: "You can change notification permissions at any time in your iOS Settings."
      },
      {
        title: "5. Children's Privacy",
        paragraphs: ["The App does not knowingly collect personal information from children."]
      },
      {
        title: "6. Contact",
        paragraphs: ["If you have any questions about this Privacy Policy, please contact:"],
        email: "iam@xoghks.com"
      }
    ]
  }
} satisfies Record<
  Lang,
  {
    title: string;
    updated: string;
    intro: string[];
    sections: Array<{
      title: string;
      paragraphs: string[];
      bullets?: string[];
      closing?: string | string[];
      email?: string;
    }>;
  }
>;

function getInitialTheme(): Theme {
  const saved = window.localStorage.getItem("noa-theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getInitialLang(): Lang {
  const saved = window.localStorage.getItem("noa-lang");
  if (saved === "ko" || saved === "en") return saved;
  return navigator.language.toLowerCase().startsWith("ko") ? "ko" : "en";
}

function getPage(): Page {
  const explicit = document.getElementById("root")?.dataset.page;
  if (explicit === "features" || explicit === "support" || explicit === "privacy") return explicit;
  if (window.location.pathname.startsWith("/features")) return "features";
  if (window.location.pathname.startsWith("/support")) return "support";
  return window.location.pathname.startsWith("/privacy") ? "privacy" : "home";
}

function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [lang, setLang] = useState<Lang>(getInitialLang);
  const page = useMemo(getPage, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("noa-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = lang;
    window.localStorage.setItem("noa-lang", lang);
  }, [lang]);

  useEffect(() => {
    const titles: Record<Page, string> = {
      home: "Noa Sudoku",
      features: "Noa Sudoku Features",
      support: "Noa Sudoku Support",
      privacy: "Noa Sudoku Privacy Policy"
    };
    document.title = titles[page];
  }, [page]);

  return (
    <>
      <Header page={page} lang={lang} theme={theme} setLang={setLang} setTheme={setTheme} />
      <main>
        {page === "home" ? <HomePage lang={lang} theme={theme} /> : null}
        {page === "features" ? <FeaturesPage lang={lang} /> : null}
        {page === "support" ? <SupportPage lang={lang} /> : null}
        {page === "privacy" ? <PrivacyPage lang={lang} /> : null}
      </main>
      <Footer lang={lang} />
    </>
  );
}

function Header({
  page,
  lang,
  theme,
  setLang,
  setTheme
}: {
  page: Page;
  lang: Lang;
  theme: Theme;
  setLang: (lang: Lang) => void;
  setTheme: (theme: Theme) => void;
}) {
  const t = copy[lang];
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    { href: "/", label: t.home, active: page === "home" },
    { href: "/features/", label: t.features, active: page === "features" },
    { href: "/privacy/", label: t.privacy, active: page === "privacy" },
    { href: "/support/", label: t.support, active: page === "support" }
  ];

  return (
    <header className={`site-header${menuOpen ? " is-open" : ""}`}>
      <a className="site-brand" href="/" aria-label="Noa Sudoku home">
        <img src="/assets/app-icon.png" alt="" />
      </a>
      <button
        className="menu-button"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="site-menu"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span>{menuOpen ? t.close : t.menu}</span>
        <i aria-hidden="true" />
      </button>
      <div className="site-menu" id="site-menu">
        <div className="menu-brand">Noa Sudoku</div>
        <nav className="page-tabs" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a
              key={item.href}
              className={item.active ? "is-active" : undefined}
              href={item.href}
              aria-current={item.active ? "page" : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="preference-panel" aria-label={t.preferences}>
          <div className="language-switch" aria-label={t.language}>
            <button type="button" aria-pressed={lang === "ko"} onClick={() => setLang("ko")}>
              KO
            </button>
            <button type="button" aria-pressed={lang === "en"} onClick={() => setLang("en")}>
              EN
            </button>
          </div>
          <button
            className={`theme-switch${theme === "dark" ? " is-dark" : ""}`}
            type="button"
            aria-label={t.theme}
            aria-pressed={theme === "dark"}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <span>{theme === "dark" ? t.dark : t.light}</span>
            <ThemeIcon theme={theme} />
          </button>
        </div>
      </div>
    </header>
  );
}

function ThemeIcon({ theme }: { theme: Theme }) {
  if (theme === "dark") {
    return (
      <svg className="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M20.2 15.1A8.2 8.2 0 0 1 8.9 3.8 8.7 8.7 0 1 0 20.2 15.1Z"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    );
  }

  return (
    <svg className="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 2.8v2.1M12 19.1v2.1M4.9 4.9l1.5 1.5M17.6 17.6l1.5 1.5M2.8 12h2.1M19.1 12h2.1M4.9 19.1l1.5-1.5M17.6 6.4l1.5-1.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function HomePage({ lang, theme }: { lang: Lang; theme: Theme }) {
  const t = copy[lang];

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="overline">{t.subtitle}</p>
          <h1>{t.heroLead}</h1>
          <p className="hero-title">{t.heroTitle}</p>
          <p className="hero-body">{t.heroBody}</p>
        </div>
        <DeviceShowcase />
        <div className="hero-download">
          <AppStoreBadge lang={lang} theme={theme} />
          <a className="hero-qr" href={SHORT_URL} target="_blank" rel="noreferrer">
            <img src="/assets/download-qr.jpg" alt="Noa Sudoku App Store QR code" />
          </a>
        </div>
      </section>

      <section className="section simple-section">
        <div className="section-copy">
          <p className="overline">Sudoku, simplified</p>
          <h2>{t.sectionTitle}</h2>
          <p>{t.sectionBody}</p>
          <a className="section-more" href="/features/">
            {t.sectionMore}
          </a>
        </div>
        <div className="feature-list">
          {features.map((feature, index) => (
            <article key={feature.en[0]}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{feature[lang][0]}</h3>
              <p>{feature[lang][1]}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function AppStoreBadge({ lang, theme }: { lang: Lang; theme: Theme }) {
  const badge = appStoreBadge[lang];
  const src = theme === "dark" ? badge.white : badge.black;

  return (
    <a className="app-store-badge" href={APP_STORE_URL} target="_blank" rel="noreferrer">
      <img src={src} alt={badge.alt} width={badge.width} height="82" style={{ width: badge.width }} />
    </a>
  );
}

function DeviceShowcase() {
  return (
    <div className="device-area" aria-label="Noa Sudoku app preview">
      <div className="device device-main">
        <img className="device-screen" src="/assets/screen-game.png" alt="Noa Sudoku game screen" />
        <img className="device-bezel" src="/assets/iphone-15-pro-black-titanium-portrait.png" alt="" />
      </div>
      <div className="device device-secondary">
        <img className="device-screen" src="/assets/screen-home.png" alt="Noa Sudoku home screen" />
        <img className="device-bezel" src="/assets/iphone-15-pro-blue-titanium-portrait.png" alt="" />
      </div>
    </div>
  );
}

function renderPolicyText(text: string, lang: Lang): ReactNode {
  const phrases =
    lang === "ko"
      ? ["개인정보를 수집하지 않습니다", "수집하지 않습니다"]
      : ["does not collect", "does not knowingly collect"];
  const phrase = phrases.find((candidate) => text.includes(candidate));

  if (!phrase) return text;

  const [before, after] = text.split(phrase);
  return (
    <>
      {before}
      <strong className="policy-emphasis">{phrase}</strong>
      {after}
    </>
  );
}

function FeaturesPage({ lang }: { lang: Lang }) {
  const content = featurePageContent[lang];

  return (
    <article className="document-page marketing-page">
      <header className="document-hero marketing-hero">
        <p className="overline">{content.overline}</p>
        <h1>{content.title}</h1>
        <p>{content.body}</p>
      </header>
      <div className="feature-showcase">
        {content.items.map((item, index) => (
          <section className={`feature-row feature-row-${index + 1}`} key={item.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h2>{item.title}</h2>
              <p>{item.body}</p>
            </div>
            <FeatureVisual index={index} />
          </section>
        ))}
      </div>
    </article>
  );
}

const featureVisuals = [
  { kind: "no-ads", src: "/assets/feature-no-ads.svg" },
  { kind: "difficulty", src: "/assets/feature-difficulty-levels.svg" },
  { kind: "records", src: "/assets/feature-records-calendar.svg" },
  { kind: "help", src: "/assets/feature-help-hint.svg" },
  { kind: "notification", src: "/assets/feature-widget-notification.svg" },
  { kind: "icloud", src: "/assets/feature-cloud-sync.svg" }
] as const;

function FeatureVisual({ index }: { index: number }) {
  const visual = featureVisuals[index] ?? featureVisuals[0];

  return (
    <div className={`feature-visual feature-visual-${visual.kind}`} aria-hidden="true">
      <img src={visual.src} alt="" />
    </div>
  );
}

function SupportPage({ lang }: { lang: Lang }) {
  const content = supportContent[lang];

  return (
    <article className="document-page marketing-page support-page">
      <header className="document-hero marketing-hero">
        <p className="overline">{content.overline}</p>
        <h1>{content.title}</h1>
        <p>{content.body}</p>
      </header>
      <section className="support-contact">
        <div>
          <h2>{content.contactTitle}</h2>
          <p>{content.contactBody}</p>
        </div>
        <a href="mailto:iam@xoghks.com">{content.emailLabel}</a>
      </section>
      <div className="qa-list">
        {content.questions.map((item) => (
          <section className="qa-item" key={item.q}>
            <h2>{item.q}</h2>
            <p>{item.a}</p>
          </section>
        ))}
      </div>
    </article>
  );
}

function PrivacyPage({ lang }: { lang: Lang }) {
  const policy = policyContent[lang];

  return (
    <article className="document-page">
      <header className="document-hero">
        <p className="overline">Privacy Policy / 개인정보 처리방침</p>
        <h1>{policy.title}</h1>
        <p>{policy.updated}</p>
        {policy.intro.map((paragraph) => (
          <p key={paragraph}>{renderPolicyText(paragraph, lang)}</p>
        ))}
      </header>
      <div className="policy-list">
        {policy.sections.map((section) => (
          <section className="policy-item" key={section.title}>
            <h2>{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{renderPolicyText(paragraph, lang)}</p>
            ))}
            {section.bullets ? (
              <ul>
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
            {section.email ? (
              <p>
                email: <a href={`mailto:${section.email}`}>{section.email}</a>
              </p>
            ) : null}
            {Array.isArray(section.closing)
              ? section.closing.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
              : section.closing
                ? <p>{section.closing}</p>
                : null}
          </section>
        ))}
      </div>
    </article>
  );
}

function Footer({ lang }: { lang: Lang }) {
  const t = copy[lang];
  return (
    <footer className="site-footer">
      <p>{t.copyright}</p>
    </footer>
  );
}

export default App;
