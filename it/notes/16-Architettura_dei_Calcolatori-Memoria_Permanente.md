# Lezione 16: La memoria permanente

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; `node notes.js` controlla che ogni slide abbia la sua nota.

## Slide 1: La memoria permanente

La lezione precedente trattava la memoria che dimentica quando manca la corrente. Questa tratta le memorie che non dimenticano: i chip che contengono il firmware, i dischi, i supporti ottici, i nastri. Tra le due colloca la cache, una memoria piccola e veloce che nasconde la lentezza di una grande. La citazione è di un professore di calcolo numerico di questo Ateneo, e ogni studente prima o poi ne impara la verità: un dato non esiste se non è stato salvato.

## Slide 2: Che cosa saprete fare alla fine

Sei obiettivi. Nominare le unità funzionali di un calcolatore e trovarle su una scheda madre e sul kit. Distinguere ROM, PROM, EPROM, EEPROM e flash, e dire che cos'è il firmware. Spiegare perché una cache rende più veloce un calcolatore, e che cos'è un miss. Descrivere tracce, settori e blocchi di un disco magnetico e le componenti del suo tempo di accesso. Spiegare come un disco ottico memorizza i bit. E collocare flash, dischi a stato solido, dischi rigidi e nastri in un sistema di memoria a più livelli.

## Slide 3: Riscaldamento sulla macchina

Il riscaldamento è un esperimento con l'interruttore. Una cartuccia ha un titolo e un punteggio migliore. Prevedete quale dei due c'è ancora dopo aver spento e riacceso il kit.

## Slide 4: Spegnete e riaccendete il kit

Il titolo sta nella sezione `.rodata`, che fa parte del file della cartuccia: il file è memorizzato nella flash e sopravvive. Il punteggio migliore è una variabile della sezione `.data`, che viene copiata in RAM all'avvio della cartuccia: vive nella SRAM e si perde. Quindi dopo uno spegnimento il titolo c'è e il punteggio vale di nuovo 0. Per conservare per sempre un punteggio bisogna scriverlo in una memoria permanente, e la lezione presenta quelle che esistono. Notate dove vive ogni sezione di un programma.

## Slide 5: I componenti di un calcolatore

Prima delle memorie, uno sguardo alle macchine intere: quali unità compongono un calcolatore, e dove stanno su una scheda vera.

## Slide 6: Unità funzionali di un calcolatore

Sei riquadri: il processore, la memoria centrale, la memoria secondaria, i dispositivi di ingresso e uscita, le linee di comunicazione, e un'osservazione sul contenitore. Ogni riquadro nomina l'unità e poi dice dove sta sul kit: il core RISC-V, i 512 KB di SRAM, il chip flash, il display con joystick e amplificatore. L'ultimo riquadro è la differenza tra un PC e un microcontrollore: il primo distribuisce le unità su una scheda madre, il secondo le mette quasi tutte in un solo contenitore.

## Slide 7: La scheda madre

Una scheda madre, vista come architettura. Zoccoli per i processori e per i moduli di memoria, vicini perché il bus tra loro deve essere corto. Un chipset che collega processore, memoria e periferiche. Bus di espansione per le schede video. Connessioni per la memoria di massa e per il mondo esterno. E un chip flash con il firmware che avvia la macchina. Da questo punto di vista una scheda di vent'anni fa e una di oggi hanno molto in comune: le unità sono le stesse.

## Slide 8: Il firmware: il BIOS e i suoi eredi

Il *firmware* è il software di base conservato in una memoria non volatile. In un PC si chiamava BIOS e faceva quattro lavori: provare i dispositivi all'accensione, configurarli, avviare il sistema operativo, e offrire funzioni di base per tastiera e dischi; oggi il suo erede si chiama UEFI. Il kit ha una catena simile: un piccolo programma in ROM lancia un bootloader in flash, che lancia il firmware PRG32, che carica la cartuccia scelta. Ogni stadio trova, controlla e avvia il successivo.

## Slide 9: Memorie non volatili

Le memorie che conservano il contenuto senza alimentazione. Formano una famiglia in cui ogni generazione è più facile da riscrivere della precedente.

## Slide 10: Dalla ROM alla flash

Leggete la tabella dall'alto in basso come una storia della comodità. Una ROM è scritta dal costruttore una volta per tutte. Una PROM può essere scritta dall'utente, una volta. Una EPROM si può cancellare, tutta insieme, esponendola alla luce ultravioletta attraverso una finestrella, e riscrivere. Una EEPROM si cancella elettricamente, un byte alla volta, senza rimuoverla. La *flash* si cancella elettricamente a blocchi: meno flessibile della EEPROM, ma molto più economica, e oggi è ovunque.

## Slide 11: La memoria flash

Tre proprietà della flash spiegano come la si usa. Si cancella a blocchi, non a byte singoli: cancellare porta a 1 tutti i bit di un blocco, e scrivere può solo trasformare degli 1 in 0. Ogni blocco sopporta un numero limitato di cancellazioni, quindi un controllore distribuisce le scritture in modo uniforme. E la lettura è veloce, mentre la scrittura e soprattutto la cancellazione sono lente. Ecco perché il punteggio migliore del riscaldamento non viene semplicemente scritto nella cartuccia a ogni frame: la flash non è un posto per le variabili.

