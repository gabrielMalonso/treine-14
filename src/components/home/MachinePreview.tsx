const previewDigits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", ""];

export function MachinePreview() {
  return (
    <div
      className="relative mx-auto w-full max-w-[36rem] rotate-[-1deg] rounded-[2rem] border border-white/40 bg-[var(--machine-body)] p-4 shadow-[var(--shadow-machine)] sm:p-5"
      aria-hidden="true"
    >
      <div className="grid grid-cols-[1.25fr_0.75fr] gap-3 sm:gap-4">
        <div className="flex min-h-[15rem] flex-col rounded-2xl border-2 border-[#9d998d] bg-[var(--machine-screen)] p-4 text-[#171a16] shadow-inner">
          <p className="text-[0.55rem] font-black uppercase tracking-[0.18em] text-[#6d7169]">
            Equipamento de treino
          </p>
          <p className="mt-1 text-lg font-black">TREINE O 14</p>
          <p className="mt-5 text-[0.58rem] font-bold uppercase tracking-wider text-[#6d7169]">
            Número
          </p>
          <div className="mt-1 flex gap-1.5">
            <span className="grid size-12 place-items-center rounded-md border-2 border-[#55594f] bg-white font-mono text-2xl font-black">
              1
            </span>
            <span className="grid size-12 place-items-center rounded-md border-2 border-[#55594f] bg-white font-mono text-2xl font-black">
              4
            </span>
          </div>
          <div className="mt-auto">
            <p className="text-lg font-black">Renan Santos</p>
            <p className="text-xs font-bold">MISSÃO</p>
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-2xl bg-black/5 p-2 sm:p-3">
          <div className="grid grid-cols-3 gap-1.5">
            {previewDigits.map((digit, index) =>
              digit ? (
                <span
                  key={`${digit}-${index}`}
                  className="grid aspect-square place-items-center rounded-md bg-[#252924] font-mono text-sm font-black text-white shadow-[0_3px_0_#0c0e0c]"
                >
                  {digit}
                </span>
              ) : (
                <span key={`empty-${index}`} />
              )
            )}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            <span className="rounded-md bg-[var(--correction)] py-2 text-center text-[0.46rem] font-black text-[#171a16]">
              CORRIGE
            </span>
            <span className="rounded-md bg-[var(--confirm)] py-2 text-center text-[0.46rem] font-black text-[#171a16]">
              CONFIRMA
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
