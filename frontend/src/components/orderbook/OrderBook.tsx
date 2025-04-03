import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from '@/lib/utils';
import { marketService } from '@/services/market';
import { useQuery } from '@tanstack/react-query';

export function OrderBook() {
  const [showBotOrders, setShowBotOrders] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState([50]);

  // Fetch order book data using React Query
  const { data: orderBook, isLoading, error } = useQuery({
    queryKey: ['orderBook', 'SOL/USDC'],
    queryFn: () => marketService.getOrderBook('SOL/USDC'),
    refetchInterval: 2000 - (animationSpeed[0] * 15), // Adjust update frequency based on speed
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading order book</div>;
  }

  // Find max size for scaling the depth visualization
  const maxSize = Math.max(
    ...orderBook.asks.map(o => o.size),
    ...orderBook.bids.map(o => o.size)
  );

  return (
    <Card className="min-h-[500px]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">Order Book</CardTitle>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="bot-orders"
              checked={showBotOrders}
              onCheckedChange={setShowBotOrders}
            />
            <Label htmlFor="bot-orders" className="text-xs">Show Bot Orders</Label>
          </div>
          
          <Tabs defaultValue="SOL/USDC">
            <TabsList>
              <TabsTrigger value="SOL/USDC">SOL/USDC</TabsTrigger>
              <TabsTrigger value="BTC/USDC">BTC/USDC</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Animation Speed</span>
            <span className="text-xs font-mono">{animationSpeed[0]}%</span>
          </div>
          <Slider
            value={animationSpeed}
            onValueChange={setAnimationSpeed}
            max={100}
            step={1}
            className="my-2"
          />
        </div>
        
        <div className="grid grid-cols-3 mb-2 text-muted-foreground text-xs px-2">
          <div>Price (USDC)</div>
          <div className="text-right">Size (SOL)</div>
          <div className="text-right">Total (USDC)</div>
        </div>
        
        {/* ASKS (sell orders) */}
        <div className="mb-4">
          {orderBook.asks
            .sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
            .map((order, i) => {
              // Don't show bot orders if the option is disabled
              if (!showBotOrders && order.is_bot) return null;
              
              const depth = (parseFloat(order.size) / maxSize) * 100;
              
              return (
                <div 
                  key={`ask-${i}`}
                  className="relative orderbook-row"
                >
                  <div 
                    className={cn(
                      "orderbook-ask absolute top-0 right-0 h-full",
                      order.is_bot && showBotOrders && "border-solana-purple"
                    )}
                    style={{ 
                      width: `${depth}%`,
                      opacity: order.is_bot && showBotOrders ? 0.7 + order.pulse_intensity * 0.3 : 0.5 
                    }}
                  />
                  <span className="z-10 text-destructive font-mono">${order.price}</span>
                  <span className="z-10 text-right font-mono">{parseFloat(order.size).toFixed(2)}</span>
                  <span className="z-10 text-right font-mono">${parseFloat(order.total).toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
                </div>
              );
            })}
        </div>
        
        {/* Mid price */}
        <div className="py-1 px-2 bg-muted/20 mb-4 text-center font-mono text-sm">
          ${orderBook.mid_price.toFixed(2)}
        </div>
        
        {/* BIDS (buy orders) */}
        <div>
          {orderBook.bids
            .sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
            .map((order, i) => {
              // Don't show bot orders if the option is disabled
              if (!showBotOrders && order.is_bot) return null;
              
              const depth = (parseFloat(order.size) / maxSize) * 100;
              
              return (
                <div 
                  key={`bid-${i}`}
                  className="relative orderbook-row"
                >
                  <div 
                    className={cn(
                      "orderbook-bid absolute top-0 right-0 h-full",
                      order.is_bot && showBotOrders && "border-solana-purple"
                    )}
                    style={{ 
                      width: `${depth}%`,
                      opacity: order.is_bot && showBotOrders ? 0.7 + order.pulse_intensity * 0.3 : 0.5
                    }}
                  />
                  <span className="z-10 text-solana-green font-mono">${order.price}</span>
                  <span className="z-10 text-right font-mono">{parseFloat(order.size).toFixed(2)}</span>
                  <span className="z-10 text-right font-mono">${parseFloat(order.total).toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
                </div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
}
