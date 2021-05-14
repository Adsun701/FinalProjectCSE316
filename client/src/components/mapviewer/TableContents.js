import React, { useState }        from 'react';
import TableEntry   from './TableEntry';

const TableContents = (props) => {
    const entries = props && props.regions ? props.regions : [];
    const [editIndex, setEditIndex] = useState(-1);
    const [editField, setEditField] = useState('');
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
                        editField={editField} setEditField={setEditField}
                    />
                ))
            }

            </div>
            : <div className='container-primary' />
    );
};

export default TableContents;
