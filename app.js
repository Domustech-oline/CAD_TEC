const ACCESS_CODE="1234"

const EDIT_PASSWORD="76531"

// ⚠️ COLE AQUI A URL DO SEU APP SCRIPT (Google Sheets), depois de publicar
// Exemplo: "https://script.google.com/macros/s/AKfycb.../exec"
const GOOGLE_SCRIPT_URL="https://script.google.com/macros/s/AKfycbynw4phoFOgst5uRxuFzo38SUkzs0X5rcRHWH7D_kcHnoEm0I0mivQPmi9Kv5sx48Ph/exec"

const COLORS={
navyDark:[13,27,42],   // #0D1B2A
navy:[27,38,59],       // #1B263B
yellow:[244,196,48],   // #F4C430
blueLight:[93,173,226],// #5DADE2
green:[40,167,69],     // #28A745
grayLight:[242,242,242]// #F2F2F2
}

// ===== STATUS =====

const STATUS_LIST=[
{label:"Cadastro recebido",hex:"#2196F3",rgb:[33,150,243],textDark:false},
{label:"Em análise",hex:"#FFC107",rgb:[255,193,7],textDark:true},
{label:"Aguardando aprovação da distribuidora",hex:"#FF9800",rgb:[255,152,0],textDark:true},
{label:"Ativo",hex:"#4CAF50",rgb:[76,175,80],textDark:false},
{label:"Cancelado",hex:"#F44336",rgb:[244,67,54],textDark:false}
]

const DEFAULT_STATUS=STATUS_LIST[0].label

function getStatusInfo(label){

return STATUS_LIST.find(s=>s.label===label)||STATUS_LIST[0]

}

// ===== TELAS =====

const loginScreen=document.getElementById("login-screen")
const mainScreen=document.getElementById("main-screen")
const acompanhamentoScreen=document.getElementById("acompanhamento-screen")
const appNav=document.getElementById("app-nav")

const navCadastroBtn=document.getElementById("nav-cadastro")
const navAcompanhamentoBtn=document.getElementById("nav-acompanhamento")

function show(screen){

loginScreen.classList.remove("active")
mainScreen.classList.remove("active")
acompanhamentoScreen.classList.remove("active")

screen.classList.add("active")

window.scrollTo(0,0)

}

function goToCadastro(){

show(mainScreen)

navCadastroBtn.classList.add("active")
navAcompanhamentoBtn.classList.remove("active")

}

function goToAcompanhamento(){

show(acompanhamentoScreen)

navAcompanhamentoBtn.classList.add("active")
navCadastroBtn.classList.remove("active")

carregarAcompanhamento()

}

navCadastroBtn.addEventListener("click",goToCadastro)
navAcompanhamentoBtn.addEventListener("click",goToAcompanhamento)

document.getElementById("login-form").addEventListener("submit",e=>{

e.preventDefault()

const code=document.getElementById("access-code").value

if(code===ACCESS_CODE){

appNav.classList.add("visible")

goToCadastro()

}else{

document.getElementById("login-error").textContent="Código inválido"

}

})

// RELÓGIO NO CABEÇALHO

function updateHeaderClock(){

const now=new Date()

const dateEl=document.getElementById("header-date")
const timeEl=document.getElementById("header-time")

if(dateEl)dateEl.textContent=now.toLocaleDateString("pt-BR")
if(timeEl)timeEl.textContent=now.toLocaleTimeString("pt-BR")

}

updateHeaderClock()
setInterval(updateHeaderClock,1000)

// ===== ACCORDION (Dados do Cliente / Equipamentos / Disjuntores) =====

const accordionToggles=document.querySelectorAll(".accordion-toggle")

function setAccordion(toggle,open){

const target=document.getElementById(toggle.dataset.target)

if(open){

toggle.classList.add("active")
target.classList.add("open")

}else{

toggle.classList.remove("active")
target.classList.remove("open")

}

}

accordionToggles.forEach(toggle=>{

toggle.addEventListener("click",()=>{

const isOpen=toggle.classList.contains("active")

setAccordion(toggle,!isOpen)

})

})

