import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useChannels } from "@/hooks/useChannels";
import { ChannelCard } from "@/components/ChannelCard";
import { BannerAd } from "@/components/BannerAd";
import { InterstitialAdOverlay } from "@/components/InterstitialAdOverlay";
import { useAppContext } from "@/context/AppContext";
import type { Channel } from "@/models/types";

export default function SubMenuScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{
    categoryId: string;
    categoryName: string;
    categoryColor: string;
  }>();

  const { channels, loading } = useChannels(params.categoryId ?? "cricket");
  const { incrementClick, showInterstitial, dismissInterstitial } = useAppContext();

  const handleChannelPress = (channel: Channel) => {
    incrementClick();
    router.push({
      pathname: "/player/[channelId]",
      params: {
        channelId: channel.id,
        channelName: channel.name,
        streamUrl: channel.streamUrl,
        logo: channel.logo ?? "",
        isLive: channel.isLive ? "true" : "false",
      },
    });
  };

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const catColor = params.categoryColor ?? "#e63946";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.headerBg} />

      {/* Custom Header */}
      <View
        style={[
          styles.header,
          { paddingTop: topPad + 8, backgroundColor: colors.headerBg, borderBottomColor: colors.border },
        ]}
      >
        <View style={[styles.accent, { backgroundColor: catColor }]} />
        <View style={styles.headerContent}>
          <View style={[styles.backBtn, { backgroundColor: colors.surface }]}>
            <Ionicons
              name="chevron-back"
              size={22}
              color={colors.foreground}
              onPress={() => router.back()}
            />
          </View>
          <View style={styles.titleBlock}>
            <Text style={[styles.title, { color: colors.foreground }]}>
              {params.categoryName ?? "Channels"}
            </Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              {loading ? "Loading…" : `${channels.length} channel${channels.length !== 1 ? "s" : ""}`}
            </Text>
          </View>
          <View style={[styles.dot, { backgroundColor: catColor }]} />
        </View>
      </View>

      {/* Channel List */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
            Fetching channels...
          </Text>
        </View>
      ) : channels.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="tv-outline" size={56} color={colors.mutedForeground} />
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
            No channels available
          </Text>
        </View>
      ) : (
        <FlatList
          data={channels}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChannelCard channel={item} onPress={() => handleChannelPress(item)} />
          )}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: (Platform.OS === "web" ? 34 : insets.bottom) + 60 },
          ]}
          showsVerticalScrollIndicator={false}
          scrollEnabled={!!(channels && channels.length > 0)}
        />
      )}

      {/* Banner Ad */}
      <View style={[styles.bannerContainer, { paddingBottom: Platform.OS === "web" ? 34 : insets.bottom }]}>
        <BannerAd />
      </View>

      {/* Interstitial Ad */}
      <InterstitialAdOverlay visible={showInterstitial} onDismiss={dismissInterstitial} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    borderBottomWidth: 1,
    overflow: "hidden",
  },
  accent: {
    height: 2,
    marginBottom: 2,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  titleBlock: { flex: 1 },
  title: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 1,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  list: {
    paddingTop: 10,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: { fontSize: 14 },
  emptyText: { fontSize: 15 },
  bannerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
