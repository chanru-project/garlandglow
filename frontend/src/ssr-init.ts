// Ensure window.$_TSR is initialized before any @tanstack React Start/router code runs.
if (typeof window !== "undefined") {
  const win = window as unknown as any;

  win.$_TSR = win.$_TSR || {};
  win.$_TSR.router = win.$_TSR.router || {
    manifest: { routes: {} },
    matches: [],
    dehydratedData: {},
    lastMatchId: undefined,
  };

  if (!win.$_TSR.h) win.$_TSR.h = () => {};
  if (!win.$_TSR.e) win.$_TSR.e = () => {};
  if (!win.$_TSR.c) win.$_TSR.c = () => {};
  if (!win.$_TSR.p) win.$_TSR.p = (cb: () => void) => {
    try {
      cb();
    } catch {
      /* ignore */
    }
  };
  if (!Array.isArray(win.$_TSR.buffer)) win.$_TSR.buffer = [];
}
