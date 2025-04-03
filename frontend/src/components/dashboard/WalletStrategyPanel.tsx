
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";

export function WalletStrategyPanel() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-6">Trading Strategy Configuration</h3>
          
          <div className="grid gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Strategy Type</Label>
                  <Select defaultValue="market-making">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a strategy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="market-making">Market Making</SelectItem>
                      <SelectItem value="price-influence">Price Influence</SelectItem>
                      <SelectItem value="stealth-trading">Stealth Trading</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Trading Pair</Label>
                  <Select defaultValue="sol-usdc">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a trading pair" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sol-usdc">SOL/USDC</SelectItem>
                      <SelectItem value="sol-usdt">SOL/USDT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Execution Platform</Label>
                  <Select defaultValue="raydium">
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="raydium">Raydium</SelectItem>
                      <SelectItem value="orca">Orca</SelectItem>
                      <SelectItem value="jupiter">Jupiter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-trading">Automated Trading</Label>
                  <Switch id="auto-trading" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="stealth-mode">Stealth Mode</Label>
                  <Switch id="stealth-mode" />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="risk-alerts">Risk Alerts</Label>
                  <Switch id="risk-alerts" defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="delay">Transaction Delay (ms)</Label>
                    <span className="text-sm text-muted-foreground">1500</span>
                  </div>
                  <Slider
                    id="delay"
                    defaultValue={[1500]}
                    max={5000}
                    step={100}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Min Trade Size (SOL)</Label>
                <Input type="number" placeholder="0.5" defaultValue="0.5" />
              </div>
              
              <div className="space-y-2">
                <Label>Max Trade Size (SOL)</Label>
                <Input type="number" placeholder="10" defaultValue="10" />
              </div>
              
              <div className="space-y-2">
                <Label>Max Daily Volume (SOL)</Label>
                <Input type="number" placeholder="500" defaultValue="500" />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between mb-1">
                <Label>Trade Frequency Distribution</Label>
                <span className="text-sm text-muted-foreground">Balanced</span>
              </div>
              <div className="grid grid-cols-3 gap-1 mb-2">
                <div className="h-1 bg-solana-purple rounded-l-full"></div>
                <div className="h-1 bg-solana-purple"></div>
                <div className="h-1 bg-solana-blue rounded-r-full"></div>
              </div>
              <Slider
                defaultValue={[50]}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Conservative</span>
                <span>Balanced</span>
                <span>Aggressive</span>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Strategy
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
