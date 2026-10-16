# Lezione 24: Oltre un solo core: RISC-V superscalare, HPC, GPU e FPGA

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: l'equazione delle prestazioni; i processori superscalari; le istruzioni vettoriali; HPC e legge di Amdahl; acceleratori GPU e FPGA. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Slide 1: Oltre un solo core: RISC-V superscalare, HPC, GPU e FPGA

L'ultima lezione guarda oltre il kit. Tutto ciò che si è imparato finora lo si è imparato su un piccolo processore che esegue un'istruzione alla volta. Le macchine che prevedono il tempo o addestrano una rete neurale eseguono istruzioni dello stesso tipo, in numero enorme e contemporaneamente. La lezione prende un piccolo ciclo di Verm1 e lo segue su quattro classi di macchine, così che l'intero panorama del calcolo ad alte prestazioni si veda attraverso un solo esempio familiare. La domanda di Seymour Cray su buoi e galline tornerà, e non ha una risposta unica. Questa lezione è uno sguardo d'insieme e non fa parte della prova intercorso.

## Slide 2: Che cosa saprete fare alla fine

Cinque risultati di apprendimento. Enunciare l'equazione delle prestazioni e individuare su quale dei suoi fattori agisce ciascuna tecnica. Spiegare come un processore superscalare fuori ordine esegue più istruzioni per ciclo. Leggere un ciclo scritto con l'estensione vettoriale di RISC-V. Descrivere un supercalcolatore, calcolare uno speed-up con la legge di Amdahl, e spiegare perché l'energia è il vincolo decisivo. E dire per che cosa sono adatte una GPU e una FPGA, e che cosa ciascuna chiede al programmatore.

## Slide 3: Tempo = istruzioni x cicli per istruzione x periodo di clock

Il tempo di esecuzione di un programma è il prodotto di tre grandezze: il numero di istruzioni eseguite, il numero medio di cicli di clock che ciascuna richiede, e la durata di un ciclo. Ogni fattore si può ridurre. Meno istruzioni: algoritmi migliori, istruzioni più ricche, vettori. Meno cicli per istruzione: pipeline ed esecuzione superscalare. Un ciclo più breve: transistor più veloci. E quando un processore non basta più, più processori. Questa equazione organizza la lezione: ogni macchina presentata è una risposta diversa a essa.

## Slide 4: Perché non semplicemente un clock più veloce?

Perché non alzare semplicemente la frequenza di clock? Per tre decenni ogni generazione di transistor è stata più piccola e più veloce senza dissipare più calore per unità di superficie. Intorno al 2005 questa scala si è interrotta: un clock più veloce produce ora più calore di quanto un chip possa smaltire. Le frequenze sono rimaste a pochi gigahertz, e i transistor aggiuntivi sono stati spesi diversamente: processori più larghi, più core, unità vettoriali e acceleratori. Le prestazioni vengono ora dal parallelismo, dal fare molte cose insieme, ed è per questo che il resto della lezione tratta di macchine parallele.

## Slide 5: Da una alla volta a molte insieme

Quattro tipi di processore, in ordine di ambizione. Il processore multiciclo completa un'istruzione prima di cominciare la successiva. Il processore a pipeline ha più istruzioni in corso, ciascuna in uno stadio diverso, e ne completa al più una per ciclo; è il kit. Il processore superscalare in ordine ha due o più pipeline affiancate. Il processore superscalare fuori ordine avvia ogni istruzione appena i suoi operandi sono pronti e sostiene quattro, sei o otto istruzioni per ciclo; è il processore di portatili e telefoni.

## Slide 6: Esecuzione fuori ordine

L'esecuzione fuori ordine in quattro fasi. Le istruzioni si prelevano e si decodificano nell'ordine del programma, più per ciclo, in una finestra di decine o centinaia. A ogni risultato si assegna un registro fisico nuovo: è la ridenominazione, che elimina le false dipendenze tra usi non correlati dello stesso nome di registro. Ogni istruzione si esegue appena i suoi operandi sono disponibili, ovunque si trovi nel programma. Infine i risultati si consolidano nell'ordine del programma, così che dall'esterno nulla sembri aver sorpassato nulla. Il modello sequenziale di esecuzione imparato nel corso è preservato esattamente; cambiano solo i tempi.

