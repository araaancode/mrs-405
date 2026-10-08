import HallWizard from "@/app/hall_owner/halls/create/components/HallWizard";

export const metadata = {
  title: "ویرایش تالار",
  description: "اطلاعات تالار خود را ویرایش کنید",
};

export default function EditHallPage({ params }) {
  return <HallWizard mode="edit" hallId={params.id} />;
}