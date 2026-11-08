import { auth } from "./firebase.js";
import { ADMIN_EMAIL } from "./firebase-config.js";
import { onAuthStateChanged,signInWithEmailAndPassword,signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
export { auth, ADMIN_EMAIL, onAuthStateChanged, signInWithEmailAndPassword, signOut };

// The verified owner mailbox is the sole admin identity.
export async function isAuthorizedAdmin(user){
 if(!user || user.emailVerified!==true) return false;
 const email=String(user.email||"").trim().toLowerCase();
 const ownerEmail=String(ADMIN_EMAIL||"").trim().toLowerCase();
 return Boolean(email && ownerEmail && email===ownerEmail);
}
