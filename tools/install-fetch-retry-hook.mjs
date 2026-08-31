import {createRetryingFetch} from './fetch-with-retry.mjs';

if(typeof globalThis.fetch==='function'&&!globalThis.__MH_FETCH_RETRY_INSTALLED){
  globalThis.fetch=createRetryingFetch(globalThis.fetch.bind(globalThis));
  globalThis.__MH_FETCH_RETRY_INSTALLED=true;
}
