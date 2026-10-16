# Lezione 03: Storia della computazione

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: che cos'è l'informatica; l'architettura di von Neumann; RISC e un ISA aperto. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: l'algebra di Boole (Lezione 08). Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Slide 1: Storia della computazione

La lezione precedente ha eseguito un programma RISC-V; questa si chiede da dove venga quella macchina. Non è una cronologia da memorizzare. La storia è presentata come una sequenza di contributi concettuali, ciascuno dei quali aggiunge un'idea ancora incorporata nel chip del kit PRG32: la rappresentazione fisica, la procedura meccanizzata, il programma come dato, l'insieme ridotto di istruzioni, lo standard aperto. La citazione è il primo programma canonico, dal libro che ha introdotto il linguaggio C: da allora ogni programmatore comincia facendo dire ciao a una macchina, come lo studente ha fatto con HELLO PRG32.

## Slide 2: Che cosa saprete fare alla fine

Cinque risultati di apprendimento. Il primo è concettuale: definire l'informatica e spiegare perché non è la scienza dei calcolatori. Il secondo e il terzo sono storici: collocare su una linea del tempo le principali macchine e persone, e nominare le quattro unità dell'architettura di von Neumann, che si riconosceranno nella macchina già programmata. Il quarto spiega il nome del processore usato nel corso: che cosa significa RISC, e perché RISC-V è aperto. Il quinto colloca la disciplina tra scienza, ingegneria ed economia.

## Slide 3: Una definizione

La definizione ha tre componenti, ciascuna da soppesare. *Scienza applicata*: l'informatica impiega i risultati delle scienze di base per risolvere problemi. *Trattamento dell'informazione*: il suo oggetto è l'informazione, non la macchina. *Procedure automatiche*: il trattamento è svolto da procedure che non richiedono giudizio umano nella loro esecuzione. La parola italiana *informatica*, dal francese *information automatique*, lo esprime direttamente; l'inglese *computer science* mette lo strumento nel nome e invita a un equivoco, che l'osservazione attribuita a Edsger Dijkstra corregge: l'informatica non riguarda i calcolatori più di quanto l'astronomia riguardi i telescopi.

## Slide 4: Due anime, una disciplina

La disciplina ha due dimensioni complementari. L'informatica *teorica* ne studia i fondamenti: che cosa si può calcolare, a quale costo e con quali algoritmi, essendo un algoritmo un insieme finito di operazioni che trasforma un ingresso A in un'uscita B. L'informatica *applicata* costruisce le tecnologie e i sistemi informativi che permeano l'economia e la società, e deve gestirne i costi, tra cui il divario digitale tra chi ha accesso e competenze e chi no. Questo corso partecipa di entrambe: l'algebra di Boole è teoria, una cartuccia è applicazione, e il corso è costruito perché l'una illumini l'altra.

## Slide 5: Le origini: l'abaco e la macchina di Anticitera

Due dispositivi antichi illustrano la prima idea. Nell'abaco, romano o cinese, un numero è una configurazione di palline: i dati sono rappresentati fisicamente e le operazioni sono movimenti della mano. Il meccanismo di Antikythera, costruito in Grecia intorno al II o I secolo a.C., va oltre: un treno di ingranaggi calcola le posizioni del Sole e della Luna e prevede le eclissi. Un numero è l'angolo di una ruota, e il calcolo è incorporato nei rapporti tra gli ingranaggi. La frase sotto le immagini enuncia il principio che la prossima lezione svilupperà: la rappresentazione precede il calcolo.

## Slide 6: Il mondo islamico medievale (dal IX al XIII secolo)

Tra il IX e il XIII secolo il mondo islamico contribuisce strumenti, metodi e lessico. Strumenti: l'astrolabio e il torquetum, per l'astronomia. Metodi: al-Kindi elabora l'analisi delle frequenze, la prima tecnica sistematica di crittoanalisi. Macchine: il suonatore di flauto automatico dei fratelli Banu Musa e gli automi di al-Jazari sono guidati da sequenze intercambiabili, una forma precoce di programma. Lessico: *algoritmo* deriva dal nome di al-Khwarizmi, e *algebra* dal titolo del suo trattato.

## Slide 7: Dal 1600 al 1800: calcolatrici meccaniche e logica

