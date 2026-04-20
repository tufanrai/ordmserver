import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // client joins a room using their restaurantId
  // this scopes all events to their restaurant only
  @SubscribeMessage('joinRestaurant')
  handleJoinRestaurant(
    @MessageBody() data: { restaurantId: string; role: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.restaurantId);
    console.log(`${data.role} joined restaurant room: ${data.restaurantId}`);
    return {
      event: 'joinedRestaurant',
      data: `Joined room ${data.restaurantId}`,
    };
  }

  // ── ORDER EVENTS ──────────────────────────────────────────

  // cashier places a new order → kitchen sees it instantly
  emitNewOrder(restaurantId: string, order: any) {
    this.server.to(restaurantId).emit('newOrder', order);
  }

  // kitchen updates order status → cashier + owner see it instantly
  emitOrderStatusUpdated(restaurantId: string, order: any) {
    this.server.to(restaurantId).emit('orderStatusUpdated', order);
  }

  // order cancelled → all parties notified
  emitOrderCancelled(restaurantId: string, order: any) {
    this.server.to(restaurantId).emit('orderCancelled', order);
  }

  // ── BILL EVENTS ───────────────────────────────────────────

  // cashier generates a bill → owner dashboard updates instantly
  emitBillCreated(restaurantId: string, bill: any) {
    this.server.to(restaurantId).emit('billCreated', bill);
  }

  // bill payment processed → owner sees payment method + total
  emitBillUpdated(restaurantId: string, bill: any) {
    this.server.to(restaurantId).emit('billUpdated', bill);
  }

  // ── INVENTORY EVENTS ──────────────────────────────────────

  // drink stock running low → owner gets notified
  emitLowInventory(restaurantId: string, item: any) {
    this.server.to(restaurantId).emit('lowInventory', item);
  }
}
