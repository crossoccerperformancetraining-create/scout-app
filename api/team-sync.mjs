import {fetchTeamSnapshot} from '../lib/data-sync-providers.mjs';
import {cors,q,fail} from '../lib/data-sync-http.mjs';
export default async function handler(req,res){if(cors(req,res))return;if(req.method!=='GET')return res.status(405).json({ok:false,error:'Método não permitido'});try{const provider=q(req,'provider','thesportsdb'),teamId=q(req,'teamId').trim();if(!teamId)return res.status(400).json({ok:false,error:'teamId é obrigatório'});res.status(200).json(await fetchTeamSnapshot({provider,teamId}))}catch(e){fail(res,e)}}
