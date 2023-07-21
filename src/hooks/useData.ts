import { useEffect, useState, useRef } from 'react';
import { useInternet } from './useInternet';
import { usePrevious } from './usePrevious';

interface Order {
  // Add your order properties here, for example:
  id: number;
  productName: string;
  quantity: number;
}

export const useRowsData = (): Order[] => {
  const [rows, setRows] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const promiseRef = useRef<Promise<void> | null>(null);
  const internet = useInternet();
  const prev = usePrevious(internet);
  const fetchData = () => {
    promiseRef.current = fetch('http://localhost:5000/api/get-json-file')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        return response.json();
      })
      .then((data: Order[]) => {
        setRows(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      });
  };
  useEffect(() => {
    if (internet && prev === false) {
      fetchData();
    }
  }, [internet, prev]);
  useEffect(() => {
    if (!rows.length && !isLoading && !promiseRef.current) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return rows;
};
