# Md Fahim Ahmed — Professional Graphic Designer

Premium static portfolio built with HTML5, CSS3 and Vanilla JavaScript modules. Designed for GitHub Pages and Cloudflare Pages.

## Owner profile
- Name: Md Fahim Ahmed
- Title: Professional Graphic Designer
- Experience: 2 Years (editable)
- WhatsApp: +880 1997-222796
- Facebook: https://www.facebook.com/share/1DxcZTvnzy/
- Languages: English and Bangla
- Themes: Dark and Light

## Current project structure
- index.html — public portfolio
- admin/index.html — private admin entry point
- assets/css/styles.css — public design system and admin login
- assets/css/admin.css — admin dashboard layout
- assets/js/main.js — dynamic public rendering
- assets/js/admin.js — authenticated content editor and Cloudinary upload
- assets/js/firebase-config.js — public Firebase project config and non-secret service settings
- assets/js/firebase.js — Firebase app, Auth and Database initialization
- assets/js/admin-auth.js — email and custom-claim authorization checks
- assets/js/data.js — initial non-fictional profile/service data and public database reader
- database.rules.json — Realtime Database rules template
- ADMIN-SETUP.md — required owner-side Firebase and Cloudinary setup

## Truthfulness
Portfolio projects and verified testimonials start empty. No fake client projects, ratings, testimonials, or skill percentages are displayed. Concept placeholders are not represented as paid client work.

## Required owner setup before production
1. Enable Firebase Email/Password Authentication.
2. Create the authorized admin account privately and grant its admin custom claim using a trusted Admin SDK environment.
3. Create Realtime Database, add its exact URL to assets/js/firebase-config.js, and publish database.rules.json.
4. Verify the Cloudinary unsigned preset's exact API name in the Cloudinary Console.
5. Test login, denied unauthorized writes, public reads, uploads and mobile layouts.

No admin password or Cloudinary API secret is stored in this repository. Firebase database writes remain disabled until the real database URL and rules are configured. Cloudinary upload is dependent on the preset's exact API name. Unsigned upload cannot securely delete Cloudinary binaries; removing a portfolio record does not erase its remote image.

## Deployment
Deploy the repository root as a static site. No build command is required. Use HTTPS.