## Slide 12: La cache

La cache non è una memoria permanente, ma sta qui perché poggia sull'idea che organizza tutti i livelli di memoria: un livello piccolo e veloce davanti a uno grande e lento.

## Slide 13: Perché una cache?

Mentre la memoria viene letta o scritta il processore aspetta, e più la memoria è lenta più cicli di clock si perdono. Perché non fare tutta la memoria veloce quanto i registri? Perché dovrebbe stare sullo stesso chip del processore, e allora non potrebbe essere grande. Il compromesso: una memoria piccola e veloce sul chip del processore, e una più grande e più lenta raggiunta attraverso il bus.

## Slide 14: Come funziona una cache

La *cache* sta tra il processore e la memoria centrale. A ogni accesso il processore guarda prima nella cache. Se il contenuto dell'indirizzo richiesto c'è, è un *hit* e il dato arriva subito. Se non c'è, è un *miss*: il dato viene copiato dalla memoria centrale nella cache, insieme a un certo numero di locazioni vicine. La scommessa che sta dietro è il principio di località: un programma che ha appena usato un indirizzo probabilmente userà di nuovo presto quello, o i suoi vicini. La ragione sono i cicli e i vettori.

## Slide 15: Livelli di cache e macchine tipiche

Numeri tipici. Un PC ha più livelli di cache: un primo livello di decine di kilobyte dentro ogni core, un secondo di centinaia di kilobyte, e un terzo di megabyte condiviso dai core. L'ultima colonna è il kit: nessuna cache davanti alla sua SRAM, perché quella memoria è già veloce quanto serve al core; solo la flash esterna si legge attraverso una piccola cache. Il confronto fra le tre colonne mostra anche quanto sono cresciute memoria centrale e memoria di massa in vent'anni.

## Slide 16: La memoria secondaria

Ora le memorie che conservano ciò che deve sopravvivere: la memoria secondaria, detta anche memoria di massa.

## Slide 17: Caratteristiche delle memorie secondarie

Quattro proprietà definiscono le memorie secondarie rispetto alla memoria centrale. Sono non volatili. La loro capacità è di diversi ordini di grandezza maggiore. Il loro costo per bit è di diversi ordini di grandezza minore. E il loro accesso è di alcuni ordini di grandezza più lento. Altri due fatti riguardano l'organizzazione: l'informazione è memorizzata a blocchi, non a byte singoli, e alcuni supporti permettono l'accesso diretto a qualunque blocco mentre altri, come i nastri, solo l'accesso sequenziale.

## Slide 18: Dischi magnetici: tracce, settori, blocchi

La geometria di un disco magnetico. Piatti rivestiti di materiale magnetizzabile ruotano a velocità costante, e delle testine leggono e scrivono. La superficie è divisa in *tracce* concentriche e in *settori*, spicchi come quelli di una torta. Un settore taglia ogni traccia in *blocchi*, e il blocco, identificato da traccia e settore, è la più piccola unità indirizzabile. La *formattazione* è l'operazione che traccia questa divisione. L'accesso è diretto: la testina va su qualunque blocco senza passare su tutti i precedenti.

## Slide 19: Tempo di accesso di un disco magnetico

Il tempo di accesso di un disco è la somma di tre tempi. *Tempo di posizionamento*: quello per spostare la testina in senso radiale sulla traccia giusta. *Latenza*: l'attesa che il settore desiderato passi sotto la testina, che dipende dalla velocità di rotazione. *Tempo di trasferimento*: quello perché il blocco passi sotto la testina. Il totale è questione di millisecondi: un milione di volte più lento della RAM. Nel tempo di un accesso al disco il processore del kit potrebbe eseguire più di centomila istruzioni.

## Slide 20: Dischi rigidi e dischi a stato solido

Due tecnologie per lo stesso lavoro. Un disco rigido ha piatti magnetici e testine mobili: il suo tempo di accesso è dominato dalla meccanica, ma il costo per terabyte è il più basso, e resta la scelta per grandi archivi e backup. Un disco a stato solido è memoria flash con un controllore e nessuna parte mobile: il suo tempo di accesso è di decine di microsecondi, ed è la memoria di massa standard di portatili e telefoni. È la stessa tecnologia del chip flash del kit.

## Slide 21: Dischi ottici

Una terza famiglia di memorie permanenti legge i bit con la luce. La sua importanza commerciale è diminuita, ma le sue idee, la traccia a spirale e la codifica per transizioni, meritano di essere conosciute.

## Slide 22: Dischi ottici

Un disco ottico è letto da un raggio laser la cui riflessione cambia tra le cavità, i *pit*, e la superficie piana, il *land*. Il punto che all'esame viene sempre chiesto: 0 e 1 non sono pit e land. Un 1 è un *cambiamento*, da pit a land o da land a pit; uno 0 è nessun cambiamento. Questi dischi di solito si scrivono una volta sola, perché la modifica fisica è irreversibile, e questo li rende adatti a distribuire programmi e ad archivi che non devono essere alterati.

