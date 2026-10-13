# Lezione 19: Istruzioni e interruzioni

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

## Slide 1: Istruzioni e interruzioni

La lezione precedente ha descritto di che cosa è fatto un processore. Questa descrive che cosa fa. Ha due metà. La prima segue una singola istruzione: come è codificata in 32 bit e quali passi compie il processore per eseguirla. La seconda spiega che cosa succede quando arriva qualcosa di più urgente del programma in corso, un timer, un dispositivo, un errore, e il processore deve lasciare ciò che sta facendo e tornarci dopo. La battuta in copertina è quasi vera, come vedrete.

## Slide 2: Che cosa saprete fare alla fine

Sei obiettivi. Descrivere un'istruzione come codice operativo con operandi. Decodificare a mano un'istruzione RISC-V. Seguire un'istruzione nelle cinque fasi del ciclo del processore. Spiegare che cos'è una pipeline e perché accelera un processore. Definire interruzione, eccezione e trap, tre parole che RISC-V usa con precisione. E descrivere che cosa fa l'hardware a una trap e come riprende il programma interrotto.

## Slide 3: Di che cosa è fatta un'istruzione

Ogni processore ha quattro famiglie di istruzioni: trasferimenti tra memoria e registri, aritmetica e logica, controllo del flusso, ingresso/uscita. Un'istruzione è un *codice operativo*, l'opcode, che dice che cosa fare, seguito da zero o più *operandi*, che dicono su che cosa. Un operando può essere una costante scritta dentro l'istruzione, un immediato; una locazione di memoria; oppure un registro. Alcuni operandi sono impliciti: una macchina ad accumulatore non nomina l'accumulatore. Le istruzioni hanno da zero a tre operandi.

## Slide 4: I formati delle istruzioni RISC-V

I formati di RISC-V. Tutte le istruzioni sono lunghe 32 bit, divisi in campi. Nel formato R, per le operazioni tra registri, ci sono tre numeri di registro di cinque bit, `rs1`, `rs2` e `rd`, e tre campi che selezionano l'operazione. Nel formato I il secondo registro sorgente è sostituito da un immediato di 12 bit. S e B, per store e salti condizionati, spezzano l'immediato in due parti. U e J portano un immediato di 20 bit. Notate la regolarità: l'opcode sta sempre nei sette bit più bassi, e i registri sempre nelle stesse posizioni.

## Slide 5: Modi di indirizzamento: dove si trova un operando

Un *modo di indirizzamento* è un modo di trovare un operando. RISC-V ne ha quattro. *Immediato*: l'operando è una costante dentro l'istruzione. *Registro*: è il contenuto di un registro. *Base più scostamento*: è la parola di memoria all'indirizzo dato da un registro più una costante, l'unico modo di raggiungere la memoria. *Relativo al PC*: un indirizzo a una certa distanza dall'istruzione stessa, usato dai salti. L'indirizzamento indiretto in memoria, in cui l'indirizzo stesso sta in memoria, non esiste: richiede due load.

## Slide 6: Le fasi del ciclo

Cinque fasi. *Prelievo* (fetch): l'istruzione all'indirizzo contenuto nel PC viene letta dalla memoria, e il PC avanza. *Decodifica*: l'opcode viene riconosciuto e i registri nominati nell'istruzione vengono letti. *Esecuzione*: la ALU calcola un risultato, un indirizzo o un confronto. *Memoria*: i load leggono la memoria, gli store la scrivono, le altre istruzioni qui non fanno nulla. *Scrittura* (write back): il risultato viene scritto nel registro di destinazione. Dopo il bootstrap iniziale, il processore ripete questo ciclo all'infinito.

## Slide 7: La pipeline

