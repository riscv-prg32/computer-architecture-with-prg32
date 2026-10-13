# Lezione 24: Oltre un solo core: RISC-V superscalare, HPC, GPU e FPGA

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

## Slide 1: Oltre un solo core: RISC-V superscalare, HPC, GPU e FPGA

L'ultima lezione guarda oltre il kit. Tutto ciò che avete imparato lo avete imparato su un piccolo processore che esegue un'istruzione alla volta. Le macchine che prevedono il tempo o addestrano una rete neurale eseguono lo stesso tipo di istruzioni, in numero enorme e tutte insieme. La lezione prende un piccolo ciclo di Verm1 e lo segue su quattro tipi di macchina. La domanda di Cray su buoi e polli tornerà: non ha una risposta unica. Questa lezione è uno sguardo in avanti, e non fa parte della prova intercorso.

## Slide 2: Che cosa saprete fare alla fine

Cinque obiettivi. Scrivere l'equazione delle prestazioni e dire quale dei suoi fattori attacca ciascuna tecnica. Spiegare come un processore superscalare fuori ordine esegue più istruzioni per ciclo. Leggere un ciclo scritto con l'estensione vettoriale di RISC-V. Descrivere un supercalcolatore, calcolare uno speed-up con la legge di Amdahl e dire perché il limite è l'energia. E dire in che cosa sono forti una GPU e una FPGA, e quanto costa ciascuna al programmatore.

## Slide 3: Tempo = istruzioni x cicli per istruzione x periodo di clock

Il tempo impiegato da un programma è il prodotto di tre numeri: le istruzioni eseguite, i cicli di clock che ciascuna richiede in media, e la durata di un ciclo. Ogni fattore si può attaccare. Meno istruzioni: algoritmi migliori, istruzioni più ricche, vettori. Meno cicli per istruzione: pipeline ed esecuzione superscalare. Un ciclo più corto: transistor più veloci. E quando un processore non basta, più processori. Tenete d'occhio questa equazione: ogni macchina della lezione ne è una risposta diversa.

## Slide 4: Perché non semplicemente un clock più veloce?

Perché non alzare semplicemente la frequenza di clock? Per trent'anni ogni generazione di transistor è stata più piccola e più veloce senza essere più calda per unità di area. Intorno al 2005 questo è finito: oggi un clock più veloce significa più calore di quanto un chip possa smaltire. Le frequenze sono rimaste a pochi gigahertz, e i transistor in più sono stati spesi diversamente: processori più larghi, più core, unità vettoriali, acceleratori. Oggi le prestazioni vengono dal parallelismo, dal fare molte cose insieme.

## Slide 5: Da una alla volta a molte insieme

Quattro tipi di processore, in ordine di ambizione. Il processore multiciclo termina un'istruzione prima di cominciare la successiva. Quello con pipeline ha più istruzioni in volo, ciascuna in uno stadio diverso, e ne termina al massimo una per ciclo: è il vostro kit. Il superscalare in ordine ha due o più pipeline affiancate. Il superscalare fuori ordine avvia ogni istruzione appena i suoi operandi sono pronti, e arriva a quattro, sei, otto istruzioni per ciclo: è nel vostro portatile e nel vostro telefono.

## Slide 6: Esecuzione fuori ordine

L'esecuzione fuori ordine, in quattro tappe. Le istruzioni vengono prelevate e decodificate in ordine, più d'una per ciclo, in una finestra di decine o centinaia. A ogni risultato viene dato un registro fisico nuovo: la ridenominazione. Ogni istruzione viene eseguita appena esistono i suoi operandi, dovunque si trovi nel programma. Infine i risultati vengono confermati nell'ordine del programma, così che, visto da fuori, nessuno ha mai sorpassato. Il modello che avete imparato, un'istruzione dopo l'altra, è conservato esattamente: cambiano solo i tempi.

## Slide 7: Indovinare il futuro: la predizione dei salti

Un processore largo incontra un salto ogni poche istruzioni e non può aspettare di conoscerne l'esito. Quindi *predice*: indovina la direzione dalla storia di quel salto e prosegue lungo l'ipotesi. Se l'ipotesi era giusta, non si perde nulla; se era sbagliata, il lavoro speculativo viene buttato via. Il ciclo del riscaldamento salta all'indietro 959 volte e prosegue una volta: un predittore lo impara subito. I predittori moderni hanno ragione ben più di nove volte su dieci.

## Slide 8: RISC-V diventa superscalare

Processori RISC-V di questo tipo esistono. La prima riga è il core del vostro kit: in ordine, un'istruzione per ciclo. Gli altri sono core fuori ordine: BOOM di Berkeley e XiangShan dell'Accademia Cinese delle Scienze, entrambi open source; il C910, il P550, Veyron, di aziende. Poiché l'insieme di istruzioni è aperto, chiunque può costruire un core simile, e alcuni sono pubblicati come codice sorgente che potreste leggere.

## Slide 9: Un'architettura, molte microarchitetture

Una distinzione che organizza l'intero corso. L'*architettura* è il contratto: le istruzioni, i registri, che cosa fa ogni istruzione. La *microarchitettura* è un modo di rispettare il contratto: stadi, larghezza, predittori, cache. La `add` che avete scritto per un microcontrollore è la stessa `add` di un core da server. Verm1 girerebbe senza modifiche su qualunque core della slide precedente. Per questo un insieme di istruzioni, una volta imparato, è una conoscenza che dura.

## Slide 10: Che cos'è un supercalcolatore?