## Slide 23: Il compact disc

In un compact disc l'informazione sta su un'unica traccia a spirale, con una distanza di 1,6 micrometri tra una spira e la successiva. La densità di registrazione è costante lungo la spirale, quindi per leggere a ritmo costante il disco deve girare più in fretta vicino al centro e più lentamente vicino al bordo: è la *velocità lineare costante*. L'alternativa, la *velocità angolare costante*, tiene costante la rotazione e spreca la parte esterna del disco. La velocità fu fissata in origine dalle esigenze della musica.

## Slide 24: DVD e CD a confronto

Un DVD è un compact disc in cui tutto è più piccolo: pit di 0,4 invece di 0,83 micrometri e un passo della traccia di 0,74 invece di 1,6. Può inoltre avere due strati e due lati. Il risultato sono circa 5 GB per strato contro 0,68 GB, e una velocità di trasferimento molto maggiore. Le dimensioni fisiche del disco, 120 millimetri di diametro e 1,2 di spessore, sono le stesse.

## Slide 25: La memoria di massa a più livelli

L'ultima idea della lezione: un sistema reale non sceglie una memoria permanente, ne usa diverse, disposte a livelli.

## Slide 26: Una memoria permanente a più livelli

Cinque livelli di memoria permanente, dal più veloce al più economico: un RAM disk, che è un pezzo di memoria centrale usato come disco; i dischi a stato solido; i dischi rigidi; le librerie di dischi, in cui alcuni dischi sono accesi solo quando servono; e le librerie a nastri, in cui dei robot montano i nastri. Il sistema sposta i dati in automatico: ciò che si usa spesso migra verso i livelli veloci, il resto scende verso quelli economici. È l'idea della cache, applicata alla memoria di massa.

## Slide 27: La memoria di massa su grande scala

Tre immagini di memoria di massa a scale diverse: le librerie di dischi e di nastri di un centro di calcolo, un disco a stato solido, l'interno di un lettore DVD. La frase sotto riassume la lezione: da un chip di pochi megabyte sul kit a stanze di petabyte, la gerarchia è la stessa.

## Slide 28: Verifica la comprensione: Quale memoria si può cancellare elettricamente, a blocchi, senza rimuoverla dalla scheda?

Scorrete la tabella delle memorie non volatili facendovi due domande per ciascuna: come si cancella, e quanto alla volta? Solo una si cancella elettricamente e a blocchi.

## Slide 29: Verifica la comprensione: Che cosa accade su un cache miss?

Un miss non è un errore. Il programma non si accorge di nulla, se non che questo accesso dura di più: il dato viene prelevato dalla memoria centrale e tenuto nella cache insieme ai suoi vicini.

## Slide 30: Verifica la comprensione: Quale componente del tempo di accesso di un disco rigido dipende dalla velocità di rotazione?

Quale dei tre tempi è un'attesa che il disco giri? Il movimento del braccio non dipende dalla rotazione; formattazione e avvio non sono componenti del tempo di accesso.

## Slide 31: Verifica la comprensione: Su un disco ottico, un 1 è codificato come:

Ricordate la regola dei dischi ottici: non conta il pit o il land, ma il passaggio dall'uno all'altro.

## Slide 32: Esercizi

Cinque esercizi. Calcolate la latenza media di un disco a 7200 giri al minuto: mezzo giro. Calcolate il tempo medio di accesso di una cache con il 95% di hit. Dite dove vivono sul kit cinque cose: il codice di avvio, il firmware, una cartuccia, una variabile, un registro. Trovate le specifiche della memoria di massa del vostro portatile o telefono. E misurate su PRG32 due cicli su un grande vettore, uno in ordine e uno a salti: c'è differenza, e perché su questo chip potrebbe non esserci?

## Slide 33: Glossario: inglese e italiano

Dieci termini. *Motherboard* è la scheda madre. *Hit* e *miss* di cache sono il successo e il fallimento nel trovare il dato. *Seek time* e *latency*, tempo di posizionamento e latenza, sono due componenti del tempo di accesso di un disco. *Mass storage* è la memoria di massa, cioè la memoria secondaria nel suo insieme. Una *tape library* è un sistema di memoria a nastri gestiti da robot.

## Slide 34: Conclusioni e letture

Cinque conclusioni. Le memorie non volatili contengono di solito il firmware, il software di base di una macchina. La cache migliora le prestazioni tenendo vicino al processore una copia di parte della memoria centrale. La stessa idea, un livello piccolo e veloce davanti a uno grande e lento, si riusa nella memoria di massa. Le memorie permanenti possono essere a semiconduttore, magnetiche o ottiche. E un sistema moderno ha più livelli, gestiti in automatico. Ora viene la Parte 3 di Verm1, che usa la memoria come finora nel progetto non era mai stata usata.
