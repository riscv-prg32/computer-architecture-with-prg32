# Lezione 13: Macchine sequenziali

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

## Slide 1: Macchine sequenziali

Comincia il terzo blocco del corso: stato e memoria. Le macchine della Lezione 11 non avevano memoria: gli stessi ingressi davano sempre le stesse uscite. Un calcolatore però ricorda: un contatore sopravvive da un frame al successivo, un gioco sa se sta mostrando il titolo o il campo di gioco. Questa lezione introduce il tempo e lo stato, il modello che descrive ogni circuito con memoria, e le memorie elementari, latch e flip-flop, con cui sono costruiti i registri del processore.

## Slide 2: Che cosa saprete fare alla fine

Sei obiettivi. Spiegare perché un circuito sequenziale ha bisogno dei concetti di tempo e di stato. Definire una macchina a stati finiti e distinguere Mealy da Moore. Descrivere una macchina con una tabella e con un diagramma degli stati. Spiegare come un latch SR ricorda un bit e perché una combinazione dei suoi ingressi è vietata. Distinguere latch e flip-flop, livello e fronte. E riconoscere registri, contatori e program counter come macchine sequenziali.

## Slide 3: Il clock

Il *clock* è un segnale che alterna regolarmente 0 e 1. Il disegno ne nomina le parti: il periodo T, il tempo alto e il tempo basso, il fronte di salita, dove passa da 0 a 1, e il fronte di discesa. La frequenza è il numero di periodi al secondo, uno diviso T. I circuiti sincroni cambiano stato su uno dei due fronti. Per il kit: 160 MHz significano un periodo di 6,25 nanosecondi, e ogni rete combinatoria del chip deve assestarsi entro quel tempo.

## Slide 4: Il concetto di stato

Lo *stato* è una sintesi di tutta la storia precedente degli ingressi: tutto ciò che il circuito deve sapere del passato per comportarsi correttamente da qui in poi. È conservato da variabili di stato. Una funzione di transizione calcola lo stato prossimo dallo stato presente e dagli ingressi presenti, e lo stato si aggiorna una volta per ciclo di clock. La formula a destra lo dice in modo compatto. Per memorizzare lo stato servono elementi con due condizioni stabili: latch e flip-flop.

## Slide 5: L'automa a stati finiti

La definizione formale. Una macchina sequenziale è fatta di cinque cose: un alfabeto di ingresso I e un alfabeto di uscita U, insiemi finiti di simboli; un insieme finito di stati S; una funzione stato prossimo, che a ogni coppia stato-ingresso fa corrispondere uno stato prossimo; e una funzione di uscita. Confrontatela con il riscaldamento: l'ingresso è «A premuto o no», gli stati sono TITLE, PLAY e OVER, la funzione stato prossimo è il codice di `game_update`, e l'uscita è la schermata.

## Slide 6: Macchine di Mealy e macchine di Moore

L'uscita si può definire in due modi. In una macchina di *Mealy* l'uscita dipende dallo stato e dall'ingresso: si scrive sulle transizioni, e può reagire a un ingresso nello stesso ciclo. In una macchina di *Moore* l'uscita dipende dal solo stato: si scrive dentro gli stati e cambia solo quando cambia lo stato. Il gioco del riscaldamento è una macchina di Moore: ogni stato ha la sua schermata. I due modelli sono equivalenti, anche se il numero di stati può essere diverso.

## Slide 7: Architettura generale di una macchina sequenziale

L'architettura generale di ogni macchina sequenziale. Una rete combinatoria calcola lo stato prossimo e le uscite a partire dagli ingressi e dallo stato presente. Un registro di flip-flop conserva lo stato presente. A ogni fronte del clock lo stato prossimo diventa lo stato presente. L'anello dalla rete al registro e ritorno è ciò che rende possibile la memoria, e il registro è ciò che tiene l'anello sotto controllo: i valori fanno un giro per ciclo, mai più in fretta. Tutta la Lezione 11 vive nel riquadro superiore.

## Slide 8: Tabella e diagramma degli stati: una macchina di Mealy

Le due descrizioni equivalenti di una macchina, per un esempio di Mealy con quattro stati. Nella *tabella degli stati* ogni riga è uno stato presente e ogni colonna un simbolo di ingresso; la cella dà lo stato prossimo e, dopo la barra, l'uscita. Nel *diagramma degli stati* ogni stato è un nodo e ogni transizione una freccia etichettata ingresso barra uscita. Esercitatevi a passare dall'una all'altro: prendete la riga di s0 e trovatene nel disegno le due frecce.

## Slide 9: Il latch SR

Il *latch SR*: due porte NOR, ciascuna con l'uscita collegata a un ingresso dell'altra. S, per set, porta Q a 1; R, per reset, porta Q a 0. Con entrambi a 0 il latch conserva l'ultimo valore: ricorda quale ingresso è stato a 1 più di recente. La tabella riassume i quattro casi, e l'ultimo è vietato. Per via della retroazione Q dipende da se stesso: in un circuito con un anello un segnale è una forma d'onda nel tempo e non un singolo valore.

## Slide 10: Il latch SR nel tempo

Il latch nel tempo. S va a 1, e dopo il ritardo delle porte Q diventa 1. Poi S torna a 0 e non accade nulla: la retroazione tiene Q a 1. Questo tratto piatto è la memoria. Più tardi R va a 1, Q torna a 0, e vi resta quando R torna a 0. Seguite sul disegno i quattro istanti segnati tenendo davanti il circuito della slide precedente, e ricavate l'uscita di ogni porta.

