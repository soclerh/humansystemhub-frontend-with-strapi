import RegisterTrialForm from "@/components/get-started/RegisterTrialForm";

export const metadata = {
  title: "Get Started — Socle RH | Human Systems",
  description:
    "Start your free Human Systems trial. Create your company workspace and our team will reach out within 48 hours.",
};

export default async function GetStartedPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  // Keep the param contract consistent with the rest of the [lang] routes.
  await params;

  return (
    <main className="min-h-screen bg-white">
      <RegisterTrialForm />
    </main>
  );
}