Tra il 1600 e il 1800 corrono in parallelo due linee di sviluppo. La prima è il calcolo meccanico: i logaritmi di Napier, la macchina di Pascal che somma con propagazione automatica del riporto, la macchina di Leibniz per le quattro operazioni. La seconda è la logica: Leibniz descrive l'aritmetica binaria nel 1703, e nel 1854 Boole riformula la logica come un'algebra, proprio l'algebra studiata nelle Lezioni 08 e 09. Un terzo filo compare nel 1804: il telaio di Jacquard tesse un disegno memorizzato su schede perforate. Cambiando le schede, la stessa macchina svolge un compito diverso, che è l'essenza della programmabilità.

## Slide 8: L'Ottocento: Charles Babbage e Ada Lovelace

Charles Babbage progetta due macchine. La macchina alle differenze calcola automaticamente tavole matematiche. La macchina analitica è molto più ambiziosa, e i suoi componenti portano nomi che dovrebbero già suonare familiari: un *mulino* che esegue l'aritmetica, un meccanismo di controllo, un *magazzino* che conserva i numeri e un dispositivo di uscita, con programmi e dati forniti su schede perforate come nel telaio. Non fu mai completata. Per essa Ada Lovelace scrisse una procedura per calcolare i numeri di Bernoulli, pubblicata nel 1843; per questo è considerata la prima programmatrice della storia.

## Slide 9: Prima la teoria: Turing, Shannon e Nakajima

La teoria precede le macchine. Nel 1936 Alan Turing definisce una macchina astratta capace di eseguire qualsiasi calcolo, e con ciò dà un significato preciso alla nozione di calcolabilità. Negli anni Trenta Nakajima e Shannon mostrano che l'algebra di Boole descrive i circuiti costruiti con interruttori; è il ponte tra logica ed elettronica su cui poggia tutto il progetto digitale, e la ragione per cui l'algebra di Boole occupa due lezioni di questo corso. Nel 1941 Konrad Zuse completa lo Z3, il primo calcolatore funzionante controllato da un programma.

## Slide 10: John von Neumann: il programma memorizzato

La slide centrale della lezione. Nel 1945 von Neumann descrive un'architettura fondata su un'idea decisiva: programma e dati risiedono nella stessa memoria, così che un programma è esso stesso un dato. Lo schema mostra le quattro unità: la memoria; l'unità di controllo, che governa la sequenza delle operazioni; l'unità aritmetico-logica con il suo accumulatore; e ingresso e uscita. La Lezione 02 si può ora rileggere in questi termini: la ALU ha eseguito `addi`, la memoria conteneva sia `counter` sia la parola d'istruzione 0x00130313, e joystick e display sono ingresso e uscita. Il chip del kit resta, nell'essenziale, una macchina di von Neumann.

## Slide 11: Otto decenni di calcolatori

Otto decenni in un'unica immagine, dalle macchine della Seconda guerra mondiale ai calcolatori incorporati negli oggetti di tutti i giorni. Lette da sinistra a destra, le didascalie tracciano un progressivo cambiamento di scala: una macchina per una nazione, poi per molti utenti, poi una per dipartimento, una per persona, una in tasca, e infine calcolatori ovunque. Ogni decennio ha reso il calcolatore più piccolo, più economico e più vicino ai suoi utenti. La frase in fondo trae la conclusione: nessuna di queste transizioni ha alterato il principio del programma memorizzato.

## Slide 12: Microprocessori: da CISC a RISC a uno standard aperto

La tabella va letta come un dibattito tra due filosofie di progetto del processore. (I processori sono costruiti con *transistor*, minuscoli interruttori elettronici; la slide successiva li conta.) I primi microprocessori, e la famiglia x86 introdotta nel 1978, seguono l'approccio CISC: molte istruzioni, alcune di notevole complessità. Intorno al 1980 gruppi di ricerca a Berkeley e Stanford mostrarono che un piccolo numero di istruzioni semplici e regolari produce macchine più veloci; è il RISC, il calcolatore con insieme ridotto di istruzioni. ARM applicò l'approccio al progetto a basso consumo nel 1985. Nel 2010 il quinto progetto di Berkeley, RISC-V, fece l'ulteriore passo di rendere l'architettura dell'insieme di istruzioni uno standard aperto, che l'Europa considera oggi strategico.

## Slide 13: La legge di Moore in un numero

Un *transistor* è un minuscolo interruttore elettronico, il mattone di ogni chip (la Lezione 10 mostra come funziona). Nel 1971 l'Intel 4004, il primo processore su un solo chip, ne conteneva 2.300; un processore contemporaneo per portatili ne contiene decine di miliardi, circa dieci milioni di volte tanti. Per cinque decenni il numero è raddoppiato approssimativamente ogni due anni. È la legge di Moore, un'osservazione empirica su un'industria più che una legge di natura, e i suoi limiti fisici sono ormai vicini. Quando i transistor aggiuntivi non arrivano più senza costo, le prestazioni devono venire da architetture migliori. È per questo che l'argomento di questo corso conta oggi più di quanto contasse vent'anni fa.

