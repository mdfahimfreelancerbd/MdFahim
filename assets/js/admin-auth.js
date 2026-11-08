import { auth } from "./firebase.js";
import { ADMIN_EMAIL } from "./firebase-config.js";
import { onAuthStateChanged,signInWithEmailAndPassword,signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
export { auth, ADMIN_EMAIL, onAuthStateChanged, signInWithEmailAndPassword, signOut };
export async function isAuthorizedAdmin(user){
 if(!user||user.email?.toLowerCase()!==ADMIN_EMAIL)return false;
 const token=await user.getIdTokenResult(true);
 return token.claims.admin===true;
}