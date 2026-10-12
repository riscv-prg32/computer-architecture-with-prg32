# Lezione 24: Oltre un solo core: RISC-V superscalare, HPC, GPU e FPGA

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; `node notes.js` controlla che ogni slide abbia la sua nota.

## Slide 1: Oltre un solo core: RISC-V superscalare, HPC, GPU e FPGA

L'ultima lezione guarda oltre il kit. Tutto ciò che avete imparato lo avete imparato su un piccolo processore che esegue un'istruzione alla volta. Le macchine che prevedono il tempo o addestrano una rete neurale eseguono lo stesso tipo di istruzioni, in numero enorme e tutte insieme. La lezione prende un piccolo ciclo di Verm1 e lo segue su quattro tipi di macchina. La domanda di Cray su buoi e polli tornerà: non ha una risposta unica. Questa lezione è uno sguardo in avanti, e non fa parte della prova intercorso.

## Slide 2: Che cosa saprete fare alla fine

Cinque obiettivi. Scrivere l'equazione delle prestazioni e dire quale dei suoi fattori attacca ciascuna tecnica. Spiegare come un processore superscalare fuori ordine esegue più istruzioni per ciclo. Leggere un ciclo scritto con l'estensione vettoriale di RISC-V. Descrivere un supercalcolatore, calcolare uno speed-up con la legge di Amdahl e dire perché il limite è l'energia. E dire in che cosa sono forti una GPU e una FPGA, e quanto costa ciascuna al programmatore.

## Slide 3: Riscaldamento sulla macchina

Il riscaldamento è un ciclo che avete già scritto, e una domanda: quanto potrebbe andare veloce?

## Slide 4: Il ciclo che svuota la mappa

Il ciclo che svuota la mappa in `new_game`: 960 byte messi a zero. Quattro istruzioni per giro: lo store di un byte, l'incremento dell'indirizzo, il decremento del contatore, il salto all'indietro. In tutto 3.840 istruzioni, un byte alla volta, un'istruzione alla volta. Sul kit impiega circa 24 microsecondi, e nessuno ha bisogno che sia più veloce. È stato scelto perché è abbastanza piccolo da poterlo seguire su ogni macchina di oggi. In quanti modi lo si può rendere più veloce?

## Slide 5: Tempo = istruzioni x cicli per istruzione x periodo di clock

Il tempo impiegato da un programma è il prodotto di tre numeri: le istruzioni eseguite, i cicli di clock che ciascuna richiede in media, e la durata di un ciclo. Ogni fattore si può attaccare. Meno istruzioni: algoritmi migliori, istruzioni più ricche, vettori. Meno cicli per istruzione: pipeline ed esecuzione superscalare. Un ciclo più corto: transistor più veloci. E quando un processore non basta, più processori. Tenete d'occhio questa equazione: ogni macchina della lezione ne è una risposta diversa.

## Slide 6: Perché non semplicemente un clock più veloce?

Perché non alzare semplicemente la frequenza di clock? Per trent'anni ogni generazione di transistor è stata più piccola e più veloce senza essere più calda per unità di area. Intorno al 2005 questo è finito: oggi un clock più veloce significa più calore di quanto un chip possa smaltire. Le frequenze sono rimaste a pochi gigahertz, e i transistor in più sono stati spesi diversamente: processori più larghi, più core, unità vettoriali, acceleratori. Oggi le prestazioni vengono dal parallelismo, dal fare molte cose insieme.

## Slide 7: Processori superscalari

La prima risposta agisce sul secondo fattore dell'equazione: più di un'istruzione per ciclo di clock, dentro un solo processore.

## Slide 8: Da una alla volta a molte insieme

Quattro tipi di processore, in ordine di ambizione. Il processore multiciclo termina un'istruzione prima di cominciare la successiva. Quello con pipeline ha più istruzioni in volo, ciascuna in uno stadio diverso, e ne termina al massimo una per ciclo: è il vostro kit. Il superscalare in ordine ha due o più pipeline affiancate. Il superscalare fuori ordine avvia ogni istruzione appena i suoi operandi sono pronti, e arriva a quattro, sei, otto istruzioni per ciclo: è nel vostro portatile e nel vostro telefono.

## Slide 9: Due pipeline affiancate

Due pipeline affiancate. Leggete la tabella per righe: ogni riga è un'istruzione, ogni colonna un ciclo. Le istruzioni entrano a coppie: `i1` e `i2` vengono prelevate insieme, poi `i3` e `i4`, poi `i5` e `i6`. Sei istruzioni terminano in sette cicli; a una pipeline singola ne servirebbero dieci. È il caso ideale, in cui le istruzioni non dipendono l'una dall'altra.

