import React, { useEffect, useState } from "react";
import Pop from "../../controllers/Pop";
import Confirm from "../../controllers/Confirm";
import Button from "../pices/Button";
import useTo from "../../controllers/hooks/useTo";
// @ts-ignore
// import backgroundImage from '../../../assets/6.jpg';
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import Input from "../pices/Input";
import Textarea from "../pices/Textarea";
import { getChart } from "../../../redux/slices/appSlice";
import { removeAllHints } from "../../../redux/slices/hintsSlice";




const lBarHeight = 80;

export default function IndexPage(){
    const dispatch = useAppDispatch();
    const {chart} = useAppSelector(s=>s.app)
    const to = useTo({});
    const [form, setForm] = useState({diaposone: '1', risk: 0.5, history: '', strategy: {name: 'Default'}, commission: '0.0'});
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
        let {diaposone, history} = form;
        if(h) history = h;
        diaposone = (diaposone+'')?.includes('~')? '0': diaposone;
        dispatch(getChart({...form, diaposone, history}));
        setMonth(-1);
    }

    useEffect(()=>{
        goHandler()
    },[form.strategy]);

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
            const transform = (({time, type, delta, proc, strategyTake})=>({
                time: time.replaceAll('T',' ').replaceAll('-','.').split(':').slice(0,2).join(':'),
                type: type=='b'? 'Buy':'Sell',
                priceMovement: (100*delta*(type=='b'?1:-1)),
                realTake: form.strategy.name!='Default'? 100*strategyTake -(strategyTake>0? chart.commission*100: 0) :
                                                         100*(proc>choose[0]?.proc? choose[0]?.proc : delta)-(chart.commission*100),
                maxTake: (100*proc)
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
                    padding: '1rem 2rem',
                    overflowY: 'auto'
                }}
            >  
                <h3>diaposone</h3>
                <p>
                    За сколько свечей сделка должна быть закрыта.   <br /> 
                    *Если 0 - динамическое закрытие следующим сигналом.
                </p>
                <Input 
                    name='diaposone' 
                    style={{margin: '0.27rem 0 1rem 0', width: '297px'}} 
                    placeholder="diaposone" 
                    value={form.diaposone+''}
                    onChange={formChangeHandler}
                />
                <h3>risk</h3>
                <p style={{fontSize: '1rem', color: 'white'}}>
                    {`${form.risk} > ${
                        form.risk<-0.5 ? 'очень бережливо':
                        form.risk<0.1? 'бережливо':
                        form.risk<0.6? 'умеренный риск':'рисково'
                    }` }
                </p>
                <input type="range" min="-1" max="1" step="0.1" name="risk" id="risk" 
                    style={{
                        margin: '0.27rem 0 1rem 0', 
                        width: '297px',
                        accentColor: 'rgb(170,170,170)',
                    }} 
                    value={''+form.risk}
                    onChange={formChangeHandler}
                />
                <h3>history</h3>
                <p>
                    Загрузить историю в виде Exel таблици, например с Trading-Wiue
                    <br/>
                    <input type="file" id="csvFile" accept=".csv" style={{marginTop: '1rem'}} 
                        onChange={loadFileHandler}
                    />
                </p>
                <Textarea rows={2} 
                    style={{margin: '0.27rem 0 1rem 0', width: '297px', maxHeight: '100px', display: 'none'}} 
                    placeholder="history" 
                    value={form.history}
                    onChange={formChangeHandler}
                />
                <h3>strategy</h3>
                <p>
                    Динамический подбор тейка для каждого сигнала по формуле.   
                    *Default - без формулы. <br />
                </p>
                <input type="button" value={form.strategy.name} style={{minWidth: '90px', marginBottom: '1.7rem'}} 
                    onClick={()=>to(null, {scene: "strategy"})}
                />
                <Pop scene="strategy" top='0' right='370px' locked><ChooseStrategy onChange={formChangeHandler} /></Pop>
                <h3>commission</h3>
                <p>
                    Процент от суммы входа в сделку (от 0% до 100%).
                </p>
                <Input 
                    name='commission' 
                    style={{margin: '0.27rem 0 1rem 0', width: '297px'}} 
                    placeholder="commission" 
                    value={form.commission}
                    onChange={formChangeHandler}
                />

                <div style={{
                    position: 'fixed',
                    bottom: '30px',
                    right: '30px'
                }}>
                    <Button width='306px' text='Go' onClick={()=>goHandler()}/>
                </div>
                <div style={{height: '120px'}} />
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
                {form.strategy.name=='Default'? <div style={{
                            position: 'sticky',
                            top: '-260px',
                        }}>
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
                                        background: chart.favorite?.res == c?.res? 'rgba(196, 121, 255, 0.97)' : 'rgba(60, 250, 200,0.75)',//'rgba(0, 197, 125, 0.97)',
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
                    <div  data-name='proc'>
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
                </div>
                :
                <div style={{height: '220px', display: 'flex',  justifyContent: 'center', alignItems: 'center', padding: '2rem',  background: 'rgb(24,24,27)',}}>
                    <h3>Results for {form.strategy.name} strategy</h3>
                </div>
                }
                <div data-name='results'
                    style={{
                        fontSize: '1rem',
                        height: 'calc(100vh - 260px)',
                        margin: '2rem'
                    }}
                >
                    <div style={{display: 'flex', justifyContent: 'center', margin: '1rem auto', fontWeight: 800}}>
                        {form.strategy.name!='Default'?
                        <h5>
                            strategy: {form.strategy.name} 
                            <span style={{margin: '0 1rem'}}></span>
                            profit: {(tableChart.reduce((a,cc) => [...a,...cc],[]).reduce((a,c)=>a+c.realTake,0)).toFixed(2)}%
                            <span style={{margin: '0 1rem'}}></span>
                            success: {tableChart.reduce((a,cc) => [...a,...cc],[]).filter(c=>c.realTake>chart.commission*100).length}
                            <span style={{margin: '0 1rem'}}></span>
                            loose: {tableChart.reduce((a,cc) => [...a,...cc],[]).length-tableChart.reduce((a,cc) => [...a,...cc],[]).filter(c=>c.realTake>chart.commission*100).length}
                        </h5>
                        :
                        <h5>
                            take: {(choose[0]?.proc*100).toFixed(2)}% {'<>'} {((choose[1]||choose[0])?.proc*100).toFixed(2)}%
                            <span style={{margin: '0 1rem'}}></span>
                            profit: {(choose[0]?.profit*100).toFixed(2)}%
                            <span style={{margin: '0 1rem'}}></span>
                            nForecast: {(choose[0]?.profit*100*(1-choose[0]?.risk)).toFixed(2)}%
                            <span style={{margin: '0 1rem'}}></span>
                            success: {chart.chart.filter(c=>(c.proc>choose[0]?.proc? choose[0]?.proc : c.delta)>chart.commission).length}
                            <span style={{margin: '0 1rem'}}></span>
                            loose: {chart.chart.length-chart.chart.filter(c=>(c.proc>choose[0]?.proc? choose[0]?.proc : c.delta)>chart.commission).length}
                        </h5>
                        }
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
                                        <th>{chart.filter(c=>c.realTake>0).length}</th>
                                        <th>{chart.length-chart.filter(c=>c.realTake>0).length}</th>
                                        <th>{(chart.reduce((a,c)=> c.realTake+a,0)).toFixed(2)}%</th>
                                        <th>{(chart.reduce((a,c)=> c.maxTake+a,0)).toFixed(2)}%</th>
                                        
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
                                                ['priceMovement','realTake'].includes(key)? c[key]>0? 'green' : 'red' :
                                                'rgb(227,227,227)'
                                            }}
                                        >
                                            {['priceMovement', 'realTake', 'maxTake'].includes(key)? c[key].toFixed(2)+'%' :c[key]}
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
        <Pop scene="strategyAbout" top='0' right='370px'><StrategyAbout /></Pop>

    </>
}


