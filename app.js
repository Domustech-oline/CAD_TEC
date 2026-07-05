const ACCESS_CODE="1234"

const COLORS={
navyDark:[13,27,42],   // #0D1B2A
navy:[27,38,59],       // #1B263B
yellow:[244,196,48],   // #F4C430
blueLight:[93,173,226],// #5DADE2
green:[40,167,69],     // #28A745
grayLight:[242,242,242]// #F2F2F2
}

const loginScreen=document.getElementById("login-screen")
const mainScreen=document.getElementById("main-screen")

function show(screen){

loginScreen.classList.remove("active")
mainScreen.classList.remove("active")

screen.classList.add("active")

}

document.getElementById("login-form").addEventListener("submit",e=>{

e.preventDefault()

const code=document.getElementById("access-code").value

if(code===ACCESS_CODE){

show(mainScreen)

}else{

document.getElementById("login-error").textContent="Código inválido"

}

})

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

return new Promise(resolve=>{

const reader=new FileReader()

reader.onload=e=>{

const img=new Image()

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

logo=await loadImageAsBase64("assets/logo.png")

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

// DADOS DO CLIENTE
y=sectionTitle(doc,"Dados do Cliente",y)

campo(doc,"Cliente:",data.cliente,14,y,32)
y+=8
campo(doc,"Telefone:",data.telefone,14,y,32)
campo(doc,"Email:",data.email,110,y,20)
y+=8
campo(doc,"CPF:",data.cpf,14,y,32)
campo(doc,"RG:",data.rg,110,y,20)
y+=14

// EQUIPAMENTOS
y=sectionTitle(doc,"Equipamentos",y)

campo(doc,"Inversor:",data.inversorModelo,14,y,32)
campo(doc,"Qtd.:",data.inversorQtd,140,y,15)
y+=8
campo(doc,"Módulo:",data.moduloModelo,14,y,32)
campo(doc,"Qtd.:",data.moduloQtd,140,y,15)
y+=14

// DISJUNTORES
y=sectionTitle(doc,"Disjuntores",y)

campo(doc,"PDE - Corrente:",data.disjuntorPdeCorrente?`${data.disjuntorPdeCorrente} A`:"-",14,y,40)
campo(doc,"Tipo:",data.disjuntorPdeTipo,140,y,18)
y+=8
campo(doc,"Inversor - Corrente:",data.disjuntorInvCorrente?`${data.disjuntorInvCorrente} A`:"-",14,y,45)
campo(doc,"Tipo:",data.disjuntorInvTipo,150,y,18)
y+=14

doc.setDrawColor(...COLORS.blueLight)
doc.setLineWidth(0.6)
doc.line(10,y,200,y)

// IMAGENS AGRUPADAS POR ANEXO
const images=getAllImages()

let pageCount=1

let currentLabel=null

for(const item of images){

const {data:base64,width,height}=await compressImage(item.file)

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

document.getElementById("project-form").reset()

window.scrollTo(0,0)

}catch(err){

console.error(err)
alert("Ocorreu um erro ao gerar o PDF. Tente novamente.")

}finally{

btn.disabled=false
btn.textContent=originalText

}

}

document.getElementById("generate-pdf").onclick=gerarPDF
