import { auth } from "@/lib/auth/auth-config";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { Suspense } from "react";
import KnowledgeGraphClient from "./KnowledgeGraphClient";

async function KnowledgeGraphContent() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  // Fetch fresh user data from database
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, role: true },
  });

  return <KnowledgeGraphClient user={user} />;
}

export default function KnowledgeGraphPage() {
  return (
    <Suspense fallback={
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Knowledge Graph Visualization
          </h1>
          <p className="text-gray-600 mt-2">
            Loading knowledge graph...
          </p>
        </div>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    }>
      <KnowledgeGraphContent />
    </Suspense>
  );
}
