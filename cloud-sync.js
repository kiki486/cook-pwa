(function(){
  const config=window.COOK_SUPABASE;
  const sessionKey='cook:supabase-session';
  let session=readSession(),saveTimer,pollTimer,lastUpdated='';

  function readSession(){try{return JSON.parse(localStorage.getItem(sessionKey))}catch{return null}}
  function storeSession(value){session=value;if(value)localStorage.setItem(sessionKey,JSON.stringify(value));else localStorage.removeItem(sessionKey)}
  async function parseResponse(response){const text=await response.text();let data=null;try{data=text?JSON.parse(text):null}catch{data=text}if(!response.ok)throw new Error(data?.msg||data?.message||data?.error_description||`请求失败 (${response.status})`);return data}
  async function refresh(){if(!session?.refresh_token)return null;const response=await fetch(`${config.url}/auth/v1/token?grant_type=refresh_token`,{method:'POST',headers:{apikey:config.publishableKey,'Content-Type':'application/json'},body:JSON.stringify({refresh_token:session.refresh_token})});const data=await parseResponse(response);storeSession(data);return data}
  async function token(){if(!session)return null;if(session.expires_at&&session.expires_at*1000-Date.now()<60000)await refresh();return session.access_token}
  async function rest(path,options={}){const access=await token();if(!access)throw new Error('请先登录');const response=await fetch(`${config.url}/rest/v1/${path}`,{...options,headers:{apikey:config.publishableKey,Authorization:`Bearer ${access}`,'Content-Type':'application/json',...(options.headers||{})}});return parseResponse(response)}
  async function login(email,password){const response=await fetch(`${config.url}/auth/v1/token?grant_type=password`,{method:'POST',headers:{apikey:config.publishableKey,'Content-Type':'application/json'},body:JSON.stringify({email,password})});const data=await parseResponse(response);storeSession(data);return data}
  function logout(){clearInterval(pollTimer);storeSession(null)}
  async function load(){const rows=await rest('cook_state?id=eq.shared&select=payload,updated_at');const row=rows?.[0];if(row)lastUpdated=row.updated_at||'';return row}
  async function save(payload){const rows=await rest('cook_state?id=eq.shared',{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify({payload,updated_at:new Date().toISOString()})});if(rows?.[0])lastUpdated=rows[0].updated_at||lastUpdated;return rows?.[0]}
  function scheduleSave(getPayload,onError){clearTimeout(saveTimer);saveTimer=setTimeout(()=>save(getPayload()).catch(onError),650)}
  function startPolling(onRemote,onError){clearInterval(pollTimer);pollTimer=setInterval(async()=>{try{const previous=lastUpdated,row=await load();if(previous&&row?.updated_at&&row.updated_at!==previous)onRemote(row.payload)}catch(error){onError?.(error)}},5000)}
  window.CookCloud={get session(){return session},login,logout,load,save,scheduleSave,startPolling};
})();
