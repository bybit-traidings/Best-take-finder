import { useEffect, useState } from "react";




/**
 * 
 * @returns [window.innerWidth, window.innerHeight]
 */
export default function useWidth(){
    const [_, setState] = useState(0)

    useEffect(() => {    
        const handleResize = () => {
            setState(Date.now());
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize',handleResize)
      },[])
    
    return [window.innerWidth, window.innerHeight]

}   