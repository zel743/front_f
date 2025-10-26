import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
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
  selectedAirline?: string;
}

export default function FlightForm({ onSubmit, selectedAirline }: FlightFormProps) {
  const [form, setForm] = useState<FlightData>({
    airline_code: "",
    flight_number: "",
    service_class: "Economy",
    origin: "CDG",
    destination: "MEX",
    flight_date: new Date().toISOString().split("T")[0],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          setError("Airline not found");
        }
      } catch (err) {
        console.error(err);
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

  const serviceClasses = ["Economy", "Business", "First"];
  const airports = ["CDG", "LHR", "FRA", "ZRH", "DXB", "SIN", "MEX", "JFK", "MAD"];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✈️ Flight Details</Text>

      {loading && <ActivityIndicator color="#0078d4" style={{ marginBottom: 10 }} />}
      {error && <Text style={styles.error}>{error}</Text>}

      <TextInput
        placeholder="AIRLINE CODE"
        value={form.airline_code}
        editable={false}
        style={[styles.input, { backgroundColor: "#f3f2f1" }]}
      />

      <TextInput
        placeholder="FLIGHT NUMBER"
        value={form.flight_number}
        onChangeText={(v) => handleChange("flight_number", v)}
        style={styles.input}
      />

      <Text style={styles.label}>Service Class</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={form.service_class}
          onValueChange={(v) => handleChange("service_class", v)}
        >
          {serviceClasses.map((opt) => (
            <Picker.Item key={opt} label={opt} value={opt} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Origin</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={form.origin}
          onValueChange={(v) => handleChange("origin", v)}
        >
          {airports.map((opt) => (
            <Picker.Item key={opt} label={opt} value={opt} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Destination</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={form.destination}
          onValueChange={(v) => handleChange("destination", v)}
        >
          {airports.map((opt) => (
            <Picker.Item key={opt} label={opt} value={opt} />
          ))}
        </Picker>
      </View>

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
  label: { fontWeight: "500", marginBottom: 4, color: "#201f1e" },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  pickerContainer: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
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
