const CACHE="solarflow-cadtec-v4"

const FILES=[
"./",
"./index.html",
"./style.css",
"./app.js",
"./manifest.webmanifest",
"./logo.png",
"./icon-192.png",
"./icon-512.png",
"./icon-192-maskable.png",
"./icon-512-maskable.png"
]

self.addEventListener("install",e=>{

// Ativa a nova versão imediatamente, sem esperar todas as abas fecharem
self.skipWaiting()

e.waitUntil(

caches.open(CACHE).then(cache=>

// cacheia cada arquivo individualmente: se um falhar, os outros continuam
Promise.all(
FILES.map(url=>cache.add(url).catch(err=>console.warn("Falha ao cachear",url,err)))
)

)

)

})

self.addEventListener("activate",e=>{

e.waitUntil(

(async()=>{

const keys=await caches.keys()

await Promise.all(
keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))
)

// assume o controle das páginas abertas imediatamente
await self.clients.claim()

})()

)

})

self.addEventListener("fetch",e=>{

e.respondWith(

caches.match(e.request).then(res=>res||fetch(e.request))

)

})
