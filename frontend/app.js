const $ = (selector) => document.querySelector(selector);
const config = window.BOOK_CREATOR_CONFIG || { apiBaseUrl: "" };
let currentBook = null;
$("#mode").textContent = config.apiBaseUrl ? "API configurada" : "Demonstração local";

const mockPages = (alias, theme) => [
  `Num dia ensolarado, ${alias} encontrou uma pista que falava sobre ${theme}.`,
  `${alias} chamou uma amizade querida para explorar o lugar com atenção.`,
  "No caminho, uma folha desenhada indicava que a aventura começava perto dali.",
  "Os amigos pararam, observaram e combinaram um plano cuidadoso.",
  "Uma pequena dificuldade apareceu, mas cada um ofereceu uma ideia gentil.",
  "Trabalhando juntos, descobriram um jeito seguro de seguir em frente.",
  "A surpresa era um jardim cheio de cores, sons e histórias para contar.",
  `${alias} voltou para casa contente, sabendo que curiosidade e cuidado caminham juntos.`
].map((text,index)=>({index:index+1,text}));

async function createBook(data) {
  if (!config.apiBaseUrl) return { id: crypto.randomUUID(), protagonistAlias:data.protagonistAlias, age:Number(data.age), theme:data.theme, pages:mockPages(data.protagonistAlias,data.theme), status:"DRAFT" };
  const response = await fetch(`${config.apiBaseUrl.replace(/\/$/,"")}/api/books`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(data)});
  const body = await response.json();
  if (!response.ok) throw new Error(body.error?.message || "Falha ao criar rascunho.");
  return body;
}

function renderBook(book) {
  currentBook=book;
  $("#book-title").textContent=`A aventura de ${book.protagonistAlias}`;
  $("#pages").replaceChildren();
  for(const page of book.pages){
    const card=document.createElement("article"); card.className="page-card";
    const number=document.createElement("div"); number.className="page-number"; number.textContent=String(page.index).padStart(2,"0");
    const textarea=document.createElement("textarea"); textarea.setAttribute("aria-label",`Texto da página ${page.index}`); textarea.maxLength=1200; textarea.value=page.text;
    const actions=document.createElement("div"); actions.className="page-actions";
    const button=document.createElement("button"); button.type="button"; button.textContent="Gerar ilustração";
    const status=document.createElement("span"); status.className="feedback";
    button.addEventListener("click",async()=>{button.disabled=true;status.textContent="Gerando…";try{const result=await illustration(page.index);const image=document.createElement("img");image.className="illustration";image.alt=`Ilustração da página ${page.index}`;image.src=result.imageDataUrl;card.querySelector(".illustration")?.remove();card.append(image);status.textContent=result.temporary?"Imagem temporária para este navegador.":"";}catch(e){status.textContent=e.message;}finally{button.disabled=false;}});
    actions.append(button,status); card.append(number,textarea,actions); $("#pages").append(card);
  }
  $("#book").classList.remove("hidden");
  $("#review-state").textContent="";
  $("#book").scrollIntoView({behavior:"smooth",block:"start"});
}

async function illustration(pageIndex){
  if(!config.apiBaseUrl){
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024"><rect width="100%" height="100%" fill="#f6e9d0"/><circle cx="512" cy="400" r="180" fill="#f3c969"/><text x="512" y="760" text-anchor="middle" font-family="sans-serif" font-size="36" fill="#24323a">Demonstração • página ${pageIndex}</text></svg>`;
    return {imageDataUrl:`data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`,temporary:true};
  }
  const response=await fetch(`${config.apiBaseUrl.replace(/\/$/,"")}/api/books/${currentBook.id}/illustrations`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({pageIndex})});
  const body=await response.json();if(!response.ok)throw new Error(body.error?.message||"Falha ao gerar ilustração.");return body;
}

$("#book-form").addEventListener("submit",async(event)=>{
  event.preventDefault();const button=$("#create");button.disabled=true;$("#feedback").textContent="Preparando o rascunho…";
  try{const data=Object.fromEntries(new FormData(event.currentTarget));currentBook=await createBook(data);renderBook(currentBook);$("#feedback").textContent="";}catch(error){$("#feedback").textContent=error.message;}finally{button.disabled=false;}
});
$("#review").addEventListener("click",()=>{$("#review-state").textContent="Revisão marcada nesta sessão. A confirmação não é persistida no MVP.";});
$("#print").addEventListener("click",()=>{for(const textarea of document.querySelectorAll(".page-card textarea")){const page=currentBook.pages.find(p=>p.index===Number(textarea.getAttribute("aria-label").match(/\d+/)[0]));if(page)page.text=textarea.value;}window.print();});
