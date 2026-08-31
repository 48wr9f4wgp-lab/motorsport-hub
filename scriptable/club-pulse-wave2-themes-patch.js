// Club Pulse Wave 2 theme definitions v1.
// Data-driven theme expansion for 29 additional clubs. No club-specific renderer branches.

function cpW2Theme(key,c){
  return {
    key,
    text:c.text||'#F8FAFC',cardText:c.cardText||c.text||'#F8FAFC',
    muted:c.muted||'#D8DEE9',cardMuted:c.cardMuted||c.muted||'#D8DEE9',
    accent:c.accent||'#E6EAF0',accentSoft:c.accentSoft||'#F4F6F8',headerAccent:c.headerAccent||'#E6EAF0',
    surface:'#070A10',glow:c.glow||c.cardGlow,panel:'#0D1420',panelDeep:'#080D17',
    cardSurface:c.cardSurface,cardPanel:c.cardPanel,cardGlow:c.cardGlow,
    border:c.border||c.cardBorder,cardBorder:c.cardBorder,sideBorder:c.sideBorder||c.accent||'#E6EAF0'
  }
}

Object.assign(CP_CLUB_THEME_REGISTRY,{
  // Premier League
  61:cpW2Theme('chelsea',{cardSurface:'#041A45',cardPanel:'#063A86',cardGlow:'#0754B8',cardBorder:'#DBA111',accent:'#DBA111'}),
  73:cpW2Theme('tottenham',{cardSurface:'#0B1734',cardPanel:'#152A55',cardGlow:'#233D70',cardBorder:'#C8D4E8',accent:'#C8D4E8'}),
  67:cpW2Theme('newcastle',{cardSurface:'#0B0D10',cardPanel:'#252A30',cardGlow:'#3C444D',cardBorder:'#41B6E6',accent:'#41B6E6'}),
  58:cpW2Theme('astonvilla',{cardSurface:'#4B0827',cardPanel:'#76113F',cardGlow:'#8A2452',cardBorder:'#95BFE5',accent:'#95BFE5'}),
  62:cpW2Theme('everton',{cardSurface:'#001D5B',cardPanel:'#003399',cardGlow:'#1254B6',cardBorder:'#DDE6F2',accent:'#F8FAFC'}),
  397:cpW2Theme('brighton',{cardSurface:'#003A7A',cardPanel:'#0057B8',cardGlow:'#1474D4',cardBorder:'#FFCD00',accent:'#FFCD00'}),
  563:cpW2Theme('westham',{cardSurface:'#4C1527',cardPanel:'#7A263A',cardGlow:'#8F3C50',cardBorder:'#58B9DD',accent:'#58B9DD'}),

  // LaLiga
  78:cpW2Theme('atletico',{cardSurface:'#5E0B19',cardPanel:'#A70F28',cardGlow:'#C8102E',cardBorder:'#D8DEE9',accent:'#F2F4F7'}),
  77:cpW2Theme('athletic',{cardSurface:'#690C13',cardPanel:'#B51B22',cardGlow:'#EE2523',cardBorder:'#F7F7F5',accent:'#F7F7F5'}),
  92:cpW2Theme('realsociedad',{cardSurface:'#003E72',cardPanel:'#0067B1',cardGlow:'#1686D0',cardBorder:'#E7EEF6',accent:'#D8B44A'}),
  94:cpW2Theme('villarreal',{cardSurface:'#E1BE00',cardPanel:'#F4D500',cardGlow:'#FFE34A',cardBorder:'#16547A',accent:'#16547A',text:'#111418',cardText:'#111418',muted:'#31363C',cardMuted:'#31363C',headerAccent:'#F4F6F8',sideBorder:'#16547A'}),
  559:cpW2Theme('sevilla',{cardSurface:'#6C0A10',cardPanel:'#B3131B',cardGlow:'#D71920',cardBorder:'#F0F0F0',accent:'#F0F0F0'}),
  90:cpW2Theme('betis',{cardSurface:'#004B28',cardPanel:'#007D42',cardGlow:'#009E55',cardBorder:'#E9F4ED',accent:'#E9F4ED'}),

  // Bundesliga
  3:cpW2Theme('leverkusen',{cardSurface:'#4D080A',cardPanel:'#A01116',cardGlow:'#E32221',cardBorder:'#EDEDED',accent:'#EDEDED'}),
  721:cpW2Theme('leipzig',{cardSurface:'#071B3E',cardPanel:'#0D315F',cardGlow:'#B60D3D',cardBorder:'#E4E8EF',accent:'#DD3B67'}),
  19:cpW2Theme('frankfurt',{cardSurface:'#090A0C',cardPanel:'#2B1115',cardGlow:'#B40B18',cardBorder:'#E1000F',accent:'#F3F3F3'}),
  10:cpW2Theme('stuttgart',{cardSurface:'#680A0E',cardPanel:'#B11118',cardGlow:'#E32219',cardBorder:'#F2F2F2',accent:'#F2F2F2'}),
  18:cpW2Theme('gladbach',{cardSurface:'#080B0A',cardPanel:'#17231D',cardGlow:'#0A7041',cardBorder:'#EDEFEF',accent:'#31B86D'}),

  // Serie A
  109:cpW2Theme('juventus',{cardSurface:'#0B0C0F',cardPanel:'#292B31',cardGlow:'#44474F',cardBorder:'#D4AF37',accent:'#D4AF37'}),
  113:cpW2Theme('napoli',{cardSurface:'#075075',cardPanel:'#087FAE',cardGlow:'#12A0D3',cardBorder:'#EAF7FC',accent:'#EAF7FC'}),
  100:cpW2Theme('roma',{cardSurface:'#55121D',cardPanel:'#7F1C2C',cardGlow:'#9A2938',cardBorder:'#F0BC42',accent:'#F0BC42'}),
  110:cpW2Theme('lazio',{cardSurface:'#22546C',cardPanel:'#397C99',cardGlow:'#65B0CE',cardBorder:'#EAF7FC',accent:'#EAF7FC'}),
  102:cpW2Theme('atalanta',{cardSurface:'#050A12',cardPanel:'#083B72',cardGlow:'#0057B8',cardBorder:'#E9EEF5',accent:'#71AEE8'}),
  99:cpW2Theme('fiorentina',{cardSurface:'#31134D',cardPanel:'#512274',cardGlow:'#6A3490',cardBorder:'#D7B03A',accent:'#D7B03A'}),

  // Ligue 1
  516:cpW2Theme('marseille',{cardSurface:'#06476B',cardPanel:'#087FAC',cardGlow:'#00AEEF',cardBorder:'#ECFAFF',accent:'#ECFAFF'}),
  548:cpW2Theme('monaco',{cardSurface:'#650A12',cardPanel:'#B41420',cardGlow:'#E31B23',cardBorder:'#E8D19A',accent:'#E8D19A'}),
  523:cpW2Theme('lyon',{cardSurface:'#0E2453',cardPanel:'#193D7A',cardGlow:'#8A1832',cardBorder:'#EEF2F8',accent:'#EEF2F8'}),
  521:cpW2Theme('lille',{cardSurface:'#640A14',cardPanel:'#A81222',cardGlow:'#D71920',cardBorder:'#B9C8E6',accent:'#DDE5F3'}),
  522:cpW2Theme('nice',{cardSurface:'#120B0D',cardPanel:'#471016',cardGlow:'#B4141E',cardBorder:'#E8E8E8',accent:'#E8E8E8'})
});

