import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Plane } from "lucide-react-native";

import Colors from "@/constants/colors";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Sayfa Bulunamadı" }} />
      <View style={styles.container}>
        <Plane color={Colors.gray} size={64} />
        <Text style={styles.title}>Sayfa Bulunamadı</Text>
        <Text style={styles.message}>Aradığınız sayfa mevcut değil.</Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Ana Sayfaya Dön</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: Colors.primaryDark,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.white,
  },
  message: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
    paddingHorizontal: 24,
    backgroundColor: Colors.accentLight,
    borderRadius: 12,
  },
  linkText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.white,
  },
});
