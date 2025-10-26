// src/utils/api.ts
import { Platform } from "react-native";

// ✅ Dynamically pick the correct base URL for Web vs. Mobile
const getBaseUrl = () => {
  if (Platform.OS === "android" || Platform.OS === "ios") {
    return "http://192.168.1.120:6060"; // 👈 replace with your PC’s LAN IP
  }
  return "http://localhost:6060";
};

const BASE_URL = getBaseUrl();

// ──────────────── Barcode APIs ────────────────

export async function scanBarcodeImage(imageBase64: string) {
  const res = await fetch(`${BASE_URL}/scan-barcode-image`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: imageBase64 }),
  });
  return res.json();
}

export async function registerBarcode(data: {
  barcode: string;
  airline_code: string;
  flight_number: string;
  service_class: string;
  origin?: string;
  destination?: string;
  flight_date?: string;
}) {
  const res = await fetch(`${BASE_URL}/barcode/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// ──────────────── Airline Lookup APIs ────────────────

export async function getAirlines() {
  const res = await fetch(`${BASE_URL}/airlines`);
  return res.json();
}

export async function getAirlineByName(name: string) {
  const res = await fetch(
    `${BASE_URL}/airline/by-name/${encodeURIComponent(name)}`
  );
  return res.json();
}
