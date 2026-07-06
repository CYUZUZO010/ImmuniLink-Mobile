import { useState, useEffect } from 'react';
import * as Localization from 'expo-localization';

export type Language = 'en' | 'rw' | 'fr' | 'sw';

const translations: Record<Language, Record<string, string>> = {
  en: {
    welcome: "Good morning",
    childrenCount: "Children",
    complete: "Complete",
    dueSoon: "Due Soon",
    upcomingVaccines: "Upcoming Vaccines",
    recentRecords: "Recent Records",
    seeAll: "See all",
    book: "Book",
    verified: "Verified",
    aiInsight: "AI Health Insight",
    childId: "Child ID",
    nextVaccine: "Next Vaccine",
    takenVaccines: "Taken Vaccines",
    noChildren: "No children registered yet.",
  },
  rw: {
    welcome: "Mwiriwe neza",
    childrenCount: "Abana",
    complete: "Byuzuye",
    dueSoon: "Vuba aha",
    upcomingVaccines: "Inkingo Zitaha",
    recentRecords: "Inkingo Zaherutse",
    seeAll: "Reba byose",
    book: "Gahunda",
    verified: "Byemejwe",
    aiInsight: "Inama za AI",
    childId: "Nimero y'Umwana",
    nextVaccine: "Urukingo Rutaha",
    takenVaccines: "Inkingo Zimaze Guhabwa",
    noChildren: "Nta mwana ubaruye uraboneka.",
  },
  fr: {
    welcome: "Bonjour",
    childrenCount: "Enfants",
    complete: "Complet",
    dueSoon: "Bientôt",
    upcomingVaccines: "Vaccins à Venir",
    recentRecords: "Dossiers Récents",
    seeAll: "Voir tout",
    book: "Réserver",
    verified: "Vérifié",
    aiInsight: "Aperçu Santé IA",
    childId: "ID Enfant",
    nextVaccine: "Prochain Vaccin",
    takenVaccines: "Vaccins Reçus",
    noChildren: "Aucun enfant enregistré.",
  },
  sw: {
    welcome: "Habari ya asubuhi",
    childrenCount: "Watoto",
    complete: "Imekamilika",
    dueSoon: "Hivi Karibuni",
    upcomingVaccines: "Chanjo Zijazo",
    recentRecords: "Rekodi za Hivi Karibuni",
    seeAll: "Ona zote",
    book: "Weka",
    verified: "Imethibitishwa",
    aiInsight: "Ufahamu wa Afya wa AI",
    childId: "ID ya Mtoto",
    nextVaccine: "Chanjo Ijayo",
    takenVaccines: "Chanjo Zilizochukuliwa",
    noChildren: "Hakuna watoto waliosajiliwa.",
  }
};

export const useI18n = () => {
  const [locale, setLocale] = useState<Language>('en');

  useEffect(() => {
    const localeStr = Localization.locale;
    if (localeStr) {
      const deviceLocale = localeStr.split('-')[0] as Language;
      if (translations[deviceLocale]) {
        setLocale(deviceLocale);
      }
    }
  }, []);

  const t = (key: string) => {
    return translations[locale][key] || key;
  };

  return { t, locale, setLocale };
};
