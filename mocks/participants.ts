import { ImageSourcePropType } from "react-native";
import { url } from "zod";
import { da } from "zod/v4/locales";

export interface ParticipantData {
  id: string;
  name: string;
  image: ImageSourcePropType;
  bio: string;
  url?: string;
}

export const PARTICIPANTS_DATA: ParticipantData[] = [
  {
    id: "1",
    name: "ACROMACH",
    image: require("@/assets/images/acromach.png"),
    bio: "Acromach Gökyüzü Dansçıları - Hava Akrobasi Grubu SHG Airshow 2026'da!",
    url: "https://www.seminozturk.com/",
  },
  {
    id: "2",
    name: "AirParkHotel",
    image: require("@/assets/images/airparkhotel.png"),
    bio: "Üzerinden Spitfire geçen dünyadaki TEK otel olma özelliğini taşıyan AirparkHotel SHG Airshow 2026'da!",
  },
  {
    id: "3",
    name: "ANTONOV AN-2",
    image: require("@/assets/images/antonov.png"),
    bio: "M.S.Ö. Hava ve Uzay Müzesi envanterindeki 1957 model Antonov AN-2 dünya çapında birçok askeri ve sivil kullanıcı tarafından kullanıldı. Dünyanın en büyük çift kanatlı uçağı olan Annie / Annushka SHG Airshow'da!",
    url: "https://msomuseum.com/antonov-an-2/",
  },
  {
    id: "4",
    name: "AVIAT HUSKY A-1B",
    image: require("@/assets/images/husky.png"),
    bio: "Pist dışındaki arazilere ve kısa mesafelere rahatlıkla iniş-kalkış yapabilme özelliğine sahip olan Husky, seyircilere keyifli anlar yaşatmaya devam ediyor.",
    url: "https://mach.aero/",
  },
  {
    id: "5",
    name: "BELL UH-1H (HUEY)",
    image: require("@/assets/images/uh1h.png"),
    bio: "Vietnam Gazisi UH-1H ön kısmında, hizmet verdiği vurucu tim ile özleşen sarı renkli büyük bir \"ARI\" figürü taşımaktadır. Dünyanın en ünlü helikopterlerinden biri olan Huey SHG Airshow'da!",
    url: "https://msomuseum.com/bell-uh-1h-huey/",
  },
  {
    id: "6",
    name: "BOEING STEARMAN A75N1",
    image: require("@/assets/images/boeing.png"),
    bio: "Türkiye'nin uçar durumdaki en yaşlı çift kanatlı tayyareleri olan 1940 ve 1943 Boeing Stearman A75N1, seyircileri adeta zaman makinesinde bir yolculuğa çıkaracak.",
    url: "https://msomuseum.com/a75n1-pt-17-boeing-stearman/",
  },
  {
    id: "7",
    name: "CESSNA 172",
    image: require("@/assets/images/cessna.png"),
    bio: "Yılların eskimeyen, dünyanın en meşhur uçaklarından Cessna 172, SHG Airshow'da!",
    url: "https://shm.aero/",
  },
  {
    id: "8",
    name: "CESSNA 195A BUSINESSLINER",
    image: require("@/assets/images/192.png"),
    bio: "M.S.Ö. Hava ve Uzay Müzesi'nin koleksiyonundan 1950 model Cessna 195 A Businessliner güzelliği ile SHG Airshow'da sizleri büyüleyecek.",
    url: "https://msomuseum.com/cessna-195-a-businessliner/",
  },
  {
    id: "9",
    name: "DE HAVILLAND DH.82 TIGER MOTH",
    image: require("@/assets/images/tigermoth.png"),
    bio: "9 dalda Oscar ödülü alan \"The English Patient\" (İngiliz Hasta) filminde yer alan T7471 seri no'lu Tiger Moth SHG Airshow'da sizlerle!",
    url: "https://msomuseum.com/de-havilland-dh.82-tiger-moth/",
  },
  {
    id: "10",
    name: "DOUGLAS DC-3 TURKISH DELIGHT",
    image: require("@/assets/images/dc3.png"),
    bio: "M.S.Ö. Hava ve Uzay Müzesi'nin Türk havacılığına kazandırdığı 1940 Model DC-3 Turkish Delight, 2017 yılında tam bir dünya turunu başarıyla tamamladı ve dünyayı dolaşan en yaşlı uçak ünvanını aldı. Bu muhteşem klasik hava aracı SHG Airshow'da sizlerle!",
    url: "https://msomuseum.com/douglas-dc-3-turkish-delight/",
  },
  {
    id: "11",
    name: "DÜKKAN",
    image: require("@/assets/images/dukkan.png"),
    bio: "M.S.Ö. Hava ve Uzay Müzesi'nin tarihi uçaklarıyla bağlantılı eşsiz kıyafet ve aksesuarlarıyla DÜKKAN, SHG Airshow'da!",
    url: "https://shop.msomuseum.com/",
  },
  {
    id: "12",
    name: "HAVACI KADINLAR DERNEĞİ",
    image: require("@/assets/images/havacikadinlar.png"),
    bio: "Asil vazifesi, \"Türk Kadını'nın\" havacılık kültürünü artırmak olan, havacılığa merak duyan bütün kadınlara yardımcı olmayı ve kadın uçucu sayısını mümkün olduğu kadar artırmayı hedefleyen Havacı Kadınlar Derneği, SHG Airshow'da!",
    url: "https://www.havacikadinlar.org/",
  },
  {
    id: "13",
    name: "LOKANTA SENAN",
    image: require("@/assets/images/lokantasenan.png"),
    bio: "Enfes lezzetleri ve zengin menüsüyle Lokanta Senan SHG Airshow'da!",
    url: "https://www.lokantasenan.com/",
  },
  {
    id: "14",
    name: "MACH AVIATION",
    image: require("@/assets/images/mach.png"),
    bio: "1989 yılından bu yana sivil ve genel havacılık sektöründe hizmet veren Mach Havacılık SHG Airshow'da.",
    url: "https://www.mach.aero/",
  },
  {
    id: "15",
    name: "M.S.Ö. HAVA ve UZAY MÜZESİ",
    image: require("@/assets/images/mso.png"),
    bio: "Türkiye'nin Uçan Hava Müzesi M.S.Ö. Hava ve Uzay Müzesi, dünya havacılığı açısından tarihi değere sahip pek çok uçağı ile SHG Airshow'da!",
    url: "https://msomuseum.com/",
  },
  {
    id: "16",
    name: "NORTH AMERICAN MUSTANG P-51 D",
    image: require("@/assets/images/p51.png"),
    bio: "Ülkemize M.S.Ö. Hava ve Uzay Müzesi tarafından kazandırılan Ferocious Frankie Türkiye'deki ilk ve tek North American P-51 Mustang olma özelliğiyle SHG Airshow'da!",
    url: "https://msomuseum.com/north-american-p-51d-mustang-ferocious-frankie/",
  },
  {
    id: "17",
    name: "NORTH AMERICAN T-6G TEXAN",
    image: require("@/assets/images/t6.png"),
    bio: "M.S.Ö. Hava ve Uzay Müzesi'nin kazandırdığı Türkiye'nin ilk sivil T-6G Harvard uçağı SHG Airshow'da mükemmel bir gösteri için huzurlarınızda olacak.",
    url: "https://msomuseum.com/north-american-t-6g-happy-hour/",
  },
  {
    id: "18",
    name: "NORTH AMERICAN T-28B TROJAN",
    image: require("@/assets/images/t28.png"),
    bio: "Tricycle İniş Takımına sahip ilk ABD eğitim uçağı olan Trojan, savaş uçağı olarak da kullanılmış olup, SHG Airshow'da seyircileri büyüleyecek.",
    url: "https://msomuseum.com/t-28b_trojan/",
  },
  {
    id: "19",
    name: "SUPERMARINE SPITFIRE MK.IX",
    image: require("@/assets/images/spitfire.png"),
    bio: "22.777 adet üretilen ve bugün uçar vaziyette sadece 30 adet kalan Spitfire uçaklarından Mk.9 TE517 SHG Airshow'da Şanlı Hava Kuvvetleri'mizin Kare Fors amblemi ile donatılmış şekilde izleyicilerle buluşuyor!",
    url: "https://msomuseum.com/spitfire-mk-9/",
  },
  {
    id: "20",
    name: "PARS ŞENER",
    image: require("@/assets/images/parssener.png"),
    bio: "Pars Şener, ilk hava gösterisi deneyimini 4 yaşında, dedesi ve Türkiye'nin ilk profesyonel akrobasi pilotu Ali İsmet Öztürk ile birlikte SHG Airshow 2024'te yaşadı. Şimdi ise SHG Airshow 2026'da, sürpriz gösterisiyle izleyicilerin karşısında olacak!",
    url: "https://mach.aero/",
  },
  {
    id: "21",
    name: "SEMİN ÖZTÜRK ŞENER",
    image: require("@/assets/images/seminozturksener.png"),
    bio: "Türkiye'nin İlk Profesyonel Kadın Akrobasi Pilotu Semin Öztürk Şener muhteşem akrobasi gösterisi ile SHG Airshow 2026'da nefeslerinizi kesecek!",
    url: "https://www.seminozturk.com/",
  },
  {
    id: "22",
    name: "SİVRİHİSAR HAVACILIK KULÜBÜ DERNEĞİ",
    image: require("@/assets/images/sivhavder.png"),
    bio: "Sivrihisar Havacılık Kulübü Derneği tarafından kurulan S.H.M. 2013 yılından bu yana gökyüzü sevdalılarını bir araya getiriyor!",
    url: "https://shm.aero/",
  },
  {
    id: "23",
    name: "TECNAM P92",
    image: require("@/assets/images/tecnam.png"),
    bio: "İtalyan tasarımı, hafif ve çevik yapısıyla öne çıkan 2 adet Tecnam P92 Ultralight, Sivrihisar Havacılık Kulübü ve Havacı Kadınlar Derneği Kol Uçuşu'nda gökyüzünde buluşuyor!",
    url: "https://www.havacikadinlar.org/",
  },
  {
    id: "24",
    name: "VECİHİ XIV",
    image: require("@/assets/images/vecihi.png"),
    bio: "Türkiye'mizin İlk Sertifikalı Uçağı Vecihi XIV (14) replikası, M.S.Ö. Hava ve Uzay Müzesi ile Sivrihisar Havacılık Kulübü'nün çalışmasıyla SHG Airshow 2026'da!",
    url: "https://msomuseum.com/vecihi-XIV-14/",
  },
  {
    id: "25",
    name: "YENİ MENEKŞE (PITTS S-2B)",
    image: require("@/assets/images/yenimenekse.png"),
    bio: "Efsanevi Mor Menekşe Mak Teknik'in özverili çalışmaları sonrası Yeni Menekşe adını aldı ve Semin Öztürk Şener ile göklerde yeni serüvenlerine devam ediyor.",
    url: "https://www.seminozturk.com/",
  },
];