function ChooseStrategy({onChange=(e)=>{}}){
    const dispatch = useAppDispatch();
    const to = useTo({});
    const oldS = [{
        name: 'Default',
        func: '// Не является стратегией!'
    },...JSON.parse(window.localStorage.getItem('strategies')||`[{"name":"previosBest","func":"return signals[index-1].maxTake"},{"name":"onlyBuy","func":"return type=='b'? 1: 0"},{"name":"Middle","func":"return signals.slice(0,index).reduce((a,s)=> a+s.maxTake,0)/index"}]`)];
    const [strategies, setStrategies] = useState(oldS);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const deleteHandler = () => {
        setStrategies(p => p.filter(s=> s.name!==deleteConfirm))
    }

    const addHandler = () => {
        setStrategies(p=>[...p,{name: 'New', fun: ''}])
    }

    const closeHandler = () => {
        window.localStorage.setItem('strategies', JSON.stringify(strategies.filter(s=>s.name !== 'New' && s.name !== 'Default')));
        to(null,{})
    }

    const changeHandler = (e,s) => {
        setStrategies(p=>p.map(os=> os.name!==s.name? os: {...os, [e.target.name]: e.target.value}))
    }

    const ChooseStrategy = (i) => {
        onChange({target: {name: 'strategy', value: strategies[i]}});
        setTimeout(()=>dispatch(removeAllHints()),7000);
        closeHandler();
    }

    return <>
        <Confirm 
            text='Delete?' 
            subtext='This action cannot be undone in the future.' 
            open={!!deleteConfirm} 
            close={()=>setDeleteConfirm(null)} action={deleteHandler}
        />
        <div style={{position: 'fixed', top:0, left: 0, width: '100vw', height: '100vh'}} onClick={closeHandler} />
        <div 
            style={{
                width: '780px',
                maxWidth: '100vw',
                minHeight: '100vh',
                background: 'radial-gradient(circle, rgba(0,0,0,1) 0, rgba(0,0,0,0.8) 100%)',
                color: 'rgb(250,250,250)',
                padding: '50px',
                position: 'relative',
                borderRadius: '0 0 1rem 1rem '
            }}
            onClick={(e)=>e.stopPropagation()}
        >   
             <div>
                {strategies.map((s,i)=><div key={i} style={{marginBottom: '4rem'}}>
                    <Textarea 
                        rows={1}
                        placeholder='name' 
                        style={{maxHeight: '3rem', resize: 'block', fontSize: '2rem', fontWeight: 700, width: '50%'}} 
                        value={s.name}
                        name='name'
                        onChange={(e)=>{if(s.name!='Default')changeHandler(e,s)}}
                    />
                    <Textarea 
                        rows={s?.func? s.func.split('\n').length+(s.name!='Default'):4}
                        placeholder='function' 
                        style={{width: '100%', fontSize: '1rem'}} 
                        value={s.func}
                        name='func'
                        onChange={(e)=>{if(s.name!='Default')changeHandler(e,s)}}
                    />
                    <div style={{display:'flex', justifyContent:'start', alignItems: 'center', gap:'1rem', margin: '0.7rem'}}>
                        <Button text='Choose' background='rgb(3, 29 ,75 )' onClick={()=>ChooseStrategy(i)} />
                        <Button text='Delete' onClick={()=>{setDeleteConfirm(s.name)}} />
                    </div>
                </div>)}
            </div>
                
            <div style={{
                position: 'fixed',
                bottom: '30px',
                right: '397px'
            }}>
                <Button text='+' background='rgb(3, 29 ,75 )' onClick={addHandler} />
            </div>
            <div style={{
                position: 'fixed',
                top: '30px',
                right: '397px'
            }}>
                <p
                    style={{
                        width: '1.2rem',
                        height: '1.2rem',
                        padding: '0 0.4rem',
                        fontWeight: 900,
                        borderRadius: '1rem',
                        border: '1px white solid',
                        cursor: 'pointer'
                    }}
                    onClick={()=>to(null,{scene: 'strategyAbout'})}
                >
                    ?
                </p>
            </div>
        </div>
    </>
}






