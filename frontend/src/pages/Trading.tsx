
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowDownUp, BarChart2, LineChart, Settings, TrendingUp } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";

const Trading = () => {
  const [tradeSize, setTradeSize] = useState<number[]>([50]);
  const [autoTradingEnabled, setAutoTradingEnabled] = useState(true);
  
  return (
    <AppLayout>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Trading Dashboard</h1>
            <p className="text-muted-foreground">Configure and monitor your trading activities</p>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="btc-sol">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select pair" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="btc-sol">BTC/SOL</SelectItem>
                <SelectItem value="eth-sol">ETH/SOL</SelectItem>
                <SelectItem value="usdc-sol">USDC/SOL</SelectItem>
                <SelectItem value="usdt-sol">USDT/SOL</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <LineChart className="h-4 w-4 mr-2" />
              Chart
            </Button>
            <Button>
              <ArrowDownUp className="h-4 w-4 mr-2" />
              New Trade
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Market Overview</CardTitle>
              <CardDescription>Current market conditions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Price</span>
                <span className="font-medium">$64.23</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">24h Change</span>
                <span className="font-medium text-green-500">+5.32%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">24h Volume</span>
                <span className="font-medium">$12.4M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Market Cap</span>
                <span className="font-medium">$1.2B</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">All Time High</span>
                <span className="font-medium">$89.54</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Trading Activity</CardTitle>
              <CardDescription>Last 24 hours performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Trades</div>
                  <div className="text-2xl font-semibold">1,247</div>
                  <div className="text-xs text-green-500 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" /> +12% from yesterday
                  </div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Volume</div>
                  <div className="text-2xl font-semibold">342 SOL</div>
                  <div className="text-xs text-green-500 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" /> +8.3% from yesterday
                  </div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Profit/Loss</div>
                  <div className="text-2xl font-semibold text-green-500">+12.7 SOL</div>
                  <div className="text-xs">≈ $1,902</div>
                </div>
              </div>
              
              <div className="mt-6">
                <Alert variant="default" className="bg-card">
                  <AlertDescription className="flex items-center justify-between">
                    <span>Auto-trading is currently enabled</span>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="auto-trading" className="cursor-pointer">Enable</Label>
                      <Switch 
                        id="auto-trading" 
                        checked={autoTradingEnabled} 
                        onCheckedChange={setAutoTradingEnabled} 
                      />
                    </div>
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="settings" className="mb-6">
          <TabsList className="grid grid-cols-3 mb-4 w-[400px]">
            <TabsTrigger value="settings">Trade Settings</TabsTrigger>
            <TabsTrigger value="history">Trade History</TabsTrigger>
            <TabsTrigger value="analysis">Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Trading Parameters</CardTitle>
                <CardDescription>Configure your trading strategy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Trading Pair</Label>
                      <Select defaultValue="btc-sol">
                        <SelectTrigger>
                          <SelectValue placeholder="Select pair" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="btc-sol">BTC/SOL</SelectItem>
                          <SelectItem value="eth-sol">ETH/SOL</SelectItem>
                          <SelectItem value="usdc-sol">USDC/SOL</SelectItem>
                          <SelectItem value="usdt-sol">USDT/SOL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Strategy Type</Label>
                      <Select defaultValue="market-making">
                        <SelectTrigger>
                          <SelectValue placeholder="Select strategy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="market-making">Market Making</SelectItem>
                          <SelectItem value="grid-trading">Grid Trading</SelectItem>
                          <SelectItem value="momentum">Momentum</SelectItem>
                          <SelectItem value="arbitrage">Arbitrage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Trade Frequency (per hour)</Label>
                      <Input type="number" min="1" max="100" defaultValue="12" />
                    </div>
                    
                    <div>
                      <Label>Slippage Tolerance (%)</Label>
                      <Input type="number" min="0.1" max="5" step="0.1" defaultValue="0.5" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Trade Size (% of wallet)</Label>
                        <span className="text-sm font-medium">{tradeSize[0]}%</span>
                      </div>
                      <Slider 
                        value={tradeSize} 
                        onValueChange={setTradeSize} 
                        max={100} 
                        step={1}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center pt-2">
                      <Label htmlFor="randomize-timing">Randomize Trade Timing</Label>
                      <Switch id="randomize-timing" defaultChecked />
                    </div>
                    
                    <div className="flex justify-between items-center pt-2">
                      <Label htmlFor="use-limit-orders">Use Limit Orders</Label>
                      <Switch id="use-limit-orders" defaultChecked />
                    </div>
                    
                    <div className="flex justify-between items-center pt-2">
                      <Label htmlFor="stop-loss">Enable Stop-Loss</Label>
                      <Switch id="stop-loss" />
                    </div>
                    
                    <Button className="w-full mt-4">
                      <Settings className="h-4 w-4 mr-2" />
                      Save Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Trades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-muted/50">
                      <tr>
                        <th className="px-4 py-2">Time</th>
                        <th className="px-4 py-2">Pair</th>
                        <th className="px-4 py-2">Type</th>
                        <th className="px-4 py-2">Amount</th>
                        <th className="px-4 py-2">Price</th>
                        <th className="px-4 py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(5)].map((_, index) => (
                        <tr key={index} className="border-b border-muted">
                          <td className="px-4 py-3">April 3, 2025 {14 - index}:${30 - index * 5}</td>
                          <td className="px-4 py-3">SOL/USDC</td>
                          <td className={`px-4 py-3 ${index % 2 === 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {index % 2 === 0 ? 'Buy' : 'Sell'}
                          </td>
                          <td className="px-4 py-3">{(Math.random() * 10).toFixed(2)} SOL</td>
                          <td className="px-4 py-3">${(Math.random() * 10 + 60).toFixed(2)}</td>
                          <td className="px-4 py-3">
                            <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded text-xs">
                              Completed
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex justify-center mt-4">
                  <Button variant="outline">Load More</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analysis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Win Rate</div>
                    <div className="text-2xl font-semibold">68.7%</div>
                    <div className="w-full bg-muted h-2 rounded mt-2">
                      <div className="bg-solana-purple h-2 rounded" style={{ width: '68.7%' }}></div>
                    </div>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Avg. Holding Time</div>
                    <div className="text-2xl font-semibold">42m</div>
                    <div className="text-xs text-muted-foreground">Most profitable: 18-24 minutes</div>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">ROI (30d)</div>
                    <div className="text-2xl font-semibold text-green-500">+14.3%</div>
                    <div className="text-xs text-muted-foreground">Compared to +5.2% market</div>
                  </div>
                </div>
                
                <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg border border-dashed border-muted">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <BarChart2 className="h-5 w-5" />
                    <span>Performance chart would render here</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Trading;
