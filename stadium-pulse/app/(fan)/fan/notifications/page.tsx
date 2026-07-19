import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NotificationCard, type NotificationItem } from "@/components/notifications/NotificationCard";

const notifications = [
  {
    id: "1",
    type: "alert",
    title: "Zone B Near Capacity",
    body: "Zone B is at 91% occupancy. Consider using alternate routes via Gate 7.",
    time: "2 min ago",
    read: false,
  },
  {
    id: "2",
    type: "info",
    title: "Half-Time Break in 15 minutes",
    body: "Food courts will be busy. Pre-order now to skip the queue.",
    time: "10 min ago",
    read: false,
  },
  {
    id: "3",
    type: "update",
    title: "Shuttle Bay A Now Available",
    body: "New shuttle service to Metro Station has started. Next departure in 5 minutes.",
    time: "25 min ago",
    read: false,
  },
  {
    id: "4",
    type: "alert",
    title: "Restroom C3 Closed",
    body: "Restroom C3 in Zone C is temporarily closed for maintenance. Use Restroom C1 instead.",
    time: "45 min ago",
    read: true,
  },
  {
    id: "5",
    type: "info",
    title: "Welcome to the Stadium!",
    body: "Enjoy the match! Use the AI Assistant for navigation help in English, Hindi, or Marathi.",
    time: "1 hr ago",
    read: true,
  },
  {
    id: "6",
    type: "update",
    title: "Gates Open",
    body: "All gates are now open for entry. Show your ticket QR code at the gate scanner.",
    time: "2 hrs ago",
    read: true,
  },
];

export default function NotificationsPage() {
  const unread = notifications.filter((n) => !n.read);
  const read = notifications.filter((n) => n.read);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 md:pb-12 font-sans space-y-6">
      <Link
        href="/fan"
        className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#00f2ff] hover:underline"
      >
        <ArrowLeft size={14} /> Back to Fan Dashboard
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1d2022] border border-[#3a494b]/40 p-5 rounded-2xl shadow-xl">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Notifications Center
          </h2>
          <p className="text-xs sm:text-sm text-[#b9cacb] font-mono mt-1">
            {unread.length} new unread updates
          </p>
        </div>
        <button
          type="button"
          className="text-xs font-mono font-bold text-[#00f2ff] hover:underline"
        >
          Mark all read
        </button>
      </div>

      {/* Unread */}
      {unread.length > 0 && (
        <section>
          <h3 className="text-xs font-mono font-bold text-[#00f2ff] uppercase tracking-wider mb-2 px-1">
            New System Alerts
          </h3>
          <div className="space-y-2.5">
            {unread.map((n) => (
              <NotificationCard key={n.id} notification={n as NotificationItem} isUnread />
            ))}
          </div>
        </section>
      )}

      {/* Read */}
      {read.length > 0 && (
        <section>
          <h3 className="text-xs font-mono font-semibold text-[#b9cacb] uppercase tracking-wider mb-2 px-1">
            Earlier Notifications
          </h3>
          <div className="space-y-2">
            {read.map((n) => (
              <NotificationCard key={n.id} notification={n as NotificationItem} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
