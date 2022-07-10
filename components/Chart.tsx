import {useEffect, useState} from 'react';
import {Area, AreaChart, Tooltip, XAxis, YAxis} from 'recharts';

export const Chart: React.FC<{data: any}> = ({data}) => {
  const [domain, setDomain] = useState({dataMax: 0, dataMin: 0, price: 10});
  const [selectedTimeRange, setSelectedTimeRange] = useState('LIVE');
  useEffect(() => {
    if (data.length > 0) {
      const lastRange = data[data.length - 1].priceConfidenceRange;
      if (domain.dataMax < lastRange[1]) {
        setDomain({
          ...domain,
          dataMax: lastRange[1],
          dataMin: lastRange[0],
          price: data[data.length - 1].price,
        });
      }
    }
  }, [data]);
  
  return (
    <>
      <AreaChart
        width={500}
        height={250}
        data={data}
        stackOffset="none"
        syncMethod={'index'}
        layout="horizontal"
        barCategoryGap={'10%'}
        barGap={4}
        reverseStackOrder={false}
        margin={{top: 5, right: 30, left: 20, bottom: 5}}
      >
        <Tooltip />

        <YAxis
          stroke={'#222'}
          domain={[domain.dataMin, domain.dataMax || 'auto']}
          tickCount={4}
          scale="linear"
        />
        <XAxis
          stroke={'#222'}
          dataKey="ts"
          height={100}
          interval={'preserveStartEnd'}
          minTickGap={0}
          tickLine={false}
          // @ts-ignore
          tick={CustomizedHistoricalHourAxisTick}
        />

        <Area dataKey="priceConfidenceRange" stroke="#8884d8" fill="#8884d8" />
        <Area dataKey="price" stroke="#000" fillOpacity={0} />
        <Area dataKey="sma" stroke="#FF0000" fillOpacity={0} />
        <Area dataKey="ema" stroke="#00FF00" fillOpacity={0} />
      </AreaChart>
    </>
  );
};

// @ts-ignore
const CustomizedHistoricalHourAxisTick = ({x, y, fill, payload}) =>
  payload.value ? (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="end"
        fill={fill}
        transform="rotate(-90) translate(0,-9.5)"
      >
        {new Date(payload.value).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })}
      </text>
    </g>
  ) : null;

export default Chart;
