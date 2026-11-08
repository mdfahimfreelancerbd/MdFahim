import { loadSiteData } from "./data.js";
import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { isAuthorizedAdmin } from "./admin-auth.js";
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let lang=localStorage.getItem("fahim-language")||"en",data,activeCategory="All";
const t=v=>typeof v==="object"&&v!==null?(v[lang]||v.en||v.bn||""):v||"";
const setText=(selector,value)=>{const el=$(selector);if(el&&value)el.textContent=value};
const translations={
 navAbout:["About","পরিচিতি"],navServices:["Services","সেবাসমূহ"],navWork:["Portfolio","পোর্টফোলিও"],navExperience:["Experience","অভিজ্ঞতা"],navContact:["Contact","যোগাযোগ"],
 letsTalk:["Let's talk ↗","কথা বলুন ↗"],available:["AVAILABLE FOR SELECT PROJECTS","নতুন কাজের জন্য যোগাযোগ করুন"],heroKicker:["INDEPENDENT DESIGNER · BANGLADESH","স্বাধীন ডিজাইনার · বাংলাদেশ"],
 viewWork:["Explore my work ↗","আমার কাজ দেখুন ↗"],contactMe:["Get in touch","যোগাযোগ করুন"],years:["YEARS OF EXPERIENCE","বছরের অভিজ্ঞতা"],servicesCount:["DESIGN SERVICES","ডিজাইন সেবা"],based:["BASED IN BANGLADESH","বাংলাদেশে অবস্থান"],
 servicesTitle:["A good idea deserves great design.","ভালো ভাবনার জন্য চাই অসাধারণ ডিজাইন।"],workTitle:["Selected work, made with intent.","ভাবনা ও যত্নে তৈরি নির্বাচিত কাজ"],experienceTitle:["Curiosity is my creative engine.","কৌতূহলই আমার সৃজনশীল শক্তি।"],
 testimonialTitle:["Good work speaks. Real people speak louder.","কাজের কথা বলে, মানুষের অভিজ্ঞতা আরও জোরে বলে।"],contactTitle:["Let's make something matter.","চলুন অর্থবহ কিছু তৈরি করি।"]
};
function setLanguage(next){
 lang=next;localStorage.setItem("fahim-language",lang);document.documentElement.lang=lang;
 $("#langToggle").textContent=lang==="en"?"বাংলা":"English";
 document.querySelectorAll("[data-i18n]").forEach(el=>{const pair=translations[el.dataset.i18n];if(pair)el.textContent=pair[lang==="en"?0:1]});
 const h=data?.hero||{},a=data?.about||{};
 if(h.intro)setText("[data-i18n=heroDesc]",t(h.intro));
 if(h.headline){const title=$("[data-i18n=heroTitle]");if(title)title.textContent=t(h.headline)}
 if(a.title)setText("[data-i18n=aboutTitle]",t(a.title));
 if(a.body)setText("[data-i18n=aboutText]",t(a.body));
 const servicesIntro=lang==="en"?"Flexible creative support, from a single graphic to a complete visual identity.":"একটি ডিজাইন থেকে সম্পূর্ণ ব্র্যান্ড পরিচিতি—প্রতিটি কাজে সৃজনশীল সহায়তা।";
 setText("[data-i18n=servicesIntro]",servicesIntro);
 setText("[data-i18n=workIntro]",lang==="en"?"Only authentic work published by the designer appears here.":"ডিজাইনারের প্রকাশিত প্রকৃত কাজগুলোই এখানে দেখানো হবে।");
}
function renderServices(){
 const list=(data.services||[]).filter(x=>x.visible!==false).sort((a,b)=>(a.order||0)-(b.order||0));
 $("#serviceGrid").innerHTML=list.map((s,i)=>'<article class="service-card reveal"><span class="service-icon">'+String(i+1).padStart(2,"0")+'</span><h3>'+esc(t(s.title))+'</h3><p>'+esc(t(s.description))+'</p></article>').join("");
}
function renderProjects(){
 const all=(data.portfolio||[]).filter(x=>x.visible!==false).sort((a,b)=>(a.order||0)-(b.order||0));
 const categories=["All",...new Set(all.map(p=>p.category).filter(Boolean))];
 $("#filters").innerHTML=all.length?categories.map(c=>'<button class="filter-btn '+(activeCategory===c?"active":"")+'" data-category="'+esc(c)+'">'+esc(c==="All"?(lang==="en"?"All work":"সব কাজ"):c)+'</button>').join(""):"";
 const shown=activeCategory==="All"?all:all.filter(p=>p.category===activeCategory);
 $("#projectGrid").innerHTML=shown.length?shown.map((p,i)=>'<button class="project-card reveal" type="button" data-project="'+esc(p.id||i)+'"><div class="project-art">'+(p.imageUrl?'<img loading="lazy" src="'+esc(p.imageUrl)+'" alt="'+esc(t(p.title))+'">':'<span>FA<span class="project-star">✳</span></span>')+'</div><div class="project-info"><h3>'+esc(t(p.title))+'</h3><span>'+esc(p.category||"")+'</span></div></button>').join(""):'<div class="empty-work"><span class="empty-mark">FA.</span><h3>'+(lang==="en"?"The portfolio is being curated.":"পোর্টফোলিও সাজানো হচ্ছে।")+'</h3><p>'+(lang==="en"?"Authentic design projects will appear here when Fahim publishes them. No sample client work is shown.":"ফাহিম প্রকৃত ডিজাইনের কাজ প্রকাশ করলে এখানে দেখা যাবে। কোনো ভুয়া কাজ দেখানো হচ্ছে না।")+'</p></div>';
 $("#filters").querySelectorAll("button").forEach(b=>b.onclick=()=>{activeCategory=b.dataset.category;renderProjects()});
 $("#projectGrid").querySelectorAll("[data-project]").forEach(card=>card.onclick=()=>{const p=shown.find((x,i)=>String(x.id||i)===card.dataset.project);if(p)openProject(p)});
 observeReveals();
}
function openProject(p){
 const box=$("#lightbox"),content=$("#lightboxContent");
 content.innerHTML='<div class="project-detail">'+(p.imageUrl?'<img src="'+esc(p.imageUrl)+'" alt="'+esc(t(p.title))+'">':'')+'<span class="eyebrow">'+esc(p.category||"")+'</span><h2>'+esc(t(p.title))+'</h2><p>'+esc(t(p.description))+'</p></div>';
 box.classList.add("open");box.setAttribute("aria-hidden","false");document.body.classList.add("modal-open");
}
function renderExperience(){
 const items=(data.experience||[]).filter(x=>x.visible!==false).sort((a,b)=>(a.order||0)-(b.order||0));
 const container=$(".experience-item");if(container)container.outerHTML=items.length?items.map(x=>'<div class="experience-item"><span>'+esc(x.period||"EXPERIENCE")+'</span><div><h3>'+esc(t(x.title))+'</h3><p class="muted">'+esc(t(x.description))+'</p></div></div>').join(""):'<div class="experience-item"><span>02 YEARS</span><div><h3>Independent Graphic Designer</h3><p class="muted">'+(lang==="en"?"Experience details can be updated by the designer.":"অভিজ্ঞতার বিস্তারিত তথ্য ডিজাইনার পরিবর্তন করতে পারবেন।")+'</p></div></div>';
 const skills=(data.skills||[]).filter(x=>x.visible!==false).sort((a,b)=>(a.order||0)-(b.order||0));
 const panel=$(".skills-panel");if(panel)panel.innerHTML='<span class="eyebrow">SKILLS & DISCIPLINES</span>'+(skills.length?skills.map(s=>'<div class="skill"><div><span>'+esc(t(s.title))+'</span><b>'+esc(s.level||"")+'</b></div><i><span style="width:'+Math.max(0,Math.min(100,Number(s.percentage)||0))+'%"></span></i></div>').join(""):'<h3>'+(lang==="en"?"Skills will be added here.":"দক্ষতাগুলো এখানে যোগ করা হবে।")+'</h3><p class="muted">'+(lang==="en"?"Only skills confirmed by Fahim will be displayed.":"ফাহিম নিশ্চিত করলেই দক্ষতার তথ্য প্রকাশ করা হবে।")+'</p>');
}
function renderContact(){
 const c=data.contact||{},s=data.socialLinks||[];
 const wa=(c.whatsapp||"").replace(/\D/g,"");
 const waUrl=wa?"https://wa.me/"+wa:"#";
 document.querySelectorAll('a[href*="wa.me/"]').forEach(a=>{a.href=waUrl;a.hidden=!wa});
 const fb=$('a[href*="facebook.com"]');if(fb&&c.facebook)fb.href=c.facebook;
 const card=$(".contact-card");if(!card)return;
 const links=[["WHATSAPP",c.whatsapp,waUrl],["EMAIL",c.email,c.email?"mailto:"+c.email:""],["FACEBOOK",c.facebook,c.facebook],["INSTAGRAM",c.instagram,c.instagram],["BEHANCE",c.behance,c.behance],["FIVERR",c.fiverr,c.fiverr],["LINKEDIN",c.linkedin,c.linkedin],...s.filter(x=>x.visible!==false).map(x=>[t(x.title),x.url,x.url])].filter(x=>x[1]&&x[2]);
 card.innerHTML='<span class="eyebrow">DIRECT CONTACT</span>'+links.map(x=>'<a href="'+esc(x[2])+'" target="_blank" rel="noopener"><small>'+esc(x[0])+'</small>'+esc(x[1])+' ↗</a>').join("")+'<div class="contact-foot">BANGLADESH · WORKING WORLDWIDE</div>';
}
function observeReveals(){if(!("IntersectionObserver"in window)){document.querySelectorAll(".reveal").forEach(x=>x.classList.add("visible"));return}const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");io.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll(".reveal:not(.visible)").forEach(el=>io.observe(el))}
function render(){
 const p=data.profile||{},h=data.hero||{},c=data.contact||{};
 document.title=data.seo?.title||"Md Fahim Ahmed — Graphic Designer";
 const brandName=esc(p.name||"Md Fahim Ahmed");
 document.querySelectorAll(".brand span").forEach(el=>el.innerHTML=brandName+"<small>GRAPHIC DESIGNER</small>");
 const years=(p.experience||"2 Years").match(/\d+/)?.[0]||"2";
 const yearStrong=$(".hero-meta strong");if(yearStrong)yearStrong.innerHTML=years.padStart(2,"0")+'<span>+</span>';
 const wa=c.whatsapp||"+8801997222796";document.querySelectorAll('a[href*="wa.me/"]').forEach(a=>a.href="https://wa.me/"+wa.replace(/\D/g,""));
 if(h.profileImage){const img=document.createElement("img");img.src=h.profileImage;img.alt=brandName+" profile";img.className="profile-live-image";$(".portrait-placeholder")?.replaceChildren(img)}
 if(h.coverImage){const visual=$(".hero-visual");if(visual){visual.style.backgroundImage="linear-gradient(180deg,#080c14aa,#080c14aa),url('"+esc(h.coverImage)+"')";visual.classList.add("has-cover")}}
 renderServices();renderProjects();renderExperience();renderContact();setLanguage(lang);observeReveals();
 const testimonialList=(data.testimonials||[]).filter(x=>x.visible!==false&&x.verified===true);
 const test=$(".testimonial-empty");if(test&&testimonialList.length)test.innerHTML=testimonialList.map(x=>'<article class="verified-quote"><span class="quote-mark">“</span><p>'+esc(t(x.quote))+'</p><strong>'+esc(x.clientName)+'</strong><small>VERIFIED CLIENT FEEDBACK</small></article>').join("");
}
$("#themeToggle")?.addEventListener("click",()=>{const v=document.documentElement.dataset.theme==="light"?"dark":"light";document.documentElement.dataset.theme=v;localStorage.setItem("fahim-theme",v);});
document.documentElement.dataset.theme=localStorage.getItem("fahim-theme")||"dark";
$("#langToggle")?.addEventListener("click",()=>{setLanguage(lang==="en"?"bn":"en");renderServices();renderProjects();renderExperience();renderContact();});
// Keep account actions in sync with the actual Firebase session.
// Admin Panel is shown only to the verified owner account with the server-assigned admin claim.
const adminPanelLink=$("#adminPanelLink");
const accountMenuLink=$("#menuAccountLink");
const logoutMenuLink=$("#menuLogoutLink");
onAuthStateChanged(auth,async user=>{
 if(accountMenuLink){
  accountMenuLink.hidden=false;
  accountMenuLink.href="account/";
  accountMenuLink.innerHTML=user?'My Account <span>↗</span>':'Login / Register <span>↗</span>';
 }
 if(adminPanelLink)adminPanelLink.hidden=true;
 if(logoutMenuLink)logoutMenuLink.hidden=!user;
 if(!user)return;
 try{
  const isAuthorized=await isAuthorizedAdmin(user);
  if(adminPanelLink)adminPanelLink.hidden=!isAuthorized;
 }catch(error){
  console.warn("Admin permission check failed; keeping dashboard link hidden.",error);
  if(adminPanelLink)adminPanelLink.hidden=true;
 }
});
logoutMenuLink?.addEventListener("click",async event=>{
 event.preventDefault();
 try{
  await signOut(auth);
  closeMoreMenu();
 }catch(error){
  console.error("Could not sign out:",error);
  alert("Could not log out. Please try again.");
 }
});
const moreToggle=$("#moreMenuToggle"),moreMenu=$("#moreMenu");
function closeMoreMenu(){if(!moreMenu)return;moreMenu.hidden=true;moreToggle?.setAttribute("aria-expanded","false");}
moreToggle?.addEventListener("click",()=>{const opening=moreMenu.hidden;moreMenu.hidden=!opening;moreToggle.setAttribute("aria-expanded",String(opening));});
moreMenu?.querySelectorAll("a").forEach(a=>a.addEventListener("click",closeMoreMenu));
document.addEventListener("click",e=>{if(moreMenu&&!e.target.closest(".more-menu-wrap"))closeMoreMenu();});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeMoreMenu();});
$("#lightboxClose").addEventListener("click",()=>{$("#lightbox").classList.remove("open");$("#lightbox").setAttribute("aria-hidden","true");document.body.classList.remove("modal-open")});
$("#lightbox").addEventListener("click",e=>{if(e.target.id==="lightbox")$("#lightboxClose").click()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")$("#lightboxClose").click()});
// Load the public content without allowing a slow Firebase request to trap the page behind the splash screen.
const hideLoader=()=>$("#loader")?.classList.add("done");
try{
 const timeout=new Promise((_,reject)=>setTimeout(()=>reject(new Error("Content request timed out")),8000));
 data=await Promise.race([loadSiteData(),timeout]);
 render();
}catch(error){
 console.error("Site initialization:",error);
 data={};
 render();
}finally{
 // Also works when the window load event fired before this async module finished.
 requestAnimationFrame(()=>setTimeout(hideLoader,250));
}
