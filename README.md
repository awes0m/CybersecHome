# awesom_browser_tools

A collection of browser-based tools.

# Modular Browser Homepage — Awes0m Cybersec Home

- Live: https://awes0m.github.io/awesom_browser_tools/#home
- Download: https://github.com/awes0m/awesom_browser_tools/raw/refs/heads/main/awesom_cybersec_home.zip

This is a fully featured, responsive browser homepage with favorites, notes, tasks, bookmark import, and cybersecurity news feeds. It is self-contained in a single HTML file and stores your data locally in the browser.

---

## Features

### 🌟 Core
- **Responsive Design**: Desktop, tablet, mobile
- **Dark/Light Theme**: Toggle with persistence
- **Self-contained**: Single HTML file, optional samples
- **Local Storage**: All data persists in your browser
- **Accessible UI**: Keyboard and screen-reader friendly structure

### 🧭 Navigation & Layout
- **Fixed glassmorphism header** with logo and page navigation
- **Client-side page switching**: Home, Bookmarks, Notes, Tasks, Feeds (single-page experience)
- **Collapsible sections** with subtle hover/transition effects
- **Scrollable content areas** for Favorites, Notes, and Tasks to keep the layout compact
- **Optional wallpaper overlay** layer behind the gradient background for personalization

### 📌 Favorites
- Add, edit, and delete favorite links
- Font Awesome icon support (e.g., `fab fa-github`)
- Clickable tiles with hover animations and quick delete
- Grid layout with responsive columns

### 📝 Notes
- Create, update, delete text notes
- Per-note title and content
- Smooth card UI with hover motion

### ✅ Tasks (Todos)
- Create, update, delete tasks
- Set due dates; overdue tasks highlighted
- Mark complete/incomplete; clear completed

### 📚 Bookmark Import
- Drag-and-drop or click-to-upload a standard `bookmarks.html` exported from Chrome/Firefox/Edge/Safari
- Automatic parsing and folder grouping
- Favicon display when available

### 📰 News Feeds (with custom sources)
- Predefined cybersecurity sources (e.g., Krebs, The Hacker News, HN, Threatpost)
- Lazy loading on scroll and manual refresh
- Mock data used in-browser to avoid CORS; can be swapped with a backend later
- Add custom feed sources in the configuration array

---

## What’s New / Recent Improvements
- **Scrollable modules**: Favorites, Notes, and Todos sections are scrollable with custom scrollbar styling.
- **Theme polish**: Refined dark theme variables and shadows.
- **Glass UI updates**: Consistent borders, hover elevation, and blur.
- **Header controls**: Consolidated theme toggle and navigation.
- **Performance**: Efficient DOM updates and minimal dependencies.

---

## Data Flow and Architecture

The homepage is a simple, modular, client-side app built with vanilla HTML/CSS/JS. It uses Local Storage for persistence.

### High-Level Flow
1. **Boot**
   - Read persisted settings and data from `localStorage` (theme, favorites, notes, todos, bookmarks).
   - Render initial page and attach event listeners.
2. **User Interaction**
   - UI events (click, submit, drag/drop, toggle) call handlers.
   - Handlers update in-memory state and write changes to `localStorage`.
3. **Render**
   - After each change, the relevant section re-renders from state.
4. **Persist**
   - Data is saved under defined keys; on reload, the UI restores from saved state.

### Module Responsibilities
- **Favorites**: Manage an array of link objects; render grid; delete via inline button; persist to `favorites` key.
- **Notes**: Manage note objects with `title` and `content`; render cards; persist to `notes` key.
- **Todos**: Manage task objects with `dueDate` and `completed`; compute overdue; persist to `todos` key.
- **Bookmarks**: Parse imported HTML, normalize items, group by folders, render list/grid; persist to `bookmarks` key.
- **Feeds**: Provide mock articles for each source to demonstrate layout; lazy-load on scroll; no persistence required.
- **Theme**: Toggle attribute on `<body>` (e.g., `data-theme="dark"`); persist to `theme` key.

### Event → State → Storage → UI
- Example (Add Favorite):
  1) User submits form → 2) Create favorite object → 3) Push to favorites array → 4) `localStorage.setItem('favorites', JSON)` → 5) Re-render favorites grid.
- Example (Toggle Theme):
  1) Click theme button → 2) Flip `data-theme` → 3) `localStorage.setItem('theme', 'dark'|'light')` → 4) CSS variables update theme instantly.
