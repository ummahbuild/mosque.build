export type WorkspaceTool = { id: string; label: string; eyebrow: string };

export function workspaceSlug(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "").slice(0, 80);
}

export function workspaceId(preferred: string, label: string, index: number, taken: (id: string) => boolean) {
  const base = `tool-${workspaceSlug(label) || index + 1}`;
  let id = preferred || base, suffix = 2;
  while (taken(id)) id = `${base}-${suffix++}`;
  return id;
}

export function filterWorkspaceTools(tools: WorkspaceTool[], query: string) {
  const words = workspaceSlug(query).split("-").filter(Boolean);
  return tools.filter(tool => {
    const text = workspaceSlug(`${tool.label} ${tool.eyebrow}`);
    return words.every(word => text.includes(word));
  });
}

export function workspaceHashId(hash: string) {
  try { return decodeURIComponent(hash.replace(/^#/, "")); } catch { return ""; }
}

export function workspaceScrollTop(targetTop: number, scrollY: number, header: number, pageNav: number, toolsNav: number) {
  return Math.max(0, targetTop + scrollY - header - pageNav - toolsNav - 16);
}