## Slide 11: Latch sincroni: si aggiunge un clock

In un circuito asincrono le uscite possono cambiare ogni volta che cambia un ingresso. In uno sincrono è il clock a decidere quando. Per rendere sincrono il latch SR, S e R passano per due porte AND insieme al clock. Quando il clock vale 0 entrambe le porte danno 0 e il latch non può cambiare; quando vale 1 si comporta come il latch semplice. Il clock decide quando gli ingressi vengono ascoltati.

## Slide 12: I latch JK e D

Due miglioramenti del latch. Nel latch *JK* le uscite sono riportate alle porte di ingresso, così che set e reset interni non possano mai valere 1 insieme; la combinazione J = K = 1, invece di essere vietata, inverte l'uscita: la fa commutare. Il latch *D* ha un solo ingresso: D va al set e la sua negazione al reset, quindi l'uscita prende semplicemente il valore di D finché il clock è attivo. D sta per delay, ritardo, o per dato.

## Slide 13: Il flip-flop master-slave

Il flip-flop *master-slave* è fatto di due latch in serie, controllati da livelli opposti del clock. Quando il clock vale 0 il master è aperto e segue l'ingresso, mentre lo slave è chiuso. Quando il clock passa a 1 il master si chiude, conservando ciò che aveva, e lo slave si apre e lo mostra. I due non sono mai trasparenti insieme, quindi l'ingresso non può mai correre dritto fino all'uscita. L'effetto è che l'uscita cambia solo sul fronte di salita: il flip-flop è *sensibile al fronte*.

## Slide 14: Latch o flip-flop? Guardate l'uscita

La differenza, vista sulle forme d'onda. Il clock e l'ingresso D sono gli stessi per entrambi. L'uscita del latch segue D per tutta la fase alta del clock: cambia a metà di una fase. L'uscita del flip-flop cambia solo sui fronti di salita, prendendo il valore che D ha in quell'istante; gli impulsi brevi di D tra due fronti sono ignorati. L'uscita del flip-flop è ferma per un intero periodo, che è esattamente ciò che serve a un registro di stato.

## Slide 15: Elementi di memoria: un riepilogo

Un riepilogo degli elementi di memoria. La colonna *stato prossimo* dà la regola in forma compatta, dove Q+ è lo stato dopo il cambio; l'ultima colonna dice quando il cambio può avvenire: in ogni momento per il latch semplice, durante il livello attivo per i latch sincroni, sul fronte per i flip-flop. Il flip-flop T, che commuta quando T vale 1, è un JK con i due ingressi uniti. Tenete a mente la riga del flip-flop D: è l'elemento di memoria dei processori di oggi.

## Slide 16: Un registro è una fila di flip-flop

Un *registro* è una fila di flip-flop con un clock comune: un flip-flop per bit. Con un segnale di abilitazione al caricamento prende un nuovo valore solo quando gli è chiesto, e altrimenti conserva il vecchio. RISC-V ha trentadue registri di trentadue bit: 1024 flip-flop. Ora le due macchine della Lezione 11 trovano il loro posto: il decodificatore pilotato dal campo `rd` attiva l'abilitazione di un solo registro, e i multiplexer selezionano i registri da leggere.

## Slide 17: Verifica la comprensione: In una macchina di Moore l'uscita dipende: / Un latch SR fatto di porte NOR ha Q = 1. S e R valgono entrambi 0. Che cosa accade?

Ricordate dove si scrive l'uscita nei due tipi di diagramma. In una macchina di Moore sta dentro i nodi: appartiene allo stato, e l'ingresso non c'entra.

Guardate la tabella del latch SR: quale riga ha entrambi gli ingressi a 0? È la riga della memoria. La retroazione conserva il valore memorizzato, qualunque fosse.

## Slide 18: Verifica la comprensione: Che cosa distingue un flip-flop D da un latch D? / Quanti flip-flop servono per una macchina a stati finiti con 10 stati?

Entrambi gli elementi memorizzano un bit ed entrambi hanno un clock. La differenza è quando ascoltano: il latch per tutto il livello attivo, il flip-flop solo nell'istante di un fronte.

A una macchina con N stati servono abbastanza variabili di stato da dare a ogni stato un codice diverso: il più piccolo k tale che 2 alla k sia almeno N. È la formula dei codici a lunghezza fissa della Lezione 11.

## Slide 19: Glossario: inglese e italiano

Dodici termini. *Feedback* è la retroazione. *Rising* e *falling edge* sono il fronte di salita e di discesa. *Level-triggered* ed *edge-triggered*, sensibile al livello e sensibile al fronte, dicono quando un elemento di memoria ascolta. *Present state* e *next state* sono i due valori attorno a un fronte di clock. *Latch* e *flip-flop* non si traducono; la parola italiana generale è bistabile.

## Slide 20: Conclusioni e letture

Cinque conclusioni. I circuiti digitali sono combinatori o sequenziali, e per i secondi contano il tempo e lo stato. Una macchina sequenziale realizza un automa a stati finiti, del tipo di Mealy o di Moore. Latch e flip-flop sono le memorie elementari, ed è la retroazione a far sì che un circuito ricordi. Il clock decide quando: i latch ascoltano durante un livello, i flip-flop su un fronte. Registri, contatori, program counter e processore sono macchine sequenziali costruite attorno a reti combinatorie.
