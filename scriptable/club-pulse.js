const TEST_MODE='auto';
const PROVIDER='footballData';
const API='https://api.football-data.org/v4';
const TOKEN='clubpulse_football_data_token_v1';
const LIVE_API='https://v3.football.api-sports.io';
const LIVE_TOKEN='clubpulse_api_football_token_v1';
const TTL_FAR=15*60*1000,TTL_NEAR=2*60*1000,TTL_LIVE=2*60*1000,POST=10*60*60*1000;

const CLUBS={
  manutd:{id:'manutd',team:66,comp:'PL',name:'マンチェスター・ユナイテッド',short:'MAN UTD',jp:'マンU',badge:'MU',league:'プレミアリーグ',p:'#DA291C',s:'#5A0E0A',a:'#FF6A62',venue:'オールド・トラッフォード',liveSearch:'Manchester United'},
  arsenal:{id:'arsenal',team:57,comp:'PL',name:'アーセナル',short:'ARS',jp:'アーセナル',badge:'ARS',league:'プレミアリーグ',p:'#D71920',s:'#6D0A0D',a:'#FF6A62',venue:'エミレーツ・スタジアム',liveSearch:'Arsenal'},
  barcelona:{id:'barcelona',team:81,comp:'PD',name:'バルセロナ',short:'BAR',jp:'バルサ',badge:'FCB',league:'ラ・リーガ',p:'#A50044',s:'#0B2D72',a:'#D94A6A',venue:'ホーム',liveSearch:'Barcelona'}
};
const ALIASES={mu:'manutd',mun:'manutd',manu:'manutd','man-united':'manutd',ars:'arsenal',gunners:'arsenal',barca:'barcelona',fcb:'barcelona'};

const JP={
  'Arsenal FC':'アーセナル','Aston Villa FC':'アストン・ヴィラ','AFC Bournemouth':'ボーンマス','Brentford FC':'ブレントフォード','Brighton & Hove Albion FC':'ブライトン','Chelsea FC':'チェルシー','Crystal Palace FC':'クリスタル・パレス','Everton FC':'エヴァートン','Fulham FC':'フラム','Ipswich Town FC':'イプスウィッチ','Ipswich Town':'イプスウィッチ','Leeds United FC':'リーズ','Liverpool FC':'リヴァプール','Manchester City FC':'マンチェスター・シティ','Manchester United FC':'マンチェスター・ユナイテッド','Manchester United':'マンチェスター・ユナイテッド','Newcastle United FC':'ニューカッスル','Nottingham Forest FC':'ノッティンガム・フォレスト','Sunderland AFC':'サンダーランド','Tottenham Hotspur FC':'トッテナム','FC Barcelona':'バルセロナ','Barcelona':'バルセロナ','Real Madrid CF':'レアル・マドリード','Club Atlético de Madrid':'アトレティコ・マドリード','Athletic Club':'アスレティック・クラブ','Villarreal CF':'ビジャレアル','Real Sociedad de Fútbol':'レアル・ソシエダ','Sevilla FC':'セビージャ','Valencia CF':'バレンシア','Real Betis Balompié':'ベティス'
};
const COMP={PL:'プレミアリーグ',PD:'ラ・リーガ',CL:'チャンピオンズリーグ',EL:'ヨーロッパリーグ',FAC:'FAカップ',ELC:'チャンピオンシップ',CDR:'国王杯'};
const VEN={'Old Trafford':'オールド・トラッフォード','Emirates Stadium':'エミレーツ・スタジアム','Anfield':'アンフィールド','Etihad Stadium':'エティハド・スタジアム','Stamford Bridge':'スタンフォード・ブリッジ','Tottenham Hotspur Stadium':'トッテナム・ホットスパー・スタジアム','Villa Park':'ヴィラ・パーク'};
const CREST_SCALE={66:1.08,57:1.05,81:1.05,40:1.12,opponent_default:1.08};

