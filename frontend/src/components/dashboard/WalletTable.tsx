
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data for wallets
const walletData = [
  {
    id: "1",
    address: "SoBHM7uQoJvK3oFCkHMtzwkJHyT39kSXYbCGr8vbGxg",
    balance: 35.42,
    status: "Active",
    trades24h: 127,
    volume24h: 8403.21,
    trustScore: 95,
  },
  {
    id: "2",
    address: "7hr7Ag2bqaZfhwTrvoADaEJKzTGYQQYQjFoJmcB9bvYz",
    balance: 18.73,
    status: "Active",
    trades24h: 83,
    volume24h: 4562.89,
    trustScore: 92,
  },
  {
    id: "3",
    address: "2LDWtQhcYyNYxsBi3VrhFPcizSzNZXCnr8tsucmKE4Eu",
    balance: 5.18,
    status: "Low Balance",
    trades24h: 42,
    volume24h: 1287.56,
    trustScore: 88,
  },
  {
    id: "4",
    address: "9xKPuBJqMxpPw5qHSQZZSHetgDKJeT3Xz4gQgnLWZDKA",
    balance: 62.91,
    status: "Active",
    trades24h: 214,
    volume24h: 15642.22,
    trustScore: 98,
  },
  {
    id: "5",
    address: "GpQ3s7Y2ErvLeRPzReZfGQcKiB7DGKyBjhBy8K3QdWnj",
    balance: 0.72,
    status: "Low Balance",
    trades24h: 8,
    volume24h: 421.17,
    trustScore: 73,
  },
];

export function WalletTable() {
  const [selectedWallets, setSelectedWallets] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("balance");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Toggle row selection
  const toggleSelect = (id: string) => {
    if (selectedWallets.includes(id)) {
      setSelectedWallets(selectedWallets.filter(wId => wId !== id));
    } else {
      setSelectedWallets([...selectedWallets, id]);
    }
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedWallets.length === walletData.length) {
      setSelectedWallets([]);
    } else {
      setSelectedWallets(walletData.map(w => w.id));
    }
  };

  // Handle sort
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("desc");
    }
  };

  // Sort wallets
  const sortedWallets = [...walletData].sort((a, b) => {
    const aValue = a[sortBy as keyof typeof a];
    const bValue = b[sortBy as keyof typeof b];
    
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }
    
    // String comparison
    if (sortDirection === "asc") {
      return String(aValue).localeCompare(String(bValue));
    } else {
      return String(bValue).localeCompare(String(aValue));
    }
  });

  return (
    <div className="bg-card rounded-lg border">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-medium">Wallet Management</h3>
        <div className="flex space-x-2">
          {selectedWallets.length > 0 ? (
            <>
              <Button variant="outline" size="sm">Fund</Button>
              <Button variant="outline" size="sm">Pause</Button>
              <Button variant="destructive" size="sm">Defund</Button>
            </>
          ) : (
            <Button variant="outline" size="sm">+ Add Wallet</Button>
          )}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox 
                  checked={selectedWallets.length === walletData.length} 
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>Address</TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("balance")}>
                  Balance (SOL)
                  {sortBy === "balance" && (
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("trades24h")}>
                  24h Trades
                  {sortBy === "trades24h" && (
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("volume24h")}>
                  24h Volume ($)
                  {sortBy === "volume24h" && (
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("trustScore")}>
                  Trust Score
                  {sortBy === "trustScore" && (
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedWallets.map((wallet) => (
              <TableRow key={wallet.id} className="table-row-hover">
                <TableCell>
                  <Checkbox 
                    checked={selectedWallets.includes(wallet.id)} 
                    onCheckedChange={() => toggleSelect(wallet.id)}
                  />
                </TableCell>
                <TableCell className="font-mono text-xs overflow-hidden text-ellipsis">
                  {wallet.address.substring(0, 6)}...{wallet.address.substring(wallet.address.length - 4)}
                </TableCell>
                <TableCell className="font-mono">
                  {wallet.balance.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      wallet.status === "Active" ? "border-solana-green text-solana-green" : "border-destructive text-destructive"
                    )}
                  >
                    {wallet.status}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono">{wallet.trades24h}</TableCell>
                <TableCell className="font-mono">${wallet.volume24h.toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className="h-2 w-16 bg-muted rounded-full overflow-hidden mr-2">
                      <div 
                        className={cn(
                          "h-full",
                          wallet.trustScore > 90 ? "bg-solana-green" : 
                          wallet.trustScore > 80 ? "bg-solana-blue" :
                          wallet.trustScore > 70 ? "bg-orange-500" : "bg-red-500"
                        )}
                        style={{ width: `${wallet.trustScore}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono">{wallet.trustScore}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuGroup>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Fund</DropdownMenuItem>
                        <DropdownMenuItem>Pause</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Defund</DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
