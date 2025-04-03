
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  AlertCircle, 
  Save, 
  Key, 
  UserCog, 
  Shield, 
  Bell, 
  Database, 
  Globe, 
  Wallet,
  Code,
  Cpu,
  Network,
  LineChart,
  ServerCrash,
  HardDrive,
  Eye,
  EyeOff,
  RefreshCw,
  Lock,
  Settings as SettingsIcon
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";

const Settings = () => {
  const [isApiVisible, setIsApiVisible] = useState(false);
  const [isBackupRunning, setIsBackupRunning] = useState(false);
  const [isTestingEndpoint, setIsTestingEndpoint] = useState(false);
  const [isCustomEndpointOpen, setIsCustomEndpointOpen] = useState(false);
  const [customEndpoints, setCustomEndpoints] = useState([
    "https://api.mainnet-beta.solana.com",
    "https://solana-api.projectserum.com"
  ]);
  const [newEndpoint, setNewEndpoint] = useState("");

  const toggleApiVisibility = () => {
    setIsApiVisible(!isApiVisible);
  };

  const runSystemBackup = () => {
    setIsBackupRunning(true);
    // Simulate backup process
    setTimeout(() => {
      setIsBackupRunning(false);
      // Show a toast notification that backup is complete
      console.log("Backup complete");
    }, 2500);
  };

  const testRpcEndpoint = () => {
    setIsTestingEndpoint(true);
    // Simulate endpoint testing
    setTimeout(() => {
      setIsTestingEndpoint(false);
      // Show a toast notification that endpoint test is complete
      console.log("Endpoint test complete");
    }, 2000);
  };

  const addCustomEndpoint = () => {
    if (newEndpoint && !customEndpoints.includes(newEndpoint)) {
      setCustomEndpoints([...customEndpoints, newEndpoint]);
      setNewEndpoint("");
    }
  };

  const removeCustomEndpoint = (endpoint: string) => {
    setCustomEndpoints(customEndpoints.filter(e => e !== endpoint));
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Settings</h1>
          <Button className="mt-4 md:mt-0" onClick={() => console.log("Settings saved")}>
            <Save className="h-4 w-4 mr-2" />
            Save All Settings
          </Button>
        </div>
        
        <Tabs defaultValue="general" className="mb-6">
          <TabsList className="w-full md:w-auto flex flex-wrap md:flex-nowrap mb-6 gap-1">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="api">API Keys</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="wallets">Wallet Settings</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="account-name">Account Name</Label>
                      <Input id="account-name" defaultValue="Solana Market Nexus" />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" defaultValue="admin@nexus.com" />
                    </div>
                    
                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select defaultValue="utc">
                        <SelectTrigger id="timezone">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                          <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                          <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
                          <SelectItem value="gmt">GMT (Greenwich Mean Time)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="currency">Display Currency</Label>
                      <Select defaultValue="usd">
                        <SelectTrigger id="currency">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usd">USD ($)</SelectItem>
                          <SelectItem value="eur">EUR (€)</SelectItem>
                          <SelectItem value="gbp">GBP (£)</SelectItem>
                          <SelectItem value="jpy">JPY (¥)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="theme">Theme</Label>
                      <Select defaultValue="system">
                        <SelectTrigger id="theme">
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="system">System Default</SelectItem>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="language">Language</Label>
                      <Select defaultValue="en">
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                          <SelectItem value="zh">Chinese</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Preferences</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="analytics">Usage Analytics</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow collection of anonymous usage data to improve the platform
                      </p>
                    </div>
                    <Switch id="analytics" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sounds">Sound Effects</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable sound notifications for important events
                      </p>
                    </div>
                    <Switch id="sounds" />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Security Settings
                </CardTitle>
                <CardDescription>Manage your account security preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert variant="default" className="bg-yellow-500/10 border-yellow-500 text-yellow-600">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    We recommend enabling two-factor authentication for additional security.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Password</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div>
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div>
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button variant="outline">Update Password</Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="2fa">Enable 2FA</Label>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Switch id="2fa" />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Session Management</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-logout">Auto Logout</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically log out after a period of inactivity
                        </p>
                      </div>
                      <Switch id="auto-logout" defaultChecked />
                    </div>
                    
                    <div>
                      <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                      <Input id="session-timeout" type="number" defaultValue="30" min="5" max="240" />
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      Log Out All Other Sessions
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="h-5 w-5 mr-2" />
                  API Keys
                </CardTitle>
                <CardDescription>Manage API keys for external services and platforms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Exchange API Keys</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Solana RPC Endpoint</Label>
                      <Input defaultValue="https://api.mainnet-beta.solana.com" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>API Key</Label>
                        <div className="flex">
                          <Input 
                            type={isApiVisible ? "text" : "password"} 
                            defaultValue="*****************************"
                            className="rounded-r-none"
                          />
                          <Button 
                            onClick={toggleApiVisibility} 
                            variant="outline" 
                            className="rounded-l-none"
                            type="button"
                          >
                            {isApiVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label>API Secret</Label>
                        <div className="flex">
                          <Input 
                            type={isApiVisible ? "text" : "password"} 
                            defaultValue="*****************************"
                            className="rounded-r-none"
                          />
                          <Button 
                            onClick={toggleApiVisibility} 
                            variant="outline" 
                            className="rounded-l-none"
                            type="button"
                          >
                            {isApiVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Market Data API</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Provider</Label>
                      <Select defaultValue="coingecko">
                        <SelectTrigger>
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="coingecko">CoinGecko</SelectItem>
                          <SelectItem value="coinmarketcap">CoinMarketCap</SelectItem>
                          <SelectItem value="binance">Binance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>API Key</Label>
                      <div className="flex">
                        <Input 
                          type={isApiVisible ? "text" : "password"} 
                          defaultValue="*****************************" 
                          className="rounded-r-none"
                        />
                        <Button 
                          onClick={toggleApiVisibility} 
                          variant="outline" 
                          className="rounded-l-none"
                          type="button"
                        >
                          {isApiVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="use-premium">Use Premium API</Label>
                        <p className="text-sm text-muted-foreground">
                          Use premium tier for higher rate limits and additional data
                        </p>
                      </div>
                      <Switch id="use-premium" defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save API Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notification Settings
                </CardTitle>
                <CardDescription>Configure how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Email Notifications</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-trades">Trading Activity</Label>
                      <Switch id="email-trades" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-wallet">Wallet Alerts</Label>
                      <Switch id="email-wallet" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-security">Security Alerts</Label>
                      <Switch id="email-security" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-updates">Platform Updates</Label>
                      <Switch id="email-updates" />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Dashboard Alerts</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="alert-trades">Trade Execution</Label>
                      <Switch id="alert-trades" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="alert-errors">Error Notifications</Label>
                      <Switch id="alert-errors" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="alert-performance">Performance Alerts</Label>
                      <Switch id="alert-performance" defaultChecked />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h3 className="text-lg font-medium">Real-time Notifications</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications in real-time
                      </p>
                    </div>
                    <Switch id="real-time-notifications" defaultChecked />
                  </div>
                  
                  <div>
                    <Label htmlFor="min-notification-amount">Minimum Amount for Notifications</Label>
                    <Select defaultValue="0">
                      <SelectTrigger id="min-notification-amount">
                        <SelectValue placeholder="Select minimum amount" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">All Transactions</SelectItem>
                        <SelectItem value="10">Over 10 SOL</SelectItem>
                        <SelectItem value="50">Over 50 SOL</SelectItem>
                        <SelectItem value="100">Over 100 SOL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save Notification Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="wallets" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet className="h-5 w-5 mr-2" />
                  Wallet Configuration
                </CardTitle>
                <CardDescription>Configure wallet behavior and security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Parent Wallet Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Parent Wallet Address</Label>
                      <Input defaultValue="7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-refill">Auto-Refill Child Wallets</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically refill child wallets when balance falls below minimum
                        </p>
                      </div>
                      <Switch id="auto-refill" defaultChecked />
                    </div>
                    
                    <div>
                      <Label htmlFor="min-balance">Minimum Balance Threshold (SOL)</Label>
                      <Input id="min-balance" type="number" defaultValue="5" min="0.1" step="0.1" />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Fund Distribution</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="distribution-method">Distribution Method</Label>
                      <Select defaultValue="percentage">
                        <SelectTrigger id="distribution-method">
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage Based</SelectItem>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                          <SelectItem value="random">Randomized</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="min-allocation">Minimum Allocation (SOL)</Label>
                        <Input id="min-allocation" type="number" defaultValue="5" min="0.1" step="0.1" />
                      </div>
                      <div>
                        <Label htmlFor="max-allocation">Maximum Allocation (SOL)</Label>
                        <Input id="max-allocation" type="number" defaultValue="100" min="1" step="1" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Security Settings</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="transaction-signing">Multiple Signature Requirement</Label>
                        <p className="text-sm text-muted-foreground">
                          Require multiple signatures for large transactions
                        </p>
                      </div>
                      <Switch id="transaction-signing" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="transaction-limits">Transaction Limits</Label>
                        <p className="text-sm text-muted-foreground">
                          Set maximum transaction amounts
                        </p>
                      </div>
                      <Switch id="transaction-limits" defaultChecked />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="max-transaction">Maximum Transaction Amount (SOL)</Label>
                    <Input id="max-transaction" type="number" defaultValue="500" min="1" />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save Wallet Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-6">
            {/* Advanced System Settings Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <SettingsIcon className="h-5 w-5 mr-2" />
                  Advanced System Settings
                </CardTitle>
                <CardDescription>Configure advanced platform settings for optimal performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    These settings are for advanced users. Incorrect configuration may affect system performance and stability.
                  </AlertDescription>
                </Alert>
                
                <Accordion type="single" collapsible className="w-full">
                  {/* Data Management Section */}
                  <AccordionItem value="data-management">
                    <AccordionTrigger className="text-lg font-medium">
                      <div className="flex items-center">
                        <Database className="h-4 w-4 mr-2" />
                        Data Management
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div>
                        <Label htmlFor="data-retention">Data Retention Period</Label>
                        <Select defaultValue="90">
                          <SelectTrigger id="data-retention">
                            <SelectValue placeholder="Select period" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30">30 days</SelectItem>
                            <SelectItem value="60">60 days</SelectItem>
                            <SelectItem value="90">90 days</SelectItem>
                            <SelectItem value="180">180 days</SelectItem>
                            <SelectItem value="365">1 year</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground mt-1">
                          Historical data older than this will be archived
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="auto-backup">Automatic Backups</Label>
                          <p className="text-sm text-muted-foreground">
                            Regularly backup system data to prevent data loss
                          </p>
                        </div>
                        <Switch id="auto-backup" defaultChecked />
                      </div>
                      
                      <div>
                        <Label htmlFor="backup-frequency">Backup Frequency</Label>
                        <Select defaultValue="daily">
                          <SelectTrigger id="backup-frequency">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button 
                          variant="outline" 
                          className="flex items-center" 
                          onClick={runSystemBackup}
                          disabled={isBackupRunning}
                        >
                          {isBackupRunning ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Running Backup...
                            </>
                          ) : (
                            <>
                              <HardDrive className="h-4 w-4 mr-2" />
                              Run Manual Backup
                            </>
                          )}
                        </Button>
                        
                        <Button variant="outline" className="flex items-center">
                          <Database className="h-4 w-4 mr-2" />
                          Purge Old Data
                        </Button>
                      </div>
                      
                      <div>
                        <Label htmlFor="storage-location">Backup Storage Location</Label>
                        <Input id="storage-location" defaultValue="s3://nexus-backups/mainnet/" />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  {/* Network Settings Section */}
                  <AccordionItem value="network-settings">
                    <AccordionTrigger className="text-lg font-medium">
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-2" />
                        Network Configuration
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label htmlFor="rpc-endpoint">Primary RPC Endpoint</Label>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={testRpcEndpoint}
                            disabled={isTestingEndpoint}
                          >
                            {isTestingEndpoint ? (
                              <>
                                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                                Testing...
                              </>
                            ) : (
                              <>Test Connection</>
                            )}
                          </Button>
                        </div>
                        <Input id="rpc-endpoint" defaultValue="https://api.mainnet-beta.solana.com" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="use-fallback">Use Fallback Endpoints</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically switch to backup endpoints on connection failure
                          </p>
                        </div>
                        <Switch id="use-fallback" defaultChecked />
                      </div>
                      
                      <Collapsible
                        open={isCustomEndpointOpen}
                        onOpenChange={setIsCustomEndpointOpen}
                        className="w-full space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <Label>Custom Fallback Endpoints</Label>
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm">
                              {isCustomEndpointOpen ? "Hide" : "Show"} Endpoints
                            </Button>
                          </CollapsibleTrigger>
                        </div>
                        
                        <CollapsibleContent className="space-y-2">
                          {customEndpoints.map((endpoint, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Input value={endpoint} readOnly className="flex-1" />
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => removeCustomEndpoint(endpoint)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          
                          <div className="flex items-center gap-2 mt-2">
                            <Input 
                              placeholder="Add new endpoint URL" 
                              value={newEndpoint}
                              onChange={(e) => setNewEndpoint(e.target.value)}
                              className="flex-1"
                            />
                            <Button 
                              onClick={addCustomEndpoint}
                              disabled={!newEndpoint}
                            >
                              Add
                            </Button>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                      
                      <div>
                        <Label htmlFor="request-timeout">Request Timeout (ms)</Label>
                        <Input id="request-timeout" type="number" defaultValue="30000" min="5000" step="1000" />
                      </div>
                      
                      <div>
                        <Label htmlFor="max-retries">Maximum Connection Retries</Label>
                        <Input id="max-retries" type="number" defaultValue="3" min="1" max="10" />
                      </div>
                      
                      <div>
                        <Label htmlFor="connection-strategy">Connection Strategy</Label>
                        <Select defaultValue="round-robin">
                          <SelectTrigger id="connection-strategy">
                            <SelectValue placeholder="Select strategy" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="priority">Priority Order</SelectItem>
                            <SelectItem value="round-robin">Round Robin</SelectItem>
                            <SelectItem value="fastest">Fastest Response</SelectItem>
                            <SelectItem value="least-loaded">Least Loaded</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  {/* Performance Tuning Section */}
                  <AccordionItem value="performance">
                    <AccordionTrigger className="text-lg font-medium">
                      <div className="flex items-center">
                        <Cpu className="h-4 w-4 mr-2" />
                        Performance Tuning
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cache-strategy">Caching Strategy</Label>
                          <Select defaultValue="adaptive">
                            <SelectTrigger id="cache-strategy">
                              <SelectValue placeholder="Select strategy" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="minimal">Minimal (Lower Memory Usage)</SelectItem>
                              <SelectItem value="balanced">Balanced</SelectItem>
                              <SelectItem value="aggressive">Aggressive (Faster Response)</SelectItem>
                              <SelectItem value="adaptive">Adaptive (Auto-Adjust)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="max-concurrent">Maximum Concurrent Operations</Label>
                          <Input id="max-concurrent" type="number" defaultValue="25" min="5" max="100" />
                          <p className="text-sm text-muted-foreground mt-1">
                            Limit concurrent network operations to prevent throttling
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="prioritize-trading">Prioritize Trading Operations</Label>
                            <p className="text-sm text-muted-foreground">
                              Trading operations take priority over analytics and other background tasks
                            </p>
                          </div>
                          <Switch id="prioritize-trading" defaultChecked />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="prefetch-depth">Market Data Prefetch Depth</Label>
                            <Input id="prefetch-depth" type="number" defaultValue="3" min="0" max="10" />
                          </div>
                          <div>
                            <Label htmlFor="market-update-interval">Market Data Update Interval (ms)</Label>
                            <Input id="market-update-interval" type="number" defaultValue="2000" min="500" step="100" />
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  {/* Advanced Trading Section */}
                  <AccordionItem value="trading-advanced">
                    <AccordionTrigger className="text-lg font-medium">
                      <div className="flex items-center">
                        <LineChart className="h-4 w-4 mr-2" />
                        Advanced Trading Parameters
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div>
                        <Label htmlFor="wallet-concurrency">Maximum Concurrent Wallets</Label>
                        <Input id="wallet-concurrency" type="number" defaultValue="50" min="10" max="500" />
                        <p className="text-sm text-muted-foreground mt-1">
                          Maximum number of wallets that can execute trades simultaneously
                        </p>
                      </div>
                      
                      <div>
                        <Label htmlFor="trade-delay">Inter-Trade Delay Variance (ms)</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="min-delay" className="text-xs">Minimum</Label>
                            <Input id="min-delay" type="number" defaultValue="100" min="50" step="50" />
                          </div>
                          <div>
                            <Label htmlFor="max-delay" className="text-xs">Maximum</Label>
                            <Input id="max-delay" type="number" defaultValue="5000" min="100" step="100" />
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Random delay between trades to simulate natural behavior
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="use-jitter">Apply Trading Jitter</Label>
                          <p className="text-sm text-muted-foreground">
                            Add random variations to trade sizes to avoid detectable patterns
                          </p>
                        </div>
                        <Switch id="use-jitter" defaultChecked />
                      </div>
                      
                      <div>
                        <Label htmlFor="jitter-percent">Jitter Percentage</Label>
                        <Input id="jitter-percent" type="number" defaultValue="5" min="1" max="20" />
                        <p className="text-sm text-muted-foreground mt-1">
                          Maximum percentage variation applied to trade sizes
                        </p>
                      </div>
                      
                      <div>
                        <Label htmlFor="slippage-tolerance">Slippage Tolerance (%)</Label>
                        <Input id="slippage-tolerance" type="number" defaultValue="1" min="0.1" max="5" step="0.1" />
                      </div>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline">
                            <Code className="h-4 w-4 mr-2" />
                            Configure Trading Algorithms
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[625px]">
                          <DialogHeader>
                            <DialogTitle>Trading Algorithm Configuration</DialogTitle>
                            <DialogDescription>
                              Advanced settings for trading algorithms and strategies
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="grid gap-4 py-4">
                            <div>
                              <Label htmlFor="algo-type">Algorithm Type</Label>
                              <Select defaultValue="twap">
                                <SelectTrigger id="algo-type">
                                  <SelectValue placeholder="Select algorithm" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="twap">Time Weighted Average Price (TWAP)</SelectItem>
                                  <SelectItem value="vwap">Volume Weighted Average Price (VWAP)</SelectItem>
                                  <SelectItem value="pov">Percentage of Volume (POV)</SelectItem>
                                  <SelectItem value="iceberg">Iceberg</SelectItem>
                                  <SelectItem value="sniper">Sniper</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label htmlFor="aggression-level">Market Aggression Level</Label>
                              <Select defaultValue="balanced">
                                <SelectTrigger id="aggression-level">
                                  <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="passive">Passive</SelectItem>
                                  <SelectItem value="balanced">Balanced</SelectItem>
                                  <SelectItem value="moderate">Moderate</SelectItem>
                                  <SelectItem value="aggressive">Aggressive</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label htmlFor="min-spread">Minimum Spread Threshold (bps)</Label>
                              <Input id="min-spread" type="number" defaultValue="10" min="1" max="100" />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label htmlFor="auto-hedge">Auto-Hedging</Label>
                                <p className="text-sm text-muted-foreground">
                                  Automatically hedge positions to reduce risk
                                </p>
                              </div>
                              <Switch id="auto-hedge" />
                            </div>
                          </div>
                          
                          <DialogFooter>
                            <Button type="submit">Save Changes</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </AccordionContent>
                  </AccordionItem>
                  
                  {/* System Administration Section */}
                  <AccordionItem value="system-admin">
                    <AccordionTrigger className="text-lg font-medium">
                      <div className="flex items-center">
                        <UserCog className="h-4 w-4 mr-2" />
                        System Administration
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div>
                        <Label htmlFor="log-level">Logging Level</Label>
                        <Select defaultValue="info">
                          <SelectTrigger id="log-level">
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="error">Error Only</SelectItem>
                            <SelectItem value="warn">Warning & Error</SelectItem>
                            <SelectItem value="info">Information</SelectItem>
                            <SelectItem value="debug">Debug</SelectItem>
                            <SelectItem value="verbose">Verbose</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="log-destination">Log Destination</Label>
                        <Select defaultValue="file">
                          <SelectTrigger id="log-destination">
                            <SelectValue placeholder="Select destination" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="console">Console Only</SelectItem>
                            <SelectItem value="file">Log Files</SelectItem>
                            <SelectItem value="remote">Remote Logging Server</SelectItem>
                            <SelectItem value="both">Console and Files</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="log-rotation">Log Rotation</Label>
                        <Select defaultValue="daily">
                          <SelectTrigger id="log-rotation">
                            <SelectValue placeholder="Select rotation" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="size">By Size (10MB)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <Button variant="outline" className="bg-muted/50">
                          <Lock className="h-4 w-4 mr-2" />
                          Update Security Certificates
                        </Button>
                        
                        <Button variant="outline" className="bg-muted/50">
                          <ServerCrash className="h-4 w-4 mr-2" />
                          Troubleshooting Mode
                        </Button>
                        
                        <Button variant="outline" className="bg-muted/50">
                          Clear All Caches
                        </Button>
                        
                        <Button variant="outline" className="bg-muted/50">
                          Reset to Default Settings
                        </Button>
                      </div>
                      
                      <Alert className="mt-4 bg-amber-500/10 border-amber-500 text-amber-600">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Resetting settings or clearing caches may temporarily affect system performance.
                        </AlertDescription>
                      </Alert>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <div>
                  <Label htmlFor="advanced-notes" className="text-lg font-medium mb-2">System Notes</Label>
                  <textarea 
                    id="advanced-notes" 
                    className="w-full min-h-[100px] p-3 rounded-md border border-input bg-transparent text-sm shadow-sm"
                    placeholder="Add notes about your system configuration..."
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save Advanced Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* System Monitoring & Diagnostics Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Network className="h-5 w-5 mr-2" />
                  System Monitoring & Diagnostics
                </CardTitle>
                <CardDescription>
                  Monitor system health and diagnose performance issues
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-muted/10">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">CPU Usage</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Current: 24%</span>
                        <span>Peak: 76%</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: "24%" }} />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted/10">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Memory Usage</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Used: 1.7GB</span>
                        <span>Total: 4GB</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: "42%" }} />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted/10">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Network Latency</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Current: 125ms</span>
                        <span>Avg: 187ms</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-yellow-500 rounded-full" style={{ width: "30%" }} />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">System Diagnostics</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                        <span>RPC Connection</span>
                      </div>
                      <span className="text-sm text-muted-foreground">Online - 34ms</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                        <span>Database</span>
                      </div>
                      <span className="text-sm text-muted-foreground">Connected - 12ms</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2" />
                        <span>Market Data API</span>
                      </div>
                      <span className="text-sm text-muted-foreground">Degraded - 563ms</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                        <span>Backend Services</span>
                      </div>
                      <span className="text-sm text-muted-foreground">OK - 3 running</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4">
                  <Button variant="outline" className="flex-1">
                    Run System Check
                  </Button>
                  <Button variant="outline" className="flex-1">
                    View Detailed Metrics
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Download System Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Settings;
