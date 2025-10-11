# Outcome of DevSoc Hackathon
- **WON: People's Choice Awards $100 prize and Bucket Hat**

# Missing Link - Team 14 Statement

**Deployment Link:** https://missing-link-six.vercel.app/

**Devpost Link** https://devpost.com/software/temp-i3rn49?ref_content=my-projects-tab&ref_feature=my_projects


## Inspiration
Missing Link was born from a shared frustration with the fragmented nature of university society events. We noticed that students often miss out on exciting opportunities simply because they don't know about them. Existing platforms are either too cluttered, outdated, or don't provide a centralized view of what's happening across different societies. We wanted to create a solution that would bridge this gap and make it effortless for students to discover and engage with all the amazing events happening around them.

## What it does
Missing Link is a centralized platform that aggregates events from all university societies in one place. It allows students to:

- Browse upcoming events across all societies
- Filter events by categories, dates, and popularity
- Sync events with their personal calendars
- Receive personalized event recommendations
- Track their event attendance and engagement
- Easily share events with friends

### Innovation & Impact (25%)
simple innovations: calendar automation that truly saves time, societies, 

### Technical Complexity & Completeness (20%)
 End‑to‑end system: authenticated users, automated scraping, database‑backed feed, iCal generation, and a modern, resilient frontend. It works across devices.

### User Experience & Design (20%)
 Single search box, clear society pages, one‑click favorite, one‑time calendar subscribe. Clean, consistent UI with fast load times.

### Practicality & Feasibility (15%)
 Already live with 400+ societies and 250 events at UNSW. Automations ensure data freshness. Supabase and our scraper architecture are built to scale.

## How we built it
We built Missing Link using a modern tech stack:

Frontend: Next.js with React for a responsive, single-page application
- UI/UX: Tailwind CSS for clean, accessible design
- Backend: Supabase for authentication and database
- APIs: Custom scrapers to aggregate events from various sources
- Deployment: Vercel for seamless CI/CD and Github Actions for scraper cron jobs

## Challenges we ran into
- Data Aggregation: Creating reliable scrapers that could handle different society website structures
- User Authentication: Implementing secure auth flows while maintaining a smooth user experience
- Calendar Integration: Making the iCal export feature work reliably across different calendar applications

## Accomplishments that we're proud of
- Successfully aggregating events from multiple sources into a single, cohesive platform
- Creating an intuitive user interface that makes event discovery effortless
- Implementing real-time updates for event information
- Building a system that can scale as we add more societies and events

## What we learned
- The importance of clean, maintainable code architecture
- How to handle and process large datasets efficiently
- User authentication
- How to work effectively as a team using agile methodologies

## What's next for Missing Link
- Expand Coverage: Add more universities and societies to the platform
- Mobile App: Develop native mobile apps for iOS and Android
- Smart Recommendations: Implement AI-powered event recommendations
- Social Features: Add friend connections and event sharing
- Analytics Dashboard: Provide societies with insights into event performance
- Ticketing Integration: Partner with ticketing platforms for seamless event registration
- Accessibility Improvements: Ensure the platform is fully accessible to all users

We're excited to continue developing Missing Link and making it the go-to platform for university event discovery!
