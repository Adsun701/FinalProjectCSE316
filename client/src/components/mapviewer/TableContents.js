import React        from 'react';
import TableEntry   from './TableEntry';

const TableContents = (props) => {
    const entries = props.parent ? props.parent.regions : null;
    return (
        entries ? <div className=' table-entries container-primary'>
            {
                entries.map((entry, index) => (
                    <TableEntry
                        regionId={entry}
                        key={entry}
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
