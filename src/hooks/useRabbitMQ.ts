import { useEffect, useMemo, useRef, useState } from 'react';
import Stomp, { Client, Message } from 'stompjs';

const rabbitUrl = 'ws://127.0.0.1:15674/ws';
const rabbitChannel = '/exchange/treegrid_updates';
const NULL: any = null;
interface RabbitMQMessage {
  event: string;
  data: any;
  id: number;
}

export const useRabbitMQ = (): RabbitMQMessage => {
  const clientRef = useRef<Client | null>(null);
  const [message, setMessage] = useState<RabbitMQMessage>({
    event: '',
    data: null,
    id: 0,
  });

  useEffect(() => {
    if (!clientRef.current) {
      const socket = new WebSocket(rabbitUrl);
      const client = Stomp.over(socket);

      client.debug = NULL;
      client.connect('guest', 'guest', () => {
        client.subscribe(rabbitChannel, (message: Message) => {
          const { event, data } = JSON.parse(message.body);
          setMessage(prevMessage => ({
            event,
            data,
            id: prevMessage.id + 1,
          }));
        });
      });
      clientRef.current = client;
    }
  }, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => message, [message.id]);
};
