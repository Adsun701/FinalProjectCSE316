import React  from 'react';
import { WNavItem, WRow, WCol, WButton } from 'wt-frontend';

const MapEntry = (props) => {

    const entryStyle = 'map-entry';
    
    // TODO: Make sure when clicked the entry moves into the route "region viewer" to view the map's regions.
    return (
        <WRow
            className={entryStyle}
            onClick={() => { } } hoverAnimation="lighten"
        >
            <WCol size='6'>
                <WNavItem>
                    {
                        <div className='map-text'>
                            {props.name}
                        </div>
                    }
                </WNavItem>
            </WCol>
            <WCol size='1'>
                <WButton className="map-entry-buttons" onClick={() => {props.setShowDelete(props._id);}} wType="texted">
                    <i className="material-icons">delete_forever</i>
                </WButton>
            </WCol>
            <WCol size='1'>
                <WButton className="map-entry-buttons" onClick={() => {props.setShowRename(props._id, props.name);}} wType="texted">
                    <i className="material-icons">edit</i>
                </WButton>
            </WCol>
        </WRow>
    );
};

export default MapEntry;
