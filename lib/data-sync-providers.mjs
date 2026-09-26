const n=v=>Number.isFinite(Number(v))?Math.max(0,Number(v)):0;
const sum=(rows,key)=>rows.reduce((a,r)=>a+n(r.values?.[key]),0);
const fields=['games','starts','minutes','goals','assists','yellowCards','redCards'];
const clean=v=>String(v??'').replace(/\s+/g,' ').trim();
const fold=v=>clean(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
function aggregate(groups,seasonLabel,club=''){
  const values=Object.fromEntries(fields.map(k=>[k,sum(groups,k)]));
  return{seasonLabel:String(seasonLabel||''),competition:'Todas as competições',club:club||groups.find(g=>g.club)?.club||'',values,isAggregate:true};
}
async function jfetch(url,options={}){const c=new AbortController(),t=setTimeout(()=>c.abort(),20000);try{const r=await fetch(url,{...options,signal:c.signal,headers:{Accept:'application/json',...(options.headers||{})}});let d=null;try{d=await r.json()}catch(_){}if(!r.ok)throw new Error(d?.message||d?.errors?.token||`HTTP ${r.status}`);return d}finally{clearTimeout(t)}}
function apiFootballSquadTeam(row){const team=row?.team||{};return{id:team.id||'',name:team.name||'',logo:team.logo||''}}
async function apiFootballCurrentTeam(playerId,key){try{const u=new URL('https://v3.football.api-sports.io/players/squads');u.searchParams.set('player',playerId);const d=await jfetch(u,{headers:{'x-apisports-key':key}});const rows=Array.isArray(d?.response)?d.response:[];const teams=rows.map(apiFootballSquadTeam).filter(x=>x.name);return teams[0]||null}catch(_){return null}}
export async function apiFootball({playerId,season}){
  const key=process.env.API_FOOTBALL_KEY;if(!key)throw new Error('API_FOOTBALL_KEY não configurada no servidor.');
  const u=new URL('https://v3.football.api-sports.io/players');u.searchParams.set('id',playerId);u.searchParams.set('season',season);
  const [d,currentTeam]=await Promise.all([jfetch(u,{headers:{'x-apisports-key':key}}),apiFootballCurrentTeam(playerId,key)]);if(d?.errors&&Object.keys(d.errors).length)throw new Error(JSON.stringify(d.errors));const row=d?.response?.[0];if(!row)throw new Error('Atleta/temporada não encontrados na API-Football.');
  const groups=(row.statistics||[]).map(s=>({seasonLabel:String(season),competition:s.league?.name||`Competição ${s.league?.id||''}`.trim(),club:s.team?.name||'',values:{games:n(s.games?.appearences),starts:n(s.games?.lineups),minutes:n(s.games?.minutes),goals:n(s.goals?.total),assists:n(s.goals?.assists),yellowCards:n(s.cards?.yellow),redCards:n(s.cards?.red)}}));
  const fallbackTeam={name:groups[0]?.club||'',id:row.statistics?.[0]?.team?.id||'',logo:row.statistics?.[0]?.team?.logo||''};
  const team=currentTeam||fallbackTeam;
  const player={id:row.player?.id,name:row.player?.name,nationality:row.player?.nationality,birthDate:row.player?.birth?.date,photo:row.player?.photo,position:row.statistics?.[0]?.games?.position||'',team:team?.name||'',teamId:team?.id||'',teamLogo:team?.logo||'',teamIsCurrent:!!currentTeam};
  return{ok:true,provider:'api-football',externalId:String(playerId),season:String(season),player,groups,aggregate:aggregate(groups,season,player.team),fetchedAt:Date.now()};
}
function deepNumber(value){if(typeof value==='number')return n(value);if(typeof value==='string'&&value.trim()!==''&&!Number.isNaN(Number(value)))return n(value);if(value&&typeof value==='object'){for(const k of ['total','count','value','all']){if(k in value){const x=deepNumber(value[k]);if(Number.isFinite(x))return x}}for(const x of Object.values(value)){const y=deepNumber(x);if(Number.isFinite(y)&&y!==0)return y}}return 0}
function sportKey(detail){const t=detail?.type||{};return String(t.code||t.developer_name||t.name||'').toLowerCase().replace(/[_\s]+/g,'-')}
function sportValues(details=[]){const out={games:0,starts:0,minutes:0,goals:0,assists:0,yellowCards:0,redCards:0};for(const d of details){const k=sportKey(d),v=deepNumber(d.value);if(/appearance|matches-played|appearances/.test(k))out.games=v;else if(/starting|lineup|starts/.test(k))out.starts=v;else if(/minutes-played|cumulative-minutes/.test(k))out.minutes=Math.max(out.minutes,v);else if(/^goals$|goals-scored/.test(k))out.goals=v;else if(/assist/.test(k))out.assists=v;else if(/yellow/.test(k))out.yellowCards=v;else if(/red/.test(k))out.redCards=v}return out}
export async function sportmonks({playerId,seasonId}){
  const token=process.env.SPORTMONKS_TOKEN;if(!token)throw new Error('SPORTMONKS_TOKEN não configurado no servidor.');
  const u=new URL(`https://api.sportmonks.com/v3/football/players/${encodeURIComponent(playerId)}`);u.searchParams.set('api_token',token);u.searchParams.set('include','statistics.details.type');if(seasonId)u.searchParams.set('filters',`playerStatisticSeasons:${seasonId}`);else u.searchParams.set('filters','currentSeasons:playerStatistic');
  const d=await jfetch(u),p=d?.data;if(!p)throw new Error('Atleta não encontrado no Sportmonks.');const stats=Array.isArray(p.statistics)?p.statistics:[];
  const groups=stats.map(s=>({seasonLabel:String(s.season?.name||seasonId||s.season_id||'Atual'),competition:s.league?.name||'Sportmonks',club:s.team?.name||`Equipe ${s.team_id||''}`.trim(),values:sportValues(s.details||[]),meta:{seasonId:s.season_id,teamId:s.team_id}}));const label=groups[0]?.seasonLabel||String(seasonId||'Atual');const player={id:p.id,name:p.display_name||p.name,nationality:p.nationality?.name||'',birthDate:p.date_of_birth||'',photo:p.image_path||'',position:p.position?.name||'',team:groups[0]?.club||'',teamId:groups[0]?.meta?.teamId||'',teamLogo:'',teamIsCurrent:false};
  return{ok:true,provider:'sportmonks',externalId:String(playerId),season:label,player,groups,aggregate:aggregate(groups,label,player.team),fetchedAt:Date.now()};
}
export async function footballData({playerId,season}){
  const token=process.env.FOOTBALL_DATA_TOKEN;if(!token)throw new Error('FOOTBALL_DATA_TOKEN não configurado no servidor.');const year=String(season||new Date().getFullYear()).match(/\d{4}/)?.[0]||String(new Date().getFullYear());
  const headers={'X-Auth-Token':token};const person=await jfetch(`https://api.football-data.org/v4/persons/${encodeURIComponent(playerId)}`,{headers});const u=new URL(`https://api.football-data.org/v4/persons/${encodeURIComponent(playerId)}/matches`);u.searchParams.set('limit','100');u.searchParams.set('dateFrom',`${year}-01-01`);u.searchParams.set('dateTo',`${year}-12-31`);const m=await jfetch(u,{headers}),a=m?.aggregations||{},values={games:n(a.matchesOnPitch),starts:n(a.startingXI),minutes:n(a.minutesPlayed),goals:n(a.goals),assists:n(a.assists),yellowCards:n(a.yellowCards),redCards:n(a.redCards)};const group={seasonLabel:year,competition:'Competições consultadas',club:person.currentTeam?.name||'',values,isAggregate:true};return{ok:true,provider:'football-data',externalId:String(playerId),season:year,player:{id:person.id,name:person.name,nationality:person.nationality,birthDate:person.dateOfBirth,position:person.position||'',photo:'',team:person.currentTeam?.name||'',teamId:person.currentTeam?.id||'',teamLogo:person.currentTeam?.crest||'',teamIsCurrent:!!person.currentTeam},groups:[],aggregate:group,fetchedAt:Date.now()};
}
export async function fetchPlayerStats(input){switch(input.provider){case'api-football':return apiFootball(input);case'sportmonks':return sportmonks(input);case'football-data':return footballData(input);default:throw new Error('Provedor não suportado.')}}
function uniqueSearchTerms(name){
  const full=clean(name),parts=full.split(/\s+/).filter(Boolean),terms=[];
  for(const term of [full,parts[0],parts.length>1?parts[parts.length-1]:'']){
    const t=clean(term);if(t.length>=3&&!terms.some(x=>fold(x)===fold(t)))terms.push(t);
  }
  return terms.slice(0,3);
}
function mapApiFootballProfile(x){
  const p=x?.player||x||{};
  return{id:p.id,name:p.name||[p.firstname,p.lastname].filter(Boolean).join(' '),photo:p.photo||'',team:'',position:p.position||'',nationality:p.nationality||'',birthDate:p.birth?.date||'',age:p.age||''};
}
function mapApiFootballSeasonRow(x){
  const p=x?.player||{};
  return{id:p.id,name:p.name,photo:p.photo||'',team:x.statistics?.[0]?.team?.name||'',position:x.statistics?.[0]?.games?.position||'',nationality:p.nationality||'',birthDate:p.birth?.date||'',age:p.age||''};
}
export async function searchPlayers({provider,name,season}){
  if(provider==='api-football'){
    const key=process.env.API_FOOTBALL_KEY;if(!key)throw new Error('API_FOOTBALL_KEY não configurada.');
    const headers={'x-apisports-key':key},terms=uniqueSearchTerms(name),found=new Map(),errors=[];
    // Prefer the global profile index: it is not tied to a specific season, so transferred
    // or lower-coverage players can still be resolved to a stable API-Football player ID.
    for(const term of terms){
      try{
        const u=new URL('https://v3.football.api-sports.io/players/profiles');u.searchParams.set('search',term);
        const d=await jfetch(u,{headers});
        for(const x of (d?.response||[])){const row=mapApiFootballProfile(x);if(row.id&&!found.has(String(row.id)))found.set(String(row.id),row)}
        if(found.size>=12)break;
      }catch(e){errors.push(`profiles(${term}): ${String(e.message||e)}`)}
    }
    // Legacy/statistics search as fallback, using requested season then the two previous years.
    if(!found.size){
      const y=Number(String(season||new Date().getFullYear()).match(/\d{4}/)?.[0]||new Date().getFullYear());
      const years=[y,y-1,y-2].filter((v,i,a)=>v>2000&&a.indexOf(v)===i);
      for(const yr of years){
        for(const term of terms.slice(0,2)){
          try{
            const u=new URL('https://v3.football.api-sports.io/players');u.searchParams.set('search',term);u.searchParams.set('season',String(yr));
            const d=await jfetch(u,{headers});
            for(const x of (d?.response||[])){const row=mapApiFootballSeasonRow(x);if(row.id&&!found.has(String(row.id)))found.set(String(row.id),row)}
            if(found.size>=12)break;
          }catch(e){errors.push(`players(${term},${yr}): ${String(e.message||e)}`)}
        }
        if(found.size)break;
      }
    }
    const rows=[...found.values()].slice(0,12);
    if(!rows.length&&errors.length)Object.defineProperty(rows,'_errors',{value:errors,enumerable:false});
    return rows;
  }
  if(provider==='sportmonks'){
    const token=process.env.SPORTMONKS_TOKEN;if(!token)throw new Error('SPORTMONKS_TOKEN não configurado.');const d=await jfetch(`https://api.sportmonks.com/v3/football/players/search/${encodeURIComponent(name)}?api_token=${encodeURIComponent(token)}`);return(d.data||[]).slice(0,12).map(x=>({id:x.id,name:x.display_name||x.name,photo:x.image_path||'',team:'',position:x.position?.name||'',nationality:x.nationality?.name||'',birthDate:x.date_of_birth||'',age:''}))
  }
  throw new Error('Busca por nome não disponível para este provedor.');
}
function nameScore(input,candidate){const expected=[input.name,...(Array.isArray(input.aliases)?input.aliases:[])].map(fold).filter(Boolean),got=fold(candidate.name);if(!got)return 0;if(expected.includes(got))return 58;let best=0;for(const x of expected){const a=new Set(x.split(' ').filter(Boolean)),b=new Set(got.split(' ').filter(Boolean)),inter=[...a].filter(t=>b.has(t)).length,den=Math.max(a.size,b.size,1),ratio=inter/den;best=Math.max(best,Math.round(42*ratio));if(x.includes(got)||got.includes(x))best=Math.max(best,44)}return best}
function sameDate(a,b){const aa=clean(a),bb=clean(b);if(!aa||!bb)return 0;if(aa===bb)return 28;const ya=(aa.match(/\b(19|20)\d{2}\b/)||[])[0],yb=(bb.match(/\b(19|20)\d{2}\b/)||[])[0];return ya&&yb&&ya===yb?16:0}
function textMatch(a,b,points){a=fold(a);b=fold(b);if(!a||!b)return 0;if(a===b)return points;if(a.includes(b)||b.includes(a))return Math.max(2,Math.round(points*.6));return 0}
function scoreCandidate(input,candidate,uniqueExact=false){let score=nameScore(input,candidate);score+=sameDate(input.dob||input.birthYear,candidate.birthDate);score+=textMatch(input.nationality,candidate.nationality,8);score+=textMatch(input.position,candidate.position,6);score+=textMatch(input.club,candidate.team,8);if(uniqueExact&&fold(candidate.name)===fold(input.name))score+=12;return Math.min(100,score)}
function providerConfigured(provider){if(provider==='api-football')return!!process.env.API_FOOTBALL_KEY;if(provider==='sportmonks')return!!process.env.SPORTMONKS_TOKEN;if(provider==='football-data')return!!process.env.FOOTBALL_DATA_TOKEN;return false}
export async function resolvePlayerIdentity(input={}){
  const name=clean(input.name);if(name.length<3)throw new Error('Nome insuficiente para resolver identidade.');const season=String(input.season||new Date().getFullYear());let providers=Array.isArray(input.providers)?input.providers:clean(input.provider)?[clean(input.provider)]:['api-football','sportmonks'];providers=[...new Set(providers.filter(p=>['api-football','sportmonks'].includes(p)))];const all=[],errors=[];
  for(const provider of providers){if(!providerConfigured(provider))continue;try{const rows=await searchPlayers({provider,name,season});const exactCount=rows.filter(r=>fold(r.name)===fold(name)).length;for(const row of rows)all.push({...row,provider,score:scoreCandidate(input,row,exactCount===1)})}catch(e){errors.push(`${provider}: ${String(e.message||e)}`)}}
  all.sort((a,b)=>b.score-a.score||String(a.name||'').localeCompare(String(b.name||'')));const first=all[0],second=all[1];const gap=first?first.score-(second?.score||0):0;const resolved=!!first&&first.score>=72&&(gap>=8||first.score>=88);return{ok:true,resolved,confidence:first?.score||0,gap,match:first||null,candidates:all.slice(0,8),errors,reference:{provider:clean(input.referenceProvider),externalId:clean(input.referenceId)}};
}