function openAccordionOf(inputId){

const input=document.getElementById(inputId)

if(!input)return

const content=input.closest(".accordion-content")

if(!content)return

const toggle=document.querySelector(`.accordion-toggle[data-target="${content.id}"]`)

if(toggle)setAccordion(toggle,true)

}

// NAVEGAÇÃO ENTRE ETAPAS (DADOS -> DOCUMENTOS)

const stepDados=document.getElementById("step-dados")
const stepAnexos=document.getElementById("step-anexos")
const stepper1=document.getElementById("stepper-1")
const stepper2=document.getElementById("stepper-2")

function goToStep(step){

if(step===2){

openAccordionOf("cliente")

if(!document.getElementById("cliente").reportValidity())return

stepDados.classList.remove("active")
stepAnexos.classList.add("active")

stepper1.classList.remove("active")
stepper2.classList.add("active")

}else{

stepAnexos.classList.remove("active")
stepDados.classList.add("active")

stepper2.classList.remove("active")
stepper1.classList.add("active")

}

document.getElementById("main-screen").scrollTo?.(0,0)
window.scrollTo(0,0)

}

document.getElementById("go-to-anexos").addEventListener("click",()=>goToStep(2))
document.getElementById("back-to-dados").addEventListener("click",()=>goToStep(1))

function getForm(){

return{

data:new Date().toLocaleDateString("pt-BR"),

cliente:document.getElementById("cliente").value,
telefone:document.getElementById("telefone").value,
email:document.getElementById("email").value,
cpf:document.getElementById("cpf").value,
rg:document.getElementById("rg").value,

inversorModelo:document.getElementById("inversor-modelo").value,
inversorQtd:document.getElementById("inversor-qtd").value,

moduloModelo:document.getElementById("modulo-modelo").value,
moduloQtd:document.getElementById("modulo-qtd").value,

disjuntorPdeCorrente:document.getElementById("disjuntor-pde-corrente").value,
disjuntorPdeTipo:document.getElementById("disjuntor-pde-tipo").value,

disjuntorInvCorrente:document.getElementById("disjuntor-inv-corrente").value,
disjuntorInvTipo:document.getElementById("disjuntor-inv-tipo").value

}

}

function preencherForm(data){

document.getElementById("cliente").value=data.cliente||""
document.getElementById("telefone").value=data.telefone||""
document.getElementById("email").value=data.email||""
document.getElementById("cpf").value=data.cpf||""
document.getElementById("rg").value=data.rg||""

document.getElementById("inversor-modelo").value=data.inversorModelo||""
document.getElementById("inversor-qtd").value=data.inversorQtd||""

document.getElementById("modulo-modelo").value=data.moduloModelo||""
document.getElementById("modulo-qtd").value=data.moduloQtd||""

document.getElementById("disjuntor-pde-corrente").value=data.disjuntorPdeCorrente||""
document.getElementById("disjuntor-pde-tipo").value=data.disjuntorPdeTipo||"Monofásico"

document.getElementById("disjuntor-inv-corrente").value=data.disjuntorInvCorrente||""
document.getElementById("disjuntor-inv-tipo").value=data.disjuntorInvTipo||"Monofásico"

}

function getAllImages(){

const inputs=document.querySelectorAll("input[type=file]")

let files=[]

inputs.forEach(input=>{

const label=input.dataset.label||"Anexo"

for(let i=0;i<input.files.length;i++){

files.push({file:input.files[i],label:label})

}

})

return files

}

function compressImage(file){

return new Promise((resolve,reject)=>{

const reader=new FileReader()

reader.onerror=()=>reject(new Error(`Falha ao ler o arquivo ${file.name}`))

reader.onload=e=>{

const img=new Image()

img.onerror=()=>reject(new Error(`Arquivo inválido (não é uma imagem legível): ${file.name}`))

img.onload=()=>{

const canvas=document.createElement("canvas")

let width=img.width
let height=img.height

const maxWidth=1200

if(width>maxWidth){

height*=maxWidth/width
width=maxWidth

}

canvas.width=width
canvas.height=height

const ctx=canvas.getContext("2d")

ctx.drawImage(img,0,0,width,height)

resolve({data:canvas.toDataURL("image/jpeg",0.7),width,height})

}

img.src=e.target.result

}

reader.readAsDataURL(file)

})

}