## Slide 7: Indovinare il futuro: la predizione dei salti

Un processore largo incontra un salto ogni poche istruzioni e non può aspettare di conoscerne l'esito. Perciò *predice*: deduce la direzione probabile dalla storia di quel salto e prosegue speculativamente lungo la predizione. Se la predizione era corretta non si perde nulla; altrimenti il lavoro speculativo si scarta. Il ciclo del riscaldamento salta all'indietro 959 volte e prosegue una volta, uno schema che qualsiasi predittore impara subito. I predittori moderni hanno ragione ben più di nove volte su dieci, e la loro accuratezza è un fattore principale delle prestazioni.

## Slide 8: RISC-V diventa superscalare

Esistono processori RISC-V di questa classe. La prima riga è il core del kit: in ordine, un'istruzione per ciclo. Le altre sono core fuori ordine: BOOM di Berkeley e XiangShan dell'Accademia cinese delle scienze, entrambi open source; e il C910, il P550 e Veyron, dall'industria. Poiché l'insieme di istruzioni è aperto, chiunque può costruire un core del genere, e alcuni sono pubblicati come codice sorgente che uno studente potrebbe leggere.

## Slide 9: Un'architettura, molte microarchitetture

Una distinzione che organizza l'intero corso. L'*architettura* è il contratto: le istruzioni, i registri, e l'effetto di ciascuna istruzione. La *microarchitettura* è un modo particolare di onorare quel contratto: stadi della pipeline, larghezza, predittori, cache. L'`add` scritto per un microcontrollore è lo stesso `add` su un core da server, e Verm1 girerebbe invariato su qualsiasi core della slide precedente. Questa separazione è il motivo per cui un insieme di istruzioni, una volta imparato, è una conoscenza duratura, e per cui il corso ha potuto insegnare l'architettura su una piccola macchina senza perdita di generalità.

## Slide 10: Che cos'è un supercalcolatore?

Un supercalcolatore non è un unico enorme processore ma migliaia di calcolatori ordinari, i *nodi*, che lavorano sullo stesso problema. Ogni nodo ha uno o due processori con decine di core, spesso più GPU, e memoria abbondante. Una rete molto veloce collega i nodi, e un file system parallelo li serve tutti. Le prestazioni si misurano in operazioni in virgola mobile al secondo su un benchmark standard, e la lista TOP500 classifica le macchine più veloci dal 1993. L'immagine mostra rack di nodi delle Research Computing Facilities dell'Ateneo, incontrate nella Lezione 03.

## Slide 11: La legge di Amdahl

La legge di Amdahl dice quanto può dare il parallelismo. Se una frazione p del lavoro si può parallelizzare e il resto no, lo speed-up con n processori è 1 / ((1 - p) + p / n). La parte seriale non si riduce per quanti processori si aggiungano, quindi lo speed-up è limitato da 1 / (1 - p): con p = 0,9 non può mai superare 10. La lezione pratica è misurare p prima di acquistare processori, e riconoscere che ridurre la frazione seriale vale spesso più che aggiungere hardware.

## Slide 12: Due modi di dividere il lavoro

Due modelli per condividere il lavoro. Con la *memoria condivisa*, più core dello stesso nodo vedono la stessa memoria, e il programma gira come thread che leggono e scrivono variabili comuni; è facile cominciare, e il suo pericolo caratteristico sono due thread che scrivono la stessa variabile. Con la *memoria distribuita* ogni nodo ha la sua memoria, e il programma gira come processi che si scambiano messaggi, secondo lo standard MPI; scala fino a un milione di core, al prezzo di un maggiore sforzo da parte del programmatore. Le applicazioni reali combinano i due.

## Slide 13: Il limite è l'energia

Il vincolo decisivo è l'energia. Una macchina exascale assorbe circa venti megawatt, il consumo di una piccola città, e l'elettricità usata nella sua vita costa quanto la macchina stessa. La cifra che conta è quindi operazioni per watt, che ha una propria classifica, la Green500. In testa c'è l'hardware specializzato, perché ottiene di più da ogni joule. Lo stesso ragionamento, all'estremo opposto della scala, mette un piccolo core RISC-V nel kit.

