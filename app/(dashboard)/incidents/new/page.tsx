import { CreateIncidentForm } from "@/components/incidents/create-incident-form";

export const metadata = {
  title: "Create Incident | SIMP",
  description: "Create a new incident",
};

export default function CreateIncidentPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Incident</h1>
        <p className="text-muted-foreground">
          Report a new issue or service request
        </p>
      </div>
      <CreateIncidentForm />
    </div>
  );
}
