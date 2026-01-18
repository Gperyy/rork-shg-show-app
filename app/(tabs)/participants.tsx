import { Search, Users, ExternalLink, ChevronDown, ChevronUp } from "lucide-react-native";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import Colors from "@/constants/colors";
import { PARTICIPANTS_DATA, ParticipantData } from "@/mocks/participants";

export default function ParticipantsScreen() {
  const [search, setSearch] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredParticipants = PARTICIPANTS_DATA.filter((participant) =>
    participant.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primaryDark, Colors.primary]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Katılımcılar</Text>
          <Text style={styles.headerSubtitle}>
            {PARTICIPANTS_DATA.length} katılımcı
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchIconContainer}>
            <Search color={Colors.textSecondary} size={18} />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Katılımcı ara..."
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
          {filteredParticipants.length === 0 ? (
            <View style={styles.emptyState}>
              <Users color={Colors.textSecondary} size={48} />
              <Text style={styles.emptyStateText}>Sonuç bulunamadı</Text>
            </View>
          ) : (
            filteredParticipants.map((participant) => (
              <ParticipantCard
                key={participant.id}
                participant={participant}
                isExpanded={expandedId === participant.id}
                onToggle={() => handleToggleExpand(participant.id)}
              />
            ))
          )}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

interface ParticipantCardProps {
  participant: ParticipantData;
  isExpanded: boolean;
  onToggle: () => void;
}

function ParticipantCard({ participant, isExpanded, onToggle }: ParticipantCardProps) {
  const handleOpenUrl = () => {
    if (participant.url) {
      Linking.openURL(participant.url);
    }
  };

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onToggle}>
      <View style={styles.cardImageContainer}>
        <Image source={participant.image} style={styles.cardImage} />
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{participant.name}</Text>
          {isExpanded ? (
            <ChevronUp color={Colors.live} size={20} />
          ) : (
            <ChevronDown color={Colors.textSecondary} size={20} />
          )}
        </View>
        <Text style={[styles.cardBio, isExpanded && styles.cardBioExpanded]} numberOfLines={isExpanded ? undefined : 3}>
          {participant.bio}
        </Text>
        {isExpanded && participant.url && (
          <TouchableOpacity
            style={styles.detailButton}
            onPress={handleOpenUrl}
            activeOpacity={0.7}
          >
            <ExternalLink color={Colors.white} size={16} />
            <Text style={styles.detailButtonText}>Detaylı Bilgi</Text>
          </TouchableOpacity>
        )}
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
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  card: {
    backgroundColor: "rgba(30, 58, 95, 0.6)",
    borderRadius: 20,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  cardImageContainer: {
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: 200,
    backgroundColor: Colors.cardBg,
  },
  cardImageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  cardContent: {
    padding: 20,
    paddingTop: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.white,
    letterSpacing: 0.3,
    flex: 1,
  },
  cardBio: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
  },
  cardBioExpanded: {
    marginBottom: 16,
  },
  detailButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.live,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  detailButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.white,
  },
});
