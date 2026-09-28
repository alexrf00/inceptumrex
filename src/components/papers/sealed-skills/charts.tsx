// The research paper's Figure 3, redrawn in the site's print: substantial
// extraction by attack category, without the guard instruction (an open bar)
// and with it (a solid bar). Values are the paper's, from results/summary.json
// in github.com/alexrf00/sealed-skills; percentages of conversations.

const CATEGORIES = ["direct", "authority", "transform", "indirect", "tool", "multi-turn"] as const

const DATA: { model: string; noGuard: number[]; guard: number[] }[] = [
  {
    model: "Llama 3.1 8B",
    noGuard: [78.1, 75.0, 77.1, 62.5, 50.0, 75.0],
    guard: [53.1, 6.2, 16.7, 6.2, 37.5, 3.1],
  },
  {
    model: "Qwen 2.5 7B",
    noGuard: [100, 96.9, 70.8, 43.8, 31.2, 84.4],
    guard: [62.5, 40.6, 45.8, 50.0, 0, 56.2],
  },
]

const W = 720
const PANEL_W = 318
const TOP = 44
const PLOT_H = 170
const BAR_W = 16
const GROUP_W = 46

export function ExtractionByCategory({ className }: { className?: string }) {
  const y = (v: number) => TOP + PLOT_H - (v / 100) * PLOT_H
  const described = DATA.map((d) => `${d.model}: ` + CATEGORIES.map((c, i) => `${c} ${d.noGuard[i]}% without the guard, ${d.guard[i]}% with it`).join("; ")).join(". ")
  return (
    <svg className={className ? `pp-svg ${className}` : "pp-svg"} viewBox={`0 0 ${W} 290`} role="img" aria-label={`Bar chart of substantial extraction by attack category. ${described}.`}>
      {DATA.map((d, p) => {
        const x0 = 52 + p * (PANEL_W + 42)
        return (
          <g key={d.model}>
            <text className="pp-fig-name pp-fig-name--sm" x={x0} y={24} fill="currentColor" fontSize={13} fontWeight={600}>
              {d.model}
            </text>
            {[0, 50, 100].map((t) => (
              <g key={t}>
                <line className="pp-seq-life" x1={x0} x2={x0 + PANEL_W} y1={y(t)} y2={y(t)} stroke="currentColor" strokeWidth={t === 0 ? 1.5 : 0.5} strokeDasharray={t === 0 ? undefined : "2 3"} />
                <text className="pp-fig-small" x={x0 - 8} y={y(t) + 4} textAnchor="end" fill="currentColor">
                  {t}
                </text>
              </g>
            ))}
            {CATEGORIES.map((c, i) => {
              const gx = x0 + 10 + i * (GROUP_W + 6)
              return (
                <g key={c}>
                  <rect className="pp-fig-box" x={gx} y={y(d.noGuard[i])} width={BAR_W} height={Math.max(0, TOP + PLOT_H - y(d.noGuard[i]))} fill="none" stroke="currentColor" strokeWidth={1.25} />
                  <rect className="pp-fig-key" x={gx + BAR_W + 3} y={y(d.guard[i])} width={BAR_W} height={Math.max(0, TOP + PLOT_H - y(d.guard[i]))} fill="currentColor" />
                  <text className="pp-fig-small" x={gx + BAR_W + 1} y={TOP + PLOT_H + 18} textAnchor="middle" fill="currentColor">
                    {c}
                  </text>
                </g>
              )
            })}
          </g>
        )
      })}
      <text className="pp-fig-small" x={14} y={TOP + PLOT_H / 2} fill="currentColor" transform={`rotate(-90 14 ${TOP + PLOT_H / 2})`} textAnchor="middle">
        % of conversations
      </text>
      <g transform={`translate(52 ${TOP + PLOT_H + 44})`}>
        <rect className="pp-fig-box" x={0} y={-10} width={12} height={12} fill="none" stroke="currentColor" strokeWidth={1.25} />
        <text className="pp-fig-small" x={20} y={0} fill="currentColor">
          without the guard instruction
        </text>
        <rect className="pp-fig-key" x={230} y={-10} width={12} height={12} fill="currentColor" />
        <text className="pp-fig-small" x={250} y={0} fill="currentColor">
          with the guard instruction
        </text>
      </g>
    </svg>
  )
}
