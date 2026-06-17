import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import type { Category } from "@/models/types";

const ICON_MAP: Record<string, keyof typeof Ionicons.glyphMap> = {
  baseball:       "baseball",
  football:       "football",
  tennisball:     "tennisball",
  basketball:     "basketball",
  "hockey-puck":  "flash",
  "person-running": "walk",
  trophy:         "trophy",
  medal:          "medal",
  "car-sport":    "car-sport",
  videocam:       "videocam",
};

interface GridButtonProps {
  category: Category;
  onPress: () => void;
}

export function GridButton({ category, onPress }: GridButtonProps) {
  const colors = useColors();
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.93, { stiffness: 400 }, () => {
      scale.value = withSpring(1, { stiffness: 400 });
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  const iconName = ICON_MAP[category.icon] ?? "tv";

  return (
    <Pressable onPress={handlePress} style={styles.pressable}>
      <Animated.View
        style={[
          styles.card,
          animStyle,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: category.color + "22" },
          ]}
        >
          <Ionicons name={iconName} size={28} color={category.color} />
        </View>
        <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={2}>
          {category.name}
        </Text>
        <View style={[styles.accent, { backgroundColor: category.color }]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
    margin: 6,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 8,
    overflow: "hidden",
    minHeight: 110,
    justifyContent: "center",
    gap: 8,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.2,
  },
  accent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    borderRadius: 2,
  },
});