## Slide 14: Lo spirito degli home computer, su una CPU aperta

Un confronto a quarant'anni di distanza. Il Commodore 64 aveva un processore a 8 bit con tre registri, un clock di circa 1 MHz e 64 KB di memoria; l'ESP32-C6 ha un processore a 32 bit con trentadue registri, un clock a 160 MHz e uno spazio di indirizzamento di 4 GB. Eppure lo schermo ha la stessa risoluzione, 320 per 200 pixel, e lo stesso spirito: una macchina abbastanza piccola da essere compresa per intero da una sola persona. La differenza più rilevante per lo studente sta nella riga dell'insieme di istruzioni: proprietario allora, standard aperto oggi.

## Slide 15: Dove si colloca l'informatica

Una perturbazione seguita da sinistra a destra illustra la posizione dell'informatica. È prima un fenomeno naturale. La fisica e la matematica la descrivono con equazioni. L'informatica trasforma le equazioni in algoritmi e simulazioni. L'ingegneria fornisce i supercalcolatori, le reti e i sensori che le eseguono in modo affidabile. L'economia riceve previsioni e servizi di valore per le persone. L'informatica è l'anello intermedio indispensabile: senza di essa le equazioni restano sulla carta. L'esempio non è ipotetico: le previsioni meteorologiche e del mare del Dipartimento sono prodotte ogni giorno esattamente così.

## Slide 16: Il calcolo ad alte prestazioni alla Parthenope

Le immagini mostrano i rack delle Research Computing Facilities dell'Ateneo, il loro prodotto quotidiano, le previsioni di meteo@uniparthenope, e la pagina che elenca le macchine. Un cluster è un insieme di calcolatori che cooperano su un unico problema. I concetti sono quelli praticati sul kit, cioè registri, memoria e istruzioni, su scala enormemente più grande e con il problema aggiuntivo di coordinare le parti. La Lezione 24 torna su queste macchine, e l'evento di chiusura del corso ne include una visita.

## Slide 17: Verifica la comprensione: Quale idea è il cuore dell'architettura di von Neumann? / Che cosa distingue RISC-V da x86 e ARM?

Per la prima domanda va cercata l'idea che definisce l'architettura, non un dettaglio. Il numero dei registri e la durata di un'istruzione variano da un processore all'altro, e ingresso e uscita sono una delle quattro unità, non un'opzione. Ciò che definisce l'architettura è che le istruzioni risiedono nella stessa memoria dei dati e sono prelevate ed eseguite in sequenza.

Per la seconda, la velocità è una proprietà di un particolare chip, non di un insieme di istruzioni, e RISC-V non è stato il primo progetto RISC: Berkeley RISC, MIPS e ARM lo hanno preceduto. Né è confinato ai microcontrollori. Ciò che è nuovo è la licenza: l'insieme di istruzioni è uno standard aperto che chiunque può implementare.

## Slide 18: Verifica la comprensione: Chi è considerato il primo programmatore della storia?

Tutti e quattro i nomi appartengono alla storia, con ruoli diversi. Babbage progettò la macchina. Turing definì il calcolo, un secolo dopo. Zuse costruì il primo calcolatore programmabile funzionante. La persona che scrisse una procedura per una macchina, e la pubblicò nel 1843, è Ada Lovelace.

## Slide 19: Glossario: inglese e italiano

Dieci termini. L'italiano ha due parole per la macchina, *calcolatore* ed *elaboratore*, entrambe più antiche del prestito *computer*. *Programma memorizzato* nomina l'idea di von Neumann. L'*unità di controllo* e l'*unità aritmetico-logica*, ALU, sono due delle quattro unità, e ricompaiono nelle lezioni sul processore. Il *calcolo ad alte prestazioni*, HPC, è il campo dei cluster appena mostrati.

## Slide 20: Conclusioni e letture

Quattro conclusioni. Il calcolo è più antico dell'elettronica: rappresentazione e procedura sono venute prima. Il calcolatore a programma memorizzato del 1945 è la macchina che si programma ancora oggi. Il RISC ha reso i processori abbastanza semplici da essere compresi nel loro insieme, e RISC-V li ha resi aperti. E l'informatica è pervasiva, perché l'informazione appartiene a ogni campo. Le letture sviluppano la stessa storia più distesamente. La prossima lezione compie il primo passo formale: come l'informazione diventa bit.
