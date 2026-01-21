import { Calendar as CalendarIcon, MapPin, Ticket } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import Colors from "@/constants/colors";
import Fonts from "@/constants/fonts";
import { EVENT_DATE } from "@/mocks/schedule";
import { LocationIcon, CalendarBoldIcon } from "@/components/CustomIcons";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function HomeScreen() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = EVENT_DATE.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primaryDark, Colors.primary, Colors.cardBg]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Text style={styles.title}>
              SHG{"\n"}
              <Text style={styles.titleBold}>Airshow</Text>
            </Text>
            <Text style={styles.year}>2026</Text>
            <Text style={styles.subtitle}>Dünya Havacılığının Buluşma Noktası</Text>
          </View>

          {/* Event Info Card */}
          <View style={styles.infoCard}>
            <View style={styles.eventInfoItem}>
              <View style={styles.iconContainer}>
                <CalendarBoldIcon color={Colors.live} size={20} />
              </View>
              <Text style={styles.eventInfoText}>19-20 Eylül 2026</Text>
            </View>
            <View style={styles.eventInfoItem}>
              <View style={styles.iconContainer}>
                <LocationIcon color={Colors.live} size={20} />
              </View>
              <Text style={styles.eventInfoText}>Sivrihisar, Eskişehir</Text>
            </View>
          </View>

          {/* Countdown Section - All Red */}
          <View style={styles.countdownWrapper}>
            <Text style={styles.countdownTitle}>GERİ SAYIM</Text>
            <View style={styles.countdownContainer}>
              <CountdownBox value={timeLeft.days} label="GÜN" />
              <CountdownBox value={timeLeft.hours} label="SAAT" />
              <CountdownBox value={timeLeft.minutes} label="DAK" />
              <CountdownBox value={timeLeft.seconds} label="SAN" />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push("/tickets")}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={[Colors.live, '#DC2626']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.primaryButtonGradient}
              >
                <Ticket color={Colors.white} size={20} />
                <Text style={styles.primaryButtonText}>Hemen Biletini Al</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.push("/participants")}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>Katılımcıları Keşfet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.countdownBox}>
      <Text style={styles.countdownValue}>{value.toString().padStart(2, "0")}</Text>
      <Text style={styles.countdownLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryDark,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: "center",
  },
  heroSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 48,
    fontFamily: Fonts.regular,
    color: Colors.white,
    lineHeight: 52,
  },
  titleBold: {
    fontFamily: Fonts.extraBold,
  },
  year: {
    fontSize: 56,
    fontFamily: Fonts.extraBold,
    color: Colors.live,
    marginTop: -8,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontFamily: Fonts.medium,
  },
  infoCard: {
    flexDirection: "column",
    backgroundColor: "rgba(30, 58, 95, 0.6)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    gap: 12,
  },
  eventInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  eventInfoText: {
    fontSize: 15,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
  },
  countdownWrapper: {
    marginBottom: 32,
  },
  countdownTitle: {
    fontSize: 13,
    fontFamily: Fonts.semiBold,
    color: Colors.textSecondary,
    marginBottom: 12,
    letterSpacing: 1,
  },
  countdownContainer: {
    flexDirection: "row",
    gap: 10,
  },
  countdownBox: {
    flex: 1,
    backgroundColor: "rgba(239, 68, 68, 0.12)",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  countdownValue: {
    fontSize: 28,
    fontFamily: Fonts.extraBold,
    color: Colors.live,
    marginBottom: 4,
  },
  countdownLabel: {
    fontSize: 11,
    fontFamily: Fonts.bold,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  buttonContainer: {
    gap: 12,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: Colors.live,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryButtonGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 10,
  },
  primaryButtonText: {
    fontSize: 17,
    fontFamily: Fonts.bold,
    color: Colors.white,
  },
  secondaryButton: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    textAlign: "center",
  },
});
