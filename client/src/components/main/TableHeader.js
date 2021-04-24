import React from 'react';

import { WButton, WRow, WCol } from 'wt-frontend';

const TableHeader = (props) => {

    const buttonStyle = props.disabled ? ' table-header-button-disabled ' : 'table-header-button ';
    const undoStyle = props.canUndo ? ' undo-redo table-header-button ' : 'undo-redo table-header-button-disabled disabled';
    const redoStyle = props.canRedo ? ' undo-redo table-header-button ' : 'undo-redo table-header-button-disabled disabled';
    const clickDisabled = () => { };

    return (
        <WRow className="table-header">
            <WCol size="3">
                <WButton onClick={() => {
                    props.sortItemsByDesc(props.descAsc ? 1 : -1);
                    props.toggleDescAsc(!props.descAsc);
                }
                } className='table-header-section' wType="texted" >Task</WButton>
            </WCol>

            <WCol size="2">
                <WButton onClick={() => {
                    props.sortItemsByDate(props.dateAsc ? 1 : -1);
                    props.toggleDateAsc(!props.dateAsc);
                }
                } className='table-header-section' wType="texted">Due Date</WButton>
            </WCol>

            <WCol size="2">
                <WButton onClick={() => {
                    props.sortItemsByStatus(props.statusAsc ? 1 : -1);
                    props.toggleStatusAsc(!props.statusAsc);
                }
                } className='table-header-section' wType="texted" >Status</WButton>
            </WCol>
            <WCol size="2">
                <WButton onClick={() => {
                    props.sortItemsByAssignedTo(props.assignedToAsc ? 1 : -1);
                    props.toggleAssignedToAsc(!props.assignedToAsc);
                }
                } className='table-header-section' wType="texted" >Assigned To</WButton>
            </WCol>
            <WCol size="2">
                <div className="table-header-buttons">
                    <WButton onClick={props.canUndo ? props.undo : clickDisabled} wType="texted" className={`${undoStyle}`} clickAnimation="ripple-light" shape="rounded">
                        <i className="material-icons">undo</i>
                    </WButton>
                    <WButton onClick={props.canRedo ? props.redo : clickDisabled} wType="texted" className={`${redoStyle}`} clickAnimation="ripple-light" shape="rounded">
                        <i className="material-icons">redo</i>
                    </WButton>
                    <WButton onClick={props.disabled ? clickDisabled : props.addItem} wType="texted" className={`${buttonStyle}`}>
                        <i className="material-icons">add_box</i>
                    </WButton>
                    <WButton onClick={props.disabled ? clickDisabled : props.setShowDelete} wType="texted" className={`${buttonStyle}`}>
                        <i className="material-icons">delete_outline</i>
                    </WButton>
                    <WButton onClick={props.disabled ? clickDisabled : () => {props.setActiveList({}); props.tpsReset(); props.toggleListSelected(false);}} wType="texted" className={`${buttonStyle}`}>
                        <i className="material-icons">close</i>
                    </WButton>
                </div>
            </WCol>
        </WRow>
    );
};

export default TableHeader;