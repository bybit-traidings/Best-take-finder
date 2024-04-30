import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../../../redux/store";
import useTo from "../../controllers/hooks/useTo";
import Loading from "../pices/Loading";



export default function Reverser(){
    const dispatch = useAppDispatch();
    const to = useTo({});
    const [loading, setLoading] = useState(false);
    const [urls, setUrls] = useState<string[]>([]);
    const [names, setNames] = useState<string[]>([]);

    
    const loadFileHandler = async (event) => {
        const files = event.target.files;
        if(files.length>1) setLoading(true);
        let histories: string[] = await Promise.all<string>([...files].map(file=>new Promise((res)=>{
            const reader = new FileReader();
            reader.onload = (event) => res(event.target?.result as string);
            reader.readAsText(file);
        })));
        
        histories = histories.map(h  => h
            .split('\n')
            .map(l => l.split(',').length>1?l.split(','): l.split(';').length>1?l.split(';'): l.split('	'))
            .map(l => (([time,open,high,low,close,Buy,Sell])=>[time,open,high,low,close,Sell,Buy])(l))
            .map(l => l.join(';'))
            .join('\n'))

        const urls = histories.map((csvText, i) => URL.createObjectURL(new Blob([csvText], { type: 'text/csv' })));
        setUrls(urls);
        setNames([...files].map(f => f.name));
        setLoading(false);
    }
    
    
    return <>
        <div style={{
            margin: '50px auto',
            width: '50vw', 
            textAlign: 'center',
            color: 'rgb(227, 227, 227)',
        }}>
            <h1>Reverse signals</h1>
            <h5>Selct files to reverse signals</h5>
            <br/>
                <input type="file" id="csvFile" accept=".csv" multiple
                    style={{margin: '0.5rem auto', width: '155px'}} 
                    onChange={loadFileHandler}
                />
            <br /><br />
            {urls.map((url,i) => <div style={{fontSize: '1.4rem'}}>
                <a href={url} download={names[i]+'(R)'}>
                    {names[i]+'(R)'}
                </a> 
            </div>)}
        </div>
        {loading? <Loading /> : ''}
    </>
}

