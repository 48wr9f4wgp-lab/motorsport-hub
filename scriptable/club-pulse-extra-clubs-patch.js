// Club Pulse extra club registry v1.
// Injected before core parameter resolution. Adds Bayern, PSG, AC Milan, and Manchester City without touching the frozen core.

CLUBS.bayern={
  id:'bayern',team:5,comp:'BL1',
  name:'バイエルン・ミュンヘン',short:'FCB',jp:'バイエルン',badge:'FCB',league:'ブンデスリーガ',
  p:'#DC052D',s:'#8B0B1E',a:'#FFFFFF',
  venue:'アリアンツ・アレーナ',liveSearch:'Bayern Munich'
};

CLUBS.psg={
  id:'psg',team:524,comp:'FL1',
  name:'パリ・サンジェルマン',short:'PSG',jp:'PSG',badge:'PSG',league:'リーグ・アン',
  p:'#001E62',s:'#004170',a:'#DA291C',
  venue:'パルク・デ・プランス',liveSearch:'Paris Saint Germain'
};

CLUBS.milan={
  id:'milan',team:98,comp:'SA',
  name:'ACミラン',short:'MIL',jp:'ミラン',badge:'MIL',league:'セリエA',
  p:'#111111',s:'#8A1018',a:'#F2F2F2',
  venue:'サン・シーロ',liveSearch:'AC Milan'
};

CLUBS.mancity={
  id:'mancity',team:65,comp:'PL',
  name:'マンチェスター・シティ',short:'MCI',jp:'マンC',badge:'MCI',league:'プレミアリーグ',
  p:'#6CABDD',s:'#1C2C5B',a:'#FFFFFF',
  venue:'エティハド・スタジアム',liveSearch:'Manchester City'
};

Object.assign(ALIASES,{
  bayern:'bayern',fcbayern:'bayern','bayern-munich':'bayern',munich:'bayern',
  psg:'psg',paris:'psg','paris-saint-germain':'psg',
  milan:'milan',acmilan:'milan','ac-milan':'milan',
  city:'mancity',mancity:'mancity',mci:'mancity','man-city':'mancity'
});

Object.assign(CREST_SCALE,{5:1.02,524:1.00,98:1.00,65:1.02});
Object.assign(COMP,{BL1:'ブンデスリーガ',FL1:'リーグ・アン',SA:'セリエA'});

Object.assign(JP,{
  'FC Bayern München':'バイエルン・ミュンヘン','Bayern München':'バイエルン・ミュンヘン','Bayern Munich':'バイエルン・ミュンヘン',
  'Paris Saint-Germain FC':'パリ・サンジェルマン','Paris Saint-Germain':'パリ・サンジェルマン','Paris SG':'パリ・サンジェルマン',
  'AC Milan':'ACミラン','Milan':'ACミラン',
  'Manchester City FC':'マンチェスター・シティ','Manchester City':'マンチェスター・シティ'
});

Object.assign(VEN,{
  'Allianz Arena':'アリアンツ・アレーナ',
  'Parc des Princes':'パルク・デ・プランス',
  'Stadio Giuseppe Meazza':'サン・シーロ','San Siro':'サン・シーロ',
  'Etihad Stadium':'エティハド・スタジアム'
});
