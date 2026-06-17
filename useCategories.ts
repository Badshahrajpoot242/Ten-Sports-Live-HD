import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "@/config/firebase";
import type { Category } from "@/models/types";

const FALLBACK_CATEGORIES: Category[] = [
  { id: "cricket",    name: "Cricket",      icon: "baseball",        color: "#e63946", order: 1 },
  { id: "football",   name: "Football",     icon: "football",        color: "#2196f3", order: 2 },
  { id: "tennis",     name: "Tennis",       icon: "tennisball",      color: "#4caf50", order: 3 },
  { id: "basketball", name: "Basketball",   icon: "basketball",      color: "#ff9800", order: 4 },
  { id: "hockey",     name: "Hockey",       icon: "hockey-puck",     color: "#9c27b0", order: 5 },
  { id: "kabaddi",    name: "Kabaddi",      icon: "person-running",  color: "#e91e63", order: 6 },
  { id: "badminton",  name: "Badminton",    icon: "trophy",          color: "#00bcd4", order: 7 },
  { id: "wrestling",  name: "Wrestling",    icon: "medal",           color: "#ff5722", order: 8 },
  { id: "formula1",   name: "Formula 1",   icon: "car-sport",       color: "#f44336", order: 9 },
  { id: "highlights", name: "Highlights",  icon: "videocam",        color: "#607d8b", order: 10 },
];

function isFirebasePlaceholder(): boolean {
  try {
    const app = db.app;
    const url: string = (app.options as { databaseURL?: string }).databaseURL ?? "";
    return url.includes("YOUR_PROJECT_ID") || url === "";
  } catch {
    return true;
  }
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isFirebasePlaceholder()) {
      setCategories(FALLBACK_CATEGORIES);
      setLoading(false);
      return;
    }

    const categoriesRef = ref(db, "categories");
    const unsubscribe = onValue(
      categoriesRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const list: Category[] = Array.isArray(data)
            ? data
            : Object.values(data);
          const sorted = list.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
          setCategories(sorted);
        } else {
          setCategories(FALLBACK_CATEGORIES);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.warn("Firebase error, using fallback data:", err.message);
        setCategories(FALLBACK_CATEGORIES);
        setLoading(false);
        setError(null);
      }
    );
    return () => unsubscribe();
  }, []);

  return { categories, loading, error };
}
