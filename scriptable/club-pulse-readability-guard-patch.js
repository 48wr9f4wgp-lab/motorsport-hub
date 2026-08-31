// Club Pulse readability guard v7.
// Eleven-club presentation contract: stable Japanese display names, shared token-driven pill dimensions,
// visible competition identity, generic opponent handling, and conservative venue localization/fallback.

const CP_STANDARD_TEAM_IDS=new Set([66,81,86,5,524,98,65,57,64,108,4]);
const CP_RG_BASE_RENDER_TEAM=renderTeamBlock;
const CP_RG_BASE_SMALL_TEAM_NAME=smallTeamName;
const CP_RG_BASE_REAL_TEAM=typeof cpRealTeamBlock==='function'?cpRealTeamBlock:null;
const CP_RG_BASE_BARCA_TEAM=typeof cpBarcelonaTeamBlock==='function'?cpBarcelonaTeamBlock:null;
const CP_RG_BASE_MAP_MATCH=mapMatch;

function cpRgActive(){return CP_STANDARD_TEAM_IDS.has(club?.team)}

// Broad provider/display registry for the five major European leagues.
// It is intentionally inclusive: aliases may remain useful across promotion/relegation seasons.
const CP_TEAM_DISPLAY_NAMES={
  // England
  'Manchester United FC':'マンU','Manchester United':'マンU','マンチェスター・ユナイテッド':'マンU',
  'Manchester City FC':'マンC','Manchester City':'マンC','マンチェスター・シティ':'マンC',
  'Arsenal FC':'アーセナル','Arsenal':'アーセナル','アーセナル':'アーセナル',
  'Liverpool FC':'リヴァプール','Liverpool':'リヴァプール','リバプール':'リヴァプール','リヴァプール':'リヴァプール',
  'Aston Villa FC':'アストン・ヴィラ','Aston Villa':'アストン・ヴィラ',
  'AFC Bournemouth':'ボーンマス','Bournemouth':'ボーンマス',
  'Brentford FC':'ブレントフォード','Brentford':'ブレントフォード',
  'Brighton & Hove Albion FC':'ブライトン','Brighton & Hove Albion':'ブライトン','Brighton':'ブライトン',
  'Chelsea FC':'チェルシー','Chelsea':'チェルシー',
  'Crystal Palace FC':'クリスタル・パレス','Crystal Palace':'クリスタル・パレス',
  'Everton FC':'エヴァートン','Everton':'エヴァートン',
  'Fulham FC':'フラム','Fulham':'フラム',
  'Leeds United FC':'リーズ','Leeds United':'リーズ','Leeds':'リーズ',
  'Newcastle United FC':'ニューカッスル','Newcastle United':'ニューカッスル',
  'Nottingham Forest FC':'フォレスト','Nottingham Forest':'フォレスト','ノッティンガム・フォレスト':'フォレスト',
  'Sunderland AFC':'サンダーランド','Sunderland':'サンダーランド',
  'Tottenham Hotspur FC':'トッテナム','Tottenham Hotspur':'トッテナム','Tottenham':'トッテナム',
  'West Ham United FC':'ウェストハム','West Ham United':'ウェストハム','West Ham':'ウェストハム',
  'Wolverhampton Wanderers FC':'ウルブズ','Wolverhampton Wanderers':'ウルブズ','Wolves':'ウルブズ',
  'Burnley FC':'バーンリー','Burnley':'バーンリー',
  'Leicester City FC':'レスター','Leicester City':'レスター',
  'Southampton FC':'サウサンプトン','Southampton':'サウサンプトン',
  'Ipswich Town FC':'イプスウィッチ','Ipswich Town':'イプスウィッチ','イプスウィッチ':'イプスウィッチ',
  'Coventry City FC':'コヴェントリー','Coventry City':'コヴェントリー','コヴェントリー':'コヴェントリー',
  // Spain
  'FC Barcelona':'バルサ','Barcelona':'バルサ','バルセロナ':'バルサ',
  'Real Madrid CF':'レアル','Real Madrid':'レアル','レアル・マドリード':'レアル',
  'Club Atlético de Madrid':'アトレティコ','Atletico Madrid':'アトレティコ','Atlético Madrid':'アトレティコ','アトレティコ・マドリード':'アトレティコ',
  'Athletic Club':'アスレティック','アスレティック・クラブ':'アスレティック',
  'Real Sociedad de Fútbol':'ソシエダ','Real Sociedad':'ソシエダ','レアル・ソシエダ':'ソシエダ',
  'Villarreal CF':'ビジャレアル','Villarreal':'ビジャレアル',
  'Sevilla FC':'セビージャ','Sevilla':'セビージャ',
  'Valencia CF':'バレンシア','Valencia':'バレンシア',
  'Real Betis Balompié':'ベティス','Real Betis':'ベティス',
  'Rayo Vallecano de Madrid':'ラージョ','Rayo Vallecano':'ラージョ','ラージョ・バジェカーノ':'ラージョ',
  'Getafe CF':'ヘタフェ','Getafe':'ヘタフェ',
  'Girona FC':'ジローナ','Girona':'ジローナ',
  'RC Celta de Vigo':'セルタ','Celta Vigo':'セルタ','Celta de Vigo':'セルタ',
  'RCD Mallorca':'マジョルカ','Mallorca':'マジョルカ',
  'CA Osasuna':'オサスナ','Osasuna':'オサスナ',
  'RCD Espanyol de Barcelona':'エスパニョール','RCD Espanyol':'エスパニョール','Espanyol':'エスパニョール',
  'Deportivo Alavés':'アラベス','Alaves':'アラベス','Alavés':'アラベス',
  'Elche CF':'エルチェ','Elche':'エルチェ',
  'Levante UD':'レバンテ','Levante':'レバンテ',
  'Real Oviedo':'オビエド','Real Oviedo CF':'オビエド',
  'UD Las Palmas':'ラス・パルマス','Las Palmas':'ラス・パルマス',
  'Málaga CF':'マラガ','Málaga':'マラガ','マラガ':'マラガ',
  // Germany
  'FC Bayern München':'バイエルン','Bayern München':'バイエルン','Bayern Munich':'バイエルン','バイエルン・ミュンヘン':'バイエルン',
  'Borussia Dortmund':'ドルトムント','Dortmund':'ドルトムント','ボルシア・ドルトムント':'ドルトムント','ドルトムント':'ドルトムント',
  'TSG 1899 Hoffenheim':'ホッフェンハイム','TSG Hoffenheim':'ホッフェンハイム','Hoffenheim':'ホッフェンハイム',
  'Bayer 04 Leverkusen':'レヴァークーゼン','Bayer Leverkusen':'レヴァークーゼン','Leverkusen':'レヴァークーゼン',
  'RB Leipzig':'ライプツィヒ','RasenBallsport Leipzig':'ライプツィヒ',
  'Eintracht Frankfurt':'フランクフルト','Frankfurt':'フランクフルト',
  'VfB Stuttgart':'シュトゥットガルト','Stuttgart':'シュトゥットガルト',
  'SC Freiburg':'フライブルク','Freiburg':'フライブルク',
  '1. FSV Mainz 05':'マインツ','Mainz 05':'マインツ','Mainz':'マインツ',
  'Borussia Mönchengladbach':'ボルシアMG','Borussia Monchengladbach':'ボルシアMG','Mönchengladbach':'ボルシアMG',
  'VfL Wolfsburg':'ヴォルフスブルク','Wolfsburg':'ヴォルフスブルク',
  'SV Werder Bremen':'ブレーメン','Werder Bremen':'ブレーメン','Bremen':'ブレーメン',
  'FC Augsburg':'アウクスブルク','Augsburg':'アウクスブルク',
  '1. FC Union Berlin':'ウニオン・ベルリン','Union Berlin':'ウニオン・ベルリン',
  '1. FC Köln':'ケルン','FC Köln':'ケルン','FC Cologne':'ケルン','Köln':'ケルン',
  'Hamburger SV':'ハンブルク','Hamburg':'ハンブルク',
  'FC St. Pauli 1910':'ザンクト・パウリ','FC St. Pauli':'ザンクト・パウリ','St. Pauli':'ザンクト・パウリ',
  '1. FC Heidenheim 1846':'ハイデンハイム','Heidenheim':'ハイデンハイム',
  'FC Schalke 04':'シャルケ','Schalke 04':'シャルケ','Schalke':'シャルケ','シャルケ':'シャルケ',
  // Italy
  'AC Milan':'ミラン','Milan':'ミラン','ACミラン':'ミラン',
  'FC Internazionale Milano':'インテル','Internazionale':'インテル','Inter Milan':'インテル','Inter':'インテル','インテル':'インテル',
  'Juventus FC':'ユベントス','Juventus':'ユベントス','ユベントス':'ユベントス',
  'Cagliari Calcio':'カリアリ','Cagliari':'カリアリ',
  'SSC Napoli':'ナポリ','Napoli':'ナポリ',
  'AS Roma':'ローマ','Roma':'ローマ',
  'SS Lazio':'ラツィオ','Lazio':'ラツィオ',
  'Atalanta BC':'アタランタ','Atalanta':'アタランタ',
  'Bologna FC 1909':'ボローニャ','Bologna':'ボローニャ',
  'ACF Fiorentina':'フィオレンティーナ','Fiorentina':'フィオレンティーナ',
  'Genoa CFC':'ジェノア','Genoa':'ジェノア',
  'Torino FC':'トリノ','Torino':'トリノ',
  'Udinese Calcio':'ウディネーゼ','Udinese':'ウディネーゼ',
  'Hellas Verona FC':'ヴェローナ','Hellas Verona':'ヴェローナ','Verona':'ヴェローナ',
  'US Lecce':'レッチェ','Lecce':'レッチェ',
  'Parma Calcio 1913':'パルマ','Parma':'パルマ',
  'Como 1907':'コモ','Como':'コモ',
  'US Sassuolo Calcio':'サッスオーロ','Sassuolo':'サッスオーロ',
  'US Cremonese':'クレモネーゼ','Cremonese':'クレモネーゼ',
  'Pisa Sporting Club':'ピサ','Pisa SC':'ピサ','Pisa':'ピサ',
  'Venezia FC':'ヴェネツィア','Venezia':'ヴェネツィア',
  'AC Monza':'モンツァ','Monza':'モンツァ',
  // France
  'Paris Saint-Germain FC':'PSG','Paris Saint-Germain':'PSG','Paris SG':'PSG','パリ・サンジェルマン':'PSG',
  'AS Monaco FC':'モナコ','AS Monaco':'モナコ','Monaco':'モナコ','モナコ':'モナコ',
  'Olympique de Marseille':'マルセイユ','Marseille':'マルセイユ',
  'Olympique Lyonnais':'リヨン','Lyon':'リヨン',
  'LOSC Lille':'リール','Lille OSC':'リール','Lille':'リール',
  'RC Lens':'ランス','Lens':'ランス',
  'OGC Nice':'ニース','Nice':'ニース',
  'Stade Rennais FC 1901':'レンヌ','Stade Rennais':'レンヌ','Rennes':'レンヌ',
  'RC Strasbourg Alsace':'ストラスブール','Strasbourg':'ストラスブール',
  'Toulouse FC':'トゥールーズ','Toulouse':'トゥールーズ',
  'FC Nantes':'ナント','Nantes':'ナント',
  'Stade Brestois 29':'ブレスト','Brest':'ブレスト',
  'AJ Auxerre':'オセール','Auxerre':'オセール',
  'Angers SCO':'アンジェ','Angers':'アンジェ',
  'Le Havre AC':'ル・アーヴル','Le Havre':'ル・アーヴル',
  'FC Lorient':'ロリアン','Lorient':'ロリアン',
  'FC Metz':'メス','Metz':'メス',
  'Paris FC':'パリFC',
  'Stade de Reims':'ランス','Reims':'ランス',
  'AS Saint-Étienne':'サンテティエンヌ','Saint-Étienne':'サンテティエンヌ','Saint-Etienne':'サンテティエンヌ',
  'Montpellier HSC':'モンペリエ','Montpellier':'モンペリエ'
};

