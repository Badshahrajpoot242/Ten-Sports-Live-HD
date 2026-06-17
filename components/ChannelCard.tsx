import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { LiveBadge } from "@/components/LiveBadge";
import type { Channel } from "@/models/types";

interface ChannelCardProps {
  channel: Channel;
  onPress: () => void;
}

export function ChannelCard({ channel, onPress }: ChannelCardProps) {
  const colors = useColors();
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.97, { stiffness: 400 }, () => {
      scale.value = withSpring(1, { stiffness: 400 });
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable onPress={handlePress}>
      <Animated.View
        style={[
          styles.card,
          animStyle,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <View style={[styles.logoContainer, { backgroundColor: colors.surface }]}>
          {channel.logo ? (
            <Image
              source={{ uri: channel.logo }}
              style={styles.logo}
              resizeMode="contain"
              defaultSource={require("@/assets/images/icon.png")}
            />
          ) : (
            <Ionicons name="tv" size={32} color={colors.mutedForeground} />
          )}
        </View>

        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
            {channel.name}
          </Text>
          {channel.quality && (
            <Text style={[styles.quality, { color: colors.mutedForeground }]}>
              {channel.quality}
            </Text>
          )}
        </View>

        <View style={styles.right}>
          {channel.isLive && <LiveBadge size="small" />}
          <Ionicons name="play-circle" size={28} color={colors.primary} />
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 5,
    gap: 12,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  logo: {
    width: 54,
    height: 54,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
  },
  quality: {
    fontSize: 12,
  },
  right: {
    alignItems: "center",
    gap: 6,
  },
});
