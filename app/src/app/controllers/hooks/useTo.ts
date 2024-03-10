import { useNavigate } from "react-router";

// export default function useTo({lang=true}:{lang?:boolean}){

export default function useTo({lang}:{lang?:boolean}){
    const navigate = useNavigate();
    
    return (path: string | null, query?: object, addQuery?: object) => {   
        const pathname = !path?
            window.location.pathname
            : 
            `${lang? '/'+window.location.pathname.split('/')[1]:''}${path[0]=='/'? path: '/'+path}`

        
        navigate({
            pathname,
            search:  `?${new URLSearchParams(query as Record<string, string>).toString()}` ||
                     `?${new URLSearchParams({...Object.fromEntries(new URLSearchParams(window.location.search)),...addQuery} as Record<string, string>).toString()}`
        });
    }
    

}   