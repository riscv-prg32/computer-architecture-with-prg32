# Lezione 16: La memoria permanente

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: ROM, flash, firmware; l'architettura di von Neumann; la cache; la memoria secondaria. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Slide 1: La memoria permanente

La lezione precedente ha trattato la memoria che dimentica quando si toglie l'alimentazione. Questa tratta le memorie che non dimenticano: i chip che contengono il firmware, i dischi magnetici, i supporti ottici e i nastri. Tra le due colloca la cache, una piccola memoria veloce che nasconde la lentezza di una grande, e l'idea che unifica la lezione è che questa stessa strategia ricorre a ogni scala. La citazione è di un professore di calcolo numerico di questo Ateneo, e ogni studente prima o poi ne impara la verità: un dato non esiste finché non è stato salvato.

## Slide 2: Che cosa saprete fare alla fine

Sei risultati di apprendimento. Nominare le unità funzionali di un calcolatore e individuarle su una scheda madre e sul kit. Distinguere ROM, PROM, EPROM, EEPROM e flash, e dire che cos'è il firmware. Spiegare perché una cache rende più veloce un calcolatore, e che cos'è un miss. Descrivere tracce, settori e blocchi di un disco magnetico e le componenti del suo tempo di accesso. Spiegare come un disco ottico memorizza i bit e come si legge un compact disc. E collocare flash, dischi a stato solido, dischi rigidi e nastri in un sistema di memorizzazione a più livelli.

## Slide 3: Unità funzionali di un calcolatore

Sei schede: il processore, la memoria centrale, la memoria secondaria, i dispositivi di ingresso e uscita, le linee di comunicazione, e un'osservazione sull'integrazione fisica. Ogni scheda nomina l'unità e la individua sul kit: il core RISC-V, i 512 KB di SRAM, il chip di flash, il display con il suo joystick e l'amplificatore. L'ultima scheda dice la differenza tra un PC e un microcontrollore: il primo distribuisce le unità su una scheda madre, il secondo le integra quasi tutte in un solo contenitore.

## Slide 4: Il firmware: il BIOS e i suoi eredi

Il *firmware* è il software di base contenuto in una memoria non volatile. In un PC si chiamava BIOS e svolgeva quattro compiti: verificare i dispositivi all'accensione, configurarli, avviare il sistema operativo, e offrire servizi elementari per tastiera e dischi; il suo successore contemporaneo è UEFI. Il kit ha una catena analoga: un piccolo programma in ROM avvia un bootloader in flash, che avvia il firmware di PRG32, che carica la cartuccia scelta. Ogni stadio individua, verifica e avvia il successivo, una struttura nota come catena di avvio.

## Slide 5: Dalla ROM alla flash

La tabella, letta dall'alto in basso, è una storia di comodità crescente. Una ROM è scritta dal fabbricante una volta per tutte. Una PROM può essere scritta dall'utente, una volta. Una EPROM si può cancellare per intero esponendola alla luce ultravioletta attraverso una finestrella, e poi riscrivere. Una EEPROM si cancella elettricamente, un byte alla volta, senza toglierla dal circuito. La *flash* si cancella elettricamente a blocchi: meno flessibile della EEPROM, ma molto più economica per bit, e oggi onnipresente.

## Slide 6: La memoria flash

Tre proprietà della flash ne determinano l'uso. Si cancella a blocchi, non per singoli byte: la cancellazione porta a 1 ogni bit di un blocco, e la scrittura può solo trasformare gli 1 in 0. Ogni blocco sopporta un numero limitato di cancellazioni, quindi un controllore distribuisce uniformemente le scritture, una tecnica chiamata wear levelling. E la lettura è veloce, mentre la scrittura, e soprattutto la cancellazione, sono lente. È per questo che il punteggio migliore del riscaldamento non viene semplicemente scritto nella cartuccia a ogni frame: la flash non è un supporto per variabili.

## Slide 7: Perché una cache?

