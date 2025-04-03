
import { AppLayout } from "@/components/layout/AppLayout";
import { OrderBook } from "@/components/orderbook/OrderBook";

const OrderBookPage = () => {
  return (
    <AppLayout>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">Order Book Visualization</h1>
        <p className="text-muted-foreground mb-6">
          This interactive order book visualizes your market making activity in real-time, showing how your bot orders blend 
          into overall market depth. Toggle bot orders visibility and adjust animation speed using the controls.
        </p>
        
        <div className="grid grid-cols-1 gap-6">
          <OrderBook />
        </div>
      </div>
    </AppLayout>
  );
};

export default OrderBookPage;
