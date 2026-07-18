import { useEffect, useState } from "react";
import { type ZoneUpdate, type AlertEvent, type TransportUpdate, type WasteBinAlert } from "@/lib/realtime";

export function useZoneStream() {
  const [zones, setZones] = useState<Record<string, ZoneUpdate>>({});
  const [alerts, setAlerts] = useState<AlertEvent[]>([]);
  const [transport, setTransport] = useState<Record<string, TransportUpdate>>({});
  const [wasteBins, setWasteBins] = useState<Record<string, WasteBinAlert>>({});
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const es = new EventSource("/api/zones/stream");

    es.onopen = () => setConnected(true);

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "zone_update") {
          setZones((prev) => ({
            ...prev,
            [data.zone_id]: data,
          }));
        } else if (data.type === "alert") {
          setAlerts((prev) => [data, ...prev].slice(0, 50));
        }
      } catch (e) {
        console.error("SSE parse error", e);
      }
    };

    es.addEventListener("transport_update", (e) => {
      try {
        const data = JSON.parse(e.data) as TransportUpdate;
        setTransport((prev) => ({
          ...prev,
          [data.zone_id]: data,
        }));
      } catch (err) {
        console.error("Transport update parse error", err);
      }
    });

    es.addEventListener("waste_bin_alert", (e) => {
      try {
        const data = JSON.parse(e.data) as WasteBinAlert;
        setWasteBins((prev) => ({
          ...prev,
          [data.bin_id]: data,
        }));
      } catch (err) {
        console.error("Waste bin alert parse error", err);
      }
    });

    es.onerror = () => setConnected(false);

    return () => {
      es.close();
    };
  }, []);

  return {
    zones,
    alerts,
    transport: Object.values(transport),
    wasteBins: Object.values(wasteBins),
    connected,
    setAlerts,
  };
}
