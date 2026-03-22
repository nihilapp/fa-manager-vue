const PUBLIC_PATHS = new Set([
  '/block',
  '/favicon.ico',
  '/robots.txt',
]);

function shouldBypassAccessCheck(pathname: string): boolean {
  if (pathname.startsWith('/api')) {
    return true;
  }

  if (pathname.startsWith('/_nuxt')) {
    return true;
  }

  if (pathname.startsWith('/__nuxt')) {
    return true;
  }

  if (pathname.startsWith('/images')) {
    return true;
  }

  return PUBLIC_PATHS.has(pathname);
}

export default defineEventHandler(async (event) => {
  const pathname = getRequestURL(event).pathname;

  if (shouldBypassAccessCheck(pathname)) {
    return;
  }

  const accessResponse = await checkCommunityAccess(event);

  if (accessResponse.error) {
    return sendRedirect(event, '/block');
  }
});
