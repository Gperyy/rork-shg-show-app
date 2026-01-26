/**
 * OneSignal Web Stubs
 * Web/Server ortamında OneSignal çalışmayacağı için boş fonksiyonlar
 */

export const initializeOneSignal = async () => {
    console.log("ℹ️ OneSignal not supported on web/server");
};

export const requestNotificationPermission = async (): Promise<boolean> => {
    return false;
};

export const getOneSignalPlayerId = async (): Promise<string | null> => {
    return null;
};

export const setExternalUserId = async (userId: string) => { };

export const removeExternalUserId = async () => { };

export const setNotificationOpenedHandler = async (
    callback: (notificationId: string, data: Record<string, unknown>) => void
) => { };

export const setNotificationWillShowHandler = async (
    callback: (notification: {
        title: string;
        body: string;
        data: Record<string, unknown>;
    }) => void
) => { };

export const addTag = async (key: string, value: string) => { };

export const addTags = async (tags: Record<string, string>) => { };

export const addSubscriptionObserver = async (
    callback: (playerId: string | null) => void
) => { };
