export function isClerkConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
}

export function isClerkServerConfigured() {
  return Boolean(process.env.CLERK_SECRET_KEY);
}
