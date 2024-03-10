import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { herald, urls } from '../urls';
import { addHint } from './hintsSlice';


// --- SLICE ---


export interface appSliceI {
  chart: {strategy?:string,favorite:any, next:any, chart:any[], d: string},
  strategies: {name:string, rule:string}[],
} 

const initialState: appSliceI = {
  chart: {
    strategy: undefined,
    favorite: undefined, 
    next: undefined, 
    chart:[],
    d: '1',
  },
  strategies: [],
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    init: (state, action) => {
      
    },
    addRule: (state, action) => {

    },
    
    getChart: (state, action) => {
      let {strategy, diaposone, history, risk} = action.payload;
      risk = Number(risk);
      diaposone = Number(diaposone);
      const historyLength = history?.split('\n')?.length||0;

      let chart;
      
      if(historyLength>1) {
        
        chart = 
        history
        .split('\n')
        .map(l => l.split(',').length>1?l.split(','): l.split(';').length>1?l.split(';'): l.split('	'))
        .map(l => (([time,open,high,low,close,Buy,Sell])=>({time,open,high,low,close,Buy,Sell}))(l))
        .map((h,i,history) => !!+h.Buy||!!+h.Sell? [{type: !!+h.Buy? 'b':'s' ,...h}, ...(diaposone>0? history.slice(i+1,i+diaposone): history.slice(i+1,i+history.slice(i+1).findIndex(h=>(!!+h.Buy||!!+h.Sell))+1))]: null)
        .filter(h => !!h)
        .map(s =>  {
          const calc = (type,_in,out) => ((out/_in)-1)*(type === 'b'?1:-1)
          return { 
            type: s[0].type,
            time: s[0].time,
            delta: calc(s[0].type,s[0].open,s.slice(-1)[0].close),
            proc: calc(s[0].type,s[0].open,(s[0].type === 'b'?Math.max(...s.map(it=>it.high)):Math.min(...s.map(it=>it.low)))),
        }})
        .sort((a,b) => a.proc-b.proc)
        .map((s,i,signals)=> {
          const profit = s.proc*(signals.length-i) + signals.slice(0,i+1).reduce((a,it)=> a+it.delta,0)
          return{...s, profit,
            risk:  Math.sqrt(0.5/(signals.length-i)),//Math.pow((i / signals.length),3),
            res: profit * (((signals.length-i+(Math.pow(risk,3)-1))/(signals.length-i))),
            res3: profit * (signals.length-(i/((risk+1)||0.01)))/(signals.length),
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
            res: profit * (signals.length-(i/((risk+1)||0.01)))/(signals.length),
        }});
      }
      
      const favorite = [...chart].sort((a,b)=>b.res-a.res)[0];
      const next = chart[chart.findIndex(c=> c.res == favorite.res)+1];
      const d = diaposone||(historyLength? '~'+Math.floor(historyLength/chart.length) : '~7')

      state.chart = {strategy, favorite, next, chart, d };
    }
  },
  extraReducers: (builder) => {
    builder
    // .addCase(getContent.fulfilled, (state, action) => {})
  }
})

export const { init, addRule, getChart } = appSlice.actions
export default appSlice