const param=String(args.widgetParameter||'manutd').trim().toLowerCase();
const rawClub=param.split(':')[0]||'manutd';
const clubKey=ALIASES[rawClub]||rawClub;
const club=CLUBS[clubKey]||CLUBS.manutd;
const family=config.widgetFamily||'medium';
const C=(h,a=1)=>new Color(h,a),pad=n=>String(n).padStart(2,'0');
const fmt=(d,f)=>{let x=new DateFormatter();x.locale='ja_JP';x.dateFormat=f;return x.string(d)};
const kickoff=s=>fmt(new Date(s),'M/d(E) HH:mm'),updated=t=>fmt(new Date(t),'HH:mm')+'更新',addDays=(d,n)=>new Date(d.getTime()+n*864e5),ymd=d=>`${d.getUTCFullYear()}-${pad(d.getUTCMonth()+1)}-${pad(d.getUTCDate())}`;

function files(){let fm=FileManager.local(),dir=fm.joinPath(fm.documentsDirectory(),'ClubPulse');if(!fm.fileExists(dir))fm.createDirectory(dir,true);return{fm,dir}}
function cachePath(id){let x=files();return x.fm.joinPath(x.dir,`data_${id}.json`)}
function liveMapPath(){let x=files();return x.fm.joinPath(x.dir,'live_team_ids.json')}
function loadCache(id){try{let x=files(),p=cachePath(id);return x.fm.fileExists(p)?JSON.parse(x.fm.readString(p)):null}catch{return null}}
function saveCache(id,v){try{let x=files();x.fm.writeString(cachePath(id),JSON.stringify(v))}catch{}}
function loadLiveMap(){try{let x=files(),p=liveMapPath();return x.fm.fileExists(p)?JSON.parse(x.fm.readString(p)):{} }catch{return{}}}
function saveLiveMap(v){try{let x=files();x.fm.writeString(liveMapPath(),JSON.stringify(v))}catch{}}

async function getToken(){
  if(Keychain.contains(TOKEN))return Keychain.get(TOKEN);
  if(!config.runsInApp)return null;
  let a=new Alert();a.title='Club Pulse 初期設定';a.message='football-data.org のAPI Tokenを貼り付けてください。';a.addTextField('API Token','');a.addAction('保存');a.addCancelAction('キャンセル');
  if(await a.present()===-1)return null;
  let t=a.textFieldValue(0).trim();if(t)Keychain.set(TOKEN,t);return t||null;
}
function getLiveToken(){try{return Keychain.contains(LIVE_TOKEN)?Keychain.get(LIVE_TOKEN):null}catch{return null}}
async function api(path,t){let r=new Request(API+path);r.headers={'X-Auth-Token':t};r.timeoutInterval=15;let j=await r.loadJSON(),s=r.response?.statusCode||200;if(s>=400||j?.error)throw new Error(j?.message||j?.error||`API ${s}`);return j}
async function liveApi(path,t){let r=new Request(LIVE_API+path);r.headers={'x-apisports-key':t};r.timeoutInterval=12;let j=await r.loadJSON(),s=r.response?.statusCode||200;if(s>=400||j?.errors&&Object.keys(j.errors).length)throw new Error(`LIVE API ${s}`);return j}

