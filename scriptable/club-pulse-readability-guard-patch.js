// Club Pulse readability guard v1.
// Applies only to the four expanded clubs. Keeps the shared visual language simple while preventing
// dark crests and long opponent labels from disappearing on compact widget surfaces.

const CP_READABILITY_EXTRA_TEAMS=new Set([5,524,98,65]);
const CP_READABILITY_RESCUE_BADGES=new Set(['JUV']);
const CP_READABILITY_BASE_BADGE=badge;
const CP_READABILITY_BASE_RENDER_TEAM=renderTeamBlock;
const CP_READABILITY_BASE_SMALL_TEAM_NAME=smallTeamName;

function cpReadabilityIsExtra(){return CP_READABILITY_EXTRA_TEAMS.has(club?.team)}

const CP_TEAM_SHORT_NAMES={
  'マンチェスター・ユナイテッド':'マンU',
  'マンチェスター・シティ':'マンC',
  'パリ・サンジェルマン':'PSG',
  'バイエルン・ミュンヘン':'バイエルン',
  'ACミラン':'ミラン',
  'ラージョ・バジェカーノ':'ラージョ',
  'アトレティコ・マドリード':'アトレティコ',
  'レアル・ソシエダ':'ソシエダ',
  'アスレティック・クラブ':'アスレティック',
  'ノッティンガム・フォレスト':'フォレスト',
  'ニューカッスル・ユナイテッド':'ニューカッスル',
  'ニューカッスル':'ニューカッスル',
  'コヴェントリー':'コヴェントリー',
  'シャルケ':'シャルケ',
  'ユベントス':'ユベントス',
  'モナコ':'モナコ'
};

function cpCompactOpponentName(name,small=false){
  let n=String(name||'').trim();
  if(!n)return'未定';
  n=CP_TEAM_SHORT_NAMES[n]||n;
  let max=small?7:10;
  return n.length>max?n.slice(0,max-1)+'…':n
}

// Low-contrast crest rescue is deliberately selective: no global white circles.
// Dark marks such as Juventus receive a soft cool-gray rounded plate only when needed.
badge=function(p,fallback,img,size=28,p1=club.p,p2=club.s,scale=1){
  if(!cpReadabilityIsExtra()||!img||!CP_READABILITY_RESCUE_BADGES.has(String(fallback||'').toUpperCase())){
    return CP_READABILITY_BASE_BADGE(p,fallback,img,size,p1,p2,scale)
  }
  let o=p.addStack();
  o.size=new Size(size+4,size+4);
  o.cornerRadius=Math.max(9,Math.round(size*.24));
  o.backgroundColor=C('#D7DEE8',.20);
  o.borderWidth=.6;
  o.borderColor=C('#F8FAFC',.18);
  o.centerAlignContent();
  let i=o.addStack();
  i.size=new Size(size,size);
  i.cornerRadius=Math.max(8,Math.round(size*.20));
  i.backgroundColor=C('#CBD5E1',.24);
  i.centerAlignContent();
  let im=i.addImage(img),z=Math.round((size-5)*Math.min(scale||1,1));
  im.imageSize=new Size(z,z);
  im.centerAlignImage();
  return o
};

// Medium labels use stable Japanese short names instead of letting arbitrary provider strings shrink to unreadable text.
renderTeamBlock=function(parent,opt){
  if(!cpReadabilityIsExtra()||opt?.fallback===club.badge)return CP_READABILITY_BASE_RENDER_TEAM(parent,opt);
  let next={...opt,name:cpCompactOpponentName(opt?.name,false)};
  return CP_READABILITY_BASE_RENDER_TEAM(parent,next)
};

smallTeamName=function(name,isClub=false){
  if(!cpReadabilityIsExtra())return CP_READABILITY_BASE_SMALL_TEAM_NAME(name,isClub);
  if(isClub)return club.jp||club.short||'';
  return cpCompactOpponentName(name,true)
};
