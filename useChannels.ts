import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "@/config/firebase";
import type { Channel } from "@/models/types";

const FALLBACK_CHANNELS: Channel[] = [
  { id: "ch1", name: "Star Sports 1",  logo: "https://upload.wikimedia.org/wikipedia/en/8/8a/Star_Sports_1_logo.png",  streamUrl: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8", isLive: true },
  { id: "ch2", name: "Star Sports 2",  logo: "https://upload.wikimedia.org/wikipedia/en/4/44/Star_Sports_2_logo.png",  streamUrl: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8", isLive: true },
  { id: "ch3", name: "Sony Ten 1",     logo: "https://upload.wikimedia.org/wikipedia/en/3/31/Sony_Ten_1_logo.png",    streamUrl: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8", isLive: true },
  { id: "ch4", name: "Sony Ten 2",     logo: "https://upload.wikimedia.org/wikipedia/en/2/24/Sony_Ten_2_logo.png",    streamUrl: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8", isLive: false },
  { id: "ch5", name: "DD Sports",      logo: "https://upload.wikimedia.org/wikipedia/en/f/f9/DD_Sports.png",          streamUrl: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8", isLive: true },
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

export function useChannels(categoryId: string) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) return;
    setLoading(true);

    if (isFirebasePlaceholder()) {
      setChannels(FALLBACK_CHANNELS);
      setLoading(false);
      return;
    }

    const channelsRef = ref(db, `channels/${categoryId}`);
    const unsubscribe = onValue(
      channelsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const list: Channel[] = Array.isArray(data)
            ? data
            : Object.values(data);
          setChannels(list);
        } else {
          setChannels(FALLBACK_CHANNELS);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.warn("Firebase channels error, using fallback:", err.message);
        setChannels(FALLBACK_CHANNELS);
        setLoading(false);
        setError(null);
      }
    );
    return () => unsubscribe();
  }, [categoryId]);

  return { channels, loading, error };
}
