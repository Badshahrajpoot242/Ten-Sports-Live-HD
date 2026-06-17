import React, { useEffect } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";

// Interstitial Ad placeholder
// In production: replace with react-native-google-mobile-ads InterstitialAd
export const INTERSTITIAL_AD_UNIT_ID = "ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ";

interface Props {
  visible: boolean;
  onDismiss: () => void;
}

export function InterstitialAdOverlay({ visible, onDismiss }: Props) {
  const colors = useColors();

  useEffect(() => {
    if (visible) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.adBadge}>
            <Text style={styles.adBadgeText}>Ad</Text>
          </View>
          <Text style={[styles.title, { color: colors.foreground }]}>Advertisement</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Full-screen interstitial ad{"\n"}(Active in production build)
          </Text>
          <Pressable
            onPress={onDismiss}
            style={[styles.closeBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.closeBtnText}>Continue Watching</Text>
          </Pressable>
          <Pressable onPress={onDismiss} style={styles.skipBtn} hitSlop={12}>
            <Ionicons name="close" size={16} color={colors.mutedForeground} />
            <Text style={[styles.skipText, { color: colors.mutedForeground }]}>Skip</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  container: {
    width: "100%",
    borderRadius: 20,
    borderWidth: 1,
    padding: 28,
    alignItems: "center",
    gap: 12,
  },
  adBadge: {
    borderWidth: 1,
    borderColor: "#666",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  adBadgeText: {
    fontSize: 10,
    color: "#888",
    fontWeight: "700",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
  },
  closeBtn: {
    marginTop: 12,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
  },
  closeBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  skipBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 13,
  },
});
