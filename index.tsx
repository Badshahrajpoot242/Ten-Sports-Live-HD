import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useCategories } from "@/hooks/useCategories";
import { useAppContext } from "@/context/AppContext";
import { GridButton } from "@/components/GridButton";
import { BannerAd } from "@/components/BannerAd";
import { AppMenu } from "@/components/AppMenu";
import { InterstitialAdOverlay } from "@/components/InterstitialAdOverlay";
import type { Category } from "@/models/types";

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { categories, loading, error } = useCategories();
  const { incrementClick, showInterstitial, dismissInterstitial } = useAppContext();

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const handleCategoryPress = (category: Category) => {
    incrementClick();
    router.push({
      pathname: "/sub-menu/[categoryId]",
      params: { categoryId: category.id, categoryName: category.name, categoryColor: category.color },
    });
  };

  const renderItem = ({ item, index }: { item: Category | null; index: number }) => {
    if (!item) return <View style={{ flex: 1, margin: 6 }} />;
    return <GridButton category={item} onPress={() => handleCategoryPress(item)} />;
  };

  const data = categories.length % 2 !== 0 ? [...categories, null] : categories;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.headerBg} />

      {/* Header */}
      <LinearGradient
        colors={[colors.headerBg, colors.background]}
        style={[styles.header, { paddingTop: topPad + 10 }]}
      >
        <View style={styles.headerRow}>
          <View style={styles.logoRow}>
            <Image
              source={require("@/assets/images/icon.png")}
              style={styles.appIcon}
            />
            <View>
              <Text style={[styles.appName, { color: colors.foreground }]}>TEN SPORTS</Text>
              <Text style={[styles.appSub, { color: colors.gold }]}>LIVE HD</Text>
            </View>
          </View>
          <AppMenu />
        </View>

        <View style={styles.taglineRow}>
          <View style={[styles.livePill, { backgroundColor: colors.liveRed }]}>
            <View style={styles.liveDot} />
            <Text style={styles.livePillText}>LIVE NOW</Text>
          </View>
          <Text style={[styles.tagline, { color: colors.mutedForeground }]}>
            Watch sports live in HD
          </Text>
        </View>
      </LinearGradient>

      {/* Grid */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
            Loading channels...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Ionicons name="wifi-outline" size={48} color={colors.mutedForeground} />
          <Text style={[styles.errorText, { color: colors.mutedForeground }]}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={data as (Category | null)[]}
          keyExtractor={(item, i) => item?.id ?? `pad-${i}`}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={[
            styles.grid,
            { paddingBottom: (Platform.OS === "web" ? 34 : insets.bottom) + 60 },
          ]}
          showsVerticalScrollIndicator={false}
          scrollEnabled={!!(data && data.length > 0)}
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
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  appIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
  },
  appName: {
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  appSub: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
  },
  taglineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  livePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#fff",
  },
  livePillText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 13,
  },
  grid: {
    paddingHorizontal: 10,
    paddingTop: 8,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
  },
  errorText: {
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 32,
  },
  bannerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
