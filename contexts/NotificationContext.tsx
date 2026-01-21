import createContextHook from "@nkzw/create-context-hook";
import * as Notifications from "expo-notifications";
import { Audio } from "expo-av";
import { useEffect, useState, useCallback, useRef } from "react";
import { Platform, Alert } from "react-native";

import { SCHEDULE_DATA } from "@/mocks/schedule";

// Notification sound
const notificationSound = require("@/assets/sounds/yeni-menekse.wav");

if (Platform.OS !== "web") {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export const [NotificationProvider, useNotifications] = createContextHook(() => {
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  // Play notification sound
  const playNotificationSound = useCallback(async () => {
    try {
      // Unload previous sound if exists
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync(notificationSound);
      soundRef.current = sound;
      await sound.playAsync();

      // Unload sound after playing
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error("Ses çalma hatası:", error);
    }
  }, []);

  useEffect(() => {
    requestPermissions();

    // Configure audio mode
    if (Platform.OS !== "web") {
      Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
    }

    // Cleanup sound on unmount
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    if (Platform.OS === "web") return;

    const foregroundSubscription = Notifications.addNotificationReceivedListener(async (notification) => {
      console.log("📩 Foreground bildirim alındı:", notification.request.content);

      // Play sound when notification received in foreground
      await playNotificationSound();

      const { title, body } = notification.request.content;
      Alert.alert(title || "Gösteri Bildirimi", body || "", [{ text: "Tamam" }]);
    });

    const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log("📲 Background/Tapped bildirim:", response.notification.request.content);
    });

    return () => {
      foregroundSubscription.remove();
      backgroundSubscription.remove();
    };
  }, [playNotificationSound]);

  const requestPermissions = async () => {
    if (Platform.OS === "web") {
      setPermissionGranted(false);
      return;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      const granted = finalStatus === "granted";
      setPermissionGranted(granted);

      console.log("\n🔔 BİLDİRİM İZİN DURUMU:");
      console.log("Mevcut izin:", existingStatus);
      console.log("Final izin:", finalStatus);
      console.log("İzin verildi mi?", granted);

      if (!granted) {
        Alert.alert(
          "Bildirim İzni Gerekli",
          "Gösteri bildirimlerini alabilmek için lütfen ayarlardan bildirim izni verin.",
          [{ text: "Tamam" }]
        );
      }
    } catch (error) {
      console.error("İzin hatası:", error);
      setPermissionGranted(false);
    }
  };

  const scheduleShowNotifications = useCallback(async () => {
    if (Platform.OS === "web") return;

    if (!permissionGranted) {
      console.log("⚠️ Bildirim izni yok, planlanamıyor");
      return;
    }

    try {
      console.log("\n🔔 BİLDİRİMLER PLANLANIYOR...");
      console.log("📅 Şu anki zaman:", new Date().toLocaleString());

      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log("🗑️ Eski bildirimler silindi");

      let scheduledCount = 0;

      for (const show of SCHEDULE_DATA) {
        const [startHour, startMinute] = show.time.split(":").map(Number);
        const showDate = show.date || "2026-09-19";
        const [year, month, day] = showDate.split("-").map(Number);

        const notificationTime = new Date(year, month - 1, day, startHour, startMinute - 1, 0, 0);
        const startNotificationTime = new Date(year, month - 1, day, startHour, startMinute, 0, 0);

        const now = Date.now();

        if (notificationTime.getTime() > now) {
          console.log(`✅ Planlanan: ${show.title} - ${notificationTime.toLocaleString()}`);
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "Gösteri Başlıyor! ✈️",
              body: `${show.title} 1 dakika içinde başlayacak!`,
              data: { showId: show.id },
              sound: true,
              priority: Notifications.AndroidNotificationPriority.HIGH,
            },
            trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: notificationTime },
          });
          scheduledCount++;
        } else {
          console.log(`⏭️ Geçmiş: ${show.title} - ${notificationTime.toLocaleString()}`);
        }

        if (startNotificationTime.getTime() > now) {
          console.log(`✅ Başlangıç bildirimi: ${show.title} - ${startNotificationTime.toLocaleString()}`);
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "🎯 Gösteri Başladı!",
              body: `${show.title} şimdi başladı!`,
              data: { showId: show.id },
              sound: true,
              priority: Notifications.AndroidNotificationPriority.HIGH,
            },
            trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: startNotificationTime },
          });
          scheduledCount++;
        }
      }

      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      console.log(`\n📊 Toplam ${scheduledCount} bildirim planlandı`);
      console.log("📋 Planlanan bildirim sayısı:", scheduled.length);

      if (scheduled.length > 0) {
        console.log("\nİlk 3 bildirim:");
        scheduled.slice(0, 3).forEach(n => {
          console.log("  -", n.content.title, "|", n.content.body);
          if (n.trigger && 'date' in n.trigger && n.trigger.type === 'date') {
            console.log("    Zaman:", new Date(n.trigger.date).toLocaleString());
          }
        });
      }
    } catch (error) {
      console.error("❌ Bildirim planlama hatası:", error);
    }
  }, [permissionGranted]);

  useEffect(() => {
    if (permissionGranted) {
      scheduleShowNotifications();
    }
  }, [permissionGranted, scheduleShowNotifications]);

  const scheduleTestNotification = async () => {
    if (Platform.OS === "web") {
      console.log("Web notifications not supported");
      return;
    }

    if (!permissionGranted) {
      Alert.alert("İzin Gerekli", "Önce bildirim izni vermelisiniz!");
      return;
    }

    try {
      console.log("\n🧪 TEST BİLDİRİMİ PLANLANIYOR...");
      console.log("Şu anki zaman:", new Date().toLocaleTimeString());

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Test Bildirimi ✈️",
          body: "Bildirimler başarıyla çalışıyor!",
          sound: true,
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 5 },
      });

      console.log("✅ Test bildirimi 5 saniye sonrası için planlandı");
      Alert.alert(
        "Test Bildirimi Planlandı",
        "5 saniye sonra bildirim gelecek. Uygulamayı arka plana alın veya kapatın.",
        [{ text: "Tamam" }]
      );
    } catch (error) {
      console.error("Test bildirimi hatası:", error);
      Alert.alert("Hata", "Test bildirimi planlanamadı: " + error);
    }
  };

  return {
    permissionGranted,
    scheduleTestNotification,
    scheduleShowNotifications,
    playNotificationSound,
  };
});
