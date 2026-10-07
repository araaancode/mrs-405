// app/user/notifications/page.jsx
import NotificationsPage from "@/components/notifications/NotificationsPage";

export default function UserNotificationsPage() {
    return <NotificationsPage backHref="/user/profile" backLabel="بازگشت به پروفایل" />;
}