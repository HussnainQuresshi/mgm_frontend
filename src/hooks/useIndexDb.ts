import { useEffect, useRef, useState } from 'react';
import { useRowsData } from './useData';

function useIndexedDB() {
  const [db, setDB] = useState<IDBDatabase | null>(null);
  const db_data = useRowsData();
  const savedRef = useRef(false);
  useEffect(() => {
    const openDB = async () => {
      try {
        const request: IDBOpenDBRequest = indexedDB.open('TreeGridDB', 1);

        request.onupgradeneeded = (event: any) => {
          const db = event.target.result as IDBDatabase;
          if (!db.objectStoreNames.contains('TreeGridStore')) {
            db.createObjectStore('TreeGridStore', { keyPath: 'RowID' });
          }
        };

        request.onsuccess = (event: any) => {
          setDB(event.target.result as IDBDatabase);
        };

        request.onerror = (event: any) => {
          console.error('Error opening IndexedDB:', event.target.error);
        };
      } catch (error) {
        console.error('Error opening IndexedDB:', error);
      }
    };
    openDB();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (db_data?.length && db && !savedRef.current) {
      savedRef.current = true;
      saveDataToIndexedDB(db_data).then(() => {
        console.log({ INDEX_DB: 'Data saved to IndexedDB' });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db_data?.length, db, savedRef.current]);
  const removeDuplicates = (arr: any[]) => {
    const unique = arr
      .map(e => e['RowID'])
      .map((e, i, final) => final.indexOf(e) === i && i)
      .filter(e => arr[e as any])
      .map(e => arr[e as any]);

    return unique;
  };
  const saveDataToIndexedDB = async (data: any[]) => {
    console.log({ saveToDbCalled: data });
    if (!db) return;

    const transaction: IDBTransaction = db.transaction('TreeGridStore', 'readwrite');
    const store: IDBObjectStore = transaction.objectStore('TreeGridStore');

    const request: IDBRequest<IDBRequest<IDBValidKey>[]> = store.getAll();

    request.onsuccess = event => {
      let old: any = (event.target as IDBRequest<IDBRequest<IDBValidKey>[]>).result;
      console.log({ old });
      old = removeDuplicates([...old, ...data]);
      store.clear();
      old.forEach((item: any) => {
        store.add(item);
      });
    };

    request.onerror = event => {
      console.error('Error getting data from IndexedDB:', (event.target as IDBRequest).error);
    };
  };

  const getDataFromIndexedDB = async (): Promise<any[]> => {
    if (!db) return [];

    const transaction: IDBTransaction = db.transaction('TreeGridStore', 'readonly');
    const store: IDBObjectStore = transaction.objectStore('TreeGridStore');
    return new Promise((resolve, reject) => {
      const request: IDBRequest<IDBRequest<IDBValidKey>[]> = store.getAll();

      request.onsuccess = event => {
        const data: any = (event.target as IDBRequest<IDBRequest<IDBValidKey>[]>).result;
        resolve(data);
      };

      request.onerror = event => {
        console.error('Error getting data from IndexedDB:', (event.target as IDBRequest).error);
        reject((event.target as IDBRequest).error);
      };
    });
  };

  const updateDataInIndexedDB = async (updatedData: any[]) => {
    console.log({ updateDataInIndexedDB: updatedData });

    if (!db) return;

    const transaction: IDBTransaction = db.transaction('TreeGridStore', 'readwrite');
    const store: IDBObjectStore = transaction.objectStore('TreeGridStore');

    updatedData.forEach(item => {
      store.put(item);
    });
  };

  const deleteDataFromIndexedDB = async (rowIDsToDelete: number[]) => {
    console.log({ deleteDataFromIndexedDB: rowIDsToDelete });

    if (!db) return;

    const transaction: IDBTransaction = db.transaction('TreeGridStore', 'readwrite');
    const store: IDBObjectStore = transaction.objectStore('TreeGridStore');

    rowIDsToDelete.forEach(rowID => {
      store.delete(rowID);
    });
  };

  return {
    db,
    saveDataToIndexedDB,
    getDataFromIndexedDB,
    updateDataInIndexedDB,
    deleteDataFromIndexedDB,
  };
}

export default useIndexedDB;
