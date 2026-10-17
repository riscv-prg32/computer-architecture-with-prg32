# Lezione 19: Istruzioni e interruzioni

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: formati delle istruzioni; i modi di indirizzamento; il ciclo del processore; interruzioni e trap. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

Percorso. I risultati di oggi: (1) decodificare un'istruzione RISC-V nei suoi campi; (2) nominare il modo di indirizzamento di ogni operando; (3) descrivere il ciclo dell'istruzione e che cosa cambia un'interruzione. Si appoggia su: solo ciò che ha preparato la Lezione 01. Prossimo passo: Lezione 20, I bus e la scheda video.

Il filo della lezione: Il numero 0x00130313 della Lezione 02 si legge ora campo per campo, e il processore che lo preleva può essere interrotto e ripreso. Prossimo passo: i dispositivi che il processore serve.

## Slide 1: Istruzioni e interruzioni

La lezione precedente ha descritto di che cosa è fatto un processore; questa descrive che cosa fa. Ha due metà. La prima segue una singola istruzione: come è codificata in 32 bit e quali passi compie il processore per eseguirla. La seconda spiega che cosa accade quando arriva qualcosa di più urgente del programma corrente, un timer, un dispositivo o un errore, così che il processore debba sospendere il suo lavoro e riprenderlo più tardi. Le due metà sono collegate: l'interruzione è una modifica proprio del ciclo che la prima metà descrive. La battuta in copertina, come si vedrà, è quasi letteralmente vera.

## Slide 2: Che cosa saprete fare alla fine

Sei risultati di apprendimento. Descrivere un'istruzione come codice operativo con i suoi operandi. Decodificare a mano un'istruzione RISC-V. Seguire un'istruzione attraverso le cinque fasi del ciclo del processore. Spiegare che cos'è una pipeline e perché aumenta il throughput. Definire interruzione, eccezione e trap, tre termini che RISC-V usa con precisione. E descrivere che cosa fa l'hardware a una trap e come riprende il programma interrotto.

## Slide 3: Di che cosa è fatta un'istruzione

Ogni processore fornisce quattro famiglie di istruzioni: trasferimenti tra memoria e registri, operazioni aritmetiche e logiche, controllo del flusso e ingresso/uscita. Un'istruzione consiste di un *codice operativo*, l'opcode, che specifica che cosa fare, seguito da zero o più *operandi*, che specificano su che cosa. Un operando può essere una costante scritta dentro l'istruzione, un immediato; una locazione di memoria; o un registro. Alcuni operandi sono impliciti, come l'accumulatore in una macchina ad accumulatore. Le istruzioni hanno da zero a tre operandi.

## Slide 4: I formati delle istruzioni RISC-V

I formati delle istruzioni RISC-V. Ogni istruzione è lunga 32 bit e divisa in campi. Nel formato R, per le operazioni tra registri, ci sono tre numeri di registro di cinque bit, `rs1`, `rs2` e `rd`, e tre campi che selezionano l'operazione. Nel formato I il secondo registro sorgente è sostituito da un immediato di 12 bit. S e B, per memorizzazioni e salti condizionati, dividono l'immediato in due parti. U e J portano un immediato di 20 bit. La regolarità è un obiettivo di progetto: l'opcode occupa sempre i sette bit più bassi e i campi registro sempre le stesse posizioni, così la decodifica può cominciare prima di conoscere il formato. Le forme compresse a 16 bit dell'estensione C sono qui solo nominate; l'Appendice A del libro le elenca.

## Slide 5: Modi di indirizzamento: dove si trova un operando

Un *modo di indirizzamento* è un metodo per trovare un operando. RISC-V ne fornisce quattro. *Immediato*: l'operando è una costante dentro l'istruzione. *A registro*: è il contenuto di un registro. *Base più spiazzamento*: è la parola di memoria all'indirizzo formato da un registro più una costante, l'unico modo di raggiungere la memoria. *Relativo al PC*: un indirizzo a una data distanza dall'istruzione stessa, usato dai salti. L'indirizzamento indiretto in memoria, in cui l'indirizzo stesso risiede in memoria, non esiste: richiede due caricamenti. È la trattazione formale promessa nella Lezione 02, quando si distinsero per la prima volta indirizzo e valore.

## Slide 6: Le fasi del ciclo

