import { useEffect, useRef } from "react";
import { useAppSelector } from "../../redux/store";
import { useDispatch } from "react-redux";
import { removeLastHint } from "../../redux/slices/hintsSlice";
import React from "react";


// interface hint{
//     text: string,
//     type: 'error' | 'warning' | 'info' | 'success' 
// }
// const hintss :Array<hint> = [
//     {type:'error' , text: 'This is an error alert — check it out!'},
//     {type:'warning' , text: 'This is a warning alert — check it out'},
//     {type:'info' , text: 'This is an info alert — check it out!'},
//     {type:'success' , text: 'This is a success alert — check it out!'},
//     //{type:'casper' , text: 'This is a casper alert — check it out!'},
// ]

export default function Hints({top, right, left, bottom, xCenter, yCenter}:{top?: string, right?: string, left?: string, bottom?: string, xCenter?: boolean, yCenter?: boolean}){
    const dispatch = useDispatch();
    const ref = useRef<HTMLDivElement>();
    const hints = useAppSelector(state => state.hints.hints);

    const position: any = {};
    if(right && !xCenter) position.right = right;
    if(left  && !xCenter) position.left = left;
    if(top  && !yCenter) position.top = top;
    if(bottom  && !yCenter) position.bottom = bottom;
    if(xCenter) position.left = `calc(50vw - ${ref.current && ref.current.offsetWidth/2}px)`
    if(yCenter) position.top = `calc(50vh - ${ref.current && ref.current.offsetHeight/2}px)`

    useEffect(()=>{
        const timeout = setTimeout(()=>{
            if(hints.length) dispatch(removeLastHint())
        }, 4000);
        return () => clearTimeout(timeout);
    })

    return (<>
    {/* @ts-ignore */}
        <div ref={ref}
            style={{
                position: 'fixed',
                // padding: '1em',
                overflowY: 'auto',
                ...position
            }}
        >
            
            {hints.map(hint => <div key={hint.text}
                style={{
                    margin: '0.5em 0',
                }}
            >
                <Alert type={hint.type}>{hint.text}</Alert>
            </div>)}
        </div>
    </>)
}

function Alert({type, children}){
    const bgc = {
        "success" : "rgba(137, 252, 48, 0.8)",
        "warning" : "rgba(252, 232, 48, 0.8)",
        "error" :  "rgba(252, 123, 48, 0.8)",
        "info" : "rgba(235, 48, 252, 0.8)" 
    }[type]

    return<div style={{
        maxWidth: '600px',
        margin: '0.5rem',
        padding: '0.5rem 1rem',
        border: '1px solid black',
        borderRadius: '0.8rem',
        background: bgc || 'rgba(0,0,0,0.9)',
        color: 'rgba(50,50,50,0.8)',
        fontWeight: '600'
    }}>
       {children}
    </div>
}