import React from "react";


export default function Input(props: {
    name: string,
    placeholder?: string,
    onChange(e: React.ChangeEvent<HTMLInputElement>): void, 
    value?: string,
    type?: string,
    style?: React.CSSProperties,
}){

    return <>
        <div data-name='input'>
        <input
            name={props.name}
            type={props.type||"text"}
            style={{
                width: '200px',
                height: '40px',
                background: '#1b1b1f',
                border: '1px solid #393b3b',
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