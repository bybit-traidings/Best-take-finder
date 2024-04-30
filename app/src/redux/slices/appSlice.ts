import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { herald, urls } from '../urls';
import { addHint } from './hintsSlice';

const getChart = ({strategy, diaposone, history, risk, commission}:any, {dispatch, getState}) => { // notes = [...ids]
    try {
      risk = Number(risk);
      diaposone = Number(diaposone);
      commission = Number(commission)/100;
      const historyLength = history?.split('\n')?.length||0;
    
      let chart: any[];
      let sErrors: string[] = [];
      
      if(historyLength>1) {
        
        chart = history
        .split('\n')
        .map(l => l.split(',').length>1?l.split(','): l.split(';').length>1?l.split(';'): l.split('	'))
        .map(l => (([time,open,high,low,close,Buy,Sell])=>({time,open,high,low,close,Buy,Sell}))(l))
        .map((h,i,history) => !!+h.Buy||!!+h.Sell? [{type: !!+h.Buy? 'b':'s' ,...h}, ...(diaposone>0? history.slice(i+1,i+diaposone+1): history.slice(i+1,i+history.slice(i+1).findIndex(h=>(!!+h.Buy||!!+h.Sell))+1+1))]: null)
        .filter(h => !!h)
        .map((s,i,signals) =>  {
          const calc = (type,_in,out) => ((out/_in)-1)*(type === 'b'?1:-1)
          const delta = calc(s[0].type,s[0].close,s.slice(-1)[0].close);          
          const proc = calc(s[0].type,s[0].close,(s[0].type === 'b'?Math.max(...s.slice(1).map(it=>it.high),s[0].close):Math.min(...s.slice(1).map(it=>it.low),s[0].close)));
          const low = calc(s[0].type,s[0].close,(s[0].type === 'b'?Math.min(...s.slice(1).map(it=>it.low),s[0].close):Math.max(...s.slice(1).map(it=>it.high),s[0].close)));

          const signal = {
            type: s[0].type,
            price: {input: s[0].close, output: s.slice(-1)[0].close, high: Math.max(...s.slice(1).map(it=>it.high),s[0].close), low: Math.min(...s.slice(1).map(it=>it.low),s[0].close)},
            maxTake: calc(s[0].type,s[0].close,(s[0].type === 'b'?Math.max(...s.slice(1).map(it=>it.high),s[0].close):Math.min(...s.slice(1).map(it=>it.low),s[0].close))),
            index: i,
            signals: signals.map(s=>(
              {
                type: s[0].type,
                price: {input: s[0].close, output: s.slice(-1)[0].close, high: Math.max(...s.map(it=>it.high),s[0].close), low: Math.min(...s.map(it=>it.low),s[0].close)},
                maxTake: calc(s[0].type,s[0].close,(s[0].type === 'b'?Math.max(...s.slice(1).map(it=>it.high),s[0].close):Math.min(...s.slice(1).map(it=>it.low),s[0].close))),
                index: i,
                candles: s.map((c,i) => ({
                  price: {input: c.open, output: c.close, high: c.high, low: c.low},
                  index: i,
                })),
              }
            )),
            candles: s.map((c,i) => ({
              price: {input: c.open, output: c.close, high: c.high, low: c.low},
              index: i,
            })),
          }
    
          let take = 0;
          try {
            take = (strategy?.func? Function(...Object.keys(signal),strategy.func) : ((s)=>{}) )(...Object.values(signal));
          } catch (error) {
            if(!sErrors.includes(error.message)){
              sErrors.push(`${i}: ${error.message}`);
              dispatch(addHint(`${i}: ${error.message}`))
            }
          }
          
          return { 
            type: s[0].type,
            time: s[0].time,
            delta,
            proc,
            low,
            strategyTake: take==0?0:proc>take?take:delta
        }})
        .sort((a,b) => a.proc-b.proc)
        .map((s,i,signals)=> {
          let profit = s.proc*(signals.length-i) + signals.slice(0,i+1).reduce((a,it)=> a+it.delta,0) - signals.length*commission;     
          return { ...s,
            profit, 
            risk:  Math.sqrt(0.5/(signals.length-i)),//Math.pow((i / signals.length),3),
            res: profit * (((signals.length-i+(Math.pow(risk,3)-1))/(signals.length-i))),
        }});
    
    
        
      }else{
        const fartuna = (Math.random()-0.5)*0.5
        chart = new Array(340).fill('')
        .map((_,i)=> i < 18? { delta: (Math.random()-0.5+fartuna)*5.7, proc: (Math.random())*2.7 } :
                            { delta: (Math.random()-0.5+fartuna)*0.7, proc: (Math.random())*0.35 }
        )
        .sort(_ => 2*Math.random()-1)
        // 2022-12-03T04:30:00+03:00
        .map((s, i) => ({time: new Date(Date.now()-(60000 * 45 * i * 7)).toISOString(),...s}))
        .sort((a,b) => a.proc-b.proc)
        .map((s,i,signals)=> {
          const profit = s.proc*(signals.length-i) + signals.slice(0,i+1).reduce((a,it)=> a+it.delta,0)
          return{...s, 
            type: (5*Math.random()-(2+1*Math.ceil(i%2)))<0? 'b':'s',
            profit,
            risk:  Math.pow(0.5,signals.length-i),//Math.pow((i / signals.length),3),
            res: profit * (signals.length-(i/((1+risk)||0.01)))/(signals.length),
        }});
      }
      
      const favorite = [...chart].sort((a,b)=>b.res<a.res?-1:1)[0];
      const next = chart[chart.findIndex(c=> c.res == favorite.res)+1];
      const d = diaposone||(historyLength? '~'+Math.floor(historyLength/chart.length) : '~7')
    
      return {favorite, next, commission, chart, d };
    } catch (error) {
      dispatch(addHint({text: error.message, type: 'error'}))
    }
  }

// --- ACTIONS ---
export const getCharts = createAsyncThunk(
  'app/getCharts',
    async ({strategy, diaposone, histories, risk, commission}:any, {dispatch, getState}) => { // notes = [...ids]
        const charts = histories.map(h => getChart({strategy, diaposone, history: h, risk, commission}, {dispatch, getState}));
        
        return histories.length? charts : [getChart({strategy, diaposone, history: '', risk, commission}, {dispatch, getState})];
    }
  )


// --- SLICE ---


export interface appSliceI {
  charts: {favorite:any, next:any, commission: number, chart:any[], d: string}[],
} 

const initialState: appSliceI = {
  charts: []
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(getCharts.fulfilled, (state, action) => {
      if(action.payload?.length)
        state.charts = action.payload;
    })
  }
})

export const { } = appSlice.actions
export default appSlice