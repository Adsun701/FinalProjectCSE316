import React, { useState } from 'react';
import { WButton, WRow, WCol } from 'wt-frontend';

const TableEntry = (props) => {
    const region = props.region;
    const _id = region ? region._id : '';
    const name = region ? region.name : '';
    const capital = region ? region.capital : '';
    const leader = region ? region.leader : '';
    const flag = region ? region.flag : '';
    const landmarks = region ? region.landmarks : [];
    const [editingName, toggleNameEdit] = useState(false);
    const [editingCapital, toggleCapitalEdit] = useState(false);
    const [editingLeader, toggleLeaderEdit] = useState(false);
    const [editingFlag, toggleFlagEdit] = useState(false);

    const handleNameEdit = (e) => {
        toggleNameEdit(false);
        const newName = e.target.value ? e.target.value : 'N/A';
        const prevName = name;
        props.editRegion(_id, 'name', newName, prevName);
    };

    const handleCapitalEdit = (e) => {
        toggleCapitalEdit(false);
        const newCapital = e.target.value ? e.target.value : 'N/A';
        const prevCapital = capital;
        props.editRegion(_id, 'capital', newCapital, prevCapital);
    };

    const handleLeaderEdit = (e) => {
        toggleLeaderEdit(false);
        const newLeader = e.target.value ? e.target.value : 'N/A';
        const prevLeader = leader;
        props.editRegion(_id, 'leader', newLeader, prevLeader);
    };

    const handleFlagEdit = (e) => {
        toggleFlagEdit(false);
        const newFlag = e.target.value ? e.target.value : 'N/A';
        const prevFlag = flag;
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
            <WCol size="2">
                {
                    editingName || name === ''
                        ? <input
                            className='table-input' onBlur={handleNameEdit}
                            autoFocus={true} defaultValue={name} type='text'
                            wType="outlined" barAnimation="solid" inputClass="table-input-class"
                        />
                        : <div className="table-text"
                            //onClick={() => toggleNameEdit(!editingName)}
                            onDoubleClick={() => {props.goToRegion(_id)}}
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
