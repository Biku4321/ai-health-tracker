import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip, CartesianGrid } from 'recharts';

export const MoodLineChart = ({ data }) => (
  <div className="h-64 w-full">
    <ResponsiveContainer>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} dy={10} />
        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
        <Line type="monotone" dataKey="mood" stroke="#4EC5C1" strokeWidth={3} dot={{ r: 4, fill: '#1A3C40' }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);