Cinque fasi. *Prelievo*: l'istruzione all'indirizzo contenuto nel PC viene letta dalla memoria e il PC fatto avanzare. *Decodifica*: si riconosce l'opcode e si leggono i registri nominati nell'istruzione. *Esecuzione*: la ALU calcola un risultato, un indirizzo o un confronto. *Memoria*: i caricamenti leggono la memoria, le memorizzazioni la scrivono, e le altre istruzioni in questa fase non fanno nulla. *Scrittura del risultato*: il risultato viene scritto nel registro destinazione. Dopo l'avvio iniziale il processore ripete questo ciclo all'infinito.

## Slide 7: La pipeline

Se ogni fase ha hardware dedicato, le fasi di istruzioni successive si possono sovrapporre. Nella tabella ogni riga è un'istruzione e ogni colonna un ciclo di clock: mentre la prima istruzione è in esecuzione, la seconda viene decodificata e la terza prelevata. Ogni istruzione richiede ancora cinque cicli, ma se ne completa una per ciclo: è la *pipeline*, il principio della catena di montaggio, che aumenta il throughput senza ridurre la latenza. I processori superscalari affiancano più pipeline, come mostra la Lezione 24. Il core principale del kit ha una pipeline a quattro stadi.

## Slide 8: Il problema del ciclo semplice

Un processore che non facesse altro che prelevare, decodificare ed eseguire avrebbe tre problemi. La comunicazione con i dispositivi sarebbe inefficiente, perché il programma dovrebbe interrogare ripetutamente ogni dispositivo. Un programma intrappolato per errore in un ciclo infinito, come il `j loop` della slide, non potrebbe mai essere rimosso. E il sistema operativo avrebbe scarso controllo sulla macchina. Tutti e tre hanno una sola soluzione: un meccanismo per sottrarre il processore al programma in esecuzione.

## Slide 9: Interruzioni

La definizione: le *interruzioni* sono eventi eccezionali, di solito asincroni rispetto al programma in esecuzione, che richiedono l'attenzione del processore. RISC-V distingue tre termini. Un'*interruzione* nasce fuori dal programma e può arrivare in qualsiasi momento: un timer, un dispositivo. Un'*eccezione* è causata dall'istruzione in esecuzione: un opcode non valido, un indirizzo vietato. Una *trap* è il trasferimento del controllo a un gestore, qualunque ne sia la causa. Altre architetture usano queste parole con meno rigore, quindi l'uso di RISC-V conviene adottarlo per la sua chiarezza.

## Slide 10: Il ciclo reale del processore

Il ciclo reale. Dopo l'avvio il processore preleva, decodifica ed esegue; poi, al termine di ogni istruzione, verifica se c'è un'interruzione in attesa. Se non ce n'è, torna al prelievo. Se ce n'è una, prende la trap: entra nello stato privilegiato e comincia a eseguire una routine di sistema, il gestore. Quando il gestore termina, il programma sospeso riprende come se nulla fosse accaduto. I due percorsi del diagramma vanno seguiti; il ciclo breve è il caso comune.

## Slide 11: Possibili cause di interruzione

Sei cause di interruzione. Un'interruzione *periodica* da un timer, usata per condividere il processore tra programmi. Un'interruzione di *I/O*, con cui una periferica segnala di essere pronta. Gli *errori di programma*, come un'istruzione che non esiste: sono le eccezioni. I *guasti di sistema*: alimentazione, temperatura. Il *reset*, che riporta tutto a uno stato noto. E l'interruzione *software*, con cui un programma chiede un servizio al sistema operativo: in RISC-V, l'istruzione `ecall`.

## Slide 12: Gestire un'interruzione

La procedura generale in sei passi. Salvare il contesto, parte hardware: come minimo l'indirizzo a cui riprendere. Identificare la causa. Saltare al punto di ingresso della *routine di servizio dell'interruzione*. Salvare il contesto, parte software: i registri che la routine userà. Servire l'interruzione. Infine ripristinare il contesto e riprendere il programma sospeso all'istruzione successiva all'ultima eseguita. Il *contesto* è tutto ciò che il programma interrotto ha bisogno di ritrovare invariato, e la sua conservazione è ciò che rende invisibile l'interruzione.

## Slide 13: I registri del meccanismo delle trap

Sei registri. `mtvec`, scritto una volta dal firmware, contiene l'indirizzo del gestore delle trap. `mstatus` contiene MIE, l'abilitazione globale delle interruzioni, e MPIE, il suo valore precedente. `mie` contiene un bit di abilitazione per sorgente, `mip` un bit di attesa per sorgente. `mepc` riceve, a ogni trap, l'indirizzo dell'istruzione interrotta. `mcause` riceve la causa. La colonna centrale merita attenzione: alcuni registri sono scritti dal firmware per configurare il meccanismo, altri dall'hardware quando avviene una trap.

