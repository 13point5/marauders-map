/* oxlint-disable jsx-a11y/prefer-tag-over-role -- This is inline editable vector artwork, so role img supplies its accessible name without replacing it with a bitmap. */
import ink from './ink.json';
export function TowerDrawing() {
  return (
    <svg
      className="tower-drawing"
      viewBox="0 0 730 780"
      aria-label="Research Tower: quill-letter walls, six stair flights and an angled entrance vestibule"
      role="img"
    >
      <g strokeLinecap="round" strokeLinejoin="round">
        {ink.map(({ id, ...path }) => (
          <path key={id} {...path} />
        ))}
      </g>
      <g className="tower-label" textAnchor="middle">
        <text x="333" y="282" fontSize="15" letterSpacing="3">
          TVRRIS
        </text>
        <text x="333" y="313" fontSize="27">
          Research
        </text>
        <text x="333" y="341" fontSize="24">
          Tower
        </text>
        <text x="333" y="368" fontSize="12" fontStyle="italic">
          quaerere &amp; invenire
        </text>
        <text x="540" y="624" fontSize="12" letterSpacing="1">
          VESTIBVLVM
        </text>
        <text x="540" y="644" fontSize="11" fontStyle="italic">
          a question begins here
        </text>
      </g>
      <g opacity=".6" fontSize="11" fontStyle="italic">
        <text x="520" y="110" transform="rotate(-28 520 110)">
          per ambages ad lucem
        </text>
        <text x="72" y="524" transform="rotate(-28 72 524)">
          vestigia mentis
        </text>
      </g>
    </svg>
  );
}
