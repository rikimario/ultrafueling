import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  revalidatePath("/get-started");
  // revalidateTag('profile');
  return Response.json({ revalidated: true });
}
