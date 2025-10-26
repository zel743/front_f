import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

interface BottleQualitative {
  condition: string;
  seal: string;
  fill_level: string;
}

export default function BottleForm({ onSubmit }: { onSubmit: (data: BottleQualitative) => void }) {
  const [form, setForm] = useState<BottleQualitative>({ condition: "", seal: "", fill_level: "" });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bottle Details</Text>
      {["condition", "seal", "fill_level"].map((key) => (
        <TextInput
          key={key}
          placeholder={key.replace("_", " ").toUpperCase()}
          value={(form as any)[key]}
          onChangeText={(v) => setForm({ ...form, [key]: v })}
          style={styles.input}
        />
      ))}
      <TouchableOpacity style={styles.btn} onPress={() => onSubmit(form)}>
        <Text style={styles.btnText}>Submit Bottle</Text>
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
  btn: { backgroundColor: "#107c10", padding: 12, borderRadius: 4 },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "600" },
});
