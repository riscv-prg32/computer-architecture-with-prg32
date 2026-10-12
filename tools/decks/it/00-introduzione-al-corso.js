// Italian version of decks/en/00-course-introduction.js: same slides, same listings, text in Italian.
// Lecture 00 - Course introduction.
// Source: 00-Architettura_dei_Calcolatori-Introduzione_al_corso.pptx (translated, reorganised, PRG32-first).
Deck({
  n: "00", file: "00-Architettura_dei_Calcolatori-Introduzione_al_Corso",
  title: "Introduzione al corso", short: "Introduzione al corso",
  sub: "Architettura dei Calcolatori e Laboratorio (ARC12): prima si programma, poi si formalizza",
  quote: ["Matrix è un sistema, Neo. E quel sistema è nostro nemico.", "Matrix, Lana e Lilly Wachowski, 1999"],
  cover: "prg32_logo.png",
  notes: "Lezione di apertura. I dati amministrativi (orario, valutazione) vengono dalla presentazione 2026/27; da quest'anno la prova intercorso è una sola, con dieci domande e due esercizi. Le date ancora indicate come «da definire» vanno inserite prima della lezione.",
  slides: [
    O("Oggi", [
      "Chi siamo, e come sono organizzate le 96 ore del corso",
      "L'approccio: prima programmate, poi formalizziamo",
      "La macchina: PRG32, RISC-V e il debugger che userete ogni settimana; la prossima volta li installiamo insieme",
      "Il progetto: Verm1, un gioco che scrivete partendo da un file vuoto e che pubblicate",
      "Le regole: orario, prova intercorso, esame, materiale",
    ], "Cinque parti, circa dieci minuti ciascuna. L'ultima è quella su cui gli studenti fanno domande: dire subito che arriva alla fine."),
    C("Il corso in breve", [
      ["Nome", "Architettura dei Calcolatori e Laboratorio di Architettura dei Calcolatori (ARC12). Primo anno, primo semestre, Corso di Laurea in Informatica."],
      ["Docenti", "Raffaele Montella: lezioni, 6 CFU.\nMariacarla Staffa: laboratorio, 6 CFU."],
      ["Crediti", "12 CFU, 96 ore.\nSettore scientifico: INFO-01/A (Informatica)."],
      ["Ricevimento", "Stanza 420, martedì 14:00-16:00, su appuntamento. Anche su Microsoft Teams (codice del team: c7rf33g)."],
      ["Crediti aggiuntivi", "Accenture SuperSkills! dà 2 CFU come ulteriori conoscenze: richiediaccesso.uniparthenope.it"],
      ["Prerequisiti", "Nessuno. L'unico vero prerequisito è la passione per l'informatica e per le tecnologie che la rendono possibile."],
    ], "Link di Teams dalla presentazione originale: https://teams.microsoft.com/l/channel/19%3Af4f24e8de71f424395ba903febdc4766%40thread.tacv2/General?groupId=09ae05f6-46f6-4441-ab7b-7522f88007d5 . Il codice del team c7rf33g viene dal Syllabus ufficiale e può cambiare: annunciare in aula ogni variazione. Accenture SuperSkills: https://richiediaccesso.uniparthenope.it/reservations?type=J"),
    V("Come sono organizzate le 96 ore",
      ["Lezioni: 48 ore (prof. Montella)", ["Le idee: informazione, numeri, algebra di Boole, reti logiche, processore, memoria, ingresso e uscita", "Ogni argomento si apre con un programma che potete eseguire", "Poi lo formalizziamo con definizioni, metodi e dimostrazioni", "Ogni lezione si chiude con domande a risposta multipla nello stile della prova intercorso", "Ogni quattro lezioni un tutorial: la parte successiva di Verm1, il gioco del corso"]],
      ["Laboratorio: 48 ore (prof.ssa Staffa)", ["Rappresentazione dei numeri e tecniche di conversione", "Analisi, sintesi e minimizzazione di circuiti logici", "Programmazione in assembly RISC-V sulla piattaforma PRG32", "Il vostro progetto: una variante di Verm1, o un gioco di vostra invenzione"]]),

    H("Un approccio nuovo", "Scriverete assembly fin dai primi giorni. La teoria viene dopo, a spiegare ciò che avete già visto accadere."),
    B("Prima si programma. Poi si formalizza.", "Dal primo giorno scrivete assembly RISC-V che gira su un processore vero. Ogni argomento formale risponde poi a una domanda che il vostro stesso programma ha già sollevato."),
    F("La spirale dell'apprendimento, ripetuta per ogni argomento", [
      "Gioca|Scrivete poche istruzioni, compilate una cartuccia, eseguitela su PRG32",
      "Osserva|Qualcosa accade: un numero fa il giro, un bit accende una lampada, un rettangolo si muove",
      "Formalizza|Definizioni, teoremi e metodi spiegano esattamente perché",
      "Ritorna|Di nuovo sulla macchina: prevedete il risultato prima di eseguire",
    ], "Un voto è un'opinione; una racchetta che esce dallo schermo è un fatto. Useremo i fatti, e poi li spiegheremo."),
    T("Gli obiettivi del corso", [
      "Presentare gli aspetti fondamentali dell'architettura dei calcolatori moderni",
      "Usare, in laboratorio, i concetti di base per programmarli in modo efficiente con linguaggi di basso livello: linguaggio macchina e assembly",
      ["Trattare con rigore gli strumenti con cui il processore è costruito", ["algebra di Boole e sintesi di reti logiche combinatorie e sequenziali", "rappresentazione binaria e aritmetica binaria"]],
      "Descrivere in dettaglio la struttura funzionale e fisica della CPU, della memoria e del sottosistema di ingresso/uscita",
      "Sviluppare codice assembly che renda visibile come funziona davvero un processore e come interagiscono le unità di base di un calcolatore",
    ], null, { img: "game_pong.png", cap: "Pong in esecuzione su PRG32: codice macchina RISC-V nativo" }),

    H("PRG32 e RISC-V", "La macchina che programmerete, le idee che la ispirano, e perché l'abbiamo scelta."),
    T("PRG32: una console rétro da programmare in assembly", [
      "Un ambiente didattico open source per insegnare l'assembly RISC-V e il C, sviluppato alla Parthenope",
      "Il vostro codice gira in modo nativo come codice macchina RISC-V a 32 bit (RV32IMAC): non è interpretato da un simulatore",
      ["Un contratto volutamente sottile: tre funzioni che scrivete voi", ["init viene eseguita una volta; update e draw una volta per frame"]],
      "I giochi viaggiano come piccole cartucce: file con estensione .prg32",
      "Un'area di 320 per 200 pixel, un joystick, il suono: abbastanza piccola da tenerla tutta in mente, abbastanza ricca da esercitare l'intero corso",
    ], "PRG32: https://github.com/riscv-prg32/PRG32 . Libro di testo: https://github.com/riscv-prg32/Playing-with-RISC-V_PRG32_textbook", { img: "menu_main.png", cap: "Il menu del firmware residente di PRG32" }),
    C("La filosofia di PRG32", [
      ["Abbastanza piccola da capirla", "Un processore, uno schermo di 320 per 200 pixel, un joystick, un piccolo altoparlante. Niente è nascosto: l'intera macchina sta in una testa sola."],
      ["Vera, non simulata", "Le vostre istruzioni sono quelle che il chip esegue. Ciò che imparate qui vale su ogni processore RISC-V, dal sensore al supercalcolatore."],
      ["I limiti rendono creativi", "Pochi kilobyte e tre funzioni. I giochi degli anni Ottanta sono nati da limiti come questi: un vincolo è un invito."],
      ["Una cosa alla volta", "Si parte da funzioni che ritornano e basta. Si aggiunge una cosa, si esegue, si guarda. Update cambia lo stato, draw lo mostra. Il suono viene per ultimo."],
      ["Guardare dentro", "Quando qualcosa vi sorprende, fermate il programma e leggete registri e memoria. Il debugger fa parte del metodo: non è uno strumento d'emergenza."],
      ["Fare, poi condividere", "Una cartuccia è un file che potete dare a un amico. Il Cartridge Store è lo scaffale dove il lavoro finito incontra i suoi giocatori."],
    ], "I principi di progetto sono quelli del libro di PRG32: partire da funzioni che ritornano senza fare nulla; aggiungere una cosa alla volta; update cambia lo stato e draw lo disegna; il suono viene per ultimo. Il corso li segue alla lettera nel progetto."),
    V("Una piattaforma, due usi",
      ["Una palestra: gli esercizi", ["Ogni lezione si apre con un breve programma che gira, e si chiude tornando alla macchina", "Un esercizio ha una previsione e una verifica: dite che cosa accadrà, poi eseguite", "La macchina non lusinga mai: una maschera sbagliata accende la lampada sbagliata", "Passi piccoli, risposte immediate, nessun voto"]],
      ["Un'officina: la creatività", ["Una cartuccia vuota e uno schermo: che cosa metterci lo scegliete voi", "Regole, colori, suoni e livelli sono decisioni di progetto, e sono vostre", "Il progetto del corso comincia guidato e finisce libero", "Ciò che finite, lo potete pubblicare"]],
      "PRG32 non è soltanto il posto dove girano gli esercizi del corso: è un posto dove si costruiscono cose. Insistere sulla seconda colonna: gli studenti del primo anno raramente si aspettano che un corso di architettura chieda loro un'idea."),
    T("PRG32-QT: il debugger del corso", [
      "PRG32-QT è PRG32 sul vostro portatile: esegue le stesse cartucce, senza scheda e senza compilatore",
      ["In modalità debug apre la macchina", ["pausa, ripresa, un'istruzione alla volta", "breakpoint su qualunque istruzione di init, update o draw", "i 32 registri e 128 byte di memoria a qualunque indirizzo", "velocità da 0,01x a 4x, e contatori: frame, istruzioni, frame in ritardo"]],
      "Lo userete in ogni lezione: per verificare una previsione, per trovare un errore, per misurare",
      "Un programma è capito quando sapete dire che cosa conterrà ogni registro prima di premere Step",
    ], "Settings, Run cartridges in RISC-V debug mode. La Lezione 01 lo installa; la stessa cartuccia gira anche sul kit e sull'emulatore QEMU, e la Lezione 01 confronta i tre. Il debugger si usa dalla Lezione 02 e in modo sistematico nei tutorial di Verm1: ognuno ha una sezione di debug con una procedura precisa.", { img: "prg32qt_debugger.png", cap: "PRG32-QT in modalità debug: a sinistra il gioco, a destra la macchina", wide: true }),
    C("Perché RISC-V?", [
      ["Aperto", "RISC-V è un insieme di istruzioni a standard aperto: chiunque può progettare, costruire e vendere un processore RISC-V senza pagare licenze per l'architettura."],
      ["Piccolo", "L'insieme di base delle istruzioni intere ha circa quaranta istruzioni e trentadue registri. Si impara tutto in un semestre."],
      ["Vero", "addi, lw, sw e beqz non sono un dialetto didattico. L'industria produce miliardi di core RISC-V che eseguono esattamente queste istruzioni."],
      ["Europeo", "L'Europa considera RISC-V una leva di sovranità tecnologica: il Chips Act e progetti come DARE vi costruiscono sopra i propri processori."],
    ], "DARE: Digital Autonomy with RISC-V in Europe, progetto della EuroHPC Joint Undertaking. Per l'argomentazione completa e le fonti si veda il capitolo 1 del libro di PRG32."),
    G("La mappa: ogni argomento si incontra due volte", ["Argomento formale", "Lo incontrate prima su PRG32 come..."], [
      ["Notazione posizionale, esadecimale", "il colore 0x07E0 e il valore mostrato dal debugger"],
      ["Complemento a due, overflow", "una posizione che va a sinistra oltre lo zero e mostra 0xFFFFFFFF"],
      ["Virgola fissa e virgola mobile", "una palla che si muove di 0,375 pixel per frame su un chip senza FPU"],
      ["Algebra di Boole, maschere di bit", "andi t3, t0, 1 per sapere se LEFT è premuto"],
      ["Elettronica, porte logiche", "il pulsante che collega a massa un piedino del chip"],
      ["Reti combinatorie, addizionatori", "che cosa fa davvero add a trentadue bit"],
      ["Reti sequenziali, registri", "il contatore che sopravvive da un frame al successivo"],
      ["CPU, datapath, ciclo dell'istruzione", "l'esecuzione di una singola istruzione in PRG32-QT"],
      ["Memoria e ingresso/uscita", "lw e sw, lo stack, il joystick e il display"],
    ], "Questa tabella è il corso in una slide. Riprenderla all'inizio di ogni blocco.", { widths: [4.6, 7.6] }),

    H("Il progetto del corso: Verm1", "Un solo gioco, scritto da zero in assembly RISC-V, che cresce insieme al corso."),
    T("Verm1: il vostro gioco, da un file vuoto", [
      "Verm1, si legge \"vermone\": un omaggio a Snake, il gioco di Blockade (1976) e dei telefoni Nokia (1997)",
      "Un verme si muove su una griglia, mangia, cresce, e non deve mordersi",
      "Scrivete ogni riga, in assembly RISC-V: nessun motore, nessuna libreria oltre alle chiamate di PRG32",
      "Abbastanza piccolo per uno studente del primo anno, abbastanza ricco da richiedere ogni argomento del corso",
      "Alla fine è pronto per il Cartridge Store, con il vostro nome sopra",
    ], "Il progetto è il filo del corso: ogni parte usa esattamente ciò che le quattro lezioni precedenti hanno insegnato. L'implementazione di riferimento di Verm1 è un contributo di Giuseppe Coviello; i sorgenti sono nella cartella verm1 del materiale del corso e sono compilati e giocati automaticamente dai test.", { img: "verm1_p4_play.png", cap: "Verm1 alla fine del corso" }),
    G("Quattro parti e una pubblicazione", ["Lezione", "Dopo il blocco su", "Verm1 acquista", "Con"], [
      ["07  Parte 1", "informazione e numeri", "una griglia, una testa che si muove, un mondo senza bordi", "colori, scorrimenti, virgola fissa"],
      ["12  Parte 2", "logica e circuiti", "la guida, il cibo, un punteggio", "maschere, XOR, tabelle"],
      ["17  Parte 3", "stato e memoria", "un corpo che cresce, le collisioni, tre schermate", "una macchina a stati, vettori"],
      ["22  Parte 4", "la macchina", "cifre, livelli, suono, disegno veloce", "chiamate, divisione, frame buffer"],
      ["23  Lo Store", "tutto il corso", "un nome, un'icona, i crediti, un bundle", "gli strumenti di PRG32"],
    ], "Una presentazione su cinque è un tutorial. I numeri sono quelli delle lezioni: 07, 12, 17 e 22 per le quattro parti, 23 per la pubblicazione.", { widths: [1.9, 2.9, 5.0, 3.4], caption: "Ogni parte finisce con un gioco che funziona. Non tornate mai a casa con un programma rotto." }),
    I("Verm1 cresce con voi", [["verm1_p1.png", "Parte 1: una testa"], ["verm1_p2.png", "Parte 2: cibo e punteggio"], ["verm1_p3_play.png", "Parte 3: un corpo"], ["verm1_p4_play.png", "Parte 4: il gioco finito"]],
      "Schermate prodotte dai programmi di riferimento con i test automatici del materiale del corso.", "Lo stesso file, quattro sedute. Ogni immagine è un programma che avrete scritto ed eseguito voi."),
    S("Come funziona una lezione tutorial", [
      ["Autosufficiente", "La presentazione mostra l'intero programma: ogni riga è nuova, modificata, oppure ristampata invariata"],
      ["Passo per passo", "Poche righe alla volta; dopo ogni passo si compila, si esegue e si confronta con il risultato atteso"],
      ["Con il debugger", "Ogni tutorial ha una sessione in PRG32-QT: un breakpoint, un registro da osservare, una zona di memoria da leggere"],
      ["Vostro", "Ognuno finisce con modifiche da fare da soli: il gioco che pubblicate non deve essere identico al nostro"],
    ], "Se all'inizio di un tutorial il programma di uno studente non funziona, si parte dal file di riferimento della parte precedente: un bug non lascia indietro nessuno."),
    G("Il corso a blocchi", ["Blocco", "Lezioni", "Poi"], [
      ["Avvio", "00 Introduzione, 01 PRG32 e PRG32-QT: installazione, 02 Primo contatto con RISC-V", ""],
      ["Informazione", "03 Storia, 04 Informazione digitale, 05 Interi, 06 Reali", "07 Verm1, parte 1"],
      ["Logica", "08 e 09 Algebra di Boole, 10 Elettronica, 11 Macchine combinatorie", "12 Verm1, parte 2"],
      ["Stato e memoria", "13 Macchine sequenziali, 14 Registri e bus, 15 Memoria, 16 Memoria permanente", "17 Verm1, parte 3"],
      ["La macchina", "18 Processore, 19 Istruzioni e interruzioni, 20 Scheda video, 21 Ingresso e uscita", "22 Verm1, parte 4"],
      ["Pubblicazione", "", "23 Verm1 sul Cartridge Store"],
      ["Prospettive", "24 Oltre il singolo core: RISC-V superscalare, HPC, GPU e FPGA", "la visita ai sistemi di calcolo"],
    ], "L'ordine è scelto per l'apprendimento: prima che cosa significa un bit, poi come i bit si combinano, poi come si ricordano, poi la macchina che fa le tre cose; il processore viene prima dei dispositivi che pilota. Dopo ogni blocco il progetto lo mette in pratica. L'ultima lezione è uno sguardo in avanti, prima della visita ai sistemi di calcolo del Dipartimento.", { widths: [2.4, 7.9, 2.9] }),

    H("Programma e risultati di apprendimento", "Che cosa studiamo, e che cosa saprete fare alla fine."),
    C("Programma", [
      ["Organizzazione del calcolatore", "Hardware e software; software applicativo e di sistema; il modello di von Neumann; principi di funzionamento di un calcolatore."],
      ["Algebra di Boole e logica", "Funzioni booleane, tabelle di verità; reti combinatorie e minimizzazione; addizionatori; macchine a stati finiti; reti sequenziali; flip-flop, registri."],
      ["Rappresentazione dei dati", "Codifica; codici ridondanti, rilevazione e correzione d'errore; decodificatori, multiplexer; sistemi posizionali; naturali, interi, reali; aritmetica."],
      ["Struttura di un calcolatore", "CPU: unità di controllo, ALU, registri; ciclo dell'istruzione; datapath; memoria centrale; sottosistema di I/O; architetture microprogrammate."],
      ["Assembly RISC-V", "Insieme delle istruzioni; registri, indirizzamento; aritmetica e logica; salti; sottoprogrammi, convenzione di chiamata, stack; memoria e I/O."],
      ["Progetto", "Verm1: un gioco in assembly RISC-V su PRG32, costruito in quattro parti guidate, poi variato, documentato e impacchettato dallo studente o da un piccolo gruppo."],
    ], "Il programma dettagliato è nel file Syllabus disponibile su U-GOV / Esse3 e su https://elearning.uniparthenope.it ."),
    C("Risultati di apprendimento", [
      ["Conoscenza e comprensione", "Una solida conoscenza del sistema binario, della logica digitale e dei principi di funzionamento dei calcolatori. Non si presuppongono conoscenze informatiche precedenti."],
      ["Applicare le conoscenze", "Applicare la teoria agli esercizi e a programmi in assembly RISC-V; riconoscere capacità e limiti dei calcolatori su problemi reali."],
      ["Autonomia di giudizio", "Scrivere programmi assembly che rappresentano ed elaborano problemi reali in binario, scegliendo rappresentazioni dei dati e strutture di controllo adatte."],
      ["Abilità comunicative", "Partecipare attivamente a gruppi che progettano, realizzano e documentano applicazioni assembly, con la terminologia tecnica corretta."],
      ["Capacità di apprendere", "Collegare rappresentazione, reti logiche e processori in un unico quadro, e aggiornarsi in autonomia su fonti tecniche affidabili."],
    ]),

    H("Organizzazione e valutazione", "Quando ci vediamo, come siete valutati, e le regole del gioco."),
    G("Orario: da settembre a dicembre 2026", ["Giorno", "Ora", "Aula", "Docente"], [
      ["Lunedì", "14:00 - 16:00", "Aula 1", "Montella"],
      ["Martedì", "09:00 - 11:00", "Aula 1", "Staffa"],
      ["Mercoledì", "09:00 - 11:00", "Aula 1", "Montella"],
      ["Venerdì", "09:00 - 11:00", "Aula 1", "Staffa"],
    ], "Condivideremo un calendario interno con la distribuzione effettiva di lezioni e laboratori.", { widths: [3, 3, 3, 3], caption: "Sarà condiviso un calendario interno con la distribuzione effettiva di lezioni e laboratori." }),
    T("Una sola prova intercorso", [
      "Risposta multipla, dieci domande, più due esercizi: circa 45 minuti, in presenza e su carta",
      ["Lunedì, data da definire, 14:00-16:00, Aula 1", ["Gli studenti potranno essere divisi in gruppi e la prova svolta a turni"]],
      "Portate un documento d'identità e una penna; dovete conoscere la vostra e-mail istituzionale e la matricola (chi è in trasferimento e non l'ha ancora è giustificato)",
      "La prova valuta entrambe le parti, voi e noi: ci serve per sapere dove stiamo andando",
      "Ogni lezione finisce con domande dello stesso tipo: la preparazione migliore è rispondere settimana per settimana",
    ], "Una sola prova intercorso dal 2026/27 (erano due). La data è da definire: inserirla. Il peso della prova si decide dopo aver valutato il comportamento corretto degli studenti in aula. Le regole di prenotazione non sono sulla slide: dirle in aula, se ci sono.", { big: "10 + 2", label: "domande a risposta multipla più due esercizi, su carta, in circa 45 minuti" }),
    G("Che cosa copre la prova intercorso", ["Blocco", "Lezioni", "Argomenti"], [
      ["Informazione", "da 03 a 06", "storia del calcolo; informazione digitale; rappresentazione dei numeri: interi e reali"],
      ["Logica", "da 08 a 11", "algebra di Boole; elettronica e porte logiche; macchine combinatorie"],
      ["Stato e memoria", "da 13 a 16", "macchine sequenziali: latch, flip-flop, macchine a stati; registri e bus; memoria e memoria permanente"],
      ["Fuori dalla prova", "da 18 a 24", "processore, istruzioni e interruzioni, scheda video, ingresso e uscita, prospettive: fanno parte dell'orale"],
    ], "Da quest'anno negli esempi della prova compaiono istruzioni RISC-V: il materiale di primo contatto della Lezione 02 si dà per acquisito, e il codice di Verm1, parti da 1 a 3, è una fonte naturale di domande. La prova cade dopo il terzo blocco.", { widths: [2.7, 1.8, 8.5], hi: { 3: P.amberSoft }, caption: "La prova intercorso chiude i primi tre blocchi. La macchina, Lezioni da 18 a 21, si esamina all'orale." }),
    B("Niente tecnologia. Niente GPT.", "La prova intercorso e l'esame sono #nogpt. Nessun aiuto tecnologico o umano di alcun tipo: niente dispositivi, niente ChatGPT o altri LLM, niente IA generativa. Chi copia vede annullata subito la propria prova; comportamenti più gravi hanno conseguenze più gravi.",
      "Se per comportamento inadeguato si devono annullare più di due prove, l'intera prova intercorso è annullata per tutti."),
    T("Valutazione", [
      ["L'esame ha due parti e vanno superate entrambe", ["Teoria (50%): orale, con domande estemporanee su tutto il programma; alcune risposte richiedono uno schema o un calcolo alla lavagna", "Pratica (50%): l'esame di laboratorio con la prof.ssa Staffa"]],
      "L'orale può anche abbassare il voto ottenuto nella prova intercorso",
      "Voto finale = media del voto di teoria e del voto di pratica",
    ], "I risultati della prova intercorso e dell'esame valgono per l'anno accademico in corso. Il Syllabus ufficiale descrive la parte scritta come esercizi di analisi e sintesi di reti logiche e di sviluppo in assembly RISC-V su PRG32. Come la prova intercorso entra nel voto di teoria si dice in aula: la slide non dà una formula.", { big: "50 + 50", label: "teoria e pratica: due parti, da superare entrambe" }),
    T("Appelli e verbalizzazione", [
      "Per verbalizzare serve un voto positivo sia in teoria sia in pratica",
      "La verbalizzazione avviene solo durante un appello di teoria",
      "L'esame di laboratorio con la prof.ssa Staffa è di solito una settimana prima dell'appello di teoria",
      "Prenotate entrambi gli appelli su uniparthenope.esse3.cineca.it",
      ["Domande frequenti", ["Posso sostenere la teoria prima di aver superato la pratica? Sì: il risultato della prova intercorso vale per un anno accademico, ma si verbalizza solo dopo aver superato la parte pratica", "Posso prenotare l'appello di teoria senza la prova pratica? Sì, il caso è lo stesso"]],
    ], "Nella presentazione originale le date degli appelli erano vuote: aggiungerle quando sono pubblicate."),
    T("La settimana della prova e l'evento finale", [
      "Nella settimana della prova intercorso, seminari sulle architetture di calcolo emergenti",
      "Lo studente o il gruppo che presenta il proprio gioco alla cerimonia di chiusura può guadagnare punti bonus per l'esame: la vostra variante di Verm1, o un gioco vostro",
      ["Chiusura del corso: data da definire, 09:00-13:00, Aula 1", ["09:00-11:00 l'ultima lezione: oltre il singolo core, da RISC-V superscalare ai supercalcolatori", "11:00-13:00 visita ai sistemi di supercalcolo del Dipartimento di Scienze e Tecnologie"]],
      "I giochi finiti si possono pubblicare sul Cartridge Store di PRG32: la Lezione 23 mostra come",
    ], "La presentazione originale riportava ancora le date del 2025 (24-28 novembre, 19 dicembre 2025) e parlava di un'architettura a 8 bit: entrambe aggiornate qui, date da confermare.", { img: "verm1_p4_play.png", cap: "Verm1: il gioco che potete presentare, nella vostra variante" }),

    H("Materiale e primo contatto", "Dove si trova tutto, e un primo sguardo a chi c'è in aula."),
    T("Materiale didattico", [
      ["Slide", ["sempre condivise su Google Drive; pubblicate periodicamente su elearning.uniparthenope.it"]],
      ["Piattaforma PRG32 e relativo libro (liberi, open source)", ["github.com/riscv-prg32/PRG32", "Playing with RISC-V: Assembly, C, and Retro Games on the PRG32 Platform"]],
      ["Libri di testo", ["Patterson, Hennessy: Struttura e progetto dei calcolatori, edizione RISC-V", "Tanenbaum, Austin: Architettura dei calcolatori. Un approccio strutturale", "Nel Syllabus anche: Stallings, Computer Organization and Architecture; Bucci, Architettura dei calcolatori elettronici"]],
      "Documentazione ufficiale di RISC-V: riscv.org",
    ], "Cartella Drive: https://drive.google.com/drive/folders/15Kdu8XYbQQVP0ieuZA5OIEmoKqDjQ-eR?usp=sharing . E-learning: https://elearning.uniparthenope.it/course/view.php?id=107 . Edizioni originali: Patterson, Hennessy, Computer Organization and Design, RISC-V Edition (Morgan Kaufmann); Tanenbaum, Austin, Structured Computer Organization (Pearson). Edizioni italiane: Zanichelli e Pearson.", { img: "book_patterson.jpg", cap: "Patterson, Hennessy: edizione RISC-V (traduzione italiana, Zanichelli)" }),
    T("Creative Commons e materiale condiviso", [
      "Queste slide e tutto il materiale didattico stanno in una cartella Google Drive condivisa con gli studenti, che possono contribuire",
      "Periodicamente il materiale viene consolidato e pubblicato sul portale e-learning del Dipartimento",
      "Per avere accesso, inviate il vostro indirizzo Gmail (o un altro indirizzo collegato al servizio) a raffaele.montella@uniparthenope.it",
      "Tutte le comunicazioni con il docente passano comunque dall'indirizzo istituzionale @studenti.uniparthenope.it",
      "Le slide sono generate da sorgente: correzioni e nuovi esercizi sono contributi benvenuti",
    ], "Le presentazioni sono generate da tools/build.js a partire da specifiche compatte in tools/decks, in inglese e in italiano; ogni slide ha una nota didattica nella cartella notes."),
    C("Primo contatto: chi siete?", [
      ["Hardware", "Chi ha assemblato da sé il proprio computer? Chi ha già giocato con un Arduino o un ESP32?"],
      ["Software", "Quanti linguaggi di programmazione conoscete? Qualcuno ha mai letto una riga di assembly?"],
      ["Cultura", "Che cosa sono il retrocomputing e il retrogaming? Avete mai visitato un museo dell'informatica?"],
      ["Concetti", "Chi sa dire la differenza tra ROM, RAM e memoria di massa? Che cos'è il cloud computing? E l'Internet delle cose?"],
      ["RISC-V", "Chi ha sentito parlare di RISC-V? Quale processore c'è nel vostro telefono, nel portatile, nel router?"],
      ["Voi", "Hobby? Passioni? Passatempi, oltre allo studio?"],
    ], "Per rompere il ghiaccio. Rapido; annotare le risposte: dicono a che velocità può andare la Lezione 02."),
    D("Il Cappello Parlante (fase 1)", (s, h) => {
      h.card(s, h.MX, h.TOP, 5.2, h.BOT - h.TOP, P.ink);
      h.img(s, "sorting_hat.png", h.MX + 0.15, h.TOP + 0.15, 4.9, h.BOT - h.TOP - 0.3);
      h.rows(s, ["Un breve questionario: che cosa vi attrae di più nel futuro dell'informatica e della scienza?", "Inquadrate il codice o aprite il link dalla cartella condivisa", "I risultati, anonimi, si discutono in aula e servono a calibrare esempi e progetti"], 6.3, h.TOP, 6.4, 3.4);
      h.card(s, 6.3, 5.2, 6.4, 1.55, P.tealSoft);
      h.tx(s, "https://forms.office.com/Pages/ResponsePage.aspx\n?id=rhZ-ARX0jU-a8KIbV81EjtQ3ybGbf6pBqasTaUHJdQ1\nUQUFaVEdZMkZYWFI3S0dJWVlOMDVOSFBCTS4u", { x: 6.5, y: 5.3, w: 6.0, h: 1.35, fontSize: 12, fontFace: h.MONO, color: P.steel, valign: "middle" });
    }, "L'immagine riporta la domanda: «Cosa ti attrae di più nel futuro dell'Informatica e della Scienza?»"),
    D("Cineforum: trenta film e serie sull'informatica", (s, h) => {
      const films = ["The Social Network (2010)", "Steve Jobs (2015)", "Pirates of Silicon Valley (1999)", "The Imitation Game (2014)", "Hackers (1995)", "Ex Machina (2014)", "Her (2013)", "Tron (1982)", "Tron: Legacy (2010)", "The Matrix (1999)",
        "WarGames (1983)", "Sneakers (1992)", "Jobs (2013)", "Antitrust (2001)", "Blackhat (2015)", "The Fifth Estate (2013)", "The Circle (2017)", "Silicon Valley (2014-2019)", "Source Code (2011)", "Chappie (2015)",
        "Mr. Robot (2015-2019)", "Ghost in the Shell (1995)", "Minority Report (2002)", "Transcendence (2014)", "Ready Player One (2018)", "A.I. Artificial Intelligence (2001)", "Revolt (2017)", "The Thirteenth Floor (1999)", "Eagle Eye (2008)", "Terminator 2: Judgment Day (1991)"];
      const cw = (h.CW - 0.6) / 3;
      for (let c = 0; c < 3; c++) {
        const x = h.MX + c * (cw + 0.3);
        h.card(s, x, h.TOP, cw, h.BOT - h.TOP);
        h.tx(s, films.slice(c * 10, c * 10 + 10).map((f, i) => ({ text: `${String(c * 10 + i + 1).padStart(2, " ")}.  ${f}`, options: { breakLine: i < 9 } })),
          { x: x + 0.3, y: h.TOP + 0.25, w: cw - 0.5, h: h.BOT - h.TOP - 0.5, fontSize: 16, paraSpaceAfter: 9, valign: "middle" });
      }
    }, "Ready Player One è anche il riferimento culturale del libro di PRG32: la padronanza degli strati di base è un'alfabetizzazione che conserva il suo valore."),
    X("Prima della prossima lezione: installiamo tutto insieme", [
      "Portate il portatile, carico, con i permessi per installare programmi",
      "Scaricate l'installatore di PRG32-QT per il vostro sistema: github.com/riscv-prg32/PRG32-QT, Releases",
      "A casa, con una buona connessione, avviate lo scaricamento lungo: ESP-IDF, seguendo il README di github.com/riscv-prg32/PRG32 per il vostro sistema",
      "Se qualcosa non va, non combattete da soli: portate il messaggio d'errore, lo risolviamo in aula",
      "Inviate il vostro indirizzo per la cartella condivisa e compilate il questionario del Cappello Parlante",
    ], "Arrivate alla Lezione 01 con gli scaricamenti fatti. In due ore ognuno esce con PRG32-QT funzionante e una cartuccia compilata sul proprio portatile.",
      "La Lezione 01 è l'installazione, passo per passo, per Windows, macOS e Linux. L'unica cosa che non si può fare in aula è scaricare ESP-IDF: qualche gigabyte per studente."),
  ],
});
