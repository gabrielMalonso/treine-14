import { candidate } from "@/config/candidate";

type CandidatePanelProps = {
  visible: boolean;
};

export function CandidatePanel({ visible }: CandidatePanelProps) {
  return (
    <div
      className="grid min-h-0 grid-cols-[minmax(0,1fr)_clamp(7.5rem,28%,11.5rem)] gap-4 max-[430px]:grid-cols-[1fr_7rem]"
      aria-hidden={!visible}
    >
      <div className="min-w-0 self-end">
        <dl
          className={`space-y-2.5 transition-opacity duration-150 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div>
            <dt className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[var(--screen-muted)]">
              Nome
            </dt>
            <dd className="truncate text-xl font-black tracking-tight sm:text-2xl">
              {candidate.name}
            </dd>
          </div>
          <div>
            <dt className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[var(--screen-muted)]">
              Partido
            </dt>
            <dd className="text-base font-extrabold">{candidate.party}</dd>
          </div>
          <div className="inline-flex items-center gap-2 rounded-lg bg-[#171a16] px-3 py-1.5 text-[#f7f5e9]">
            <span className="text-[0.62rem] font-bold uppercase tracking-widest opacity-70">
              Número
            </span>
            <strong className="font-mono text-xl">{candidate.number}</strong>
          </div>
        </dl>
      </div>

      <div
        className={`relative aspect-[5/6] self-end overflow-hidden rounded-xl border-2 border-[#85887f] bg-[#dedbce] shadow-inner transition-opacity duration-150 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <img
          src={candidate.imageUrl}
          alt={visible ? `Fotografia de ${candidate.name}` : ""}
          className="size-full object-cover"
          draggable={false}
        />
        <span className="absolute inset-x-2 bottom-2 rounded-md bg-black/68 px-2 py-1 text-center text-[0.56rem] font-bold uppercase tracking-wider text-white">
          Foto substituível
        </span>
      </div>
    </div>
  );
}
