# awesom_browser_tools

A collection of Browser based tools

# Modular Browser Homepage

A fully-featured, responsive browser homepage with favorites, notes, tasks, bookmark import, and cybersecurity news feeds.


## [Download it here](https://github.com/awes0m/awesom_browser_tools/blob/main/awesom_cybersec_home.zip)

## Features

### 🌟 Core Features

* **Responsive Design** : Works perfectly on desktop, tablet, and mobile devices
* **Dark/Light Theme** : Toggle between themes with persistent storage
* **Modular Architecture** : Clean, maintainable code structure
* **Local Storage** : All data persists locally in your browser

### 📌 Favorites Management

* Add, edit, and remove favorite links
* Custom icons using Font Awesome classes
* Visual drag-and-drop interface
* Hover effects and smooth animations

### 📝 Notes & Tasks

* **Notes** : Rich text notes with titles and content
* **Tasks** : To-do items with due dates and completion status
* **Smart Sorting** : Overdue tasks highlighted in red
* **CRUD Operations** : Full create, read, update, delete functionality

### 📚 Bookmark Import

* Import standard browser bookmark exports (bookmarks.html)
* Automatic folder organization
* Favicon display for visual recognition
* Drag-and-drop file upload support

### 📰 News Feeds(also add custom feeds)

* Cybersecurity news from popular sources:
  * Krebs on Security
  * The Hacker News
  * Hacker News (YC)
  * Threatpost
* Lazy loading on scroll
* Refresh functionality
* Clean, readable feed layout

## Setup Instructions

### Quick Start

1. **Download/Save the HTML file** :

* Save the main HTML file as `index.html`
* No additional files required - everything is self-contained

1. **Open in Browser** :

```bash
   # Simply double-click the index.html file
   # OR open in your preferred browser
   open index.html  # macOS
   start index.html # Windows
   xdg-open index.html # Linux
```

1. **Local Server (Recommended)** :
   For better performance and to avoid CORS issues with feeds:

```bash
   # Using Python
   python -m http.server 8000
   # OR using Node.js
   npx http-server
   # OR using PHP
   php -S localhost:8000
```

   Then visit `http://localhost:8000`

### File Structure

```
homepage/
├── index.html          # Main homepage file (self-contained)
├── data.json          # Sample data structure (reference only)
├── bookmarks.html     # Sample bookmarks for testing
└── README.md          # This documentation
```

### Browser Support

* **Modern Browsers** : Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
* **Mobile Browsers** : iOS Safari, Chrome Mobile, Samsung Internet
* **Features Used** :
* CSS Grid & Flexbox
* Local Storage API
* File API for bookmark import
* CSS Custom Properties (variables)

## Usage Guide

### Adding Favorites