- Example (Import Bookmarks):
  1) Drop file → 2) Read/parse bookmark HTML → 3) Map to normalized entries → 4) Save to `bookmarks` → 5) Render grouped view with favicons.

---

## Local Storage Schema

Keys and example structures used by the app:

```json
// favorites
[
  {
    "id": 1694000000,
    "label": "GitHub",
    "url": "https://github.com",
    "icon": "fab fa-github"
  }
]
```

```json
// notes
[
  {
    "id": 1694000001,
    "title": "Meeting Notes",
    "content": "Discussion points...",
    "createdAt": "2024-09-14"
  }
]
```

```json
// todos
[
  {
    "id": 1694000002,
    "text": "Complete security review",
    "dueDate": "2024-09-20",
    "completed": false,
    "createdAt": "2024-09-14"
  }
]
```

```json
// bookmarks
[
  {
    "id": 1694000003,
    "title": "OWASP",
    "url": "https://owasp.org",
    "folder": "Security Resources",
    "favicon": "https://owasp.org/favicon.ico"
  }
]
```

```text
// theme
"light" | "dark"
```

---

## Setup

### Quick Start
1. Download and extract: https://github.com/awes0m/awesom_browser_tools/raw/refs/heads/main/awesom_cybersec_home.zip
2. Open `index.html` directly in your browser, or host via a simple local server.

### Set as Browser Homepage (Local File)
Set your homepage to the local file path, for example:

```text
file:///C:/Users/You/Downloads/awesom_browser_tools/index.html
```

Step-by-step guides are provided for Chrome, Firefox, Edge, Safari, Opera, and Brave in this README (search for your browser).

### Run a Local Server (Recommended)
To avoid any file URL restrictions and for best performance:

```bash
# Python
python -m http.server 8000
# Node.js
npx http-server
# PHP
php -S localhost:8000
```

Then open http://localhost:8000

---

## Usage

### Favorites
1. Click "Add Favorite".
2. Provide Label, URL, and Font Awesome icon class.
3. Submit to save; tile appears in the grid. Hover to reveal quick delete.

### Notes
1. Click "Add Note".
2. Enter title and content. Notes are listed with latest first.

### Tasks
1. Click "Add Task".
2. Enter description and optional due date.
3. Overdue tasks are styled distinctly; mark complete when done.

### Bookmark Import
1. Export from your browser as HTML.
2. Drag-and-drop the file onto the import area, or click to select.
3. Bookmarks are parsed and grouped by folder with favicons.

### Theme
- Use the theme toggle in the header. The choice is saved and restored on next visit.

---

## Browser Support
- Modern Browsers: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- Mobile: iOS Safari, Chrome Mobile, Samsung Internet
- Uses CSS Grid/Flexbox, Local Storage API, File API, and CSS custom properties

---

## Development Notes
- Single-file architecture with embedded CSS/JS for easy distribution
- Structure emphasizes clear sections, modular functions, and minimal dependencies
- Feeds use mock data client-side to bypass CORS; real feeds require a backend proxy or server-side worker

---

## Troubleshooting

### Bookmarks Not Importing
- Ensure the file is a valid HTML bookmark export
- Check browser console for parsing errors
- Try the provided sample `sample-bookmarks.html`

### Favicons Not Loading
- Some sites block favicon requests; a default icon is used when unavailable

### Feeds Not Loading
- The demo uses mock data; real-time fetching requires a backend due to CORS

### Data Not Persisting
- Confirm Local Storage is enabled and not cleared on exit
- Avoid private/incognito mode if you want persistence

---

## File Structure (Repo)
```
awesom_browser_tools/
├── index.html                 # Main homepage (self-contained)
├── README.md                  # This documentation
├── sample-bookmarks.html      # Sample bookmark export
├── sample-data.json           # Sample data structures
├── backdown.html              # Additional demo/test page
└── awesom_cybersec_home/      # Unzipped distribution (index + docs)
```

---

## Contributing

### Add New Sections
1. Create the HTML structure in `index.html` (new section container)
2. Style with CSS variables and shared classes
3. Implement JS logic and events; persist to `localStorage` as needed

### Extend Data Models
1. Update the object structure and persistence key
2. Adjust render functions accordingly
3. Add input validation and UX affordances

PRs welcome for usability improvements, accessibility, performance, and new widgets.