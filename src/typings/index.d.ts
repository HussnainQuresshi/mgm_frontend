declare module "stompjs" {
  export type Headers = { [key: any]: any };
  export type Subscription = {
    unsubscribe: () => void;
    id: any;
  };
  export type Message = {
    command: any;
    headers: any;
    body: any;
    ack?: () => void;
    nack?: () => void;
  };
  export type MessageCallback = (message: Message) => void;
  export type ConnectCallback = (frame: any) => void;
  export type ErrorCallback = (error: any | Error) => void;

  export class Client {
    constructor(webSocket: any);
    connect(headers: any, connectCallback: any, errorCallback?: any): void;
    disconnect(disconnectCallback?: () => void, headers?: any): void;
    send(destination: any, headers?: any, body?: any): void;
    subscribe(destination: any, callback: any, headers?: any): any;
    unsubscribe(subscription: any, headers?: any): void;
    begin(transaction: any): any;
    commit(transaction: any): any;
    abort(transaction: any): any;
    ack(messageId: any, subscription: any, headers?: any): void;
    nack(messageId: any, subscription: any, headers?: any): void;
    debug(...args: any[]): void;
    static over(socket: any): Client;
  }
  export interface Stomp {
    over(socket: any): Client;
  }

  const stomp: Stomp;
  export default stomp;
}
