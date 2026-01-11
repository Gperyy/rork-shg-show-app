import { CreditCard, MapPin, Calendar } from "lucide-react-native";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import Colors from "@/constants/colors";
import { useUser } from "@/contexts/UserContext";

interface TicketType {
  id: string;
  name: string;
  price: string;
  features: string[];
  popular?: boolean;
}

const TICKET_TYPES: TicketType[] = [
  {
    id: "1",
    name: "Genel Giriş",
    price: "₺250",
    features: ["Genel izleyici alanı", "1 Günlük giriş", "Etkinlik broşürü"],
  },
  {
    id: "2",
    name: "VIP",
    price: "₺850",
    features: [
      "VIP izleyici alanı",
      "2 Günlük giriş",
      "Ücretsiz park",
      "Kokteyl ikramı",
      "Pilotlarla tanışma fırsatı",
    ],
    popular: true,
  },
  {
    id: "3",
    name: "Premium",
    price: "₺1.500",
    features: [
      "Premium izleyici alanı",
      "2 Günlük giriş",
      "Özel park alanı",
      "Tüm ikramlar dahil",
      "Backstage turu",
      "Özel hediye paketi",
    ],
  },
];

export default function TicketsScreen() {
  const { user } = useUser();
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  const handlePurchase = () => {
    if (!selectedTicket) {
      Alert.alert("Uyarı", "Lütfen bir bilet türü seçin.");
      return;
    }

    const ticket = TICKET_TYPES.find((t) => t.id === selectedTicket);
    Alert.alert(
      "Başarılı! 🎉",
      `${ticket?.name} biletiniz rezerve edildi.\n\nBilgileriniz:\n${user?.name}\n${user?.email}${user?.phone ? `\n${user.phone}` : ""}\n\nQR kodunuz e-posta adresinize gönderilecektir.`
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primaryDark, Colors.primary]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Biletler</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.eventInfo}>
            <View style={styles.eventInfoRow}>
              <Calendar color={Colors.accentLight} size={20} />
              <Text style={styles.eventInfoText}>19-20 Eylül 2026</Text>
            </View>
            <View style={styles.eventInfoRow}>
              <MapPin color={Colors.accentLight} size={20} />
              <Text style={styles.eventInfoText}>Sivrihisar, Eskişehir</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Bilet Türleri</Text>

          {TICKET_TYPES.map((ticket) => (
            <TouchableOpacity
              key={ticket.id}
              style={[
                styles.ticketCard,
                selectedTicket === ticket.id && styles.ticketCardSelected,
              ]}
              onPress={() => setSelectedTicket(ticket.id)}
            >
              {ticket.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>POPÜLER</Text>
                </View>
              )}
              <View style={styles.ticketHeader}>
                <Text style={styles.ticketName}>{ticket.name}</Text>
                <Text style={styles.ticketPrice}>{ticket.price}</Text>
              </View>
              <View style={styles.ticketFeatures}>
                {ticket.features.map((feature, index) => (
                  <View key={index} style={styles.featureRow}>
                    <Text style={styles.featureBullet}>•</Text>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.purchaseButton} onPress={handlePurchase}>
            <CreditCard color={Colors.white} size={24} />
            <Text style={styles.purchaseButtonText}>Satın Al</Text>
          </TouchableOpacity>
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
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  eventInfo: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    gap: 12,
  },
  eventInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  eventInfoText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.white,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.white,
    marginBottom: 16,
  },
  ticketCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.1)",
    position: "relative",
  },
  ticketCardSelected: {
    borderColor: Colors.accentLight,
    backgroundColor: "rgba(37, 99, 235, 0.1)",
  },
  popularBadge: {
    position: "absolute",
    top: -10,
    right: 20,
    backgroundColor: Colors.live,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  popularText: {
    fontSize: 11,
    fontWeight: "800",
    color: Colors.white,
    letterSpacing: 1,
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  ticketName: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.white,
  },
  ticketPrice: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.accentLight,
  },
  ticketFeatures: {
    gap: 8,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  featureBullet: {
    fontSize: 16,
    color: Colors.accentLight,
    marginTop: 2,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  purchaseButton: {
    marginTop: 8,
    backgroundColor: Colors.accentLight,
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  purchaseButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.white,
  },
});
