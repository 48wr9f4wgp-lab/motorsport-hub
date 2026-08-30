// Club Pulse final polish v2.
// Scope remains narrow: Bayern blue accent visibility and Milan/Juventus contrast via the card background itself.

const CP_FP_BASE_BADGE=badge;
const CP_FP_BASE_SIDE_PILL=sidePill;

badge=function(p,fallback,img,size=28,p1=club.p,p2=club.s,scale=1){
  // Juventus no longer gets a dedicated rescue tile. Milan's lighter gunmetal opponent side provides the contrast.
  if(img&&String(fallback||'').toUpperCase()==='JUV'&&typeof CP_RG_BASE_BADGE==='function'){
    return CP_RG_BASE_BADGE(p,fallback,img,size,p1,p2,scale)
  }
  return CP_FP_BASE_BADGE(p,fallback,img,size,p1,p2,scale)
};

sidePill=function(parent,m,small=false){
  if(club?.team!==5)return CP_FP_BASE_SIDE_PILL(parent,m,small);
  let q=small?CP_PILL_METRICS.small:CP_PILL_METRICS.medium,p=parent.addStack(),label=sideTag(m),t=typeof CP_ACTIVE_THEME==='function'?CP_ACTIVE_THEME():null;
  p.setPadding(q.sideV,q.h,q.sideV,q.h);
  p.cornerRadius=q.r;
  p.backgroundColor=C('#121318',.94);
  p.borderWidth=.9;
  p.borderColor=C(t?.sideBorder||'#2D86D3',.86);
  text(p,label,q.font,true,1,'#F6F7F9')
};
