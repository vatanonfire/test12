export interface ZodiacSign {
  name: string;
  element: string;
  quality: string;
  rulingPlanet: string;
  symbol: string;
  dates: string;
  traits: {
    positive: string[];
    negative: string[];
    general: string;
  };
  compatibility: string[];
  colors: string[];
  gemstones: string[];
}

export interface ChineseZodiac {
  name: string;
  element: string;
  years: number[];
  traits: {
    positive: string[];
    negative: string[];
    general: string;
  };
  compatibility: string[];
  colors: string[];
  luckyNumbers: number[];
}

export const zodiacSigns: ZodiacSign[] = [
  {
    name: "Koç",
    element: "Ateş",
    quality: "Öncü",
    rulingPlanet: "Mars",
    symbol: "♈",
    dates: "21 Mart - 19 Nisan",
    traits: {
      positive: ["Liderlik", "Cesaret", "Enerji", "Bağımsızlık", "Yaratıcılık"],
      negative: ["Sabırsızlık", "İmpulsiflik", "Egoizm", "Acelecilik"],
      general: "Koç burcu insanları doğal liderlerdir. Cesur, enerjik ve bağımsız yapılarıyla dikkat çekerler. Yeni projeler başlatmada ve zorlukların üstesinden gelmede çok başarılıdırlar."
    },
    compatibility: ["Aslan", "Yay", "İkizler", "Kova"],
    colors: ["Kırmızı", "Turuncu"],
    gemstones: ["Elmas", "Yakut"]
  },
  {
    name: "Boğa",
    element: "Toprak",
    quality: "Sabit",
    rulingPlanet: "Venüs",
    symbol: "♉",
    dates: "20 Nisan - 20 Mayıs",
    traits: {
      positive: ["Güvenilirlik", "Sabır", "Pratiklik", "Sanatçılık", "Sadakat"],
      negative: ["İnatçılık", "Materyalizm", "Değişim korkusu", "Tembellik"],
      general: "Boğa burcu insanları güvenilir ve sabırlıdır. Güzellik ve konforu severler, sanatsal yetenekleri güçlüdür. Değişimden hoşlanmazlar ve istikrar ararlar."
    },
    compatibility: ["Başak", "Oğlak", "Yengeç", "Balık"],
    colors: ["Yeşil", "Pembe"],
    gemstones: ["Zümrüt", "Yeşim"]
  },
  {
    name: "İkizler",
    element: "Hava",
    quality: "Değişken",
    rulingPlanet: "Merkür",
    symbol: "♊",
    dates: "21 Mayıs - 20 Haziran",
    traits: {
      positive: ["İletişim", "Zeka", "Çok yönlülük", "Merak", "Uyum"],
      negative: ["Kararsızlık", "Yüzeysellik", "Dedikodu", "Güvenilmezlik"],
      general: "İkizler burcu insanları çok zeki ve iletişim becerileri güçlüdür. Meraklı ve çok yönlü yapılarıyla dikkat çekerler. Hızlı düşünür ve adapte olurlar."
    },
    compatibility: ["Terazi", "Kova", "Koç", "Aslan"],
    colors: ["Sarı", "Gri"],
    gemstones: ["Akuamarin", "Sitrin"]
  },
  {
    name: "Yengeç",
    element: "Su",
    quality: "Öncü",
    rulingPlanet: "Ay",
    symbol: "♋",
    dates: "21 Haziran - 22 Temmuz",
    traits: {
      positive: ["Duyarlılık", "Sezgisellik", "Koruyuculuk", "Empati", "Hayal gücü"],
      negative: ["Aşırı duygusallık", "Güvensizlik", "Pasiflik", "Melankoli"],
      general: "Yengeç burcu insanları çok duygusal ve sezgiseldir. Aile ve ev hayatına önem verirler. Koruyucu ve şefkatli yapılarıyla dikkat çekerler."
    },
    compatibility: ["Akrep", "Balık", "Boğa", "Başak"],
    colors: ["Gümüş", "Beyaz"],
    gemstones: ["İnci", "Ay taşı"]
  },
  {
    name: "Aslan",
    element: "Ateş",
    quality: "Sabit",
    rulingPlanet: "Güneş",
    symbol: "♌",
    dates: "23 Temmuz - 22 Ağustos",
    traits: {
      positive: ["Liderlik", "Cömertlik", "Yaratıcılık", "Güven", "Asalet"],
      negative: ["Kibir", "Dominantlık", "Dikkat çekme ihtiyacı", "İnatçılık"],
      general: "Aslan burcu insanları doğal liderlerdir. Cömert, yaratıcı ve güvenli yapılarıyla dikkat çekerler. Sahne ışığında olmayı severler."
    },
    compatibility: ["Koç", "Yay", "İkizler", "Kova"],
    colors: ["Altın", "Turuncu"],
    gemstones: ["Sitrin", "Amber"]
  },
  {
    name: "Başak",
    element: "Toprak",
    quality: "Değişken",
    rulingPlanet: "Merkür",
    symbol: "♍",
    dates: "23 Ağustos - 22 Eylül",
    traits: {
      positive: ["Mükemmeliyetçilik", "Analitik düşünce", "Pratiklik", "Hizmet", "Düzen"],
      negative: ["Eleştiricilik", "Endişe", "Küçük detaylara takılma", "Katılık"],
      general: "Başak burcu insanları mükemmeliyetçi ve analitiktir. Detaylara önem verirler ve hizmet etmeyi severler. Düzenli ve pratik yapılarıyla dikkat çekerler."
    },
    compatibility: ["Boğa", "Oğlak", "Yengeç", "Akrep"],
    colors: ["Kahverengi", "Bej"],
    gemstones: ["Safir", "Jasper"]
  },
  {
    name: "Terazi",
    element: "Hava",
    quality: "Öncü",
    rulingPlanet: "Venüs",
    symbol: "♎",
    dates: "23 Eylül - 22 Ekim",
    traits: {
      positive: ["Denge", "Adalet", "Güzellik", "Diplomasi", "Uyum"],
      negative: ["Kararsızlık", "Bağımlılık", "Yüzeysellik", "Pasiflik"],
      general: "Terazi burcu insanları denge ve adalet arayışındadır. Güzellik ve uyumu severler. Diplomatik ve uyumlu yapılarıyla dikkat çekerler."
    },
    compatibility: ["İkizler", "Kova", "Aslan", "Yay"],
    colors: ["Mavi", "Yeşil"],
    gemstones: ["Opal", "Zümrüt"]
  },
  {
    name: "Akrep",
    element: "Su",
    quality: "Sabit",
    rulingPlanet: "Plüton",
    symbol: "♏",
    dates: "23 Ekim - 21 Kasım",
    traits: {
      positive: ["Güçlü irade", "Sezgisellik", "Dönüşüm", "Sadakat", "Derinlik"],
      negative: ["Kıskançlık", "Gizlilik", "İntikam", "Aşırı yoğunluk"],
      general: "Akrep burcu insanları güçlü irade ve sezgisellik sahibidir. Derin ve gizemli yapılarıyla dikkat çekerler. Dönüşüm ve yeniden doğuşu temsil ederler."
    },
    compatibility: ["Yengeç", "Balık", "Başak", "Oğlak"],
    colors: ["Kırmızı", "Siyah"],
    gemstones: ["Garnet", "Obsidyen"]
  },
  {
    name: "Yay",
    element: "Ateş",
    quality: "Değişken",
    rulingPlanet: "Jüpiter",
    symbol: "♐",
    dates: "22 Kasım - 21 Aralık",
    traits: {
      positive: ["Optimizm", "Macera", "Felsefe", "Cömertlik", "Özgürlük"],
      negative: ["Düşüncesizlik", "Sabırsızlık", "Aşırı iyimserlik", "Bağlılık korkusu"],
      general: "Yay burcu insanları optimist ve maceracıdır. Felsefe ve öğrenmeyi severler. Özgürlük arayışındadırlar ve geniş düşünürler."
    },
    compatibility: ["Koç", "Aslan", "Terazi", "Kova"],
    colors: ["Mor", "Turuncu"],
    gemstones: ["Turkuaz", "Lapis lazuli"]
  },
  {
    name: "Oğlak",
    element: "Toprak",
    quality: "Öncü",
    rulingPlanet: "Satürn",
    symbol: "♑",
    dates: "22 Aralık - 19 Ocak",
    traits: {
      positive: ["Disiplin", "Sorumluluk", "Pratiklik", "Hedef odaklılık", "Güvenilirlik"],
      negative: ["Katılık", "Pesimizm", "Materyalizm", "Duygusal soğukluk"],
      general: "Oğlak burcu insanları disiplinli ve sorumluluk sahibidir. Hedeflerine ulaşmak için çok çalışırlar. Pratik ve güvenilir yapılarıyla dikkat çekerler."
    },
    compatibility: ["Boğa", "Başak", "Akrep", "Balık"],
    colors: ["Kahverengi", "Siyah"],
    gemstones: ["Garnet", "Onyx"]
  },
  {
    name: "Kova",
    element: "Hava",
    quality: "Sabit",
    rulingPlanet: "Uranüs",
    symbol: "♒",
    dates: "20 Ocak - 18 Şubat",
    traits: {
      positive: ["Orijinallik", "İnsancıllık", "İlericilik", "Bağımsızlık", "Yaratıcılık"],
      negative: ["Duygusal soğukluk", "Asilik", "Tutarsızlık", "Uzaklık"],
      general: "Kova burcu insanları orijinal ve ilericidir. İnsancıl ve bağımsız yapılarıyla dikkat çekerler. Geleceği düşünür ve yenilikleri desteklerler."
    },
    compatibility: ["İkizler", "Terazi", "Aslan", "Yay"],
    colors: ["Gümüş", "Mavi"],
    gemstones: ["Akuamarin", "Amethyst"]
  },
  {
    name: "Balık",
    element: "Su",
    quality: "Değişken",
    rulingPlanet: "Neptün",
    symbol: "♓",
    dates: "19 Şubat - 20 Mart",
    traits: {
      positive: ["Sezgisellik", "Empati", "Yaratıcılık", "Ruhsallık", "Hayal gücü"],
      negative: ["Kaçış", "Kurban psikolojisi", "Belirsizlik", "Aşırı duygusallık"],
      general: "Balık burcu insanları çok sezgisel ve empatiktir. Ruhsal ve yaratıcı yapılarıyla dikkat çekerler. Hayal güçleri güçlüdür ve sanatsal yetenekleri vardır."
    },
    compatibility: ["Yengeç", "Akrep", "Oğlak", "Boğa"],
    colors: ["Deniz mavisi", "Lavanta"],
    gemstones: ["Ametist", "İnci"]
  }
];