const CP_VENUE_DISPLAY_NAMES={
  'Villa Park':'ヴィラ・パーク',
  'PreZero Arena':'プレゼロ・アレーナ',
  'Unipol Domus':'ウニポル・ドムス',
  'Stade Louis II':'スタッド・ルイ・ドゥ',
  'Coventry Building Society Arena':'コヴェントリー・ビルディング・ソサエティ・アリーナ',
  'Portman Road':'ポートマン・ロード',
  'Estadio de Vallecas':'エスタディオ・デ・バジェカス',
  'Campo de Fútbol de Vallecas':'エスタディオ・デ・バジェカス',
  'Allianz Arena':'アリアンツ・アレーナ',
  'Parc des Princes':'パルク・デ・プランス',
  'San Siro':'サン・シーロ','Stadio Giuseppe Meazza':'サン・シーロ',
  'Etihad Stadium':'エティハド・スタジアム','Anfield':'アンフィールド','Emirates Stadium':'エミレーツ・スタジアム',
  'Signal Iduna Park':'ジグナル・イドゥナ・パルク','SIGNAL IDUNA PARK':'ジグナル・イドゥナ・パルク'
};

// Conservative home-ground inference. Only use venues explicitly registered here; unknown opponents remain 会場未定.
const CP_HOME_VENUE_BY_TEAM={
  'アストン・ヴィラ':'ヴィラ・パーク',
  'ホッフェンハイム':'プレゼロ・アレーナ',
  'カリアリ':'ウニポル・ドムス',
  'モナコ':'スタッド・ルイ・ドゥ',
  'コヴェントリー':'コヴェントリー・ビルディング・ソサエティ・アリーナ',
  'イプスウィッチ':'ポートマン・ロード',
  'ラージョ':'エスタディオ・デ・バジェカス',
  'アーセナル':'エミレーツ・スタジアム',
  'リヴァプール':'アンフィールド',
  'マンC':'エティハド・スタジアム',
  'バイエルン':'アリアンツ・アレーナ',
  'PSG':'パルク・デ・プランス',
  'ミラン':'サン・シーロ','インテル':'サン・シーロ',
  'ドルトムント':'ジグナル・イドゥナ・パルク'
};

