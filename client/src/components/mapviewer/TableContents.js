import React        from 'react';
import TableEntry   from './TableEntry';

const TableContents = (props) => {
    const entries = props.regions;
    console.log(entries);
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
                    />
                ))
            }

            </div>
            : <div className='container-primary' />
    );
};

export default TableContents;
