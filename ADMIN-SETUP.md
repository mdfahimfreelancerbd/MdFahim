# Admin and backend security setup

## Access model
- Public portfolio content is readable by visitors.
- The database root and all unlisted paths are denied by default.
- A signed-in user can read/write only their own `users/{uid}` node.
- Admin access is granted only to the exact owner email `mdfahim.freelancer.bd@gmail.com` after Firebase Authentication confirms that the email is verified.
- No custom claim setup is required for this single-owner website. Never grant admin access based on a client-editable database value.

## Realtime Database
1. Open Firebase Console > Realtime Database > Rules.
2. Publish the exact contents of `database.rules.json`.
3. Test: unauthenticated root read denied; public portfolio section read allowed; regular user write to public sections denied; user A reading user B's node denied; owner without admin claim denied; verified verified owner email can write public sections.
4. Keep private user details only under `users/{uid}`. Never store private account data in public portfolio sections.

## Cloudinary
The unsigned upload preset is public to browser visitors and is not an authentication boundary. Restrict allowed formats, maximum file size, and upload folder in Cloudinary. For stronger abuse protection and secure deletion, move uploads to a trusted signed server endpoint. Never expose the Cloudinary API secret.

## Deployment
After committing, wait for the Pages deployment. Security Rules must also be published manually in Firebase Console; a repository JSON file does not publish them automatically.
