OneSignal Web Push: Quick Setup for Jobharder

Steps to enable OneSignal push notifications for your site:

1) Create an app on OneSignal
   - Go to https://onesignal.com and sign in or create an account.
   - Create a new App and choose "Web Push" as the platform.

2) Configure the Web Push platform
   - Select "Typical Site" (HTTPS) and enter your site URL: https://www.jobharder.com
   - For SDK Setup choose "Use our SDK".
   - In the Worker setup step, choose to host the worker files on your own site and note the required filenames:
     - `OneSignalSDKWorker.js`
     - `OneSignalSDKUpdaterWorker.js`
   - Upload those two files to the root of your site (they are already created in this repo).

3) Copy your App ID
   - After setup, OneSignal shows an `App ID` (a UUID). Copy it.

4) Paste the App ID into templates
    - Replace `YOUR_ONESIGNAL_APP_ID` in the following files with your App ID (already set to `f48ce069-28b2-4d26-aedb-32a44dd66507` in this repo):
     - `index.html`
     - `theme.xml` (Blogger template head)
   - Save and deploy the updated files to your live site.

5) Test locally (optional)
   - OneSignal can work on `localhost` during development if `allowLocalhostAsSecureOrigin` is enabled (already in the template). When testing locally, open `index.html` in a local server (e.g., `http-server` or `python -m http.server`).

6) Confirm Worker files are reachable
   - Visit `https://www.jobharder.com/OneSignalSDKWorker.js` and `https://www.jobharder.com/OneSignalSDKUpdaterWorker.js` to verify they are served from the root.

7) Prompt & subscription
   - The OneSignal SDK will display its notify button automatically (configured in the template). Users can opt in and OneSignal will manage subscriptions.

8) Sending notifications
   - Use OneSignal dashboard to send manual notifications, or call OneSignal REST API from your server when you publish new posts.
   - Example curl (replace APP_ID and REST_API_KEY):

```bash
curl --include \
  --request POST \
  --header "Content-Type: application/json; charset=utf-8" \
  --header "Authorization: Basic YOUR_REST_API_KEY" \
  --data '{
    "app_id": "YOUR_APP_ID",
    "included_segments": ["Subscribed Users"],
    "headings": {"en": "New post on JobhardER"},
    "contents": {"en": "Read our latest job alert: <TITLE>"},
    "url": "https://www.jobharder.com/<POST_PATH>"
  }' \
  https://onesignal.com/api/v1/notifications
```

9) Automating from Blogger
   - Blogger does not have native server hooks. Two options:
     - Use a small server or serverless function that polls your feed (`/atom.xml`) for new entries and calls OneSignal REST API when new posts appear.
     - Use a third-party integration service (Zapier, Make) to watch your RSS feed and call OneSignal.

10) Security & notes
   - Keep your OneSignal REST API key secret (do not store in frontend).
   - If you prefer not to host worker files, OneSignal can host them for you, but hosting on your root gives you full control.

Need me to:
- Replace `YOUR_ONESIGNAL_APP_ID` now if you paste the App ID, or
- Create a tiny Node server (or serverless function) that polls `atom.xml` and triggers OneSignal when a new post is detected.

