import HallWizard from "./components/HallWizard";

export const metadata = {
  title: "ایجاد تالار جدید",
  description: "اطلاعات کامل تالار خود را وارد کنید",
};

export default function CreateHallPage() {
  return <HallWizard mode="create" />;
}