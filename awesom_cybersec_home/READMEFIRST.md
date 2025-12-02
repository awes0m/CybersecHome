# Awes0m Cybersec Homepage v2.2

A local, privacy-focused browser start page for cybersecurity professionals and power users. This version runs entirely in your browser using **IndexedDB** for storage, meaning no data leaves your machine.

## 🚀 New in v2.2
* **Task Manager**: A dedicated tab to manage your daily to-do list with checkboxes and deletion support.
* **Live Clock & Greeting**: Replaced the weather widget with a large digital clock and dynamic greeting based on the time of day.
* **Fixed Wallpaper**: Background images now load correctly with a persistent overlay.
* **Database Backup**: Full JSON export/import support to save your config or move to another machine.

## ✨ Key Features

### 1. 🔍 Intelligence Search
The search bar features a toggle switch to flip between two modes:
* **Google**: Standard web search.
* **Perplexity**: AI-powered answer engine for quick research and definitions.

### 2. 🤖 Automations (Ops)
Create "Workflows" to open multiple tools at once.
* **Use Case**: Create a "Daily Intel" automation that opens VirusTotal, AlienVault OTX, and Shodan in separate tabs simultaneously.
* **How to use**: Go to the **Ops** tab, create a flow, add URLs (one per line), and click **Launch**.
* *Note: You must allow popups for this file in your browser settings.*

### 3. 🔖 Bookmark Manager
* **Import**: Supports importing standard Netscape HTML bookmark files (exported from Chrome/Firefox).
* **Organization**: Create folders and manage links hierarchically.
* **Quick Access**: Add your most used links to the "Favorites" grid on the main dashboard.

### 4. 📰 Intel Feeds
* Built-in RSS reader to track cybersecurity news.
* Pre-configured with Krebs on Security, Hacker News, and CISA.
* Add your own custom RSS URLs.

### 5. 📝 Notes & Tasks
* **Notes**: Simple text storage for scratchpad ideas.
* **Tasks**: A simple checklist for daily objectives.

### 6. 💾 Backup & Restore
Your data lives in your browser's **IndexedDB**. To prevent data loss if you clear browser cache:
1.  Click the **Settings (Cog)** icon or **Database** icon in the header.
2.  Select **Download Backup** to get a `.json` file.
3.  Use **Restore from Backup** to load that file on a new browser or computer.

---

## 🛠️ Installation & Setup

1.  **Save the File**: Ensure `index.html` is saved in a permanent location (e.g., `C:\Tools\AwesomHome\index.html` or `/Users/you/Tools/index.html`).
2.  **Set as Homepage**: Configure your browser to open this file on startup.

### Google Chrome
1.  Settings → **On startup**.
2.  Select **Open a specific page or set of pages**.
3.  Add new page: `file:///path/to/your/index.html`

### Firefox
1.  Settings → **Home**.
2.  Homepage and new windows → **Custom URLs**.
3.  Paste: `file:///path/to/your/index.html`

### Edge
1.  Settings → **Start, home, and new tabs**.
2.  Open these pages → **Add a new page**.
3.  Paste: `file:///path/to/your/index.html`

---

## ⚠️ Troubleshooting

**"Automations blocked"**
* Browsers block multiple popups by default. You will see a "Pop-up blocked" icon in the address bar. Click it and select **"Always allow popups from this file"**.

**"Wallpaper vanished"**
* If you clear your browser's "Site Data" or "Cookies", the local database (including wallpaper settings) might be cleared. **Always keep a .json backup** of your configuration.

**"Feeds not loading"**
* The app uses `rss2json.com` to convert XML feeds to JSON. Ensure you have an active internet connection and that the RSS URL is valid.