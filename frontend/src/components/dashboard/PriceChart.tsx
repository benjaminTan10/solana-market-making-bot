import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { marketService } from '@/services/market';
import { useQuery } from '@tanstack/react-query';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';

// Mock data for the chart
const solanaMarketData = [
  { time: '00:00', price: 143.22 },
  { time: '01:00', price: 142.84 },
  { time: '02:00', price: 144.01 },
  { time: '03:00', price: 145.79 },
  { time: '04:00', price: 144.55 },
  { time: '05:00', price: 146.89 },
  { time: '06:00', price: 147.22 },
  { time: '07:00', price: 149.17 },
  { time: '08:00', price: 148.46 },
  { time: '09:00', price: 150.22 },
  { time: '10:00', price: 151.05 },
  { time: '11:00', price: 149.87 },
  { time: '12:00', price: 148.79 },
];

const solanaBotData = [
  { time: '00:00', price: 143.52 },
  { time: '01:00', price: 143.44 },
  { time: '02:00', price: 144.41 },
  { time: '03:00', price: 146.19 },
  { time: '04:00', price: 145.25 },
  { time: '05:00', price: 147.09 },
  { time: '06:00', price: 147.82 },
  { time: '07:00', price: 149.47 },
  { time: '08:00', price: 148.96 },
  { time: '09:00', price: 150.02 },
  { time: '10:00', price: 151.35 },
  { time: '11:00', price: 150.27 },
  { time: '12:00', price: 149.19 },
];

type TimeRange = '1H' | '24H' | '7D' | '30D' | '90D';

export function PriceChart() {
  const [priceView, setPriceView] = useState<'market' | 'synthetic'>('market');
  const [timeRange, setTimeRange] = useState<TimeRange>('24H');
  
  // Fetch market data using React Query
  const { data: marketData, isLoading, error } = useQuery({
    queryKey: ['marketData', 'SOL/USDC'],
    queryFn: () => marketService.getMarketData('SOL/USDC'),
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  // Use the appropriate dataset based on the selected view
  const data = priceView === 'market' ? solanaMarketData : solanaBotData;
  
  const formatDollar = (value: number) => `$${value.toFixed(2)}`;
  
  const chartColorClass = priceView === 'market' 
    ? 'from-solana-blue/20 to-solana-blue/5' 
    : 'from-solana-purple/20 to-solana-purple/5';
  
  const lineColor = priceView === 'market' ? '#1E90FF' : '#9945FF';
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading market data</div>;
  }
  
  return (
    <Card className="col-span-2 lg:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">SOL Price</CardTitle>
        <div className="flex items-center gap-2">
          <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)} className="h-8">
            <TabsList className="grid grid-cols-5 h-8">
              <TabsTrigger className="text-xs py-0" value="1H">1H</TabsTrigger>
              <TabsTrigger className="text-xs py-0" value="24H">24H</TabsTrigger>
              <TabsTrigger className="text-xs py-0" value="7D">7D</TabsTrigger>
              <TabsTrigger className="text-xs py-0" value="30D">30D</TabsTrigger>
              <TabsTrigger className="text-xs py-0" value="90D">90D</TabsTrigger>
            </TabsList>
          </Tabs>
          <Tabs value={priceView} onValueChange={(v) => setPriceView(v as 'market' | 'synthetic')} className="h-8">
            <TabsList className="grid grid-cols-2 h-8">
              <TabsTrigger className="text-xs py-0" value="market">Market</TabsTrigger>
              <TabsTrigger className="text-xs py-0" value="synthetic">Synthetic</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="pt-2 pb-0">
        <div className="text-2xl font-bold mb-1 data-value">
          {formatDollar(data[data.length - 1].price)}
          <span className={cn("ml-2 text-sm", data[0].price < data[data.length - 1].price ? "data-positive" : "data-negative")}>
            {data[0].price < data[data.length - 1].price ? '↑' : '↓'} 
            {formatDollar(Math.abs(data[data.length - 1].price - data[0].price))}
          </span>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={lineColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                stroke="#6B7280"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                domain={['dataMin - 1', 'dataMax + 1']}
                tickFormatter={formatDollar}
                axisLine={false}
                tickLine={false}
                stroke="#6B7280"
              />
              <Tooltip 
                formatter={(value: number) => [`${formatDollar(value)}`, 'Price']}
                contentStyle={{ 
                  backgroundColor: 'rgba(17, 24, 39, 0.9)',
                  borderColor: '#4B5563',
                  borderRadius: '4px'
                }}
                labelStyle={{ color: '#E5E7EB' }}
                itemStyle={{ color: lineColor }}
              />
              <Area 
                type="monotone"
                dataKey="price"
                stroke={lineColor}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#colorPrice)`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
