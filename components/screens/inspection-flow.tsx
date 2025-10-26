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

  const handleFlightSubmit = (data: any) => {
    setFlightInfo(data);
    setStep("scan");
  };

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

  const handlePreviewContinue = () => setStep("qualitative");

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

  const restart = () => {
    setStep("flight");
    setFlightInfo(null);
    setBottleData(null);
    setResult(null);
  };

  const getRecommendationColor = (action?: string) => {
    switch ((action || "").toLowerCase()) {
      case "keep":
        return "#107C10";
      case "refill":
        return "#0078D4";
      case "replace":
        return "#FFB900";
      case "discard":
        return "#A4262C";
      default:
        return "#605E5C";
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
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

      {/* Step 3: Bottle Preview */}
      {step === "preview" && bottleData && (
        <View style={styles.formContainer}>
          <TabTitle title={selectedAirline} subtitle="Bottle preview" />
          <View style={styles.previewBox}>
            <Text style={styles.previewText}>Barcode: {bottleData.barcode}</Text>
            <Text style={styles.previewText}>Name: {bottleData.product_name}</Text>
            <Text style={styles.previewText}>Brand: {bottleData.brand}</Text>
            <Text style={styles.previewText}>Category: {bottleData.category}</Text>
            <Text style={styles.previewText}>Size: {bottleData.bottle_size}</Text>
          </View>

          <TouchableOpacity style={styles.btnPrimary} onPress={handlePreviewContinue}>
            <Text style={styles.btnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Step 4: Bottle Form */}
      {step === "qualitative" && (
        <BottleForm
          onSubmit={handleBottleSubmit}
          selectedAirline={selectedAirline}
        />
      )}

      {/* Step 5: Inspection Report */}
      {step === "done" && (
        <View style={styles.formContainer}>
          <TabTitle title={selectedAirline} subtitle="Inspection Report" />

          {loading ? (
            <ActivityIndicator size="large" color="#0078D4" />
          ) : result ? (
            <>
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

              <View style={styles.recommendationContainer}>
                <Text style={styles.recommendationLabel}>Recommended Action:</Text>
                <View style={styles.recommendationRow}>
                  <View
                    style={[
                      styles.circle,
                      { backgroundColor: getRecommendationColor(result.recommended_action) },
                    ]}
                  />
                  <Text style={styles.recommendationText}>
                    {result.recommended_action || "No recommendation"}
                  </Text>
                </View>
              </View>

              {result.policy_used && (
                <View style={styles.policyBox}>
                  <Text style={styles.policyTitle}>
                    Policy Applied: {result.policy_used}
                  </Text>
                  <Text style={styles.policyNotes}>{result.notes}</Text>
                </View>
              )}
            </>
          ) : (
            <Text style={styles.resultText}>No result data.</Text>
          )}

          <TouchableOpacity style={styles.btnPrimary} onPress={restart}>
            <Text style={styles.btnText}>Scan Another Bottle</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnSecondary} onPress={onReturnHome}>
            <Text style={styles.btnText}>Finish & Return Home</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#fff",
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  previewBox: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DADADA",
    padding: 16,
    marginBottom: 24,
    marginTop: 36,
  },
  previewText: {
    fontSize: 15,
    marginBottom: 6,
    color: "#201F1E",
  },
  infoCard: {
    width: "100%",
    backgroundColor: "#F3F2F1",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    marginTop: 24,
  },
  infoTitle: { fontWeight: "600", color: "#201F1E", marginBottom: 2 },
  infoText: { color: "#323130", marginBottom: 4 },
  recommendationContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  recommendationLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#201F1E",
    marginBottom: 8,
  },
  recommendationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  recommendationText: {
    fontSize: 18,
    fontWeight: "700",
    textTransform: "uppercase",
    color: "#201F1E",
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: "#fff",
    borderWidth: 2,
  },
  policyBox: {
    backgroundColor: "#E5F1FB",
    borderRadius: 8,
    padding: 12,
    width: "100%",
    marginBottom: 16,
  },
  policyTitle: {
    fontWeight: "600",
    color: "#004578",
    marginBottom: 4,
  },
  policyNotes: { color: "#201F1E", fontSize: 14 },
  resultText: {
    backgroundColor: "#F3F2F1",
    padding: 12,
    borderRadius: 6,
    fontSize: 14,
    color: "#201F1E",
    width: "100%",
  },
  btnPrimary: {
    backgroundColor: "#00091E",
    paddingVertical: 14,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 16,
  },
  btnSecondary: {
    backgroundColor: "#A4262C",
    paddingVertical: 14,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 12,
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
