// import data from './sepData';
const env = (import.meta as ImportMeta & {env:any}).env;

const mode = env.VITE_MODE;
const origin = mode === 'dev'? env.VITE_DEV_ORIGIN : 
mode === 'prod'? env.VITE_ORIGIN : 
null


export const urls = {
    logout: () => `user/logout`,
    getUser: () => `user/check`,
    signin: () => `user/signin`,
    signup: () => `user/signup`,
    getContent: (query: any) => `content?${new URLSearchParams(Object.entries(query || {})).toString()}`,
    newPass: (query: any) => `user/pass?${new URLSearchParams(Object.entries(query || {})).toString()}`,
    updatePass: () => `user/pass`,
    instructions: () => `instructions`,
    userLogs: (query: any) => `logs?${new URLSearchParams(Object.entries(query || {})).toString()}`,
    paymentHistory: () => `payment/history`,
    paymentPrice: () => `payment/price`,
    paymentSystems: () => `payment/systems`,
    paymentCreateLink: (query: any) => `payment/transaction/create?${new URLSearchParams(Object.entries(query || {})).toString()}`,

}


/** 
 * herald - fetch owerwrite -
    The person who reports the news to the king is called the herald or herald of the royal court. 
    Heralds were a common practice in many historical monarchies to keep the king informed of events, news, and various messages. 
    They acted as a liaison between the ruler and the people, conveying decisions and orders from the king, 
    as well as passing reports and information to him.
*/
export const herald = async (url: string, options?: any) :Promise<Response>=> {
    if(mode === 'sep'){ // тут мог бы импортироваться Mirage.js а не это вот все, но он так же не поддерживает заголовки
        const method = options?.method?.toUpperCase() || 'GET'
        const [uri, query, body] = [...url.split('?'), options?.body ? JSON.parse(options.body) : null];
        // @ts-ignore
        const result = data[`[${method}]${uri}`]? await data[uri]({query, body}) : null;
        if(result) 
            if(result.body) return new Response(JSON.stringify(result.body), (({body, ...r})=> r)(result));
            else return new Response(result);
        return new Response('not found', {status: 404});
    }
    // console.log(`${origin}/${url}`, {credentials: 'include', ...options});
    return await fetch(`${origin}/${url}`, {credentials: 'include', ...options});
}


