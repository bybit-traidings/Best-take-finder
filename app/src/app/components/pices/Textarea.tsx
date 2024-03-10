import React, { useRef } from "react";


export default function Input(props: {
    placeholder: string,
    onChange(e: React.ChangeEvent<HTMLTextAreaElement>): void, 
    rows?: number,
    value?: string,
    style?: React.CSSProperties,
    name?: string,
    ref?: React.MutableRefObject<any>
}){

    return <>
        <div data-name='input'>
        <textarea
            ref={props.ref}
            rows={props.rows||4}
            name={props.name}
            style={{
                width: '200px',
                lineHeight: '20px',
                background: '#1b1b1f',
                border: 'none',
                borderRadius: '4px',
                padding: '10px',
                color: '#c5c7c7',
                ...(props.style||{})
            }}
            placeholder={props.placeholder}
            onChange={props.onChange}
            value={props.value}
        />
        </div>
     </>
}