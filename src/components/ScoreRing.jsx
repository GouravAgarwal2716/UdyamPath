import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

export default function ScoreRing({ score, label, icon, color = '#FF6B35', size = 120 }) {
  const data = [{ value: score, fill: color }];
  const innerRadius = size * 0.35;
  const outerRadius = size * 0.48;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <RadialBar
              background={{ fill: 'rgba(255,255,255,0.05)' }}
              dataKey="value"
              cornerRadius={10}
              fill={color}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl">{icon}</span>
          <span className="font-poppins font-bold text-white text-lg leading-none">{Math.round(score)}</span>
        </div>
      </div>
      <p className="text-white/60 text-xs text-center font-inter font-medium leading-tight max-w-[90px]">{label}</p>
    </div>
  );
}