function loadImageAsBase64(url){

return new Promise((resolve,reject)=>{

const img=new Image()

img.crossOrigin="anonymous"

img.onload=()=>{

const canvas=document.createElement("canvas")

canvas.width=img.width
canvas.height=img.height

const ctx=canvas.getContext("2d")

ctx.drawImage(img,0,0)

resolve({data:canvas.toDataURL("image/png"),width:img.width,height:img.height})

}

img.onerror=reject

img.src=url

})

}

function drawHeader(doc,logo,dataStr){

const pageWidth=210

doc.setFillColor(...COLORS.navyDark)
doc.rect(0,0,pageWidth,26,"F")

doc.setFillColor(...COLORS.yellow)
doc.rect(0,26,pageWidth,1.5,"F")

if(logo){

const logoH=16
const logoW=logo.width*(logoH/logo.height)

doc.addImage(logo.data,"PNG",10,5,logoW,logoH)

}

doc.setTextColor(255,255,255)
doc.setFontSize(9)
doc.text(`Data: ${dataStr}`,200,15,{align:"right"})

}

function drawFooter(doc,pageLabel){

doc.setDrawColor(...COLORS.grayLight)
doc.setFillColor(...COLORS.grayLight)
doc.rect(0,283,210,14,"F")

doc.setTextColor(...COLORS.navy)
doc.setFontSize(8.5)
doc.text("SolarFlow  |  Projetos que geram energia",10,291)

if(pageLabel){

doc.text(pageLabel,200,291,{align:"right"})

}

}

function sectionTitle(doc,text,y){

doc.setFillColor(...COLORS.navy)
doc.roundedRect(10,y-5.5,190,8,1.5,1.5,"F")

doc.setTextColor(255,255,255)
doc.setFont(undefined,"bold")
doc.setFontSize(10.5)
doc.text(text.toUpperCase(),14,y)

doc.setFont(undefined,"normal")

return y+12

}

function campo(doc,label,valor,x,y,labelWidth){

doc.setTextColor(...COLORS.navy)
doc.setFont(undefined,"bold")
doc.setFontSize(10.5)
doc.text(label,x,y)

doc.setTextColor(20,20,20)
doc.setFont(undefined,"normal")
doc.text(valor?String(valor):"-",x+labelWidth,y)

}

function drawStatusBadge(doc,status,x,y){

const info=getStatusInfo(status)

doc.setFont(undefined,"bold")
doc.setFontSize(9.5)

const textWidth=doc.getTextWidth(info.label.toUpperCase())
const boxWidth=textWidth+10
const boxHeight=7

doc.setFillColor(...info.rgb)
doc.roundedRect(x,y-5.2,boxWidth,boxHeight,3,3,"F")

if(info.textDark){
doc.setTextColor(...COLORS.navyDark)
}else{
doc.setTextColor(255,255,255)
}

doc.text(info.label.toUpperCase(),x+5,y)

doc.setFont(undefined,"normal")

return boxWidth

}

function desenharDadosCliente(doc,data,y,mostrarStatus){

y=sectionTitle(doc,"Dados do Cliente",y)

campo(doc,"Cliente:",data.cliente,14,y,32)

if(mostrarStatus){

doc.setTextColor(...COLORS.navy)
doc.setFont(undefined,"bold")
doc.setFontSize(10.5)
doc.text("Status:",140,y)
doc.setFont(undefined,"normal")

drawStatusBadge(doc,data.status||DEFAULT_STATUS,157,y)

}

y+=8
campo(doc,"Telefone:",data.telefone,14,y,32)
campo(doc,"Email:",data.email,110,y,20)
y+=8
campo(doc,"CPF:",data.cpf,14,y,32)
campo(doc,"RG:",data.rg,110,y,20)
y+=14

return y

}

