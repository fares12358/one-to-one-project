"use client";

import { useState, useEffect } from "react";
import api from "@/services/api";

// Module-level cache so Header + Footer share one request instead of two.
let _cache = null;
let _pending = null;

export function useSiteSettings() {
  const [settings, setSettings] = useState(_cache);

  useEffect(() => {
    if (_cache) return;
    if (!_pending) {
      _pending = api.get("/settings")
        .then(({ data }) => (_cache = data.data || {}))
        .catch(() => (_cache = {}));
    }
    _pending.then(setSettings);
  }, []);

  return settings || {};
}
