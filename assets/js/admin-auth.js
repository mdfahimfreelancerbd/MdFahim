import { auth } from "./firebase.js";
import { ADMIN_EMAIL } from "./firebase-config.js";
import { onAuthStateChanged,signInWithEmailAndPassword,signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
export { auth, ADMIN_EMAIL, onAuthStateChanged, signInWithEmailAndPassword, signOut };

// The owner account is identified by Firebase's verified email address.
// Never trust a client-provided role or a display name for admin access.
export async function isAuthorizedAdmin(user){
 const email=String(user?.email||"").trim().toLowerCase();
 const ownerEmail=String(ADMIN_EMAIL||"").trim().toLowerCase();
 return Boolean(user && user.emailVerified===true && email && email===ownerEmail);
}