Mentre la memoria viene letta o scritta il processore attende, e più la memoria è lenta, più cicli di clock si perdono. Perché non rendere tutta la memoria veloce quanto i registri? Perché dovrebbe allora risiedere sullo stesso chip del processore, il che impedisce di renderla grande. Il compromesso è una memoria piccola e veloce sul chip del processore e una più grande e lenta raggiunta attraverso il bus, che è la gerarchia di memoria della Lezione 15 ridotta ai suoi due livelli superiori.

## Slide 8: Come funziona una cache

La *cache* si colloca tra il processore e la memoria centrale. A ogni accesso il processore guarda prima nella cache. Se il contenuto dell'indirizzo richiesto è presente, l'accesso è un *hit* e il dato arriva subito. Se non lo è, l'accesso è un *miss*: il dato viene copiato dalla memoria centrale nella cache, insieme a un certo numero di locazioni vicine, che formano una linea di cache. La scommessa alla base del progetto è il principio di località: un programma che ha appena usato un indirizzo è probabile che lo usi di nuovo presto, o che usi i suoi vicini. I cicli sono la fonte della località temporale, gli array di quella spaziale.

## Slide 9: Livelli di cache e macchine tipiche

Cifre rappresentative. Un PC ha più livelli di cache: un primo livello di decine di kilobyte dentro ogni core, un secondo di centinaia di kilobyte, e un terzo di megabyte condiviso tra i core. L'ultima colonna è il kit: nessuna cache davanti alla sua SRAM, che è già veloce quanto il core richiede, e solo la flash esterna è letta attraverso una piccola cache. Il confronto tra le colonne mostra anche quanto sono cresciute memoria centrale e memorizzazione in vent'anni.

## Slide 10: Caratteristiche delle memorie secondarie

Quattro proprietà caratterizzano le memorie secondarie rispetto alla memoria centrale. Non sono volatili. La loro capacità è di diversi ordini di grandezza maggiore, e il loro costo per bit di diversi ordini di grandezza minore. Il loro accesso è di alcuni ordini di grandezza più lento. Due ulteriori fatti ne riguardano l'organizzazione: l'informazione si memorizza a blocchi, non per singoli byte, e alcuni supporti permettono l'accesso diretto a qualsiasi blocco mentre altri, come il nastro, solo l'accesso sequenziale.

## Slide 11: Dischi magnetici: tracce, settori, blocchi

La geometria di un disco magnetico. Piatti rivestiti di un materiale magnetizzabile ruotano a velocità costante, mentre delle testine leggono e scrivono. La superficie è divisa in *tracce* concentriche e in *settori*, regioni a spicchio. Un settore divide ogni traccia in *blocchi*, e il blocco, identificato dalla sua traccia e dal suo settore, è la più piccola unità indirizzabile. La *formattazione* è l'operazione che stabilisce questa divisione. L'accesso è diretto: la testina può raggiungere qualsiasi blocco senza attraversare tutti quelli che lo precedono.

## Slide 12: Tempo di accesso di un disco magnetico

Il tempo di accesso di un disco è la somma di tre componenti. Il *tempo di ricerca*: il tempo per spostare radialmente la testina sulla traccia giusta. La *latenza rotazionale*: l'attesa che il settore desiderato arrivi sotto la testina, che dipende dalla velocità di rotazione. Il *tempo di trasferimento*: il tempo perché il blocco passi sotto la testina. Il totale è dell'ordine dei millisecondi, circa un milione di volte più lento della RAM: durante un accesso al disco il processore del kit potrebbe eseguire più di centomila istruzioni. Il divario spiega perché i sistemi operativi si impegnano tanto a evitare gli accessi al disco.

## Slide 13: Dischi rigidi e dischi a stato solido

Due tecnologie che servono lo stesso scopo. Un disco rigido ha piatti magnetici e testine in movimento; il suo tempo di accesso è dominato dalla meccanica, ma il suo costo per terabyte è il più basso disponibile, e resta la scelta per grandi archivi e copie di sicurezza. Un disco a stato solido è memoria flash con un controllore e senza parti in movimento; il suo tempo di accesso è dell'ordine delle decine di microsecondi, ed è la memorizzazione standard di portatili e telefoni. Usa la stessa tecnologia del chip di flash del kit.

