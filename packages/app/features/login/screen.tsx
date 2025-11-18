import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
} from "react-native";
import { TextLink } from "solito/link";
import { useRouter } from "solito/navigation";

export function LoginScreen() {
  const router = useRouter()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: "#000" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          {/* LOGO */}
          <Image
            source={{
              uri: "https://trend.app/_next/static/media/Trend-logo.c61304a5.png",
            }}
            style={styles.logo}
            resizeMode="contain"
          />

          {/* SUBTITLE */}
          <Text style={styles.subtitle}>Login to continue</Text>

          {/* EMAIL */}
          <TextInput
            placeholder="Email address"
            placeholderTextColor="#888"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />

          {/* PASSWORD */}
          <TextInput
            placeholder="Password"
            placeholderTextColor="#888"
            style={[styles.input]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />

          {/* <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={{ paddingHorizontal: 12 }}
            >
              <Text style={{ color: "#ccc", fontSize: 18 }}>
                {showPassword ? "👁️" : "🙈"}
              </Text>
            </TouchableOpacity> */}

          {/* FORGOT PASSWORD */}
          <TouchableOpacity style={styles.forgotWrapper}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          {/* LOGIN BUTTON */}
          <TouchableOpacity style={styles.loginBtn} onPress={() => router.push('/home')}>
              <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>

          {/* OR */}
          <Text style={styles.orText}>Or login with</Text>

          {/* SOCIAL BUTTONS */}

          <TouchableOpacity style={styles.socialBtn}>
            <Text style={styles.socialText}>Login with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialBtn}>
            <Text style={styles.socialText}>Login with Facebook</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialBtn}>
            <Text style={styles.socialText}>Login with Instagram</Text>
          </TouchableOpacity>

          {/* SIGN UP LINK */}
          {/* SIGN UP LINK */}
          <View style={styles.signupRow}>
            <Text style={styles.signupText1}>Don’t have an account?</Text>
            <TextLink href="/register">
              <Text style={styles.signupText2}>Sign up</Text>
            </TextLink>
          </View>


        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 50,
    alignItems: "center",
    backgroundColor: "#000",
    flexGrow: 1,
    width: 600,
    margin: 'auto',
    maxWidth: '95%',
  },

  logo: {
    width: 180,
    height: 60,
    alignSelf: "center",
    marginBottom: 20,
  },

  subtitle: {
    color: "#ccc",
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 30,
  },

  input: {
    width: "100%",
    backgroundColor: "#111",
    borderColor: "#333",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 13,
    color: "#fff",
    marginBottom: 15,
    fontSize: 15,
  },

  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#111",
    borderColor: "#333",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },

  forgotWrapper: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 20,
  },

  forgotText: {
    color: "#ccc",
    fontSize: 13,
  },

  loginBtn: {
    width: "100%",
    paddingVertical: 14,
    backgroundColor: "#1e88ff",
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 25,
  },

  loginText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    textDecorationLine: "none",
  },

  orText: {
    color: "#777",
    marginBottom: 15,
  },

  socialBtn: {
    width: "100%",
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    justifyContent: "center",
  },

  socialIcon: {
    fontSize: 22,
    marginLeft: 10,
  },

  socialText: {
    marginLeft: 15,
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
  },

  signupRow: {
    flexDirection: "row",
    marginTop: 25,
  },

  signupText1: {
    color: "#aaa",
    fontSize: 14,
    marginRight: 5,
  },

  signupText2: {
    color: "#1e88ff",
    fontSize: 14,
    fontWeight: "700",
  },
});
