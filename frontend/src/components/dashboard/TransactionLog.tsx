
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Clock, TrendingUp, TrendingDown, ArrowUpRight, AlertTriangle } from "lucide-react";

interface Transaction {
  id: string;
  walletAddress: string;
  action: 'buy' | 'sell';
  amount: number;
  token: string;
  price: number;
  timestamp: Date;
  status: 'success' | 'failed' | 'pending';
  slippage?: number;
}

const mockTransactions: Transaction[] = [
  {
    id: 'tx1',
    walletAddress: 'SoBHM7uQoJvK3oFCkHMtzwkJHyT39kSXYbCGr8vbGxg',
    action: 'buy',
    amount: 10.5,
    token: 'SOL',
    price: 149.32,
    timestamp: new Date(Date.now() - 35000),
    status: 'success',
  },
  {
    id: 'tx2',
    walletAddress: '7hr7Ag2bqaZfhwTrvoADaEJKzTGYQQYQjFoJmcB9bvYz',
    action: 'sell',
    amount: 5.2,
    token: 'SOL',
    price: 150.17,
    timestamp: new Date(Date.now() - 120000),
    status: 'success',
    slippage: 0.3,
  },
  {
    id: 'tx3',
    walletAddress: '2LDWtQhcYyNYxsBi3VrhFPcizSzNZXCnr8tsucmKE4Eu',
    action: 'buy',
    amount: 2.8,
    token: 'SOL',
    price: 148.92,
    timestamp: new Date(Date.now() - 240000),
    status: 'failed',
  },
  {
    id: 'tx4',
    walletAddress: 'GpQ3s7Y2ErvLeRPzReZfGQcKiB7DGKyBjhBy8K3QdWnj',
    action: 'buy',
    amount: 12.3,
    token: 'SOL',
    price: 149.05,
    timestamp: new Date(Date.now() - 360000),
    status: 'success',
  },
  {
    id: 'tx5',
    walletAddress: '9xKPuBJqMxpPw5qHSQZZSHetgDKJeT3Xz4gQgnLWZDKA',
    action: 'sell',
    amount: 8.7,
    token: 'SOL',
    price: 149.87,
    timestamp: new Date(Date.now() - 480000),
    status: 'success',
    slippage: 1.2,
  },
];

export function TransactionLog() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [stats, setStats] = useState({
    buyCount: 0,
    sellCount: 0,
    failureRate: 0,
    avgSlippage: 0
  });
  
  // Simulate new transactions coming in
  useEffect(() => {
    const actions: ('buy' | 'sell')[] = ['buy', 'sell'];
    const tokens = ['SOL'];
    const wallets = [
      'SoBHM7uQoJvK3oFCkHMtzwkJHyT39kSXYbCGr8vbGxg',
      '7hr7Ag2bqaZfhwTrvoADaEJKzTGYQQYQjFoJmcB9bvYz',
      '2LDWtQhcYyNYxsBi3VrhFPcizSzNZXCnr8tsucmKE4Eu',
      'GpQ3s7Y2ErvLeRPzReZfGQcKiB7DGKyBjhBy8K3QdWnj',
      '9xKPuBJqMxpPw5qHSQZZSHetgDKJeT3Xz4gQgnLWZDKA'
    ];
    
    const addTransaction = () => {
      const newTx: Transaction = {
        id: `tx${Date.now()}`,
        walletAddress: wallets[Math.floor(Math.random() * wallets.length)],
        action: actions[Math.floor(Math.random() * actions.length)],
        amount: +(Math.random() * 20 + 1).toFixed(2),
        token: tokens[Math.floor(Math.random() * tokens.length)],
        price: +(Math.random() * 5 + 147).toFixed(2),
        timestamp: new Date(),
        status: Math.random() > 0.9 ? 'failed' : 'success',
      };
      
      // Add slippage to some transactions
      if (Math.random() > 0.6) {
        newTx.slippage = +(Math.random() * 2).toFixed(1);
      }
      
      setTransactions(prev => [newTx, ...prev].slice(0, 20));
    };
    
    const interval = setInterval(addTransaction, 8000);
    return () => clearInterval(interval);
  }, []);
  
  // Calculate stats from transactions
  useEffect(() => {
    const buyCount = transactions.filter(tx => tx.action === 'buy' && tx.status === 'success').length;
    const sellCount = transactions.filter(tx => tx.action === 'sell' && tx.status === 'success').length;
    const failedCount = transactions.filter(tx => tx.status === 'failed').length;
    const failureRate = transactions.length > 0 ? (failedCount / transactions.length * 100) : 0;
    
    const txWithSlippage = transactions.filter(tx => tx.slippage !== undefined);
    const avgSlippage = txWithSlippage.length > 0 
      ? txWithSlippage.reduce((sum, tx) => sum + (tx.slippage || 0), 0) / txWithSlippage.length 
      : 0;
    
    setStats({
      buyCount,
      sellCount,
      failureRate,
      avgSlippage
    });
  }, [transactions]);
  
  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          <span>Transaction Log</span>
          <div className="flex space-x-2 text-xs">
            <div className="flex items-center text-solana-green">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>{stats.buyCount} buys</span>
            </div>
            <div className="flex items-center text-destructive">
              <TrendingDown className="h-3 w-3 mr-1" />
              <span>{stats.sellCount} sells</span>
            </div>
            <div className="flex items-center text-orange-400">
              <AlertTriangle className="h-3 w-3 mr-1" />
              <span>{stats.failureRate.toFixed(1)}% failed</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] px-4">
          {transactions.map(tx => (
            <div 
              key={tx.id}
              className={cn(
                "py-3 border-b border-border flex items-center justify-between text-sm animate-fade-in",
                tx.status === 'failed' && "bg-destructive/10"
              )}
            >
              <div className="flex items-start space-x-3">
                <div 
                  className={cn(
                    "mt-1 w-2 h-2 rounded-full shrink-0",
                    tx.status === 'success' ? (
                      tx.action === 'buy' ? "bg-solana-green" : "bg-destructive"
                    ) : "bg-orange-500"
                  )}
                />
                <div>
                  <div className="flex items-center">
                    <span className="text-muted-foreground">
                      {tx.walletAddress.substring(0, 4)}...{tx.walletAddress.substring(tx.walletAddress.length - 4)}
                    </span>
                    <span className="mx-1 font-medium">
                      {tx.action === 'buy' ? 'bought' : 'sold'}
                    </span>
                    <span className="font-mono font-medium">
                      {tx.amount} {tx.token}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center flex-wrap">
                    <span>@ ${tx.price.toFixed(2)}</span>
                    {tx.slippage && (
                      <span className={tx.slippage > 1 ? "text-orange-500 ml-2" : "text-muted-foreground ml-2"}>
                        ({tx.slippage}% slippage)
                      </span>
                    )}
                    {tx.status === 'failed' && (
                      <span className="text-destructive ml-2">
                        Transaction failed
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {formatTimeAgo(tx.timestamp)}
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
