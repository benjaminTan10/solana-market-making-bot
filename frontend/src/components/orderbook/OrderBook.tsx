
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from '@/lib/utils';

// Mock data for the order book
const generateMockOrders = (side: 'bid' | 'ask', basePrice: number = 150) => {
  const orders = [];
  const levels = 15;
  const step = side === 'ask' ? 0.1 : -0.1;
  
  for (let i = 0; i < levels; i++) {
    // Price calculation with some random variation
    const price = basePrice + (i + 1) * step * (1 + (Math.random() * 0.1 - 0.05));
    
    // Volume calculation: higher near the mid price, lower far from it
    let size = 10 + Math.random() * 100 * (1 - i / levels * 0.7);
    if (Math.random() > 0.85) size *= 3; // Occasionally larger orders
    
    // Whether this is a bot order
    const isBot = Math.random() > 0.65;
    
    orders.push({
      price: price.toFixed(2),
      size: size.toFixed(2),
      total: (price * size).toFixed(2),
      isBot,
      pulseIntensity: isBot ? Math.random() : 0,
    });
  }
  
  return orders;
};

export function OrderBook() {
  const [midPrice] = useState(149.72);
  const [askOrders, setAskOrders] = useState(() => 
    generateMockOrders('ask', midPrice)
  );
  const [bidOrders, setBidOrders] = useState(() => 
    generateMockOrders('bid', midPrice)
  );
  const [showBotOrders, setShowBotOrders] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState([50]); // 0-100 scale

  // Function to update the mock data with slight price changes
  useEffect(() => {
    const updateInterval = setInterval(() => {
      // Update asks
      setAskOrders(prev => 
        prev.map(order => ({
          ...order,
          price: (parseFloat(order.price) + (Math.random() - 0.5) * 0.05).toFixed(2),
          size: (parseFloat(order.size) + (Math.random() - 0.5) * 2).toFixed(2),
          total: ((parseFloat(order.price) + (Math.random() - 0.5) * 0.05) * 
                 (parseFloat(order.size) + (Math.random() - 0.5) * 2)).toFixed(2),
          pulseIntensity: order.isBot ? Math.random() : 0,
        }))
      );
      
      // Update bids
      setBidOrders(prev => 
        prev.map(order => ({
          ...order,
          price: (parseFloat(order.price) + (Math.random() - 0.5) * 0.05).toFixed(2),
          size: (parseFloat(order.size) + (Math.random() - 0.5) * 2).toFixed(2),
          total: ((parseFloat(order.price) + (Math.random() - 0.5) * 0.05) * 
                 (parseFloat(order.size) + (Math.random() - 0.5) * 2)).toFixed(2),
          pulseIntensity: order.isBot ? Math.random() : 0,
        }))
      );
    }, 2000 - (animationSpeed[0] * 15)); // Adjust update frequency based on speed
    
    return () => clearInterval(updateInterval);
  }, [animationSpeed]);

  // Find max size for scaling the depth visualization
  const maxSize = Math.max(
    ...askOrders.map(o => parseFloat(o.size)),
    ...bidOrders.map(o => parseFloat(o.size))
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
          {askOrders
            .sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
            .map((order, i) => {
              // Don't show bot orders if the option is disabled
              if (!showBotOrders && order.isBot) return null;
              
              const depth = (parseFloat(order.size) / maxSize) * 100;
              
              return (
                <div 
                  key={`ask-${i}`}
                  className="relative orderbook-row"
                >
                  <div 
                    className={cn(
                      "orderbook-ask absolute top-0 right-0 h-full",
                      order.isBot && showBotOrders && "border-solana-purple"
                    )}
                    style={{ 
                      width: `${depth}%`,
                      opacity: order.isBot && showBotOrders ? 0.7 + order.pulseIntensity * 0.3 : 0.5 
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
          ${midPrice.toFixed(2)}
        </div>
        
        {/* BIDS (buy orders) */}
        <div>
          {bidOrders
            .sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
            .map((order, i) => {
              // Don't show bot orders if the option is disabled
              if (!showBotOrders && order.isBot) return null;
              
              const depth = (parseFloat(order.size) / maxSize) * 100;
              
              return (
                <div 
                  key={`bid-${i}`}
                  className="relative orderbook-row"
                >
                  <div 
                    className={cn(
                      "orderbook-bid absolute top-0 right-0 h-full",
                      order.isBot && showBotOrders && "border-solana-purple"
                    )}
                    style={{ 
                      width: `${depth}%`,
                      opacity: order.isBot && showBotOrders ? 0.7 + order.pulseIntensity * 0.3 : 0.5
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
