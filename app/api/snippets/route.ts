import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const search = request.nextUrl.searchParams.get("search") ?? "";

  const snippets = await prisma.snippet.findMany({
    where: {
      userId: session.user.id,
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { code: { contains: search, mode: "insensitive" } },
              { tags: { has: search.toLowerCase() } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(snippets);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, code, language, tags } = body;

  if (!title || !code) {
    return Response.json({ error: "Title and code are required" }, { status: 400 });
  }

  const snippet = await prisma.snippet.create({
    data: {
      title,
      code,
      language: language ?? "javascript",
      tags: Array.isArray(tags) ? tags : [],
      userId: session.user.id,
    },
  });

  return Response.json(snippet, { status: 201 });
}
