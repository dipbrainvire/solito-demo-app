import { useState, useEffect } from "react";
import {
    View,
    TextInput,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    KeyboardAvoidingView,
    StyleSheet,
    Platform,
    useWindowDimensions,
    SafeAreaView,
} from "react-native";
import { TextLink } from "solito/link";

export function RegisterScreen() {
    const { width } = useWindowDimensions();
    const [isClient, setIsClient] = useState(false);

    // Only enable client-side layout after hydration
    useEffect(() => {
        setIsClient(true);
    }, []);

    const isWebTwoColumn = isClient && width >= 600; // safe after hydration

    const [form, setForm] = useState<any>({
        fullName: "",
        email: "",
        phone: "",
        username: "",
        password: "",
        confirmPassword: "",
        age: "",
        address: "",
        city: "",
        state: "",
        country: "",
        zip: "",
    });

    const update = (key: string, value: string) => {
        setForm((p: any) => ({ ...p, [key]: value }));
    };

    const fields = [
        { key: "fullName", label: "Full Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone Number" },
        { key: "username", label: "Username" },
        { key: "password", label: "Password", secure: true },
        { key: "confirmPassword", label: "Confirm Password", secure: true },
        { key: "age", label: "Age" },
        { key: "address", label: "Address" },
        { key: "city", label: "City" },
        { key: "state", label: "State" },
        { key: "country", label: "Country" },
        { key: "zip", label: "Zip Code" },
    ];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#09090b" }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: 50, // IMPORTANT
                        alignItems: "center",
                        backgroundColor: "#000",
                    }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.container}>
                        <Image
                            source={{
                                uri: "https://trend.app/_next/static/media/Trend-logo.c61304a5.png",
                            }}
                            style={styles.logo}
                            resizeMode="contain"
                        />

                        <Text style={styles.subtitle}>Create your account</Text>

                        <View
                            style={[
                                styles.grid,
                                isWebTwoColumn && {
                                    flexDirection: "row",
                                    flexWrap: "wrap",
                                    justifyContent: "space-between",
                                },
                            ]}
                        >
                            {fields.map((item: any) => (
                                <View
                                    key={item.key}
                                    style={[styles.fieldWrapper, isWebTwoColumn && { width: "48%" }]}
                                >
                                    <TextInput
                                        placeholder={item.label}
                                        placeholderTextColor="#888"
                                        secureTextEntry={item.secure}
                                        value={form[item.key]}
                                        onChangeText={(value: any) => update(item.key, value)}
                                        style={[
                                            styles.input,
                                            {
                                                selectionColor: "#1e88ff",
                                                ...(Platform.OS === 'web' && {
                                                    outline: "none",
                                                    WebkitTextFillColor: "#fff",
                                                } as any),
                                            },
                                        ]}
                                    />
                                </View>
                            ))}
                        </View>

                        <TouchableOpacity style={styles.registerBtn}>
                            <Text style={styles.registerText}>Register</Text>
                        </TouchableOpacity>

                        <View style={styles.loginRow}>
                            <Text style={styles.loginText1}>Already have an account?</Text>
                            <TextLink href="/login">
                                <Text style={styles.loginText2}> Login</Text>
                            </TextLink>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: 50,
        alignItems: "center",
        backgroundColor: "#000",
        width: 750,
        maxWidth: "95%",
        marginLeft: "auto",
        marginRight: "auto",
    },
    logo: { width: 180, height: 60, marginBottom: 20 },
    subtitle: { color: "#ccc", fontSize: 18, fontWeight: "700", marginBottom: 25 },
    grid: { width: "100%", flexDirection: "column", marginBottom: 25 },
    fieldWrapper: { width: "100%", marginBottom: 15 },
    input: {
        width: "100%",
        backgroundColor: "#111", // black background
        borderColor: "#333",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 13,
        color: "#fff", // text color
        fontSize: 15,
    },


    registerBtn: {
        width: "100%",
        paddingVertical: 14,
        backgroundColor: "#1e88ff",
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 25,
    },
    registerText: { color: "#fff", fontSize: 17, fontWeight: "700" },
    loginRow: { flexDirection: "row", marginTop: 15 },
    loginText1: { color: "#aaa", fontSize: 14 },
    loginText2: { color: "#1e88ff", fontSize: 14, fontWeight: "700" },
});
