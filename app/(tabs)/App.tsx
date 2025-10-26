import React, { useMemo, useState } from "react";
import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { WebView } from "react-native-webview"; // iOS/Android
import InspectionFlow from "../../components/screens/inspection-flow"; // ✅ correct relative path

// URL de tu webhook n8n por plataforma
const N8N_WEBHOOK = Platform.select({
  android: "http://10.0.2.2:5678/webhook/3a2153a3-c897-4171-bf40-7ed4a255a30b/chat", // emulador Android
  ios: "http://localhost:5678/webhook/3a2153a3-c897-4171-bf40-7ed4a255a30b/chat",     // simulador iOS
  default: "http://localhost:5678/webhook/3a2153a3-c897-4171-bf40-7ed4a255a30b/chat",  // web/escritorio
});

// 🔹 Pantalla de Chat (WebView nativo / iframe web)
function ChatScreen({ onBack }: { onBack: () => void }) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css"/>
        <style>
          html, body, #n8n-chat { 
            height: 100%; 
            margin: 0; 
            background: #0b0b0b; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          #n8n-chat {
            display: flex;
            flex-direction: column;
          }
        </style>
      </head>
      <body>
        <div id="n8n-chat"></div>
        
        <script type="module">
          import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';

          createChat({
            webhookUrl: 'http://localhost:5678/webhook/03ef33b6-731d-4583-822b-d9f9d92a1c12/chat',
            webhookConfig: {
              method: 'POST',
              headers: {}
            },
            target: '#n8n-chat',
            mode: 'window',
            chatInputKey: 'chatInput',
            chatSessionKey: 'sessionId',
            loadPreviousSession: true,
            metadata: {},
            showWelcomeScreen: false,
            defaultLanguage: 'en',
            initialMessages: [
              'Hi how are you?👍 ',
              'My name is john. How can I assist you today?'
            ],
            i18n: {
              en: {
                title: 'New Chat',
                subtitle: "Start a chat. We're here to help you 24/7.",
                footer: '',
                getStarted: 'New Conversation',
                inputPlaceholder: 'Type your question..',
              },
            },
            enableStreaming: false,
            theme: {
              primary: '#0078d4',
              background: '#0b0b0b',
              chatBackground: '#1a1a1a',
              botMessageBackground: '#2d2d2d',
              userMessageBackground: '#0078d4',
              text: '#ffffff'
              
            }
          });
        </script>
      </body>
    </html>
  `;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0b0b0b" }}>
      <View style={styles.chatHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.chatTitle}>Chatbot</Text>
        <View style={{ width: 70 }} />
      </View>

      {Platform.OS === "web" ? (
        // —— Fallback Web con iframe —— //
        <div style={{ flex: 1, height: "calc(100% - 48px)" }}>
          {/* @ts-ignore: elemento DOM en RN Web */}
          <iframe
            style={{ width: "100%", height: "100%", border: "none", display: "block" }}
            srcDoc={html}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>
      ) : (
        // —— iOS / Android con WebView —— //
        <WebView
          source={{ html }}
          startInLoadingState
          javaScriptEnabled
          domStorageEnabled
          originWhitelist={["*"]}
          style={{ flex: 1 }}
        />
      )}
    </SafeAreaView>
  );
}

export default function App() {
  const [selected, setSelected] = useState<string>("");
  const [screen, setScreen] = useState<"home" | "inspection" | "chat">("home"); // ⬅️ incluye "chat"

  const data = [
    { key: "Air France", value: "Air France" },
    { key: "British Airways", value: "British Airways" },
    { key: "Cathay Pacific", value: "Cathay Pacific" },
    { key: "Emirates", value: "Emirates" },
    { key: "Etihad Airways", value: "Etihad Airways" },
    { key: "Lufthansa", value: "Lufthansa" },
    { key: "Qatar Airways", value: "Qatar Airways" },
    { key: "Singapore Airlines", value: "Singapore Airlines" },
    { key: "Swiss Intl Air Lines", value: "Swiss Intl Air Lines" },
    { key: "Turkish Airlines", value: "Turkish Airlines" },
  ];

  // ✅ Correct image paths — two levels up from app/(tabs)/
  const imgMap = useMemo(() => {
    const images = [
      { key: "Air France", src: require("../../assets/images/air-france.png") },
      { key: "British Airways", src: require("../../assets/images/british-airways.png") },
      { key: "Cathay Pacific", src: require("../../assets/images/cathay-pacific.png") },
      { key: "Emirates", src: require("../../assets/images/emirates.png") },
      { key: "Etihad Airways", src: require("../../assets/images/etihad-airways.png") },
      { key: "Lufthansa", src: require("../../assets/images/lufthansa.png") },
      { key: "Qatar Airways", src: require("../../assets/images/qatar-airways.png") },
      { key: "Singapore Airlines", src: require("../../assets/images/singapore-airlines.png") },
      { key: "Swiss Intl Air Lines", src: require("../../assets/images/swiss-international.png") },
      { key: "Turkish Airlines", src: require("../../assets/images/turkish-airlines.png") },
    ];
    return Object.fromEntries(images.map((i) => [i.key, i.src]));
  }, []);

  const selectedImg = selected ? imgMap[selected] : undefined;

  if (screen === "inspection") {
    return (
      <InspectionFlow
        selectedAirline={selected}
        onReturnHome={() => {
          setScreen("home");
          setSelected("");
        }}
      />
    );
  }

  if (screen === "chat") {
    return <ChatScreen onBack={() => setScreen("home")} />;
  }

  // HOME
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>✈️ Select Airline</Text>

          <View style={styles.row}>
            <SelectList
              data={data}
              save="value"
              setSelected={(val: string) => setSelected(val)}
              placeholder="Choose an airline"
              searchPlaceholder="Search..."
              boxStyles={styles.box}
              dropdownStyles={styles.dropdown}
            />

            {selectedImg && (
              <Image source={selectedImg} style={styles.logoInline} resizeMode="contain" />
            )}
          </View>

          <Text style={styles.selectedText}>
            Selected: {selected || "None"}
          </Text>

          <TouchableOpacity
            style={[styles.btn, !selected && styles.disabledBtn]}
            disabled={!selected}
            onPress={() => setScreen("inspection")}
          >
            <Text style={styles.btnText}>
              {selected ? "Start Inspection" : "Select an Airline"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 🔹 Botón flotante para abrir el Chat */}
      <TouchableOpacity style={styles.fab} onPress={() => setScreen("chat")}>
        <Text style={styles.fabText}>Chat</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f2f1" },
  scrollContainer: { flexGrow: 1, justifyContent: "center" },
  content: { paddingHorizontal: 20, alignItems: "center" },
  title: { fontSize: 22, fontWeight: "700", color: "#201f1e", marginBottom: 20 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    width: "100%",
  },
  logoInline: { width: 90, height: 60 },
  box: { borderRadius: 12, flex: 1 },
  dropdown: { borderRadius: 12, marginTop: 8 },
  selectedText: { marginTop: 20, fontSize: 16, color: "#201f1e" },
  btn: {
    backgroundColor: "#0078d4",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginTop: 40,
  },
  disabledBtn: { backgroundColor: "#a6a6a6" },
  btnText: { color: "#fff", fontWeight: "600", fontSize: 16 },

  // 🔹 Chat header
  chatHeader: {
    height: 48,
    backgroundColor: "#0b0b0b",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#1f2937",
    borderRadius: 8,
  },
  backBtnText: { color: "#fff", fontWeight: "600" },
  chatTitle: { color: "#fff", fontSize: 16, fontWeight: "700" },

  // 🔹 FAB
  fab: {
    position: "absolute",
    bottom: 24,
    right: 20,
    backgroundColor: "#111827",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  fabText: { color: "#fff", fontWeight: "700" },
});