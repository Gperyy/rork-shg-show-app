import { Platform } from "react-native";
import type { OneSignal as OneSignalType, LogLevel as LogLevelType } from "react-native-onesignal";

const ONESIGNAL_APP_ID = process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID;

let OneSignal: typeof OneSignalType | null = null;
let LogLevel: typeof LogLevelType | null = null;

const getOneSignal = async () => {
    if (OneSignal) return { OneSignal, LogLevel };

    try {
        const module = await import("react-native-onesignal");
        OneSignal = module.OneSignal;
        LogLevel = module.LogLevel;
        return module;
    } catch (error) {
        console.error("❌ OneSignal import hatası:", error);
        return null;
    }
};

/**
 * OneSignal servisini başlatır
 * Uygulama başlatıldığında bir kere çağrılmalı
 */
export const initializeOneSignal = async () => {
    if (!ONESIGNAL_APP_ID) {
        console.warn("⚠️ EXPO_PUBLIC_ONESIGNAL_APP_ID tanımlanmamış");
        return;
    }

    const mod = await getOneSignal();
    if (!mod || !mod.OneSignal) return;

    // Debug modunda loglama (production'da kapatılmalı)
    if (__DEV__ && mod.LogLevel) {
        mod.OneSignal.Debug.setLogLevel(mod.LogLevel.Verbose);
    }

    // OneSignal'ı başlat
    mod.OneSignal.initialize(ONESIGNAL_APP_ID);

    console.log("✅ OneSignal başlatıldı:", ONESIGNAL_APP_ID);
};

/**
 * Push notification izni ister
 * @returns İzin verilip verilmediği
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
    const mod = await getOneSignal();
    if (!mod || !mod.OneSignal) return false;

    try {
        const granted = await mod.OneSignal.Notifications.requestPermission(true);
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
    const mod = await getOneSignal();
    if (!mod || !mod.OneSignal) return null;

    try {
        const subscriptionId = await mod.OneSignal.User.pushSubscription.getIdAsync();
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
export const setExternalUserId = async (userId: string) => {
    const mod = await getOneSignal();
    if (!mod || !mod.OneSignal) return;

    try {
        mod.OneSignal.login(userId);
        console.log("🔗 External User ID ayarlandı:", userId);
    } catch (error) {
        console.error("❌ External User ID hatası:", error);
    }
};

/**
 * External User ID'yi kaldırır (logout için)
 */
export const removeExternalUserId = async () => {
    const mod = await getOneSignal();
    if (!mod || !mod.OneSignal) return;

    try {
        mod.OneSignal.logout();
        console.log("🔓 External User ID kaldırıldı");
    } catch (error) {
        console.error("❌ External User ID kaldırma hatası:", error);
    }
};

/**
 * Bildirim açıldığında çalışacak handler'ı ayarlar
 * @param callback Bildirim açıldığında çağrılacak fonksiyon
 */
export const setNotificationOpenedHandler = async (
    callback: (notificationId: string, data: Record<string, unknown>) => void
) => {
    const mod = await getOneSignal();
    if (!mod || !mod.OneSignal) return;

    mod.OneSignal.Notifications.addEventListener("click", (event: any) => {
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
export const setNotificationWillShowHandler = async (
    callback: (notification: {
        title: string;
        body: string;
        data: Record<string, unknown>;
    }) => void
) => {
    const mod = await getOneSignal();
    if (!mod || !mod.OneSignal) return;

    mod.OneSignal.Notifications.addEventListener("foregroundWillDisplay", (event: any) => {
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
export const addTag = async (key: string, value: string) => {
    const mod = await getOneSignal();
    if (!mod || !mod.OneSignal) return;

    try {
        mod.OneSignal.User.addTag(key, value);
        console.log(`🏷️ Tag eklendi: ${key}=${value}`);
    } catch (error) {
        console.error("❌ Tag ekleme hatası:", error);
    }
};

/**
 * Birden fazla tag ekler
 * @param tags Tag'ler objesi
 */
export const addTags = async (tags: Record<string, string>) => {
    const mod = await getOneSignal();
    if (!mod || !mod.OneSignal) return;

    try {
        mod.OneSignal.User.addTags(tags);
        console.log("🏷️ Tag'ler eklendi:", tags);
    } catch (error) {
        console.error("❌ Tag'ler ekleme hatası:", error);
    }
};

/**
 * Subscription değişikliklerini dinler
 * @param callback Player ID değiştiğinde çağrılacak fonksiyon
 */
export const addSubscriptionObserver = async (
    callback: (playerId: string | null) => void
) => {
    const mod = await getOneSignal();
    if (!mod || !mod.OneSignal) return;

    mod.OneSignal.User.pushSubscription.addEventListener("change", (subscription: any) => {
        console.log("🔄 Subscription değişti:", subscription);
        callback(subscription.current.id || null);
    });
};