function desenharEquipamentos(doc,data,y){

y=sectionTitle(doc,"Equipamentos",y)

campo(doc,"Inversor:",data.inversorModelo,14,y,32)
campo(doc,"Qtd.:",data.inversorQtd,140,y,15)
y+=8
campo(doc,"Módulo:",data.moduloModelo,14,y,32)
campo(doc,"Qtd.:",data.moduloQtd,140,y,15)
y+=14

return y

}

function desenharAnexosLinks(doc,anexos,y){

if(!anexos||!anexos.length)return y

y=sectionTitle(doc,"Anexos (toque para abrir)",y)

anexos.forEach(anexo=>{

if(y>270)return // evita sobrepor o rodapé

doc.setTextColor(...COLORS.blueLight)
doc.setFont(undefined,"bold")
doc.setFontSize(10)
doc.textWithLink(`🔗 ${anexo.label}`,14,y,{url:anexo.url})
doc.setFont(undefined,"normal")

y+=8

})

return y+4

}

function desenharDisjuntores(doc,data,y){

y=sectionTitle(doc,"Disjuntores",y)

campo(doc,"PDE - Corrente:",data.disjuntorPdeCorrente?`${data.disjuntorPdeCorrente} A`:"-",14,y,40)
campo(doc,"Tipo:",data.disjuntorPdeTipo,140,y,18)
y+=8
campo(doc,"Inversor - Corrente:",data.disjuntorInvCorrente?`${data.disjuntorInvCorrente} A`:"-",14,y,45)
campo(doc,"Tipo:",data.disjuntorInvTipo,150,y,18)
y+=14

return y

}

async function gerarPDF(){

const btn=document.getElementById("generate-pdf")
const originalText=btn.textContent

btn.disabled=true
btn.textContent="Gerando..."

try{

const {jsPDF}=window.jspdf

const doc=new jsPDF()

const data=getForm()

let logo=null

try{

logo=await loadImageAsBase64("logo.png")

}catch(err){

logo=null

}

drawHeader(doc,logo,data.data)
drawFooter(doc,"Página 1")

doc.setTextColor(...COLORS.navyDark)
doc.setFontSize(17)
doc.setFont(undefined,"bold")
doc.text("Cadastro de Projeto",10,40)
doc.setFont(undefined,"normal")

let y=54

const statusAtual=window.editingRecord?window.editingRecord.status:DEFAULT_STATUS

data.status=statusAtual

y=desenharDadosCliente(doc,data,y,true)
y=desenharEquipamentos(doc,data,y)
y=desenharDisjuntores(doc,data,y)

doc.setDrawColor(...COLORS.blueLight)
doc.setLineWidth(0.6)
doc.line(10,y,200,y)

// IMAGENS AGRUPADAS POR ANEXO
const images=getAllImages()

let pageCount=1

const failedFiles=[]

const anexosPayload=[]

for(const item of images){

let compressed

try{

compressed=await compressImage(item.file)

}catch(err){

console.warn(err)
failedFiles.push(item.file.name)
continue

}

const {data:base64,width,height}=compressed

anexosPayload.push({label:item.label,data:base64})

doc.addPage()
pageCount++

drawHeader(doc,logo,data.data)
drawFooter(doc,`Página ${pageCount}`)

doc.setTextColor(...COLORS.navyDark)
doc.setFontSize(13)
doc.setFont(undefined,"bold")
doc.text(item.label,10,40)
doc.setFont(undefined,"normal")

doc.setDrawColor(...COLORS.yellow)
doc.setLineWidth(0.8)
doc.line(10,44,200,44)

const maxW=190
const maxH=225

let imgW=maxW
let imgH=height*(imgW/width)

if(imgH>maxH){

imgH=maxH
imgW=width*(imgH/height)

}

const imgX=10+(maxW-imgW)/2

doc.addImage(base64,"JPEG",imgX,52,imgW,imgH)

}

doc.save(`${data.cliente||"projeto"}.pdf`)

// ===== SALVAR / ATUALIZAR REGISTRO =====

if(window.editingRecord){

const updated={...window.editingRecord,...data,status:statusAtual}

if(anexosPayload.length){

updated.anexos=anexosPayload

}else{

delete updated.anexos

}

await enviarParaPlanilha({action:"update",data:updated})

window.editingRecord=null

document.getElementById("edit-banner").style.display="none"

}else{

const novo={

id:gerarId(),
...data,
status:DEFAULT_STATUS,
criadoEm:new Date().toISOString(),
anexos:anexosPayload

}

await enviarParaPlanilha({action:"create",data:novo})

}

document.getElementById("project-form").reset()

goToStep(1)

window.scrollTo(0,0)

if(failedFiles.length){

alert(`PDF gerado, mas os seguintes arquivos não puderam ser incluídos (formato inválido):\n${failedFiles.join(", ")}`)

}

}catch(err){

console.error(err)
alert("Ocorreu um erro ao gerar o PDF. Tente novamente.")

}finally{

btn.disabled=false
btn.textContent=originalText

}

}