function cpCanonicalTeamName(name){
  let n=String(name||'').trim();
  if(!n)return'未定';
  return CP_TEAM_DISPLAY_NAMES[n]||n
}
function cpDisplayTeamName(name,small=false){
  let n=cpCanonicalTeamName(name);
  const max=small?7:10;
  return n.length>max?n.slice(0,max-1)+'…':n
}

// Normalize data before it reaches cache/rendering. This fixes provider-English labels and fills only verified away venues.
mapMatch=function(m){
  let out=CP_RG_BASE_MAP_MATCH(m);
  if(!out)return out;
  out.opponentName=cpCanonicalTeamName(out.opponentName);
  if(out.venue&&CP_VENUE_DISPLAY_NAMES[out.venue])out.venue=CP_VENUE_DISPLAY_NAMES[out.venue];
  if((!out.venue||out.venue==='会場未定')&&out.homeAway==='AWAY'){
    out.venue=CP_HOME_VENUE_BY_TEAM[out.opponentName]||'会場未定'
  }
  return out
};

function cpNormalizeOpponentOpt(opt,small=false){
  if(!opt||opt.fallback===club.badge)return opt;
  return {...opt,name:cpDisplayTeamName(opt.name,small)}
}

renderTeamBlock=function(parent,opt){
  if(!cpRgActive())return CP_RG_BASE_RENDER_TEAM(parent,opt);
  return CP_RG_BASE_RENDER_TEAM(parent,cpNormalizeOpponentOpt(opt,false))
};

