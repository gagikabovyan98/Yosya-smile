import { redirect } from "next/navigation";
import { Experience } from "@/components/experience/Experience";
import { consumeEntryToken } from "@/lib/session";

export default async function ExperiencePage({ searchParams }: { searchParams: Promise<{ entry?: string }> }) {
  const { entry } = await searchParams;
  if (!consumeEntryToken(entry)) redirect("/login");
  return <Experience />;
}
