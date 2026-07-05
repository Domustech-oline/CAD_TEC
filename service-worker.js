const CACHE="solarflow-cadtec-v3"

const FILES=[
"./",
"./index.html",
"./style.css",
"./app.js",
"./manifest.webmanifest",
"./assets/logo.png",
"./icons/icon-192.png",
"./icons/icon-512.png",
"./icons/icon-192-maskable.png",
"./icons/icon-512-maskable.png"
]

self.addEventListener("install",e=>{

e.waitUntil(

caches.open(CACHE).then(cache=>cache.addAll(FILES))

)

})

self.addEventListener("activate",e=>{

e.waitUntil(

caches.keys().then(keys=>

Promise.all(

keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))

)

)

)

})

self.addEventListener("fetch",e=>{

e.respondWith(

caches.match(e.request).then(res=>res||fetch(e.request))

)

})
