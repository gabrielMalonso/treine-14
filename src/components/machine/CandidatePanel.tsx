import { candidate } from "@/config/candidate";
import { NumberDisplay } from "./NumberDisplay";

type CandidatePanelProps = {
  digits: string;
};

export function CandidatePanel({ digits }: CandidatePanelProps) {
  return (
    <div className="urna-lcd-body">
      <div className="urna-fields">
        <span className="urna-field-label">Número:</span>
        <NumberDisplay digits={digits} />

        <span className="urna-field-label">Nome:</span>
        <span className="urna-field-value">{candidate.name}</span>

        <span className="urna-field-label">Partido:</span>
        <span className="urna-field-value">{candidate.party}</span>

        <p className="urna-vice">
          {candidate.viceOffice}: <strong>{candidate.viceName}</strong>
        </p>
      </div>

      <div className="urna-lcd-photos">
        <figure className="urna-photo urna-photo-main">
          <img src={candidate.imageUrl} alt={`Fotografia de ${candidate.name}`} draggable={false} />
          <figcaption>{candidate.office}</figcaption>
        </figure>
        <figure className="urna-photo urna-photo-vice">
          <img
            src={candidate.viceImageUrl}
            alt={`Fotografia de ${candidate.viceName}`}
            draggable={false}
          />
          <figcaption>{candidate.viceOffice}</figcaption>
        </figure>
      </div>
    </div>
  );
}
