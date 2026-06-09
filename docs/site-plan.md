# Noa Sudoku Website Plan

Status: Planning only
Target repo: `noa-sudoku/noa-sudoku.github.io`
Target URL: `https://noa-sudoku.github.io/`

## Goals

- Build an official static website for Noa Sudoku.
- Provide Korean and English content across the public site.
- Include App Store-ready policy pages, especially a stable privacy policy URL.
- Work well on desktop, tablet, and mobile.
- Support light and dark mode.
- Match the app's calm, white-background, blue-accent, Sudoku-board visual language.
- Add tasteful motion so the site feels polished without becoming busy.

## Non-Goals

- Do not build a complex web app or account system.
- Do not add analytics or tracking in the first version.
- Do not use a CMS for the first version.
- Do not add a GitHub open-source license for site content and brand assets.

## Recommended Stack

- Vite + React + TypeScript
- CSS Modules or plain CSS with design tokens
- Static export served by GitHub Pages
- No backend
- No client-side route dependency for legal pages

Because this repository is the organization site repository named `noa-sudoku.github.io`, the deployed site should be served from the root domain. Configure Vite with:

```ts
base: "/"
```

## Page Structure

### `/`

Purpose: Official landing page and App Store conversion page.

Sections:

- Hero
  - App name
  - Korean and English one-line value proposition
  - App Store button
  - Animated Sudoku board visual
- Product highlights
  - Ad-free play
  - Multiple difficulty levels
  - Notes, hints, and undo
  - Auto-save for current game
  - Clear records
  - Home screen widgets
- Screenshots
  - iPhone screenshots
  - Optional iPad screenshot
- Calm play section
  - Short copy about focus, no ads, no clutter
- FAQ
  - Does it have ads?
  - Is an account required?
  - Where is game data stored?
  - Does it sync with iCloud?
- Footer
  - Privacy
  - Support
  - App Store
  - Copyright

### `/privacy/`

Purpose: App Store privacy policy URL.

Content requirements:

- Korean and English versions on the same page.
- Last updated date.
- Data collection summary.
- No third-party ads.
- No third-party tracking.
- No account creation.
- Local game progress storage.
- iCloud/CloudKit use for clear records, if enabled by the user and device settings.
- Notification permission use for reminders.
- Contact/support email placeholder.
- Copyright footer.

### `/support/`

Purpose: Public support URL for App Store and users.

Content requirements:

- Korean and English versions on the same page.
- Contact email placeholder.
- Bug report checklist:
  - App version
  - iOS/iPadOS version
  - Device model
  - Steps to reproduce
  - Screenshot if helpful
- FAQ:
  - Restore or continue game
  - Widget refresh
  - Notifications
  - iCloud sync scope

### Optional Later Pages

- `/release-notes/`
- `/press/`
- `/legal/`

Do not build these in the first pass unless needed.

## Bilingual Strategy

First version:

- Keep Korean and English on the same page for `/privacy/` and `/support/`.
- On the home page, show Korean and English together in short blocks.
- Add a simple language toggle only if the page starts feeling too dense.

Later version:

- Add dedicated localized routes:
  - `/ko/`
  - `/en/`
  - `/ko/privacy/`
  - `/en/privacy/`

For the first release, same-page bilingual content is simpler and safer for App Store review because one URL contains both languages.

## Visual Direction

Keywords:

- Calm
- Focused
- Minimal but not empty
- App-like
- Light, precise, and friendly

Core look:

- White or near-white light background.
- Blue accent based on the app icon.
- Subtle gray borders.
- Rounded continuous corners.
- Soft shadows only where they support hierarchy.
- Sudoku board motifs as layout or motion elements.
- Avoid decorative gradient blobs or generic abstract backgrounds.

Suggested colors:

- Light background: `#F7F9FC`
- Surface: `#FFFFFF`
- Text: `#172033`
- Muted text: `#5B667A`
- Border: `#D8E0EA`
- Accent blue: `#2F7DF6`
- Soft blue: `#EAF3FF`

Dark mode:

- Background: `#10141C`
- Surface: `#171D27`
- Text: `#F5F7FB`
- Muted text: `#A8B1C3`
- Border: `#2A3342`
- Accent blue: `#6EA8FF`
- Soft blue surface: `#14233A`

## Motion Direction

Motion should be quiet and purposeful.

Recommended hero motion:

