# Admin and backend setup

This repository includes the client integration foundation. It is not production-ready until the owner completes these console steps and verifies them.

## Firebase Authentication
1. In Firebase Console, enable Authentication > Sign-in method > Email/Password.
2. Create the owner account mdfahim.freelancer.bd@gmail.com privately. Never publish or share its password.
3. Grant the owner Firebase Auth custom claim admin=true from a trusted Admin SDK environment (never from browser JavaScript).
4. Sign out and back in. The Admin Panel checks both the exact email and the verified custom claim.

Trusted Admin SDK example (run only in a secured environment):
    await getAuth().setCustomUserClaims("OWNER_FIREBASE_UID", { admin: true });

## Realtime Database
1. Create a Realtime Database in project graphic-designer-9a84d.
2. Copy the exact database URL shown in Firebase Console.
3. Add it to assets/js/firebase-config.js as databaseURL. Do not guess the URL.
4. Publish database.rules.json in Realtime Database > Rules.
5. Test public read and unauthorized write denial in Rules Playground before production.

## Cloudinary
Cloud name: h1vevauo. Verify the exact upload preset API name in Cloudinary Console and ensure it is unsigned. The browser never receives the API secret. Unsigned browser uploads cannot securely delete stored files; deleting a Firebase portfolio record does not delete its Cloudinary binary. Secure binary deletion needs a trusted signed server endpoint.

## Deployment
Serve repository root over HTTPS on GitHub Pages or Cloudflare Pages. No build command is required. Firebase SDK is loaded from the versioned Google CDN.

## Before configuration
When databaseURL is blank, public portfolio remains empty (no fabricated work) and content editing is unavailable. Do not claim login, database rules, or uploads are tested until verified with the actual Firebase and Cloudinary projects.
