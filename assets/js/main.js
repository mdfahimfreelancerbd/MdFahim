import { loadSiteData } from "./data.js";
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let lang=localStorage.getItem("fahim-language")||"en",data;
const t=v=>typeof v==="object"&&v!==null?(v[lang]||v.en||""):v||"";
function render(){
 const p=data.profile||{},h=data.hero||{},a=data.about||{},c=data.contact||{};
 document.title=data.seo?.title||"Md Fahim Ahmed — Graphic Designer";
 document.querySelectorAll(".brand span").forEach(el=>el.innerHTML=esc(p.name||"Md Fahim Ahmed")+"<small>GRAPHIC DESIGNER</small>");
 const heroDesc=$("[data-i18n=heroDesc]");if(heroDesc&&h.intro)heroDesc.textContent=t(h.intro);
 const aboutText=$("[data-i18n=aboutText]");if(aboutText&&a.body)aboutText.textContent=t(a.body);
 const aboutTitle=$("[data-i18n=aboutTitle]");if(aboutTitle&&a.title)aboutTitle.textContent=t(a.title);
 const years=$("[data-i18n=years]")?.previousElementSibling;if(years)years.textContent=(p.experience||"2 Years").replace(/[^0-9]/g,"").padStart(2,"0")+"+";
 if(h.profileImage){const img=document.createElement("img");img.src=h.profileImage;img.alt=(p.name||"Designer")+" profile";img.className="profile-live-image";$(".portrait-placeholder")?.replaceChildren(img)}
 if(h.coverImage){const visual=$(".hero-visual");if(visual)visual.style.backgroundImage="url('"+esc(h.coverImage)+"')"}
 const wa=(c.whatsapp||"").replace(/\D/g,"");document.querySelectorAll('a[href*="wa.me/"]').forEach(el=>{if(wa)el.href="https://wa.me/"+wa});
 const fb=document.querySelector('a[href*="facebook.com"]');if(fb&&c.facebook)fb.href=c.facebook;
 const services=(data.services||[]).filter(x=>x.visible!==false).sort((x,y)=>(x.order||0)-(y.order||0));
 $("#serviceGrid").innerHTML=services.map((s,i)=>'<article class="service-card"><span class="service-icon">'+String(i+1).padStart(2,"0")+'</span><h3>'+esc(t(s.title))+'</h3><p>'+esc(t(s.description))+'</p></article>').join("");
 const projects=(data.portfolio||[]).filter(x=>x.visible!==false).sort((x,y)=>(x.order||0)-(y.order||0));
 $("#filters").innerHTML="";
 $("#projectGrid").innerHTML=projects.length?projects.map(p=>'<article class="project-card"><div class="project-art"><img loading="lazy" src="'+esc(p.imageUrl||"")+'" alt="'+esc(t(p.title))+'"></div><div class="project-info"><h3>'+esc(t(p.title))+'</h3><span>'+esc(p.category||"")+'</span></div></article>').join(""):'<div class="empty-work"><h3>Selected work will appear here.</h3><p>Authentic projects will be published by Fahim. No fictional client work is displayed.</p></div>';
 const testimonials=(data.testimonials||[]).filter(x=>x.visible!==false&&x.verified===true);
 const testimonialText=$("[data-i18n=testimonialText]");if(testimonialText&&!testimonials.length)testimonialText.textContent=lang==="bn"?"অনুমোদিত প্রকৃত ক্লায়েন্ট মতামত এখনো যোগ করা হয়নি।":"Verified client testimonials will appear here after they are added.";
 setLanguage(lang);
}
function setLanguage(next){lang=next;localStorage.setItem("fahim-language",lang);document.documentElement.lang=lang;$("#langToggle").textContent=lang==="en"?"বাংলা":"English";const map={navAbout:["About","পরিচিতি"],navServices:["Services","সেবাসমূহ"],navWork:["Work","কাজ"],navExperience:["Experience","অভিজ্ঞতা"],navContact:["Contact","যোগাযোগ"],letsTalk:["Let's talk ↗","কথা বলুন ↗"],available:["AVAILABLE FOR SELECT PROJECTS","নতুন প্রজেক্টের জন্য যোগাযোগ করতে পারেন"],heroKicker:["INDEPENDENT DESIGNER · BANGLADESH","স্বাধীন ডিজাইনার · বাংলাদেশ"],viewWork:["Explore my work ↗","আমার কাজ দেখুন ↗"],contactMe:["Get in touch","যোগাযোগ করুন"],years:["YEARS OF EXPERIENCE","বছরের অভিজ্ঞতা"],servicesCount:["DESIGN SERVICES","ডিজাইন সেবা"],based:["BASED IN BANGLADESH","বাংলাদেশে অবস্থান"],servicesTitle:["A good idea deserves great design.","ভালো ভাবনার জন্য দরকার ভালো ডিজাইন।"],workTitle:["A collection of visual explorations.","আমার নির্বাচিত কাজ"],experienceTitle:["Curiosity is my creative engine.","কৌতূহলই আমার সৃজনশীল শক্তি।"],testimonialTitle:["Good work speaks. Real people speak louder.","কাজের কথা বলে, মানুষের অভিজ্ঞতা আরও জোরে বলে।"],contactTitle:["Let's make something matter.","চলুন অর্থবহ কিছু তৈরি করি।"]};document.querySelectorAll("[data-i18n]").forEach(el=>{const pair=map[el.dataset.i18n];if(pair)el.textContent=pair[lang==="en"?0:1]});const desc=$("[data-i18n=heroDesc]");if(desc&&data?.hero?.intro)desc.textContent=t(data.hero.intro);const ab=$("[data-i18n=aboutText]");if(ab&&data?.about?.body)ab.textContent=t(data.about.body)}
$("#themeToggle").addEventListener("click",()=>{const v=document.documentElement.dataset.theme==="light"?"dark":"light";document.documentElement.dataset.theme=v;localStorage.setItem("fahim-theme",v)});
document.documentElement.dataset.theme=localStorage.getItem("fahim-theme")||"dark";
$("#langToggle").addEventListener("click",()=>{setLanguage(lang==="en"?"bn":"en");render()});
$("#menuToggle").addEventListener("click",()=>$(".desktop-nav").classList.toggle("open"));
document.querySelectorAll(".desktop-nav a").forEach(a=>a.addEventListener("click",()=>$(".desktop-nav").classList.remove("open")));
data=await loadSiteData();render();window.addEventListener("load",()=>setTimeout(()=>$("#loader")?.classList.add("done"),350));
