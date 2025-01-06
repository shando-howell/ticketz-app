import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { WAITING_LIST_STATUS } from "./constants";

export const getQueuePosition = query({
    args: {
        eventId: v.id("events"),
        userId: v.string()
    },
    handler: async (ctx, { eventId, userId }) => {
        // Get entry for this specific user and event combination
        const entry = await ctx.db
            .query("waitingList")
            .withIndex("by_user_event", (q) => 
                q.eq("userId", userId).eq("eventId", eventId)
            )
            .filter((q) => q.neq(q.field("status"), WAITING_LIST_STATUS.EXPIRED))
            .first();

            if (!entry) return null;

        // Get total number of people ahead in line
        const peopleAhead = await ctx.db
            .query("waitingList")
            .withIndex("by_event_status", (q) => q.eq("eventId", eventId))
            .filter((q) => 
                q.and(
                    // Created before this entry, get all entries before this one
                    q.lt(q.field("_creationTime"), entry._creationTime),
                    // Only get entries that are either waiting or offered
                    q.or(
                        q.eq(q.field("status"), WAITING_LIST_STATUS.WAITING),
                        q.eq(q.field("status"), WAITING_LIST_STATUS.OFFERED)
                    )
                )
            )
            .collect()
            .then((entries) => entries.length);

            return {
                ...entry,
                position: peopleAhead + 1
            }

        if (!entry) return null;
    }
})