document.getElementById("generate-pdf").onclick=gerarPDF

document.getElementById("cancel-edit-btn").addEventListener("click",()=>{

window.editingRecord=null

document.getElementById("edit-banner").style.display="none"

document.getElementById("project-form").reset()

goToStep(1)

goToAcompanhamento()

})

// ===== ID LOCAL =====

function gerarId(){

return `${Date.now()}-${Math.random().toString(36).slice(2,9)}`

}

// ===== MODAL GENÉRICO =====

const modalOverlay=document.getElementById("modal-overlay")
const modalTitle=document.getElementById("modal-title")
const modalBody=document.getElementById("modal-body")

function closeModal(){

modalOverlay.classList.remove("visible")
modalBody.innerHTML=""

}

function openModal(title){

modalTitle.textContent=title
modalOverlay.classList.add("visible")

}

modalOverlay.addEventListener("click",e=>{

if(e.target===modalOverlay)closeModal()

})

function pedirSenha(titulo){

return new Promise(resolve=>{

openModal(titulo)

modalBody.innerHTML=`

<label>Digite a senha</label>
<input type="password" id="modal-senha-input" placeholder="Senha">
<p class="modal-error" id="modal-senha-erro"></p>

<div class="modal-actions">
<button type="button" class="modal-cancel-btn" id="modal-senha-cancelar">Cancelar</button>
<button type="button" id="modal-senha-confirmar">Confirmar</button>
</div>

`

const input=document.getElementById("modal-senha-input")
const erro=document.getElementById("modal-senha-erro")

input.focus()

function confirmar(){

if(input.value===EDIT_PASSWORD){

closeModal()
resolve(true)

}else{

erro.textContent="Senha incorreta"

}

}

document.getElementById("modal-senha-confirmar").addEventListener("click",confirmar)

input.addEventListener("keydown",e=>{

if(e.key==="Enter"){

e.preventDefault()
confirmar()

}

})

document.getElementById("modal-senha-cancelar").addEventListener("click",()=>{

closeModal()
resolve(false)

})

})

}

function escolherStatus(statusAtual){

return new Promise(resolve=>{

openModal("Selecionar novo status")

modalBody.innerHTML=""

STATUS_LIST.forEach(info=>{

const b=document.createElement("button")

b.type="button"
b.className="status-option-btn"+(info.label===statusAtual?" current":"")
b.style.background=info.hex
b.style.color=info.textDark?"#0D1B2A":"#ffffff"

b.innerHTML=`<span class="status-dot"></span><span>${info.label}</span>`

b.addEventListener("click",()=>{

closeModal()
resolve(info.label)

})

modalBody.appendChild(b)

})

const cancelWrap=document.createElement("div")
cancelWrap.className="modal-actions"
cancelWrap.innerHTML=`<button type="button" class="modal-cancel-btn" id="modal-status-cancelar">Cancelar</button>`

modalBody.appendChild(cancelWrap)

document.getElementById("modal-status-cancelar").addEventListener("click",()=>{

closeModal()
resolve(null)

})

})

}

// ===== GOOGLE SHEETS =====

