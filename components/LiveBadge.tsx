import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

export function LiveBadge({ size = "small" }: { size?: "small" | "large" }) {
  const colors = useColors();
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const blink = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.3, duration: 600, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    );
    blink.start();
    return () => blink.stop();
  }, [opacity]);

  const isLarge = size === "large";

  return (
    <View style={[styles.container, { backgroundColor: colors.liveRed, borderRadius: 4 }]}>
      <Animated.View
        style={[
          styles.dot,
          { opacity, backgroundColor: "#fff", width: isLarge ? 8 : 5, height: isLarge ? 8 : 5, borderRadius: isLarge ? 4 : 2.5 },
        ]}
      />
      <Text style={[styles.text, { fontSize: isLarge ? 13 : 9, color: "#fff" }]}>LIVE</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 3,
    gap: 4,
  },
  dot: {},
  text: {
    fontWeight: "800",
    letterSpacing: 0.5,
  },
});
