import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getLatestBroadcast,
  hasBroadcastBeenViewed,
  dismissBroadcast,
  saveBroadcastToNotifications,
} from "@/services/broadcastService";
import { Broadcast } from "@/types/broadcast";
import BroadcastDialog from "./BroadcastDialog";

const BroadcastManager = () => {
  const [currentBroadcast, setCurrentBroadcast] = useState<Broadcast | null>(
    null,
  );
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<number>(0);

  // Always call useAuth - if it fails, the component will fail gracefully
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const checkForBroadcasts = async () => {
      // Prevent rapid successive calls (debounce with 5 second minimum interval)
      const now = Date.now();
      if (now - lastCheckTime < 5000) {
        console.log(
          "⏱️ [BroadcastManager] Skipping broadcast check - too soon",
        );
        return;
      }

      // Prevent concurrent requests
      if (isLoading) {
        console.log(
          "⏱️ [BroadcastManager] Skipping broadcast check - already loading",
        );
        return;
      }

      setIsLoading(true);
      setLastCheckTime(now);

      try {
        console.log("🔄 [BroadcastManager] Checking for broadcasts...");
        const latestBroadcast = await getLatestBroadcast();

        if (!latestBroadcast) {
          console.log("ℹ️ [BroadcastManager] No active broadcasts found");
          return;
        }

        console.log(
          "📢 [BroadcastManager] Found broadcast:",
          latestBroadcast.title,
        );

        // Check if user has seen this broadcast (using localStorage for guests)
        if (isAuthenticated && user) {
          const hasViewed = await hasBroadcastBeenViewed(
            user.id,
            latestBroadcast.id,
          );
          if (!hasViewed) {
            setCurrentBroadcast(latestBroadcast);
            setShowBroadcast(true);
            // Save to notifications for logged-in users - fix parameter order
            try {
              await saveBroadcastToNotifications(latestBroadcast, user.id);
              console.log(
                "✅ [BroadcastManager] Broadcast saved to notifications",
              );
            } catch (notifError) {
              console.warn(
                "⚠️ [BroadcastManager] Failed to save to notifications:",
                notifError instanceof Error
                  ? notifError.message
                  : String(notifError),
              );
            }
          } else {
            console.log(
              "ℹ️ [BroadcastManager] User has already viewed this broadcast",
            );
          }
        } else {
          // For guests, use localStorage
          const viewedBroadcasts = JSON.parse(
            localStorage.getItem("viewedBroadcasts") || "[]",
          );

          if (!viewedBroadcasts.includes(latestBroadcast.id)) {
            setCurrentBroadcast(latestBroadcast);
            setShowBroadcast(true);
            console.log(
              "✅ [BroadcastManager] Showing broadcast to guest user",
            );
          } else {
            console.log(
              "ℹ️ [BroadcastManager] Guest has already viewed this broadcast",
            );
          }
        }
      } catch (error) {
        // Broadcasts are optional - don't spam console with errors
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.log(
          "ℹ️ [BroadcastManager] Broadcast check skipped due to error:",
          errorMessage,
        );
      } finally {
        setIsLoading(false);
      }
    };

    // Only check for broadcasts if not already loading and if enough time has passed
    checkForBroadcasts();
  }, [isAuthenticated, user?.id]); // Only depend on user ID, not the full user object

  const handleDismiss = async () => {
    if (!currentBroadcast) return;

    if (isAuthenticated && user) {
      await dismissBroadcast(user.id, currentBroadcast.id);
    } else {
      // For guests, store in localStorage
      const viewedBroadcasts = JSON.parse(
        localStorage.getItem("viewedBroadcasts") || "[]",
      );
      viewedBroadcasts.push(currentBroadcast.id);
      localStorage.setItem(
        "viewedBroadcasts",
        JSON.stringify(viewedBroadcasts),
      );
    }

    setShowBroadcast(false);
    setCurrentBroadcast(null);
  };

  if (!currentBroadcast || !showBroadcast) {
    return null;
  }

  return (
    <BroadcastDialog
      broadcast={currentBroadcast}
      isOpen={showBroadcast}
      onDismiss={handleDismiss}
    />
  );
};

export default BroadcastManager;
