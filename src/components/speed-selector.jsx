import React, { useState, useEffect, useRef } from 'react';
import { FaAngleUp, FaAngleDown, FaCircleNotch } from 'react-icons/fa';
import { IconContext } from "react-icons";
import { Draggable } from 'gsap/Draggable';
import gsap from 'gsap';

const SpeedSelector = (props) => {
    
    let [ value, setValue ] = useState(1);
    const knob = useRef(null);

    
    useEffect(() => {
        gsap.registerPlugin(Draggable);

        if (knob.current) {
            Draggable.create(knob.current, {
                type:'rotation', 
                liveSnap: value => {
                    console.log(value);
                  if (value >= 0 && value < 18) {
                      setValue(1);
                      return value;
                  }
                  if (value <= -168) {
                      setValue(0.1);
                      return -168;
                  }
                  if (value < 0 && value >= -180) {
                      let snappedValue = Math.round(value / 18) * 18;
                      let invertedSnappedValue = 180 - Math.abs(snappedValue);
                      setValue((invertedSnappedValue / 18 * .1).toFixed(1));
                      return snappedValue;
                  }
                  if (value > 0 && value <= 360) {
                      let snappedValue = Math.round(value / 9) * 9;
                      setValue((snappedValue / 9 * .1).toFixed(1))
                      return snappedValue;
                  }
                  setValue(Math.round(value / 5) * 5)
                  return value;  
                }
            });
        }
    }, []);

    useEffect(() => {
        props.onChange(value);
    },[value])

    const increment = () => {
        setValue(value => {
            const newSpeed = (parseFloat(value) + 0.1).toFixed(1);
            return newSpeed === '1.0' ? '1' : newSpeed
        });
        props.onIncrement(value);

    }
    
    const decrement = () => {
        setValue(value => {
           let newSpeed = (parseFloat(value) - 0.1).toFixed(1);
           newSpeed = newSpeed <= 0 ? 0.1 : newSpeed;
           return newSpeed === '1.0' ? '1' : newSpeed;
        });
        props.onDecrement(value);
    }
    
    return (
     <div className={'speedselector'}>
         {value}
         <IconContext.Provider value={{ size: '3em' }}>
            <div ref={knob}>
                <FaCircleNotch />
            </div>
         </IconContext.Provider>
         
     </div>   
    )
}

export default SpeedSelector;