function planilhaConfigurada(){

return typeof GOOGLE_SCRIPT_URL==="string"&&GOOGLE_SCRIPT_URL.trim().length>0

}

async function enviarParaPlanilha(payload){

if(!planilhaConfigurada())return null

try{

await fetch(GOOGLE_SCRIPT_URL,{

method:"POST",
headers:{"Content-Type":"text/plain;charset=utf-8"},
body:JSON.stringify(payload)

})

}catch(err){

console.warn("Falha ao enviar para a planilha:",err)

}

return null

}

async function buscarDaPlanilha(){

if(!planilhaConfigurada())return[]

const resp=await fetch(GOOGLE_SCRIPT_URL,{method:"GET"})

if(!resp.ok)throw new Error("Falha ao buscar dados da planilha")

const json=await resp.json()

return Array.isArray(json)?json:[]

}

// ===== ARMAZENAMENTO LOCAL (IDs ocultos neste aparelho) =====

const HIDDEN_KEY="solarflow_hidden_ids"
const CACHE_KEY="solarflow_cache_records"

function getHiddenIds(){

try{

return JSON.parse(localStorage.getItem(HIDDEN_KEY))||[]

}catch(err){

return[]

}

}

function esconderLocalmente(id){

const ids=getHiddenIds()

if(!ids.includes(id))ids.push(id)

localStorage.setItem(HIDDEN_KEY,JSON.stringify(ids))

}

function salvarCache(records){

try{

localStorage.setItem(CACHE_KEY,JSON.stringify(records))

}catch(err){

// ignora

}

}

function lerCache(){

try{

return JSON.parse(localStorage.getItem(CACHE_KEY))||[]

}catch(err){

return[]

}

}

// ===== TELA DE ACOMPANHAMENTO =====

const acompList=document.getElementById("acomp-list")
const acompEmpty=document.getElementById("acomp-empty")
const acompLoading=document.getElementById("acomp-loading")
const acompStatusMsg=document.getElementById("acomp-status-msg")

async function carregarAcompanhamento(){

if(!planilhaConfigurada()){

acompLoading.style.display="none"
acompList.innerHTML=""
acompEmpty.style.display="none"
acompStatusMsg.textContent="⚠️ Integração com o Google Planilhas ainda não configurada. Adicione a URL do App Script em GOOGLE_SCRIPT_URL no app.js."

return

}

acompLoading.style.display="block"
acompList.innerHTML=""
acompEmpty.style.display="none"
acompStatusMsg.textContent=""

try{

const registros=await buscarDaPlanilha()

salvarCache(registros)

renderizarAcompanhamento(registros)

}catch(err){

console.warn(err)

const cache=lerCache()

if(cache.length){

acompStatusMsg.textContent="⚠️ Não foi possível atualizar agora. Mostrando últimos dados salvos."

renderizarAcompanhamento(cache)

}else{

acompStatusMsg.textContent="⚠️ Não foi possível carregar os cadastros. Verifique sua conexão."

}

}finally{

acompLoading.style.display="none"

}

}

function renderizarAcompanhamento(registros){

const hiddenIds=getHiddenIds()

const visiveis=registros.filter(r=>!hiddenIds.includes(r.id))

acompList.innerHTML=""

if(!visiveis.length){

acompEmpty.style.display="block"
return

}

acompEmpty.style.display="none"

visiveis

.slice()
.reverse()
.forEach(registro=>{

const info=getStatusInfo(registro.status)

const item=document.createElement("div")
item.className="acomp-item"
item.dataset.id=registro.id

const main=document.createElement("div")
main.className="acomp-item-main"

const nomeBtn=document.createElement("button")
nomeBtn.type="button"
nomeBtn.className="acomp-name-btn"
nomeBtn.textContent=registro.cliente||"(sem nome)"

nomeBtn.addEventListener("click",()=>editarRegistro(registro))

const statusBtn=document.createElement("button")
statusBtn.type="button"
statusBtn.className="acomp-status-badge"
statusBtn.style.background=info.hex
statusBtn.style.color=info.textDark?"#0D1B2A":"#ffffff"
statusBtn.textContent=registro.status||DEFAULT_STATUS

statusBtn.addEventListener("click",()=>alterarStatus(registro))

main.appendChild(nomeBtn)
main.appendChild(statusBtn)

const delBtn=document.createElement("button")
delBtn.type="button"
delBtn.className="acomp-delete-btn"
delBtn.textContent="✕"
delBtn.title="Excluir do aplicativo"

delBtn.addEventListener("click",()=>excluirDoAplicativo(registro))

item.appendChild(main)
item.appendChild(delBtn)

acompList.appendChild(item)

})

}

