import React        from 'react';
import TableEntry   from './TableEntry';

const TableContents = (props) => {

    const entries = props.map ? props.map.regions : null;
    return (
        entries ? <div className=' table-entries container-primary'>
            {
                entries.map((entry) => (
                    <TableEntry
                        regionId={entry}
                        deleteRegion={props.deleteRegion}
                        //updateRegionField={props.updateRegionField}
                    />
                ))
            }

            </div>
            : <div className='container-primary' />
    );
};

export default TableContents;