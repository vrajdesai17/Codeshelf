import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const snippet = await prisma.snippet.findUnique({ where: { id } });

  if (!snippet || snippet.userId !== session.user.id) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json(snippet);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.snippet.findUnique({ where: { id } });

  if (!existing || existing.userId !== session.user.id) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();
  const { title, code, language, tags } = body;

  const snippet = await prisma.snippet.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(code !== undefined && { code }),
      ...(language !== undefined && { language }),
      ...(tags !== undefined && { tags: Array.isArray(tags) ? tags : [] }),
    },
  });

  return Response.json(snippet);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.snippet.findUnique({ where: { id } });

  if (!existing || existing.userId !== session.user.id) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.snippet.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
