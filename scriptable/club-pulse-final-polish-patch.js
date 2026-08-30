// Club Pulse final polish v1.
// Scope is intentionally narrow: Bayern blue accent visibility and a subtler Juventus crest rescue.

const CP_FP_BASE_BADGE=badge;
const CP_FP_BASE_SIDE_PILL=sidePill;

badge=function(p,fallback,img,size=28,p1=club.p,p2=club.s,scale=1){
  if(!img||String(fallback||'').toUpperCase()!=='JUV')return CP_FP_BASE_BADGE(p,fallback,img,size,p1,p2,scale);
  let o=p.addStack();
  o.size=new Size(size+2,size+2);
  o.cornerRadius=Math.max(8,Math.round(size*.20));
  o.backgroundColor=C('#F3F5F8',.045);
  o.borderWidth=.35;
  o.borderColor=C('#FFFFFF',.055);
  o.centerAlignContent();
  let i=o.addStack();
  i.size=new Size(size,size);
  i.cornerRadius=Math.max(7,Math.round(size*.18));
  i.backgroundColor=C('#F6F7F9',.025);
  i.centerAlignContent();
  let im=i.addImage(img),z=Math.round((size-2)*Math.min(scale||1,1));
  im.imageSize=new Size(z,z);
  im.centerAlignImage();
  return o
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
