import {fetchPlayerStats} from '../lib/data-sync-providers.mjs';
import {cors,q,fail} from '../lib/data-sync-http.mjs';
export default async function handler(req,res){
  if(cors(req,res))return;
  if(req.method!=='GET')return res.status(405).json({ok:false,error:'Método não permitido'});
  try{
    const provider=q(req,'provider'),playerId=q(req,'playerId'),season=q(req,'season',String(new Date().getFullYear())),seasonId=q(req,'seasonId');
    if(!provider||!playerId)return res.status(400).json({ok:false,error:'provider e playerId são obrigatórios'});
    res.status(200).json(await fetchPlayerStats({provider,playerId,season,seasonId}));
  }catch(e){fail(res,e)}
}
