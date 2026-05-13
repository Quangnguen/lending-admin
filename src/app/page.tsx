import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession();
  const role = (session?.user as { role?: string })?.role;

  if (role === "VERIFIER") {
    redirect("/verifier");
  } else {
    redirect("/admin");
  }
}
