import { auth, ADMIN_EMAIL } from "./firebase.js";
import { onAuthStateChanged,signInWithEmailAndPassword,signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
export { auth, ADMIN_EMAIL, onAuthStateChanged, signInWithEmailAndPassword, signOut };

// Admin access requires a Firebase-issued custom claim. A matching email alone
// is never sufficient; browser code cannot grant this claim to itself.
export async function isAuthorizedAdmin(user){
 if(!user || user.emailVerified!==true) return false;
 const email=String(user.email||"").trim().toLowerCase();
 const ownerEmail=String(ADMIN_EMAIL||"").trim().toLowerCase();
 if(!email || email!==ownerEmail) return false;
 try {
  const token=await user.getIdTokenResult();
  return token.claims.admin===true && token.claims.email_verified===true &&
    String(token.claims.email||"").trim().toLowerCase()===ownerEmail;
 } catch {
  return false;
 }
}