Se ogni fase ha il proprio hardware, le fasi di istruzioni diverse possono sovrapporsi. Nella tabella ogni riga è un'istruzione e ogni colonna un ciclo di clock: mentre la prima istruzione è in esecuzione, la seconda viene decodificata e la terza prelevata. Ogni istruzione impiega ancora cinque cicli, ma a ogni ciclo ne termina una: è la *pipeline*, la stessa idea di una catena di montaggio. I processori superscalari affiancano più pipeline. Il core principale del kit ha una pipeline a quattro stadi.

## Slide 8: Il problema del ciclo semplice

Un processore che facesse solo prelievo, decodifica ed esecuzione avrebbe tre problemi. La comunicazione con i dispositivi sarebbe inefficiente: il programma dovrebbe chiedere di continuo a ogni dispositivo se ha qualcosa da dire. Un programma entrato per errore in un ciclo senza fine, come il `j loop` della slide, non potrebbe mai essere rimosso. E il sistema operativo avrebbe poco controllo sulla macchina. Tutti e tre hanno la stessa soluzione: un modo per togliere il processore al programma in esecuzione.

## Slide 9: Interruzioni

La definizione: le *interruzioni* sono eventi eccezionali, di solito asincroni rispetto al programma in esecuzione, che richiedono l'attenzione del processore. RISC-V usa tre parole distinte. Un'*interruzione* (interrupt) viene dall'esterno del programma, in un momento qualunque: un timer, un dispositivo. Un'*eccezione* è causata dall'istruzione in esecuzione: un opcode illegale, un indirizzo vietato. Una *trap* è il trasferimento del controllo a un gestore, qualunque ne sia la causa. Altri processori usano queste parole con meno rigore.

## Slide 10: Il ciclo reale del processore

Il ciclo reale. Dopo il bootstrap il processore preleva, decodifica ed esegue; poi, alla fine di ogni istruzione, controlla se c'è un'interruzione in attesa. Se no, torna al prelievo. Se sì, accoglie la trap: passa allo stato privilegiato e comincia a eseguire una routine del sistema, il gestore. Quando il gestore termina, il programma sospeso riprende come se nulla fosse accaduto. Seguite i due percorsi sul diagramma: l'anello corto è il caso normale.

## Slide 11: Possibili cause di interruzione

Sei cause di interruzione. Un'interruzione *periodica* da un timer, per ripartire il processore tra i programmi. Un'interruzione di *I/O*, con cui una periferica segnala di essere pronta. Gli *errori nel programma*, come un'istruzione inesistente: sono le eccezioni. I *guasti* del sistema: alimentazione, temperatura. Il *reset*, che riporta tutto a uno stato noto. E l'interruzione *software*, con cui un programma chiede un servizio al sistema operativo: in RISC-V è l'istruzione `ecall`.

## Slide 12: Gestire un'interruzione

La procedura generale in sei passi. Salvare il contesto, parte hardware: almeno l'indirizzo da cui riprendere. Identificare la causa. Saltare al punto d'ingresso della *routine di servizio dell'interruzione*. Salvare il contesto, parte software: i registri che la routine sta per usare. Servire l'interruzione. Infine ripristinare il contesto e riprendere il programma sospeso dall'istruzione successiva all'ultima eseguita. Il *contesto* è tutto ciò che il programma interrotto deve ritrovare immutato.

## Slide 13: I registri del meccanismo delle trap

Sei registri. `mtvec`, scritto una volta dal firmware, contiene l'indirizzo del gestore delle trap. `mstatus` contiene MIE, l'abilitazione globale delle interruzioni, e MPIE, il suo valore precedente. `mie` ha un bit di abilitazione per ogni sorgente, `mip` un bit di richiesta in attesa per ogni sorgente. `mepc` riceve, a ogni trap, l'indirizzo dell'istruzione interrotta. `mcause` riceve la causa. La colonna centrale è importante: alcuni registri li scrive il firmware per configurare il meccanismo, altri l'hardware quando avviene una trap.

## Slide 14: Che cosa fa l'hardware a una trap

