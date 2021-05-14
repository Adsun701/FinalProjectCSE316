import React        from 'react';
import LandmarkEntry   from './LandmarkEntry';
import { GET_DB_LANDMARKS_OF_SUBREGIONS } 				from '../../cache/queries';
import { useQuery } 		from '@apollo/client';

const LandmarkContents = (props) => {
    // get landmarks of subregions.
    let subregionLandmarks = null;
    let data = useQuery(GET_DB_LANDMARKS_OF_SUBREGIONS, { variables: {_ids: props.region ? props.region.regions : []} })['data'];
    if (data) subregionLandmarks = data.getLandmarksOfSubregions;
    let newEntries = (props.region ? props.region.landmarks : []).concat(subregionLandmarks ? subregionLandmarks : []);
    newEntries.sort((a, b) => {return a > b});

    const entries = newEntries;
    return (
        entries ? <div className='landmark-container table-entries container-primary'>
            {
                entries.map((entry, index) => (
                    <LandmarkEntry
                        landmark={entry}
                        key={entry}
                        setShowDeleteLandmark={props.setShowDeleteLandmark}
                        index={index}
                        editable={entry.includes(' - ') ? false : true}
                    />
                ))
            }
            </div>
            : <div className='landmark-container container-primary'></div>
    );
};

export default LandmarkContents;