1. Click the "Add Favorite" button
2. Fill in:
   * **Label** : Display name for the favorite
   * **URL** : Full URL (must include http:// or https://)
   * **Icon** : Font Awesome class (e.g., `fab fa-github`)
3. Click "Add Favorite"

### Managing Notes

1. Click "Add Note" to create a new note
2. Enter a title and content
3. Notes support multi-line text
4. Delete notes using the trash icon

### Managing Tasks

1. Click "Add Task" to create a new task
2. Enter task description
3. Optionally set a due date
4. Check off completed tasks
5. Overdue tasks are highlighted in red

### Importing Bookmarks

1. Export bookmarks from your browser:
   * **Chrome** : Menu → Bookmarks → Bookmark Manager → Export Bookmarks
   * **Firefox** : Menu → Library → Bookmarks → Show All Bookmarks → Import and Backup → Export Bookmarks to HTML
   * **Safari** : File → Export Bookmarks
   * **Edge** : Menu → Favorites → Manage Favorites → Export Favorites
2. In the homepage:
   * Drag and drop the exported HTML file onto the upload area
   * OR click the upload area to select the file
3. Bookmarks will be automatically organized by folder

### Theme Switching

* Click the moon/sun icon in the header to toggle between light and dark themes
* Your preference is saved automatically

## Customization

### Styling

The homepage uses CSS custom properties for easy theming:

```css
:root {
    --accent-color: #3b82f6;        /* Primary blue */
    --danger-color: #ef4444;        /* Red for delete/overdue */
    --success-color: #10b981;       /* Green for success */
    --warning-color: #f59e0b;       /* Yellow for warnings */
    /* ... other variables */
}
```

### Adding Custom Feed Sources

Modify the `feedSources` array in the JavaScript:

```javascript
const feedSources = [
    {
        name: 'Your Custom Source',
        url: 'https://example.com',
        icon: 'https://example.com/favicon.ico',
        mockData: [
            {
                title: 'Sample Article',
                link: 'https://example.com/article',
                summary: 'Article summary...',
                pubDate: '1 hour ago'
            }
        ]
    }
];
```

### Font Awesome Icons

The homepage includes Font Awesome 6.0 for icons. Popular classes:

* `fas fa-home` - Home
* `fab fa-github` - GitHub
* `fab fa-google` - Google
* `fas fa-globe` - Generic website
* `fas fa-shield-alt` - Security
* `fas fa-code` - Development

## Data Storage

### Local Storage Keys

* `favorites`: JSON array of favorite links
* `notes`: JSON array of notes
* `todos`: JSON array of tasks
* `bookmarks`: JSON array of imported bookmarks
* `theme`: Current theme preference

### Data Structure Examples

#### Favorite

```json
{
    "id": 1694000000,
    "label": "GitHub",
    "url": "https://github.com",
    "icon": "fab fa-github"
}
```

#### Note

```json
{
    "id": 1694000000,
    "title": "Meeting Notes",
    "content": "Discussion points...",
    "createdAt": "2024-09-14"
}
```

#### Task

```json
{
    "id": 1694000000,
    "text": "Complete security review",
    "dueDate": "2024-09-20",
    "completed": false,
    "createdAt": "2024-09-14"
}
```

#### Bookmark

```json
{
    "id": 1694000000,
    "title": "OWASP",
    "url": "https://owasp.org",
    "folder": "Security Resources",
    "favicon": "https://owasp.org/favicon.ico"
}
```

## Testing

### Test Bookmark Import

1. Use the provided `bookmarks.html` sample file
2. Drag and drop it onto the upload area
3. Verify bookmarks are organized by folder
4. Check that favicons load correctly

### Test Data Persistence

1. Add favorites, notes, and tasks
2. Refresh the page
3. Verify all data persists
4. Switch themes and verify preference is saved

### Test Responsive Design

1. Open browser developer tools
2. Toggle device emulation
3. Test on various screen sizes:
   * Mobile: 375px width
   * Tablet: 768px width
   * Desktop: 1200px+ width

## Troubleshooting

### Common Issues

#### Bookmarks Not Importing

* Ensure the file is a valid HTML bookmark export
* Check browser console for parsing errors
* Try with the sample bookmarks.html file first

#### Favicons Not Loading

* Some websites block favicon requests from other domains
* This is normal behavior and doesn't affect functionality
* Favicons will be replaced with a default icon if loading fails

#### Feeds Not Loading

* The demo uses mock data for demonstration
* Real RSS/API integration would require a backend service
* CORS policies prevent direct RSS fetching from browsers

#### Data Not Persisting

* Ensure your browser supports Local Storage
* Check if you're in private/incognito mode
* Clear browser data might reset the homepage

### Performance Tips

* The homepage is optimized for performance with:
  * Minimal external dependencies
  * Efficient DOM manipulation
  * Lazy loading for feeds
  * CSS transitions instead of animations

### Security Considerations

* All data is stored locally in your browser
* No external servers or APIs are contacted (except for favicons)
* Bookmark imports are processed client-side only
* The homepage works entirely offline after initial load

## Browser Compatibility

### Fully Supported

* Chrome 80+ (all features)
* Firefox 75+ (all features)
* Safari 13+ (all features)
* Edge 80+ (all features)

### Partially Supported

* Older browsers may not support:
  * CSS Grid (fallback to Flexbox)
  * CSS Custom Properties (fallback colors)
  * Modern JavaScript features

### Mobile Support

* Responsive design works on all screen sizes
* Touch-friendly interface
* Optimized for mobile browsers
* Supports gesture navigation

## Contributing

The codebase is modular and easy to extend:

### Adding New Sections

1. Create HTML structure in the main container
2. Add corresponding CSS styles
3. Implement JavaScript class methods
4. Hook up event listeners in `setupEventListeners()`

### Extending Data Models

1. Update the data structure in Local Storage
2. Modify render methods
3. Add form validation if needed
4. Update CRUD operations

This homepage provides a solid foundation for a personal browser start page with room for customization and extension based on your specific needs.
