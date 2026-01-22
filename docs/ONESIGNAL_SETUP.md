# OneSignal Push Notification Kurulum Rehberi

Bu rehber, SHG Airshow 2026 uygulaması için OneSignal push notification sisteminin kurulumunu açıklar.

## 1. OneSignal Hesabı Oluşturma

1. [OneSignal](https://onesignal.com) adresine gidin
2. Ücretsiz hesap oluşturun
3. "Add App" butonuna tıklayın
4. App adı olarak "SHG Airshow 2026" yazın
5. Platform olarak "Apple iOS" ve "Google Android" seçin

## 2. Android Kurulumu (Firebase)

### Firebase Console'da:
1. [Firebase Console](https://console.firebase.google.com) adresine gidin
2. Yeni proje oluşturun veya mevcut projeyi seçin
3. Project Settings > Cloud Messaging sekmesine gidin
4. "Server Key" ve "Sender ID" değerlerini kopyalayın

### OneSignal'da:
1. Settings > Platforms > Google Android
2. Firebase Server Key'i yapıştırın
3. Kaydedin

## 3. iOS Kurulumu (APNs)

### Apple Developer Portal'da:
1. [Apple Developer](https://developer.apple.com) adresine gidin
2. Certificates, Identifiers & Profiles > Keys
3. Yeni key oluşturun ve "Apple Push Notifications service (APNs)" seçin
4. Key'i indirin (.p8 dosyası)

### OneSignal'da:
1. Settings > Platforms > Apple iOS
2. .p8 dosyasını yükleyin
3. Key ID ve Team ID'yi girin
4. Bundle ID'yi girin: `app.rork.shg-show-app`

## 4. Environment Variables

`.env` dosyanıza aşağıdaki değişkeni ekleyin:

```env
EXPO_PUBLIC_ONESIGNAL_APP_ID=your-onesignal-app-id-here
```

OneSignal App ID'yi şu adresten alabilirsiniz:
OneSignal Dashboard > Settings > Keys & IDs

## 5. Supabase Migration

Supabase Dashboard'da SQL Editor'e gidin ve aşağıdaki migration'ı çalıştırın:

```sql
-- supabase/migration_add_onesignal.sql dosyasının içeriğini kopyalayın
```

## 6. Test Etme

### Development Build Oluşturma
OneSignal, Expo Go ile çalışmaz. Development build gerektirir:

```bash
# iOS için
npx expo run:ios

# Android için
npx expo run:android
```

### Test Bildirimi Gönderme
1. OneSignal Dashboard > Messages > New Push
2. Audience: "All Users" seçin
3. Başlık ve mesaj yazın
4. "Send" butonuna tıklayın

## 7. Segmentasyon

OneSignal Dashboard'da özel segmentler oluşturabilirsiniz:

### Pasif Kullanıcılar
- Filter: Last Session > 14 days
- Filter: Subscribed = Yes

### Yeni Kullanıcılar
- Filter: First Session < 7 days

### Lokasyon Bazlı
- Filter: Country = Turkey
- Filter: City = Istanbul (veya diğer şehirler)

## 8. Kampanya Örnekleri

### Flash Sale Bildirimi
```javascript
// OneSignal API ile programatik gönderim
const notification = {
  app_id: "YOUR_APP_ID",
  included_segments: ["Active Users"],
  headings: { tr: "⚡ Flash İndirim!" },
  contents: { tr: "SHG Airshow biletlerinde %20 indirim. Son 2 saat!" },
  data: { campaign: "flash_sale_jan" }
};
```

### Zamanlı Bildirim
```javascript
const notification = {
  app_id: "YOUR_APP_ID",
  included_segments: ["All"],
  headings: { tr: "1 Hafta Kaldı!" },
  contents: { tr: "SHG Airshow 2026 için geri sayım başladı!" },
  send_after: "2026-09-12 10:00:00 GMT+0300"
};
```

## 9. Analytics

### Funnel Görüntüleme
```sql
-- Supabase'de kampanya performansı
SELECT * FROM get_campaign_stats('flash_sale_jan');
```

### Pasif Kullanıcılar
```sql
-- 14+ gün açmamış kullanıcılar
SELECT * FROM get_inactive_users(14);
```

## 10. Sorun Giderme

### Bildirim Gelmiyor
1. Device token'ın kaydedildiğinden emin olun
2. OneSignal Dashboard'da "All Users" listesini kontrol edin
3. iOS'ta bildirim izinlerinin verildiğinden emin olun

### Expo Go'da Çalışmıyor
OneSignal, native modüller gerektirdiği için Expo Go ile çalışmaz.
Development build (`expo run:ios` veya `expo run:android`) kullanın.

### Player ID Null
- Bildirim izni verilmemiş olabilir
- OneSignal App ID yanlış olabilir
- Development build yerine Expo Go kullanılıyor olabilir

## Yararlı Linkler

- [OneSignal React Native SDK Docs](https://documentation.onesignal.com/docs/react-native-sdk-setup)
- [OneSignal Expo Plugin](https://www.npmjs.com/package/onesignal-expo-plugin)
- [Firebase Console](https://console.firebase.google.com)
- [Apple Developer Portal](https://developer.apple.com)
