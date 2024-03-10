const history = require('./history')


/**
 * 
 * @param {number} diaposone -  это время жизни сделки в колличестве свечей
 * @param {string} historyTXT - история свечей
 
 */

function getProfit(diaposone, historyTXT, risk){
    let history = historyTXT.split('\n')
    history= history.map(l => l.split(','))
    history = history.map(l => (([time,open,high,low,close,Buy,Sell])=>({time,open,high,low,close,Buy,Sell}))(l))

    const signals = history
        .map((h,i) => !!+h.Buy||!!+h.Sell? [{type: !!+h.Buy? 'b':'s' ,...h}, ...(diaposone>0? hh.slice(i+1,i+diaposone): hh.slice(i+1,hh.findIndex((h, j)=> i<j&&(!!+h.Buy||!!+h.Sell))+1))]:'')
        .filter(h => !!h)
        .map(s =>  ({
            close: +s[0].close,
            proc:(Math.max(...s.map(it=>s[0].type === 'b'? it.high : -it.low))/s[0].close)+(s[0].type === 'b'?-1:1)
        }))
    // const signals = new Array(40).fill('')
    //     .map(_=>({ close: 34+(10*Math.random()-5), proc: (Math.random()/2) }))
    //     .concat(new Array(4).fill('')
    //     .map(_=>({ close: 34+(10*Math.random()-5), proc: (Math.random()*2) })))

    signals.sort((a,b) => a.proc-b.proc);

    let chart = signals
            .map((s,i)=> ({...s, profit: s.proc*(signals.length-i)}))
            .map((s,i)=> ({...s, 
                risk:  Math.sqrt(1/(signals.length-i)),
                res: s.profit * (signals.length-(i/((risk+1)||0.01)))/(signals.length)
            }));

    
    
    const favorite = [...chart].sort((a,b)=>b.res-a.res)[0];
    const next = chart[chart.findIndex(c=> c.res == favorite.res)+1];

    return [favorite, next, chart]
}

console.log(GetProfit(3,history, 1));

