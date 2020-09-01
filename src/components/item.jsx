import React from 'react';


const Item = (props) => {
    return (
        <div className={'item'}>
            <div className={'item-content'}>
                <div style={{width: `${props.width}px`, height: `${props.height}px`, backgroundColor: 'red'}}></div>
            </div>
        </div>
    );
}

export default Item;