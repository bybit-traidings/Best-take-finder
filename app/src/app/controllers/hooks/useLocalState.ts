import { useLayoutEffect, useState } from "react";


export default function useLocalState(key:string){
    const [s, setS] = useState({});
    
    useLayoutEffect(()=>{
        setS(JSON.parse(window.localStorage.getItem('localState') || '{}'));
    },[]);

    const set = (arg) => {
        setS(prev => ({...prev, [key]: arg}));
        window.localStorage.setItem('localState', JSON.stringify(s));
    } 
    
    return [s[key], (arg) => {
        if(typeof arg === 'function'){
            set(arg(s[key]));
        } else set(arg);
    }]

}   