function StrategyAbout(){
    const to = useTo({});

    return <div 
        style={{
            width: '780px',
            maxWidth: '100vw',
            minHeight: '100vh',
            background: 'radial-gradient(circle, rgba(0,0,0,1) 0, rgba(0,0,0,0.8) 100%)',
            color: 'rgb(250,250,250)',
            padding: '50px',
            position: 'relative',
            borderRadius: '0 0 1rem 1rem ',
        }}
    >   
        <p style={{fontSize: '1.4rem'}}>
            Тело стратегии является телом функции для расчета take для каждого сигнала: <br />
            <span style={{whiteSpace: 'pre-wrap', fontSize: '1rem', color: 'wheat'}}>
{`
getProfit(...signal){
    let take = signals[index-1].maxTake
    return take
}
`}
            </span>
            <br />
            обьект сигнала: <br />
            <span style={{whiteSpace: 'pre-wrap', fontSize: '1rem', color: 'wheat'}}>

signal = {'{'}
<br />{'    '}type: <span style={{color: 'rgb(199,199,197'}}>тип сигнала "b" или "s" - buy или sell соответственно,</span>
<br />{'    '}price: {'{'}
<br />{'        '}input: <span style={{color: 'rgb(199,199,197'}}>число, цена открытия свечи в которой пришел сигнал, </span>
<br />{'        '}output: <span style={{color: 'rgb(199,199,197'}}>число, цена закрытия свечи последней в диапозоне (diaposone) сигнала,</span> 
<br />{'        '}high: <span style={{color: 'rgb(199,199,197'}}>число, максимальная цена за все время, </span>
<br />{'        '}low: <span style={{color: 'rgb(199,199,197'}}>число, минимальная цена за все время,</span>
<br />{'    '}{'},'}
<br />{'    '}maxTake: <span style={{color: 'rgb(199,199,197'}}>число от 0 до 1, самый лучший процент который можно было бы получить в идиальных условиях,</span>
<br />{'    '}signals: <span style={{color: 'rgb(199,199,197'}}>массив всех сигналов (сортирован в хронологическом порядке),</span>
<br />{'    '}index: <span style={{color: 'rgb(199,199,197'}}>число, индекс сигнала в массиве (signals),</span>
<br />{'    '}candles: <span style={{color: 'rgb(199,199,197'}}>массив свечей от свечи с сигналом до конца диапосона, где свеча - {'{'}</span>
<br />{'        '}price: {'{'}
<br />{'            '}input: <span style={{color: 'rgb(199,199,197'}}>число, цена открытия свечи, </span>
<br />{'            '}output: <span style={{color: 'rgb(199,199,197'}}>число, цена закрытия свечи, </span>
<br />{'            '}high: <span style={{color: 'rgb(199,199,197'}}>число, максимальная цена за все время, </span>
<br />{'            '}low: <span style={{color: 'rgb(199,199,197'}}>число, минимальная цена за все время,</span>
<br />{'        '}{'},'}
<br />{'        '}index: <span style={{color: 'rgb(199,199,197'}}>число, индекс в массиве свечей (candles),</span>
<br />{'    '}{'},'}
{'}'}
            </span>

        </p>
        <div style={{
            position: 'fixed',
            top: '30px',
            right: '397px'
        }}>
            <p
                style={{
                    width: '1.2rem',
                    height: '1.2rem',
                    padding: '0 0.4rem',
                    fontWeight: 900,
                    borderRadius: '1rem',
                    // border: '1px white solid',
                    cursor: 'pointer'
                }}
                onClick={()=>to(null,{scene: 'strategy'})}
            >
                ❮
            </p>
        </div>
    </div>
}

