// Club Pulse multi-club registry extension.
// Injected before parameter resolution so new clubs are selectable without editing the frozen core.

CLUBS.barcelona={
  id:'barcelona',team:81,comp:'PD',
  name:'バルセロナ',short:'BAR',jp:'バルサ',badge:'FCB',league:'ラ・リーガ',
  p:'#A50044',s:'#0B2D72',a:'#EDBB00',
  venue:'カンプ・ノウ',liveSearch:'Barcelona'
};

CLUBS.realmadrid={
  id:'realmadrid',team:86,comp:'PD',
  name:'レアル・マドリード',short:'RMA',jp:'レアル',badge:'RMA',league:'ラ・リーガ',
  p:'#F4F4F4',s:'#172A62',a:'#D9B85B',
  venue:'サンティアゴ・ベルナベウ',liveSearch:'Real Madrid'
};

Object.assign(ALIASES,{
  barca:'barcelona',fcb:'barcelona',barcelonafc:'barcelona',
  real:'realmadrid',rma:'realmadrid',madrid:'realmadrid','real-madrid':'realmadrid',realmadridcf:'realmadrid'
});

Object.assign(CREST_SCALE,{81:.91,86:.92});

Object.assign(VEN,{
  'Camp Nou':'カンプ・ノウ',
  'Spotify Camp Nou':'カンプ・ノウ',
  'Estadi Olímpic Lluís Companys':'エスタディ・オリンピック・リュイス・コンパニス',
  'Estadio Santiago Bernabéu':'サンティアゴ・ベルナベウ',
  'Santiago Bernabéu':'サンティアゴ・ベルナベウ',
  'Santiago Bernabeu':'サンティアゴ・ベルナベウ'
});
