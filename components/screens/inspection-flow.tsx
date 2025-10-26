import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { registerBarcode } from "../../utils/api";
import BarcodeScanner from "../ui/barcode-scanner";
import BottleForm from "../ui/bottle-form";
import FlightForm from "../ui/flight-form";

interface InspectionFlowProps {
  selectedAirline: string; // Airline name (from App)
  onReturnHome: () => void;
}

export default function InspectionFlow({
  selectedAirline,
  onReturnHome,
}: InspectionFlowProps) {
  const [step, setStep] = useState<"flight" | "scan" | "preview" | "qualitative" | "done">("flight");
  const [loading, setLoading] = useState(false);
  const [flightInfo, setFlightInfo] = useState<any>(null);
  const [bottleData, setBottleData] = useState<any>(null);
  const [result, setResult] = useState<any>(null);

  // ✈️ Step 1: Flight Info Submitted
  const handleFlightSubmit = (data: any) => {
    setFlightInfo(data);
    setStep("scan");
  };

  // 🍾 Step 2: Barcode Detected
  const handleDetected = (barcodeInfo: any) => {
    if (!barcodeInfo || !barcodeInfo.barcode) {
      Alert.alert("Scan Failed", "No valid barcode detected. Try again.");
      return;
    }

    setBottleData(barcodeInfo);

    if (barcodeInfo.found) {
      Alert.alert(
        "Product Found ✅",
        `${barcodeInfo.product_name} (${barcodeInfo.brand})\nCategory: ${barcodeInfo.category}\nSize: ${barcodeInfo.bottle_size}`
      );
      setStep("preview");
    } else {
      Alert.alert(
        "Product Not Found",
        "This barcode isn’t in the database. You can still proceed manually."
      );
      setStep("qualitative");
    }
  };

  // 👁️ Step 3: Show Product Info Preview
  const handlePreviewContinue = () => setStep("qualitative");

  // 🧾 Step 4: Submit Bottle Qualitative Data
  const handleBottleSubmit = async (qualitative: any) => {
    if (!bottleData?.barcode) {
      Alert.alert("Error", "Bottle data missing. Please scan again.");
      setStep("scan");
      return;
    }

    if (!flightInfo) {
      Alert.alert("Error", "Flight information missing. Please re-enter.");
      setStep("flight");
      return;
    }

    const payload = {
      barcode: bottleData.barcode,
      airline_code: flightInfo.airline_code,
      flight_number: flightInfo.flight_number,
      service_class: flightInfo.service_class,
      origin: flightInfo.origin,
      destination: flightInfo.destination,
      flight_date: flightInfo.flight_date,
      qualitative,
    };

    try {
      setLoading(true);
      const res = await registerBarcode(payload);
      setResult(res);
      setStep("done");
    } catch (err: any) {
      console.error("Registration error:", err);
      Alert.alert(
        "Network Error",
        "Could not contact the API. Make sure your phone and computer are on the same Wi-Fi network."
      );
      setResult({ error: err.message });
      setStep("done");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Restart process
  const restart = () => {
    setStep("flight");
    setFlightInfo(null);
    setBottleData(null);
    setResult(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.airlineHeader}>Airline: {selectedAirline}</Text>

      {step === "flight" && (
        <FlightForm onSubmit={handleFlightSubmit} selectedAirline={selectedAirline} />
      )}

      {step === "scan" && (
        <View style={styles.section}>
          <Text style={styles.header}>Scan Bottle</Text>
          <BarcodeScanner onDetected={handleDetected} />
        </View>
      )}

      {step === "preview" && bottleData && (
        <View style={styles.section}>
          <Text style={styles.title}>Product Preview</Text>
          <View style={styles.previewBox}>
            <Text style={styles.previewText}>Barcode: {bottleData.barcode}</Text>
            <Text style={styles.previewText}>Name: {bottleData.product_name}</Text>
            <Text style={styles.previewText}>Brand: {bottleData.brand}</Text>
            <Text style={styles.previewText}>Category: {bottleData.category}</Text>
            <Text style={styles.previewText}>Size: {bottleData.bottle_size}</Text>
          </View>

          <TouchableOpacity style={styles.btn} onPress={handlePreviewContinue}>
            <Text style={styles.btnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === "qualitative" && <BottleForm onSubmit={handleBottleSubmit} />}

      {step === "done" && (
        <View style={styles.resultContainer}>
          <Text style={styles.title}>✅ Report Generated</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#0078d4" />
          ) : (
            <Text style={styles.resultText}>
              {result ? JSON.stringify(result, null, 2) : "No result data."}
            </Text>
          )}

          <TouchableOpacity style={styles.btn} onPress={restart}>
            <Text style={styles.btnText}>Scan Another Bottle</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: "#a4262c" }]}
            onPress={onReturnHome}
          >
            <Text style={styles.btnText}>Finish & Return Home</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: "center", paddingVertical: 30 },
  airlineHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0078d4",
    marginBottom: 20,
  },
  section: { width: "90%", alignItems: "center" },
  header: { fontSize: 20, fontWeight: "600", marginBottom: 10 },
  title: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  previewBox: {
    width: "100%",
    backgroundColor: "#f3f2f1",
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
    borderColor: "#edebe9",
    borderWidth: 1,
  },
  previewText: {
    fontSize: 15,
    marginBottom: 4,
    color: "#201f1e",
  },
  resultContainer: { width: "90%", alignItems: "center", marginTop: 20 },
  resultText: {
    backgroundColor: "#f3f2f1",
    padding: 10,
    borderRadius: 6,
    fontSize: 14,
    color: "#201f1e",
    width: "100%",
  },
  btn: {
    backgroundColor: "#0078d4",
    padding: 12,
    borderRadius: 4,
    marginTop: 20,
    width: 220,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "600" },
});
