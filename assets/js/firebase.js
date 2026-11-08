import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const databaseConfigured = /^https:\/\//.test(firebaseConfig.databaseURL);
export const database = databaseConfigured ? getDatabase(app) : null;