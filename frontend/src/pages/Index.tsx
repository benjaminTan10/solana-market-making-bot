
import { AppLayout } from "@/components/layout/AppLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { PriceChart } from "@/components/dashboard/PriceChart";
import { WalletTable } from "@/components/dashboard/WalletTable";
import { TransactionLog } from "@/components/dashboard/TransactionLog";
import { WalletStats } from "@/components/dashboard/WalletStats";
import { Wallet, LineChart, ArrowUp, ArrowDown, BarChart2 } from "lucide-react";

const Index = () => {
  return (
    <AppLayout>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        {/* Wallet Stats */}
        <WalletStats />
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Active Wallets"
            value="42"
            icon={<Wallet className="h-4 w-4" />}
            description="Total wallets managed"
          />
          <StatsCard
            title="24h Trading Volume"
            value="$152,483"
            icon={<BarChart2 className="h-4 w-4" />}
            trend="up"
            trendValue="+8.3%"
            description="From previous day"
          />
          <StatsCard
            title="Parent Wallet Balance"
            value="235.72 SOL"
            icon={<Wallet className="h-4 w-4" />}
            description="≈ $35,217"
          />
          <StatsCard
            title="Today's Trades"
            value="1,247"
            icon={<LineChart className="h-4 w-4" />}
            trend="up"
            trendValue="+124"
            description="From yesterday"
          />
        </div>
        
        {/* Price Chart and Transaction Log - now with a more balanced layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          <div className="lg:col-span-7">
            <PriceChart />
          </div>
          <div className="lg:col-span-5">
            <TransactionLog />
          </div>
        </div>
        
        {/* Wallet Table */}
        <div className="mb-6">
          <WalletTable />
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
