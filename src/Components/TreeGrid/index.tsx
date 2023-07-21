import {
  ColumnDirective,
  ColumnsDirective,
  TreeGridComponent,
  Inject,
  Edit,
  Toolbar,
  ContextMenu,
} from '@syncfusion/ej2-react-treegrid';
import { makeTree } from '../../common/intex';
import { useEffect } from 'react';

interface TreeGridProps {
  sortData: Object[];
  action: any;
}

function TreeGrid({ sortData, action }: TreeGridProps) {
  useEffect(() => {
    if ((window as any).treegrid) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      sortData = makeTree(sortData);
      (window as any).treegrid.dataSource = sortData;
    }
  }, [sortData, makeTree]);

  return (
    <TreeGridComponent
      autoCheckHierarchy={true}
      ref={treegrid => ((window as any).treegrid = treegrid)}
      dataSource={[]} // issue
      childMapping="Children"
      height="800"
      loadingIndicator={{ indicatorType: 'Shimmer' }}
      editSettings={{
        allowAdding: true,
        allowDeleting: true,
        allowEditing: true,
        mode: 'Row',
        showConfirmDialog: true,
        showDeleteConfirmDialog: true,
      }}
      toolbar={['Add', 'Edit', 'Delete']}
      treeColumnIndex={1}
      idMapping="RowID"
      parentIdMapping="ParentID"
      actionComplete={action}
      hasChildMapping="hasChild"
      contextMenuItems={['AddRow', 'Delete', 'Edit']}>
      <ColumnsDirective>
        <ColumnDirective field="RowID" headerText="Row ID" width="120" textAlign="Right" />
        <ColumnDirective field="Column1" headerText="Column 1" width="240" textAlign="Left" />
        <ColumnDirective field="Column2" headerText="Column 2" width="140" textAlign="Right" />
        <ColumnDirective field="Column3" headerText="Column 3" width="130" textAlign="Right" />
        <ColumnDirective field="Column4" headerText="Column 4" width="130" />
      </ColumnsDirective>
      <Inject services={[Edit, Toolbar, ContextMenu]} />
    </TreeGridComponent>
  );
}

export default TreeGrid;
