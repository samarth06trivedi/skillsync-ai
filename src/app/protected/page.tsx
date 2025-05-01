// app/protected/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function ProtectedPage() {
  const session = await getServerSession(authOptions);
  if (!session) return <div>Access Denied</div>;

  return <div>Welcome, {session.user?.email}</div>;
}
