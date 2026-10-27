# HERALYTICS

A vintage true-crime data investigation game by ACM-W Sathyabama. Players work through ten connected case files, test suspects' alibis against datasets, and submit findings. Organisers follow every player's progress live on the organiser desk.

It is a static site: plain HTML, CSS and JavaScript, no build step.

## What's in here

```
index.html        page shell
css/style.css     the case-file look
js/app.js         game logic, organiser desk, Firebase sync
js/cases.js       case files: briefings, suspects, evidence, datasets, questions
js/config.js      your Firebase settings (organiser desk)
firestore.rules   database security rules
.nojekyll         tells GitHub Pages to serve files as they are
```

## 1. Put it on GitHub Pages

1. Create a new repository on GitHub, for example `heralytics`.
2. Push these files to the root of the `main` branch:
   ```bash
   git init
   git add .
   git commit -m "HERALYTICS site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/heralytics.git
   git push -u origin main
   ```
3. On GitHub, open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, and save.
4. After a minute the site is live at `https://<your-username>.github.io/heralytics/`.

The game works straight away in **practice mode**: progress is saved in each player's browser, and the organiser desk shows "Not connected yet". Do step 2 to turn on the organiser desk.

## 2. Turn on the organiser desk (Firebase, free plan)

1. Go to <https://console.firebase.google.com>, click **Add project**, and create one (Google Analytics is not needed).
2. **Add a web app:** Project settings (gear icon) → **Your apps** → the `</>` icon. Give it a name and register it. Copy the `firebaseConfig` object it shows into `js/config.js`, replacing the placeholder values.
3. **Turn on sign-in:** Build → **Authentication** → Get started → **Sign-in method**. Enable **Anonymous** (players) and **Email/Password** (organisers).
4. **Allow your site's address:** Authentication → **Settings → Authorized domains** → add `<your-username>.github.io`.
5. **Create the database:** Build → **Firestore Database** → Create database → production mode → pick a region close to you (for example `asia-south1`, Mumbai).
6. **Set the rules:** Firestore → **Rules** tab → replace everything with the contents of `firestore.rules` → **Publish**.
7. **Create an organiser account:** Authentication → **Users** → **Add user** with an email and password. Copy that user's **User UID**.
8. **Mark it as an organiser:** Firestore → **Data** → **Start collection** → collection ID `admins` → document ID = the UID you copied → add any field, for example `role` = `organiser` → Save. Repeat 7 and 8 for each co-organiser.
9. Commit and push the updated `js/config.js`. GitHub Pages redeploys on its own.

Firebase web config values are meant to be public; the rules in `firestore.rules` are what protect the data. Players can only write their own record, and only accounts listed in `admins` can read everyone's.

## How it works on the day

- **Players** open the site, write their name on the case desk and start Case 01. There is no player login: each browser gets an anonymous ID behind the scenes. Their progress is sent to the organiser desk whenever they open a case, unlock a hint or submit findings. Ask players to stay on one browser and device.
- **Organisers** click **Organiser login** in the footer (or go to `#admin`) and sign in with the account from step 7. Use a different browser from any you play in. The desk shows every detective ranked by the official rules, a progress strip for each, and a button to download the results as a CSV.

Ranking order: finishers first → most cases solved → shortest elapsed time → highest score → fewest failed submissions.

## Adding cases 03–10

Open `js/cases.js`. Cases 01 and 02 show the full shape: `summary`, `details`, `timeline`, `suspects`, `evidence`, `datasets` (CSV text), and five `questions`. Cases 03–10 only have a title; until you fill them in, players who reach them see "Awaiting file".

Answers are stored lightly encoded so they are not readable at a glance. To make the code for an answer, open the browser console on the site and run:

```js
btoa("Your Answer".toLowerCase().replace(/\s+/g,"").split("").reverse().join(""))
```

Paste the result into the question's `a` field. For numeric questions, encode the plain number (for example `42`, not `42 g`).

Note that a determined player could still decode answers from the page source. For a high-stakes event, keep the answer key off the site and check submissions on a server.

## Running it locally

The scripts are ES modules, so open it through a local server rather than double-clicking the file:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000>. Add `localhost` to Firebase's authorized domains if you want the organiser desk to work locally.

## Scoring rules

Each case has five findings worth 14 points each. Unlocking a field hint costs 3 points on that finding. Players get up to 5 attempts per case; after the fifth failed attempt the case becomes a cold case worth 0 points and the next folder unseals.
