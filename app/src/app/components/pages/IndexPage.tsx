import React, { useEffect, useState } from "react";
import Pop from "../../controllers/Pop";
import Button from "../pices/Button";
import useTo from "../../controllers/hooks/useTo";
// @ts-ignore
// import backgroundImage from '../../../assets/6.jpg';
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import Input from "../pices/Input";
import Textarea from "../pices/Textarea";
import { getChart } from "../../../redux/slices/appSlice";


const lBarHeight = 80;

export default function IndexPage(){
    const dispatch = useAppDispatch();
    const {chart, strategies} = useAppSelector(s=>s.app)
    const to = useTo({});
    const [form, setForm] = useState({diaposone: '1', risk: 0.5, history: ''});
    const [choose, setChoose] = useState<any[]>([]);
    const [month, setMonth] = useState(-1);
    const [hoverSm, setHoverSm] = useState(-1);
    const [hoverBig, setHoverBig] = useState(-1);

    
    useEffect(function(){
        dispatch(getChart(form));
    },[]);
    
    useEffect(()=>{
        if(form.diaposone!==chart.d)setForm(p=>({...p, diaposone: chart.d}));
        if(choose!==chart.favorite) setChoose([chart.favorite, chart.next]);
    },[chart]);

    const goHandler = function(h?: string | any) {
        let {diaposone, risk, history} = form;
        if(h) history = h;
        diaposone = (diaposone+'')?.includes('~')? '0': diaposone;
        dispatch(getChart({diaposone, risk, history}));
        setMonth(-1);
    }

    const formChangeHandler = (e) => {
        setForm(p=>({...p, [e.target.name]: e.target.value}));
    }

    const loadFileHandler = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function(event) {
            const contents = event.target?.result;
            goHandler(contents);
            setForm(p=>({...p, history: (contents as string)}));
        };
        reader.readAsText(file);
    }
   
    // console.log(chart.chart.map(c=>c.type));

    const tableChart = chart.chart?.length? [...chart.chart].sort((a,b)=>(new Date(b.time)).getTime()-(new Date(a.time)).getTime())
        .reduce((a,c,i)=>{
            const transform = (({time, type, delta, proc})=>({
                time: time.replaceAll('T',' ').replaceAll('-','.').split(':').slice(0,2).join(':'),
                type: type=='b'? 'Buy':'Sell',
                priceMovement: (delta*(type='b'?1:-1)).toFixed(4)+'%',
                realTake: (proc>choose[0]?.proc? choose[0]?.proc : delta).toFixed(4)+'%',
                maxTake: proc.toFixed(2)+'%'
            }))(c);
            
            return a[a.length-1]?.[0]?.time.split('.')[1] === transform.time.split('.')[1]? [...a.slice(0,a.length-1),[...a[a.length-1],transform] ] : [...a,[transform]]
        },[]) : []
    // console.log(tableChart);
    
   
    return <>
        <div style={{
                display: 'flex',
                flexDirection: 'row-reverse',
                color: 'rgb(227, 227, 227)',
                fontSize: '0.75rem'
            }} 
            onKeyDown={(e)=>{if(e.key === 'Enter') goHandler()}}
        >   <div data-name='right'
                style={{
                    width: '370px',
                    height: '100vh',
                    background: 'rgb(24,24,27,1)',
                    borderLeft: '2px rgba(200,200,200, 0.25) solid',
                    padding: '1rem 2rem'
                }}
            >  
                <h3>diaposone</h3>
                <Input 
                    name='diaposone' 
                    style={{margin: '0.27rem 0 1rem 0', width: '297px'}} 
                    placeholder="diaposone" 
                    value={form.diaposone+''}
                    onChange={formChangeHandler}
                />
                <p>
                    За сколько свечей сделка должна быть закрыта.   <br /> 
                    *Если 0 - динамическое закрытие следующим сигналом.
                </p>
                <h3>risk</h3>
                <input type="range" min="-1" max="1" step="0.1" name="risk" id="risk" 
                    style={{
                        margin: '0.27rem 0 1rem 0', 
                        width: '297px',
                        accentColor: 'rgb(170,170,170)',
                    }} 
                    value={''+form.risk}
                    onChange={formChangeHandler}
                />
                <p style={{fontSize: '1rem', color: 'white'}}>
                    {`${form.risk} > ${
                        form.risk<-0.5 ? 'очень бережливо':
                        form.risk<0.1? 'бережливо':
                        form.risk<0.6? 'умеренный риск':'рисково'
                    }` }
                </p>
                <h3>history</h3>
                <p>
                    Загрузите сюда историю в виде строки 
                    (Её можно получить скопировав данные из Exel таблици, предварительно скачав на Trading-Wiue)
                    <br/>
                    <input type="file" id="csvFile" accept=".csv" style={{marginTop: '1rem'}} 
                        onChange={loadFileHandler}
                    />
                </p>
                <Textarea rows={2} 
                    style={{margin: '0.27rem 0 1rem 0', width: '297px'}} 
                    placeholder="history" 
                    value={form.history}
                    onChange={formChangeHandler}
                />
                

                <div style={{
                    position: 'fixed',
                    bottom: '30px',
                    right: '130px'
                }}>
                    <Button text='Go' onClick={()=>goHandler()}/>
                </div>
            </div>
            <div data-name='left'
                style={{
                    width: `calc(100vw - 370px - ${lBarHeight}px)`,
                    height: '100vh',
                    marginLeft: `${lBarHeight}px`,
                    overflow: 'hidden',
                    overflowY: 'auto',
                }}
            >
                <div data-name='chart'>
                    <div data-name='profit'style={{
                        height: '260px',
                        background: 'rgb(24,24,27)',
                        borderBottom: '5px rgb(0,0,0) solid',
                    }}>
                        <div data-name='profit'style={{
                            height: '210px',
                            display: 'flex',
                            alignItems: 'end',
                            justifyContent: 'space-evenly',
                        }}>
                            {chart.chart.map(c => <div key={JSON.stringify(c)}
                                style={{
                                    width: `${((window.innerWidth-367-lBarHeight)/chart.chart.length)}px`,
                                    height: c.profit<0?0:`${c.profit*(190/Math.max(...chart.chart.map(c => c.profit)))}px`,
                                    background: chart.favorite?.res == c?.res? 'rgba(196, 121, 255, 0.97)' : 'rgba(0, 197, 125, 0.97)',
                                    borderRight: '1px black solid'
                                }}
                            >
                                <div style={{
                                    width: `${((window.innerWidth-367-lBarHeight)/chart.chart.length)}px`,
                                    height: c.profit<0?0:`${c.risk*100}%`,
                                    background: 'rgba(197, 7, 9, 0.57)',
                                    borderRight: '1px black solid'
                                }}/>
                            </div>)}
                        </div>
                        <div data-name='loose-profit'style={{
                            height: '50px',
                            display: 'flex',
                            alignItems: 'start',
                            justifyContent: 'space-evenly',
                            background: 'black'
                        }}>
                            {chart.chart.map(c => <div key={JSON.stringify(c)}
                                style={{
                                    width: `${((window.innerWidth-367-lBarHeight)/chart.chart.length)}px`,
                                    height: c.profit>0?0:`${(-c.profit)*(50/Math.max(...chart.chart.map(c => Math.abs(c.profit))))}px`,
                                    background: chart.favorite?.res == c?.res? 'rgba(196, 121, 255, 0.97)' : 'rgba(197, 7, 9, 0.97)',
                                    borderRight: '1px black solid'
                                }}
                            >
                            </div>)}
                        </div>
                    </div>

                </div>
                <div  data-name='proc' style={{
                    position: 'sticky',
                    top: '0',
                }}>
                    <div data-name='proc-color' style={{
                        height: '75px',
                        background: 'rgb(0,0,0)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                    }}>
                        {chart.chart.map(c => <div key={JSON.stringify(c)}
                            style={{
                                width: `${((window.innerWidth-367-lBarHeight)/chart.chart.length)}px`,
                                height: `${c?.res<0?4:c?.res*(52/Math.max(...chart.chart.map(c => c?.res),0.0001))}px`,
                                background: c?.res !== choose[0]?.res? 'rgba(0, 97, 97, 0.7)' : 'rgba(196, 121, 255, 0.97)',
                            }}
                        >
                        </div>)}
                    </div>

                    <div data-name='proc-nums' style={{
                        height: '0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                        position: 'relative',
                        bottom: '37px',
                        color: 'white',
                        fontWeight: 600
                    }}>
                        {chart.chart.map((c,i) => <div key={JSON.stringify(c)}
                            style={{width: `${((window.innerWidth-367-lBarHeight)/chart.chart.length)}px`}}
                        >
                            {
                                (i&&i%Math.ceil(chart.chart.length/24)!==0) ? ''
                                :`${(c.proc*100).toFixed(2)}%`
                            }
                        </div>)}
                    </div>

                    <div data-name='proc-pickers' style={{
                        height: '0',
                        display: 'flex',
                        alignItems: 'start',
                        justifyContent: 'space-evenly',
                        position: 'relative',
                        bottom: '75px',
                    }}>
                        {chart.chart.map((c,i,chart) => <div key={JSON.stringify(c)}
                            style={{
                                width: `${((window.innerWidth-367-lBarHeight)/chart.length)}px`,
                                height: '75px',
                                cursor: 'pointer', //196, 121, 255
                            }}
                            onClick={()=>setChoose([c, chart[i+1]])}
                        >
                        </div>)}
                    </div>
                </div>
                <div data-name='results'
                    style={{
                        fontSize: '1rem',
                        height: 'calc(100vh - 260px)',
                        margin: '2rem'
                    }}
                >
                    <div style={{display: 'flex', justifyContent: 'center', margin: '1rem auto', fontWeight: 800}}>
                        <h5>
                            take: {(choose[0]?.proc*100).toFixed(2)}% {'<>'} {((choose[1]||choose[0])?.proc*100).toFixed(2)}%
                            <span style={{margin: '0 1rem'}}></span>
                            profit: {(choose[0]?.profit*100).toFixed(2)}%
                            <span style={{margin: '0 1rem'}}></span>
                            nForecast: {(choose[0]?.profit*100*(1-choose[0]?.risk)).toFixed(2)}%
                            <span style={{margin: '0 1rem'}}></span>
                            success: {chart.chart.filter(c=>(c.proc>choose[0]?.proc? choose[0]?.proc : c.delta)>0).length}
                            <span style={{margin: '0 1rem'}}></span>
                            loose: {chart.chart.length-chart.chart.filter(c=>(c.proc>choose[0]?.proc? choose[0]?.proc : c.delta)>0).length}
                        </h5>
                    </div>


                    
                    <table style={{textAlign: 'center', margin: '1rem auto', width: '60rem'}}>
                        <thead style={{
                                color: 'white', fontWeight: 600, 
                                fontSize: '1rem', 
                                lineHeight: '2.5rem',
                                borderBottom: '1px rgb(72,72,72) solid',
                                background: '',
                            }}
                        >
                            <tr>
                                <th style={{width: '257px'}}>Date</th>
                                <th style={{width: '257px'}}>success</th>
                                <th style={{width: '257px'}}>loose</th>
                                <th style={{width: '257px'}}>realTake</th>
                                <th style={{width: '257px'}}>maxTake</th>
                            </tr>
                        </thead>
                        <tbody style={{fontWeight: 200, fontSize: '1rem', lineHeight: '1.4rem'}}>
                            {(tableChart||[]).map((chart,i)=> <>
                                <tr key={i} 
                                    style={{
                                        borderBottom: '1px rgb(72,72,72) solid',
                                        cursor: 'pointer',
                                        background: month==i?'rgb(24,24,27,1)': hoverBig==i? 'rgba(9,9,9,0.42)': '',
                                        lineHeight: '3.4rem',
                                        fontSize: '1rem'
                                    }}
                                    onClick={()=>{setMonth(p=>p==i?-1:i)}}
                                    onMouseEnter={()=>setHoverBig(i)}
                                    onMouseLeave={()=>setHoverBig(-1)}
                                > 
                                    
                                        <th>{(new Date(chart[0].time)).toString().split(' ')[1]+' '+chart[0].time.split('.')[0]}</th>
                                        <th>{chart.filter(c=>+c.realTake.split('%')[0]>0).length}</th>
                                        <th>{chart.length-chart.filter(c=>+c.realTake.split('%')[0]>0).length}</th>
                                        <th>{(chart.reduce((a,c)=> +c.realTake.split('%')[0]+a,0)*100).toFixed(2)}%</th>
                                        <th>{(chart.reduce((a,c)=> +c.maxTake.split('%')[0]+a,0)*100).toFixed(2)}%</th>
                                        
                                </tr>
                                {month!==i? '' : <>
                                    <tr style={{background: 'rgb(24,24,27,1)', lineHeight: '2rem'}}>
                                        {Object.keys(tableChart?.[0]?.[0]||{}).map(key=><th key={key}>{key}</th>)}
                                    </tr>
                                    {(chart||[]).map((c,j)=><tr key={JSON.stringify(c)+j} 
                                        style={{ background: j===hoverSm? 'black':'rgb(24,24,27,1)' }}
                                        onMouseEnter={()=>setHoverSm(j)}
                                        onMouseLeave={()=>setHoverSm(-1)}
                                    >   
                                        {Object.keys(c||{}).map(key=><th key={key} 
                                            style={{
                                                color: key=='type'? c[key]== 'Buy'? 'teal' : 'yellow' :
                                                key=='priceMovement'||key=='realTake'? +c[key].split('%')[0]>0? 'green' : 'red' :
                                                'rgb(227,227,227)'
                                            }}
                                        >
                                            {c[key]}
                                        </th>)}
                                    </tr>)}
                                </>}
                            </>
                            )}
                        </tbody>    
                    </table>
                </div>
                <div style={{height: '6rem'}}></div>
            </div>
            
        </div>
        {/* <Pop scene="login" top='0' right='center750'><Login/></Pop> */}
        
    </>
}