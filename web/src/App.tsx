import { initApp } from "@freeappstore/sdk";
import { CityCombobox } from "./components/CityCombobox";
import { ClockPanel } from "./components/ClockPanel";
import { MeetingForm } from "./components/MeetingForm";
import { MeetingList } from "./components/MeetingList";
import { useEffect, useState } from "react";
import type { Meeting } from "./types";
import { BuildInfo, Shell } from "@freeappstore/sdk/ui";

export default function App() {
  const [homeCityId, setHomeCityId] = useState<string>("Asia/Jakarta");
  const [targetCityIds, setTargetCityIds] = useState<string[]>([
    "Europe/London",
  ]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const fas = initApp({ appId: "dual-timezone" });

  useEffect(() => {
    try {
      const savedHome = localStorage.getItem("dtz_home");
      const savedTargets = localStorage.getItem("dtz_targets");
      const savedMeetings = localStorage.getItem("dtz_meetings");

      let initialHome = "Asia/Jakarta";
      try {
        const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (browserTz) initialHome = browserTz;
      } catch (e) {}

      if (savedHome) {
        setHomeCityId(savedHome);
      } else {
        setHomeCityId(initialHome);
      }

      if (savedTargets) {
        setTargetCityIds(JSON.parse(savedTargets));
      }

      if (savedMeetings) {
        setMeetings(JSON.parse(savedMeetings));
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("dtz_home", homeCityId);
      localStorage.setItem("dtz_targets", JSON.stringify(targetCityIds));
      localStorage.setItem("dtz_meetings", JSON.stringify(meetings));
    }
  }, [homeCityId, targetCityIds, meetings, isLoaded]);

  const handleAddTarget = (tzId: string) => {
    if (!targetCityIds.includes(tzId) && tzId !== homeCityId) {
      setTargetCityIds((prev) => [...prev, tzId]);
    }
  };

  const handleRemoveTarget = (tzId: string) => {
    setTargetCityIds((prev) => prev.filter((id) => id !== tzId));
  };

  const handleAddMeeting = (m: Meeting) => {
    setMeetings((prev) => [...prev, m]);
  };

  const handleToggleMeeting = (id: string) => {
    setMeetings((prev) =>
      prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m)),
    );
  };

  const handleDeleteMeeting = (id: string) => {
    setMeetings((prev) => prev.filter((m) => m.id !== id));
  };

  if (!isLoaded) return null;

  return (
    <Shell app={fas} appName="Dual Timezone">
      <div className="min-h-svh bg-white text-slate-900 p-4 md:p-8 max-w-3xl mx-auto font-sans">
        <header className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Dual Timezone
          </h1>
        </header>

        {/* SECTION A: Configuration Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Home Location
            </label>
            <CityCombobox
              placeholder="Select home city..."
              onSelect={setHomeCityId}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Destinations
            </label>
            <CityCombobox
              placeholder="Search & add target city..."
              onSelect={handleAddTarget}
            />
          </div>
        </div>

        {/* SECTION B: Clock Display Container */}
        <ClockPanel
          homeCityId={homeCityId}
          targetCityIds={targetCityIds}
          meetings={meetings}
          onRemoveTarget={handleRemoveTarget}
        />

        {/* SECTION C: Add Meeting Form */}
        <MeetingForm
          homeCityId={homeCityId}
          targetCityIds={targetCityIds}
          onAdd={handleAddMeeting}
        />

        {/* SECTION D: Scheduled Meetings Checklist */}
        <MeetingList
          meetings={meetings}
          homeCityId={homeCityId}
          onToggle={handleToggleMeeting}
          onDelete={handleDeleteMeeting}
        />

        <footer className="mt-12 text-center text-xs text-slate-400 pb-4">
          <p>
            Built for{" "}
            <a
              href="https://freeappstore.online"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-slate-600 transition"
            >
              freeappstore.online
            </a>
          </p>
        </footer>
      </div>
      <BuildInfo />
    </Shell>
  );
}
