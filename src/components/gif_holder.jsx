import React, { useState, useRef, useEffect } from 'react';
import Loader from 'react-loader-spinner';
import { FaPause, FaPlay, FaLock } from 'react-icons/fa';
import SpeedSelector from './speed-selector';
import gsap from 'gsap';
import { Draggable } from "gsap/Draggable";

const GifHolder = (props) => {
    let [isLoading, setIsloading] = useState(false);
    let [loaded, setLoaded ] = useState(false);
    let [playing, setPlaying ] = useState(true);
    let [speed, setSpeed ] = useState(1);
    let [focused, setFocused ] = useState(false);

    const test = true;
    const loadOnStart = false;
    const showFileName = false;
    const ignoreBlocking = true;

    const gifComponent = useRef(null);
    const mask = useRef(null);    
    const player = useRef(null);

    useEffect(() => {
        if (gifComponent && gifComponent.current) {
            gifComponent.current.addEventListener('gif-loaded', loadHandler);
        }
    },[isLoading]);
    
    useEffect(() => {
        gsap.registerPlugin(Draggable);

        if (gifComponent && gifComponent.current) {
            gifComponent.current.addEventListener('onmouseleave', mouseleaveHandler);
            //gifComponent.current.addEventListener('wheel', wheelHandler);
        }
        if (mask && mask.current) {
            mask.current.addEventListener('wheel', mouseWheelHandler, {passive: false});
        }
        if (player && player.current) {
            player.current.addEventListener('wheel', mouseWheelHandler, {passive: false});
        }
        Draggable.create(gifComponent.current, {trigger: mask.current, zIndexBoost: false});
    },[loaded]);

    useEffect(() => {
        if (loadOnStart) {
            setIsloading(true);
        }
    }, [loadOnStart]);

    const mouseleaveHandler = (event) => {
        console.log('left');
    }

    const loadHandler = () => {
        if (isLoading) {
            setLoaded(true);
            setIsloading(false);
        }
    }

    const pause = () => {
        if (gifComponent.current) {
            gifComponent.current.pausePlaybackBound();
            setPlaying(false);
        }
    }
    const play = () => {
        if (gifComponent.current) {
            gifComponent.current.resumePlaybackBound();
            setPlaying(true);
        }
    }

    const clickHandler = () => {
        setFocused(true);
        if ((!props.isBlocked || ignoreBlocking) && !loaded) {
            setIsloading(true);
        }
    }

    const zoom = (direction) => {
        if (gifComponent.current) {
            gsap.to(gifComponent.current, {scale:`${direction}=0.5`});
        }
    }
    
    const mouseWheelHandler = (e) => {
        if (focused) {
            e.preventDefault();
            e.stopPropagation();
            
            if (e.deltaY < 0) {
                zoom('+');
            }
            else if (e.deltaY > 0) {
                zoom('-');
            }
        }
    }
    
    const mouseLeaveHandler = (e) => {
        setFocused(false);
    }

    const { url, width, height, isBlocked } = props;
    
    return (
        <div className={`gif ${focused ? 'focused' : ''}`} style={{width: width, height: height, position:'relative'}} onMouseLeave={mouseLeaveHandler}>
            
            {(isLoading || loaded) && 
                <gif-player 
                ref={gifComponent}
                style={{display: isLoading? 'none' : ''}} 
                src={test ? 'https://media.giphy.com/media/3o7TKuxpwWkbV0SSly/giphy.gif' : url} 
                speed={speed} 
                play
                repeat
                bounce
                />
            }
            <div ref={mask} className={`mask ${loaded || isLoading ? 'transparent' : ''}`} 
                onClick={clickHandler}
                onWheel={mouseWheelHandler}
            >
                    {isLoading || isBlocked ? '' : (showFileName ? props.name : '?')}
                    {isBlocked && <FaLock />}
            </div>
            {loaded && 
            <div ref={player} className={'playercontrols'} onWheel={mouseWheelHandler}>
                {playing && <FaPause onClick={pause} />}
                {!playing && <FaPlay onClick={play} />}
                <SpeedSelector onChange={value => setSpeed(value)} onIncrement={value => setSpeed(value)} onDecrement={value => setSpeed(value)} />
                
            </div>
            }
            <div className={'spinner'}>
                <Loader visible={isLoading} 
                    type="Puff"
                    color="#00BFFF"
                    height={height}
                    width={width}
                    timeout={0}>loading</Loader>
            </div>
        </div>
    )
}

export default GifHolder;