// Promote the 29 Wave 2 teams into the canonical readability/presentation contract.
if(typeof CP_STANDARD_TEAM_IDS!=='undefined')for(const id of CP_WAVE2_TEAM_IDS)CP_STANDARD_TEAM_IDS.add(id);

// Keep Small Widget labels Japanese and stable instead of falling back to provider TLAs.
if(typeof CP_SP_SMALL_ALIASES!=='undefined')Object.assign(CP_SP_SMALL_ALIASES,{
  'ニューカッスル':'ニューカッスル',
  'レアル・ソシエダ':'ソシエダ',
  'レヴァークーゼン':'レヴァーク',
  'フランクフルト':'フランク',
  'シュトゥットガルト':'シュトゥット',
  'フィオレンティーナ':'フィオレン'
});

// Current 2026-27 home venue overrides for the newly selectable clubs.
if(typeof CP_HOME_VENUE_BY_TEAM!=='undefined')Object.assign(CP_HOME_VENUE_BY_TEAM,{
  'チェルシー':'スタンフォード・ブリッジ','トッテナム':'トッテナム・ホットスパー・スタジアム','ニューカッスル':'セント・ジェームズ・パーク','アストン・ヴィラ':'ヴィラ・パーク','エヴァートン':'ヒル・ディッキンソン・スタジアム','ブライトン':'アメックス・スタジアム','ウェストハム':'ロンドン・スタジアム',
  'アトレティコ':'メトロポリターノ','アスレティック':'サン・マメス','ソシエダ':'レアレ・アレーナ','ビジャレアル':'エスタディオ・デ・ラ・セラミカ','セビージャ':'ラモン・サンチェス・ピスフアン','ベティス':'ラ・カルトゥハ',
  'レヴァークーゼン':'バイアレーナ','ライプツィヒ':'レッドブル・アレーナ','フランクフルト':'ドイチェ・バンク・パルク','シュトゥットガルト':'MHPアレーナ','ボルシアMG':'ボルシア・パルク',
  'ユベントス':'アリアンツ・スタジアム','ナポリ':'スタディオ・ディエゴ・アルマンド・マラドーナ','ローマ':'スタディオ・オリンピコ','ラツィオ':'スタディオ・オリンピコ','アタランタ':'ニュー・バランス・アリーナ','フィオレンティーナ':'スタディオ・アルテミオ・フランキ',
  'マルセイユ':'オレンジ・ヴェロドローム','モナコ':'スタッド・ルイ・ドゥ','リヨン':'グルパマ・スタジアム','リール':'デカトロン・アレーナ','ニース':'アリアンツ・リヴィエラ'
});

if(typeof CP_VENUE_DISPLAY_NAMES!=='undefined')Object.assign(CP_VENUE_DISPLAY_NAMES,{
  'New Balance Arena':'ニュー・バランス・アリーナ','Gewiss Stadium':'ニュー・バランス・アリーナ',
  'Stadio Diego Armando Maradona':'スタディオ・ディエゴ・アルマンド・マラドーナ',
  'Stadio Olimpico':'スタディオ・オリンピコ','Stadio Artemio Franchi':'スタディオ・アルテミオ・フランキ',
  'Stamford Bridge':'スタンフォード・ブリッジ','Tottenham Hotspur Stadium':'トッテナム・ホットスパー・スタジアム',
  "St. James' Park":'セント・ジェームズ・パーク','Villa Park':'ヴィラ・パーク','London Stadium':'ロンドン・スタジアム',
  'BayArena':'バイアレーナ','Deutsche Bank Park':'ドイチェ・バンク・パルク','BORUSSIA-PARK':'ボルシア・パルク',
  'Groupama Stadium':'グルパマ・スタジアム','Allianz Riviera':'アリアンツ・リヴィエラ'
});
