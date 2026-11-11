// One logo everywhere: a tile with a dashed cut line and the subject lifted from its corner.
// Tile and mark use the theme tokens, so it inverts with light/dark. `onInk` is for the always-dark footer.
export function Logo({ onInk = false }: { onInk?: boolean }) {
  const tile = onInk ? "bg-[#eff3ef]" : "bg-ink";
  const mark = onInk ? "border-[#0f1511]" : "border-ground";
  const dot = onInk ? "bg-[#0f1511]" : "bg-ground";
  return (
    <span aria-hidden className={`relative inline-block h-8 w-8 shrink-0 rounded-md ${tile}`}>
      <span className={`absolute left-[6px] top-[6px] h-[15px] w-[15px] rounded-[3px] border-2 border-dashed opacity-80 ${mark}`} />
      <span className={`absolute bottom-[5px] right-[5px] h-3 w-3 rounded-full ${dot}`} />
    </span>
  );
}
