export function probeImageBuffer(input){
 const b=Buffer.isBuffer(input)?input:Buffer.from(input);
 if(b.length<4)return{ok:false,format:null,width:0,height:0,reason:'BUFFER_TOO_SMALL'};
 if(b.length>=8&&b.subarray(0,8).equals(Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]))){
  if(b.length<24)return{ok:false,format:'PNG',width:0,height:0,reason:'BUFFER_TOO_SMALL'};
  if(b.toString('ascii',12,16)!=='IHDR')return{ok:false,format:'PNG',width:0,height:0,reason:'PNG_IHDR_MISSING'};
  const width=b.readUInt32BE(16),height=b.readUInt32BE(20);
  return width>0&&height>0?{ok:true,format:'PNG',width,height,reason:null}:{ok:false,format:'PNG',width,height,reason:'PNG_DIMENSIONS_INVALID'};
 }
 if(b[0]===0xff&&b[1]===0xd8){
  let i=2;
  const sof=new Set([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf]);
  while(i+4<b.length){
   if(b[i]!==0xff){i++;continue}
   while(i<b.length&&b[i]===0xff)i++;
   if(i>=b.length)break;
   const marker=b[i++];
   if(marker===0xd9||marker===0xda)break;
   if(marker===0x01||(marker>=0xd0&&marker<=0xd7))continue;
   if(i+2>b.length)break;
   const len=b.readUInt16BE(i);if(len<2||i+len>b.length)break;
   if(sof.has(marker)&&len>=7){
    const height=b.readUInt16BE(i+3),width=b.readUInt16BE(i+5);
    return width>0&&height>0?{ok:true,format:'JPEG',width,height,reason:null}:{ok:false,format:'JPEG',width,height,reason:'JPEG_DIMENSIONS_INVALID'};
   }
   i+=len;
  }
  return{ok:false,format:'JPEG',width:0,height:0,reason:'JPEG_SOF_NOT_FOUND'};
 }
 return{ok:false,format:null,width:0,height:0,reason:'UNSUPPORTED_IMAGE_SIGNATURE'};
}

export async function probeRemoteImage(url,fetchImpl=fetch){
 const r=await fetchImpl(url,{headers:{'User-Agent':'MotorsportHub-HeroProbe/1.0 (non-publishing QA tool)'}});
 if(!r.ok)return{ok:false,url,httpStatus:r.status,contentType:r.headers.get('content-type')||'',bytes:0,width:0,height:0,format:null,reason:`HTTP_${r.status}`};
 const buf=Buffer.from(await r.arrayBuffer()),p=probeImageBuffer(buf);
 return{...p,url,httpStatus:r.status,contentType:r.headers.get('content-type')||'',bytes:buf.length};
}