## Slide 10: Che cosa si mette di mezzo: le dipendenze

Che cosa si mette di mezzo. La seconda istruzione usa `t0`, che la prima sta ancora calcolando: non può correrle accanto. È una *dipendenza sui dati*. La terza non dipende da nessuno, eppure in un processore in ordine aspetta dietro la seconda. La quarta è un salto: finché non è risolto il processore non sa se la quinta vada eseguita. È una *dipendenza sul controllo*. I programmi veri sono pieni di catene così, quindi la larghezza da sola non basta.

## Slide 11: Esecuzione fuori ordine

L'esecuzione fuori ordine, in quattro tappe. Le istruzioni vengono prelevate e decodificate in ordine, più d'una per ciclo, in una finestra di decine o centinaia. A ogni risultato viene dato un registro fisico nuovo: la ridenominazione. Ogni istruzione viene eseguita appena esistono i suoi operandi, dovunque si trovi nel programma. Infine i risultati vengono confermati nell'ordine del programma, così che, visto da fuori, nessuno ha mai sorpassato. Il modello che avete imparato, un'istruzione dopo l'altra, è conservato esattamente: cambiano solo i tempi.

## Slide 12: Ridenominazione dei registri: trentadue nomi, molti registri

La ridenominazione dei registri su un esempio. A sinistra il codice come è scritto: due metà, ciascuna delle quali carica una parola, la incrementa e la memorizza di nuovo, ed entrambe usano `t0`. La seconda metà riusa il nome, non il valore: è una falsa dipendenza. A destra, dopo la ridenominazione, ogni nuovo valore ha il suo registro fisico, e le due metà non condividono nulla, quindi possono essere eseguite nello stesso momento. I trentadue registri che conoscete sono nomi; il chip ha qualche centinaio di registri.

## Slide 13: Indovinare il futuro: la predizione dei salti

Un processore largo incontra un salto ogni poche istruzioni e non può aspettare di conoscerne l'esito. Quindi *predice*: indovina la direzione dalla storia di quel salto e prosegue lungo l'ipotesi. Se l'ipotesi era giusta, non si perde nulla; se era sbagliata, il lavoro speculativo viene buttato via. Il ciclo del riscaldamento salta all'indietro 959 volte e prosegue una volta: un predittore lo impara subito. I predittori moderni hanno ragione ben più di nove volte su dieci.

## Slide 14: RISC-V diventa superscalare

Processori RISC-V di questo tipo esistono. La prima riga è il core del vostro kit: in ordine, un'istruzione per ciclo. Gli altri sono core fuori ordine: BOOM di Berkeley e XiangShan dell'Accademia Cinese delle Scienze, entrambi open source; il C910, il P550, Veyron, di aziende. Poiché l'insieme di istruzioni è aperto, chiunque può costruire un core simile, e alcuni sono pubblicati come codice sorgente che potreste leggere.

## Slide 15: Un'architettura, molte microarchitetture

Una distinzione che organizza l'intero corso. L'*architettura* è il contratto: le istruzioni, i registri, che cosa fa ogni istruzione. La *microarchitettura* è un modo di rispettare il contratto: stadi, larghezza, predittori, cache. La `add` che avete scritto per un microcontrollore è la stessa `add` di un core da server. Verm1 girerebbe senza modifiche su qualunque core della slide precedente. Per questo un insieme di istruzioni, una volta imparato, è una conoscenza che dura.

## Slide 16: Vettori: un'istruzione, molti dati

La seconda risposta agisce sul primo fattore: meno istruzioni, perché ogni istruzione lavora su molti dati.

## Slide 17: La tassonomia di Flynn

La tassonomia di Flynn classifica le macchine con due domande: un flusso di istruzioni o molti, un flusso di dati o molti. SISD è il kit: un core, un dato alla volta. SIMD è un'istruzione applicata a molti dati insieme: le istruzioni vettoriali e, grosso modo, le GPU. MISD è rara. MIMD sono molti processori ciascuno con i propri dati: chip multicore, cluster, supercalcolatori.

## Slide 18: Lo stesso ciclo, con i vettori

Lo stesso ciclo con l'estensione vettoriale. `v0` è un registro vettoriale, largo molti byte, riempito di zeri. A ogni giro `vsetvli` chiede: dei byte ancora da fare, quanti ne entrano in un registro? La risposta va in `t2`. `vse8.v` memorizza quel numero di byte con una sola istruzione, e l'indirizzo e il contatore avanzano di `t2`. Con registri a 128 bit un giro tratta 16 byte: 60 giri invece di 960. Il codice non dichiara mai la larghezza dei registri, quindi lo stesso programma funziona con qualunque larghezza.