const teamName=t=>!t?'未定':JP[t.name]||JP[t.shortName]||t.shortName||t.name||t.tla||'未定';
const venueName=(v,h)=>VEN[v]||v||(h?club.venue:'アウェイ');
function standing(j){let s=j?.standings||[],t=s.find(x=>x.type==='TOTAL')||s[0];return t?.table?.find(x=>x.team?.id===club.team)||null}
function rawScore(m){for(let s of[m?.score?.fullTime,m?.score?.regularTime,m?.score?.halfTime])if(Number.isFinite(s?.home)&&Number.isFinite(s?.away))return s;return{home:null,away:null}}
function scoreFor(m){let s=rawScore(m),home=m?.homeTeam?.id===club.team;return{ours:home?s.home:s.away,theirs:home?s.away:s.home,home}}
function result(m){let s=scoreFor(m);if(!Number.isFinite(s.ours)||!Number.isFinite(s.theirs))return'D';return s.ours>s.theirs?'W':s.ours<s.theirs?'L':'D'}
function mapMatch(m){
  if(!m)return null;
  let h=m.homeTeam?.id===club.team,opp=h?m.awayTeam:m.homeTeam,own=h?m.homeTeam:m.awayTeam,s=scoreFor(m);
  return{id:m.id,status:m.status,minute:m.status==='PAUSED'?'HT':Number.isFinite(m.minute)?`${m.minute}${m.injuryTime?`+${m.injuryTime}`:''}'`:'試合中',homeAway:h?'HOME':'AWAY',kickoff:kickoff(m.utcDate),utcDate:m.utcDate,venue:venueName(m.venue,h),competition:COMP[m.competition?.code]||m.competition?.name||'試合',opponentName:teamName(opp),opponentShort:opp?.tla||'OPP',opponentId:opp?.id||null,opponentCrest:opp?.crest||null,clubCrest:own?.crest||null,ourScore:s.ours,opponentScore:s.theirs,result:m.status==='FINISHED'?result(m):null};
}
function mapData(mj,sj){
  let now=Date.now(),m=mj?.matches||[],fin=m.filter(x=>x.status==='FINISHED').sort((a,b)=>new Date(b.utcDate)-new Date(a.utcDate)),live=m.find(x=>['IN_PLAY','PAUSED','LIVE'].includes(x.status))||null,next=m.filter(x=>['SCHEDULED','TIMED'].includes(x.status)&&new Date(x.utcDate).getTime()>=now-144e5).sort((a,b)=>new Date(a.utcDate)-new Date(b.utcDate))[0]||null,last=fin[0]||null,post=last&&now-new Date(last.utcDate).getTime()<=POST?last:null,row=standing(sj),form=fin.slice(0,5).map(result);
  while(form.length<5)form.push('-');
  let L=mapMatch(live),N=mapMatch(next),P=mapMatch(post),crest=row?.team?.crest||L?.clubCrest||N?.clubCrest||P?.clubCrest||null;
  return{provider:PROVIDER,fetchedAt:Date.now(),mode:L?'LIVE':P?'POST':'NEXT',rank:row?.position??null,points:row?.points??null,form,clubCrest:crest,liveMatch:L,recentResult:P,nextMatch:N};
}