Un supercalcolatore non è un unico processore enorme: sono migliaia di calcolatori normali, i *nodi*, che lavorano allo stesso problema. Ogni nodo ha uno o due processori con decine di core, spesso più GPU, e molta memoria. Una rete molto veloce unisce i nodi, e un file system parallelo li serve tutti. La velocità si misura in operazioni in virgola mobile al secondo su un problema standard, e la lista TOP500 classifica le macchine più veloci dal 1993. La foto mostra armadi di nodi delle Research Computing Facilities dell'Ateneo.

## Slide 11: La legge di Amdahl

La legge di Amdahl dice quanto può dare il parallelismo. Se una frazione p del lavoro si può svolgere in parallelo e il resto no, con n processori lo speed-up è 1 diviso la parte seriale più la parte parallela divisa per n. La parte seriale non si riduce per quanti processori si aggiungano. Con p uguale a 0,9 lo speed-up non può mai superare 10. La lezione pratica: prima di comprare processori, misurate p.

## Slide 12: Due modi di dividere il lavoro

Due modi di dividere il lavoro. Con la *memoria condivisa*, più core dello stesso nodo vedono la stessa memoria, e il programma gira come thread che leggono e scrivono le stesse variabili; è facile cominciare, e il pericolo sono due thread che scrivono la stessa variabile. Con la *memoria distribuita* ogni nodo ha la propria memoria, e il programma gira come processi che si scambiano messaggi, con lo standard MPI; scala fino a un milione di core, a spese del programmatore. Le applicazioni reali usano entrambi.

## Slide 13: Il limite è l'energia

Il limite è l'energia. Una macchina exascale assorbe circa venti megawatt, il consumo di una piccola città, e l'elettricità della sua vita utile costa quanto la macchina. Quindi la cifra che conta sono le operazioni per watt, che hanno una classifica propria, la Green500. La guida l'hardware specializzato, perché fa di più con ogni joule. La stessa ragione, all'altro estremo della scala, mette un piccolo core RISC-V nel vostro kit.

## Slide 14: Due modi di spendere i transistor

Due modi di spendere gli stessi transistor. Una CPU ha pochi core grandi, ciascuno fuori ordine, con predittori e grandi cache: è costruita per finire un compito il prima possibile, ed è a suo agio con salti e dati irregolari. Una GPU ha migliaia di core piccoli e semplici che eseguono lo stesso codice su dati diversi: è costruita per finire moltissimi compiti al secondo, ed è a suo agio con array regolari. Buoi e polli: la risposta dipende dal campo.

## Slide 15: Un chip che diventa il circuito che descrivete

Una FPGA, field-programmable gate array, è un chip che diventa il circuito che descrivete. Dentro c'è un mare di piccoli blocchi: tabelle di look-up, ciascuna capace di essere qualunque funzione di pochi ingressi; un flip-flop accanto a ogni tabella; e fili con interruttori che possono collegare ogni blocco a ogni altro. Un file di configurazione, il *bitstream*, imposta ogni tabella e ogni interruttore. Caricate un altro bitstream e lo stesso chip è un circuito diverso. Non esegue un programma: è un circuito.

## Slide 16: Quattro modi di calcolare

Quattro modi di calcolare, a confronto. Leggete la tabella per righe. Una CPU sono pochi core complessi, programmati in qualunque linguaggio, bravi in tutto con moderazione. Una GPU sono migliaia di core semplici per dati regolari in massa. Una FPGA è un circuito che si configura, per flussi e bassa latenza. Un ASIC è un circuito fatto per un solo compito. Da sinistra a destra cresce il lavoro svolto per joule, e cresce la fatica richiesta. La generalità si paga in energia, l'efficienza in fatica.

## Slide 17: Verifica la comprensione: Un programma è parallelo all'80%. Qual è il massimo speed-up che un numero qualunque di processori può dare? / Che cosa elimina la ridenominazione dei registri?

Usate l'ultima colonna della tabella della legge di Amdahl: con processori illimitati resta solo la parte seriale.

Pensate all'esempio con le due metà che usavano entrambe `t0`: che cosa impediva loro di correre insieme, e che cosa ha cambiato la ridenominazione?

## Slide 18: Verifica la comprensione: Con registri vettoriali a 256 bit, quanti giri servono al ciclo vettoriale per i 960 byte? / Una tabella di look-up a due ingressi memorizza, per gli ingressi 00, 01, 10, 11, i bit 0, 1, 1, 1. Quale porta è?

Quanti byte sono 256 bit? Dividete i 960 byte per quel numero.

Scrivete i quattro bit memorizzati come tabella di verità con ingressi a e b, e riconoscete la funzione.

## Slide 19: Glossario: inglese e italiano

Quattordici termini di questa lezione. *Out-of-order execution* è l'esecuzione fuori ordine; *register renaming* è la ridenominazione dei registri; *branch prediction* è la predizione dei salti. *Shared memory* e *message passing*, memoria condivisa e scambio di messaggi, sono i due modelli della programmazione parallela. Alcune parole, *kernel*, *bitstream*, *soft core*, si usano in italiano così come sono.

## Slide 20: Conclusioni e letture

Quattro conclusioni. Un'equazione con tre fattori: ogni macchina veloce ne attacca uno, oppure moltiplica i processori. I core superscalari fuori ordine rispettano il contratto dell'insieme di istruzioni ed eseguono molte istruzioni insieme. Vettori, GPU e cluster sfruttano i dati che si possono elaborare in modo indipendente, e la legge di Amdahl dice fin dove si arriva. Le FPGA trasformano una descrizione in un circuito. Il corso finisce qui: da un bit a un supercalcolatore, con un solo insieme di istruzioni.
