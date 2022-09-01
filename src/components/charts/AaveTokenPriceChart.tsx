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
import { useTheme } from 'next-themes';

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
  const { resolvedTheme } = useTheme();

  const handleTimeWindow = (event: any) => {
    if (event.target.value) {
      setTimeWindow(event.target.value);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <div className="px-4 py-2">Price over time</div>
        <div className="btn-group m-2" onChange={handleTimeWindow}>
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
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          width={width}
          height={height}
          data={data}
          margin={{ top: 3, right: 0, left: 1, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="timestamp"
            style={{ fill: resolvedTheme === 'light' ? '#000000' : '#FFFFFF' }}
            opacity={0.5}
            tickFormatter={(value: string) =>
              `    ${moment(value, 'X').format('DD MMM YYYY')}    `
            }
          />
          <YAxis
            style={{ fill: resolvedTheme === 'light' ? '#000000' : '#FFFFFF' }}
            orientation="left"
            type="number"
            mirror
            interval="preserveStartEnd"
            opacity={0.5}
            tickFormatter={(value) =>
              value > 0 ? format(value, { abbreviate: true }) : ''
            }
          />
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
            stroke="#8884d8"
            fillOpacity={0.5}
            fill="url(#colorArea)"
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
  return AaveTokenPrices.map((x) => ({ timestamp: x[0]! / 1000, value: x[1] }));
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
