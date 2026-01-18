import { Search } from "lucide-react-native";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import Colors from "@/constants/colors";
import { SCHEDULE_DATA } from "@/mocks/schedule";
import { Show } from "@/types";

export default function ScheduleScreen() {
  const [search, setSearch] = useState<string>("");
  const [currentShow, setCurrentShow] = useState<Show | null>(null);
  const [progressAnim] = useState(new Animated.Value(0));
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentSecond = now.getSeconds();
      const currentTimeInSeconds = currentHour * 3600 + currentMinute * 60 + currentSecond;

      const activeShow = SCHEDULE_DATA.find((show) => {
        const [startHour, startMinute] = show.time.split(":").map(Number);
        const [endHour, endMinute] = show.endTime.split(":").map(Number);
        const startTime = startHour * 3600 + startMinute * 60;
        const endTime = endHour * 3600 + endMinute * 60;

        return currentTimeInSeconds >= startTime && currentTimeInSeconds < endTime;
      });

      if (activeShow) {
        setCurrentShow(activeShow);

        const [startHour, startMinute] = activeShow.time.split(":").map(Number);
        const [endHour, endMinute] = activeShow.endTime.split(":").map(Number);
        const startTime = startHour * 3600 + startMinute * 60;
        const endTime = endHour * 3600 + endMinute * 60;
        const duration = endTime - startTime;
        const elapsed = currentTimeInSeconds - startTime;
        const calculatedProgress = (elapsed / duration) * 100;
        const remainingSeconds = endTime - currentTimeInSeconds;
        const remainingMins = Math.floor(remainingSeconds / 60);
        const remainingSecs = remainingSeconds % 60;
        setTimeRemaining(`${remainingMins} dk ${remainingSecs} sn kaldı`);

        Animated.timing(progressAnim, {
          toValue: calculatedProgress,
          duration: 500,
          useNativeDriver: false,
        }).start();
      } else {
        setCurrentShow(null);
        setTimeRemaining("");
        Animated.timing(progressAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }).start();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [progressAnim]);

  const filteredShows = SCHEDULE_DATA.filter((show) =>
    show.title.toLowerCase().includes(search.toLowerCase())
  );

  const showsByDate = filteredShows.reduce((acc, show) => {
    const date = show.date || "2026-09-19";
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(show);
    return acc;
  }, {} as Record<string, Show[]>);

  const dates = Object.keys(showsByDate).sort();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primaryDark, Colors.primary]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Gösteri Programı</Text>
          <Text style={styles.headerSubtitle}>SHG Airshow 2026</Text>
        </View>

        {currentShow && (
          <View style={styles.liveShowCard}>
            <View style={styles.liveShowHeader}>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>CANLI</Text>
              </View>
              <Text style={styles.liveShowTime}>
                {currentShow.time} - {currentShow.endTime}
              </Text>
            </View>

            <Text style={styles.liveShowTitle}>{currentShow.title}</Text>
            <Text style={styles.liveShowDescription}>{currentShow.description}</Text>

            {timeRemaining && (
              <Text style={styles.timeRemainingText}>{timeRemaining}</Text>
            )}

            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}>
                <Animated.View
                  style={[
                    styles.progressBarFill,
                    {
                      width: progressAnim.interpolate({
                        inputRange: [0, 100],
                        outputRange: ["0%", "100%"],
                      }),
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        )}

        <View style={styles.searchContainer}>
          <View style={styles.searchIconContainer}>
            <Search color={Colors.textSecondary} size={18} />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Program ara..."
            placeholderTextColor={Colors.textSecondary}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {dates.map((date) => {
            const shows = showsByDate[date];
            const dateLabel = date === "2026-09-19" ? "19 Eylül Cumartesi" : "20 Eylül Pazar";

            return (
              <View key={date}>
                <View style={styles.dateSection}>
                  <View style={styles.dateIcon}>
                    <Text style={styles.dateIconText}>🗓️</Text>
                  </View>
                  <Text style={styles.dateText}>{dateLabel}</Text>
                </View>

                {shows.map((show, index) => {
                  const isActive = currentShow?.id === show.id;
                  const isPast = () => {
                    const now = new Date();
                    const [endHour, endMinute] = show.endTime.split(":").map(Number);
                    const endTime = endHour * 60 + endMinute;
                    const currentTime = now.getHours() * 60 + now.getMinutes();
                    return currentTime > endTime;
                  };

                  return (
                    <View key={show.id} style={styles.showItem}>
                      <View style={styles.timelineContainer}>
                        <View
                          style={[
                            styles.timelineDot,
                            isActive && styles.timelineDotActive,
                          ]}
                        />
                        {index < shows.length - 1 && (
                          <View style={styles.timelineLine} />
                        )}
                      </View>

                      <View style={styles.showContent}>
                        <Text
                          style={[
                            styles.showTime,
                            isPast() && styles.showTimePast,
                          ]}
                        >
                          {show.time}
                        </Text>
                        <View
                          style={[
                            styles.showCard,
                            isActive && styles.showCardActive,
                          ]}
                        >
                          <Text style={styles.showTitle}>{show.title}</Text>
                          <Text style={styles.showDescription}>{show.description}</Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            );
          })}
        </ScrollView>
      </LinearGradient>
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
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: Colors.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textSecondary,
  },
  liveShowCard: {
    marginHorizontal: 24,
    marginBottom: 20,
    padding: 20,
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.live,
  },
  liveShowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.live,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.white,
  },
  liveText: {
    fontSize: 12,
    fontWeight: "800",
    color: Colors.white,
    letterSpacing: 1,
  },
  liveShowTime: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  liveShowTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.white,
    marginBottom: 6,
  },
  liveShowDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.live,
    borderRadius: 3,
  },
  timeRemainingText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.live,
    marginTop: 8,
    marginBottom: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(30, 58, 95, 0.6)",
    borderRadius: 14,
    paddingHorizontal: 4,
    paddingVertical: 4,
    marginHorizontal: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  searchIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  dateSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  dateIcon: {
    width: 40,
    height: 40,
    backgroundColor: Colors.cardBg,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  dateIconText: {
    fontSize: 20,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.white,
  },
  showItem: {
    flexDirection: "row",
    marginBottom: 20,
  },
  timelineContainer: {
    alignItems: "center",
    marginRight: 16,
    width: 20,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.gray,
    marginTop: 6,
  },
  timelineDotActive: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.live,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginTop: 8,
    minHeight: 40,
  },
  showContent: {
    flex: 1,
  },
  showTime: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.live,
    marginBottom: 8,
  },
  showTimePast: {
    color: Colors.gray,
  },
  showCard: {
    backgroundColor: "rgba(30, 58, 95, 0.6)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  showCardActive: {
    backgroundColor: Colors.cardBg,
    borderColor: Colors.live,
    borderWidth: 2,
  },
  showTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.white,
    marginBottom: 4,
  },
  showDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