const providers={footballData:{async load(token){let d=new Date(),from=ymd(addDays(d,-120)),to=ymd(addDays(d,120));let[m,s]=await Promise.all([api(`/teams/${club.team}/matches?dateFrom=${from}&dateTo=${to}&limit=100`,token),api(`/competitions/${club.comp}/standings`,token)]);return mapData(m,s)}}};
function cacheTTL(c){if(!c)return 0;if(c.mode==='LIVE')return TTL_LIVE;let n=c.nextMatch?.utcDate?new Date(c.nextMatch.utcDate).getTime():0;if(n&&Math.abs(n-Date.now())<=2*60*60*1000)return TTL_NEAR;return TTL_FAR}
async function loadData(t){let c=loadCache(club.id),ttl=cacheTTL(c);if(c&&Date.now()-c.fetchedAt<ttl)return{...c,stale:false};try{let v=await providers[PROVIDER].load(t);saveCache(club.id,v);return{...v,stale:false}}catch(e){if(c)return{...c,stale:true};throw e}}
function refreshDelay(d){if(d.mode==='LIVE')return TTL_LIVE;let n=d.nextMatch?.utcDate?new Date(d.nextMatch.utcDate).getTime():0;if(n&&Math.abs(n-Date.now())<=2*60*60*1000)return TTL_NEAR;return TTL_FAR}
function shouldCheckLive(d){if(d.mode==='LIVE')return true;let n=d.nextMatch?.utcDate?new Date(d.nextMatch.utcDate).getTime():0;if(!n)return false;let delta=n-Date.now();return delta<=3*60*60*1000&&delta>=-4*60*60*1000}
async function resolveLiveTeamId(token){let map=loadLiveMap();if(map[club.id])return map[club.id];let j=await liveApi(`/teams?search=${encodeURIComponent(club.liveSearch)}`,token),rows=j?.response||[];if(!rows.length)return null;let q=club.liveSearch.toLowerCase(),best=rows.find(x=>String(x?.team?.name||'').toLowerCase()===q)||rows[0],id=best?.team?.id||null;if(id){map[club.id]=id;saveLiveMap(map)}return id}
function mapLiveFixture(f,teamId){
  if(!f)return null;
  let h=f?.teams?.home?.id===teamId,opp=h?f.teams.away:f.teams.home,own=h?f.teams.home:f.teams.away,st=f?.fixture?.status||{},elapsed=st.elapsed;
  return{id:f?.fixture?.id||`live-${club.id}`,status:'IN_PLAY',minute:st.short==='HT'?'HT':Number.isFinite(elapsed)?`${elapsed}'`:'LIVE',homeAway:h?'HOME':'AWAY',kickoff:kickoff(f?.fixture?.date||new Date().toISOString()),utcDate:f?.fixture?.date||new Date().toISOString(),venue:venueName(f?.fixture?.venue?.name,h),competition:f?.league?.name||club.league,opponentName:teamName(opp),opponentShort:opp?.code||'OPP',opponentId:opp?.id||null,opponentCrest:opp?.logo||null,clubCrest:own?.logo||null,ourScore:h?f?.goals?.home:f?.goals?.away,opponentScore:h?f?.goals?.away:f?.goals?.home,result:null};
}
async function applyLiveOverlay(d){
  let token=getLiveToken();
  if(!token||!shouldCheckLive(d))return{...d,liveProvider:'unconfigured'};
  try{let teamId=await resolveLiveTeamId(token);if(!teamId)return{...d,liveProvider:'team-unresolved'};let j=await liveApi(`/fixtures?live=all&team=${teamId}`,token),f=(j?.response||[])[0];if(!f)return{...d,liveProvider:'ready'};let m=mapLiveFixture(f,teamId);return{...d,mode:'LIVE',liveMatch:m,clubCrest:m.clubCrest||d.clubCrest,liveProvider:'apiFootball',liveFetchedAt:Date.now()}}
  catch(e){return{...d,liveProvider:'error',liveError:String(e)}}
}

async function image(url,key){if(!url)return null;try{let x=files(),p=x.fm.joinPath(x.dir,`crest_${String(key).replace(/[^\w-]/g,'_')}.png`);if(x.fm.fileExists(p))return x.fm.readImage(p);let r=new Request(url);r.timeoutInterval=10;let i=await r.loadImage();x.fm.writeImage(p,i);return i}catch{return null}}
function applyTestMode(d){if(TEST_MODE==='auto')return d;let base=d.nextMatch||d.liveMatch||d.recentResult;if(!base)return d;let m={...base};if(TEST_MODE==='live'){m.status='IN_PLAY';m.minute="67'";m.ourScore=2;m.opponentScore=1;return{...d,mode:'LIVE',liveMatch:m}}if(TEST_MODE==='post'){m.status='FINISHED';m.ourScore=2;m.opponentScore=1;m.result='W';return{...d,mode:'POST',recentResult:m}}return{...d,mode:'NEXT',nextMatch:m}}

