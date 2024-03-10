import React from "react"


export default function Chart(props:{
    data: {colls: string[], values: number[], key: string},
    onSelect?(i: number): void,
    styles?: React.CSSProperties
}){
    const getMax = (arr:number[]) => arr.reduce((a,e)=> a>e? a : e,-Infinity);

    const style = {
        width: '740px',
        margin: '0 auto',
        color: 'white',
        ...(props.styles||{})
    }
    return <>
        <div style={style}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', margin: '1rem 0'}}>
                {props.data.values.map((value, i)=><div key={i}>
                    <button 
                        type="button" 
                        className="btn btn-secondary" 
                        data-bs-toggle="tooltip" 
                        data-bs-placement="top" 
                        title={`${props.data.colls[i]}: ${value} ${props.data.key}`}
                        style={{
                            width: '2rem', 
                            height: (270/getMax(props.data.values))*value||0+'px', 
                            borderRadius: '0.27rem',
                            background: 'linear-gradient(0deg, rgba(61, 130, 125,0.6) 0%, rgba(61, 130, 125,0.85) 100%)', 
                    }}
                    onClick={()=>{if(props?.onSelect) props.onSelect(i)}}
                    ></button>
                    <div style={{color: 'white', fontSize: '11px', lineHeight: '32px', textAlign: 'center'}}>
                        {props.data.colls[i].slice(0,3)}
                    </div>
                </div>)}
            </div>
        </div>
    </>
}