import { Search } from "lucide-react-native";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import Colors from "@/constants/colors";
import { PARTICIPANTS_DATA } from "@/mocks/participants";
import { Participant } from "@/types";

export default function ParticipantsScreen() {
  const [search, setSearch] = useState<string>("");

  const filteredParticipants = PARTICIPANTS_DATA.filter((participant) =>
    participant.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primaryDark, Colors.primary]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Katılımcılar</Text>
        </View>

        <View style={styles.searchContainer}>
          <Search color={Colors.gray} size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Katılımcı ara..."
            placeholderTextColor={Colors.gray}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredParticipants.map((participant) => (
            <ParticipantCard key={participant.id} participant={participant} />
          ))}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

function ParticipantCard({ participant }: { participant: Participant }) {
  return (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: participant.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{participant.name}</Text>
        <View style={styles.cardDetails}>
          <View style={styles.cardDetailItem}>
            <Text style={styles.cardDetailLabel}>Ülke:</Text>
            <Text style={styles.cardDetailValue}>{participant.country}</Text>
          </View>
          <View style={styles.cardDetailItem}>
            <Text style={styles.cardDetailLabel}>Uçak:</Text>
            <Text style={styles.cardDetailValue}>{participant.aircraft}</Text>
          </View>
        </View>
        <Text style={styles.cardBio}>{participant.bio}</Text>
      </View>
    </TouchableOpacity>
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  cardImage: {
    width: "100%",
    height: 200,
    backgroundColor: Colors.cardBgLight,
  },
  cardContent: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.white,
    marginBottom: 12,
  },
  cardDetails: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 12,
  },
  cardDetailItem: {
    flexDirection: "row",
    gap: 6,
  },
  cardDetailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.gray,
  },
  cardDetailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.white,
  },
  cardBio: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
