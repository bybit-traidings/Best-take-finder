import React, { useEffect, useState } from "react"
import Button from "../components/pices/Button"

export default function Confirm(props:{
    open: boolean,
    close(): void,
    text?: string,
    subtext?: string,
    action(...args): void
}){

    const yesHandler = () => {
        props.action();
        props.close();
    }

    return<>
        <div style={{
            position: 'fixed', 
            top:0, 
            left: 0, 
            width: '100vw', 
            height: '100vh',
            background: 'rgba(0,0,0,0.9)',
            display: props.open? 'flex': 'none',
            zIndex: 99999999,
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <div style={{maxWidth: '30%', color: 'rgba(250,250,250,0.85)'}}>
                <h1>{props.text||'Are you shure?'}</h1>
                <h5>{props.subtext||''}</h5>
                <div style={{marginTop: '2rem', display: 'flex', justifyContent: 'space-around', alignItems: 'start'}}>
                    <Button text='Yes' width='5rem' onClick={yesHandler} />
                    <Button text='No' width='5rem' background='rgb(84, 0, 92)' onClick={()=>{props.close();}} />
                </div>
            </div>
        </div>
    </>
}