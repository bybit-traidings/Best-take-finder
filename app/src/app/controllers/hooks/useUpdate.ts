import { useState } from "react";





export default function useUpdate(){
    const [state, setState] = useState(0)
    
    const update = () => {
        setState(prev => Date.now());
    }
    
    return update

}   