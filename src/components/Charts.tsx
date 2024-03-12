import { AreaChart, CartesianGrid, YAxis, XAxis, Area, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend, PolarRadiusAxis, ResponsiveContainer, RadialBarChart, RadialBar } from "recharts";


export interface Plot {
  data: Array<Object>,
  xAxisDataKey: string,
  yAxisDataKeys: string[],
  xAxisLabel: string,
  yAxisLabel: string,
}

export const renderLineChart = (plot: Plot) => {
  const strokes = ["#696868", "#696868"];
  return (
    <ResponsiveContainer height={250}>
      <AreaChart width={730} height={250} data={plot.data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00668e" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#00668e" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ffe043" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#ffe043" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey={plot.xAxisDataKey} />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        {plot.yAxisDataKeys.map((key: string) => <Area
          name={plot.yAxisLabel}
          type="monotone"
          key={key}
          dataKey={key}
          stroke={strokes[0]}
          fillOpacity={1}
          fill="url(#colorUv)"
        />)}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export const renderRadarChart = (data: any) => {
  return (
    <RadarChart outerRadius={90} width={730} height={250} data={data}>
      <PolarGrid />
      <PolarAngleAxis dataKey="subject" />
      <PolarRadiusAxis angle={30} domain={[0, 10]} />
      <Radar name="Stats" dataKey="A" stroke="#00668e" fill="#00668e" fillOpacity={0.6} />
      <Legend />
    </RadarChart>
  );
};

export const renderRadialBarChart = (data: any) => {
  return (
    <RadialBarChart
    innerRadius="20%"
    outerRadius="80%"
      data={data}
      startAngle={180}
      endAngle={0}
    >
    <RadialBar dataKey='count' />
    <Legend iconSize={10} width={120} height={140} layout='vertical' verticalAlign='middle' align="right" />
    <Tooltip />
  </RadialBarChart>
  );
};
