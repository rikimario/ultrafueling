export function getAvatarUrl(userId: string, ext: "jpg") {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${userId}/avatar.${ext}`;
}
