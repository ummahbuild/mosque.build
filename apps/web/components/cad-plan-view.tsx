"use client";
import { wallLength, type CadDocument, type Point2 } from "@/lib/cad-authoring-core";
import { cadPlanOpenings } from "@/lib/cad-plan-projection";

function SelectionBounds({start, end}: {start: Point2; end: Point2}) {
  // SVG lines alone have a zero-width/height layout box on axis-aligned walls.
  // Give each keyboard/pointer target a real box without changing its geometry.
  return <rect x={Math.min(start.x,end.x)-.04} y={Math.min(start.y,end.y)-.04}
    width={Math.abs(end.x-start.x)+.08} height={Math.abs(end.y-start.y)+.08}
    fill="transparent" pointerEvents="none"/>;
}

export function CadPlanView({doc, selected, select}: {doc: CadDocument; selected: string; select: (id: string) => void}) {
  const points = doc.walls.flatMap(wall => [wall.start, wall.end]);
  const minX = Math.min(...points.map(point => point.x)) - 1;
  const minY = Math.min(...points.map(point => point.y)) - 1;
  const width = Math.max(4, Math.max(...points.map(point => point.x)) - minX + 1);
  const height = Math.max(4, Math.max(...points.map(point => point.y)) - minY + 1);
  const keyboard = (event: React.KeyboardEvent, id: string) => {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); select(id); }
  };
  return <svg className="cadPlan" viewBox={`${minX} ${minY} ${width} ${height}`} role="group" aria-label={`Editable ${doc.level.name} wall and opening plan`}>
    {doc.walls.map(wall => <g key={wall.id} role="button" tabIndex={0} aria-pressed={selected === wall.id}
      aria-label={`${wall.name}, ${wallLength(wall).toFixed(2)} metres`} onClick={() => select(wall.id)} onKeyDown={event => keyboard(event, wall.id)}>
      <SelectionBounds start={wall.start} end={wall.end}/>
      <line className="cadPlanHit" x1={wall.start.x} y1={wall.start.y} x2={wall.end.x} y2={wall.end.y}/>
      <line className="cadPlanWall" x1={wall.start.x} y1={wall.start.y} x2={wall.end.x} y2={wall.end.y} strokeWidth={wall.thicknessM}/>
    </g>)}
    {cadPlanOpenings(doc).map(opening => <g key={opening.id} role="button" tabIndex={0} aria-pressed={selected === opening.id}
      aria-label={`${opening.name}, ${opening.kind}, ${opening.widthM.toFixed(2)} metres wide`} onClick={() => select(opening.id)} onKeyDown={event => keyboard(event, opening.id)}>
      <SelectionBounds start={opening.start} end={opening.end}/>
      <line className="cadPlanOpeningGap" x1={opening.start.x} y1={opening.start.y} x2={opening.end.x} y2={opening.end.y} strokeWidth={opening.thicknessM + .05}/>
      <line className="cadPlanHit" x1={opening.start.x} y1={opening.start.y} x2={opening.end.x} y2={opening.end.y}/>
      <line className="cadPlanOpening" x1={opening.start.x} y1={opening.start.y} x2={opening.end.x} y2={opening.end.y}/>
    </g>)}
  </svg>;
}
