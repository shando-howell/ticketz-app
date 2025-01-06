'use client'

import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useStorageUrl } from "@/lib/utils";
import Image from "next/image";
import { StarIcon, MapPin } from "lucide-react";

const EventCard = ({ eventId }: { eventId: Id<"events"> }) => {
    const { user } = useUser();
    const router = useRouter();
    const event = useQuery(api.events.getById, { eventId });
    const availability = useQuery(api.events.getEventAvailabilty, { eventId });

    const userTicket = useQuery(api.tickets.getUserTicketForEvent, {
        eventId,
        userId: user?.id ?? "",
    });

    const queuePosition = useQuery(api.waitingList.getQueuePosition, {
        eventId,
        userId: user?.id ?? ""
    });

    const imageUrl = useStorageUrl(event?.imageStorageId);

    if (!event || !availability) {
        return null;
    }

    const isPastEvent = event.eventDate < Date.now();
    const isEventOwner = user?.id === event?.userId;

    return (
        <>
            <div 
                onClick={() => router.push(`/event/${eventId}`)}
                className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all
                duration-300 border border-gray-100 cursor-pointer overflow-hidden relative
                ${isPastEvent ? "opacity-75 hover:opacity-100" : ""
            }`}
            > 
                {/* Event Image */}
                {imageUrl && (
                    <div className="relative w-full h-48">
                        <Image 
                            src={imageUrl}
                            alt={event.name}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50-to-transparent"/>
                    </div>
                )}

                {/* Event Details */}
                <div className={`p-6 ${imageUrl ? "relative" : ""}`}>
                    <div className="flex justify-between items-start">
                        {/* Event name and owner badge */}
                        <div>
                            <div className="flex flex-col items-start gap-2">
                                {isEventOwner && (
                                    <span className="inline-flex items-center gap-1 bg-blue-600/90 text-white px-2 py-1 rounded-full text-xs font-medium">
                                        <StarIcon className="w-3 h-3" />
                                        Your Event
                                    </span>
                                )}
                                <h2 className="text-2xl font-bold text-gray-900">{event.name}</h2>
                            </div>
                            {isPastEvent && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-2">
                                    Past Event
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Price Tag */}
                    <div className="flex flex-col items-end gap-2 ml-4">
                        <span
                            className={`px-4 py-1.5 font-semibold rounded-full ${
                                isPastEvent
                                    ? "bg-gray-50 text-gray-500"
                                    : "bg-green-50 text-green-700"
                            }`}
                        >
                            ${event.price.toFixed(2)}
                        </span>
                        {availability.purchasedCount >= availability.totalTickets && (
                            <span className="px-4 py-1.5 bg-red-50 text-red-700 font-semibold rounded-full text-sm">
                                Sold Out
                            </span>
                        )}
                    </div>

                    {/* Event Details */}
                    <div className="mt-4 space-y-3">
                        <div className="flex items-center text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>{event.location}</span>
                        </div>
                    </div>
                    
                    {/* Calendar Days*/}
                    <div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default EventCard;