- A Sudoku board where a few cells gently highlight in sequence.
- Candidate notes fade in and out in small cells.
- A completed row/box softly pulses once.
- The board should loop slowly and never distract from text.

Secondary motion:

- Feature cards reveal on scroll with subtle opacity/translate.
- App Store button has a small hover lift.
- Screenshots can slide slightly into place on first view.

Accessibility:

- Respect `prefers-reduced-motion`.
- Provide a static board state when reduced motion is enabled.
- Do not use flashing or rapid animation.

## Responsive Layout

Breakpoints:

- Mobile: `0-639px`
- Tablet: `640-1023px`
- Desktop: `1024px+`
- Wide desktop: `1280px+`

Mobile:

- Single-column layout.
- Hero text first, board visual second.
- App Store button visible without scrolling too far.
- Screenshots stacked or horizontally scrollable only if needed.

Tablet:

- Two-column hero is allowed if content remains readable.
- Feature grid: 2 columns.
- Screenshots: 2 columns.

Desktop:

- Hero: text left, board/screenshot composition right.
- Feature grid: 3 columns.
- Keep max content width around `1120-1200px`.

Do not use viewport-scaled font sizes. Use fixed responsive type steps.

## Content Draft

### Home Hero

English:

> Noa Sudoku
> Ad-free Sudoku for calm, focused play.

Korean:

> Noa Sudoku
> 광고 없이 차분하게 즐기는 스도쿠 앱.

Supporting copy:

English:

> Play at your pace with notes, hints, undo, progress records, and home screen widgets.

Korean:

> 메모, 힌트, 되돌리기, 기록, 홈 화면 위젯으로 흐름을 잃지 않고 플레이하세요.

### Feature Labels

- Ad-free
  - 광고 없는 플레이
- Notes and hints
  - 메모와 힌트
- Auto-save
  - 진행 중 게임 자동 저장
- Records
  - 클리어 기록
- Widgets
  - 홈 화면 위젯

## Legal and Copyright Copy

Footer:

```txt
© 2026 TaeHwan Kim. All rights reserved.
```

README or notice copy:

```md
© 2026 TaeHwan Kim. All rights reserved.

No part of this website, including text, images, screenshots, icons, branding, design assets, and policy documents, may be copied, modified, distributed, or reused without prior written permission.
```

Korean notice:

```md
© 2026 TaeHwan Kim. All rights reserved.

이 웹사이트의 텍스트, 이미지, 스크린샷, 아이콘, 브랜드 요소, 디자인 에셋, 정책 문서는 사전 서면 허가 없이 복사, 수정, 배포 또는 재사용할 수 없습니다.
```

## Assets Needed

- App icon
- App Store badge
- iPhone screenshots
- Optional iPad screenshot
- Optional simple board animation data

Asset source candidates:

- Main app icon from the Noa Sudoku iOS repo.
- Existing App Store screenshot exports from the Noa Sudoku iOS repo.

## Accessibility and SEO

- Use semantic headings.
- Keep color contrast AA or better.
- Add `lang` attributes where appropriate.
- Add title and meta description.
- Add Open Graph image later.
- Add reduced motion support.
- Ensure keyboard navigation works.

## Implementation Phases

### Phase 1: Scaffold

- Create Vite + React + TypeScript project.
- Add CSS tokens for light/dark mode.
- Configure GitHub Pages deployment.
- Add route/page structure:
  - Home
  - Privacy
  - Support

### Phase 2: Design System

- Define typography, colors, spacing, buttons, cards, and board motif.
- Build reusable layout components.
- Build responsive page shell.

### Phase 3: Content Pages

- Implement bilingual home copy.
- Implement privacy policy page.
- Implement support page.
- Add footer and copyright notice.

### Phase 4: Motion and Polish

- Add hero Sudoku board animation.
- Add subtle feature reveal animation.
- Add dark mode QA.
- Add reduced motion fallback.

### Phase 5: Verification

- Test desktop, tablet, and mobile viewports.
- Test light and dark mode.
- Verify `/privacy/` URL works directly.
- Verify `/support/` URL works directly.
- Run production build.
- Deploy via GitHub Pages.

## Open Decisions

- React or Vue final choice. Current recommendation: React.
- Use one bilingual page or dedicated `/ko` and `/en` routes in the first version.
- Exact support email.
- Whether to use a custom domain later.
- Which screenshots to include.
- Whether the hero board animation should be CSS-only or React state-driven.
