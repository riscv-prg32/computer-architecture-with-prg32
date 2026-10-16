# Lezione 02: Primo contatto: l'assembly RISC-V su PRG32

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: registri, calcolo, trasferimento, salto; i registri; contratto init/update/draw; gli argomenti in a0 ... a7; perché si salva ra; indirizzo, valore, load, store; le istruzioni di base; le pseudo-istruzioni; un'istruzione è un numero; seguire a mano l'esecuzione. DA UTILIZZARE OGGI: la convenzione di chiamata (Lezione 18); le maschere di bit (Lezione 08) e, usati senza essere studiati nel corso, le direttive dell'assemblatore, gli strumenti di PRG32, le chiamate del runtime PRG32, il debugger di PRG32-QT, il programma completo. DA COMPRENDERE PIÙ AVANTI: la pila (Lezione 18); i modi di indirizzamento (Lezione 19); formati delle istruzioni (Lezione 19); l'esadecimale (Lezione 04); il complemento a due (Lezione 05); la virgola fissa (Lezione 06); l'algebra di Boole (Lezione 08); il sommatore (Lezione 09); dai volt ai bit (Lezione 10); latch e flip-flop (Lezione 13); il ciclo del processore (Lezione 19); il progetto Verm1 (Lezione 07). Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Slide 1: Primo contatto: l'assembly RISC-V su PRG32

È la prima lezione in cui si scrive un programma, e precede di proposito ogni teoria. Nell'arco di due ore lo studente costruisce quattro piccole cartucce, ciascuna un programma completo che gira. La piena comprensione di ogni dettaglio oggi non è né attesa né richiesta. Lo scopo è *osservare* al lavoro registri, memoria e una chiamata di procedura, così che le lezioni successive abbiano fenomeni concreti da spiegare. La citazione fissa il tono della sessione: meno parole, più codice.

## Slide 2: Che cosa saprete fare alla fine

Sei risultati di apprendimento. I primi quattro sono operativi: compilare ed eseguire una cartuccia, nominare i registri, chiamare una funzione con i suoi argomenti, conservare un valore in memoria tra un frame e l'altro. Il quinto è un cambio di prospettiva con conseguenze durature: un'istruzione è un numero a 32 bit. Il sesto è il più importante per il corso nel suo insieme: lo studente esce con un elenco di domande, ciascuna oggetto di una lezione successiva. La lezione di oggi è quindi un inventario di problemi quanto un insieme di risposte.

## Slide 3: La macchina che state programmando

L'intera macchina è descritta da quattro schede. Ci sono 32 *registri*, ciascuno contenente un valore a 32 bit, e il processore può operare solo su valori contenuti nei registri. Le istruzioni si dividono in tre classi. *Calcolo*: operazioni aritmetiche e logiche tra registri, come `add` o `addi`. *Trasferimento*: spostamenti tra un registro e la memoria, `lw` per caricare una parola e `sw` per memorizzarla; nessun'altra istruzione accede alla memoria. *Salto*: istruzioni che cambiano quale istruzione verrà eseguita dopo. È la disciplina load-store di RISC-V, e ogni calcolo che un computer esegue è una lunga sequenza di questi tre tipi.

## Slide 4: I registri che userete davvero

I registri hanno nomi che ne riflettono l'uso. Da `a0` ad `a7` passano gli argomenti di una chiamata, e `a0` restituisce anche il risultato. Da `t0` a `t6` sono temporanei, liberamente utilizzabili e non conservati attraverso le chiamate. Da `s0` a `s11` sono conservati attraverso le chiamate. `ra` contiene l'indirizzo di ritorno, `sp` la cima dello stack, e `zero` vale sempre 0. La didascalia contiene il punto essenziale: questi ruoli non sono imposti dall'hardware, che tratta in modo identico i registri da `x1` a `x31`. Sono un accordo, la *convenzione di chiamata*, ed è questo accordo che permette all'assembly scritto dallo studente e al codice C del framework di chiamarsi a vicenda. Oggi la si usa; la si studia formalmente nella Lezione 18.

## Slide 5: Il contratto: tre funzioni che scrivete voi

L'interfaccia tra un gioco e PRG32 è un contratto di tre funzioni fornite dal programmatore. `init` è chiamata una volta, all'avvio della cartuccia, per stabilire lo stato iniziale. `update` è chiamata una volta per frame, per leggere l'ingresso e modificare lo stato. `draw` è chiamata una volta per frame, per rendere lo stato come immagine. Il firmware le trova per nome: un prefisso scelto dal programmatore seguito da `_init`, `_update` e `_draw`. La separazione delle responsabilità va adottata dal primo giorno: `update` decide, `draw` mostra, e nessuna delle due fa il lavoro dell'altra.

