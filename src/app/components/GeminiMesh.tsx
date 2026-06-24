/**
 * Pure CSS Gemini-inspired LED mesh — transform + opacity only.
 * Zero canvas/WebGL. GPU-composited layers for 60 FPS.
 */
export function GeminiMesh() {
  return (
    <div className="gemini-mesh fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden>
      <div className="gemini-blob gemini-blob-green" />
      <div className="gemini-blob gemini-blob-cyan" />
      <div className="gemini-blob gemini-blob-purple" />
      <div className="gemini-blob gemini-blob-accent" />
      <div className="gemini-streak gemini-streak-1" />
      <div className="gemini-streak gemini-streak-2" />
    </div>
  );
}
