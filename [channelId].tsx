import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { VideoView, useVideoPlayer } from "expo-video";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useColors } from "@/hooks/useColors";
import { LiveBadge } from "@/components/LiveBadge";

const CONTROL_TIMEOUT = 4000;

export default function PlayerScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{
    channelId: string;
    channelName: string;
    streamUrl: string;
    logo: string;
    isLive: string;
  }>();

  const isLive = params.isLive === "true";
  const streamUrl = params.streamUrl ?? "";

  const player = useVideoPlayer(streamUrl, (p) => {
    p.loop = isLive;
    p.play();
  });

  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const controlsOpacity = useRef(new Animated.Value(1)).current;
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const playingSub = player.addListener("playingChange", (e) => {
      setIsPlaying(e.isPlaying);
    });
    const statusSub = player.addListener("statusChange", (e) => {
      if (e.status === "readyToPlay") setIsLoading(false);
      if (e.status === "error") {
        setIsLoading(false);
        setError("Stream unavailable. Please try again.");
      }
    });
    return () => {
      playingSub.remove();
      statusSub.remove();
    };
  }, [player]);

  const showControlsTemporarily = useCallback(() => {
    Animated.timing(controlsOpacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      Animated.timing(controlsOpacity, { toValue: 0, duration: 500, useNativeDriver: true }).start(() => {
        setShowControls(false);
      });
    }, CONTROL_TIMEOUT);
  }, [controlsOpacity]);

  useEffect(() => {
    showControlsTemporarily();
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [showControlsTemporarily]);

  const togglePlay = () => {
    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
    showControlsTemporarily();
  };

  const handlePiP = () => {
    // PIP is handled by the VideoView's allowsPictureInPicture prop
    // It's triggered natively on iOS via the PiP button in controls
    showControlsTemporarily();
  };

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { backgroundColor: "#000" }]}>
      <StatusBar barStyle="light-content" backgroundColor="#000" hidden={Platform.OS !== "web"} />

      {/* Video */}
      <Pressable style={styles.videoWrapper} onPress={showControlsTemporarily}>
        <VideoView
          player={player}
          style={styles.video}
          allowsPictureInPicture={true}
          contentFit="contain"
          nativeControls={false}
        />

        {/* Loading */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}

        {/* Error */}
        {error && (
          <View style={styles.loadingOverlay}>
            <Ionicons name="alert-circle" size={48} color={colors.primary} />
            <Text style={styles.errorText}>{error}</Text>
            <Pressable
              onPress={() => {
                setError(null);
                setIsLoading(true);
                player.play();
              }}
              style={[styles.retryBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        )}

        {/* Controls Overlay */}
        {showControls && (
          <Animated.View style={[styles.controlsOverlay, { opacity: controlsOpacity }]}>
            {/* Top bar */}
            <View style={[styles.topBar, { paddingTop: topPad + 6 }]}>
              <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
                <Ionicons name="chevron-back" size={26} color="#fff" />
              </Pressable>

              <View style={styles.channelInfo}>
                {params.logo ? (
                  <Image
                    source={{ uri: params.logo }}
                    style={styles.channelLogo}
                    contentFit="contain"
                  />
                ) : null}
                <View>
                  <Text style={styles.channelName} numberOfLines={1}>
                    {params.channelName ?? "Live Channel"}
                  </Text>
                  {isLive && <LiveBadge size="small" />}
                </View>
              </View>

              <Pressable onPress={handlePiP} style={styles.iconBtn} hitSlop={12}>
                <Ionicons name="phone-portrait-outline" size={22} color="#fff" />
              </Pressable>
            </View>

            {/* Center Play/Pause */}
            <View style={styles.centerControls}>
              <Pressable onPress={togglePlay} style={styles.playBtn}>
                <Ionicons
                  name={isPlaying ? "pause-circle" : "play-circle"}
                  size={72}
                  color="rgba(255,255,255,0.92)"
                />
              </Pressable>
            </View>

            {/* Bottom bar */}
            <View style={[styles.bottomBar, { paddingBottom: bottomPad + 10 }]}>
              <Pressable
                onPress={() => {
                  player.currentTime = Math.max(0, player.currentTime - 10);
                  showControlsTemporarily();
                }}
                style={styles.iconBtn}
                hitSlop={12}
              >
                <Ionicons name="play-back" size={24} color="#fff" />
              </Pressable>

              <Pressable
                onPress={() => {
                  player.currentTime = player.currentTime + 10;
                  showControlsTemporarily();
                }}
                style={styles.iconBtn}
                hitSlop={12}
              >
                <Ionicons name="play-forward" size={24} color="#fff" />
              </Pressable>

              <View style={{ flex: 1 }} />

              {isLive && <LiveBadge size="large" />}

              <Pressable style={styles.iconBtn} hitSlop={12}>
                <Ionicons name="expand" size={22} color="#fff" />
              </Pressable>
            </View>
          </Animated.View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  videoWrapper: {
    flex: 1,
    position: "relative",
  },
  video: {
    flex: 1,
    backgroundColor: "#000",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  errorText: {
    color: "#fff",
    fontSize: 15,
    textAlign: "center",
    paddingHorizontal: 32,
  },
  retryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  retryText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "space-between",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  channelInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  channelLogo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  channelName: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 3,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  centerControls: {
    alignItems: "center",
    justifyContent: "center",
  },
  playBtn: {
    opacity: 0.95,
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 12,
  },
});
