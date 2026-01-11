import { ModuleAppAgendaProfile } from "@/modules/app/agenda-profile";

export default async function AgendaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ModuleAppAgendaProfile agendaId={id} />;
}
