# Lezione 03: Storia della computazione

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

## Slide 1: Storia della computazione

La volta scorsa avete eseguito un programma RISC-V. Questa lezione si chiede da dove viene quella macchina. Non è un elenco di date da memorizzare: ogni tappa della storia aggiunge un'idea, e ognuna di quelle idee è ancora dentro il chip del kit PRG32. La citazione in copertina è il primo programma più famoso, dal libro che ha presentato il linguaggio C: da allora ogni programmatore ha cominciato facendo dire ciao a una macchina, come avete fatto voi con HELLO PRG32.

## Slide 2: Che cosa saprete fare alla fine

Cinque obiettivi. Il primo è una definizione: che cos'è l'informatica, e perché non è la scienza dei computer. Il secondo e il terzo sono storici: collocare su una linea del tempo le macchine e le persone principali, e nominare le quattro unità dell'architettura di von Neumann, che ritroverete nella macchina che avete programmato. Il quarto spiega il nome del nostro processore: che cosa significa RISC, e perché RISC-V è aperto. Il quinto colloca la disciplina tra scienza, ingegneria ed economia.

## Slide 3: Una definizione

La definizione ha tre parti da soppesare. *Scienza applicata*: usa i risultati delle scienze di base per risolvere problemi. *Trattamento dell'informazione*: l'oggetto è l'informazione, non la macchina. *Procedure automatizzate*: il trattamento è svolto da procedure eseguibili senza giudizio umano. La parola italiana lo dice direttamente, dal francese *information automatique*. L'inglese preferisce *computer science*, che mette lo strumento nel nome e crea l'equivoco che la slide successiva corregge.

## Slide 4: Due anime, una disciplina

La disciplina ha due anime. L'informatica *teorica* studia i fondamenti: che cosa si può calcolare, a quale costo, e con quali algoritmi, dove un algoritmo è un insieme finito di operazioni che trasforma A in B. L'informatica *applicata* costruisce le tecnologie e i sistemi informativi che attraversano economia e società, con un costo da governare: il divario digitale tra chi ha accesso e competenze e chi no. Questo corso appartiene a entrambe: l'algebra di Boole è teoria, una cartuccia è applicazione.

## Slide 5: Le origini: l'abaco e la macchina di Anticitera

Due dispositivi antichi. Nell'abaco, romano o cinese, un numero è una posizione di palline: i dati sono rappresentati fisicamente, e le operazioni sono movimenti della mano. La macchina di Anticitera, costruita in Grecia intorno al II o I secolo a.C., va oltre: un treno di ingranaggi calcola le posizioni del Sole e della Luna e prevede le eclissi. Un numero è l'angolo di una ruota, e il calcolo sta nei rapporti tra gli ingranaggi. Tenete la frase sotto le immagini: la rappresentazione viene prima del calcolo.

## Slide 6: Il mondo islamico medievale (dal IX al XIII secolo)

Tra il IX e il XIII secolo il mondo islamico porta strumenti, metodi e parole. Strumenti: l'astrolabio e il torqueto, per l'astronomia. Metodi: al-Kindi inventa l'analisi delle frequenze, la prima tecnica sistematica per violare un cifrario. Macchine: il flautista automatico dei fratelli Banu Musa e gli automi di al-Jazari sono guidati da sequenze che si possono cambiare, una prima forma di programma. E parole: *algoritmo* viene dal nome di al-Khwarizmi, *algebra* dal titolo del suo libro.

## Slide 7: Dal 1600 al 1800: calcolatrici meccaniche e logica

Dal 1600 al 1800 due linee di sviluppo corrono parallele. La prima è il calcolo meccanico: i logaritmi di Nepero, la macchina di Pascal che somma con il riporto automatico, quella di Leibniz per le quattro operazioni. La seconda è la logica: Leibniz descrive l'aritmetica binaria nel 1703, e nel 1854 Boole trasforma la logica in un'algebra, quella che studierete nelle Lezioni 08 e 09. Un terzo filo compare nel 1804: il telaio di Jacquard tesse un disegno memorizzato su schede perforate. Si cambiano le schede e la stessa macchina fa un'altra cosa.

## Slide 8: L'Ottocento: Charles Babbage e Ada Lovelace

Charles Babbage progetta due macchine. La macchina alle differenze calcola automaticamente tavole matematiche. La macchina analitica è molto più ambiziosa, e le sue parti hanno nomi che dovrebbero già suonarvi familiari: un *mulino* che fa i conti, un'unità di controllo, un *magazzino* che conserva i numeri, un dispositivo di uscita; programmi e dati arrivano su schede perforate, come nel telaio. Non fu mai completata. Ada Lovelace scrisse per essa un metodo per calcolare i numeri di Bernoulli, pubblicato nel 1843: per questo è considerata la prima programmatrice della storia.

## Slide 9: Prima la teoria: Turing, Shannon e Nakajima

La teoria precede le macchine. Nel 1936 Alan Turing definisce una macchina astratta capace di svolgere qualunque calcolo, e con essa la nozione stessa di ciò che è calcolabile. Negli anni Trenta Nakajima e Shannon mostrano che l'algebra di Boole descrive i circuiti fatti di interruttori: è il ponte tra logica ed elettronica su cui poggia tutta la progettazione digitale, ed è la ragione per cui studierete l'algebra di Boole. Nel 1941 Konrad Zuse completa lo Z3, il primo calcolatore funzionante controllato da programma.

## Slide 10: John von Neumann: il programma memorizzato

