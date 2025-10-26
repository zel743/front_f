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
import { TabTitle } from "../TabTitle";
import BarcodeScanner from "../ui/barcode-scanner";
import BottleForm from "../ui/bottle-form";
import FlightForm from "../ui/flight-form";

interface InspectionFlowProps {
  selectedAirline: string;
  onReturnHome: () => void;
}

export default function InspectionFlow({
  selectedAirline,
  onReturnHome,
}: InspectionFlowProps) {
  const [step, setStep] = useState<
    "flight" | "scan" | "preview" | "qualitative" | "done"
  >("flight");
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
        "Product Found",
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

  // 🎨 Color helper for recommendation
  const getRecommendationColor = (action?: string) => {
    switch ((action || "").toLowerCase()) {
      case "keep":
        return "#107C10"; // green
      case "refill":
        return "#0078D4"; // blue
      case "replace":
        return "#FFB900"; // yellow
      case "discard":
        return "#A4262C"; // red
      default:
        return "#605E5C"; // neutral gray
    }
  };

  return (
    <ScrollView>
      {/* Step 1: Flight Form */}
      {step === "flight" && (
        <FlightForm
          onSubmit={handleFlightSubmit}
          selectedAirline={selectedAirline}
        />
      )}

      {/* Step 2: Scan Bottle */}
      {step === "scan" && (
        <BarcodeScanner
          onDetected={handleDetected}
          selectedAirline={selectedAirline}
        />
      )}

      {/* Step 3: Product Preview */}
      {step === "preview" && bottleData && (
        <div style={styles.container}>
          <TabTitle title={`${selectedAirline}`} subtitle="Bottle preview" />
          <View style={styles.previewBox}>
            <Text style={styles.previewText}>
              Barcode: {bottleData.barcode}
            </Text>
            <Text style={styles.previewText}>
              Name: {bottleData.product_name}
            </Text>
            <Text style={styles.previewText}>Brand: {bottleData.brand}</Text>
            <Text style={styles.previewText}>
              Category: {bottleData.category}
            </Text>
            <Text style={styles.previewText}>
              Size: {bottleData.bottle_size}
            </Text>
          </View>

          <TouchableOpacity onPress={handlePreviewContinue}>
            <Text style={styles.btnText}>Continue</Text>
          </TouchableOpacity>
        </div>
      )}

      {/* Step 4: Qualitative Data */}
      {step === "qualitative" && (
        <BottleForm
          onSubmit={handleBottleSubmit}
          selectedAirline={selectedAirline}
        />
      )}

      {/* Step 5: Final Report */}
      {step === "done" && (
        <View style={styles.resultContainer}>
          <TabTitle title={`${selectedAirline}`} subtitle="Inspection Report" />

          {loading ? (
            <ActivityIndicator size="large" color="#0078d4" />
          ) : result ? (
            <>
              {/* Product Info */}
              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>Product:</Text>
                <Text style={styles.infoText}>
                  {result.product?.name} ({result.product?.brand})
                </Text>

                <Text style={styles.infoTitle}>Category:</Text>
                <Text style={styles.infoText}>{result.product?.category}</Text>

                <Text style={styles.infoTitle}>Flight:</Text>
                <Text style={styles.infoText}>
                  {result.flight?.number} • {result.flight?.service_class}
                </Text>

                <Text style={styles.infoTitle}>Date:</Text>
                <Text style={styles.infoText}>{result.flight?.date}</Text>
              </View>

              {/* Recommendation */}
              <View style={styles.recommendationContainer}>
                <Text style={styles.recommendationLabel}>
                  Recommended Action:
                </Text>
                <View style={styles.recommendationRow}>
                  <View
                    style={[
                      styles.circle,
                      {
                        backgroundColor: getRecommendationColor(
                          result.recommended_action
                        ),
                      },
                    ]}
                  />
                  <Text style={styles.recommendationText}>
                    {result.recommended_action || "No recommendation"}
                  </Text>
                </View>
              </View>

              {/* Policy Info */}
              {result.policy_used && (
                <View style={styles.policyBox}>
                  <Text style={styles.policyTitle}>
                    🧭 Policy Applied: {result.policy_used}
                  </Text>
                  <Text style={styles.policyNotes}>{result.notes}</Text>
                </View>
              )}
            </>
          ) : (
            <Text style={styles.resultText}>No result data.</Text>
          )}

          <TouchableOpacity onPress={restart}>
            <Text style={styles.btnText}>Scan Another Bottle</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onReturnHome}>
            <Text style={styles.btnText}>Finish & Return Home</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
  },
  previewText: { fontSize: 15, marginBottom: 4, color: "#201f1e" },
  resultContainer: { width: "90%", alignItems: "center", marginTop: 20 },
  resultText: {
    backgroundColor: "#f3f2f1",
    padding: 10,
    borderRadius: 6,
    fontSize: 14,
    color: "#201f1e",
    width: "100%",
  },
  infoCard: {
    backgroundColor: "#f3f2f1",
    borderRadius: 6,
    padding: 10,
    width: "100%",
    marginBottom: 16,
  },
  infoTitle: { fontWeight: "600", color: "#201f1e" },
  infoText: { marginBottom: 4, color: "#323130" },
  recommendationContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  recommendationLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#201f1e",
    marginBottom: 8,
  },
  recommendationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  recommendationText: {
    fontSize: 18,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: "#fff",
    borderWidth: 2,
  },
  policyBox: {
    backgroundColor: "#e5f1fb",
    borderRadius: 6,
    padding: 10,
    width: "100%",
    marginBottom: 10,
  },
  policyTitle: {
    fontWeight: "600",
    color: "#004578",
    marginBottom: 4,
  },
  policyNotes: { color: "#201f1e", fontSize: 14 },
  btn: {
    backgroundColor: "#0078d4",
    padding: 12,
    borderRadius: 4,
    marginTop: 20,
    width: 220,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "600" },

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
});
