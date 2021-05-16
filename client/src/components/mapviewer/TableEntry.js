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
    const landmarks = region && region.landmarks ? region.landmarks : [];
    const [editingName, toggleNameEdit] = useState(false);
    const [editingCapital, toggleCapitalEdit] = useState(false);
    const [editingLeader, toggleLeaderEdit] = useState(false);
    const [editingFlag, toggleFlagEdit] = useState(false);

    const handleNameEdit = (e) => {
        props.setEditIndex(-1);
        props.setEditField('');
        toggleNameEdit(false);
        const newName = e.target.value ? e.target.value : 'N/A';
        const prevName = name;
        if (newName === prevName) return;
        props.editRegion(_id, 'name', newName, prevName);
    };

    const handleCapitalEdit = (e) => {
        props.setEditIndex(-1);
        props.setEditField('');
        toggleCapitalEdit(false);
        const newCapital = e.target.value ? e.target.value : 'N/A';
        const prevCapital = capital;
        if (newCapital === prevCapital) return;
        props.editRegion(_id, 'capital', newCapital, prevCapital);
    };

    const handleLeaderEdit = (e) => {
        props.setEditIndex(-1);
        props.setEditField('');
        toggleLeaderEdit(false);
        const newLeader = e.target.value ? e.target.value : 'N/A';
        const prevLeader = leader;
        if (newLeader === prevLeader) return;
        props.editRegion(_id, 'leader', newLeader, prevLeader);
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
                    (props.editing && props.editField === 'name') || editingName || name === ''
                        ? <input
                            className='table-input' onBlur={handleNameEdit}
                            autoFocus={true} defaultValue={name} type='text'
                            wType="outlined" barAnimation="solid" inputClass="table-input-class"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleNameEdit(e);
                                else if (e.key === 'Escape') {
                                    e.target.value = name;
                                    toggleNameEdit(false);
                                }
                                else if (e.key === 'ArrowRight') {
                                    handleNameEdit(e);
                                    toggleCapitalEdit(!editingCapital);
                                }
                                else if (e.key === 'ArrowUp' && props.index > 0) {
                                    handleNameEdit(e);
                                    props.setEditIndex(props.index - 1);
                                    props.setEditField('name');
                                }
                                else if (e.key === 'ArrowDown' && props.index < props.len - 1) {
                                    handleNameEdit(e);
                                    props.setEditIndex(props.index + 1);
                                    props.setEditField('name');
                                }
                            }}
                        />
                        : <div className="table-text"
                            onClick={() => toggleNameEdit(!editingName)}
                        >{name}
                        </div>
                }
            </WCol>

            <WCol size="2">
                {
                    (props.editing && props.editField === 'capital') || editingCapital ? <input
                        className='table-input' onBlur={handleCapitalEdit}
                        autoFocus={true} defaultValue={capital} type='text'
                        wType="outlined" barAnimation="solid" inputClass="table-input-class"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCapitalEdit(e);
                            else if (e.key === 'Escape') {
                                e.target.value = name;
                                toggleCapitalEdit(false);
                            }
                            else if (e.key === 'ArrowLeft') {
                                handleCapitalEdit(e);
                                toggleNameEdit(!editingName);
                            }
                            else if (e.key === 'ArrowRight') {
                                handleCapitalEdit(e);
                                toggleLeaderEdit(!editingLeader);
                            }
                            else if (e.key === 'ArrowUp' && props.index > 0) {
                                handleCapitalEdit(e);
                                props.setEditIndex(props.index - 1);
                                props.setEditField('capital');
                            }
                            else if (e.key === 'ArrowDown' && props.index < props.len - 1) {
                                handleCapitalEdit(e);
                                props.setEditIndex(props.index + 1);
                                props.setEditField('capital');
                            }
                        }}
                    />
                        : <div className="table-text"
                            onClick={() => toggleCapitalEdit(!editingCapital)}
                        >{capital}
                        </div>
                }
            </WCol>

            <WCol size="2">
                {
                    (props.editing && props.editField === 'leader') || editingLeader ? <input
                        className='table-input' onBlur={handleLeaderEdit}
                        autoFocus={true} defaultValue={leader} type='text'
                        wType="outlined" barAnimation="solid" inputClass="table-input-class"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleLeaderEdit(e);
                            else if (e.key === 'Escape') {
                                e.target.value = name;
                                toggleLeaderEdit(false);
                            }
                            else if (e.key === 'ArrowLeft') {
                                handleLeaderEdit(e);
                                toggleCapitalEdit(!editingCapital);
                            }
                            else if (e.key === 'ArrowUp' && props.index > 0) {
                                handleLeaderEdit(e);
                                props.setEditIndex(props.index - 1);
                                props.setEditField('leader');
                            }
                            else if (e.key === 'ArrowDown' && props.index < props.len - 1) {
                                handleLeaderEdit(e);
                                props.setEditIndex(props.index + 1);
                                props.setEditField('leader');
                            }
                        }}
                    />
                        : <div className="table-text"
                            onClick={() => toggleLeaderEdit(!editingLeader)}
                        >{leader}
                        </div>
                }
            </WCol>

            <WCol size="2">
                {
                    <div className="table-text"
                        >{<img className="flag" src={props.flagPath} alt={name}></img>}
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
