import { Platform } from "react-native";
import {
  OneSignal,
  LogLevel,
  NotificationClickEvent,
  NotificationWillDisplayEvent,
} from "react-native-onesignal";

const ONESIGNAL_APP_ID = process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID;

/**
 * OneSignal servisini başlatır
 * Uygulama başlatıldığında bir kere çağrılmalı
 */
export const initializeOneSignal = () => {
  if (Platform.OS === "web") {
    console.log("OneSignal web platformunda desteklenmiyor");
    return;
  }

  if (!ONESIGNAL_APP_ID) {
    console.warn("⚠️ EXPO_PUBLIC_ONESIGNAL_APP_ID tanımlanmamış");
    return;
  }

  // Debug modunda loglama (production'da kapatılmalı)
  if (__DEV__) {
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);
  }

  // OneSignal'ı başlat
  OneSignal.initialize(ONESIGNAL_APP_ID);

  console.log("✅ OneSignal başlatıldı:", ONESIGNAL_APP_ID);
};

/**
 * Push notification izni ister
 * @returns İzin verilip verilmediği
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (Platform.OS === "web") {
    return false;
  }

  try {
    const granted = await OneSignal.Notifications.requestPermission(true);
    console.log("🔔 Bildirim izni:", granted ? "Verildi" : "Reddedildi");
    return granted;
  } catch (error) {
    console.error("❌ Bildirim izni hatası:", error);
    return false;
  }
};

/**
 * OneSignal Player ID (Subscription ID) döndürür
 * @returns Player ID veya null
 */
export const getOneSignalPlayerId = async (): Promise<string | null> => {
  if (Platform.OS === "web") {
    return null;
  }

  try {
    // SDK v5 için getIdAsync kullan
    const subscriptionId = await OneSignal.User.pushSubscription.getIdAsync();
    console.log("📱 OneSignal Player ID:", subscriptionId);
    return subscriptionId || null;
  } catch (error) {
    console.error("❌ Player ID alma hatası:", error);
    return null;
  }
};

/**
 * External User ID ayarlar (Supabase user_id ile eşleştirmek için)
 * @param userId Supabase'deki kullanıcı ID'si
 */
export const setExternalUserId = (userId: string) => {
  if (Platform.OS === "web") {
    return;
  }

  try {
    OneSignal.login(userId);
    console.log("🔗 External User ID ayarlandı:", userId);
  } catch (error) {
    console.error("❌ External User ID hatası:", error);
  }
};

/**
 * External User ID'yi kaldırır (logout için)
 */
export const removeExternalUserId = () => {
  if (Platform.OS === "web") {
    return;
  }

  try {
    OneSignal.logout();
    console.log("🔓 External User ID kaldırıldı");
  } catch (error) {
    console.error("❌ External User ID kaldırma hatası:", error);
  }
};

/**
 * Bildirim açıldığında çalışacak handler'ı ayarlar
 * @param callback Bildirim açıldığında çağrılacak fonksiyon
 */
export const setNotificationOpenedHandler = (
  callback: (notificationId: string, data: Record<string, unknown>) => void
) => {
  if (Platform.OS === "web") {
    return;
  }

  OneSignal.Notifications.addEventListener("click", (event: NotificationClickEvent) => {
    console.log("📩 Bildirim açıldı:", event);
    const notificationId = event.notification.notificationId || "";
    const data = event.notification.additionalData || {};
    callback(notificationId, data as Record<string, unknown>);
  });
};

/**
 * Foreground'da bildirim geldiğinde çalışacak handler'ı ayarlar
 * @param callback Bildirim geldiğinde çağrılacak fonksiyon
 */
export const setNotificationWillShowHandler = (
  callback: (notification: {
    title: string;
    body: string;
    data: Record<string, unknown>;
  }) => void
) => {
  if (Platform.OS === "web") {
    return;
  }

  OneSignal.Notifications.addEventListener("foregroundWillDisplay", (event: NotificationWillDisplayEvent) => {
    console.log("📬 Foreground bildirim:", event);
    callback({
      title: event.notification.title || "",
      body: event.notification.body || "",
      data: (event.notification.additionalData || {}) as Record<string, unknown>,
    });
    // Bildirimi göster
    event.preventDefault();
    event.notification.display();
  });
};

/**
 * Tag ekler (segmentasyon için)
 * @param key Tag anahtarı
 * @param value Tag değeri
 */
export const addTag = (key: string, value: string) => {
  if (Platform.OS === "web") {
    return;
  }

  try {
    OneSignal.User.addTag(key, value);
    console.log(`🏷️ Tag eklendi: ${key}=${value}`);
  } catch (error) {
    console.error("❌ Tag ekleme hatası:", error);
  }
};

/**
 * Birden fazla tag ekler
 * @param tags Tag'ler objesi
 */
export const addTags = (tags: Record<string, string>) => {
  if (Platform.OS === "web") {
    return;
  }

  try {
    OneSignal.User.addTags(tags);
    console.log("🏷️ Tag'ler eklendi:", tags);
  } catch (error) {
    console.error("❌ Tag'ler ekleme hatası:", error);
  }
};

/**
 * Subscription değişikliklerini dinler
 * @param callback Player ID değiştiğinde çağrılacak fonksiyon
 */
export const addSubscriptionObserver = (
  callback: (playerId: string | null) => void
) => {
  if (Platform.OS === "web") {
    return;
  }

  OneSignal.User.pushSubscription.addEventListener("change", (subscription) => {
    console.log("🔄 Subscription değişti:", subscription);
    callback(subscription.current.id || null);
  });
};
