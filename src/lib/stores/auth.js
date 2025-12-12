import { writable } from "svelte/store";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export const user = writable(null);
export const loading = writable(true);

onAuthStateChanged(auth, (u) => {
  user.set(u);
  loading.set(false);
});
