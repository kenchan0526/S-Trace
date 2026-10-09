"use client";

import { useState, useEffect } from "react";
import { Subscription, Settings, DEFAULT_SETTINGS } from "@/types/subscription";

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedSubs = localStorage.getItem("s-trace-subscriptions");
      let parsedSubs: Subscription[] = [];
      if (storedSubs) {
        parsedSubs = JSON.parse(storedSubs);
        
        // Month reset logic
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
        let hasChanges = false;
        parsedSubs = parsedSubs.map(sub => {
          if (sub.isChargedThisMonth && sub.lastChargedMonth !== currentMonth) {
            hasChanges = true;
            return { ...sub, isChargedThisMonth: false };
          }
          return sub;
        });
        
        setSubscriptions(parsedSubs);
        if (hasChanges) {
          localStorage.setItem("s-trace-subscriptions", JSON.stringify(parsedSubs));
        }
      }

      const storedSettings = localStorage.getItem("s-trace-settings");
      if (storedSettings) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(storedSettings) });
      } else {
        localStorage.setItem("s-trace-settings", JSON.stringify(DEFAULT_SETTINGS));
      }
    } catch (e) {
      console.error("Failed to load data from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("s-trace-subscriptions", JSON.stringify(subscriptions));
    }
  }, [subscriptions, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("s-trace-settings", JSON.stringify(settings));
    }
  }, [settings, isLoaded]);

  const addSubscription = (sub: Subscription) => {
    setSubscriptions((prev) => [...prev, sub]);
  };

  const updateSubscription = (id: string, updatedSub: Partial<Subscription>) => {
    setSubscriptions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, ...updatedSub } : sub))
    );
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions((prev) => prev.filter((sub) => sub.id !== id));
  };

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
  };

  return {
    subscriptions,
    settings,
    isLoaded,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    updateSettings,
  };
}