function text(p,s,n=8,b=false,a=1,h='#FFFFFF'){let t=p.addText(String(s));t.font=b?Font.boldSystemFont(n):Font.mediumSystemFont(n);t.textColor=C(h,a);t.lineLimit=1;t.minimumScaleFactor=.5;return t}
function heavy(p,s,n=12,h='#FFFFFF'){let t=p.addText(String(s));t.font=Font.heavySystemFont(n);t.textColor=C(h);t.lineLimit=1;t.minimumScaleFactor=.5;return t}
function semibold(p,s,n=10,a=1,h='#FFFFFF'){let t=p.addText(String(s));t.font=Font.semiboldSystemFont(n);t.textColor=C(h,a);t.lineLimit=1;t.minimumScaleFactor=.5;return t}
function gradient(colors,loc=[0,.5,1],horizontal=false){let g=new LinearGradient();g.startPoint=new Point(0,0);g.endPoint=horizontal?new Point(1,0):new Point(1,1);g.colors=colors;g.locations=loc;return g}
function bg(){return gradient([C('#050608'),C('#0A0B0F'),C('#16090A'),C(club.s,.95),C(club.p,.5)],[0,.38,.68,.88,1])}
function cardBg(mode){return mode==='LIVE'?gradient([C(club.p,.96),C(club.s,.92),C('#090A0D')],[0,.40,1],true):gradient([C(club.s,.98),C(club.p,.56),C('#100C12'),C('#090A0D')],[0,.24,.56,1],true)}
function badge(p,fallback,img,size=28,p1=club.p,p2=club.s,scale=1){let o=p.addStack();o.size=new Size(size+4,size+4);o.cornerRadius=(size+4)/2;o.backgroundColor=C('#FFFFFF',.05);o.centerAlignContent();let i=o.addStack();i.size=new Size(size,size);i.cornerRadius=size/2;i.centerAlignContent();if(img){let im=i.addImage(img),z=Math.round((size-1)*scale);im.imageSize=new Size(z,z)}else{i.backgroundGradient=gradient([C(p1),C(p2)],[0,1]);let t=heavy(i,fallback,size<30?8:10);t.centerAlignText()}return o}
function chip(p,r,small=false){let m={W:['勝','#63E283','#133922'],D:['分','#D2D2D7','#37373C'],L:['負','#FF6961','#4D1715'],'-':['–','#8E8E93','#25252A']}[r],s=p.addStack();s.setPadding(small?1:2,small?5:6,small?1:2,small?5:6);s.cornerRadius=7;s.backgroundColor=C(m[2]);text(s,m[0],small?6.5:7,true,1,m[1])}
function statusTitle(d,m){if(d.mode==='LIVE')return TEST_MODE==='live'?'試合中（テスト）':'試合中';if(d.mode==='POST')return`試合終了・${m.result==='W'?'勝利':m.result==='L'?'敗戦':'引分'}`;return'次の試合'}
function statusAccent(d){return d.mode==='LIVE'?'#FFFFFF':'#FF6A62'}
function metaLine(d,m){return d.mode==='NEXT'?`${m.kickoff} ・ ${m.venue}`:`${m.competition} ・ ${m.venue}`}
function centerMainText(d,m){return d.mode==='NEXT'?'VS':`${Number.isFinite(m.ourScore)?m.ourScore:'–'}-${Number.isFinite(m.opponentScore)?m.opponentScore:'–'}`}
function sideTag(m){return m.homeAway==='HOME'?'ホーム':'アウェイ'}
function pill(parent,label){let p=parent.addStack();p.setPadding(2,6,2,6);p.cornerRadius=7;p.backgroundColor=C(club.p,.14);text(p,label,7,true,.9,club.a);return p}
function renderTeamBlock(parent,opt){let s=parent.addStack();if(opt.width)s.size=new Size(opt.width,0);s.layoutVertically();let logo=s.addStack();logo.layoutHorizontally();logo.addSpacer();badge(logo,opt.fallback,opt.img,opt.logoSize,opt.p1,opt.p2,opt.scale||1);logo.addSpacer();s.addSpacer(opt.nameGap??2);let name=s.addStack();name.layoutHorizontally();name.addSpacer();let nm=heavy(name,opt.name,opt.nameSize||12);nm.centerAlignText();name.addSpacer();if(opt.sub){let sub=s.addStack();sub.layoutHorizontally();sub.addSpacer();let sb=text(sub,opt.sub,opt.subSize||7,false,.56);sb.centerAlignText();sub.addSpacer()}return s}

