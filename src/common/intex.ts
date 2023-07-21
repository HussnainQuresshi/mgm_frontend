export const makeTree = (data: string | any[]) => {
  const tree = [];
  const mappedArr: any = {};
  let arrElem: any;
  let mappedElem: any;

  for (let i = 0, len = data.length; i < len; i++) {
    arrElem = data[i];
    mappedArr[arrElem.RowID] = { ...arrElem, Children: [], subtasks: [] };
  }

  for (const id in mappedArr) {
    if (mappedArr.hasOwnProperty(id)) {
      mappedElem = mappedArr[id];
      if (mappedElem.ParentID) {
        mappedArr[mappedElem.ParentID].Children.push(mappedElem);
        mappedArr[mappedElem.ParentID].subtasks.push(mappedElem);
        mappedArr[mappedElem.ParentID].hasChild = true;
      } else {
        tree.push(mappedElem);
      }
    }
  }
  return tree;
};