smallTeamName=function(name,isClub=false){
  if(!cpRgActive())return CP_RG_BASE_SMALL_TEAM_NAME(name,isClub);
  if(isClub)return club.jp||club.short||'';
  return cpDisplayTeamName(name,true)
};

if(CP_RG_BASE_REAL_TEAM){
  cpRealTeamBlock=function(parent,opt,small=false){
    return CP_RG_BASE_REAL_TEAM(parent,cpNormalizeOpponentOpt(opt,small),small)
  }
}
if(CP_RG_BASE_BARCA_TEAM){
  cpBarcelonaTeamBlock=function(parent,opt,small=false){
    return CP_RG_BASE_BARCA_TEAM(parent,cpNormalizeOpponentOpt(opt,small),small)
  }
}

const CP_PILL_METRICS=typeof CP_DESIGN_TOKENS==='object'&&CP_DESIGN_TOKENS.pill?CP_DESIGN_TOKENS.pill:{
  medium:{v:2.5,h:7,font:7.2,r:9,logoBox:24,logoSize:19,gap:5,sideV:6.2},
  small:{v:2.0,h:5,font:7.3,r:9,logoBox:19,logoSize:15,gap:4,sideV:4.8}
};

function cpUnifiedCompetitionPill(parent,m,small=false,barca=false){
  let label=competitionReadable(m,small),z=competitionStyle(label),q=small?CP_PILL_METRICS.small:CP_PILL_METRICS.medium,p=parent.addStack();
  p.layoutHorizontally();p.centerAlignContent();p.setPadding(q.v,q.h,q.v,q.h);p.cornerRadius=q.r;
  p.backgroundColor=C(barca?'#171923':z.bg,barca?.98:.94);p.borderWidth=.8;p.borderColor=C(barca?'#D9DCE5':z.bd,barca?.54:.82);
  let logo=typeof cpCompetitionLogoImage==='function'?cpCompetitionLogoImage(m):null;
  if(logo){
    let plate=p.addStack();plate.size=new Size(q.logoBox,q.logoBox);plate.cornerRadius=q.logoBox/2;plate.backgroundColor=C('#FFFFFF',1);plate.borderWidth=1;plate.borderColor=C('#FFFFFF',1);plate.centerAlignContent();
    let im=plate.addImage(logo);im.imageSize=new Size(q.logoSize,q.logoSize);im.centerAlignImage();
    p.addSpacer(q.gap)
  }
  text(p,label,q.font,true,1,barca?'#FFFFFF':z.fg)
}

