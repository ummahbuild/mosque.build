/** Browser scheduling only: scenes, cameras and domain models stay with the caller. */
export type RenderLoopEnvironment = {
  requestFrame: (callback: () => void) => number;
  cancelFrame: (id: number) => void;
  isHidden: () => boolean;
  onVisibilityChange: (callback: () => void) => () => void;
  observeVisibility: (element: Element, callback: (visible: boolean) => void) => () => void;
};

const browserEnvironment: RenderLoopEnvironment = {
  requestFrame: callback => requestAnimationFrame(callback),
  cancelFrame: id => cancelAnimationFrame(id),
  isHidden: () => document.hidden,
  onVisibilityChange(callback) {
    document.addEventListener("visibilitychange", callback);
    return () => document.removeEventListener("visibilitychange", callback);
  },
  observeVisibility(element, callback) {
    if (typeof IntersectionObserver === "undefined") {
      callback(true);
      return () => {};
    }
    const observer = new IntersectionObserver(entries => {
      // A batch can contain multiple changes for the same target; use the latest.
      const entry = entries.filter(entry => entry.target === element).at(-1);
      if (entry) callback(entry.isIntersecting);
    });
    observer.observe(element);
    return () => observer.disconnect();
  },
};

/** Pause offscreen/hidden previews without destroying camera state or WebGL resources. */
export function startVisibleRenderLoop(
  element: Element,
  draw: () => void,
  environment: RenderLoopEnvironment = browserEnvironment,
): () => void {
  let visible = false;
  let disposed = false;
  let frame: number | null = null;
  let generation = 0;
  const active = () => !disposed && visible && !environment.isHidden();

  function schedule() {
    if (frame !== null || !active()) return;
    const scheduledGeneration = generation;
    frame = environment.requestFrame(() => {
      // An already-dispatched callback must not restart a paused or disposed loop,
      // or clear the handle of a newer frame after a rapid hide/show transition.
      if (disposed || scheduledGeneration !== generation) return;
      frame = null;
      if (!active()) return;
      draw();
      schedule();
    });
  }

  function synchronize() {
    if (active()) schedule();
    else {
      generation++;
      if (frame !== null) environment.cancelFrame(frame);
      frame = null;
    }
  }

  const stopVisibility = environment.onVisibilityChange(synchronize);
  const stopObserving = environment.observeVisibility(element, nextVisible => {
    visible = nextVisible;
    synchronize();
  });
  return () => {
    if (disposed) return;
    disposed = true;
    synchronize();
    stopVisibility();
    stopObserving();
  };
}
