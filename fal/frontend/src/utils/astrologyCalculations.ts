import { zodiacSigns, chineseZodiac, risingSigns } from '@/data/astrologyData';

export interface BirthInfo {
  date: string;
  time: string;
  place: string;
}

export interface AstrologyResult {
  zodiacSign: {
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
  };
  risingSign: {
    name: string;
    description: string;
    traits: string[];
  };
  chineseSign: {
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
  };
}

// Batı burcu hesaplama
export function calculateZodiacSign(birthDate: string) {
  const date = new Date(birthDate);
  const month = date.getMonth() + 1; // 0-11 arası, 1-12 yapıyoruz
  const day = date.getDate();

  // Burç tarihleri
  const zodiacDates = [
    { sign: 'Oğlak', start: [12, 22], end: [1, 19] },
    { sign: 'Kova', start: [1, 20], end: [2, 18] },
    { sign: 'Balık', start: [2, 19], end: [3, 20] },
    { sign: 'Koç', start: [3, 21], end: [4, 19] },
    { sign: 'Boğa', start: [4, 20], end: [5, 20] },
    { sign: 'İkizler', start: [5, 21], end: [6, 20] },
    { sign: 'Yengeç', start: [6, 21], end: [7, 22] },
    { sign: 'Aslan', start: [7, 23], end: [8, 22] },
    { sign: 'Başak', start: [8, 23], end: [9, 22] },
    { sign: 'Terazi', start: [9, 23], end: [10, 22] },
    { sign: 'Akrep', start: [10, 23], end: [11, 21] },
    { sign: 'Yay', start: [11, 22], end: [12, 21] }
  ];

  for (const zodiac of zodiacDates) {
    const [startMonth, startDay] = zodiac.start;
    const [endMonth, endDay] = zodiac.end;

    if (startMonth === endMonth) {
      // Aynı ay içinde
      if (month === startMonth && day >= startDay && day <= endDay) {
        return zodiacSigns.find(sign => sign.name === zodiac.sign);
      }
    } else {
      // Farklı aylar arasında (Oğlak için özel durum)
      if (month === startMonth && day >= startDay) {
        return zodiacSigns.find(sign => sign.name === zodiac.sign);
      }
      if (month === endMonth && day <= endDay) {
        return zodiacSigns.find(sign => sign.name === zodiac.sign);
      }
    }
  }

  return null;
}

// Çin burcu hesaplama
export function calculateChineseSign(birthDate: string) {
  const year = new Date(birthDate).getFullYear();
  
  // Çin takvimi yılları (basitleştirilmiş)
  const chineseYears = [
    { sign: 'Fare', years: [1924, 1936, 1948, 1960, 1972, 1984, 1996, 2008, 2020] },
    { sign: 'Boğa', years: [1925, 1937, 1949, 1961, 1973, 1985, 1997, 2009, 2021] },
    { sign: 'Kaplan', years: [1926, 1938, 1950, 1962, 1974, 1986, 1998, 2010, 2022] },
    { sign: 'Tavşan', years: [1927, 1939, 1951, 1963, 1975, 1987, 1999, 2011, 2023] },
    { sign: 'Ejder', years: [1928, 1940, 1952, 1964, 1976, 1988, 2000, 2012, 2024] },
    { sign: 'Yılan', years: [1929, 1941, 1953, 1965, 1977, 1989, 2001, 2013, 2025] },
    { sign: 'At', years: [1930, 1942, 1954, 1966, 1978, 1990, 2002, 2014, 2026] },
    { sign: 'Keçi', years: [1931, 1943, 1955, 1967, 1979, 1991, 2003, 2015, 2027] },
    { sign: 'Maymun', years: [1932, 1944, 1956, 1968, 1980, 1992, 2004, 2016, 2028] },
    { sign: 'Horoz', years: [1933, 1945, 1957, 1969, 1981, 1993, 2005, 2017, 2029] },
    { sign: 'Köpek', years: [1934, 1946, 1958, 1970, 1982, 1994, 2006, 2018, 2030] },
    { sign: 'Domuz', years: [1935, 1947, 1959, 1971, 1983, 1995, 2007, 2019, 2031] }
  ];

  for (const chinese of chineseYears) {
    if (chinese.years.includes(year)) {
      return chineseZodiac.find(sign => sign.name === chinese.sign);
    }
  }

  return null;
}

// Yükselen burç hesaplama (basitleştirilmiş)
export function calculateRisingSign(birthDate: string, birthTime: string) {
  const date = new Date(birthDate);
  const [hours, minutes] = birthTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;
  
  // Basit yükselen burç hesaplama (gerçek hesaplama çok daha karmaşık)
  // Bu örnekte doğum saati ve tarihine göre yaklaşık bir hesaplama yapıyoruz
  const zodiacSign = calculateZodiacSign(birthDate);
  if (!zodiacSign) return null;

  // Yükselen burç indeksi (basitleştirilmiş)
  const zodiacIndex = zodiacSigns.findIndex(sign => sign.name === zodiacSign.name);
  const timeOffset = Math.floor(totalMinutes / 120); // Her 2 saatte bir değişir
  const risingIndex = (zodiacIndex + timeOffset) % 12;

  return risingSigns[risingIndex];
}

// Ana hesaplama fonksiyonu
export function calculateAstrology(birthInfo: BirthInfo): AstrologyResult | null {
  try {
    const zodiacSign = calculateZodiacSign(birthInfo.date);
    const chineseSign = calculateChineseSign(birthInfo.date);
    const risingSign = calculateRisingSign(birthInfo.date, birthInfo.time);

    if (!zodiacSign || !chineseSign || !risingSign) {
      return null;
    }

    return {
      zodiacSign,
      risingSign,
      chineseSign
    };
  } catch (error) {
    console.error('Astroloji hesaplama hatası:', error);
    return null;
  }
}

// Doğum tarihi validasyonu
export function validateBirthDate(date: string): boolean {
  const birthDate = new Date(date);
  const today = new Date();
  const minDate = new Date('1900-01-01');
  
  return birthDate <= today && birthDate >= minDate;
}

// Doğum saati validasyonu
export function validateBirthTime(time: string): boolean {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}

// Doğum yeri validasyonu
export function validateBirthPlace(place: string): boolean {
  return place.trim().length >= 2;
}

