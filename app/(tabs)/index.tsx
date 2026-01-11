import { Calendar as CalendarIcon, MapPin } from "lucide-react-native";
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
import { EVENT_DATE } from "@/mocks/schedule";

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
          <Text style={styles.title}>
            SHG{"\n"}
            <Text style={styles.titleBold}>Airshow</Text>
          </Text>
          <Text style={styles.year}>2026</Text>

          <Text style={styles.subtitle}>Dünya Havacılığının Buluşma Noktası</Text>

          <View style={styles.eventInfoContainer}>
            <View style={styles.eventInfoItem}>
              <CalendarIcon color={Colors.accentLight} size={18} />
              <Text style={styles.eventInfoText}>19-20 Eylül 2026</Text>
            </View>
            <View style={styles.eventInfoItem}>
              <MapPin color={Colors.accentLight} size={18} />
              <Text style={styles.eventInfoText}>Sivrihisar/Eskişehir</Text>
            </View>
          </View>

          <View style={styles.countdownContainer}>
            <CountdownBox value={timeLeft.days} label="GÜN" />
            <CountdownBox value={timeLeft.hours} label="SAAT" />
            <CountdownBox value={timeLeft.minutes} label="DAK" />
            <CountdownBox value={timeLeft.seconds} label="SAN" />
          </View>

          <TouchableOpacity style={styles.ticketButton} onPress={() => router.push("/tickets")}>
            <Text style={styles.ticketButtonText}>Hemen Bilet Al</Text>
            <Text style={styles.ticketButtonArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.participantsButton} onPress={() => router.push("/participants")}>
            <Text style={styles.participantsButtonText}>Katılımcılar</Text>
          </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    justifyContent: "center",
  },
  title: {
    fontSize: 42,
    fontWeight: "300",
    color: Colors.white,
    lineHeight: 48,
  },
  titleBold: {
    fontWeight: "800",
  },
  year: {
    fontSize: 52,
    fontWeight: "800",
    color: Colors.accentLight,
    marginTop: -4,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  eventInfoContainer: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 20,
  },
  eventInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  eventInfoText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.white,
  },
  countdownContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  countdownBox: {
    flex: 1,
    backgroundColor: "rgba(30, 58, 95, 0.6)",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.2)",
  },
  countdownValue: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.white,
    marginBottom: 2,
  },
  countdownLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  ticketButton: {
    backgroundColor: Colors.accentLight,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  ticketButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.white,
  },
  ticketButtonArrow: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.white,
  },
  participantsButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  participantsButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.white,
    textAlign: "center",
  },
});
