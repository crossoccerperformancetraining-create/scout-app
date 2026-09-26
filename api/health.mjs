import {cors} from '../lib/data-sync-http.mjs';
export default async function handler(req,res){
  if(cors(req,res))return;
  if(req.method!=='GET')return res.status(405).json({ok:false,error:'Método não permitido'});
  const configured=['thesportsdb'];
  if(process.env.API_FOOTBALL_KEY)configured.push('api-football');
  if(process.env.SPORTMONKS_TOKEN)configured.push('sportmonks');
  if(process.env.FOOTBALL_DATA_TOKEN)configured.push('football-data');
  res.status(200).json({ok:true,service:'Scout Intelligence Football Data Sync Gateway',version:'V76.1.0 LTS Final UX + Operations',providers:['thesportsdb','api-football','sportmonks','football-data'],configuredProviders:configured,features:['player-search','player-resolve','player-stats','current-club-sync','free-provider-router','ogol-assisted-identity','batch-update-center','fixed-assisted-form','club-history-sync','club-manager-view','smart-sync-open-app','contract-radar','data-health','permanent-club-id','team-search','team-roster-sync','club-inbox','live-roster-review','professional-tactical-pitch','club-logo-upload','final-sidebar-navigation','analyzer-global-navigation','lts-operational-freeze']});
}
