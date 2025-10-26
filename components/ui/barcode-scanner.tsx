import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { scanBarcodeImage } from "../../utils/api";
import { TabTitle } from "../TabTitle";

export default function BarcodeScanner({
  onDetected,
  selectedAirline,
}: {
  onDetected: (data: any) => void;
  selectedAirline?: string;
}) {
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleScan = async () => {
    if (!cameraRef.current) return;

    setLoading(true);
    setResult("Scanning...");

    try {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.7,
      });

      const manipulated = await ImageManipulator.manipulateAsync(
        photo.uri,
        [],
        {
          base64: true,
          compress: 0.7,
        }
      );

      const data = await scanBarcodeImage(
        `data:image/jpeg;base64,${manipulated.base64}`
      );

      if (data.success && data.found) {
        setResult(`${data.product_name} (${data.brand})`);
        onDetected(data);
      } else if (data.success && !data.found) {
        setResult(data.message || "Product not found");
      } else {
        setResult("No barcode detected or server error");
      }
    } catch (err) {
      console.error(err);
      setResult("Connection error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkPermission = async () => {
      if (!permission?.granted) {
        const { granted } = await requestPermission();
        if (!granted) {
          setResult("Camera access denied");
          return;
        }
      }
    };
    checkPermission();
  }, [permission, requestPermission]);

  if (!permission) {
    return (
      <View>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  return (
    <View style={styles.layout}>
      <main style={styles.container}>
        <TabTitle title={`${selectedAirline}`} subtitle="Scan bottle" />
        <View style={styles.videoContainer}>
          <CameraView ref={cameraRef} facing="back" />
        </View>

        <View>
          <TouchableOpacity disabled={loading} onPress={handleScan}>
            {loading ? (
              <Text style={styles.btnText}>Scanning...</Text>
            ) : (
              <Text style={styles.btnText}>
                Scan Barcode
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 7v-1a2 2 0 0 1 2 -2h2" />
                  <path d="M4 17v1a2 2 0 0 0 2 2h2" />
                  <path d="M16 4h2a2 2 0 0 1 2 2v1" />
                  <path d="M16 20h2a2 2 0 0 0 2 -2v-1" />
                  <path d="M5 11h1v2h-1z" />
                  <path d="M10 11l0 2" />
                  <path d="M14 11h1v2h-1z" />
                  <path d="M19 11l0 2" />
                </svg>
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {loading && (
          <ActivityIndicator
            size="small"
            color="#0078d4"
            style={{ marginTop: 10 }}
          />
        )}

        <Text style={[styles.result]}>{result}</Text>
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
    marginTop: "10%",
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  videoContainer: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: "#faf9f8",
    marginBottom: 16,
  },
  btnText: {
    backgroundColor: "#00132C",
    color: "#FFFFFF",
    fontWeight: "bold",
    padding: 15,
    borderRadius: 10,
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  result: {
    textAlign: "center",
    color: "#a4262c",
  },
});
