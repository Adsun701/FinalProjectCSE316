import React, { useState } from 'react';
import { WButton, WRow, WCol } from 'wt-frontend';

const TableEntry = (props) => {

    const region = props.region ? {
        _id: props.region._id,
        name: props.region.name,
        capital: props.region.capital,
        leader: props.region.leader,
        flag: props.region.flag,
        landmarks: props.region.landmarks,
        regions: props.region.regions,
        parent: props.region.parent,
        map: props.region.map,
        ancestry: props.region.ancestry
    } : {};
    const _id = region && region._id ? region._id : 'Error';
    const name = region && region.name ? region.name : 'Error';
    const capital = region && region.capital ? region.capital : 'Error';
    const leader = region && region.leader ? region.leader : 'Error';
    const flag = region && region.flag ? region.flag : 'Error';
    const landmarks = region && region.landmarks ? region.landmarks : [];
    const [editingName, toggleNameEdit] = useState(false);
    const [editingCapital, toggleCapitalEdit] = useState(false);
    const [editingLeader, toggleLeaderEdit] = useState(false);
    const [editingFlag, toggleFlagEdit] = useState(false);

    const handleNameEdit = (e) => {
        toggleNameEdit(false);
        const newName = e.target.value ? e.target.value : 'N/A';
        const prevName = name;
        if (newName === prevName) return;
        props.editRegion(_id, 'name', newName, prevName);
    };

    const handleCapitalEdit = (e) => {
        toggleCapitalEdit(false);
        const newCapital = e.target.value ? e.target.value : 'N/A';
        const prevCapital = capital;
        if (newCapital === prevCapital) return;
        props.editRegion(_id, 'capital', newCapital, prevCapital);
    };

    const handleLeaderEdit = (e) => {
        toggleLeaderEdit(false);
        const newLeader = e.target.value ? e.target.value : 'N/A';
        const prevLeader = leader;
        if (newLeader === prevLeader) return;
        props.editRegion(_id, 'leader', newLeader, prevLeader);
    };

    const handleFlagEdit = (e) => {
        toggleFlagEdit(false);
        const newFlag = e.target.value ? e.target.value : 'N/A';
        const prevFlag = flag;
        if (newFlag === prevFlag) return;
        props.editRegion(_id, 'flag', newFlag, prevFlag);
    };

    const handleDelete = (_id, region, index) => {
        props.setShowDeleteRegion(_id, region, index);
    }

    return (
        <WRow className='table-entry'>
            <WCol size="1">
                <WButton className="map-entry-buttons" onClick={() => {handleDelete(_id, region, props.index);}} wType="texted">
                    <i className="material-icons">close</i>
                </WButton>
            </WCol>
            <WCol onDoubleClick={() => {props.goToRegion(_id)}} size="2">
                {
                    editingName || name === ''
                        ? <input
                            className='table-input' onBlur={handleNameEdit}
                            autoFocus={true} defaultValue={name} type='text'
                            wType="outlined" barAnimation="solid" inputClass="table-input-class"
                        />
                        : <div className="table-text"
                            onClick={() => toggleNameEdit(!editingName)}
                        >{name}
                        </div>
                }
            </WCol>

            <WCol size="2">
                {
                    editingCapital ? <input
                        className='table-input' onBlur={handleCapitalEdit}
                        autoFocus={true} defaultValue={capital} type='text'
                        wType="outlined" barAnimation="solid" inputClass="table-input-class"
                    />
                        : <div className="table-text"
                            onClick={() => toggleCapitalEdit(!editingCapital)}
                        >{capital}
                        </div>
                }
            </WCol>

            <WCol size="2">
                {
                    editingLeader ? <input
                        className='table-input' onBlur={handleLeaderEdit}
                        autoFocus={true} defaultValue={leader} type='text'
                        wType="outlined" barAnimation="solid" inputClass="table-input-class"
                    />
                        : <div className="table-text"
                            onClick={() => toggleLeaderEdit(!editingLeader)}
                        >{leader}
                        </div>
                }
            </WCol>

            <WCol size="2">
                {
                    editingFlag ? <input
                        className='table-input' onBlur={handleFlagEdit}
                        autoFocus={true} defaultValue={flag} type='text'
                        wType="outlined" barAnimation="solid" inputClass="table-input-class"
                    />
                        : <div className="table-text"
                            onClick={() => toggleFlagEdit(!editingFlag)}
                        >{flag}
                        </div>
                }
            </WCol>
            <WCol size="3">
                {
                    <div className="table-text"
                        onClick={() => props.regionViewer(_id) }
                    >{landmarks && landmarks.length > 0 ? landmarks[0] : "No Landmarks"}
                    </div>
                }
            </WCol>
        </WRow>
    );
};

export default TableEntry;