competitionPill=function(parent,m,small=false){
  return cpUnifiedCompetitionPill(parent,m,small,false)
};

sidePill=function(parent,m,small=false){
  let q=small?CP_PILL_METRICS.small:CP_PILL_METRICS.medium,p=parent.addStack(),label=sideTag(m);
  p.setPadding(q.sideV,q.h,q.sideV,q.h);p.cornerRadius=q.r;p.backgroundColor=C('#121318',.94);p.borderWidth=.8;p.borderColor=C(club.a,.62);
  text(p,label,q.font,true,1,'#F6F7F9')
};

if(typeof cpBarcelonaCompetitionPill==='function'){
  cpBarcelonaCompetitionPill=function(parent,m,small=false){
    return cpUnifiedCompetitionPill(parent,m,small,true)
  }
}
if(typeof cpBarcelonaSidePill==='function'){
  cpBarcelonaSidePill=function(parent,m,small=false){
    let q=small?CP_PILL_METRICS.small:CP_PILL_METRICS.medium,p=parent.addStack(),label=sideTag(m);
    p.setPadding(q.sideV,q.h,q.sideV,q.h);p.cornerRadius=q.r;p.backgroundColor=C('#11131B',.98);p.borderWidth=.8;p.borderColor=C('#E1BD61',.76);
    text(p,label,q.font,true,1,'#FFFFFF')
  }
}
