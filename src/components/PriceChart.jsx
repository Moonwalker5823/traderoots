import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function PriceChart({ history, direction }) {
  if (!history || history.length === 0) return null

  const color = direction === 'up' ? '#00C896' : '#FF4B4B'
  const data = history.map(({ date, price }) => ({ date: date.slice(5), price }))

  return (
    <div className="bg-surface border border-divider rounded-xl p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-semibold">Price History</h3>
        <span className="text-xs text-muted italic">Illustrative — for educational purposes</span>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data}>
          <XAxis
            dataKey="date"
            tick={{ fill: '#8892A4', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: '#8892A4', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `$${v.toLocaleString()}`}
            width={75}
          />
          <Tooltip
            contentStyle={{
              background: '#111827',
              border: '1px solid #1e2a45',
              borderRadius: 6,
              color: '#fff',
              fontSize: 12,
            }}
            formatter={(v) => [`$${Number(v).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 'Price']}
            labelFormatter={(l) => `Date: ${l}`}
          />
          <Line type="monotone" dataKey="price" stroke={color} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
