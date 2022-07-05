import moment from 'moment';
import { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import CoinGecko from 'coingecko-api';
import { format } from '@/utils/Format';

type AaveTokenPricesProps = Array<Array<number>>;

type AaveTokenPriceChartProps = {
  data: any;
  timeWindow: string;
  timeWindows: string[];
  setTimeWindow: (w: string) => void;
  width: number;
  height: number;
};

const AaveTokenPriceChartTemplate = ({
  data,
  timeWindow,
  setTimeWindow,
  timeWindows,
  width,
  height,
}: AaveTokenPriceChartProps) => {
  const handleTimeWindow = (event: any) => {
    if (event.target.value) {
      setTimeWindow(event.target.value);
    }
  };

  return (
    <div className="flex flex-col items-end">
      <div className="btn-group mb-2" onChange={handleTimeWindow}>
        {timeWindows.map((w, i) => (
          <input
            key={i}
            id={w}
            checked={timeWindow === w}
            value={w}
            type="radio"
            name="options"
            data-title={w}
            className="btn"
          />
        ))}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          width={width}
          height={height}
          data={data}
          margin={{ top: 3, right: 0, left: 1, bottom: 0 }}
        >
          <XAxis
            padding={{ left: 0 }}
            dy={1}
            interval="preserveStartEnd"
            type="number"
            domain={['dataMin', 'dataMax']}
            dataKey="timestamp"
            tickFormatter={(value) =>
              `    ${moment(value, 'X').format('MMM DD YYYY')}    `
            }
          />
          <YAxis interval="preserveEnd" dx={3} type="number" mirror />
          <Tooltip
            labelFormatter={(label) => new Date(label * 1000).toLocaleString()}
            formatter={(label: string) =>
              format(label, { decimals: 2, symbol: 'USD' })
            }
          />
          <Area
            strokeWidth={3}
            type="monotone"
            dataKey="value"
            stroke="#607aee"
            fillOpacity={0.4}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

async function fetchAavePrice(timeWindow: string) {
  let days = '30';
  if (timeWindow === 'W') {
    days = '7';
  } else if (timeWindow === 'Y') {
    days = '365';
  }

  const client = new CoinGecko();
  const data = await client.coins.fetchMarketChart('aave', {
    vs_currency: 'usd',
    days,
  });

  return data.data.prices;
}

function formatAaveTokenPrices(AaveTokenPrices: AaveTokenPricesProps) {
  return AaveTokenPrices.map((x) => ({ timestamp: x[0] / 1000, value: x[1] }));
}

export const AaveTokenPriceChart = () => {
  const [AaveTokenPrices, setAaveTokenPrices] = useState<
    AaveTokenPricesProps | undefined
  >(undefined);
  const [timeWindow, setTimeWindow] = useState('M');
  const timeWindows = ['W', 'M', 'Y'];

  useEffect(() => {
    fetchAavePrice(timeWindow).then(setAaveTokenPrices);
  }, [timeWindow]);

  if (!AaveTokenPrices) {
    return <div>Loading...</div>;
  }

  const data = formatAaveTokenPrices(AaveTokenPrices);

  return (
    <AaveTokenPriceChartTemplate
      data={data}
      timeWindow={timeWindow}
      setTimeWindow={setTimeWindow}
      timeWindows={timeWindows}
      height={400}
      width={600}
    />
  );
};

export default AaveTokenPriceChart;