La slide centrale della lezione. Nel 1945 von Neumann descrive un'architettura con un'idea decisiva: programma e dati stanno nella stessa memoria, quindi un programma è esso stesso un dato. Lo schema mostra le quattro unità: la memoria, l'unità di controllo che governa la sequenza delle operazioni, l'unità aritmetico-logica con il suo accumulatore, e ingresso e uscita. Ora riguardate la Lezione 02: la ALU ha eseguito `addi`, la memoria conteneva sia `counter` sia l'istruzione 0x00130313, il joystick e il display sono ingresso e uscita. Il chip del kit è ancora una macchina di von Neumann.

## Slide 11: Otto decenni di calcolatori

Otto decenni in un'immagine, dalle macchine della guerra ai calcolatori nascosti negli oggetti di ogni giorno. Leggete le didascalie da sinistra a destra: una macchina per un intero paese, poi per molti utenti, poi una per reparto, una a persona, una in tasca, e infine calcolatori ovunque. Ogni decennio ha reso il calcolatore più piccolo, più economico e più vicino alle persone. La frase in basso è il punto: nessuno di questi passi ha cambiato l'idea del programma memorizzato.

## Slide 12: Microprocessori: da CISC a RISC a uno standard aperto

Leggete la tabella come un dibattito tra due modi di progettare un processore. I primi microprocessori, e la famiglia x86 nata nel 1978, seguono l'approccio CISC: molte istruzioni, alcune assai complesse. Intorno al 1980 Berkeley e Stanford mostrano che poche istruzioni, semplici e regolari, danno macchine più veloci: è il RISC, insieme di istruzioni ridotto. ARM lo applica al basso consumo nel 1985. Nel 2010 il quinto progetto di Berkeley, RISC-V, compie il passo ulteriore di fare dell'insieme di istruzioni uno standard aperto, che l'Europa considera oggi strategico.

## Slide 13: La legge di Moore in un numero

Nel 1971 l'Intel 4004 aveva 2300 transistor; il processore di un portatile oggi ne ha decine di miliardi, dieci milioni di volte tanti. Per cinquant'anni il numero è raddoppiato circa ogni due anni. È la legge di Moore, che è un'osservazione su un'industria e non una legge di natura, e i suoi limiti fisici sono ormai vicini. Quando altri transistor non arrivano più gratis, il progresso deve venire da architetture migliori. Per questo l'argomento di questo corso conta più oggi che vent'anni fa.

## Slide 14: Lo spirito degli home computer, su una CPU aperta

Un confronto a quarant'anni di distanza. Il Commodore 64 aveva un processore a 8 bit con tre registri, un clock di circa 1 MHz e 64 KB di memoria; l'ESP32-C6 ha 32 bit, trentadue registri, 160 MHz e uno spazio di indirizzamento di 4 GB. Eppure lo schermo ha la stessa dimensione, 320 per 200 pixel, e lo stesso è lo spirito: una macchina abbastanza piccola da essere capita interamente da una persona sola. La differenza che vi riguarda sta nella riga dell'insieme di istruzioni: proprietario allora, standard aperto adesso.

## Slide 15: Il calcolo ad alte prestazioni alla Parthenope

Le immagini mostrano un cluster didattico dell'Ateneo e la pagina delle sue infrastrutture di calcolo per la ricerca. Un cluster è fatto di molti calcolatori che lavorano insieme a un solo problema. Le idee sono quelle che esercitate sul kit: registri, memoria, istruzioni, soltanto in numero enormemente maggiore e con il problema aggiuntivo di far collaborare le parti. L'ultima lezione del corso torna su queste macchine, e l'evento di chiusura comprende una visita.

## Slide 16: Verifica la comprensione: Quale idea è il cuore dell'architettura di von Neumann? / Che cosa distingue RISC-V da x86 e ARM?

Cercate l'idea, non un dettaglio. Il numero dei registri e la durata di un'istruzione cambiano da un processore all'altro, e ingresso e uscita sono una delle quattro unità, non un'opzione. Ciò che definisce l'architettura è che le istruzioni stanno nella stessa memoria dei dati, e vengono prelevate ed eseguite una dopo l'altra.

La velocità è una proprietà di un particolare chip, non di un insieme di istruzioni, e RISC-V non è stata la prima RISC: RISC di Berkeley, MIPS e ARM sono venuti prima. Né è limitata ai microcontrollori. La novità è la licenza: l'insieme di istruzioni è uno standard aperto che chiunque può realizzare.

## Slide 17: Verifica la comprensione: Chi è considerato il primo programmatore della storia?

Tutti e quattro i nomi appartengono alla storia, con ruoli diversi. Babbage progettò la macchina. Turing definì la computazione, un secolo dopo. Zuse costruì il primo calcolatore programmabile funzionante. La persona che scrisse una procedura per una macchina, e la pubblicò nel 1843, è Ada Lovelace.

## Slide 18: Glossario: inglese e italiano

Dieci termini. Notate che l'italiano ha due parole per la macchina, *calcolatore* ed *elaboratore*, entrambe più antiche del prestito *computer*. *Stored program*, programma memorizzato, è l'idea di von Neumann. L'*unità di controllo* e l'*unità aritmetico-logica*, ALU, sono due delle quattro unità, e le ritroverete nelle lezioni sul processore. *High-performance computing*, HPC, è il campo dei cluster che avete appena visto.

## Slide 19: Conclusioni e letture

Quattro conclusioni. Il calcolo è più antico dell'elettronica: rappresentazione e procedura sono venute prima. Il calcolatore a programma memorizzato del 1945 è la macchina che programmiamo ancora. RISC ha reso i processori abbastanza semplici da essere capiti per intero, e RISC-V li ha resi aperti. E l'informatica è ovunque, perché l'informazione appartiene a ogni campo. Le letture raccontano la stessa storia più distesamente. La prossima lezione compie il primo passo formale: come l'informazione diventa bit.