Che cosa fa l'hardware a una trap, in ordine. Scrive in `mepc` l'indirizzo dell'istruzione interrotta. Scrive la causa in `mcause`. Copia MIE in MPIE e azzera MIE, così le altre interruzioni sono disabilitate. Passa al modo macchina. Carica nel PC l'indirizzo contenuto in `mtvec`. Nulla viene salvato su uno stack: i registri generici sono lasciati al gestore. L'istruzione `mret`, alla fine del gestore, annulla tutto: MIE riprende il valore di MPIE e il PC quello di `mepc`.

## Slide 15: La causa di una trap: mcause

Il contenuto di `mcause`. Il bit più alto dice se è stata un'interruzione o un'eccezione; il resto è un codice. Le tre interruzioni, evidenziate: software, timer, ed esterna, cioè un dispositivo. Tra le eccezioni: istruzione illegale, breakpoint, errore di accesso in un load o in uno store, ed `ecall`. Lo stesso numero può comparire in entrambe le famiglie con significati diversi, ed è per questo che serve il bit più alto. La riga del breakpoint spiega come un debugger, per esempio quello di PRG32-QT, ferma il vostro programma.

## Slide 16: Le interruzioni sul kit PRG32

Tutto questo succede sul kit. Un timer interrompe il processore cento volte al secondo, e il firmware lo usa per tenere il tempo e cadenzare i frame. Il display e l'audio interrompono quando vogliono altri dati. La radio interrompe quando arriva un pacchetto, ed è per questo che potete caricare una cartuccia mentre un gioco è in esecuzione. Le vostre `init`, `update` e `draw` sono normali funzioni che girano tra un'interruzione e l'altra. E una cartuccia bloccata in un ciclo non ferma le interruzioni: PRG32-QT segnala un errore; sulla scheda un watchdog segnala lo stallo.

## Slide 17: Verifica la comprensione: In quali bit di un'istruzione RISC-V sta l'opcode? / Durante il prelievo di un'istruzione RV32 non compressa, il PC viene incrementato di:

Riguardate la slide dei formati: un campo sta nello stesso posto in tutte e quattro le righe.

Gli indirizzi contano i byte. Quanti byte occupa un'istruzione di 32 bit?

## Slide 18: Verifica la comprensione: Quale registro contiene l'indirizzo da cui riprenderà un programma RISC-V interrotto? / Quale di questi è un'eccezione e non un'interruzione, nei termini di RISC-V?

Sono in gioco quattro registri: uno contiene l'indirizzo del gestore, uno la causa, uno l'indirizzo da cui riprendere. `ra` appartiene alle chiamate di funzione, non alle trap.

Usate la definizione: un'eccezione è causata dall'istruzione in esecuzione, un'interruzione viene dall'esterno in un momento arbitrario. Tre dei quattro eventi vengono dall'esterno.

## Slide 19: Glossario: inglese e italiano

Dodici termini. *Operation code* è il codice operativo; *addressing mode* è il modo di indirizzamento. *Fetch*, *decode* ed *execute* sono prelievo, decodifica ed esecuzione. La *interrupt service routine* è la routine che serve un'interruzione. La *interrupt latency*, latenza di interruzione, è il ritardo tra la richiesta e l'inizio del lavoro utile. *To mask*, mascherare un'interruzione, significa impedire temporaneamente che venga accolta.

## Slide 20: Conclusioni e letture

Cinque conclusioni. Un'istruzione è un codice operativo con i suoi operandi; in RISC-V sempre 32 bit in sei formati regolari. La lunghezza fissa rende semplice il prelievo: il PC avanza di una costante, 4 per un'istruzione non compressa. Il processore ha un ciclo: preleva, decodifica, esegue, scrive il risultato. Gli eventi eccezionali spezzano il ciclo: il processore salva dov'era, serve l'evento e riprende. Le interruzioni si possono abilitare, mascherare e ordinare per priorità, e RISC-V lo fa con una manciata di registri e `mret`. La prossima lezione lascia il processore per i bus e la scheda video.
