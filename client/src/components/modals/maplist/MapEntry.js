import React, { useState }  from 'react';
import { WNavItem, WInput } from 'wt-frontend';

const MapEntry = (props) => {

    const entryStyle = 'map-entry';
    
    // TODO: Make sure when clicked the entry moves into the route "region viewer" to view the map's regions.
    return (
        <WNavItem 
            className={entryStyle}
            onClick={() => { } } hoverAnimation="lighten"
        >
            {
                <div className='map-text'>
                    {props.name}
                </div>
            }
        </WNavItem>
    );
};

export default MapEntry;