async function editarRegistro(registro){

const ok=await pedirSenha("Senha para editar cadastro")

if(!ok)return

window.editingRecord=registro

preencherForm(registro)

document.getElementById("edit-banner-name").textContent=registro.cliente||""
document.getElementById("edit-banner").style.display="flex"

goToCadastro()

goToStep(1)

}

async function alterarStatus(registro){

const ok=await pedirSenha("Senha para alterar status")

if(!ok)return

const novoStatus=await escolherStatus(registro.status)

if(!novoStatus||novoStatus===registro.status)return

registro.status=novoStatus

const cache=lerCache()
const atualizado=cache.map(r=>r.id===registro.id?registro:r)

renderizarAcompanhamento(atualizado)

salvarCache(atualizado)

await enviarParaPlanilha({action:"updateStatus",id:registro.id,status:novoStatus})

}

async function excluirDoAplicativo(registro){

const ok=await pedirSenha("Senha para excluir do aplicativo")

if(!ok)return

if(!confirm(`Remover "${registro.cliente}" da lista deste aplicativo?\n\nO cadastro continuará salvo na planilha do Google.`))return

esconderLocalmente(registro.id)

const cache=lerCache()

renderizarAcompanhamento(cache)

}

// ===== GERAR BANCO DE DADOS (PDF com histórico completo) =====

document.getElementById("gerar-banco-btn").addEventListener("click",async()=>{

const ok=await pedirSenha("Senha para gerar banco de dados")

if(!ok)return

if(!planilhaConfigurada()){

alert("A integração com o Google Planilhas ainda não foi configurada neste aplicativo.")
return

}

const btn=document.getElementById("gerar-banco-btn")
const originalText=btn.textContent

btn.disabled=true
btn.textContent="Gerando..."

try{

const registros=await buscarDaPlanilha()

if(!registros.length){

alert("Nenhum registro encontrado na planilha.")
return

}

await gerarPDFHistorico(registros)

}catch(err){

console.error(err)
alert("Não foi possível gerar o banco de dados. Verifique a conexão e a integração com o Google Planilhas.")

}finally{

btn.disabled=false
btn.textContent=originalText

}

})

async function gerarPDFHistorico(registros){

const {jsPDF}=window.jspdf

const doc=new jsPDF()

let logo=null

try{

logo=await loadImageAsBase64("logo.png")

}catch(err){

logo=null

}

const hoje=new Date().toLocaleDateString("pt-BR")

registros.forEach((registro,index)=>{

if(index>0)doc.addPage()

drawHeader(doc,logo,registro.data||hoje)
drawFooter(doc,`Registro ${index+1} de ${registros.length}`)

doc.setTextColor(...COLORS.navyDark)
doc.setFontSize(17)
doc.setFont(undefined,"bold")
doc.text("Histórico de Cadastro",10,40)
doc.setFont(undefined,"normal")

let y=54

y=desenharDadosCliente(doc,registro,y,true)
y=desenharEquipamentos(doc,registro,y)
y=desenharDisjuntores(doc,registro,y)
y=desenharAnexosLinks(doc,registro.anexos,y)

if(registro.criadoEm){

doc.setTextColor(...COLORS.navy)
doc.setFontSize(8.5)
doc.setFont(undefined,"italic")
doc.text(`Registrado em: ${new Date(registro.criadoEm).toLocaleString("pt-BR")}`,10,y+4)
doc.setFont(undefined,"normal")

}

})

doc.save(`banco-de-dados-solarflow-${Date.now()}.pdf`)

}
