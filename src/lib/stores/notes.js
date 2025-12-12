import { writable } from "svelte/store";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { user } from "./auth";

const createNotesStore = () => {
  const { subscribe, set, update } = writable([]);

  let unsubscribeFirestore = null;
  let currentUser = null;

  user.subscribe((u) => {
    currentUser = u;
    if (unsubscribeFirestore) {
      unsubscribeFirestore();
      unsubscribeFirestore = null;
    }

    if (u) {
      // Load from Firestore
      const q = query(collection(db, "notes"), where("uid", "==", u.uid));
      unsubscribeFirestore = onSnapshot(q, (querySnapshot) => {
        const notes = [];
        querySnapshot.forEach((doc) => {
          notes.push({ id: doc.id, ...doc.data() });
        });
        set(notes);
      });
    } else {
      // Load from localStorage
      if (typeof window !== "undefined") {
        const localNotes = localStorage.getItem("notes");
        if (localNotes) {
          set(JSON.parse(localNotes));
        } else {
          set([]);
        }
      } else {
        set([]);
      }
    }
  });

  return {
    subscribe,
    add: async (note) => {
      if (currentUser) {
        await addDoc(collection(db, "notes"), {
          ...note,
          uid: currentUser.uid,
          createdAt: new Date(),
        });
      } else {
        update((n) => {
          const newNotes = [...n, { ...note, id: Date.now().toString() }];
          if (typeof window !== "undefined") {
            localStorage.setItem("notes", JSON.stringify(newNotes));
          }
          return newNotes;
        });
      }
    },
    update: async (id, updatedFields) => {
      if (currentUser) {
        await updateDoc(doc(db, "notes", id), updatedFields);
      } else {
        update((n) => {
          const newNotes = n.map((note) => {
            if (note.id === id) {
              return { ...note, ...updatedFields };
            }
            return note;
          });
          if (typeof window !== "undefined") {
            localStorage.setItem("notes", JSON.stringify(newNotes));
          }
          return newNotes;
        });
      }
    },
    remove: async (id) => {
      if (currentUser) {
        await deleteDoc(doc(db, "notes", id));
      } else {
        update((n) => {
          const newNotes = n.filter((note) => note.id !== id);
          if (typeof window !== "undefined") {
            localStorage.setItem("notes", JSON.stringify(newNotes));
          }
          return newNotes;
        });
      }
    },
  };
};

export const notes = createNotesStore();