## Slide 14: Che cosa fa l'hardware a una trap

Le azioni dell'hardware a una trap, nell'ordine. Scrive in `mepc` l'indirizzo dell'istruzione interrotta. Scrive la causa in `mcause`. Copia MIE in MPIE e azzera MIE, disabilitando ulteriori interruzioni. Entra nel modo macchina. Carica il PC con l'indirizzo contenuto in `mtvec`. Nulla viene salvato su uno stack: i registri generali sono lasciati al gestore, coerentemente con l'assenza di stato nascosto notata nella Lezione 18. L'istruzione `mret`, alla fine del gestore, annulla tutto: MIE riprende MPIE e il PC riprende `mepc`.

## Slide 15: La causa di una trap: mcause

Il contenuto di `mcause`. Il bit più alto indica se la trap è stata un'interruzione o un'eccezione; i bit restanti sono un codice. Le tre interruzioni, evidenziate, sono software, timer ed esterna, cioè un dispositivo. Tra le eccezioni ci sono istruzione non valida, breakpoint, errore di accesso in un caricamento o in una memorizzazione, ed `ecall`. Lo stesso numero può comparire in entrambe le famiglie con significati diversi, ed è per questo che serve il bit più alto. La riga del breakpoint spiega come un debugger come quello di PRG32-QT ferma un programma.

## Slide 16: Le interruzioni sul kit PRG32

Tutto questo avviene sul kit. Un timer interrompe il processore cento volte al secondo, e il firmware lo usa per tenere il tempo e scandire i frame. Il display e l'audio interrompono quando chiedono altri dati. La radio interrompe quando arriva un pacchetto, ed è per questo che si può caricare una cartuccia mentre un gioco è in esecuzione. Le funzioni `init`, `update` e `draw` sono funzioni ordinarie eseguite tra un'interruzione e l'altra. E una cartuccia bloccata in un ciclo non ferma le interruzioni: PRG32-QT segnala un errore, e sulla scheda un watchdog segnala il blocco.

## Slide 17: Verifica la comprensione: In quali bit di un'istruzione RISC-V sta l'opcode? / Durante il prelievo di un'istruzione RV32 non compressa, il PC viene incrementato di:

Per la prima domanda si torna alla slide dei formati: un campo occupa la stessa posizione in tutte e quattro le righe.

Per la seconda: gli indirizzi contano i byte, e la domanda è quanti byte occupa un'istruzione a 32 bit.

## Slide 18: Verifica la comprensione: Quale registro contiene l'indirizzo da cui riprenderà un programma RISC-V interrotto? / Quale di questi è un'eccezione e non un'interruzione, nei termini di RISC-V?

Per la prima domanda sono coinvolti quattro registri: uno contiene l'indirizzo del gestore, uno la causa, uno l'indirizzo a cui riprendere. `ra` appartiene alle chiamate di procedura, non alle trap.

Per la seconda vale la definizione: un'eccezione è causata dall'istruzione in esecuzione, mentre un'interruzione arriva da fuori in un momento arbitrario. Tre dei quattro eventi nascono fuori dal programma.

## Slide 19: Glossario: inglese e italiano

Dodici termini. L'*operation code* è il *codice operativo*; un *addressing mode* è un *modo di indirizzamento*. *Fetch*, *decode* ed *execute* sono *prelievo*, *decodifica* ed *esecuzione*. L'*interrupt service routine* è la routine che serve un'interruzione. La *latenza di interruzione* è il ritardo tra la richiesta e l'inizio del lavoro utile. *Mascherare* un'interruzione significa impedirne temporaneamente l'accettazione.

## Slide 20: Conclusioni e letture

Cinque conclusioni. Un'istruzione è un codice operativo con i suoi operandi; in RISC-V è sempre lunga 32 bit, in sei formati regolari, salvo le forme compresse. Una lunghezza fissa mantiene semplice il prelievo: il PC avanza di una costante, 4 per un'istruzione non compressa. Il processore esegue un ciclo: prelievo, decodifica, esecuzione, scrittura del risultato. Gli eventi eccezionali interrompono il ciclo: il processore registra dove si trovava, serve l'evento e riprende. Le interruzioni si possono abilitare, mascherare e ordinare per priorità, e RISC-V ottiene tutto questo con una manciata di registri e `mret`. La prossima lezione lascia il processore per i bus e la scheda video.
