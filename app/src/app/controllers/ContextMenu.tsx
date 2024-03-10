import React, { useState } from "react"

export default function ContextMenu(props:{
    close(): void,
    x: number,
    y: number,
    options: {
        [name: string]: null | ((args?: any) => void)
    }
}){
   
    const [hover, setHover] = useState<string | null>(null);


    return(<>
        <div style={{
            position: 'fixed', 
            left: 0,
            top: 0,
            width: '99.99vw', 
            height: '99.99vh', 
            background: 'rgba(0,0,0,0)',
            zIndex: 99999,
            overflow: 'auto'
        }}
        onClick={props.close}
        >
            <div
                style={{
                    position: 'fixed',
                    zIndex: 999999,
                    overflowY: 'auto',
                    top: props.y || 1,
                    left: props.x || 1,
                    background:'rgba(0,0,0,0.9)', 
                    borderRadius: '9px', 
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: '1px solid rgba(84, 0, 92, 0.5)'
                }}
                onMouseLeave={props.close}
            >
                
                {Object.keys(props.options).map(k => <div key={k}
                    style={{
                        padding: '0 18px',
                        lineHeight: '36px',
                        fontSize: '14px',
                        color: 'white',
                        background: hover===k? 'rgb(61,130,125)':'transparent',// 'blue': 'transparent',  
                    }}
                    onMouseEnter={()=>setHover(k)}
                    onClick={(e) => {if(typeof props.options[k] === 'function') (props.options[k]||(()=>{}))(e)}}
                >
                    {k}
                </div>)}
            </div>
        </div>
    </>)
}