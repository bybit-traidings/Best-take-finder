import React, { useEffect, useState } from "react";
import Button from "./Button";
import Input from "./Input";
import useTo from "../../controllers/hooks/useTo";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { dropLink, getLink } from "../../../redux/slices/paymentSlice";

export default function Deposit(){
    const to = useTo({});
    const dispatch = useAppDispatch();
    const payment = useAppSelector(s=>s.payment);
    const systems = payment.systems;
    const [form, setForm] = useState<{summ?: string}>({summ: ''});
    const [wasSend, setWasSend] = useState(false);
    const [hint, setHint] = useState('')


    useEffect(()=>{
        dispatch(dropLink());
    },[])
    useEffect(()=>{
        if(wasSend && payment.link) {
            const win = window.open()||{document};
            win.document.open();
            win.document.write(decodeURIComponent(payment.link.substring(29)));
        }
    })
    const sendHandler = (system) => {
        if(!form.summ) setHint('Please Enter amount, and choose pay-system!')
        else if(Number.isNaN(Number(form.summ))) setHint('Amount should be a number!')
        else if(system){
            dispatch(getLink({system, summ: Number(form.summ)}));
            setWasSend(true);
            setHint('One moment, you will redirect you to the bank page!')
        }
    }

    const inputChangeHandler = (e) => {
        setForm((p)=>({...p, summ: e.target.value}));
        setHint('');
        dispatch(dropLink())
        setWasSend(false);
    }

    return <>
        <div 
            style={{
                width: '780px',
                maxWidth: '100vw',
                minHeight: '520px',
                maxHeight: '100%',
                background: 'radial-gradient(circle, rgba(0,0,0,1) 0, rgba(0,0,0,0.8) 100%)',
                color: 'rgb(250,250,250)',
                padding: '52px 230px',
                position: 'relative',
                borderRadius: '0 0 1rem 1rem '
            }}
        >
            <div style={{minWidth: '290px'}}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <h1 style={{fontWeight: 600}}>
                        Deposit
                    </h1>
                </div>
                {/* <p style={{textAlign: 'center'}}> */}<p>
                    Enter the amount you want to deposit into your account.
                </p>
                <div style={{margin: '2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                    <Input placeholder='200$' style={{width: '100%'}} 
                        onChange={inputChangeHandler}
                        value={form.summ}
                    />
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'start', gap: '1rem'}}>
                    {systems.map((s,i)=><div key={i}><Button text={s} background='rgb(0, 0, 0)' fontSize={16} onClick={()=>sendHandler(s)} /></div>)}
                </div>
                <p style={{margin: '3rem 0 0 1rem', textAlign: 'center'}}>
                    {hint}   
                </p>
            </div>
        </div>
    </>
}