## Slide 6: Perché salvare ra? Il frame di stack

Perché si deve salvare `ra`? L'istruzione `call` scrive in `ra` l'indirizzo a cui il controllo deve tornare. La funzione chiamata, però, può a sua volta fare chiamate, ciascuna delle quali sovrascrive `ra`. Una funzione che ne chiama un'altra deve quindi prima preservare in memoria il proprio indirizzo di ritorno: decrementa `sp` di 16 per riservare spazio, lo *stack frame*, e memorizza `ra` in `12(sp)`; dopo la chiamata esegue le operazioni inverse. Lo schema mostra il frame, con lo stack che cresce verso gli indirizzi bassi; la dimensione di 16 byte discende dall'allineamento che la convenzione richiede a `sp`. Omettere questa coppia di operazioni è il classico primo errore: la funzione ritorna nel posto sbagliato. Perché si salva `ra` va compreso oggi; lo stack come struttura dati si tratta formalmente nella Lezione 18.

## Slide 7: Indirizzo o valore? Il nodo della memoria

Questa slide separa due nozioni che i principianti confondono di continuo: un indirizzo e un valore. Dopo `la`, `t0` contiene *dove* è memorizzato il contatore; dopo `lw`, `t1` contiene *che cosa* vi è memorizzato, 41 nel disegno. `addi` modifica la copia nel registro portandola a 42, mentre la memoria continua a contenere 41 finché `sw` non riscrive il nuovo valore. Le due frecce vanno seguite con attenzione. Il riquadro a destra raccomanda un'abitudine da prendere subito: annotare nei commenti ogni registro come contenente un INDIRIZZO o un VALORE. Questa semplice disciplina previene l'errore più frequente del primo mese. I modi in cui un'istruzione può designare i propri operandi, i modi di indirizzamento, si studiano nella Lezione 19.

## Slide 8: Le istruzioni che avete appena usato

Cinque famiglie comprendono ogni istruzione scritta oggi: aritmetiche (`add`, `sub`), logiche (`and`, `or`, `xor`), forme immediate che prendono una piccola costante (`addi`, `andi`), di memoria (`lw`, `sw`) e di controllo (`call`, `ret`). In ogni istruzione il risultato va nel primo registro nominato: `add t0, t1, t2` mette `t1 + t2` in `t0`. L'insieme di istruzioni intere di base, RV32I, conta circa quaranta istruzioni; un quarto di esse è già stato usato.

## Slide 9: Pseudo-istruzioni: scorciatoie che l'assemblatore espande

Diverse istruzioni scritte oggi non esistono nell'hardware: sono *pseudo-istruzioni*, comodità di notazione che l'assemblatore espande in istruzioni reali. `li t0, 42` diventa `addi t0, zero, 42`; `mv` è un `addi` con costante 0; `ret` è un salto indiretto all'indirizzo in `ra`; `beqz` è un confronto con il registro `zero`. La frequenza con cui `zero` compare nella colonna centrale è istruttiva: un registro cablato a 0 permette a un piccolo insieme di istruzioni di fare il lavoro di uno molto più grande, un'economia caratteristica del progetto RISC.

## Slide 10: Un'istruzione è un numero a 32 bit

Un'istruzione è un numero. `addi t1, t1, 1` è la parola a 32 bit 0x00130313, e la striscia colorata ne mostra i campi: dodici bit per la costante 1, cinque per il registro sorgente (`t1` è il registro numero 6), tre che selezionano l'addizione, cinque per il registro destinazione e sette per l'opcode, che identifica la classe dell'istruzione. Il formato non va memorizzato ora; è l'argomento della Lezione 19. Ciò che conta oggi è il principio: l'assembly è una notazione leggibile per il codice macchina, e un'istruzione memorizzata è un dato come un altro. È l'idea del programma memorizzato, che la prossima lezione colloca nel suo contesto storico.

## Slide 11: PRG32-QT: un microscopio per i registri

PRG32-QT esegue la stessa cartuccia sul portatile e può fermarsi tra due istruzioni qualsiasi, mostrando ogni registro. Va usato ora sul terzo passo: si va a `update`, si mette in pausa e si eseguono una alla volta le quattro istruzioni di `first_update`, osservando `t0` e `t1`. Prima di ogni passo il cambiamento atteso va dichiarato ad alta voce; una previsione resa esplicita è una previsione che può essere sbagliata, e quindi informativa. L'ultima riga è un principio da conservare: la scheda è l'autorità sul tempo, PRG32-QT l'autorità sul contenuto di un registro.

