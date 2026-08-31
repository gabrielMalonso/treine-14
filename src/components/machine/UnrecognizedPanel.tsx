import { NumberDisplay } from "./NumberDisplay";

type UnrecognizedPanelProps = {
  digits: string;
};

export function UnrecognizedPanel({ digits }: UnrecognizedPanelProps) {
  return (
    <div className="urna-wrong">
      <div className="urna-wrong-number">
        <span className="urna-field-label">Número:</span>
        <NumberDisplay digits={digits} />
      </div>

      <div className="urna-wrong-message" role="alert">
        <p className="urna-wrong-title">NÚMERO ERRADO</p>
        <p className="urna-wrong-sub">O Brasil vai dar errado.</p>
      </div>
    </div>
  );
}
