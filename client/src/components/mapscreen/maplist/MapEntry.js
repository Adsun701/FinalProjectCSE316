import React  from 'react';
import { WNavItem, WButton } from 'wt-frontend';

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
            <WButton className="map-entry-buttons" onClick={() => {props.setShowDelete(props._id);}} wType="texted">
                <i className="material-icons">close</i>
            </WButton>
        </WNavItem>
    );
};

export default MapEntry;