## Slide 14: Dischi ottici

Un disco ottico si legge con un fascio laser il cui riflesso cambia tra le *buche* e la superficie piana, la *land*. Un punto viene immancabilmente chiesto all'esame: 0 e 1 non corrispondono a buca e land. Un 1 è una *transizione*, da buca a land o da land a buca; uno 0 è l'assenza di transizione. Questi dischi si scrivono di solito una volta sola, perché la modifica fisica è irreversibile, il che li rende adatti a distribuire software e ad archivi che non devono essere alterati.

## Slide 15: Il compact disc

Su un compact disc l'informazione si trova su un'unica traccia a spirale, con 1,6 micrometri tra una spira e la successiva. La densità di registrazione è costante lungo la spirale, quindi per leggere a velocità costante il disco deve girare più in fretta vicino al centro e più lentamente vicino al bordo: è la *velocità lineare costante*. L'alternativa, la *velocità angolare costante*, mantiene fissa la rotazione e spreca capacità nella regione esterna. La velocità originaria fu dettata dalle esigenze della riproduzione audio.

## Slide 16: Una memoria permanente a più livelli

Cinque livelli di memoria permanente, dal più veloce al più economico: un RAM disk, una porzione di memoria centrale usata come disco; i dischi a stato solido; i dischi rigidi; le librerie di dischi, in cui alcuni dischi si alimentano solo quando servono; e le librerie di nastri, in cui dei robot montano i nastri. Il sistema sposta i dati automaticamente: i dati usati spesso migrano verso i livelli veloci, il resto scende verso quelli economici. È il principio della cache, applicato alla memorizzazione, e la lezione si chiude così sull'idea con cui era cominciata.

## Slide 17: Verifica la comprensione: Quale memoria si può cancellare elettricamente, a blocchi, senza rimuoverla dalla scheda? / Che cosa accade su un cache miss?

Per la prima domanda ogni voce della tabella delle memorie non volatili si esamina con due domande: come si cancella, e in quale quantità alla volta? Una sola si cancella elettricamente e a blocchi.

Per la seconda: un miss non è un errore. Il programma non osserva nulla oltre a un accesso più lungo: il dato viene prelevato dalla memoria centrale e conservato nella cache insieme ai suoi vicini.

## Slide 18: Verifica la comprensione: Quale componente del tempo di accesso di un disco rigido dipende dalla velocità di rotazione? / Su un disco ottico, un 1 è codificato come:

Per la prima domanda ci si chiede quale delle tre componenti sia un'attesa che il disco ruoti. Il movimento del braccio non dipende dalla rotazione, e formattazione e avvio non sono componenti del tempo di accesso.

Per la seconda vale la regola dei dischi ottici: ciò che conta non è la buca o la land ma la transizione tra di esse.

## Slide 19: Glossario: inglese e italiano

Dieci termini. La *motherboard* è la *scheda madre*. Un *hit* e un *miss* della cache indicano il successo e l'insuccesso nel trovare il dato. *Seek time* e *latency* sono due componenti del tempo di accesso di un disco. La *mass storage* indica la memoria secondaria nel suo insieme. Una *tape library* è un sistema di memorizzazione con nastri movimentati da robot.

## Slide 20: Conclusioni e letture

Cinque conclusioni. Le memorie non volatili contengono tipicamente il firmware, il software di base di una macchina. La cache migliora le prestazioni tenendo una copia di parte della memoria centrale vicino al processore. La stessa idea, un livello piccolo e veloce davanti a uno grande e lento, ricorre nei sistemi di memorizzazione. Le memorie permanenti possono essere a semiconduttore, magnetiche od ottiche. E un sistema moderno comprende più livelli, gestiti automaticamente. Segue la Parte 3 di Verm1, che usa la memoria come il progetto non l'ha ancora usata.
