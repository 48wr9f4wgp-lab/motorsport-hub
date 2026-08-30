// Club Pulse edge-safe identity patch v1
// Goal: keep the center information zone completely clean while preserving club identity.
// Club colors now live in the inner card base + narrow left/right edge rails. No diagonal line crosses text, logos, VS/score, date or venue.

const CP_EDGE_SAFE_BASE_CARD_BG=cardBg;

(function(){
  const barca=CP_CLUB_THEME_REGISTRY?.[81];
  if(barca){
    // Stronger warm purple identity. Garnet/blue are secondary only.
    barca.cardSurface='#160B32';
    barca.cardPanel='#32165F';
    barca.cardGlow='#54219C';
    barca.linePrimary='#8B5CF6';
    barca.lineSecondary='#BE185D';
    barca.linePrimaryAlpha=.38;
    barca.lineSecondaryAlpha=.25;
  }
})();

function cpEdgeSafeCardGradient(t,mode){
  const base=t.cardSurface||t.panelDeep,
        mid=t.cardPanel||t.panel,
        live=mode==='LIVE'?(t.cardGlow||t.glow):mid,
        a1=t.linePrimaryAlpha??.34,
        a2=t.lineSecondaryAlpha??.22,
        g=new LinearGradient();

  // Horizontal gradient = vertical edge rails. The center ~78% is decoration-free.
  g.startPoint=new Point(0,.5);
  g.endPoint=new Point(1,.5);
  g.colors=[
    C(t.linePrimary,a1*.52),
    C(t.linePrimary,a1),
    C(base),
    C(mid),
    C(live),
    C(mid),
    C(base),
    C(t.lineSecondary,a2),
    C(t.lineSecondary,a2*.52)
  ];
  g.locations=[0,.022,.060,.110,.50,.890,.940,.978,1];
  return g
}

cardBg=function(mode){
  const t=CP_ACTIVE_THEME();
  if(!t||!t.linePrimary||!t.lineSecondary)return CP_EDGE_SAFE_BASE_CARD_BG(mode);
  return cpEdgeSafeCardGradient(t,mode)
};
