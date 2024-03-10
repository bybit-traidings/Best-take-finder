import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { getContent, langs } from "../../../redux/slices/appSlice";



export default function useContent(){
    const dispatch = useAppDispatch();
    const appS = useAppSelector(state => state.app);

    useEffect(()=>{
        const rLang = window.location.pathname.split('/')[1];        
        if(langs.includes(rLang) && (rLang !== appS?.lang)) dispatch(getContent(rLang));
        
    })
    
    return (sentence: string, spare?: string) => {
        if(!appS.lang || !appS.content) return spare ?? sentence;
        const translate = appS.content?.[sentence]; 
        return translate || (spare ?? sentence)
    }
}