import React from "react";

export default function Loading(){

    return <div style={{
        background: 'rgba(0,0,0,0.5)',
        position: 'fixed',
        top: 0,
        right: 0,
        width: '100vw',
        height: '100vh',
    }}>
        {[2,1,1.5].map(s=><div style={{
            width: '100px',
            height: '100px',
            aspectRatio: 1,
            borderRadius: '50%',
            border: '9px solid #0000',
            borderRightColor: '#ffa50097',
            position: 'absolute',
            top: 'calc(50% - 100px)',
            left: 'calc(50% - 100px)',
            transform: 'translate(-50%, -50%)',
            animation: `rotation ${s}s linear infinite`,
        }} />)}
    </div>
}