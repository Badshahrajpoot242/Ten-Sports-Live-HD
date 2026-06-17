import React, { useState } from "react";
import {
  Alert,
  Linking,
  Modal,
  Pressable,
  Share,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

const APP_STORE_URL = "https://play.google.com/store/apps";
const CONTACT_EMAIL = "support@tensportslive.com";
const PRIVACY_URL = "https://tensportslive.com/privacy";

interface MenuOption {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}

export function AppMenu() {
  const colors = useColors();
  const [visible, setVisible] = useState(false);

  const handleShare = async () => {
    setVisible(false);
    try {
      await Share.share({
        message: "Watch live sports for free! Download Ten Sports Live HD app now.",
        title: "Ten Sports Live HD",
      });
    } catch {}
  };

  const handleRateUs = () => {
    setVisible(false);
    Linking.openURL(APP_STORE_URL).catch(() =>
      Alert.alert("Error", "Could not open app store.")
    );
  };

  const handleContactUs = () => {
    setVisible(false);
    Linking.openURL(`mailto:${CONTACT_EMAIL}`).catch(() =>
      Alert.alert("Contact Us", `Email us at: ${CONTACT_EMAIL}`)
    );
  };

  const handlePrivacyPolicy = () => {
    setVisible(false);
    Linking.openURL(PRIVACY_URL).catch(() =>
      Alert.alert("Error", "Could not open privacy policy.")
    );
  };

  const options: MenuOption[] = [
    { icon: "share-social",    label: "Share App",       onPress: handleShare },
    { icon: "star",            label: "Rate Us",          onPress: handleRateUs },
    { icon: "mail",            label: "Contact Us",       onPress: handleContactUs },
    { icon: "document-text",   label: "Privacy Policy",   onPress: handlePrivacyPolicy },
  ];

  return (
    <>
      <Pressable
        onPress={() => setVisible(true)}
        style={({ pressed }) => [styles.trigger, { opacity: pressed ? 0.6 : 1 }]}
        hitSlop={8}
      >
        <Ionicons name="ellipsis-vertical" size={22} color={colors.foreground} />
      </Pressable>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.sheet, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.sheetTitle, { color: colors.mutedForeground }]}>Menu</Text>
                {options.map((opt, i) => (
                  <Pressable
                    key={opt.label}
                    onPress={opt.onPress}
                    style={({ pressed }) => [
                      styles.option,
                      {
                        borderBottomWidth: i < options.length - 1 ? 1 : 0,
                        borderBottomColor: colors.border,
                        opacity: pressed ? 0.6 : 1,
                      },
                    ]}
                  >
                    <View style={[styles.optionIcon, { backgroundColor: colors.surface }]}>
                      <Ionicons name={opt.icon} size={18} color={colors.primary} />
                    </View>
                    <Text style={[styles.optionLabel, { color: colors.foreground }]}>{opt.label}</Text>
                    <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
                  </Pressable>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    padding: 4,
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    paddingBottom: 32,
    overflow: "hidden",
  },
  sheetTitle: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 14,
  },
  optionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  optionLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
  },
});
