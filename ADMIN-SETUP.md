# Admin and backend security setup

## Access model
- Public portfolio content is readable by visitors.
- The database root and all unlisted paths are denied by default.
- A signed-in user can read/write only their own `users/{uid}` node.
- Admin writes require a Firebase-issued custom claim `admin: true`, a verified email, and the exact owner email `mdfahim.freelancer.bd@gmail.com`.
- Never assign admin claims from browser JavaScript or from Realtime Database user-editable data.

## Grant the owner admin claim (required once)
Use a trusted Firebase Admin SDK environment only. Never put a service-account key in this repository or website.

```js
await getAuth().setCustomUserClaims("OWNER_FIREBASE_UID", { admin: true });
```

Replace OWNER_FIREBASE_UID with the owner's Firebase Authentication UID. Then sign out and sign in again (or force-refresh the ID token). The owner email must be verified.

## Realtime Database
1. Open Firebase Console > Realtime Database > Rules.
2. Publish the exact contents of `database.rules.json`.
3. Test: unauthenticated root read denied; public portfolio section read allowed; regular user write to public sections denied; user A reading user B's node denied; owner without admin claim denied; verified owner with admin claim can write public sections.
4. Keep private user details only under `users/{uid}`. Never store private account data in public portfolio sections.

## Cloudinary
The unsigned upload preset is public to browser visitors and is not an authentication boundary. Restrict allowed formats, maximum file size, and upload folder in Cloudinary. For stronger abuse protection and secure deletion, move uploads to a trusted signed server endpoint. Never expose the Cloudinary API secret.

## Deployment
After committing, wait for the Pages deployment. Security Rules must also be published manually in Firebase Console; a repository JSON file does not publish them automatically.
