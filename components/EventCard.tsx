'use client'

import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getById } from "@/convex/events";

const EventCard = ({ eventId }: { eventId: Id<"events"> }) => {
    const { user } = useUser();
    const router = useRouter();
    const event = useQuery(api.events.getById, { eventId });
    const availability = useQuery(api.events.getEventAvailabilty, { eventId });

    const userTicket = useQuery(api.tickets.getUserTicketForEvent, {
        eventId,
        userId: user?.id ?? "",
    });

    return (
        <>
            <h1>Event Card</h1>
        </>
    )
}

export default EventCard;