import React            from 'react';
import TableHeader      from './TableHeader';
import TableContents    from './TableContents';

const MainContents = (props) => {
    return (
        <div className='table ' >
            <TableHeader
                disabled={!props.activeMap._id} addItem={props.addItem}
                setShowDelete={props.setShowDelete} setActiveMap={props.setActiveMap}
                tpsReset={props.tpsReset} undo={props.undo} redo={props.redo}
                canUndo={props.canUndo} canRedo={props.canRedo}
                sortItemsByDesc={props.sortItemsByDesc} descAsc={props.descAsc} toggleDescAsc={props.toggleDescAsc}
                sortItemsByDate={props.sortItemsByDate} dateAsc={props.dateAsc} toggleDateAsc={props.toggleDateAsc}
                sortItemsByStatus={props.sortItemsByStatus} statusAsc={props.statusAsc} toggleStatusAsc={props.toggleStatusAsc}
                sortItemsByAssignedTo={props.sortItemsByAssignedTo} assignedToAsc={props.assignedToAsc} toggleAssignedToAsc={props.toggleAssignedToAsc}
                toggleMapSelected={props.toggleMapSelected}
            />
            <TableContents
                key={props.activeMap.id} activeMap={props.activeMap}
                deleteItem={props.deleteItem} reorderItem={props.reorderItem}
                editItem={props.editItem}
            />
        </div>
    );
};

export default MainContents;