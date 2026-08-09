# Remotify — First Play Store upload (your checklist)

Everything **already in the repo** vs what **only you** can do in Google’s websites.

---

## Already done in code

- [x] AdMob App ID + banner + interstitial IDs in `app.json` and `src/constants/ads.ts`
- [x] Banner + interstitial ads in the app
- [x] Privacy policy draft: `docs/legal/privacy-policy.html`
- [x] app-ads.txt draft: `docs/legal/app-ads.txt`
- [x] Package name: `com.remotify`

---

## Step 1 — Host privacy policy + app-ads.txt (≈30 min, free)

Pick **one** option:

### Option A: GitHub Pages (free)

1. Push this repo to GitHub (if not already).
2. GitHub → repo **Settings → Pages** → Source: **Deploy from branch** → branch `main` → folder `/docs`.
3. Your URLs:
   - Privacy: `https://mudasserhassan1.github.io/Remotify/privacy-policy.html`
   - Site: `https://mudasserhassan1.github.io/Remotify/`
   - app-ads.txt: `https://mudasserhassan1.github.io/Remotify/app-ads.txt` (see AdMob root-domain note in `GITHUB_PAGES_SETUP.md`)

### Option B: Any website

Upload `privacy-policy.html` and `app-ads.txt` to your domain. app-ads.txt must be reachable at:

`https://yourdomain.com/app-ads.txt`

---

## Step 2 — Google Play Developer account (one-time)

1. Go to [play.google.com/console](https://play.google.com/console)
2. Pay **$25** registration fee (once)
3. Complete identity verification

---

## Step 3 — Create the app in Play Console

1. **Create app** → Remotify, default language, **App** (not game)
2. **App content** → Privacy policy → paste your **privacy policy URL**
3. **Store listing** → Developer website → paste the **same domain** where app-ads.txt lives
4. Complete **Data safety** form (local network, ads — no account login in v1)
5. **Target audience**, content rating questionnaire

---

## Step 4 — Release signing (required for upload)

Debug builds cannot go to Play. Generate a upload keystore **once** and keep it safe:

```bash
keytool -genkeypair -v -storetype PKCS12 -keystore remotify-upload.keystore -alias remotify -keyalg RSA -keysize 2048 -validity 10000
```

Store the keystore **outside** git. Configure `android/app/build.gradle` release `signingConfigs` (ask in Cursor when ready — do not commit passwords).

Build release AAB:

```bash
cd android && ./gradlew bundleRelease
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

---

## Step 5 — Internal testing (first upload)

1. Play Console → **Testing → Internal testing → Create release**
2. Upload the `.aab` file
3. Add yourself as tester (email list)
4. Open the **opt-in link** on your phone and install from Play (not sideload)

---

## Step 6 — AdMob link + app-ads.txt verify

1. [admob.google.com](https://admob.google.com) → Apps → Remotify
2. Link app to **Google Play** listing (package `com.remotify`)
3. AdMob → app-ads.txt → **Verify** (after Play listing has developer website + file is live)
4. Wait up to 24–48 hours for “Ready” status

---

## Step 7 — Production (when ready)

1. Test remote + ads on internal track
2. Play Console → **Production → Create release** → same AAB (or newer)
3. Submit for review

---

## What Cursor / AI cannot do for you

- Log into your Google / AdMob / Play accounts
- Pay the $25 Play fee
- Host files on a domain you own (unless you connect GitHub and enable Pages)
- Generate your upload keystore password (you must save it)

---

## Quick reference — your AdMob IDs

| Item | ID |
|------|-----|
| Publisher | `pub-9492981459898945` |
| App ID | `ca-app-pub-9492981459898945~7666453163` |
| Banner | `ca-app-pub-9492981459898945/1975142783` |
| Interstitial | `ca-app-pub-9492981459898945/8017806952` |
