import {searchPlayers} from '../lib/data-sync-providers.mjs';
import {cors,q,fail} from '../lib/data-sync-http.mjs';
export default async function handler(req,res){
  if(cors(req,res))return;
  if(req.method!=='GET')return res.status(405).json({ok:false,error:'Método não permitido'});
  try{
    const provider=q(req,'provider'),name=q(req,'name').trim(),season=q(req,'season',String(new Date().getFullYear()));
    if(!provider||name.length<3)return res.status(400).json({ok:false,error:'provider e nome (mín. 3 caracteres) são obrigatórios'});
    res.status(200).json({ok:true,provider,results:await searchPlayers({provider,name,season})});
  }catch(e){fail(res,e)}
}
