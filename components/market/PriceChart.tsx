'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface PriceChartProps {
  marketId: string
}

export default function PriceChart({ marketId }: PriceChartProps) {
  // TODO: 从 Supabase 获取历史价格数据
  // 暂时使用模拟数据
  const mockData = [
    { time: '00:00', yes: 0.50, no: 0.50 },
    { time: '01:00', yes: 0.52, no: 0.48 },
    { time: '02:00', yes: 0.55, no: 0.45 },
    { time: '03:00', yes: 0.53, no: 0.47 },
    { time: '04:00', yes: 0.58, no: 0.42 },
    { time: '05:00', yes: 0.60, no: 0.40 },
  ]

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={mockData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="time" stroke="#6b7280" />
          <YAxis domain={[0, 1]} stroke="#6b7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Line
            type="monotone"
            dataKey="yes"
            stroke="#10b981"
            strokeWidth={2}
            name="YES 价格"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="no"
            stroke="#3b82f6"
            strokeWidth={2}
            name="NO 价格"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

