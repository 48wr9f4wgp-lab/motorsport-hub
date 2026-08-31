const defaultSleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const transientCodes=new Set(['ECONNRESET','ETIMEDOUT','ECONNREFUSED','EAI_AGAIN','ENETUNREACH','EHOSTUNREACH','UND_ERR_CONNECT_TIMEOUT','UND_ERR_SOCKET']);

function errorCode(err){return String(err?.code||err?.cause?.code||'');}
function shouldRetryError(err){const code=errorCode(err);return transientCodes.has(code)||err instanceof TypeError;}
function retryAfterMs(response){const raw=response?.headers?.get?.('retry-after');if(!raw)return null;const seconds=Number(raw);if(Number.isFinite(seconds)&&seconds>=0)return seconds*1000;const at=Date.parse(raw);return Number.isFinite(at)?Math.max(0,at-Date.now()):null;}

export function createRetryingFetch(baseFetch,{maxAttempts=4,baseDelayMs=2500,maxDelayMs=30000,sleepFn=defaultSleep,randomFn=Math.random}={}){
  if(typeof baseFetch!=='function')throw new TypeError('baseFetch must be a function');
  return async function retryingFetch(url,options){
    let lastError=null;
    for(let attempt=1;attempt<=maxAttempts;attempt++){
      try{
        const response=await baseFetch(url,options);
        if(response?.ok)return response;
        const status=Number(response?.status)||0;
        if(status!==429&&status<500)return response;
        lastError=new Error(`HTTP_${status||'UNKNOWN'}`);
        if(attempt===maxAttempts)return response;
        const headerDelay=retryAfterMs(response);
        const exponential=Math.min(maxDelayMs,baseDelayMs*2**(attempt-1));
        const jitter=Math.floor(exponential*.2*Math.max(0,Math.min(1,Number(randomFn())||0)));
        await sleepFn(Math.min(maxDelayMs,headerDelay??(exponential+jitter)));
      }catch(err){
        lastError=err;
        if(!shouldRetryError(err)||attempt===maxAttempts)throw err;
        const exponential=Math.min(maxDelayMs,baseDelayMs*2**(attempt-1));
        const jitter=Math.floor(exponential*.2*Math.max(0,Math.min(1,Number(randomFn())||0)));
        await sleepFn(Math.min(maxDelayMs,exponential+jitter));
      }
    }
    throw lastError||new Error('fetch retry exhausted');
  };
}
