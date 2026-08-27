const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
export const VEHICLE_CLASSES=new Set(['car','truck','motorcycle','bus','bicycle']);
const classWeight={car:1,truck:1,motorcycle:1,bus:.92,bicycle:.82};
export function choosePrimaryDetection(predictions,imageWidth,imageHeight,{minScore=.32}={}){
  const imageArea=Math.max(1,imageWidth*imageHeight);
  const candidates=(predictions||[]).filter(p=>VEHICLE_CLASSES.has(String(p.class||''))&&Number(p.score)>=minScore&&Array.isArray(p.bbox)&&p.bbox.length===4).map(p=>{
    const [x,y,w,h]=p.bbox.map(Number),area=Math.max(0,w)*Math.max(0,h),areaFraction=area/imageArea;
    const rankScore=Number(p.score)*(classWeight[p.class]||.8)*(.62+.38*Math.min(1,Math.sqrt(Math.max(0,areaFraction)/.08)));
    return{...p,bbox:[x,y,w,h],areaFraction,rankScore};
  }).filter(p=>p.bbox.every(Number.isFinite)&&p.bbox[2]>1&&p.bbox[3]>1);
  candidates.sort((a,b)=>b.rankScore-a.rankScore||b.score-a.score||b.areaFraction-a.areaFraction);
  return candidates[0]||null;
}
function containedCrop(imageWidth,imageHeight,bbox,aspect,{minContextWidthFraction=.5,subjectX=.69,margin=.16}={}){
  const [bx,by,bw,bh]=bbox,bCx=bx+bw/2,bCy=by+bh/2;
  let cw=Math.max(imageWidth*minContextWidthFraction,bw*(1+2*margin),bh*(1+2*margin)*aspect),ch=cw/aspect;
  if(ch>imageHeight){ch=imageHeight;cw=ch*aspect}
  if(cw>imageWidth){cw=imageWidth;ch=cw/aspect}
  let x=clamp(bCx-subjectX*cw,0,imageWidth-cw),y=clamp(bCy-.5*ch,0,imageHeight-ch);
  const padX=Math.min(bw*margin,cw*.08),padY=Math.min(bh*margin,ch*.08);
  if(bx-padX<x)x=clamp(bx-padX,0,imageWidth-cw);
  if(bx+bw+padX>x+cw)x=clamp(bx+bw+padX-cw,0,imageWidth-cw);
  if(by-padY<y)y=clamp(by-padY,0,imageHeight-ch);
  if(by+bh+padY>y+ch)y=clamp(by+bh+padY-ch,0,imageHeight-ch);
  return{x,y,w:cw,h:ch};
}
const intersectionArea=(a,b)=>{const x1=Math.max(a.x,b.x),y1=Math.max(a.y,b.y),x2=Math.min(a.x+a.w,b.x+b.w),y2=Math.min(a.y+a.h,b.y+b.h);return Math.max(0,x2-x1)*Math.max(0,y2-y1)};
export function makeSceneFallbackCrop(imageWidth,imageHeight,family,{focusX=.58,focusY=.55}={}){
  const aspect=family==='small'?1:1380/640;
  let cw=imageWidth,ch=cw/aspect;
  if(ch>imageHeight){ch=imageHeight;cw=ch*aspect}
  const cx=clamp(Number(focusX)||.5,0,1)*imageWidth,cy=clamp(Number(focusY)||.5,0,1)*imageHeight;
  const x=clamp(cx-cw/2,0,imageWidth-cw),y=clamp(cy-ch/2,0,imageHeight-ch);
  return{family,role:'ENVIRONMENT',crop:{x,y,w:cw,h:ch},normalized:{x:x/imageWidth,y:y/imageHeight,w:cw/imageWidth,h:ch/imageHeight},subjectFraction:null,textSafeScore:null,sourceSubjectFraction:null,detectionScore:null,fallbackMode:'SCENE_FOCUS'};
}
export function makeCrop(imageWidth,imageHeight,detection,family,{textSafeLeft=.42,role='ACTION',subjectX=.69}={}){
  if(!detection)return null;
  const [x,y,w,h]=detection.bbox,aspect=family==='small'?1:1380/640;
  const minContextWidthFraction=role==='ENVIRONMENT'?(family==='small'?.64:.82):role==='IDENTITY'?(family==='small'?.46:.67):(family==='small'?.52:.72);
  const crop=containedCrop(imageWidth,imageHeight,[x,y,w,h],aspect,{minContextWidthFraction,subjectX});
  const subject={x,y,w,h},safe={x:crop.x,y:crop.y,w:crop.w*textSafeLeft,h:crop.h};
  const subjectArea=Math.max(1,w*h),visibleSubjectArea=intersectionArea(subject,crop),subjectFraction=clamp(visibleSubjectArea/Math.max(1,crop.w*crop.h),0,1),safeOverlap=intersectionArea(subject,safe)/subjectArea,textSafeScore=clamp(1-safeOverlap,0,1);
  const normalized={x:crop.x/imageWidth,y:crop.y/imageHeight,w:crop.w/imageWidth,h:crop.h/imageHeight};
  return{family,role,crop,normalized,subjectFraction,textSafeScore,sourceSubjectFraction:detection.areaFraction??subjectArea/(imageWidth*imageHeight),detectionScore:Number(detection.score)||0};
}
export function evaluateCropForRole(crop,rolePolicy){
  if(!crop)return{pass:false,reasons:['NO_VEHICLE_DETECTION'],rawTextSafeScore:null,effectiveTextSafeScore:null,veilCompensation:0};
  const reasons=[],minSubject=crop.family==='small'?Number(rolePolicy.minSmallSubjectFraction):Number(rolePolicy.minMediumSubjectFraction),veilCompensation=clamp(Number(rolePolicy.veilCompensation)||0,0,.35),rawTextSafeScore=Number(crop.textSafeScore),effectiveTextSafeScore=clamp(rawTextSafeScore+veilCompensation,0,1);
  if(crop.subjectFraction<minSubject)reasons.push('SUBJECT_TOO_SMALL');
  if(effectiveTextSafeScore<Number(rolePolicy.minTextSafeScore))reasons.push('TEXT_SAFE_VIOLATION');
  if(crop.detectionScore<.32)reasons.push('DETECTION_CONFIDENCE_LOW');
  return{pass:reasons.length===0,reasons,rawTextSafeScore,effectiveTextSafeScore,veilCompensation};
}
export function evaluateDetectionAcrossRoles({predictions,imageWidth,imageHeight,roles,minScore=.32,textSafeLeft=.42,subjectX=.69}){
  const detection=choosePrimaryDetection(predictions,imageWidth,imageHeight,{minScore});
  if(!detection)return{detection:null,roles:Object.fromEntries((roles||[]).map(r=>[r.id,{pass:false,reasons:['NO_VEHICLE_DETECTION']}]))};
  const out={};
  for(const r of roles||[]){
    const small=makeCrop(imageWidth,imageHeight,detection,'small',{role:r.id,textSafeLeft,subjectX}),medium=makeCrop(imageWidth,imageHeight,detection,'medium',{role:r.id,textSafeLeft,subjectX});
    const se=evaluateCropForRole(small,r),me=evaluateCropForRole(medium,r);
    if(small)small.effectiveTextSafeScore=se.effectiveTextSafeScore;
    if(medium)medium.effectiveTextSafeScore=me.effectiveTextSafeScore;
    out[r.id]={pass:se.pass&&me.pass,reasons:[...new Set([...se.reasons,...me.reasons])],small,medium,smallEvaluation:se,mediumEvaluation:me};
  }
  return{detection,roles:out};
}
