import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface BottleQualitative {
  condition: string;
  seal: string;
  fill_level: string;
  cleanliness: string;
  label_status: string;
}

interface BottleFormProps {
  onSubmit: (data: BottleQualitative) => void;
}

export default function BottleForm({ onSubmit }: BottleFormProps) {
  const [form, setForm] = useState<BottleQualitative>({
    condition: "Good",
    seal: "Sealed",
    fill_level: "100",
    cleanliness: "100",
    label_status: "Intact", // ✅ default value
  });

  const handleChange = (key: keyof BottleQualitative, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const conditionOptions = ["Excellent", "Good", "Fair", "Damaged"];
  const sealOptions = ["Sealed", "Opened", "Resealed", "Broken"];
  const labelOptions = ["Intact", "Peeling", "Faded", "Missing", "Unreadable"];

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

  const cleanlinessOptions = [
    { label: "100% (Spotless)", value: "100" },
    { label: "90% (Very Clean)", value: "90" },
    { label: "80% (Clean)", value: "80" },
    { label: "70% (Slightly Dirty)", value: "70" },
    { label: "60% (Noticeable Residue)", value: "60" },
    { label: "50% (Dirty)", value: "50" },
    { label: "40% (Heavily Dirty)", value: "40" },
    { label: "30% (Contaminated)", value: "30" },
    { label: "20% (Severely Dirty)", value: "20" },
    { label: "10% (Unusable)", value: "10" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍾 Bottle Details</Text>

      {/* Bottle Condition */}
      <Text style={styles.label}>Condition</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={form.condition}
          onValueChange={(v) => handleChange("condition", v)}
        >
          {conditionOptions.map((opt) => (
            <Picker.Item key={opt} label={opt} value={opt} />
          ))}
        </Picker>
      </View>

      {/* Seal Status */}
      <Text style={styles.label}>Seal Status</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={form.seal}
          onValueChange={(v) => handleChange("seal", v)}
        >
          {sealOptions.map((opt) => (
            <Picker.Item key={opt} label={opt} value={opt} />
          ))}
        </Picker>
      </View>

      {/* Label Status */}
      <Text style={styles.label}>Label Status</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={form.label_status}
          onValueChange={(v) => handleChange("label_status", v)}
        >
          {labelOptions.map((opt) => (
            <Picker.Item key={opt} label={opt} value={opt} />
          ))}
        </Picker>
      </View>

      {/* Fill Level */}
      <Text style={styles.label}>Fill Level</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={form.fill_level}
          onValueChange={(v) => handleChange("fill_level", v)}
        >
          {fillOptions.map((opt) => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>
      </View>

      {/* Cleanliness */}
      <Text style={styles.label}>Cleanliness</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={form.cleanliness}
          onValueChange={(v) => handleChange("cleanliness", v)}
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
  title: { fontSize: 18, fontWeight: "600", marginBottom: 10, color: "#201f1e" },
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
});