## Slide 14: Due modi di spendere i transistor

Due modi di spendere gli stessi transistor. Una CPU ha pochi core grandi, ciascuno fuori ordine, con predittori e cache ampie; è progettata per completare un singolo compito il più in fretta possibile, e gestisce bene salti e dati irregolari. Una GPU ha migliaia di core piccoli e semplici che eseguono lo stesso codice su dati diversi; è progettata per completare un numero molto grande di compiti al secondo, ed eccelle sugli array regolari. Buoi e galline: quale sia preferibile dipende dal campo da arare.

## Slide 15: Un chip che diventa il circuito che descrivete

Una FPGA, un array di porte programmabile sul campo, è un chip che diventa il circuito che si descrive. Internamente è un mare di piccoli blocchi: tabelle di consultazione, ciascuna capace di realizzare qualsiasi funzione di pochi ingressi, cioè una tavola di verità tenuta in memoria; un flip-flop accanto a ogni tabella; e fili con interruttori capaci di collegare qualsiasi blocco a qualsiasi altro. Un file di configurazione, il *bitstream*, imposta ogni tabella e interruttore. Caricando un altro bitstream lo stesso chip diventa un circuito diverso. Non esegue un programma: *è* un circuito, che unisce le macchine combinatorie e sequenziali del corso in un solo dispositivo riconfigurabile.

## Slide 16: Quattro modi di calcolare

Quattro modi di calcolare, confrontati riga per riga. Una CPU consiste di pochi core complessi, programmabili in qualsiasi linguaggio, competenti in tutto con moderazione. Una GPU consiste di migliaia di core semplici per dati regolari in grande quantità. Una FPGA è un circuito configurabile, adatto a flussi di dati e a bassa latenza. Un ASIC è un circuito fatto per un solo compito. Da sinistra a destra cresce il lavoro svolto per joule, e cresce lo sforzo di progetto richiesto. La generalità si paga in energia, l'efficienza in sforzo; è il compromesso centrale dell'architettura dei calcolatori contemporanea.

## Slide 17: Verifica la comprensione: Un programma è parallelo all'80%. Qual è il massimo speed-up che un numero qualunque di processori può dare? / Che cosa elimina la ridenominazione dei registri?

Per la prima domanda vale l'ultima colonna della tabella della legge di Amdahl: con processori illimitati resta solo la frazione seriale.

Per la seconda si ricorda l'esempio con le due metà che usavano entrambe `t0`: che cosa impediva loro di eseguirsi insieme, e che cosa ha cambiato la ridenominazione.

## Slide 18: Verifica la comprensione: Con registri vettoriali a 256 bit, quanti giri servono al ciclo vettoriale per i 960 byte? / Una tabella di look-up a due ingressi memorizza, per gli ingressi 00, 01, 10, 11, i bit 0, 1, 1, 1. Quale porta è?

Per la prima domanda: 256 bit sono 32 byte, e i 960 byte si dividono per quel numero.

Per la seconda, i quattro bit memorizzati si scrivono come tavola di verità con ingressi a e b, e si riconosce la funzione.

## Slide 19: Glossario: inglese e italiano

Quattordici termini di questa lezione. L'*out-of-order execution* è l'*esecuzione fuori ordine*; il *register renaming* è la *ridenominazione dei registri*; la *branch prediction* è la *predizione dei salti*. *Memoria condivisa* e *scambio di messaggi* sono i due modelli della programmazione parallela. Diversi termini, *kernel*, *bitstream*, *soft core*, si usano in italiano senza traduzione.

## Slide 20: Conclusioni e letture

Quattro conclusioni. Una sola equazione con tre fattori: ogni macchina veloce ne riduce uno, o moltiplica i processori. I core superscalari fuori ordine onorano il contratto dell'insieme di istruzioni pur eseguendo molte istruzioni insieme. Vettori, GPU e cluster sfruttano dati che si possono elaborare indipendentemente, e la legge di Amdahl dice fin dove arriva questo. Le FPGA trasformano una descrizione in un circuito. Il corso finisce qui: da un singolo bit a un supercalcolatore, con un solo insieme di istruzioni dall'inizio alla fine.
