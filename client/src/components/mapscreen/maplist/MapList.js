import React        from 'react';
import MapEntry from './MapEntry';

const MapList = (props) => {
    return (
        <>
            {
                props.maps &&
                props.maps.map(map => (
                    <MapEntry
                        _id={map._id} key={map._id} name={map.name} setShowDelete={props.setShowDelete}
                    />
                ))
            }
        </>
    );
};

export default MapList;
