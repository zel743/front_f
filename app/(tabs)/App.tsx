import { TabTitle } from "@/components/TabTitle";
import React, { useMemo, useState } from "react";
import {
  Image,
  Platform,
  SafeAreaView,
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
  android:
    "http://10.0.2.2:5678/webhook/3a2153a3-c897-4171-bf40-7ed4a255a30b/chat", // emulador Android
  ios: "http://localhost:5678/webhook/3a2153a3-c897-4171-bf40-7ed4a255a30b/chat", // simulador iOS
  default:
    "http://localhost:5678/webhook/3a2153a3-c897-4171-bf40-7ed4a255a30b/chat", // web/escritorio
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
      <View>
        <TouchableOpacity onPress={onBack}>
          <Text>← Volver</Text>
        </TouchableOpacity>
        <Text>Chatbot</Text>
        <View style={{ width: 70 }} />
      </View>

      {Platform.OS === "web" ? (
        // —— Fallback Web con iframe —— //
        <div style={{ flex: 1, height: "calc(100% - 48px)" }}>
          {/* @ts-ignore: elemento DOM en RN Web */}
          <iframe
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              display: "block",
            }}
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
      {
        key: "British Airways",
        src: require("../../assets/images/british-airways.png"),
      },
      {
        key: "Cathay Pacific",
        src: require("../../assets/images/cathay-pacific.png"),
      },
      { key: "Emirates", src: require("../../assets/images/emirates.png") },
      {
        key: "Etihad Airways",
        src: require("../../assets/images/etihad-airways.png"),
      },
      { key: "Lufthansa", src: require("../../assets/images/lufthansa.png") },
      {
        key: "Qatar Airways",
        src: require("../../assets/images/qatar-airways.png"),
      },
      {
        key: "Singapore Airlines",
        src: require("../../assets/images/singapore-airlines.png"),
      },
      {
        key: "Swiss Intl Air Lines",
        src: require("../../assets/images/swiss-international.png"),
      },
      {
        key: "Turkish Airlines",
        src: require("../../assets/images/turkish-airlines.png"),
      },
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
    <SafeAreaView style={styles.layout}>
      <main style={styles.container}>
        <TabTitle title="Select Airline" subtitle="To generate a report" />

        <div style={styles.imageContainer}>
          <SelectList
            data={data}
            save="value"
            setSelected={(val: string) => setSelected(val)}
            placeholder="Press to select airline"
            searchPlaceholder="Search..."
          />

          {selectedImg && (
            <Image
              source={selectedImg}
              style={styles.airlineImage}
              resizeMode="contain"
            />
          )}
        </div>

        <TouchableOpacity
          disabled={!selected}
          onPress={() => setScreen("inspection")}
        >
          <Text style={styles.btnText}>
            {selected ? "Start Inspection" : "Fisrt select an airline"}
          </Text>
        </TouchableOpacity>
      </main>

      <TouchableOpacity style={styles.btnIa} onPress={() => setScreen("chat")}>
        <Text style={styles.btnText}>Open IA Chat</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  layout: {
    paddingLeft: 20,
    paddingRight: 20,
    width: "100%",
  },
  container: {
    marginTop: "40%",
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  imageContainer: {
    display: "flex",
    flexDirection: "column",
  },
  airlineImage: {
    aspectRatio: 1,
    height: "auto",
    maxWidth: "50%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  btnText: {
    backgroundColor: "#00132C",
    color: "#FFFFFF",
    fontWeight: "bold",
    padding: 15,
    borderRadius: 10,
    textAlign: "center",
  },
  btnIa: {
    position: "fixed",
    bottom: 20,
    right: 20,
  },
});
