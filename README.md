# 📸 CalorieCam — Setup Guide for Beginners

A personal iPhone app that uses AI to instantly estimate calories and macros from food photos. 100% free.

---

## What You'll Need (all free)

- A Windows or Linux PC
- VS Code — code editor
- Node.js — runs the project
- Git — uploads your code
- A Google account — for the free AI API
- A GitHub account — stores your code
- A Vercel account — hosts your app online

---

## STEP 1 — Install the Tools

### 1a. Install VS Code
1. Go to https://code.visualstudio.com
2. Click the big blue Download button
3. Run the installer, click Next → Next → Install
4. Open VS Code when done

### 1b. Install Node.js
1. Go to https://nodejs.org
2. Click the **LTS** version (left button)
3. Run the installer, click Next → Next → Install
4. **Restart your PC after installing**

### 1c. Install Git
1. Go to https://git-scm.com/downloads
2. Click "Download for Windows" (or your OS)
3. Run the installer — keep all default settings, just click Next
4. When asked about default editor, choose VS Code

---

## STEP 2 — Get Your Free Gemini API Key

1. Go to https://aistudio.google.com
2. Sign in with your Google account
3. Click **"Get API Key"** in the left sidebar
4. Click **"Create API key"**
5. Select **"Create API key in new project"**
6. Copy the key (looks like: `AIzaSy...`) and save it in Notepad — you'll need it soon

---

## STEP 3 — Create GitHub and Vercel Accounts

### GitHub:
1. Go to https://github.com
2. Click "Sign up" — use any email
3. Verify your email

### Vercel:
1. Go to https://vercel.com
2. Click "Sign Up"
3. Choose **"Continue with GitHub"** — this links them automatically

---

## STEP 4 — Set Up the Project

### 4a. Open a Terminal in VS Code
1. Open VS Code
2. Click **Terminal** in the top menu → **New Terminal**
3. A black panel will appear at the bottom

### 4b. Create the project folder
Copy and paste this command into the terminal, then press Enter:
```
mkdir calorie-cam
```

### 4c. Go into the folder
```
cd calorie-cam
```

### 4d. Copy all the project files
Copy all the files from this zip into the `calorie-cam` folder you just created.
(Drag and drop them in Windows Explorer into the folder, or use VS Code File Explorer)

### 4e. Install the project dependencies
In the terminal (make sure you're in the calorie-cam folder), run:
```
npm install
```
This will download everything needed. Wait for it to finish (1-2 minutes).

---

## STEP 5 — Add Your API Key

### 5a. Create the environment file
In VS Code, in the calorie-cam folder, create a new file called exactly:
```
.env.local
```

### 5b. Add your key to the file
Open `.env.local` and type:
```
GEMINI_API_KEY=paste_your_key_here
```
Replace `paste_your_key_here` with the key you copied in Step 2.

Example:
```
GEMINI_API_KEY=AIzaSyAbc123XYZ...
```

Save the file (Ctrl+S).

---

## STEP 6 — Test It Locally

In the terminal, run:
```
npm run dev
```

Open your browser and go to: http://localhost:3000

You should see the CalorieCam app! Try uploading a food photo to test it.

To stop the server: press **Ctrl+C** in the terminal.

---

## STEP 7 — Put It Online (so your iPhone can use it)

### 7a. Create a GitHub repository
1. Go to https://github.com
2. Click the **+** button (top right) → **New repository**
3. Name it: `calorie-cam`
4. Leave it **Public**
5. Click **Create repository**
6. You'll see a page with setup commands — copy the URL that looks like:
   `https://github.com/YOUR_USERNAME/calorie-cam.git`

### 7b. Upload your code to GitHub
In VS Code terminal (in your calorie-cam folder), run these commands one by one:

```
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/calorie-cam.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

When asked for username/password, use your GitHub email and a **Personal Access Token**:
- Go to GitHub → Settings → Developer Settings → Personal Access Tokens → Tokens (classic)
- Click "Generate new token (classic)"
- Check the `repo` checkbox
- Click Generate → copy the token and use it as your password

### 7c. Deploy on Vercel
1. Go to https://vercel.com and sign in
2. Click **"Add New Project"**
3. Find your `calorie-cam` repository and click **Import**
4. Click **"Environment Variables"**
5. Add:
   - Name: `GEMINI_API_KEY`
   - Value: your Gemini API key
6. Click **Deploy**
7. Wait ~1 minute — Vercel will give you a URL like `calorie-cam-abc123.vercel.app`

---

## STEP 8 — Add to Your iPhone Home Screen

1. Open **Safari** on your iPhone (must be Safari, not Chrome)
2. Go to your Vercel URL (e.g., `calorie-cam-abc123.vercel.app`)
3. Tap the **Share button** (the box with an arrow pointing up)
4. Scroll down and tap **"Add to Home Screen"**
5. Tap **"Add"**

✅ **Done!** You now have a CalorieCam icon on your iPhone home screen.

---

## How to Use the App

1. Tap the CalorieCam icon on your home screen
2. Tap **"Tap to photograph your dish"**
3. Either take a new photo or pick one from your library
4. Tap **"Analyze Dish"**
5. Wait 3-5 seconds for the AI to analyze
6. See the dish name, portion, calories, and all macros!

---

## Free Tier Limits (Gemini)

| Limit | Amount |
|-------|--------|
| Requests per minute | 15 |
| Requests per day | 1,500 |
| Cost | $0 |

For personal use, you'll never hit these limits.

---

## Troubleshooting

**"API key not configured" error:**
→ Check that your `.env.local` file has the right key and no extra spaces

**Camera doesn't work on iPhone:**
→ Make sure you're using Safari (not Chrome). Go to iPhone Settings → Safari → Camera → Allow

**App doesn't load:**
→ Check the Vercel dashboard for error logs

**Analysis fails:**
→ Try a different, clearer photo with good lighting

---

## Tips for Best Results

- 🌟 Good lighting = better estimates
- 📐 Include something for scale (fork, hand) when possible
- 🍽 Photograph the full plate, not just part of it
- 📸 Take the photo from directly above (bird's eye view) for best accuracy
