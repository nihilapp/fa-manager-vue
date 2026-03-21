import { getHeader } from 'h3';

export function readRequestHeader(event: H3Event, name: string): string | undefined {
  const headers = event.req?.headers as { get?: (headerName: string) => string | null } | undefined;

  if (typeof headers?.get === 'function') {
    return headers.get(name) ?? undefined;
  }

  return getHeader(event, name) ?? undefined;
}

export function getDiscordId(event: H3Event): string | undefined {
  return readRequestHeader(event, 'x-discord-id');
}
