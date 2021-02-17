module.exports = {
  doppelkinnDommez: () => {
    const einleitung = [
      "Sorry Jungs",
      "Tut mir leid Mädels",
      "Oops",
      "Oh...",
      "Ach je",
      "Sorry, hab die Nachricht jetzt erst gelesen",
      "Sorry Jungs, kann heute nicht",
    ];
    const entschuldigung = [
      "Ich hab völlig verpennt",
      "Ich hab verschwitzt",
      "Mir ist entfallen",
      "Ich hab nicht bedacht",
      "Ich hab völlig vergessen",
      "Mir war nicht klar",
      "Mir ist dazwischen gekommen",
      "Ich hab verpeilt",
      "Ich hab grad festgestellt",
    ];
    const ausrede = [
      "Desi's Hamster gestorben ist",
      "Desi's Kaninchen gestorben ist",
      "Desi's Meerschweinchen gestorben ist",
      "Ich morgen Fotoshooting mit der Family hab",
      "eine meiner 5.000 Nichten morgen getauft wird",
      "meine Oma zum fünften mal in diesem Jahr gestorben ist",
      "Morgen Heilige drei Könige ist und wir das immer feiern",
      "mein Auto keinen Sprit mehr hat",
      "mein Auto nicht angesprungen ist",
      "mein Vater mir mein Auto nicht gegeben hat",
      "morgen der Jahrestag von Desi's totem Hamster ist",
      "morgen der Jahrestag von Desi's totem Kaninchen ist",
      "morgen der Jahrestag von Desi's totem Meerschweinchen ist",
      "Desi's Katze zum Tierarzt muss, weil sie einen Zahn gezogen bekommt",
      "Ich meine Tage habe",
      "ich mit den Jungs in Schottland Röcke anprobieren bin",
      "ich mir beim Anstehen vor der Disco die Bänder gerissen hab",
      "Ich dein Handy meinem Neffen geschenkt habe",
      "Ich morgen früh den ganzen Tag Heartstone spielen wollte. Dafür muss ich fit sein",
      "mein neugekauftes und von meinem Schwager generalüberholtes Auto zum dritten Mal in dieser Woche in der Werkstatt ist",
      "mein Auspuff schon wieder abgefallen ist. Dabei steht Peugeot doch für echte französische Wertarbeit",
      "Ich übrigens doch nicht zu meinem eigenen Geburtstag kommen kann. Kann mir das feiern doch nicht leisten. Die Geschenke könnt ihr mir ja bei Gelegenheit geben",
      "ich doch nicht zum Fußball kommen kann. Mir ist aufgefallen dass ich mich dafür bewegen müsste. Das ist mir nach einem anstrengenden Tag World of Warcraft zu viel",
      "Fußball doch heute nichts wird. Hab grade gemerkt dass Ich zu fett dafür bin",
      "ich 9 Millionen für Gbamin geboten habe. Ich wollte nur 990.000 bieten! Aber ihr könnt mir ja sicher mein Geld zurück geben. Ansonsten kann ich leider nicht kommen, weil ich jetzt pleite bin",
      "Ich heute doch nicht The Walking Dead gucken kommen kann. Desi will lieber was lebensbejahendes schauen. Aber sie sagt dass sie die Serie sehr interessant findet",
      "heut gar keine Postkutsche mehr fährt. Das ist jetzt blöd",
      "Ich mir den Urlaub ja doch gar nicht leisten kann. Gut, dass mir das einen Tag vor Abreise noch eingefallen ist",
    ];
    const vertroestung = [
      "Aber das nächste mal bin ich auf jeden Fall am Start",
      "Aber wir sehen uns ja nächste Woche",
      "Aber das passiert sicher nicht nochmal",
      "Sorry, das konnte ich aber echt vorher nicht wissen",
      "Sorry, aber dafür kann ich wirklich nichts",
      "Nächstes mal bin ich auf jeden Fall dabei",
      "Jetzt ist es leider zu spät",
    ];

    function generateExcuse() {
      const percentage = Math.random() * 100;

      let eins = einleitung[Math.floor(Math.random() * einleitung.length)];
      let zwei =
        entschuldigung[Math.floor(Math.random() * entschuldigung.length)];
      let drei = ausrede[Math.floor(Math.random() * ausrede.length)];
      let vier = vertroestung[Math.floor(Math.random() * vertroestung.length)];

      return `${eins}, ${zwei}, dass ${drei}. ${vier}!`;
    }

    return generateExcuse();
  },
};
