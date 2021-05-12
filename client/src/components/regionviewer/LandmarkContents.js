import React        from 'react';
import LandmarkEntry   from './LandmarkEntry';

const LandmarkContents = (props) => {
    const entries = props && props.region && props.region.landmarks ? props.region.landmarks : [];
    return (
        entries ? <div className='landmark-container table-entries container-primary'>
            {
                entries.map((entry, index) => (
                    <LandmarkEntry
                        landmark={entry}
                        key={entry}
                        setShowDeleteLandmark={props.setShowDeleteLandmark}
                        index={index}
                    />
                ))
            }
            </div>
            : <div className='landmark-container container-primary'></div>
    );
};

export default LandmarkContents;
