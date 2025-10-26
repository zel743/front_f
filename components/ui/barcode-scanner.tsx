import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import React, { useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { scanBarcodeImage } from "../../utils/api";

export default function BarcodeScanner({ onDetected }: { onDetected: (data: any) => void }) {
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("Ready to scan");
  const [resultColor, setResultColor] = useState("#201f1e");

  const handleCameraToggle = async () => {
    if (cameraActive) {
      setCameraActive(false);
      setResult("Camera stopped");
      setResultColor("#605e5c");
      return;
    }

    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        setResult("Camera access denied");
        setResultColor("#a4262c");
        return;
      }
    }

    setCameraActive(true);
    setResult("Camera active");
    setResultColor("#201f1e");
  };

  const handleScan = async () => {
    if (!cameraRef.current) return;

    setLoading(true);
    setResult("Scanning...");
    setResultColor("#0078d4");

    try {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.7,
      });

      const manipulated = await ImageManipulator.manipulateAsync(photo.uri, [], {
        base64: true,
        compress: 0.7,
      });

      const data = await scanBarcodeImage(`data:image/jpeg;base64,${manipulated.base64}`);

      if (data.success && data.found) {
        setResult(`${data.product_name} (${data.brand})`);
        setResultColor("#107c10");
        onDetected(data);
      } else if (data.success && !data.found) {
        setResult(data.message || "Product not found");
        setResultColor("#a4262c");
      } else {
        setResult("No barcode detected or server error");
        setResultColor("#a4262c");
      }
    } catch (err) {
      console.error(err);
      setResult("Connection error");
      setResultColor("#a4262c");
    } finally {
      setLoading(false);
    }
  };

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  return (
    <View style={styles.appRoot}>
      <View style={styles.card}>
        <Text style={styles.title}>Barcode Scanner</Text>

        {cameraActive && (
          <View style={styles.videoContainer}>
            <CameraView ref={cameraRef} style={styles.camera} facing="back" />
          </View>
        )}

        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.btn, cameraActive ? styles.stop : styles.primary]}
            onPress={handleCameraToggle}
          >
            <Text style={styles.btnText}>
              {cameraActive ? "Stop Camera" : "Start Camera"}
            </Text>
          </TouchableOpacity>

          {cameraActive && (
            <TouchableOpacity
              style={[styles.btn, styles.secondary]}
              disabled={loading}
              onPress={handleScan}
            >
              <Text style={styles.btnText}>
                {loading ? "Scanning..." : "Scan Barcode"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {loading && <ActivityIndicator size="small" color="#0078d4" style={{ marginTop: 10 }} />}

        <Text style={[styles.result, { color: resultColor }]}>{result}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  appRoot: { alignItems: "center", justifyContent: "center" },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 6,
    borderColor: "#edebe9",
    borderWidth: 1,
    padding: 24,
    width: 360,
    alignItems: "center",
  },
  title: { fontSize: 20, fontWeight: "600", color: "#201f1e", marginBottom: 16 },
  videoContainer: {
    width: "100%",
    height: 240,
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: "#faf9f8",
    borderWidth: 1,
    borderColor: "#edebe9",
    marginBottom: 16,
  },
  camera: { flex: 1 },
  controls: { width: "100%", gap: 10, marginTop: 8 },
  btn: { borderRadius: 4, paddingVertical: 12, alignItems: "center" },
  btnText: { fontSize: 15, fontWeight: "500", color: "#ffffff" },
  primary: { backgroundColor: "#0078d4" },
  secondary: { backgroundColor: "#107c10" },
  stop: { backgroundColor: "#a4262c" },
  result: { marginTop: 16, fontSize: 15, fontWeight: "500", textAlign: "center", minHeight: 24 },
  center: { justifyContent: "center", alignItems: "center", flex: 1 },
});
