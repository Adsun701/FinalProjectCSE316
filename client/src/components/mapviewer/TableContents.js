import React, { useState }        from 'react';
import TableEntry   from './TableEntry';

const TableContents = (props) => {
    const entries = props && props.regions ? props.regions : [];
    const [editIndex, setEditIndex] = useState(-1);
    const [editField, setEditField] = useState('');
    const ancestryFormat = (arr) => {
        let s = "";
        for (let i = 0; i < arr.length; i++) {
            s += arr[i] + '/';
        }
        return s;
    }
    let ancestry = '../flags/' + ancestryFormat(props.ancestry);

    return (
        entries ? <div className=' table-entries container-primary'>
            {
                entries.map((entry, index) => (
                    <TableEntry
                        region={entry}
                        regionId={entry._id}
                        key={entry._id}
                        deleteRegion={props.deleteRegion} setCurrentRegion={props.setCurrentRegion} setShowDeleteRegion={props.setShowDeleteRegion}
                        editRegion={props.editRegion}
                        regionViewer={props.regionViewer}
                        goToRegion={props.goToRegion}
                        index={index}
                        len={entries.length}
                        editing={editIndex===index ? true : false} setEditIndex={setEditIndex}
                        editField={editField} setEditField={setEditField} flagPath={ancestry + props.currentParentName + '/' + entry.name + " Flag.png"}
                        parent={props.currentParentName}
                    />
                ))
            }

            </div>
            : <div className='container-primary' />
    );
};

export default TableContents;
