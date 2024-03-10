import React, { useEffect, useState } from "react";
import useTo from "./hooks/useTo"
import { useLocation } from "react-router-dom";

//@ts-ignore
import walletIco from '../../assets/wallet.png'
//@ts-ignore
import settingsIco from '../../assets/setting.png'
//@ts-ignore
import newsIco from '../../assets/megaphone.png'
//@ts-ignore
import pluginIco from '../../assets/plug-in.png'
//@ts-ignore
import exitIco from '../../assets/exit.png'
import Pop from "./Pop";
import Deposit from "../components/pices/Deposit";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { logout } from "../../redux/slices/userSlice";
import PasswordReset from "../components/pices/PasswordReset";


export default function Bar({exeptions=[]}:{
    exeptions?: string[]
}){
    
    const location = useLocation();
    const dispath = useAppDispatch();
    const [show, setShow] = useState(false);


    useEffect(()=>{
        const s = !exeptions.reduce((acc,el)=> acc? acc: (location.pathname === el || location.pathname === el+'/'),false);
        if(s !== show) setShow(s);
    },[location.pathname]);

    
    const logoutHandler = () => {
        dispath(logout());
    }


    const urlIco = (url) => <div style={{height:'24px', width: '24px', background: `url(${url})`, backgroundSize: 'contain', filter: 'brightness(0) invert(1)'}}/>

    return show && <>
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '5rem',
            height: '100vh',
            background: '#1b1b1f',
            color: '#ffff'
        }}>
            <Item link="/" name="AI-M"></Item>
            <div style={{height: 'calc(100vh - 8rem)', display: 'flex', flexDirection: 'column', justifyContent:'center'}}>
                <Item link="/balance">{urlIco(walletIco)}</Item>
                <Item link="/news">{urlIco(newsIco)}</Item>
                <Item link="/settings">{urlIco(settingsIco)}</Item>
                <Item link="/plugin">{urlIco(pluginIco)}</Item>
            </div>
            <Item link="/" onClick={logoutHandler}>{urlIco(exitIco)}</Item>
        </div>
        <UserInfo />        
    </>
} 



function UserInfo(){
    const user = useAppSelector(s=>s.user)
    const to = useTo({lang: true});
    return<>
        <div data-name='userInfo'
            style={{
                position: 'fixed',
                top: '1rem',
                right: '2rem',
                background: '#1b1b1f',
                color: 'rgba(250,250,250,0.85)',
                border: '1px solid black',
                borderRadius: '1rem',
                fontSize: '0.75rem',
                lineHeight: '2rem',
                fontWeight: '500', 
                display: 'flex',
                paddingTop: '0.2rem'
        }}>
            <div style={{marginLeft: '1.4rem',cursor: 'pointer'}}
                onClick={()=>{to(null,{scene: 'passwordreset'})}}
            >
                {user.data?.email}
            </div>
            <div style={{border: '1px solid black', height: '2rem', margin: '0 0.7rem'}}/>
            <div><span>Balance: </span><span style={{color: 'white', fontSize: '14px'}}>{user.data?.balance?.toFixed(2)}</span><span> $</span></div>
            <div style={{
                    border: '1px solid rgba(84, 0, 92, 0.85)',
                    borderRadius: '100%', 
                    width: '2rem', 
                    height: '100%', 
                    margin: '-0.2rem 0 0 0.7rem', 
                    textAlign:'center',
                    cursor: 'pointer',
                    fontSize: '1.4rem',
                    fontWeight: 500,
                    color: 'rgba(250,250,250,0.8)'
                }}
                onClick={()=>to(null,{scene: 'deposit'})}
            >+</div>
        </div>

        <Pop scene="deposit" top='0' right='center785'><Deposit/></Pop>
        <Pop scene="passwordreset" top='0' right='center785'><PasswordReset/></Pop>
    </>
}



function Item({link, name, onClick, children}:{
    link: string, 
    name?: string, 
    onClick?(e: React.MouseEvent<any, MouseEvent>): void,
    children?: React.ReactNode
}){
    const to = useTo({})
    const [mouseOn, setMouseOn] = useState(false)
    const selected = window.location.pathname.includes(link) && link.length>1

    const clickHandler = (e) => {
        if(onClick) onClick(e);
        to(link)
    }

return  <div 
            style={{
                height: '4rem', 
                fontWeight: '600', 
                fontSize: '18px', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                background: selected? 'rgb(61,130,125)' :mouseOn? 'rgba(200,200,200,0.2)' : 'inherit',
                cursor: 'pointer'
            }}
            onClick={clickHandler}
            onMouseOver={()=>setMouseOn(true)}
            onMouseOut={()=>setMouseOn(false)}
        >
            <div>{children||name}</div>
        </div>
}