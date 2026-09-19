// app/hall_owner/reservations/components/StatusBadge.jsx
import { PiHourglass, PiCheckCircle, PiXCircle, PiClock } from "react-icons/pi";

const CONFIG = {
    pending: { label: "در انتظار تایید", color: "#B45309", bg: "#FEF3C7", border: "#FCD34D", Icon: PiHourglass },
    accepted: { label: "تایید شده", color: "#047857", bg: "#D1FAE5", border: "#6EE7B7", Icon: PiCheckCircle },
    rejected: { label: "رد شده", color: "#B91C1C", bg: "#FEE2E2", border: "#FCA5A5", Icon: PiXCircle },
    canceled: { label: "لغو شده", color: "#4B5563", bg: "#F3F4F6", border: "#D1D5DB", Icon: PiXCircle },
    default: { label: "نامشخص", color: "#4B5563", bg: "#F3F4F6", border: "#D1D5DB", Icon: PiClock },
};

export default function StatusBadge({ status, size = "md" }) {
    const cfg = CONFIG[status] || CONFIG.default;
    const { Icon, label, color, bg, border } = cfg;

    const pad = size === "sm" ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-sm";
    const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full font-bold ${pad}`}
            style={{ background: bg, color, border: `1px solid ${border}` }}
        >
            <Icon className={iconSize} />
            {label}
        </span>
    );
}