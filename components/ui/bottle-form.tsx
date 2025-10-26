import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TabTitle } from "../TabTitle";

interface BottleQualitative {
  condition: string;
  seal_status: string;
  fill_level: string;
  cleanliness: string;
}

interface BottleFormProps {
  onSubmit: (data: BottleQualitative) => void;
  selectedAirline: string;
}

export default function BottleForm({
  onSubmit,
  selectedAirline,
}: BottleFormProps) {
  const [form, setForm] = useState<BottleQualitative>({
    condition: "good",
    seal_status: "sealed",
    fill_level: "100",
    cleanliness: "10", // 1–10 scale
  });

  const handleChange = (key: keyof BottleQualitative, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const conditionOptions = ["excellent", "good", "fair", "damaged"];
  const sealOptions = ["sealed", "resealed", "opened", "broken"];
  const fillOptions = [
    { label: "100% (Full)", value: "100" },
    { label: "90%", value: "90" },
    { label: "80%", value: "80" },
    { label: "70%", value: "70" },
    { label: "60%", value: "60" },
    { label: "50%", value: "50" },
    { label: "40%", value: "40" },
    { label: "30%", value: "30" },
    { label: "20%", value: "20" },
    { label: "10%", value: "10" },
    { label: "0% (Empty)", value: "0" },
  ];
  const cleanlinessOptions = Array.from({ length: 10 }, (_, i) => ({
    label: `${i + 1} / 10`,
    value: String(i + 1),
  }));

  return (
    <View>
      <TabTitle title={`${selectedAirline}`} subtitle="Bottle inspection" />

      <Text style={styles.label}>Condition</Text>
      <View>
        <Picker
          selectedValue={form.condition}
          onValueChange={(v) => handleChange("condition", v)}
          style={styles.picker}
        >
          {conditionOptions.map((opt) => (
            <Picker.Item key={opt} label={opt.toUpperCase()} value={opt} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Seal Status</Text>
      <View>
        <Picker
          selectedValue={form.seal_status}
          onValueChange={(v) => handleChange("seal_status", v)}
          style={styles.picker}
        >
          {sealOptions.map((opt) => (
            <Picker.Item key={opt} label={opt.toUpperCase()} value={opt} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Fill Level</Text>
      <View>
        <Picker
          selectedValue={form.fill_level}
          onValueChange={(v) => handleChange("fill_level", v)}
          style={styles.picker}
        >
          {fillOptions.map((opt) => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Cleanliness</Text>
      <View>
        <Picker
          selectedValue={form.cleanliness}
          onValueChange={(v) => handleChange("cleanliness", v)}
          style={styles.picker}
        >
          {cleanlinessOptions.map((opt) => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.btn} onPress={() => onSubmit(form)}>
        <Text style={styles.btnText}>Submit Bottle</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "90%", marginTop: 20 },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#201f1e",
  },
  label: { fontWeight: "500", marginBottom: 4, color: "#201f1e" },
  pickerContainer: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  btn: { backgroundColor: "#107c10", padding: 12, borderRadius: 4 },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "600" },
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
});