export const chineseZodiac: ChineseZodiac[] = [
  {
    name: "Fare",
    element: "Su",
    years: [1924, 1936, 1948, 1960, 1972, 1984, 1996, 2008, 2020],
    traits: {
      positive: ["Zeka", "Çalışkanlık", "Uyum", "Pratiklik", "Sosyallik"],
      negative: ["Kıskançlık", "Açgözlülük", "Güvensizlik", "Eleştiricilik"],
      general: "Fare burcu insanları zeki ve çalışkandır. Sosyal ve uyumlu yapılarıyla dikkat çekerler. Pratik çözümler bulmada başarılıdırlar."
    },
    compatibility: ["Dragon", "Maymun", "Boğa"],
    colors: ["Mavi", "Altın"],
    luckyNumbers: [2, 3, 6, 8, 9]
  },
  {
    name: "Boğa",
    element: "Toprak",
    years: [1925, 1937, 1949, 1961, 1973, 1985, 1997, 2009, 2021],
    traits: {
      positive: ["Güvenilirlik", "Sabır", "Kararlılık", "Pratiklik", "Sadakat"],
      negative: ["İnatçılık", "Materyalizm", "Değişim korkusu", "Tembellik"],
      general: "Çin Boğa burcu insanları güvenilir ve sabırlıdır. Kararlı ve pratik yapılarıyla dikkat çekerler. İş hayatında başarılı olurlar."
    },
    compatibility: ["Yılan", "Horoz", "Fare"],
    colors: ["Yeşil", "Sarı"],
    luckyNumbers: [1, 4, 5, 9]
  },
  {
    name: "Kaplan",
    element: "Ağaç",
    years: [1926, 1938, 1950, 1962, 1974, 1986, 1998, 2010, 2022],
    traits: {
      positive: ["Cesaret", "Liderlik", "Enerji", "Bağımsızlık", "Yaratıcılık"],
      negative: ["Sabırsızlık", "İmpulsiflik", "Egoizm", "Acelecilik"],
      general: "Kaplan burcu insanları cesur ve enerjiktir. Doğal liderlerdir ve bağımsızlığı severler. Yaratıcı ve karizmatik yapılarıyla dikkat çekerler."
    },
    compatibility: ["At", "Köpek", "Domuz"],
    colors: ["Mavi", "Gri", "Turuncu"],
    luckyNumbers: [1, 3, 4, 6, 7, 8]
  },
  {
    name: "Tavşan",
    element: "Ağaç",
    years: [1927, 1939, 1951, 1963, 1975, 1987, 1999, 2011, 2023],
    traits: {
      positive: ["Nezaket", "Zeka", "Sanatçılık", "Empati", "Duyarlılık"],
      negative: ["Güvensizlik", "Pasiflik", "Melankoli", "Kaçış"],
      general: "Tavşan burcu insanları nazik ve zekidir. Sanatsal yetenekleri güçlüdür ve empati sahibidirler. Duyarlı ve sezgisel yapılarıyla dikkat çekerler."
    },
    compatibility: ["Keçi", "Domuz", "Köpek"],
    colors: ["Mavi", "Yeşil", "Pembe"],
    luckyNumbers: [3, 4, 6, 8, 9]
  },
  {
    name: "Ejder",
    element: "Ağaç",
    years: [1928, 1940, 1952, 1964, 1976, 1988, 2000, 2012, 2024],
    traits: {
      positive: ["Güç", "Liderlik", "Cömertlik", "Yaratıcılık", "Asalet"],
      negative: ["Kibir", "Dominantlık", "Dikkat çekme ihtiyacı", "İnatçılık"],
      general: "Ejder burcu insanları güçlü ve karizmatiktir. Doğal liderlerdir ve cömert yapılarıyla dikkat çekerler. Yaratıcı ve asil kişilikleri vardır."
    },
    compatibility: ["Fare", "Maymun", "Horoz"],
    colors: ["Altın", "Gümüş", "Gri"],
    luckyNumbers: [1, 6, 7]
  },
  {
    name: "Yılan",
    element: "Ateş",
    years: [1929, 1941, 1953, 1965, 1977, 1989, 2001, 2013, 2025],
    traits: {
      positive: ["Bilgelik", "Sezgisellik", "Gizem", "Çekicilik", "Analitik düşünce"],
      negative: ["Gizlilik", "Kıskançlık", "Şüphecilik", "Manipülasyon"],
      general: "Yılan burcu insanları bilge ve sezgiseldir. Gizemli ve çekici yapılarıyla dikkat çekerler. Analitik düşünce güçleri yüksektir."
    },
    compatibility: ["Boğa", "Horoz", "Maymun"],
    colors: ["Kırmızı", "Siyah"],
    luckyNumbers: [2, 8, 9]
  },
  {
    name: "At",
    element: "Ateş",
    years: [1930, 1942, 1954, 1966, 1978, 1990, 2002, 2014, 2026],
    traits: {
      positive: ["Özgürlük", "Enerji", "Macera", "Sosyallik", "Optimizm"],
      negative: ["Sabırsızlık", "Düşüncesizlik", "Bağlılık korkusu", "Acelecilik"],
      general: "At burcu insanları özgürlük arayışındadır. Enerjik ve maceracı yapılarıyla dikkat çekerler. Sosyal ve optimist kişilikleri vardır."
    },
    compatibility: ["Kaplan", "Köpek", "Keçi"],
    colors: ["Kahverengi", "Sarı", "Kırmızı"],
    luckyNumbers: [2, 3, 7, 8]
  },
  {
    name: "Keçi",
    element: "Toprak",
    years: [1931, 1943, 1955, 1967, 1979, 1991, 2003, 2015, 2027],
    traits: {
      positive: ["Yaratıcılık", "Empati", "Sanatçılık", "Nezaket", "Duyarlılık"],
      negative: ["Güvensizlik", "Pasiflik", "Kararsızlık", "Melankoli"],
      general: "Keçi burcu insanları yaratıcı ve empatiktir. Sanatsal yetenekleri güçlüdür ve duyarlı yapılarıyla dikkat çekerler. Nazik ve şefkatli kişilikleri vardır."
    },
    compatibility: ["Tavşan", "Domuz", "At"],
    colors: ["Yeşil", "Kahverengi", "Kırmızı"],
    luckyNumbers: [2, 7, 8]
  },
  {
    name: "Maymun",
    element: "Metal",
    years: [1932, 1944, 1956, 1968, 1980, 1992, 2004, 2016, 2028],
    traits: {
      positive: ["Zeka", "Yaratıcılık", "Çok yönlülük", "Merak", "Uyum"],
      negative: ["Kararsızlık", "Yüzeysellik", "Dedikodu", "Güvenilmezlik"],
      general: "Maymun burcu insanları çok zeki ve yaratıcıdır. Meraklı ve çok yönlü yapılarıyla dikkat çekerler. Hızlı düşünür ve adapte olurlar."
    },
    compatibility: ["Fare", "Ejder", "Yılan"],
    colors: ["Beyaz", "Mavi", "Altın"],
    luckyNumbers: [4, 9]
  },
  {
    name: "Horoz",
    element: "Metal",
    years: [1933, 1945, 1957, 1969, 1981, 1993, 2005, 2017, 2029],
    traits: {
      positive: ["Dürüstlük", "Çalışkanlık", "Pratiklik", "Düzen", "Güvenilirlik"],
      negative: ["Eleştiricilik", "Endişe", "Küçük detaylara takılma", "Katılık"],
      general: "Horoz burcu insanları dürüst ve çalışkandır. Pratik ve düzenli yapılarıyla dikkat çekerler. Detaylara önem verirler ve güvenilir kişilikleri vardır."
    },
    compatibility: ["Boğa", "Ejder", "Yılan"],
    colors: ["Altın", "Kahverengi", "Sarı"],
    luckyNumbers: [5, 7, 8]
  },
  {
    name: "Köpek",
    element: "Toprak",
    years: [1934, 1946, 1958, 1970, 1982, 1994, 2006, 2018, 2030],
    traits: {
      positive: ["Sadakat", "Güvenilirlik", "Cesaret", "Adalet", "Empati"],
      negative: ["Endişe", "Pesimizm", "Güvensizlik", "Eleştiricilik"],
      general: "Köpek burcu insanları sadık ve güvenilirdir. Cesur ve adaletli yapılarıyla dikkat çekerler. Empati sahibi ve koruyucu kişilikleri vardır."
    },
    compatibility: ["Kaplan", "At", "Tavşan"],
    colors: ["Kahverengi", "Kırmızı", "Yeşil"],
    luckyNumbers: [3, 4, 9]
  },
  {
    name: "Domuz",
    element: "Su",
    years: [1935, 1947, 1959, 1971, 1983, 1995, 2007, 2019, 2031],
    traits: {
      positive: ["Cömertlik", "Dürüstlük", "Empati", "Sabır", "Optimizm"],
      negative: ["Naiflik", "Güvenilirlik", "Materyalizm", "Tembellik"],
      general: "Domuz burcu insanları cömert ve dürüsttür. Empati sahibi ve sabırlı yapılarıyla dikkat çekerler. Optimist ve naif kişilikleri vardır."
    },
    compatibility: ["Tavşan", "Keçi", "Kaplan"],
    colors: ["Mavi", "Gri", "Siyah"],
    luckyNumbers: [2, 5, 8]
  }
];

