import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import BarcodeScanner from "../../components/ui/barcode-scanner";

export default function HomeScreen() {
  const [selected, setSelected] = React.useState("");

  const data = [
    { key: "1", value: "Air France" },
    { key: "2", value: "British Airways" },
    { key: "3", value: "Cathay Pacific" },
    { key: "4", value: "Emirates" },
    { key: "5", value: "Etihad Airways" },
    { key: "6", value: "Lufthansa" },
    { key: "7", value: "Qatar Airways" },
    { key: "8", value: "Singapore Airlines" },
    { key: "9", value: "Swiss Intl Air Lines" },
    { key: "10", value: "Turkish Airlines" },
  ];

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Select Airline</Text>
        <SelectList
          setSelected={(val: string) => setSelected(val)}
          data={data}
          save="value"
          boxStyles={styles.selectBox}
          dropdownStyles={styles.dropdown}
        />

        <Text style={styles.selectedText}>
          Selected: {selected || "None"}
        </Text>

       
        <View style={styles.scannerWrapper}>
          <BarcodeScanner />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#f3f2f1",
    paddingVertical: 30,
  },
  container: {
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#201f1e",
    marginBottom: 10,
  },
  selectBox: {
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  dropdown: {
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  selectedText: {
    marginTop: 15,
    fontSize: 16,
    color: "#201f1e",
  },
  scannerWrapper: {
    marginTop: 30,
    width: "100%",
    alignItems: "center",
  },
});