function buildHeaderMedium(w,d,clubImg){let h=w.addStack();h.layoutHorizontally();h.centerAlignContent();badge(h,club.badge,clubImg,20,club.p,club.s,CREST_SCALE[club.team]||1.06);h.addSpacer(6);let l=h.addStack();l.layoutVertically();heavy(l,club.name,10.5);text(l,`${club.league} · ${updated(d.fetchedAt)}${d.stale?' · 保存データ':''}`,6.2,false,.54);h.addSpacer();let r=h.addStack();r.layoutVertically();let rk=heavy(r,d.rank!=null?`${d.rank}位`:'–',15.5);rk.rightAlignText();let pt=semibold(r,`勝点 ${d.points??'–'}`,7.2,.68);pt.rightAlignText()}
function buildFooterMedium(w,d){let f=w.addStack();f.layoutHorizontally();f.centerAlignContent();f.setPadding(2,8,2,8);f.cornerRadius=9;f.backgroundGradient=gradient([C('#121317'),C(club.s,.70),C(club.p,.28)],[0,.5,1]);text(f,'直近5戦',6.7,false,.66);f.addSpacer(7);for(let i=0;i<d.form.length;i++){chip(f,d.form[i],true);if(i<d.form.length-1)f.addSpacer(3)}f.addSpacer()}
function buildMatchMedium(w,d,imgs){
  let m=d.mode==='LIVE'?d.liveMatch:d.mode==='POST'?d.recentResult:d.nextMatch,c=w.addStack();c.layoutVertically();c.setPadding(4,9,4,9);c.cornerRadius=16;c.backgroundGradient=cardBg(d.mode);if(!m){heavy(c,'試合データ未取得',11);return}
  let top=c.addStack();top.layoutHorizontally();top.centerAlignContent();text(top,statusTitle(d,m),8,true,1,statusAccent(d));top.addSpacer();if(d.mode==='LIVE')heavy(top,m.minute||'LIVE',10);else pill(top,sideTag(m));c.addSpacer(2);
  let outer=c.addStack();outer.layoutHorizontally();outer.centerAlignContent();outer.addSpacer();let row=outer.addStack();row.layoutHorizontally();row.centerAlignContent();
  renderTeamBlock(row,{img:imgs.club,name:club.jp,sub:club.short,fallback:club.badge,logoSize:56,nameSize:11.5,subSize:5.5,p1:club.p,p2:club.s,scale:CREST_SCALE[club.team]||1.08,nameGap:1,width:92});row.addSpacer(20);let mid=heavy(row,centerMainText(d,m),d.mode==='NEXT'?14:22);mid.centerAlignText();row.addSpacer(20);renderTeamBlock(row,{img:imgs.opp,name:m.opponentName,sub:m.opponentShort,fallback:m.opponentShort,logoSize:56,nameSize:11.5,subSize:5.5,p1:'#4A5568',p2:'#20242D',scale:CREST_SCALE[m.opponentId]||CREST_SCALE.opponent_default||1.08,nameGap:1,width:92});outer.addSpacer();c.addSpacer(2);
  let meta=c.addStack();meta.layoutHorizontally();meta.centerAlignContent();meta.addSpacer();let mt=semibold(meta,metaLine(d,m),8.7,.92);mt.centerAlignText();meta.addSpacer();
}
function buildMedium(d,imgs){let w=new ListWidget();w.backgroundGradient=bg();w.setPadding(5,10,6,10);let line=w.addStack();line.size=new Size(0,1.5);line.backgroundColor=C(club.p);w.addSpacer(3);buildHeaderMedium(w,d,imgs.club);w.addSpacer(3);buildMatchMedium(w,d,imgs);w.addSpacer(3);buildFooterMedium(w,d);w.refreshAfterDate=new Date(Date.now()+refreshDelay(d));return w}

