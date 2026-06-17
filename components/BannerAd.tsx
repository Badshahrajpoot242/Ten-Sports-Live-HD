import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

// AdMob Banner Ad component
// In Expo Go / development: shows a placeholder
// In production build: wire up react-native-google-mobile-ads
// Add your Ad Unit ID below:
export const BANNER_AD_UNIT_ID = "ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY";

export function BannerAd() {
  const colors = useColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.adLabel, { color: colors.mutedForeground }]}>Ad</Text>
      <Text style={[styles.adText, { color: colors.mutedForeground }]}>
        Advertisement — AdMob active in production build
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    gap: 8,
  },
  adLabel: {
    fontSize: 10,
    fontWeight: "700",
    borderWidth: 1,
    borderColor: "#666",
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    color: "#666",
  },
  adText: {
    fontSize: 12,
  },
});
