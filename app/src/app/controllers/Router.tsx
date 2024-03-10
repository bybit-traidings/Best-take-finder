import React, { useEffect } from "react";
import { Routes, Route, useParams } from "react-router-dom";
import { useNavigate } from "react-router";

interface propsI {
    roots: {[root: string]: React.JSX.Element},
    index: string, 
    authRoots?: {[root: string]: React.JSX.Element},
    toSign?: string,
    auth?: boolean,
    langs?:string[],
    defaultLang?: string
}

export default function Router({roots, index, authRoots, auth, toSign, langs, defaultLang='en'}:propsI) {
    const props = {roots, index, authRoots, auth, toSign, langs, defaultLang};


    return (
    <>
        <Routes>
            <Route path="/" element={<PageRenderer {...props} />}/>
            <Route path={`${langs?.length?'/:lang':''}`} element={<PageRenderer {...props} />}/>
            <Route path={`${langs?.length?'/:lang':''}/:p1`} element={<PageRenderer {...props} />}/>
            <Route path={`${langs?.length?'/:lang':''}/:p1/:p2`} element={<PageRenderer {...props} />}/>
            <Route path={`${langs?.length?'/:lang':''}/:p1/:p2/:p3`} element={<PageRenderer {...props} />}/>
            <Route path={`${langs?.length?'/:lang':''}/:p1/:p2/:p3/:p4`} element={<PageRenderer {...props} />}/>
            <Route path={`${langs?.length?'/:lang':''}/:p1/:p2/:p3/:p4/:p5`} element={<PageRenderer {...props} />}/>
            <Route path={`${langs?.length?'/:lang':''}/:p1/:p2/:p3/:p4/:p5/:p6`} element={<PageRenderer {...props} />}/>
            <Route path={`${langs?.length?'/:lang':''}/:p1/:p2/:p3/:p4/:p5/:p6/:p7`} element={<PageRenderer {...props} />}/>
        </Routes>
    </>
    )
}

function PageRenderer(props:propsI){
    const navigate = useNavigate();
    let {lang, ...ps} = useParams();
    const path = `/${Object.values(ps).map(p => p || '').join('/').split('?')[0]}`;
    
    const roots = {...props.roots, ...props.authRoots};

    useEffect(()=>{
        if(props.langs?.length && (!lang || !props.langs?.includes(lang)))  
            navigate({pathname: `/${props.defaultLang}${window.location.pathname}`});
        else if (!roots[path]) 
            navigate({pathname: `${lang? '/'+lang:''}${props.index}`})
        else if(props.authRoots?.[path] && !props.auth) 
            navigate({pathname: `${lang? '/'+lang:''}${props.toSign}`});
    });



    return <>
        {!roots[path]? '' : React.cloneElement(roots[path])}
    </>
}