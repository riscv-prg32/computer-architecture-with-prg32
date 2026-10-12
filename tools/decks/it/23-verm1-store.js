// Italian version of decks/en/23-verm1-store.js: same slides, same listings, text in Italian.
// Lecture 23 - Verm1 on the Cartridge Store: from a file that runs to a bundle that others can install.
// The files shown are those of verm1/store; the whole procedure, except the upload, is run by tests/verm1_store.py.
const V22 = require("../../lib/verm1");

Deck({
  n: "23", file: "23-Architettura_dei_Calcolatori-Verm1_sul_Cartridge_Store",
  title: "Verm1 sul Cartridge Store", short: "Verm1: lo Store",
  sub: "Da un programma che gira sulla vostra scrivania a un bundle che chiunque può installare",
  quote: ["Real artists ship.", "Steve Jobs, al gruppo del Macintosh, 1983: i veri artisti consegnano"],
  cover: "prg32qt_store.png",
  credit: V22.CREDIT,
  notes: "Ultima lezione del progetto; la Lezione 24 chiude il corso con uno sguardo in avanti. Ancora un tutorial: alla fine ogni studente ha un bundle, verm1-1.0.0.zip, controllato e pronto per l'invio. Il caricamento è un atto personale con un token personale: fatelo in laboratorio solo con gli studenti che lo desiderano. Tutto, fino al caricamento escluso, viene eseguito da tools/tests/verm1_store.py sul gioco di riferimento.",
  slides: [
    O("Che cosa avrete alla fine", [
      "Il vostro Verm1 compilato per due architetture, il kit ESP32-C6 e QEMU, dallo stesso sorgente",
      "Un manifest che dà al gioco un'identità: id, titolo, versione, autori, licenza",
      "Un'icona, e un colophon con crediti e comandi",
      "Un bundle, un solo file ZIP, controllato e pronto per il Cartridge Store",
      "Un'idea chiara di che cosa succede dopo aver premuto «pubblica», e di che cosa siete responsabili",
    ]),
    T("Perché pubblicare?", [
      "Un programma che gira solo sul calcolatore del suo autore è un esercizio; uno che altri possono installare è un prodotto",
      "Pubblicare impone le domande che un esercizio lascia saltare: come si chiama, chi l'ha fatto, su che cosa gira, che cosa possono farne gli altri",
      "Il Cartridge Store è lo scaffale di PRG32: giochi e programmi che si installano sul kit, su QEMU e su PRG32-QT",
      "Ogni cartuccia che c'è lì è stata scritta da qualcuno partito da dove siete partiti voi",
      "La vostra può stare accanto alle altre",
    ], "Lo Store è su store.prg32.uniparthenope.it; il suo software è aperto, github.com/riscv-prg32/CartridgeStore. PRG32-QT ha un proprio browser dello Store. Mostrate entrambi.", { img: "prg32qt_store.png", cap: "Il Cartridge Store, da PRG32-QT", wide: true }),
    F("Dal sorgente allo scaffale", ["verm1.S|il vostro sorgente", "2 cartucce|una per architettura", "metadati|identità, icona, crediti", "bundle|un solo file ZIP", "revisione|un redattore lo controlla", "Store|chiunque installa"],
      "I passi da 1 a 4 di oggi avvengono sul vostro calcolatore. Solo il passo 5 parla con lo Store.", "Il percorso della lezione. Nulla lascia il calcolatore dello studente prima del comando di pubblicazione."),
    G("Prima di confezionare: è finito?", ["Controllo", "Come", "Con"], [
      ["Parte, si gioca e finisce", "giocate tre partite intere, perdete in tre modi diversi", "PRG32-QT"],
      ["Nessun frame è in ritardo", "telemetria in una partita lunga: i frame in ritardo restano a zero", "PRG32-QT, modalità debug"],
      ["La memoria è coerente", "mettete in pausa a caso e confrontate anello, mappa e schermo", "PRG32-QT, vista Memory"],
      ["Gira sulla seconda architettura", "compilate per QEMU, caricate, giocate", "QEMU"],
      ["Gira sull'hardware vero", "caricate su un kit, giocate con joystick e altoparlante veri", "il kit, se ne avete uno"],
      ["È vostro", "un titolo, una regola o un aspetto che il riferimento non ha", "voi"],
    ], "Il debugger si usa un'ultima volta, come strumento di qualità. Una cartuccia che non è mai stata eseguita su un target non va pubblicata per quel target.", { widths: [3.6, 6.2, 3.2] }),

    H("Passo 1: un sorgente, due cartucce", "Compilare per ogni architettura, e controllare ciò che si è compilato."),
    K("Compilare per il kit e per QEMU", `cd ~/PRG32          # your PRG32 folder, toolchain active

python3 -m prg32 cartridge build ~/verm1/verm1.S --portable \\
    --entry-prefix verm1 --name verm1 \\
    --architecture esp32c6 --out ~/verm1/verm1-esp32c6.prg32

python3 -m prg32 cartridge build ~/verm1/verm1.S --portable \\
    --entry-prefix verm1 --name verm1 \\
    --architecture qemu --out ~/verm1/verm1-qemu.prg32`, [
      "Il comando di ogni lezione, con un'opzione in più",
      "--architecture indica il target del file",
      "I nomi seguono una regola: gioco-architettura.prg32",
      "Il Verm1 finito è circa 6 kilobyte di codice",
    ], "Il builder risponde: built verm1-esp32c6.prg32 name=verm1 load=0x40800000, e code=6216 per il gioco di riferimento. Sei kilobyte: meno di questa slide come immagine.", "sh", { wide: true }),
    K("Controllo: è portabile?", `python3 -m prg32 cartridge summary ~/verm1/verm1-esp32c6.prg32

{
  ...
  "import_model": "abi-table",
  ...
}`, [
      "summary stampa ciò che il file dichiara di sé",
      "abi-table: la cartuccia raggiunge il runtime tramite una tabella di funzioni",
      "Quindi non dipende da una specifica build del firmware: è portabile",
      "Lo Store accetta cartucce portabili",
    ], "Una cartuccia non portabile è collegata agli indirizzi di una specifica immagine del firmware e si rompe al primo aggiornamento. La tabella è l'ABI di PRG32: prg32_gfx_rect e le altre ne sono voci. Ripetete il controllo sul file per QEMU.", "sh", { wide: true }),

    H("Passo 2: un'identità", "Un manifest, un'icona, un colophon."),
    K("manifest.json: chi è questo gioco?", V22.storeFile("manifest.json"), [
      "id: un nome unico al mondo, e per sempre",
      "version: tre numeri, 1.0.0 per una prima versione",
      "summary: una riga per lo scaffale; description: un paragrafo",
      "architectures: quale file serve quale target",
    ], "Create il file in ~/verm1 con un editor di testo. Nella slide la descrizione è tagliata. La riga abi dice di quale versione del formato dei metadati si tratta.", "json", { wide: true }),
    G("I campi, e a che cosa vi impegnano", ["Campo", "Regola", "Per Verm1"], [
      ["id", "per consuetudine un nome di dominio rovesciato; non cambia mai", "uno per studente: metteteci il vostro nome"],
      ["version", "major.minor.patch; una versione pubblicata si considera permanente", "1.0.0, poi 1.0.1 per una correzione"],
      ["title", "ciò che legge il giocatore", "Verm1, o il nome della vostra variante"],
      ["authors", "le persone che l'hanno scritto", "voi, e chi ha lavorato con voi"],
      ["license", "che cosa possono farne gli altri", "MIT, se volete che altri possano imparare dal vostro lavoro"],
      ["tags", "come verrà trovato", "arcade, snake, assembly, education"],
    ], "Due studenti non possono pubblicare lo stesso id: ciascuno usa un id proprio, per esempio it.uniparthenope.arc12.<cognome>.verm1. Concordate la convenzione in aula. Un id e una versione, una volta pubblicati, vanno considerati permanenti: un errore si corregge con una nuova versione, non con una sostituzione. È una regola di buona pratica (semantic versioning), su cui contano i giocatori che hanno già installato la 1.0.0.", { widths: [1.8, 6.2, 5.0] }),
    T("Un'icona", [
      "Un piccolo PNG che rappresenta il gioco sullo scaffale",
      "La nostra è di 64 per 64 pixel: un verme e un pezzo di cibo, con i colori del gioco",
      "La pixel art si addice a una macchina di 320 per 200 pixel: disegnate in grande, cella per cella",
      "Usate qualunque editor che salvi PNG, o disegnatela con un programma, come è stata fatta l'icona di riferimento",
      "Salvatela come icon.png accanto al manifest: il manifest la nomina sotto assets",
    ], "L'icona di riferimento è verm1/store/icon.png. Un'icona presa dal web è il lavoro di qualcun altro: disegnate la vostra.", { img: "verm1_icon.png", cap: "icon.png, ingrandita" }),
    K("colophon.json: crediti e comandi", V22.storeFile("colophon.json"), [
      "Il colophon è la pagina dei crediti della cartuccia",
      "Ruoli e nomi: riconoscete il lavoro di tutti",
      "controls: che cosa fa ogni ingresso, per il giocatore",
      "acknowledgements: chi ringraziate; il gioco di riferimento da cui siete partiti resta lì",
    ], "Colophon è la parola dei tipografi per la nota in fondo a un libro che dice chi l'ha realizzato. Sostituite ovunque Your Name, e impostate la data di pubblicazione.", "json", { wide: true }),
    T("Un omaggio non è una copia", [
      "Verm1 è un omaggio a Snake: l'idea di un verme che cresce è vecchia quanto Blockade, 1976, ed è libera per tutti",
      "Il nome, il codice, l'icona e i suoni sono nostri: nulla è stato preso da un altro gioco",
      ["Prima di pubblicare, chiedetevi di ogni pezzo", ["l'ho scritto o disegnato io?", "se no, la sua licenza mi permette di pubblicarlo, e ho citato l'autore?"]],
      "Nomi e personaggi dei giochi commerciali sono marchi registrati: non usateli",
      "La licenza che scegliete dice agli altri che cosa possono fare del vostro lavoro: la MIT permette di studiarlo, modificarlo e condividerlo, conservando il vostro nome",
    ], "Le regole di un gioco non sono protette; codice, immagini, musica e nomi sì. Un'introduzione breve e concreta al diritto d'autore, che gli ingegneri incontrano presto.", { box: "Sopra c'è il vostro nome. Pubblicate solo ciò che firmereste.", head: "La regola" }),

    H("Passo 3: la cartuccia porta con sé i documenti", "Allegare i metadati a ogni file, e rileggerli."),
    K("metadata.json, e attach", `# metadata.json = manifest.json WITHOUT the "assets" and "architectures" entries

python3 -m prg32 store attach-metadata ~/verm1/verm1-esp32c6.prg32 \\
    --metadata ~/verm1/metadata.json --icon ~/verm1/icon.png \\
    --colophon ~/verm1/colophon.json --architecture esp32c6 \\
    --out ~/verm1/verm1-esp32c6.prg32

python3 -m prg32 store attach-metadata ~/verm1/verm1-qemu.prg32 \\
    --metadata ~/verm1/metadata.json --icon ~/verm1/icon.png \\
    --colophon ~/verm1/colophon.json --architecture qemu \\
    --out ~/verm1/verm1-qemu.prg32`, [
      "Copiate il manifest e cancellate due voci: assets, architectures",
      "attach scrive titolo, icona e crediti dentro la cartuccia",
      "Una cartuccia copiata a mano dice ancora che cos'è",
      "Una volta per file, con la sua architettura",
    ], "Lo strumento risponde: wrote verm1-esp32c6.prg32 legacy=6316 blocks=3. I tre blocchi sono i metadati, l'icona e il colophon, aggiunti in coda al programma; il programma in sé non viene toccato. Attenzione: dare il manifest completo a --metadata fa fallire lo strumento, per via della voce assets.", "sh", { wide: true }),
    K("Rileggere", `python3 -m prg32 store inspect-metadata ~/verm1/verm1-esp32c6.prg32

{
  ...
    "id": "it.uniparthenope.arc12.verm1",
    "license": "MIT",
    "runtime": { "architecture": "esp32c6", ... },
    "summary": "A hungry worm on a 40 by 24 grid: a tribute to Snake.",
    "title": "Verm1",
    "version": "1.0.0"
  },
  ...
  "trailer_present": true,
  "unknown_blocks": []
}`, [
      "Mai fidarsi di una scrittura che non si è riletta",
      "Controllate id, titolo, versione e architettura",
      "trailer_present: i documenti sono nel file",
      "Eseguite ancora una volta la cartuccia: deve funzionare come prima",
    ], "Output abbreviato. Rileggere ciò che si è scritto è l'abitudine di tutto il corso: la vista della memoria nel debugger, e ora questo.", "sh", { wide: true }),

    H("Passo 4: il bundle", "Un solo file ZIP con tutto ciò che serve allo Store."),
    K("Confezionare", `python3 -m prg32 store pack-bundle \\
    --manifest ~/verm1/manifest.json --out ~/verm1/verm1-1.0.0.zip

Bundle: ~/verm1/verm1-1.0.0.zip
  manifest.json                   0.7 KB
  icon.png                        0.1 KB
  verm1-esp32c6.prg32             7.8 KB
  verm1-qemu.prg32                7.8 KB
Total: 16.4 KB`, [
      "Lo strumento legge il manifest e raccoglie i file che nomina",
      "Un file mancante o con il nome sbagliato lo ferma qui, non allo Store",
      "Il nome porta la versione: verm1-1.0.0.zip",
      "Il vostro intero gioco, per due macchine: 16 kilobyte",
    ], "Output reale per il gioco di riferimento, da tools/tests/verm1_store.py. I file devono stare nella stessa cartella del manifest.", "sh", { wide: true }),
    X("Eseguite: provate il bundle, non la vostra cartella", [
      "Estraete verm1-1.0.0.zip in una cartella vuota",
      "In PRG32-QT importate verm1-esp32c6.prg32 da quella cartella ed eseguitelo: titolo, icona e crediti devono essere i vostri",
      "Caricate verm1-qemu.prg32 su QEMU e giocate una partita",
      "Se avete un kit, caricate il file per ESP32-C6 e giocate con il joystick vero",
      "Chiedete a un collega di fare lo stesso su un altro calcolatore: il primo utente che non siete voi",
    ], "Il gioco gira dai file contenuti nel bundle, su ogni target dichiarato, su un calcolatore che non è il vostro.",
      "Provare i file confezionati, e non quelli della cartella di lavoro, intercetta l'errore classico: un bundle costruito prima dell'ultima correzione."),

    H("Passo 5: la pubblicazione", "Un token, un comando, e una revisione."),
    K("Pubblicare", `# 1. sign in to the Store and create a token on the Tokens page
# 2. keep it in the environment of your shell: never in a file, never in Git
export PRG32_STORE_URL="https://store.prg32.uniparthenope.it"
export PRG32_STORE_TOKEN="paste-your-token-here"

# 3. submit
python3 -m prg32 store publish-bundle ~/verm1/verm1-1.0.0.zip \\
    --store-url "$PRG32_STORE_URL" --token "$PRG32_STORE_TOKEN"`, [
      "Il token siete voi: chi lo possiede pubblica a vostro nome",
      "È un segreto: non nel sorgente, non in una schermata",
      "L'invio resta in attesa finché un redattore non lo approva",
      "Perso o mostrato per errore: revocatelo e createne uno nuovo",
    ], "È l'unico passo che non è stato eseguito per queste slide: richiede un account personale. Fatelo dal vivo con un volontario, con il token del volontario, e non proiettate mai il token.", "sh", { wide: true }),
    S("Che cosa succede dopo", [
      ["In attesa", "Il vostro bundle è conservato come invio: non è ancora sullo scaffale"],
      ["Revisione", "Un redattore controlla che si installi, giri, sia descritto onestamente e non contenga nulla che non sia vostro"],
      ["Pubblicato", "Il gioco compare nello Store, per le architetture che avete dichiarato"],
      ["Un errore?", "Correggetelo, portate la versione a 1.0.1, confezionate e inviate di nuovo: la 1.0.0 resta com'era"],
    ], "La moderazione protegge i giocatori e gli autori. Un rifiuto arriva con una motivazione: rispondete con una nuova versione."),
    G("La lista di controllo per l'invio", ["", "Controllo"], [
      ["1", "Il gioco è stato giocato fino alla fine su ogni architettura del manifest"],
      ["2", "cartridge summary dice import_model: abi-table per ogni file"],
      ["3", "l'id è vostro e unico; la versione è nuova; titolo, summary e description dicono che cos'è il gioco"],
      ["4", "autori, licenza e colophon sono completi; ogni pezzo è vostro o è citato l'autore"],
      ["5", "inspect-metadata mostra id, versione e architettura giusti in ogni cartuccia"],
      ["6", "Il bundle è stato estratto e provato su un altro calcolatore"],
      ["7", "Il token non è in nessun file, in nessuna schermata e in nessun repository"],
    ], "Stampatela. Una lista di controllo non è burocrazia: è il modo in cui piloti e chirurghi evitano gli errori che commettono gli esperti.", { widths: [0.8, 12.2] }),

    Q("Avete pubblicato la versione 1.0.0 e trovato un errore. Che cosa fate?", ["caricate di nuovo la 1.0.0", "pubblicate la 1.0.1", "cambiate l'id", "chiedete che il vecchio file venga modificato"], 1, "Una versione pubblicata si considera permanente: una correzione è una nuova versione con lo stesso id."),
    Q("Perché metadata.json non contiene la voce architectures?", ["è facoltativa", "i metadati vanno dentro una cartuccia, che ha una sola architettura", "QEMU non la supporta", "sarebbe troppo lunga"], 1, "L'elenco dei file appartiene al bundle; una singola cartuccia dichiara la propria architettura, data sulla riga di comando."),
    Q("Dove va tenuto il token dello Store?", ["in verm1.S, come commento", "nel manifest", "in una variabile d'ambiente della vostra shell", "nel README del repository"], 2, "Un token è una credenziale: non va mai in un file condiviso o sotto controllo di versione."),
    X("La vostra release", [
      "Scegliete il vostro id e il vostro titolo, scrivete manifest e colophon per la vostra variante di Verm1",
      "Disegnate la vostra icona",
      "Compilate, allegate, ispezionate, confezionate: producete il vostro bundle e superate la lista di controllo con un collega come revisore",
      "Se volete il vostro gioco sullo scaffale: pubblicatelo, e mandate il link alla classe",
    ], "Un bundle del vostro gioco, rivisto da un collega con la lista di controllo.",
      "La pubblicazione è facoltativa e personale; il bundle è il prodotto da consegnare per il progetto."),
    T("Che cosa avete costruito in questo corso", [
      "Un gioco di seicento righe di assembly, da tre funzioni che si limitavano a ritornare",
      "Con esso, ogni livello della macchina: bit e numeri, porte e tabelle, stato e memoria, il processore, lo schermo, i dispositivi",
      "Un metodo: un passo eseguibile alla volta, e uno sguardo dentro ogni volta che qualcosa vi sorprende",
      "E l'ultimo passo che ne fa ingegneria: un prodotto con un nome, una versione e un autore",
      "Il prossimo gioco sceglietelo voi; la prossima lezione mostra dove le stesse istruzioni girano su grande scala",
    ], "Il progetto finisce qui; la Lezione 24 guarda oltre il kit, alle macchine che eseguono le stesse istruzioni su grande scala. I prodotti del progetto sono il sorgente della variante dello studente e il suo bundle; l'esame orale può partire da una qualunque delle sue righe."),
  ],
});
