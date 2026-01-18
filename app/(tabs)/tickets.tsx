import { CreditCard, MapPin, Calendar, Check } from "lucide-react-native";
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
  features: string[];
}

const TICKET_TYPES: TicketType[] = [
  {
    id: "1",
    name: "GÜNLÜK BİLET",
    features: [
      "Gösteri alanına tam gün erişim",
      "Stant alanlarını ziyaret etme fırsatı",
      "Yiyecek ve içecek alanlarından faydalanma imkanı",
    ],
  },
  {
    id: "2",
    name: "VIP BİLET",
    features: [
      "Özel Giriş",
      "Güneşlikli veranda alanında ve/veya klimalı salonda VIP oturma alanı",
      "Salonda bulunan VIP tuvaletlerine erişim imkanı",
      "VIP salonuna ait özel mutfaktan sunulan Türk mutfağı seçkisi",
      "Gün boyu sunulan ücretsiz yiyecek ve içecekler ikramı",
      "VIP otopark",
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
          <Text style={styles.headerSubtitle}>SHG Airshow 2026</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Event Info Card */}
          <View style={styles.eventInfoCard}>
            <View style={styles.eventInfoRow}>
              <View style={styles.iconContainer}>
                <Calendar color={Colors.live} size={18} />
              </View>
              <Text style={styles.eventInfoText}>19-20 Eylül 2026</Text>
            </View>
            <View style={styles.eventInfoRow}>
              <View style={styles.iconContainer}>
                <MapPin color={Colors.live} size={18} />
              </View>
              <Text style={styles.eventInfoText}>Sivrihisar, Eskişehir</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Bilet Türünü Seçin</Text>

          {TICKET_TYPES.map((ticket) => (
            <TouchableOpacity
              key={ticket.id}
              style={[
                styles.ticketCard,
                selectedTicket === ticket.id && styles.ticketCardSelected,
              ]}
              onPress={() => setSelectedTicket(ticket.id)}
              activeOpacity={0.8}
            >
              {/* Selection Indicator */}
              <View style={[
                styles.selectionIndicator,
                selectedTicket === ticket.id && styles.selectionIndicatorActive,
              ]}>
                {selectedTicket === ticket.id && (
                  <Check color={Colors.white} size={14} />
                )}
              </View>

              <View style={styles.ticketHeader}>
                <Text style={styles.ticketName}>{ticket.name}</Text>
              </View>

              <View style={styles.ticketFeatures}>
                {ticket.features.map((feature, index) => (
                  <View key={index} style={styles.featureRow}>
                    <View style={styles.featureDot} />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ))}

          {/* Purchase Button */}
          <TouchableOpacity
            style={[
              styles.purchaseButton,
              !selectedTicket && styles.purchaseButtonDisabled,
            ]}
            onPress={handlePurchase}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={selectedTicket ? [Colors.live, '#DC2626'] : ['#475569', '#334155']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.purchaseButtonGradient}
            >
              <CreditCard color={Colors.white} size={22} />
              <Text style={styles.purchaseButtonText}>Biletini Al</Text>
            </LinearGradient>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  eventInfoCard: {
    flexDirection: "column",
    backgroundColor: "rgba(30, 58, 95, 0.5)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
    gap: 12,
  },
  eventInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  eventInfoText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.white,
    marginBottom: 16,
  },
  ticketCard: {
    backgroundColor: "rgba(30, 58, 95, 0.6)",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.08)",
    position: "relative",
  },
  ticketCardSelected: {
    borderColor: Colors.live,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
  selectionIndicator: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  selectionIndicatorActive: {
    backgroundColor: Colors.live,
    borderColor: Colors.live,
  },
  ticketHeader: {
    marginBottom: 16,
    paddingRight: 40,
  },
  ticketName: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.white,
    letterSpacing: 0.5,
  },
  ticketFeatures: {
    gap: 10,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.live,
    marginTop: 7,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  purchaseButton: {
    marginTop: 8,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: Colors.live,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  purchaseButtonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  purchaseButtonGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 18,
    gap: 12,
  },
  purchaseButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.white,
  },
});
