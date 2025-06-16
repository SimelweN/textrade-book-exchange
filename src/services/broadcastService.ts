import { supabase } from "@/integrations/supabase/client";
import { Broadcast } from "@/types/broadcast"; // Ensure this type is updated as well

// Helper to map Supabase broadcast to our Broadcast type
const mapSupabaseBroadcast = (sbBroadcast: any): Broadcast => ({
  id: sbBroadcast.id,
  title: sbBroadcast.title,
  message: sbBroadcast.message,
  type: sbBroadcast.type,
  priority: sbBroadcast.priority,
  targetAudience: sbBroadcast.target_audience,
  active: sbBroadcast.active,
  createdBy: sbBroadcast.created_by,
  createdAt: sbBroadcast.created_at,
  expiresAt: sbBroadcast.expires_at,
});

export const broadcastService = {
  createBroadcast: async (
    broadcastData: Omit<Broadcast, "id" | "createdAt" | "updatedAt">,
  ): Promise<Broadcast> => {
    try {
      const { data, error } = await supabase
        .from("broadcasts")
        .insert([
          {
            title: broadcastData.title,
            message: broadcastData.message,
            type: broadcastData.type,
            priority: broadcastData.priority,
            target_audience: broadcastData.targetAudience,
            active: broadcastData.active,
            created_by: broadcastData.createdBy,
            expires_at: broadcastData.expiresAt,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating broadcast:", error);
        throw new Error(`Failed to create broadcast: ${error.message}`);
      }
      if (!data) {
        throw new Error("No data returned after creating broadcast");
      }
      return mapSupabaseBroadcast(data);
    } catch (error) {
      console.error("Broadcast creation failed:", error);
      throw error instanceof Error
        ? error
        : new Error("Unknown error occurred");
    }
  },

  getBroadcasts: async (): Promise<Broadcast[]> => {
    try {
      const { data, error } = await supabase
        .from("broadcasts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching broadcasts:", error);
        return [];
      }
      return data?.map(mapSupabaseBroadcast) || [];
    } catch (error) {
      console.error("Failed to fetch broadcasts:", error);
      return [];
    }
  },

  getActiveBroadcasts: async (): Promise<Broadcast[]> => {
    try {
      const { data, error } = await supabase
        .from("broadcasts")
        .select("*")
        .eq("active", true)
        .or("expires_at.is.null,expires_at.gt.now()")
        .order("priority", { ascending: false }) // Ensure priority enum matches DB
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching active broadcasts:", error);
        return [];
      }
      return data?.map(mapSupabaseBroadcast) || [];
    } catch (error) {
      console.error("Failed to fetch active broadcasts:", error);
      return [];
    }
  },

  updateBroadcast: async (
    id: string,
    updates: Partial<
      Omit<Broadcast, "id" | "createdAt" | "createdBy" | "updatedAt">
    >,
  ): Promise<Broadcast> => {
    try {
      const updateData: any = {};
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.message !== undefined) updateData.message = updates.message;
      if (updates.type !== undefined) updateData.type = updates.type;
      if (updates.priority !== undefined)
        updateData.priority = updates.priority;
      if (updates.targetAudience !== undefined)
        updateData.target_audience = updates.targetAudience;
      if (updates.active !== undefined) updateData.active = updates.active;
      if (updates.expiresAt !== undefined)
        updateData.expires_at = updates.expiresAt;
      // created_by should not be updatable here

      const { data, error } = await supabase
        .from("broadcasts")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating broadcast:", error);
        throw new Error(`Failed to update broadcast: ${error.message}`);
      }
      if (!data) {
        throw new Error("No data returned after updating broadcast");
      }
      return mapSupabaseBroadcast(data);
    } catch (error) {
      console.error("Broadcast update failed:", error);
      throw error instanceof Error
        ? error
        : new Error("Unknown error occurred");
    }
  },

  deleteBroadcast: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase.from("broadcasts").delete().eq("id", id);

      if (error) {
        console.error("Error deleting broadcast:", error);
        throw new Error(`Failed to delete broadcast: ${error.message}`);
      }
    } catch (error) {
      console.error("Broadcast deletion failed:", error);
      throw error instanceof Error
        ? error
        : new Error("Unknown error occurred");
    }
  },

  // --- New functions for BroadcastManager ---
  getLatestBroadcast: async (): Promise<Broadcast | null> => {
    // This should fetch the highest priority, active, non-expired broadcast
    // that applies to the current user (or 'all').
    // For simplicity, let's get the most recent active one for now.
    // A more robust implementation would consider priority and target audience.
    try {
      const { data, error } = await supabase
        .from("broadcasts")
        .select("*")
        .eq("active", true)
        .or("expires_at.is.null,expires_at.gt.now()")
        // .order('priority', { ascending: false }) // Needs careful mapping of enum to sort order
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        // Properly serialize the error object for logging
        const errorDetails = {
          message: error.message || "Unknown error",
          code: error.code || "NO_CODE",
          details: error.details || "No details",
          hint: error.hint || "No hint",
        };
        console.error("Error fetching latest broadcast:", errorDetails);
        return null;
      }
      return data ? mapSupabaseBroadcast(data) : null;
    } catch (error) {
      // Properly handle and log caught exceptions
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Failed to fetch latest broadcast:", errorMessage);
      if (error instanceof Error && error.stack) {
        console.error("Stack trace:", error.stack);
      }
      return null;
    }
  },

  hasBroadcastBeenViewed: async (
    userId: string,
    broadcastId: string,
  ): Promise<boolean> => {
    // This needs a mechanism to store viewed broadcasts per user.
    // E.g., a 'user_viewed_broadcasts' table or using local storage for guests.
    // For now, we'll simulate with localStorage for simplicity if no user.
    // If there's a user, ideally check a DB table.
    // Let's assume for now a `viewed_broadcasts` table: user_id, broadcast_id, viewed_at
    console.log(
      `Checking if user ${userId} viewed broadcast ${broadcastId}. Placeholder.`,
    );
    // Placeholder: for real implementation, query a table like `user_broadcast_views`
    // const { data, error } = await supabase
    //   .from('user_broadcast_views')
    //   .select('id')
    //   .eq('user_id', userId)
    //   .eq('broadcast_id', broadcastId)
    //   .maybeSingle();
    // return !!data;
    const viewedInStorage = JSON.parse(
      localStorage.getItem("viewedBroadcasts") || "[]",
    );
    if (viewedInStorage.includes(broadcastId)) return true;

    // If a real user, check a (hypothetical) user_broadcast_views table
    // For now, returning false as we don't have this table.
    return false;
  },

  dismissBroadcast: async (
    userId: string,
    broadcastId: string,
  ): Promise<void> => {
    // Mark broadcast as viewed for the user.
    // If guest, could use localStorage. If logged in, update DB.
    console.log(
      `User ${userId} dismissed broadcast ${broadcastId}. Placeholder.`,
    );
    // Placeholder: for real implementation, insert into `user_broadcast_views`
    // await supabase.from('user_broadcast_views').insert([{ user_id: userId, broadcast_id: broadcastId }]);
    const viewedBroadcasts = JSON.parse(
      localStorage.getItem("viewedBroadcasts") || "[]",
    );
    if (!viewedBroadcasts.includes(broadcastId)) {
      viewedBroadcasts.push(broadcastId);
      localStorage.setItem(
        "viewedBroadcasts",
        JSON.stringify(viewedBroadcasts),
      );
    }
  },

  saveBroadcastToNotifications: async (
    broadcast: Broadcast,
    userId: string,
  ): Promise<void> => {
    // Save this broadcast as a notification for the user.
    // This would typically involve inserting into a 'notifications' table.
    try {
      await supabase.from("notifications").insert({
        user_id: userId,
        title: `System Announcement: ${broadcast.title}`,
        message: broadcast.message,
        type: "broadcast", // or map broadcast.type to a notification type
        // You might want to add a link or reference to the broadcast itself
      });
      console.log(
        `Broadcast ${broadcast.id} saved to notifications for user ${userId}`,
      );
    } catch (error) {
      console.error(
        `Failed to save broadcast ${broadcast.id} to notifications for user ${userId}:`,
        error,
      );
    }
  },
};

// Named exports for backward compatibility and new functions
export const {
  createBroadcast,
  getBroadcasts,
  getActiveBroadcasts,
  updateBroadcast,
  deleteBroadcast,
  getLatestBroadcast,
  hasBroadcastBeenViewed,
  dismissBroadcast,
  saveBroadcastToNotifications,
} = broadcastService;