## Slide 19: Una somma, corsia per corsia

Una somma, corsia per corsia. Un registro vettoriale contiene più parole, ciascuna nella sua *corsia* (lane). `vle32.v` carica più parole insieme; `vadd.vv` somma due registri corsia per corsia, così `v1` accumula tante somme parziali quante sono le corsie. Alla fine `vredsum` somma tra loro le corsie in un solo numero. Con i sedici numeri da 1 a 16 il risultato è 136. È la somma parallela che avete visto come figura nella Lezione 04, ora in forma di istruzioni.

## Slide 20: Calcolo ad alte prestazioni

La terza risposta esce dal singolo processore: migliaia di processori su un solo problema.

## Slide 21: Che cos'è un supercalcolatore?

Un supercalcolatore non è un unico processore enorme: sono migliaia di calcolatori normali, i *nodi*, che lavorano allo stesso problema. Ogni nodo ha uno o due processori con decine di core, spesso più GPU, e molta memoria. Una rete molto veloce unisce i nodi, e un file system parallelo li serve tutti. La velocità si misura in operazioni in virgola mobile al secondo su un problema standard, e la lista TOP500 classifica le macchine più veloci dal 1993. La foto è un piccolo cluster con la stessa struttura.

## Slide 22: Ordini di grandezza

Ordini di grandezza. Il kit non ha alcuna unità in virgola mobile. Un portatile esegue circa cento miliardi di operazioni al secondo. Leonardo, a Bologna, circa duecentoquaranta milioni di miliardi. Frontier, El Capitan e JUPITER superano il miliardo di miliardi, dieci alla diciotto: è l'*exascale*. Sette ordini di grandezza separano un portatile da queste macchine, e sono stati ottenuti con il parallelismo, non con clock più veloci.

## Slide 23: La legge di Amdahl

La legge di Amdahl dice quanto può dare il parallelismo. Se una frazione p del lavoro si può svolgere in parallelo e il resto no, con n processori lo speed-up è 1 diviso la parte seriale più la parte parallela divisa per n. La parte seriale non si riduce per quanti processori si aggiungano. Con p uguale a 0,9 lo speed-up non può mai superare 10. La lezione pratica: prima di comprare processori, misurate p.

## Slide 24: La legge di Amdahl in numeri

La legge in numeri. Leggete la seconda riga: un programma parallelo al 90% va 5,3 volte più veloce con dieci processori, 9,2 con cento, 9,9 con mille, e mai più di 10. Ora confrontate le righe: solo quando la frazione parallela si avvicina a 1 molti processori ripagano. Calcolate voi una cella, per esempio p = 0,9 e n = 100.

## Slide 25: Due modi di dividere il lavoro

Due modi di dividere il lavoro. Con la *memoria condivisa*, più core dello stesso nodo vedono la stessa memoria, e il programma gira come thread che leggono e scrivono le stesse variabili; è facile cominciare, e il pericolo sono due thread che scrivono la stessa variabile. Con la *memoria distribuita* ogni nodo ha la propria memoria, e il programma gira come processi che si scambiano messaggi, con lo standard MPI; scala fino a un milione di core, a spese del programmatore. Le applicazioni reali usano entrambi.

## Slide 26: Il limite è l'energia

Il limite è l'energia. Una macchina exascale assorbe circa venti megawatt, il consumo di una piccola città, e l'elettricità della sua vita utile costa quanto la macchina. Quindi la cifra che conta sono le operazioni per watt, che hanno una classifica propria, la Green500. La guida l'hardware specializzato, perché fa di più con ogni joule. La stessa ragione, all'altro estremo della scala, mette un piccolo core RISC-V nel vostro kit.

## Slide 27: RISC-V e il supercalcolo europeo

RISC-V e il supercalcolo europeo. Le macchine più grandi di oggi usano processori x86 o Arm con GPU. L'Europa sta progettando processori e acceleratori propri su RISC-V, con la European Processor Initiative e con DARE, il progetto nominato nella prima lezione. Monte Cimone, a Bologna, è un cluster completo costruito su processori RISC-V. Un insieme di istruzioni aperto permette a un continente di costruire ciò che altrimenti dovrebbe comprare. La pagina mostrata è quella delle strutture di calcolo del Dipartimento.

