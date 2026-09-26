export function cors(req,res){
  const configured=String(process.env.ALLOWED_ORIGINS||'').split(',').map(x=>x.trim()).filter(Boolean);
  const origin=String(req.headers?.origin||'');
  if(!configured.length || configured.includes('*')) res.setHeader('Access-Control-Allow-Origin','*');
  else if(origin && configured.includes(origin)) res.setHeader('Access-Control-Allow-Origin',origin);
  res.setHeader('Vary','Origin');
  res.setHeader('Access-Control-Allow-Headers','Authorization, Content-Type');
  res.setHeader('Access-Control-Allow-Methods','GET, OPTIONS');
  if(req.method==='OPTIONS'){res.status(204).end();return true}
  return false;
}
export function q(req,key,fallback=''){
  const v=req.query?.[key];
  if(Array.isArray(v)) return String(v[0]??fallback);
  return String(v??fallback);
}
export function fail(res,e,status=502){
  console.error(e);
  res.status(status).json({ok:false,error:String(e?.message||e)});
}
