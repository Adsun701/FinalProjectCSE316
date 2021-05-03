import React        from 'react';
import TableEntry   from './TableEntry';

const TableContents = (props) => {
    console.log(props);
    const entries = props.parent ? props.parent.regions : null;
    return (
        entries ? <div className=' table-entries container-primary'>
            {
                entries.map((entry) => (
                    <TableEntry
                        regionId={entry}
                        deleteRegion={props.deleteRegion}
                        //updateRegionField={props.updateRegionField}
                        regionViewer={props.regionViewer}
                        goToRegion={props.goToRegion}
                    />
                ))
            }

            </div>
            : <div className='container-primary' />
    );
};

export default TableContents;
