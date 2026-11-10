import { database, databaseConfigured } from "./firebase.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
export const defaults = {
 profile:{name:"Md Fahim Ahmed",title:"Professional Graphic Designer",experience:"2 Years",location:"Bangladesh"},
 hero:{headline:{en:"Ideas made impossible to ignore.",bn:"ভাবনাকে করি স্মরণীয় ও দৃষ্টিনন্দন।"},intro:{en:"I’m Md Fahim Ahmed — a graphic designer shaping clear, memorable visual identities and digital experiences.",bn:"আমি মোঃ ফাহিম আহমেদ — অর্থবহ ও দৃষ্টিনন্দন ডিজাইন তৈরি করি।"},profileImage:"",coverImage:""},
 about:{title:{en:"Design is not decoration. It’s communication.",bn:"ডিজাইন শুধু সাজানো নয়, এটি যোগাযোগের ভাষা।"},body:{en:"I’m Md Fahim Ahmed, a professional graphic designer with 2 years of experience. I turn ideas into purposeful visuals through thoughtful composition, clear communication and attention to detail.",bn:"আমি মোঃ ফাহিম আহমেদ, ২ বছরের অভিজ্ঞতাসম্পন্ন একজন প্রফেশনাল গ্রাফিক ডিজাইনার। সৃজনশীলতা, পরিকল্পনা ও যত্নের মাধ্যমে ভাবনাকে অর্থবহ ডিজাইনে রূপ দিই।"}},
 contact:{whatsapp:"+8801997222796",facebook:"https://www.facebook.com/share/1DxcZTvnzy/",email:"",instagram:"",behance:"",fiverr:"",linkedin:""},
 services:[["Logo Design","লোগো ডিজাইন"],["Brand Identity Design","ব্র্যান্ড পরিচিতি"],["Social Media Design","সোশ্যাল মিডিয়া ডিজাইন"],["Banner Design","ব্যানার ডিজাইন"],["Poster Design","পোস্টার ডিজাইন"],["Business Card Design","বিজনেস কার্ড"],["Flyer Design","ফ্লায়ার ডিজাইন"],["YouTube Thumbnail","ইউটিউব থাম্বনেইল"],["Brochure Design","ব্রোশিওর"],["Packaging Design","প্যাকেজিং"],["T-shirt Design","টি-শার্ট"],["Photo Editing","ফটো এডিটিং"],["Other Graphic Design Services","অন্যান্য ডিজাইন সেবা"]].map((x,i)=>({id:"service-"+i,title:{en:x[0],bn:x[1]},description:{en:"Thoughtful, purposeful design tailored to your needs.",bn:"আপনার প্রয়োজন অনুযায়ী যত্নসহকারে তৈরি ডিজাইন।"},visible:true,order:i+1})),
 portfolio:[{id:"method-card-01",title:{en:"Method — Business Card Design",bn:"Method — বিজনেস কার্ড ডিজাইন"},category:"Business Card Design",description:{en:"A modern blue and violet business card identity concept.",bn:"নীল ও বেগুনি রঙের আধুনিক বিজনেস কার্ড ডিজাইন।"},imageUrl:"assets/images/portfolio/method-business-card.webp",visible:true,order:1}],skills:[],experience:[],testimonials:[],categories:[],socialLinks:[],seo:{title:"Md Fahim Ahmed — Professional Graphic Designer",description:"Professional graphic designer from Bangladesh."},websiteSettings:{theme:"dark",language:"en"}
};
export async function loadSiteData(){
 if(!databaseConfigured||!database)return {...defaults,backendStatus:"not-configured"};
 // Read only the public top-level sections. This works with Firebase Rules that
 // deny root reads while allowing public reads on individual content paths.
 const keys=["profile","hero","about","services","portfolio","categories","skills","experience","testimonials","contact","socialLinks","seo","websiteSettings"];
 try{
  const entries=await Promise.all(keys.map(async key=>{
   try{
    const snap=await get(ref(database,key));
    return [key,snap.exists()?snap.val():defaults[key]];
   }catch(error){
    console.warn("Could not read public section:",key,error);
    return [key,defaults[key]];
   }
  }));
  return {...defaults,...Object.fromEntries(entries),backendStatus:"connected"};
 }catch(error){
  console.error("Public content load failed",error);
  return {...defaults,backendStatus:"unavailable"};
 }
}