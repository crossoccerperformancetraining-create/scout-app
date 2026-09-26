import {resolvePlayerIdentity} from '../lib/data-sync-providers.mjs';
import {cors,q,fail} from '../lib/data-sync-http.mjs';
export default async function handler(req,res){
  if(cors(req,res))return;
  if(req.method!=='GET')return res.status(405).json({ok:false,error:'Método não permitido'});
  try{
    const name=q(req,'name').trim();
    if(name.length<3)return res.status(400).json({ok:false,error:'nome (mín. 3 caracteres) é obrigatório'});
    const aliases=q(req,'aliases').split('|').map(x=>x.trim()).filter(Boolean).slice(0,10);
    const providers=q(req,'providers',q(req,'provider')).split(',').map(x=>x.trim()).filter(Boolean);
    const data=await resolvePlayerIdentity({name,aliases,providers,provider:q(req,'provider'),season:q(req,'season',String(new Date().getFullYear())),dob:q(req,'dob'),birthYear:q(req,'birthYear'),nationality:q(req,'nationality'),position:q(req,'position'),club:q(req,'club'),referenceProvider:q(req,'referenceProvider'),referenceId:q(req,'referenceId')});
    res.status(200).json(data);
  }catch(e){fail(res,e)}
}
