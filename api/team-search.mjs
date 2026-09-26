import {searchTeams} from '../lib/data-sync-providers.mjs';
import {cors,q,fail} from '../lib/data-sync-http.mjs';
export default async function handler(req,res){if(cors(req,res))return;if(req.method!=='GET')return res.status(405).json({ok:false,error:'Método não permitido'});try{const provider=q(req,'provider','thesportsdb'),name=q(req,'name').trim();if(name.length<2)return res.status(400).json({ok:false,error:'Informe o nome do clube.'});res.status(200).json({ok:true,provider,results:await searchTeams({provider,name})})}catch(e){fail(res,e)}}
