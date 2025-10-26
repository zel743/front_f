import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { getAirlineByName } from "../../utils/api";

interface FlightData {
  airline_code: string;
  flight_number: string;
  service_class: string;
  origin: string;
  destination: string;
  flight_date: string;
}

interface FlightFormProps {
  onSubmit: (data: FlightData) => void;
  selectedAirline?: string; // 👈 we’ll pass this from InspectionFlow
}

export default function FlightForm({ onSubmit, selectedAirline }: FlightFormProps) {
  const [form, setForm] = useState<FlightData>({
    airline_code: "",
    flight_number: "",
    service_class: "",
    origin: "",
    destination: "",
    flight_date: new Date().toISOString().split("T")[0],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Fetch airline code automatically from backend
  useEffect(() => {
    async function fetchAirlineCode() {
      if (!selectedAirline) return;
      setLoading(true);
      setError(null);
      try {
        const res = await getAirlineByName(selectedAirline);
        if (res && res.airline_code) {
          setForm((prev) => ({ ...prev, airline_code: res.airline_code }));
        } else {
          setError("Airline not found in database");
        }
      } catch (err) {
        console.error("Error fetching airline:", err);
        setError("Error fetching airline code");
      } finally {
        setLoading(false);
      }
    }
    fetchAirlineCode();
  }, [selectedAirline]);

  const handleChange = (key: keyof FlightData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✈️ Flight Information</Text>

      {loading && <ActivityIndicator color="#0078d4" style={{ marginBottom: 10 }} />}
      {error && <Text style={styles.error}>{error}</Text>}

      {/* Airline Code (auto-filled, not editable) */}
      <TextInput
        placeholder="AIRLINE CODE"
        value={form.airline_code}
        editable={false}
        style={[styles.input, { backgroundColor: "#f3f2f1" }]}
      />

      {/* Remaining fields (editable) */}
      <TextInput
        placeholder="FLIGHT NUMBER"
        value={form.flight_number}
        onChangeText={(v) => handleChange("flight_number", v)}
        style={styles.input}
      />

      <TextInput
        placeholder="SERVICE CLASS (e.g., Economy)"
        value={form.service_class}
        onChangeText={(v) => handleChange("service_class", v)}
        style={styles.input}
      />

      <TextInput
        placeholder="ORIGIN"
        value={form.origin}
        onChangeText={(v) => handleChange("origin", v)}
        style={styles.input}
      />

      <TextInput
        placeholder="DESTINATION"
        value={form.destination}
        onChangeText={(v) => handleChange("destination", v)}
        style={styles.input}
      />

      <TextInput
        placeholder="FLIGHT DATE (YYYY-MM-DD)"
        value={form.flight_date}
        onChangeText={(v) => handleChange("flight_date", v)}
        style={styles.input}
      />

      <TouchableOpacity
        style={[styles.btn, !form.flight_number && styles.disabledBtn]}
        disabled={!form.flight_number}
        onPress={() => onSubmit(form)}
      >
        <Text style={styles.btnText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "90%", marginTop: 20 },
  title: { fontSize: 18, fontWeight: "600", marginBottom: 10, color: "#201f1e" },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  btn: {
    backgroundColor: "#0078d4",
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
    marginTop: 10,
  },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "600" },
  disabledBtn: { backgroundColor: "#a6a6a6" },
  error: { color: "#a4262c", fontSize: 13, marginBottom: 8 },
});
