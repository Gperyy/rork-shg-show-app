import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";

interface AppleSignInButtonProps {
  onSuccess: (data: {
    appleUserId: string;
    email?: string;
    fullName?: {
      givenName?: string | null;
      familyName?: string | null;
    };
  }) => void;
  onError: (error: Error) => void;
}

export default function AppleSignInButton({
  onSuccess,
  onError,
}: AppleSignInButtonProps) {
  // Apple Sign In is only available on iOS
  if (Platform.OS !== "ios") {
    return null;
  }

  const handleAppleSignIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      console.log("🍎 Apple Sign In successful:", credential);

      // Extract the data from credential
      const appleUserId = credential.user;
      const email = credential.email;
      const fullName = credential.fullName;

      // Apple only provides email and fullName on the first sign-in
      // On subsequent sign-ins, only the user ID is provided

      onSuccess({
        appleUserId,
        email: email || "", // Pass empty string if email is missing
        fullName: fullName
          ? {
            givenName: fullName.givenName,
            familyName: fullName.familyName,
          }
          : undefined,
      });
    } catch (error: any) {
      console.error("❌ Apple Sign In error:", error);

      if (error.code === "ERR_CANCELED") {
        // User canceled the sign-in
        onError(new Error("Apple Sign In was canceled"));
      } else {
        onError(
          error instanceof Error ? error : new Error("Apple Sign In failed")
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={8}
        style={styles.button}
        onPress={handleAppleSignIn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 8,
  },
  button: {
    width: "100%",
    height: 50,
  },
});
