import React        from 'react';
import LandmarkEntry   from './LandmarkEntry';
import { WButton, WRow, WCol } from 'wt-frontend';

const LandmarkContents = (props) => {
    const entries = props && props.regions && props.regions.landmarks ? props.regions.landmarks : [];
    return (
        entries ? <div className='landmark-container table-entries container-primary'>
            {
                entries.map((entry, index) => (
                    <LandmarkEntry
                        landmark={entry}
                        key={entry}
                        regionId={props.regionId}
                        setShowdeleteLandmark={props.setShowDeleteLandmark}
                        index={index}
                    />
                ))
            }
            </div>
            : <div className='landmark-container container-primary'></div>
    );
};

export default LandmarkContents;
