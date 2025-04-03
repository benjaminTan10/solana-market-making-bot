
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  AlertTriangle, 
  Bell, 
  Plus, 
  Trash2, 
  WalletCards, 
  LineChart, 
  TrendingDown, 
  TrendingUp, 
  ArrowDownUp,
  Search
} from "lucide-react";

const Alerts = () => {
  return (
    <AppLayout>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Alerts & Notifications</h1>
            <p className="text-muted-foreground">Monitor your wallets and trades with custom alerts</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline">
              <Bell className="h-4 w-4 mr-2" />
              Clear All
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Alert
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <Bell className="h-4 w-4 mr-2" />
                Active Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-sm text-muted-foreground">Across all categories</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                Critical Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">3</div>
              <p className="text-sm text-muted-foreground">Require immediate action</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                Price Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-sm text-muted-foreground">Price movement triggers</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <WalletCards className="h-4 w-4 mr-2 text-amber-500" />
                Wallet Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-sm text-muted-foreground">Balance & activity alerts</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-card rounded-lg border mb-6 p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 flex-grow">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search alerts..." 
                className="max-w-sm"
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <Select defaultValue="all">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="price">Price Alerts</SelectItem>
                  <SelectItem value="wallet">Wallet Alerts</SelectItem>
                  <SelectItem value="security">Security Alerts</SelectItem>
                  <SelectItem value="system">System Alerts</SelectItem>
                </SelectContent>
              </Select>
              
              <Select defaultValue="all">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="triggered">Triggered</SelectItem>
                  <SelectItem value="snoozed">Snoozed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="active" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="active">Active Alerts</TabsTrigger>
            <TabsTrigger value="triggered">Triggered</TabsTrigger>
            <TabsTrigger value="configure">Configure</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="rounded-md border">
                  <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs uppercase bg-muted/50">
                        <tr>
                          <th className="px-4 py-3">Alert Type</th>
                          <th className="px-4 py-3">Condition</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Created</th>
                          <th className="px-4 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-card border-b">
                          <td className="px-4 py-3 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            <div>
                              <div className="font-medium">Price Alert</div>
                              <div className="text-xs text-muted-foreground">SOL/USDC</div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span>Price rises above $65.00</span>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                              Active
                            </Badge>
                          </td>
                          <td className="px-4 py-3">Apr 1, 2025</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">Edit</Button>
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                        <tr className="bg-card border-b">
                          <td className="px-4 py-3 flex items-center gap-2">
                            <TrendingDown className="h-4 w-4 text-red-500" />
                            <div>
                              <div className="font-medium">Price Alert</div>
                              <div className="text-xs text-muted-foreground">SOL/USDC</div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span>Price falls below $58.50</span>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                              Active
                            </Badge>
                          </td>
                          <td className="px-4 py-3">Apr 2, 2025</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">Edit</Button>
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                        <tr className="bg-card border-b">
                          <td className="px-4 py-3 flex items-center gap-2">
                            <WalletCards className="h-4 w-4 text-amber-500" />
                            <div>
                              <div className="font-medium">Wallet Alert</div>
                              <div className="text-xs text-muted-foreground">Multiple wallets</div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span>Balance falls below 5 SOL</span>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20">
                              Warning
                            </Badge>
                          </td>
                          <td className="px-4 py-3">Apr 2, 2025</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">Edit</Button>
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                        <tr className="bg-card border-b">
                          <td className="px-4 py-3 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            <div>
                              <div className="font-medium">Security Alert</div>
                              <div className="text-xs text-muted-foreground">System wide</div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span>Failed login attempts exceed threshold</span>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className="bg-red-500/10 text-red-500 hover:bg-red-500/20">
                              Critical
                            </Badge>
                          </td>
                          <td className="px-4 py-3">Apr 1, 2025</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">Edit</Button>
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                        <tr className="bg-card">
                          <td className="px-4 py-3 flex items-center gap-2">
                            <ArrowDownUp className="h-4 w-4 text-blue-500" />
                            <div>
                              <div className="font-medium">Trading Alert</div>
                              <div className="text-xs text-muted-foreground">Trading Bot</div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span>Trading activity stopped for 30+ minutes</span>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                              Active
                            </Badge>
                          </td>
                          <td className="px-4 py-3">Apr 3, 2025</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">Edit</Button>
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="triggered" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="rounded-md border">
                  <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs uppercase bg-muted/50">
                        <tr>
                          <th className="px-4 py-3">Alert Type</th>
                          <th className="px-4 py-3">Condition</th>
                          <th className="px-4 py-3">Triggered</th>
                          <th className="px-4 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-card border-b">
                          <td className="px-4 py-3 flex items-center gap-2">
                            <TrendingDown className="h-4 w-4 text-red-500" />
                            <div>
                              <div className="font-medium">Price Alert</div>
                              <div className="text-xs text-muted-foreground">BTC/SOL</div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span>Price falls below threshold</span>
                          </td>
                          <td className="px-4 py-3">Apr 2, 2025 14:32</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">View Details</Button>
                              <Button variant="outline" size="sm">Reset</Button>
                            </div>
                          </td>
                        </tr>
                        <tr className="bg-card border-b">
                          <td className="px-4 py-3 flex items-center gap-2">
                            <WalletCards className="h-4 w-4 text-amber-500" />
                            <div>
                              <div className="font-medium">Wallet Alert</div>
                              <div className="text-xs text-muted-foreground">Wallet #172</div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span>Unexpected large withdrawal</span>
                          </td>
                          <td className="px-4 py-3">Apr 1, 2025 09:17</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">View Details</Button>
                              <Button variant="outline" size="sm">Reset</Button>
                            </div>
                          </td>
                        </tr>
                        <tr className="bg-card">
                          <td className="px-4 py-3 flex items-center gap-2">
                            <LineChart className="h-4 w-4 text-green-500" />
                            <div>
                              <div className="font-medium">Performance Alert</div>
                              <div className="text-xs text-muted-foreground">System</div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span>Daily profit target reached</span>
                          </td>
                          <td className="px-4 py-3">Apr 3, 2025 12:05</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">View Details</Button>
                              <Button variant="outline" size="sm">Reset</Button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="configure" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configure Alert Settings</CardTitle>
                <CardDescription>Manage how and when you receive alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Channels</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-alerts">Email Notifications</Label>
                      <Switch id="email-alerts" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="dashboard-alerts">Dashboard Notifications</Label>
                      <Switch id="dashboard-alerts" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="mobile-alerts">Mobile Push Notifications</Label>
                      <Switch id="mobile-alerts" defaultChecked />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Alert Types & Thresholds</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="price-alerts">Price Alerts</Label>
                        <Switch id="price-alerts" defaultChecked />
                      </div>
                      <div className="pl-6 space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="price-change">Significant Price Change (%)</Label>
                            <Select defaultValue="5">
                              <SelectTrigger id="price-change">
                                <SelectValue placeholder="Select threshold" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1%</SelectItem>
                                <SelectItem value="5">5%</SelectItem>
                                <SelectItem value="10">10%</SelectItem>
                                <SelectItem value="20">20%</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="volatility-alert">Volatility Alert</Label>
                            <Select defaultValue="high">
                              <SelectTrigger id="volatility-alert">
                                <SelectValue placeholder="Select threshold" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="wallet-alerts">Wallet Alerts</Label>
                        <Switch id="wallet-alerts" defaultChecked />
                      </div>
                      <div className="pl-6 space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="low-balance">Low Balance Threshold (SOL)</Label>
                            <Input id="low-balance" type="number" defaultValue="5" min="0.1" step="0.1" />
                          </div>
                          <div>
                            <Label htmlFor="large-tx">Large Transaction (SOL)</Label>
                            <Input id="large-tx" type="number" defaultValue="50" min="1" step="1" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="security-alerts">Security Alerts</Label>
                        <Switch id="security-alerts" defaultChecked />
                      </div>
                      <div className="pl-6 space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="login-attempts">Failed Login Attempts</Label>
                            <Input id="login-attempts" type="number" defaultValue="3" min="1" max="10" />
                          </div>
                          <div>
                            <Label htmlFor="new-device">New Device Login</Label>
                            <Select defaultValue="always">
                              <SelectTrigger id="new-device">
                                <SelectValue placeholder="Select option" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="always">Always Alert</SelectItem>
                                <SelectItem value="unknown">Unknown Locations Only</SelectItem>
                                <SelectItem value="never">Never Alert</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button>Save Alert Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Alerts;
