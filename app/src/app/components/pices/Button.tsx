import React, { useState } from "react";

export default function Button(props:{
    text: string,
    color?: string,
    background?: string,
    width?: string,
    fontSize?: number,
    onClick(e:  React.MouseEvent<any, MouseEvent>): void 
}){
    const [light, setLight] = useState(0)

    return<>
        <div data-name='button'
            style={{
                borderRadius: '20px',
                fontSize: props.fontSize||'16px',
                background: props.background||'rgba(0,0,0,1)',
                color: props.color||'rgba(250, 250, 240, 0.76)',
                overflow: 'hidden',
                cursor: 'pointer',
                ...(props.width?{width: props.width}:{})
            }}
            onClick={props.onClick}
        >
            <div 
                style={{
                    padding: `0 ${(props.fontSize||0*1.2)||24}px`,
                    lineHeight: (((props.fontSize||0)*2.2)||42)+'px',
                    fontWeight: 600,
                    background: `rgba(200,200,200,0.${light})`,
                    textAlign: 'center'
                }}
                onMouseLeave={()=>setLight(0)}
                onMouseEnter={()=>setLight(1)}
                onClick={()=>{
                    setLight(2);
                    setTimeout(()=>setLight(0),200)
                }}
            >
                {props.text}
            </div>
        </div>
    </>
}