export const risingSigns = [
  {
    name: "Koç Yükseleni",
    description: "Cesur, enerjik ve bağımsız bir kişilik. Doğal liderlik özellikleri ve girişimci ruhu.",
    traits: ["Liderlik", "Cesaret", "Enerji", "Bağımsızlık", "Acelecilik"]
  },
  {
    name: "Boğa Yükseleni",
    description: "Güvenilir, sabırlı ve pratik bir kişilik. Güzellik ve konforu seven, sanatsal yetenekleri güçlü.",
    traits: ["Güvenilirlik", "Sabır", "Pratiklik", "Sanatçılık", "İnatçılık"]
  },
  {
    name: "İkizler Yükseleni",
    description: "Zeki, iletişim becerileri güçlü ve çok yönlü bir kişilik. Meraklı ve uyumlu yapı.",
    traits: ["İletişim", "Zeka", "Çok yönlülük", "Merak", "Kararsızlık"]
  },
  {
    name: "Yengeç Yükseleni",
    description: "Duygusal, sezgisel ve koruyucu bir kişilik. Aile ve ev hayatına önem veren, empati sahibi.",
    traits: ["Duyarlılık", "Sezgisellik", "Koruyuculuk", "Empati", "Güvensizlik"]
  },
  {
    name: "Aslan Yükseleni",
    description: "Karizmatik, cömert ve yaratıcı bir kişilik. Doğal lider ve sahne ışığında olmayı seven.",
    traits: ["Liderlik", "Cömertlik", "Yaratıcılık", "Güven", "Kibir"]
  },
  {
    name: "Başak Yükseleni",
    description: "Mükemmeliyetçi, analitik ve pratik bir kişilik. Detaylara önem veren, hizmet etmeyi seven.",
    traits: ["Mükemmeliyetçilik", "Analitik düşünce", "Pratiklik", "Düzen", "Eleştiricilik"]
  },
  {
    name: "Terazi Yükseleni",
    description: "Dengeli, adaletli ve diplomatik bir kişilik. Güzellik ve uyumu seven, uyumlu yapı.",
    traits: ["Denge", "Adalet", "Güzellik", "Diplomasi", "Kararsızlık"]
  },
  {
    name: "Akrep Yükseleni",
    description: "Güçlü irade, sezgisel ve gizemli bir kişilik. Derin ve dönüşüm odaklı yapı.",
    traits: ["Güçlü irade", "Sezgisellik", "Dönüşüm", "Gizem", "Kıskançlık"]
  },
  {
    name: "Yay Yükseleni",
    description: "Optimist, maceracı ve felsefi bir kişilik. Özgürlük arayışında, geniş düşünen.",
    traits: ["Optimizm", "Macera", "Felsefe", "Özgürlük", "Düşüncesizlik"]
  },
  {
    name: "Oğlak Yükseleni",
    description: "Disiplinli, sorumlu ve hedef odaklı bir kişilik. Pratik ve güvenilir yapı.",
    traits: ["Disiplin", "Sorumluluk", "Hedef odaklılık", "Pratiklik", "Katılık"]
  },
  {
    name: "Kova Yükseleni",
    description: "Orijinal, ilerici ve insancıl bir kişilik. Bağımsız ve yaratıcı yapı.",
    traits: ["Orijinallik", "İlericilik", "İnsancıllık", "Bağımsızlık", "Duygusal soğukluk"]
  },
  {
    name: "Balık Yükseleni",
    description: "Sezgisel, empatik ve ruhsal bir kişilik. Yaratıcı ve hayal gücü güçlü.",
    traits: ["Sezgisellik", "Empati", "Ruhsallık", "Yaratıcılık", "Belirsizlik"]
  }
];

