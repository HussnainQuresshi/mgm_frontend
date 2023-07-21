import { useCallback, useEffect, useRef, useState } from 'react';
import TreeGrid from '../../Components/TreeGrid';
import useIndexedDB from '../../hooks/useIndexDb';
import { useRabbitMQ } from '../../hooks/useRabbitMQ';
import { jsonAction } from '../../services';

function Home() {
  const indexedDBHook = useIndexedDB();
  const rabbitMq = useRabbitMQ();
  const dataRef = useRef<any>(null);
  const [sortData, setSortData] = useState<any>([]);

  const { db, getDataFromIndexedDB, saveDataToIndexedDB, updateDataInIndexedDB, deleteDataFromIndexedDB } =
    indexedDBHook;
  const { event, data, id } = rabbitMq;

  const fetchData = useCallback(() => {
    getDataFromIndexedDB().then(data => {
      setSortData(() => data);
    });
  }, [getDataFromIndexedDB]);

  useEffect(() => {
    if (id) {
      if (event === 'add' || event === 'save') {
        saveDataToIndexedDB([{ ...data, ParentID: data.ParentID || null, hasChild: data.hasChild || false }]).then(() =>
          fetchData(),
        );
      } else if (event === 'edit') {
        updateDataInIndexedDB([data]).then(() => fetchData());
      } else if (event === 'delete') {
        let { RowID } = data;
        // eslint-disable-next-line eqeqeq
        let ids = [RowID, ...sortData.filter((item: any) => item.ParentID == RowID).map((item: any) => item.RowID)];
        ids = sortData
          .filter((item: any) => ids.includes(item.RowID) || ids.includes(item.ParentID))
          .map((item: any) => item.RowID);
        deleteDataFromIndexedDB(ids).then(() => fetchData());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (db && !dataRef.current) {
      dataRef.current = true;
      fetchData();
    }
  }, [db, fetchData, getDataFromIndexedDB]);

  return (
    <TreeGrid
      sortData={sortData}
      action={(e: any) => {
        if (
          e.type === 'actionComplete' &&
          (['save', 'edit', 'add', 'delete'].includes(e.action) ||
            ['save', 'add', 'edit', 'delete'].includes(e.requestType))
        ) {
          const { Column1, Column2, Column3, Column4, ParentID, RowID } =
            e.requestType === 'delete' ? e.data[0] : e.data;
          jsonAction({
            event: e.requestType === 'delete' ? 'delete' : e.action,
            Column1,
            Column2,
            Column3,
            Column4,
            ParentID,
            RowID,
          });
        }
      }}
    />
  );
}

export default Home;
