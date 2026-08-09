# GitHub Pages setup for Remotify

Use this to host your **privacy policy** (required for Google Play) and optionally your site.

## 1. Push the repo to GitHub

```bash
git add docs/
git commit -m "Add GitHub Pages site and privacy policy"
git push origin main
```

Create the repo on GitHub first if you have not already (`github.com/new` → name it `Remotify` or your choice).

## 2. Enable GitHub Pages

1. Open your repo on GitHub → **Settings** → **Pages**
2. Under **Build and deployment** → **Source**, choose **Deploy from a branch**
3. Branch: **main**, folder: **/docs**
4. Click **Save**

After 1–2 minutes your site will be live at:

```
https://mudasserhassan1.github.io/Remotify/
```

(Replace `Remotify` with your repo name if different.)

## 3. Privacy policy URL for Google Play

In Play Console → **App content** → **Privacy policy**, use:

```
https://mudasserhassan1.github.io/Remotify/privacy-policy.html
```

**Yes — GitHub Pages is accepted by Google Play.** The URL must be:

- Public (no login required)
- A normal `https://` link
- The actual policy page, not a redirect to a PDF behind a paywall

## 4. Before you submit

1. Contact email is set to `mudasser021@gmail.com` in `docs/privacy-policy.html`.
2. Open the privacy URL in an incognito browser tab and confirm it loads.

## 5. app-ads.txt (AdMob) — important note

AdMob expects `app-ads.txt` at the **root** of your verified domain, e.g.:

```
https://yourdomain.com/app-ads.txt
```

A **project** GitHub Pages site serves at `username.github.io/RepoName/`, so
`docs/app-ads.txt` becomes `username.github.io/Remotify/app-ads.txt` — that
**does not** satisfy AdMob’s root-domain rule.

Options:

- Buy a cheap domain and point it to GitHub Pages, then put `app-ads.txt` at the site root, **or**
- Create a user site repo named `mudasserhassan1.github.io` and host `app-ads.txt` there, **or**
- Verify app-ads in AdMob using your **Play Store listing URL** (Google supports this for many apps).

Your publisher line (already in `docs/app-ads.txt`):

```
google.com, pub-9492981459898945, DIRECT, f08c47fec0942fa0
```