## Slide 12: Tracciare a mano: tre frame di first_update

Un tracciamento a mano registra, frame per frame, che cosa ogni istruzione lascia in `t1` e in memoria. I primi frame non riservano sorprese. La riga evidenziata sì: al frame 256 il contatore raggiunge 256 eppure la larghezza della barra è 0, perché `andi` con 255 conserva solo gli otto bit meno significativi, e 256 in binario è un uno seguito da otto zeri. L'operazione di maschera calcola quindi il resto modulo 256, un fatto usato oggi e spiegato nella Lezione 08. Il tracciamento a mano è lento e poco brillante, ed è l'abilità di debug più preziosa che questo corso insegni.

## Slide 13: Domande che il vostro programma ha già sollevato

Ogni riga della tabella registra qualcosa osservato oggi, la domanda che solleva e la lezione che risponde. Perché l'esadecimale? Lezioni 04 e 05. Come fa un registro a contenere un numero negativo? Lezione 05. Che cosa fa AND a trentadue bit in una volta? Lezioni 08 e 09. Come fa un circuito a ricordare un bit? Lezioni 13 e 15. Come viene decodificato ed eseguito 0x00130313? Lezioni 18 e 19. L'ultima riga è il progetto: da tre funzioni e un rettangolo a un gioco completo. La tabella è la mappa del corso disegnata a partire dal programma dello studente, e conviene tenerla a portata di mano.

## Slide 14: Verifica la comprensione: Dopo la t0, counter e lw t1, 0(t0), che cosa contiene t0? / Una funzione che chiama prg32_gfx_clear deve salvare un registro prima della chiamata. Quale?

La prima domanda mette alla prova la distinzione tra indirizzo e valore. `la` carica in `t0` l'indirizzo dell'etichetta; `lw` usa poi `t0` per trovare la parola e ne copia il contenuto in `t1`, lasciando `t0` invariato. `t0` contiene quindi ancora l'indirizzo. Chi ha scelto "il valore" torni alla slide con le due frecce.

La seconda domanda ruota attorno all'effetto di `call`, che scrive l'indirizzo di ritorno in `ra`. Una funzione che dovrà poi tornare al proprio chiamante ha bisogno del suo `ra` originale, che la chiamata ha appena sovrascritto. `a0` è fatto per essere sovrascritto, `sp` è ripristinato dalla funzione chiamata, e `t0` è un temporaneo che nessuno si è impegnato a conservare.

## Slide 15: Verifica la comprensione: t1 contiene 300. Che cosa lascia in a2 l'istruzione andi a2, t1, 255?

Il calcolo si fa meglio in binario. 300 è uguale a 256 + 44: un uno nella posizione 8 seguito dagli otto bit di 44. La maschera 255 è fatta di otto uni, quindi l'AND conserva gli otto bit meno significativi e azzera tutti gli altri. Il risultato è 44. Sottrarre 255 da 300 dà 45, una risposta plausibile ma sbagliata: un AND bit a bit non è una sottrazione, e la distinzione tra operazioni aritmetiche e logiche sugli stessi bit ricorre in tutto il corso.

## Slide 16: Glossario: inglese e italiano

Dodici termini della lezione, con l'italiano usato in aula. *Load* e *store* si nominano sempre dal punto di vista del processore: un load porta un valore dalla memoria a un registro, uno store lo rimanda indietro. Un *immediato* è una costante codificata dentro l'istruzione stessa. Un *branch* è un salto che avviene solo se vale una condizione. La *convenzione di chiamata* è l'accordo che regola i ruoli dei registri attraverso le chiamate di procedura.

## Slide 17: Riepilogo e letture

Quattro proposizioni riassumono la lezione. Un processore RISC-V consiste di trentadue registri e di un piccolo insieme di istruzioni che calcolano, trasferiscono dati e cambiano il flusso di controllo. Un gioco PRG32 consiste di tre funzioni; gli argomenti viaggiano da `a0` ad `a7`, e una funzione che ne chiama un'altra deve salvare `ra`. Le variabili risiedono in memoria: `la` dà l'indirizzo, `lw` e `sw` il valore. Un'istruzione è un numero a 32 bit, e l'assembly è la sua notazione leggibile. La prossima lezione fa un passo indietro per ripercorrere la storia che ha prodotto questa macchina.
