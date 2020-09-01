import React, { useEffect, useRef } from 'react';
import GifHolder from './gif_holder.jsx';
import MuuriGrid from 'react-muuri';
import './MuuriGrid.scss'



const GifGroup = (props) => {
    const { files } = props;

    const gridRef = useRef();

    let grid = null;

    useEffect(() => {
        grid = new MuuriGrid({
            node: gridRef.current,
            defaultOptions: {
                dragEnabled: false, // See Muuri's documentation for other option overrides.
                layout: {
                    fillGaps: true,
                    horizontal: false,
                    alignRight: false,
                    alignBottom: false,
                    rounding: true
                }
            },
        });
    }, [files]);

    if (props.hidden) {
        return null;
    }
    if (!props.files) return null; 

    return (
        <div className={'muuri'} ref={gridRef} >
            {files.map(file => {
                const { width, height, url, name, blocked} = file;
                return (
                    <div className="item" key={name}>
                        <div className="item-content">
                            <GifHolder  
                                url={url} 
                                height={`${height}px`} 
                                width={`${width}px`} 
                                name={name}
                                isBlocked={blocked}
                            />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default GifGroup;