function buildHeaderSmall(w,d,clubImg){let h=w.addStack();h.layoutHorizontally();h.centerAlignContent();badge(h,club.badge,clubImg,18,club.p,club.s,CREST_SCALE[club.team]||1.06);h.addSpacer(5);heavy(h,club.jp,8.5);h.addSpacer();let rk=heavy(h,d.rank!=null?`${d.rank}位`:'–',9.5);rk.rightAlignText()}
function buildMatchSmall(w,d,imgs){
  let m=d.mode==='LIVE'?d.liveMatch:d.mode==='POST'?d.recentResult:d.nextMatch,c=w.addStack();c.layoutVertically();c.setPadding(5,5,5,5);c.cornerRadius=14;c.backgroundGradient=cardBg(d.mode);if(!m){heavy(c,'試合データ未取得',9);return}
  let top=c.addStack();top.layoutHorizontally();text(top,statusTitle(d,m),7.2,true,1,statusAccent(d));top.addSpacer();if(d.mode==='LIVE')heavy(top,m.minute||'LIVE',8.5);c.addSpacer(3);
  let outer=c.addStack();outer.layoutHorizontally();outer.centerAlignContent();outer.addSpacer();let row=outer.addStack();row.layoutHorizontally();row.centerAlignContent();
  renderTeamBlock(row,{img:imgs.club,name:club.jp,fallback:club.badge,logoSize:40,nameSize:7.2,p1:club.p,p2:club.s,scale:CREST_SCALE[club.team]||1.08,nameGap:1,width:56});row.addSpacer(7);let sc=heavy(row,centerMainText(d,m),d.mode==='NEXT'?13.5:16.5);sc.centerAlignText();row.addSpacer(7);renderTeamBlock(row,{img:imgs.opp,name:m.opponentName,fallback:m.opponentShort,logoSize:40,nameSize:7.2,p1:'#4A5568',p2:'#20242D',scale:CREST_SCALE[m.opponentId]||CREST_SCALE.opponent_default||1.08,nameGap:1,width:56});outer.addSpacer();c.addSpacer(3);
  let meta=c.addStack();meta.layoutHorizontally();meta.centerAlignContent();meta.addSpacer();let mt=semibold(meta,d.mode==='NEXT'?m.kickoff:m.competition,7.1,.88);mt.centerAlignText();meta.addSpacer();
}
function buildFooterSmall(w,d){let f=w.addStack();f.layoutHorizontally();f.centerAlignContent();f.addSpacer();for(let i=0;i<d.form.length;i++){chip(f,d.form[i],true);if(i<d.form.length-1)f.addSpacer(4)}f.addSpacer()}
function buildSmall(d,imgs){let w=new ListWidget();w.backgroundGradient=bg();w.setPadding(8,8,8,8);buildHeaderSmall(w,d,imgs.club);w.addSpacer(5);buildMatchSmall(w,d,imgs);w.addSpacer(5);buildFooterSmall(w,d);w.refreshAfterDate=new Date(Date.now()+refreshDelay(d));return w}

function errorWidget(msg){let w=new ListWidget();w.backgroundColor=C('#0B0C10');w.setPadding(14,14,14,14);heavy(w,'Club Pulse',14);w.addSpacer(8);let t=text(w,msg,10,false,.72);t.lineLimit=6;return w}
let tokenValue=await getToken(),widget;if(!tokenValue)widget=errorWidget('Scriptableで一度実行し、API Tokenを設定してください。');else try{let data=applyTestMode(await applyLiveOverlay(await loadData(tokenValue))),match=data.mode==='LIVE'?data.liveMatch:data.mode==='POST'?data.recentResult:data.nextMatch,images={club:await image(data.clubCrest,club.team),opp:match?await image(match.opponentCrest,match.opponentId||match.id):null};widget=family==='small'?buildSmall(data,images):buildMedium(data,images)}catch(e){widget=errorWidget('データ取得失敗\n'+String(e))}Script.setWidget(widget);if(config.runsInApp)family==='small'?await widget.presentSmall():await widget.presentMedium();Script.complete();