## Slide 28: Acceleratori GPU

La quarta risposta: gli acceleratori. Prima la GPU, migliaia di piccoli core per un lavoro che si ripete.

## Slide 29: Due modi di spendere i transistor

Due modi di spendere gli stessi transistor. Una CPU ha pochi core grandi, ciascuno fuori ordine, con predittori e grandi cache: è costruita per finire un compito il prima possibile, ed è a suo agio con salti e dati irregolari. Una GPU ha migliaia di core piccoli e semplici che eseguono lo stesso codice su dati diversi: è costruita per finire moltissimi compiti al secondo, ed è a suo agio con array regolari. Buoi e polli: la risposta dipende dal campo.

## Slide 30: Come un programma usa una GPU

Come un programma usa una GPU, in quattro passi. Il programma sulla CPU, l'*host*, prepara i suoi array nella memoria centrale. I dati vengono copiati nella memoria della GPU, e questo costa tempo. Una piccola funzione, il *kernel*, viene lanciata in migliaia di thread, uno per elemento. I risultati vengono copiati indietro. La GPU è un dispositivo come quelli della Lezione 21: il processore le invia dati e comandi.

## Slide 31: La mappa di Verm1, un thread per cella

La mappa di Verm1 su una GPU. La funzione marcata come kernel gira una volta in ogni thread. Ogni thread calcola anzitutto chi è, il suo indice `i`, dal numero del suo blocco e dalla sua posizione nel blocco; poi, se l'indice sta dentro la mappa, azzera la propria cella. Non c'è un ciclo: ci sono 960 thread. L'ultima riga, sull'host, lancia quattro blocchi di 256 thread. Per 960 byte le due copie costano molto più del lavoro: questo esempio mostra la forma, non un guadagno.

## Slide 32: Quando ripaga una GPU?

Quando ripaga una GPU? Quando la stessa operazione si applica a moltissimi dati in modo indipendente: immagini, matrici, le griglie di una simulazione, reti neurali. Quando i dati possono restare sulla GPU per molti passi invece di viaggiare ogni volta. Non quando il lavoro è una catena di decisioni, ciascuna dipendente dalla precedente. E vale di nuovo Amdahl: ciò che resta sulla CPU fissa il limite.

## Slide 33: Acceleratori FPGA

L'ultima macchina è la più strana: hardware che si può riscrivere.

## Slide 34: Un chip che diventa il circuito che descrivete

Una FPGA, field-programmable gate array, è un chip che diventa il circuito che descrivete. Dentro c'è un mare di piccoli blocchi: tabelle di look-up, ciascuna capace di essere qualunque funzione di pochi ingressi; un flip-flop accanto a ogni tabella; e fili con interruttori che possono collegare ogni blocco a ogni altro. Un file di configurazione, il *bitstream*, imposta ogni tabella e ogni interruttore. Caricate un altro bitstream e lo stesso chip è un circuito diverso. Non esegue un programma: è un circuito.

## Slide 35: Una tabella di look-up è una tabella di verità in memoria

Una tabella di look-up è una tabella di verità tenuta in memoria. Gli ingressi `a` e `b` sono l'indirizzo; i bit memorizzati sono le uscite. Leggete le tre colonne di destra: con i bit 0, 0, 0, 1 la tabella è una AND; con 0, 1, 1, 0 una XOR; con 1, 1, 0, 0 è NOT a. Cambiare i bit memorizzati cambia la porta. È la ROM che realizza qualunque funzione, dalla Lezione 11, in miniatura.

## Slide 36: La regola dell'inversione a U di Verm1, in hardware

La regola di Verm1 che vieta l'inversione a U, scritta come hardware. Verilog è un linguaggio che descrive circuiti, non sequenze di passi. Il modulo ha due ingressi di due bit, la direzione attuale e quella richiesta, e un'uscita. La riga con `assign` è un filo sempre vero: l'uscita vale 1 quando lo XOR delle due direzioni è uguale a 10 in binario. Non c'è un prima e un dopo. Sul kit la stessa regola costava tre istruzioni.

## Slide 37: Dalla descrizione al circuito

Dalla descrizione al circuito in cinque tappe. Descrivere, in Verilog o VHDL. Simulare, osservando forme d'onda come quelle della Lezione 13. Sintetizzare: la descrizione diventa tabelle e flip-flop. Piazzare e instradare: ogni elemento riceve una posizione sul chip e si tracciano i collegamenti. Configurare: si carica il bitstream. Ogni tentativo richiede da minuti a ore: più lento che compilare una cartuccia, molto più veloce che fabbricare un chip.

