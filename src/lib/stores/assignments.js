import { writable } from "svelte/store";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { user } from "./auth";

const createAssignmentsStore = () => {
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
      const q = query(collection(db, "assignments"), where("uid", "==", u.uid));
      unsubscribeFirestore = onSnapshot(q, (querySnapshot) => {
        const assignments = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Convert timestamp to Date object if needed, but for now we store ISO strings or Timestamps
          // In calendar, it expects Date objects or ISO strings.
          // Firestore stores dates as Timestamps.
          let dueDate = data.dueDate;
          if (dueDate && dueDate.toDate) {
            dueDate = dueDate.toDate();
          } else if (dueDate && typeof dueDate === "string") {
            dueDate = new Date(dueDate);
          }

          assignments.push({ id: doc.id, ...data, dueDate });
        });
        set(assignments);
      });
    } else {
      // Load from localStorage
      if (typeof window !== "undefined") {
        const localAssignments = localStorage.getItem("assignments");
        if (localAssignments) {
          const parsed = JSON.parse(localAssignments);
          // fix dates
          const fixed = parsed.map((a) => ({
            ...a,
            dueDate: new Date(a.dueDate),
          }));
          set(fixed);
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
    add: async (assignment) => {
      // assignment.dueDate is a Date object or string
      if (currentUser) {
        // Firestore supports Date objects directly in addDoc, but let's check.
        // Yes, it converts to Timestamp.
        await addDoc(collection(db, "assignments"), {
          ...assignment,
          uid: currentUser.uid,
        });
      } else {
        update((n) => {
          const newAssignments = [
            ...n,
            { ...assignment, id: Date.now().toString() },
          ];
          if (typeof window !== "undefined") {
            localStorage.setItem("assignments", JSON.stringify(newAssignments));
          }
          return newAssignments;
        });
      }
    },
    remove: async (id) => {
      if (currentUser) {
        await deleteDoc(doc(db, "assignments", id));
      } else {
        update((n) => {
          const newAssignments = n.filter((a) => a.id !== id);
          if (typeof window !== "undefined") {
            localStorage.setItem("assignments", JSON.stringify(newAssignments));
          }
          return newAssignments;
        });
      }
    },
  };
};

export const assignments = createAssignmentsStore();
