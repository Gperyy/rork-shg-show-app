import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Plane, User as UserIcon, Mail, Phone } from "lucide-react-native";
import { router } from "expo-router";

import Colors from "@/constants/colors";
import { useUser } from "@/contexts/UserContext";
import AppleSignInButton from "@/components/AppleSignInButton";

export default function UserRegistrationScreen() {
  const { saveUser, saveAppleUser, isSavingApple } = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleAppleSignInSuccess = async (data: {
    appleUserId: string;
    email?: string;
    fullName?: {
      givenName?: string | null;
      familyName?: string | null;
    };
  }) => {
    try {
      console.log("🍎 Processing Apple Sign In data:", data);

      // Call saveAppleUser from UserContext
      saveAppleUser(
        {
          appleUserId: data.appleUserId,
          email: data.email || "",
          fullName: data.fullName
            ? {
              givenName: data.fullName.givenName || undefined,
              familyName: data.fullName.familyName || undefined,
            }
            : undefined,
        },
        {
          onSuccess: () => {
            console.log("✅ Apple Sign In successful");
            router.replace("/(tabs)");
          },
          onError: (error: any) => {
            console.error("❌ Apple Sign In error:", error);
            Alert.alert(
              "Hata",
              error.message || "Apple ile giriş başarısız oldu. Lütfen tekrar deneyin."
            );
          },
        }
      );
    } catch (error: any) {
      console.error("❌ Apple Sign In error:", error);
      Alert.alert(
        "Hata",
        error.message || "Apple ile giriş başarısız oldu. Lütfen tekrar deneyin."
      );
    }
  };

  const handleAppleSignInError = (error: Error) => {
    console.error("❌ Apple Sign In error:", error);
    if (!error.message.includes("canceled")) {
      Alert.alert("Hata", "Apple ile giriş başarısız oldu. Lütfen tekrar deneyin.");
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert("Uyarı", "Lütfen adınızı ve soyadınızı girin.");
      return;
    }

    if (!email.trim()) {
      Alert.alert("Uyarı", "Lütfen e-posta adresinizi girin.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Uyarı", "Lütfen geçerli bir e-posta adresi girin.");
      return;
    }

    saveUser({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });


  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primaryDark, Colors.primary, Colors.cardBg]}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <View style={styles.content}>
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Plane color={Colors.white} size={40} />
              </View>
              <Text style={styles.logoText}>SHG Airshows</Text>
              <Text style={styles.year}>2026</Text>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.title}>Hoş Geldiniz!</Text>
              <Text style={styles.subtitle}>
                Devam etmek için lütfen bilgilerinizi girin
              </Text>

              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}>
                  <UserIcon color={Colors.accentLight} size={20} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Ad Soyad *"
                  placeholderTextColor={Colors.gray}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}>
                  <Mail color={Colors.accentLight} size={20} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="E-posta *"
                  placeholderTextColor={Colors.gray}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}>
                  <Phone color={Colors.accentLight} size={20} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Telefon (Opsiyonel)"
                  placeholderTextColor={Colors.gray}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>

              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Devam Et</Text>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>veya</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Apple Sign In Button */}
              {isSavingApple ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={Colors.accentLight} />
                  <Text style={styles.loadingText}>Apple ile giriş yapılıyor...</Text>
                </View>
              ) : (
                <AppleSignInButton
                  onSuccess={handleAppleSignInSuccess}
                  onError={handleAppleSignInError}
                />
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 48,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(37, 99, 235, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  logoText: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.white,
    marginBottom: 4,
  },
  year: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.accentLight,
  },
  formContainer: {
    gap: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: Colors.white,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(30, 58, 95, 0.6)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.white,
    paddingVertical: 14,
  },
  submitButton: {
    backgroundColor: Colors.accentLight,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.white,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(59, 130, 246, 0.3)",
  },
  dividerText: {
    color: Colors.textSecondary,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  loadingText: {
    color: Colors.textSecondary,
    marginTop: 12,
    fontSize: 14,
  },
});