## Slide 38: Anche un processore è un circuito

Anche un processore è un circuito. Un core RISC-V è una descrizione in un linguaggio hardware, e si può caricare su una FPGA: questi *soft core* sono liberi da leggere e da usare. Un core della classe di quello del vostro kit entra in una FPGA piccola. Accanto potete mettere un circuito vostro, per l'operazione che il vostro programma ripete di più. Qui si chiude il cerchio del corso: dalle porte a un processore, e ritorno.

## Slide 39: Quattro modi di calcolare

Quattro modi di calcolare, a confronto. Leggete la tabella per righe. Una CPU sono pochi core complessi, programmati in qualunque linguaggio, bravi in tutto con moderazione. Una GPU sono migliaia di core semplici per dati regolari in massa. Una FPGA è un circuito che si configura, per flussi e bassa latenza. Un ASIC è un circuito fatto per un solo compito. Da sinistra a destra cresce il lavoro svolto per joule, e cresce la fatica richiesta. La generalità si paga in energia, l'efficienza in fatica.

## Slide 40: Ritorno alla macchina

Ritorno al ciclo del riscaldamento, visto ora su cinque macchine.

## Slide 41: Svuotare la mappa di Verm1: 960 celle

Svuotare le 960 celle della mappa. Sul kit: un byte per giro, 3.840 cicli. Su un core RISC-V fuori ordine: lo stesso binario, in una frazione di quei cicli. Con vettori a 128 bit: 60 giri. Su una GPU: un lancio di 960 thread, più due copie. Su una FPGA: 960 flip-flop con un reset comune, un ciclo di clock. Il lavoro è lo stesso; cambia quanta parte ne avviene nello stesso momento, e quanto costa ottenerlo. La domanda dell'ingegnere non è quale sia la più veloce, ma quale basti.

## Slide 42: Verifica la comprensione: Un programma è parallelo all'80%. Qual è il massimo speed-up che un numero qualunque di processori può dare?

Usate l'ultima colonna della tabella della legge di Amdahl: con processori illimitati resta solo la parte seriale.

## Slide 43: Verifica la comprensione: Che cosa elimina la ridenominazione dei registri?

Pensate all'esempio con le due metà che usavano entrambe `t0`: che cosa impediva loro di correre insieme, e che cosa ha cambiato la ridenominazione?

## Slide 44: Verifica la comprensione: Con registri vettoriali a 256 bit, quanti giri servono al ciclo vettoriale per i 960 byte?

Quanti byte sono 256 bit? Dividete i 960 byte per quel numero.

## Slide 45: Verifica la comprensione: Una tabella di look-up a due ingressi memorizza, per gli ingressi 00, 01, 10, 11, i bit 0, 1, 1, 1. Quale porta è?

Scrivete i quattro bit memorizzati come tabella di verità con ingressi a e b, e riconoscete la funzione.

## Slide 46: Esercizi: prima su carta, poi sulla macchina

Cinque esercizi. Compilate la tabella di Amdahl per p = 0,95. Disegnate il diagramma della pipeline di un processore di larghezza tre per nove istruzioni indipendenti. Rinominate i registri di un frammento di Verm1 e dite quali istruzioni potrebbero correre nello stesso ciclo. Scrivete la tabella di verità di una tabella di look-up a quattro ingressi per la regola dell'inversione a U. E compilate il test vettoriale ed eseguitelo su QEMU con due larghezze diverse: perché funziona lo stesso binario?

## Slide 47: Glossario: inglese e italiano

Quattordici termini di questa lezione. *Out-of-order execution* è l'esecuzione fuori ordine; *register renaming* è la ridenominazione dei registri; *branch prediction* è la predizione dei salti. *Shared memory* e *message passing*, memoria condivisa e scambio di messaggi, sono i due modelli della programmazione parallela. Alcune parole, *kernel*, *bitstream*, *soft core*, si usano in italiano così come sono.

## Slide 48: Conclusioni e letture

Quattro conclusioni. Un'equazione con tre fattori: ogni macchina veloce ne attacca uno, oppure moltiplica i processori. I core superscalari fuori ordine rispettano il contratto dell'insieme di istruzioni ed eseguono molte istruzioni insieme. Vettori, GPU e cluster sfruttano i dati che si possono elaborare in modo indipendente, e la legge di Amdahl dice fin dove si arriva. Le FPGA trasformano una descrizione in un circuito. Il corso finisce qui: da un bit a un supercalcolatore, con un solo insieme di istruzioni.
