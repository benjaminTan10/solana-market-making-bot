
import { AppLayout } from "@/components/layout/AppLayout";
import { WalletTable } from "@/components/dashboard/WalletTable";
import { WalletActions } from "@/components/dashboard/WalletActions";
import { WalletStats } from "@/components/dashboard/WalletStats";
import { WalletStrategyPanel } from "@/components/dashboard/WalletStrategyPanel";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";

const Wallets = () => {
  return (
    <AppLayout>
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Wallet Management</h1>
            <p className="text-muted-foreground">Manage and monitor your trading wallets</p>
          </div>
          
          <WalletActions />
        </div>
        
        <WalletStats />
        
        <Alert className="mb-6 border-orange-500">
          <AlertCircle className="h-4 w-4 text-orange-500" />
          <AlertTitle>Attention</AlertTitle>
          <AlertDescription>
            Two wallets are running low on funds (below 5 SOL). Consider funding them to maintain optimal trading activity.
          </AlertDescription>
        </Alert>
        
        <Tabs defaultValue="wallets" className="mb-6">
          <TabsList className="grid grid-cols-3 mb-4 w-[400px]">
            <TabsTrigger value="wallets">Wallets</TabsTrigger>
            <TabsTrigger value="strategy">Strategy</TabsTrigger>
            <TabsTrigger value="distribution">Fund Distribution</TabsTrigger>
          </TabsList>
          
          <TabsContent value="wallets" className="space-y-4">
            <WalletTable />
          </TabsContent>
          
          <TabsContent value="strategy" className="space-y-4">
            <WalletStrategyPanel />
          </TabsContent>
          
          <TabsContent value="distribution" className="space-y-4">
            <div className="bg-card rounded-lg border p-6">
              <h3 className="text-lg font-medium mb-4">Fund Distribution Rules</h3>
              <p className="text-muted-foreground mb-6">
                Configure how funds are distributed from the parent wallet to trading wallets.
                Current distribution is randomized within the following constraints.
              </p>
              
              {/* Placeholder for fund distribution configuration UI */}
              <div className="grid gap-6">
                <div>
                  <h4 className="font-medium mb-2">Distribution Method</h4>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <span className="bg-solana-purple/10 text-solana-purple px-2 py-1 rounded text-sm">
                      Randomized Percentage
                    </span>
                    <span>•</span>
                    <span>Min: 5 SOL</span>
                    <span>•</span>
                    <span>Max: 100 SOL</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Last Distribution</h4>
                  <div className="text-muted-foreground">
                    April 2, 2025 at 14:32 UTC • 120 wallets funded • 1,240 SOL total
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Wallets;
