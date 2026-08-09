# Remotify — AdMob & In-App Purchase Requirements

Checklist of everything **you** must set up outside the codebase before ads and subscriptions work in production. Use this while building v1.0 (TV-only MVP).

**App:** Remotify (`com.remotify`)  
**Monetization model:** Free tier with AdMob banners + Pro subscription ($4.99/month, 7-day free trial)  
**Platform:** Android (Google Play)

---

## Quick overview

| Area | What it unlocks | Typical setup time |
|------|-----------------|-------------------|
| Google Play Developer + Merchant | Sell subscriptions | 1–3 days (identity + bank verification) |
| Play Console subscription product | 7-day trial → $4.99/mo | ~30 min after merchant is active |
| Privacy policy + Terms | Required for IAP and ads | 1–2 hours (template + hosting) |
| AdMob account + app-ads.txt | Show ads to free users | 1–2 days (after app is on Play) |
| Internal testing release | Test IAP on real device | Same day as first signed build |

---

## Part 1 — Google Play In-App Purchases (IAP)

### 1.1 Accounts and one-time fees

- [ ] **Google Play Developer account** — register at [play.google.com/console](https://play.google.com/console)  
  - One-time fee: **$25 USD**
  - Use an account you control long-term (personal or company)
- [ ] **Developer identity verification** — complete when prompted in Play Console
- [ ] **Payments profile (Merchant account)** — *required before any subscription can be sold*
  - Play Console → **Settings** → **Payments profile**
  - Add **bank account** for payouts
  - Complete **tax information** (W-8BEN for individuals outside US, W-9 for US, or local equivalent)
  - Status must show **Active** before IAP products work in production

### 1.2 App identity (decide before first upload)

- [ ] **Application ID (package name):** currently `com.remotify` — **cannot be changed after first publish**
- [ ] **App name on store:** e.g. "Remotify" or "Remotify — TV Remote"
- [ ] **App icon** (512×512 PNG for store listing)
- [ ] **Feature graphic** and **screenshots** (phone, optional tablet)

### 1.3 Legal pages (public URLs)

Both IAP and AdMob require a hosted privacy policy. Your Premium paywall mockup also references Terms.

- [ ] **Privacy Policy URL** — must be publicly accessible, e.g. `https://yourdomain.com/privacy`
  - Must cover: data collected, local network use (TV discovery), subscription billing, ad identifiers (AdMob), how to cancel, contact email
- [ ] **Terms of Service URL** — e.g. `https://yourdomain.com/terms`
  - Subscription terms, refund policy (Play handles payment refunds; state that clearly), acceptable use
- [ ] Add both URLs to **Play Console → App content → Privacy policy** and on the in-app paywall screen

**Hosting options:** GitHub Pages, Notion public page, your own domain, or a simple static site.

### 1.4 Create the subscription product in Play Console

Path: **Monetize → Products → Subscriptions → Create subscription**

Suggested product setup for Remotify Pro:

| Field | Suggested value |
|-------|-----------------|
| Product ID | `pro_monthly` (use in app code — case-sensitive) |
| Name | Remotify Pro |
| Description | Ad-free experience, advanced macros, multi-device sync |
| Base plan ID | `monthly` |
| Billing period | 1 month |
| Price | $4.99 USD (add other regions or let Play auto-convert) |
| Auto-renewing | Yes |

**Free trial offer:**

1. On the subscription → **Base plans** → your monthly plan → **Add offer**
2. Offer type: **Free trial**
3. Duration: **7 days**
4. Eligibility: **New customer acquisition** (users who never subscribed to this app)
5. **Activate** the subscription, base plan, and offer

> The 7-day trial is configured in Play Console, not hardcoded in the app. You can change duration or pricing later without an app update (only product IDs must match).

### 1.5 Publish a test build (required for IAP to load)

IAP **will not work** on a sideloaded APK alone. You need at least an **Internal testing** release linked to Play.

- [ ] Generate a **signed release** (or upload key) AAB/APK
- [ ] Play Console → **Testing → Internal testing → Create release** → upload AAB
- [ ] Add testers (email list or Google Group)
- [ ] Testers install via the **opt-in link** from Play Console (not by emailing the APK)

### 1.6 License testers (for sandbox purchases)

- [ ] Play Console → **Settings → License testing**
- [ ] Add Gmail addresses of devices you will test on
- [ ] Purchases from license testers are **free** but behave like real subscriptions (trial, renewal, cancel)

### 1.7 Testing checklist (physical Android phone)

- [ ] Install from Internal testing track
- [ ] Open paywall — product loads with correct price and trial text
- [ ] Start 7-day trial — Pro features unlock, ads hidden
- [ ] **Restore purchases** works after reinstall
- [ ] Cancel subscription via Play → Settings link in app — Pro expires at period end
- [ ] User who already used trial sees base price (no second free trial)

### 1.8 App-side requirements (implemented in Remotify)

These are what the development team builds; listed here so you know what the store expects:

- Paywall with **clear disclosure before purchase button:**
  - "7-day free trial, then $4.99/month"
  - Auto-renewal statement
  - How to cancel (link to Google Play subscriptions)
  - Links to Privacy Policy and Terms of Service
- **Restore purchases** button on paywall or Settings
- **Manage subscription** link → `https://play.google.com/store/account/subscriptions`
- Do **not** block core TV remote behind paywall — free users get remote + ads; Pro removes ads and unlocks macros/sync

### 1.9 Optional but recommended

- [ ] **Server-side receipt validation** (Firebase, RevenueCat, or custom backend) — harder to bypass Pro status
- [ ] **Real-Time Developer Notifications (RTDN)** — webhook when subscription renews, cancels, or expires

### 1.10 Libraries (for developers)

- [`react-native-iap`](https://github.com/dooboolab-community/react-native-iap) — direct Play Billing integration
- [RevenueCat](https://www.revenuecat.com/) — optional wrapper; simplifies trials, restore, and analytics

---

## Part 2 — Google AdMob (Ads)

### 2.1 AdMob account

- [ ] Sign up at [admob.google.com](https://admob.google.com) (can use same Google account as Play Console)
- [ ] Complete **account verification** (can take up to 24 hours, sometimes longer)
- [ ] Add **payment details** in AdMob for ad revenue payouts (separate from Play merchant profile)

### 2.2 Developer website + app-ads.txt (mandatory since Jan 2025)

AdMob requires proof you own the app via an **app-ads.txt** file on your developer website.

- [ ] Own or register a **domain**, e.g. `yourstudio.com`
- [ ] Create file at **`https://yourstudio.com/app-ads.txt`**
- [ ] Content (AdMob gives you the exact line after you create the app):

  ```text
  google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
  ```

  Replace `pub-XXXXXXXXXXXXXXXX` with your AdMob publisher ID (AdMob → Account → Publisher ID).

- [ ] In **Google Play Console** → store listing → add website as **Developer website** / contact URL
- [ ] In **AdMob** → Apps → link app to Play Store listing
- [ ] Wait for AdMob to crawl and verify (up to 24 hours) → click **Verify app** in AdMob if prompted

Without a valid app-ads.txt, new apps face **limited or no ad serving**.

### 2.3 Privacy policy (ads section)

Extend your privacy policy to include:

- [ ] Third-party ad partner: **Google AdMob**
- [ ] Use of **Advertising ID** (GAID) on Android
- [ ] Purpose: personalized vs non-personalized ads
- [ ] Link to [Google's ad policy](https://policies.google.com/technologies/ads) and opt-out info
- [ ] If you have **EU/EEA users:** implement **Google User Messaging Platform (UMP)** consent form before showing personalized ads

### 2.4 App must be published (at least testing track)

- [ ] App live on **Internal, Closed, Open testing, or Production** track on Google Play
- [ ] In AdMob: add app as **Published** (linked to Play package `com.remotify`)
- [ ] Submit for **App readiness review** — typically 2–7 days after publish + app-ads.txt verified

### 2.5 Ad units (create in AdMob)

Start simple for v1.0:

| Ad unit | Suggested placement | Format |
|---------|---------------------|--------|
| `banner_home` | Above bottom nav on Remote / Devices screens | Banner (320×50 or adaptive) |
| *(optional later)* `interstitial_*` | Between screen transitions | Interstitial — use sparingly |

- [ ] Create ad units in AdMob → copy **Ad unit IDs** into app config
- [ ] During development, use **Google's test ad unit IDs** only — never click your own live ads

**Test banner ID (Android):** `ca-app-pub-3940256099942544/6300978111`

### 2.6 Product rules for Remotify

- [ ] Show ads only to **non-Pro** users
- [ ] **No ads** on Premium paywall screen
- [ ] Do not place ads over D-pad / primary remote controls (bad UX + policy risk)
- [ ] Recommended: single **banner above bottom navigation bar**

### 2.7 Library (for developers)

- [`react-native-google-mobile-ads`](https://github.com/invertase/react-native-google-mobile-ads) — official community wrapper for AdMob

---

## Part 3 — Combined launch checklist

Use this order when preparing for a monetized v1.0 release:

```
Week 1 — Accounts & legal
  ├── Play Developer account ($25)
  ├── Merchant / payments profile
  ├── Privacy policy + Terms hosted
  └── Domain + app-ads.txt ready

Week 2 — Products & first build
  ├── Create pro_monthly subscription + 7-day trial offer
  ├── Internal testing release uploaded
  ├── License testers added
  └── IAP tested on physical device

Week 3 — Ads
  ├── AdMob account + link com.remotify
  ├── app-ads.txt verified
  ├── Banner ad unit created
  └── Ads tested (test IDs) → switch to production IDs after approval

Before production launch
  ├── Store listing: screenshots, description (TV remote focus for v1.0)
  ├── Subscription disclosure on paywall matches Play product
  ├── Restore purchases + cancel link in Settings
  ├── Pro users see no ads
  └── Privacy policy mentions both billing and AdMob
```

---

## Part 4 — Store policy reminders

1. **Subscriptions:** Must use **Google Play Billing** for Pro/digital features. No external payment links for the same unlock.
2. **Transparency:** Trial length, price after trial, and auto-renewal must be visible **before** the purchase button.
3. **Cancellation:** Provide an in-app path to manage/cancel (Play subscription center link satisfies this).
4. **Ads:** No accidental clicks — don't place banners on interactive remote buttons.
5. **v1.0 scope:** Market as **Android TV remote**. AC (IR) comes in v1.1 — don't claim AC support in store text until shipped.

---

## Part 5 — What you need to hand to development

Fill this in when accounts are ready:

| Item | Your value |
|------|------------|
| Play package name | `com.remotify` |
| Subscription product ID | `pro_monthly` |
| Base plan ID | `monthly` |
| AdMob App ID | `ca-app-pub-____________~____________` |
| Banner ad unit ID | `ca-app-pub-____________/____________` |
| Privacy policy URL | |
| Terms of Service URL | |
| Developer website (app-ads.txt) | |
| Support email | |

---

## Useful links

- [Google Play subscriptions overview](https://support.google.com/googleplay/android-developer/answer/12154973)
- [Google Play subscription policies](https://support.google.com/googleplay/android-developer/answer/9900533)
- [AdMob getting started](https://support.google.com/admob/answer/15948559)
- [AdMob app-ads.txt setup](https://support.google.com/admob/answer/9363762)
- [react-native-iap](https://github.com/dooboolab-community/react-native-iap)
- [react-native-google-mobile-ads](https://github.com/invertase/react-native-google-mobile-ads)

---

*Last updated: June 2026 — Remotify v1.0 (TV-only MVP)*
