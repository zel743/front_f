import React, { useMemo, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import InspectionFlow from "../../components/screens/inspection-flow"; // ✅ correct relative path

export default function App() {
  const [selected, setSelected] = useState<string>("");
  const [screen, setScreen] = useState<"home" | "inspection">("home");

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

  // ✅ Pass airline + return callback to InspectionFlow
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
});
