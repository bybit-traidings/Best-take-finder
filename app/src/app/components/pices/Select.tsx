import React, { useRef, useState } from "react";

export default function Select(props:{
    name?: string,
    value?: string,
    color?: string,
    background?: string,
    width?: string,
    fontSize?: number,
    onChange(e:  React.ChangeEvent<HTMLSelectElement> | {target:{name: string,value: string}}): void,
    options: { 
        [key: string]: any | null//value
    }[]
}){
    const [light, setLight] = useState(-1)
    const [open, setOpen] = useState(false)

    const clickHandler = () =>{
        setOpen(p=>!p);
        setLight(-2);
        setTimeout(()=>setLight(-1),200)
    }
    
    const show = ([props.name, ...props.options.map(o => Object.keys(o)[0])] as string[]).sort((a,b) => b.length-a.length)[0]

    return <div data-name='select' style={{ position: 'relative'}}>
        <div style={{
            fontSize: props.fontSize||'16px',
            padding: `0 ${(props.fontSize||0*1.2)||24}px`,
            lineHeight: (((props.fontSize||0)*2.2)||42)+'px',
            fontWeight: 600,
            ...(props.width?{width: props.width}:{}),
            color: 'rgba(0,0,0,0)'
        }}>
            <span style={(props.name)==show? {} : {fontSize: (props.fontSize||16)*0.85+'px'}}>
                {show}
            </span>
        </div>
        <div style={{
                borderRadius: '20px',
                fontSize: props.fontSize||'16px',
                background: props.background||'rgba(0,0,0,1)',
                color: props.color||'rgba(250, 250, 240, 0.76)',
                overflow: 'hidden',
                cursor: 'pointer',
                width: '100%',
                position: 'absolute',
                top: 0
            }}
            onClick={clickHandler}
           
        >
            <div 
                style={{
                    padding: `0 ${(props.fontSize||0*1.2)||24}px`,
                    lineHeight: (((props.fontSize||0)*2.2)||42)+'px',
                    fontWeight: 600,
                    background: `rgba(200,200,200,0.${light==0?1:light==-2?2:0})`,
                    textAlign: 'center'
                }}
                onMouseLeave={()=>setLight(-1)}
                onMouseEnter={()=>setLight(0)}
            >   
                {props.name||props.value}
            </div>
            {!open? '':
                props.options.map((o,i) => <div key={JSON.stringify(o)}
                    style={{
                        borderTop: '1px rgba(99,99,99,0.4) solid',
                        background: Object.values(o)[0]==props.value? 'rgb(53, 48, 133)':`rgba(200,200,200,0.${light==i+1?1:0})`,
                        fontSize: (props.fontSize||16)*0.87+'px',
                        padding: `0 ${((props.fontSize||0*1.2)||24)}px`,
                        cursor: 'pointer'
                    }}
                    onMouseLeave={()=>setLight(-1)}
                    onMouseEnter={()=>setLight(i+1)}
                    onClick={()=>props.onChange({target:{name: props.name+'',value: Object.values(o)[0]}})}
                >
                    {Object.keys(o)[0]}
                </div>)
            }
        </div>
    </div>
}