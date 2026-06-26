# GitHub Profile Analyzer

A highly polished, responsive, and visually stunning client-side web application to analyze GitHub developer profiles. It concurrently fetches user details and repository statistics, calculates programming language distributions, and tracks search history locally.

## Features

- **Premium Dark Space Theme:** Designed using a modern glassmorphism design system, smooth radial gradient background glows, and interactive hover transitions.
- **Concurrent API Requests:** Uses `Promise.all` to fetch user details and up to 100 repositories in parallel, minimizing page load times.
- **Top Repositories:** Displays the top 4 repositories sorted dynamically in descending order of popularity based on star counts (`stargazers_count`).
- **Language Analytics:** Processes repository data using array aggregation methods to calculate and display the percentage distribution of your top 5 programming languages with brand-color progress bars.
- **API Rate Limit Guard:** Inspects `x-ratelimit` response headers to track remaining requests and gracefully prompts warning displays if GitHub's rate limit is hit.
- **Local Storage Search History:** Stores the last 5 unique searches locally, providing interactive glass-pill search tags and a dedicated "Clear History" button.
- **Clean Responsive Layout:** Built from scratch using CSS Grid and Flexbox to look amazing on mobile, tablet, and desktop screens.

## Project Structure

```
github-profile-analyzer/
├── index.html   # Semantic HTML structure, dashboard layout, and footer
├── style.css    # Clean comment-free variables, responsive layouts, and animations
└── app.js       # Asynchronous fetches, localStorage operations, and DOM updates
```

## How to Run Locally

Since this is a client-side vanilla web app, no compilers or bundlers are required:

1. Clone or download this repository.
2. Open a terminal in the project directory.
3. Start a local HTTP server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Or using Node.js
   npx lite-server
   ```
4. Open your browser and navigate to `http://localhost:8000`.

## GitHub Pages Deployment

This project is perfectly suited for free hosting on **GitHub Pages**:

1. Push this repository to GitHub.
2. Navigate to **Settings > Pages** in your repository dashboard.
3. Select `main` branch as your build source and click **Save**.
