(async()=>{try{
 const pass=prompt("Nhập mật khẩu:");
 if(pass===null)return;
 const keyBuf=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(pass));
 const key=new Uint8Array(keyBuf);
 function b64t(s){const r=atob(s);const a=new Uint8Array(r.length);for(let i=0;i<r.length;i++)a[i]=r.charCodeAt(i);return a;}
 if(!window.__NAZ_PAYLOAD)return alert("Missing payload");
 const enc=b64t(window.__NAZ_PAYLOAD);
 const out=new Uint8Array(enc.length);
 for(let i=0;i<enc.length;i++) out[i]=enc[i]^key[i%key.length];
 const digest=await crypto.subtle.digest('SHA-256',out);
 const hex=Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,'0')).join('');
 if(hex!==window.__NAZ_PAYLOAD_CHECK) return alert("Sai mật khẩu hoặc payload lỗi");
 // decompress
 function inflate(arr){
   // minimal JS inflate via pako isn't available; rely on TextDecoder if plain
   // fallback: use CompressionStream if supported
   try{
     const cs=new DecompressionStream('deflate');
     const blob=new Blob([arr]);
     return blob.stream().pipeThrough(cs).getReader().read().then(res=>res.value);
   }catch(e){alert("Trình duyệt không hỗ trợ giải nén.");throw e;}
 }
 const dec=await inflate(out);
 const code=new TextDecoder().decode(dec);
 const s=document.createElement('script');s.text=code;document.body.appendChild(s);
}catch(e){console.error(e);alert("Lỗi: "+e);}})();
