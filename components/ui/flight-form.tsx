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
import { TabTitle } from "../TabTitle";

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

export default function FlightForm({
  onSubmit,
  selectedAirline,
}: FlightFormProps) {
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

  const serviceClasses = [
    "Select service class",
    "Economy",
    "Business",
    "First",
  ];
  const airports = [
    "CDG",
    "LHR",
    "FRA",
    "ZRH",
    "DXB",
    "SIN",
    "MEX",
    "JFK",
    "MAD",
  ];

  return (
    <View style={styles.layout}>
      <main style={styles.container}>
        <TabTitle
          title={`${selectedAirline}`}
          subtitle="Fill flight information"
        />

        {loading && (
          <ActivityIndicator color="#0078d4" style={{ marginBottom: 10 }} />
        )}

        <ul
          style={{
            listStyleType: "none",
            padding: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            gap: 10,
            width: "100%",
          }}
        >
          <li>
            <TextInput
              placeholder="Airline code"
              value={form.airline_code}
              editable={false}
              style={[styles.input]}
            />
          </li>

          <li>
            <TextInput
              placeholder="Flight number"
              value={form.flight_number}
              onChangeText={(v) => handleChange("flight_number", v)}
              style={styles.input}
            />
          </li>

          <li>
            <View>
              <Picker
                selectedValue={form.service_class}
                onValueChange={(v) => handleChange("service_class", v)}
                style={styles.picker}
              >
                {serviceClasses.map((opt) => (
                  <Picker.Item key={opt} label={opt} value={opt} />
                ))}
              </Picker>
            </View>
          </li>

          <li>
            <Text style={styles.label}>Origin</Text>
            <View>
              <Picker
                selectedValue={form.origin}
                onValueChange={(v) => handleChange("origin", v)}
                style={styles.picker}
              >
                {airports.map((opt) => (
                  <Picker.Item key={opt} label={opt} value={opt} />
                ))}
              </Picker>
            </View>
          </li>

          <li>
            <Text style={styles.label}>Destination</Text>
            <View>
              <Picker
                selectedValue={form.destination}
                onValueChange={(v) => handleChange("destination", v)}
                style={styles.picker}
              >
                {airports.map((opt) => (
                  <Picker.Item key={opt} label={opt} value={opt} />
                ))}
              </Picker>
            </View>
          </li>

          <li>
            <TextInput
              placeholder="FLIGHT DATE (YYYY-MM-DD)"
              value={form.flight_date}
              onChangeText={(v) => handleChange("flight_date", v)}
              style={styles.input}
            />
          </li>
        </ul>

        <TouchableOpacity
          disabled={!form.flight_number}
          onPress={() => onSubmit(form)}
        >
          <Text style={styles.btnText}>Continue</Text>
        </TouchableOpacity>
        {error && <Text style={styles.error}>{error}</Text>}
      </main>
    </View>
  );
}

const styles = StyleSheet.create({
  layout: {
    paddingLeft: 20,
    paddingRight: 20,
    width: "100%",
  },
  container: {
    marginTop: 50,
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  label: { fontWeight: "500", marginBottom: 4, color: "#201f1e" },

  input: {
    borderColor: "#6E7577",
    color: "#6E7577",
    borderWidth: 1,
    fontSize: 16,
    borderRadius: 10,
    padding: 10,
    textAlign: "center",
    width: "100%",
  },
  picker: {
    borderColor: "#6E7577",
    color: "#6E7577",
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    textAlign: "center",
    width: "100%",
    backgroundColor: "transparent",
  },
  btn: {
    backgroundColor: "#0078d4",
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
    marginTop: 10,
  },
  disabledBtn: { backgroundColor: "#a6a6a6" },
  error: { color: "#a4262c", fontSize: 13, marginBottom: 8 },
  btnText: {
    backgroundColor: "#00132C",
    color: "#FFFFFF",
    fontWeight: "bold",
    padding: 15,
    borderRadius: 10,
    textAlign: "center",
  },
});
