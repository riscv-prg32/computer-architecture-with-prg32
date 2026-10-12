# Lezione 13: Macchine sequenziali

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; `node notes.js` controlla che ogni slide abbia la sua nota.

## Slide 1: Macchine sequenziali

Comincia il terzo blocco del corso: stato e memoria. Le macchine della Lezione 11 non avevano memoria: gli stessi ingressi davano sempre le stesse uscite. Un calcolatore però ricorda: un contatore sopravvive da un frame al successivo, un gioco sa se sta mostrando il titolo o il campo di gioco. Questa lezione introduce il tempo e lo stato, il modello che descrive ogni circuito con memoria, e le memorie elementari, latch e flip-flop, con cui sono costruiti i registri del processore.

## Slide 2: Che cosa saprete fare alla fine

Sei obiettivi. Spiegare perché un circuito sequenziale ha bisogno dei concetti di tempo e di stato. Definire una macchina a stati finiti e distinguere Mealy da Moore. Descrivere una macchina con una tabella e con un diagramma degli stati. Spiegare come un latch SR ricorda un bit e perché una combinazione dei suoi ingressi è vietata. Distinguere latch e flip-flop, livello e fronte. E riconoscere registri, contatori e program counter come macchine sequenziali.

## Slide 3: Riscaldamento sulla macchina

Il riscaldamento è un frammento di un gioco con tre schermate. Leggendolo, notate che lo stesso pulsante fa cose diverse in momenti diversi: qualcosa nel programma deve ricordare dove ci si trova.

## Slide 4: Un gioco è una macchina a stati

Un gioco con una schermata del titolo, un campo di gioco e una schermata di fine partita. La variabile `state` contiene uno di tre valori. `game_update` legge il pulsante A e lo stato presente: in TITLE, premere A porta a PLAY; in OVER, premere A riporta a TITLE; altrimenti non cambia nulla. Quindi l'effetto di A dipende dallo stato. È una *macchina a stati*: `update` calcola lo stato prossimo dallo stato presente e dall'ingresso, lo stato sopravvive in memoria da un frame all'altro, e `draw` mostra una schermata per ogni stato.

## Slide 5: Tempo e stato

Che cosa manca a una macchina combinatoria? Due cose: una nozione di quando, e un ricordo di ciò che è accaduto. Questa parte le introduce: il tempo, reso discreto da un clock, e lo stato.

## Slide 6: Circuiti sequenziali

In un circuito combinatorio le uscite dipendono solo dagli ingressi presenti. In un circuito *sequenziale* dipendono anche dalla storia passata degli ingressi. La definizione porta con sé due concetti. Il tempo: quando guardiamo i segnali, e quando possono cambiare? Lo stato: che cosa ricorda il circuito del passato? La frase grande a destra è una buona sintesi: un circuito sequenziale è un circuito combinatorio più qualcosa che ricorda.

## Slide 7: Il tempo: dal continuo al discreto

Un segnale fisico passa per infiniti istanti e infiniti valori. Un sistema digitale rinuncia a entrambi gli infiniti. I valori sono stati ridotti a due nella Lezione 10, con le soglie. Il tempo si riduce a una sequenza di istanti scelti, t0, t1, t2: il segnale si legge solo in quegli istanti, e ciò che fa in mezzo non conta. Chi decide quando cadono quegli istanti? Un segnale periodico dedicato, il clock.

## Slide 8: Il clock

Il *clock* è un segnale che alterna regolarmente 0 e 1. Il disegno ne nomina le parti: il periodo T, il tempo alto e il tempo basso, il fronte di salita, dove passa da 0 a 1, e il fronte di discesa. La frequenza è il numero di periodi al secondo, uno diviso T. I circuiti sincroni cambiano stato su uno dei due fronti. Per il kit: 160 MHz significano un periodo di 6,25 nanosecondi, e ogni rete combinatoria del chip deve assestarsi entro quel tempo.

## Slide 9: Il concetto di stato

Lo *stato* è una sintesi di tutta la storia precedente degli ingressi: tutto ciò che il circuito deve sapere del passato per comportarsi correttamente da qui in poi. È conservato da variabili di stato. Una funzione di transizione calcola lo stato prossimo dallo stato presente e dagli ingressi presenti, e lo stato si aggiorna una volta per ciclo di clock. La formula a destra lo dice in modo compatto. Per memorizzare lo stato servono elementi con due condizioni stabili: latch e flip-flop.

## Slide 10: Macchine a stati finiti

Un circuito reale ha un numero finito di variabili di stato, quindi un numero finito di stati. Il suo comportamento è descritto da un modello matematico, la macchina a stati finiti, che è l'argomento di questa parte.

## Slide 11: L'automa a stati finiti

La definizione formale. Una macchina sequenziale è fatta di cinque cose: un alfabeto di ingresso I e un alfabeto di uscita U, insiemi finiti di simboli; un insieme finito di stati S; una funzione stato prossimo, che a ogni coppia stato-ingresso fa corrispondere uno stato prossimo; e una funzione di uscita. Confrontatela con il riscaldamento: l'ingresso è «A premuto o no», gli stati sono TITLE, PLAY e OVER, la funzione stato prossimo è il codice di `game_update`, e l'uscita è la schermata.

## Slide 12: Macchine di Mealy e macchine di Moore

L'uscita si può definire in due modi. In una macchina di *Mealy* l'uscita dipende dallo stato e dall'ingresso: si scrive sulle transizioni, e può reagire a un ingresso nello stesso ciclo. In una macchina di *Moore* l'uscita dipende dal solo stato: si scrive dentro gli stati e cambia solo quando cambia lo stato. Il gioco del riscaldamento è una macchina di Moore: ogni stato ha la sua schermata. I due modelli sono equivalenti, anche se il numero di stati può essere diverso.

## Slide 13: Architettura generale di una macchina sequenziale

L'architettura generale di ogni macchina sequenziale. Una rete combinatoria calcola lo stato prossimo e le uscite a partire dagli ingressi e dallo stato presente. Un registro di flip-flop conserva lo stato presente. A ogni fronte del clock lo stato prossimo diventa lo stato presente. L'anello dalla rete al registro e ritorno è ciò che rende possibile la memoria, e il registro è ciò che tiene l'anello sotto controllo: i valori fanno un giro per ciclo, mai più in fretta. Tutta la Lezione 11 vive nel riquadro superiore.

## Slide 14: Sintesi di una rete sequenziale

La sintesi di una rete sequenziale in cinque passi. Si definiscono ingressi, uscite e stati. Si definiscono le funzioni stato prossimo e di uscita con una tabella o un diagramma degli stati. Si assegna a ogni stato un codice binario: k variabili per un massimo di 2 alla k stati. Si sintetizzano le due reti combinatorie con i metodi noti. Si scelgono gli elementi di memoria. Con i flip-flop D il quarto passo è il più semplice, perché la rete deve solo calcolare il codice dello stato prossimo.

## Slide 15: Tabella e diagramma degli stati: una macchina di Mealy

Le due descrizioni equivalenti di una macchina, per un esempio di Mealy con quattro stati. Nella *tabella degli stati* ogni riga è uno stato presente e ogni colonna un simbolo di ingresso; la cella dà lo stato prossimo e, dopo la barra, l'uscita. Nel *diagramma degli stati* ogni stato è un nodo e ogni transizione una freccia etichettata ingresso barra uscita. Esercitatevi a passare dall'una all'altro: prendete la riga di s0 e trovatene nel disegno le due frecce.

## Slide 16: Tabella e diagramma degli stati: una macchina di Moore

Le stesse transizioni come macchina di Moore. L'uscita non dipende più dall'ingresso, quindi la tabella ha per essa una colonna a parte e il diagramma la scrive dentro ogni nodo; le frecce portano solo il simbolo di ingresso. In questo esempio l'uscita è semplicemente il codice binario dello stato. Confrontate le due slide: la struttura di stati e transizioni è identica, e cambia solo il posto in cui si scrive l'uscita.

## Slide 17: Il riscaldamento come diagramma degli stati

Il gioco del riscaldamento disegnato come diagramma: tre stati, con A che porta da TITLE a PLAY e da OVER a TITLE, e la fine delle vite che porta da PLAY a OVER. Gli anelli su ogni stato sono i casi in cui non cambia nulla. La tabella sotto elenca, per ogni stato, l'ingresso che lo cambia, lo stato prossimo e l'uscita disegnata. Disegnate il diagramma prima di scrivere il codice: per un gioco è l'abitudine di progetto più utile che ci sia.

## Slide 18: Latch

Come fa un circuito di porte a ricordare? La risposta è la retroazione: un'uscita ricollegata a un ingresso. Il circuito più semplice di questo tipo è il latch.

## Slide 19: Elementi di memoria

Un circuito che può memorizzare un bit è un *bistabile*: ha due stati stabili, 0 e 1, e resta in uno dei due finché qualcosa non lo cambia. Le famiglie sono due, latch e flip-flop, ed entrambe hanno due uscite, Q e il suo complemento. L'idea è più vecchia del transistor: il primo flip-flop elettronico fu costruito nel 1918 con due valvole, e lo stesso circuito era al cuore di Colossus.

## Slide 20: Il latch SR

Il *latch SR*: due porte NOR, ciascuna con l'uscita collegata a un ingresso dell'altra. S, per set, porta Q a 1; R, per reset, porta Q a 0. Con entrambi a 0 il latch conserva l'ultimo valore: ricorda quale ingresso è stato a 1 più di recente. La tabella riassume i quattro casi, e l'ultimo è vietato. Per via della retroazione Q dipende da se stesso: in un circuito con un anello un segnale è una forma d'onda nel tempo e non un singolo valore.

## Slide 21: Il latch SR nel tempo

Il latch nel tempo. S va a 1, e dopo il ritardo delle porte Q diventa 1. Poi S torna a 0 e non accade nulla: la retroazione tiene Q a 1. Questo tratto piatto è la memoria. Più tardi R va a 1, Q torna a 0, e vi resta quando R torna a 0. Seguite sul disegno i quattro istanti segnati tenendo davanti il circuito della slide precedente, e ricavate l'uscita di ogni porta.

## Slide 22: Perché S = R = 1 non è ammesso

Con S e R entrambi a 1, entrambe le porte NOR danno 0, quindi Q e il suo complemento non sono più complementari. Peggio: se poi i due ingressi tornano a 0 insieme, le porte fanno a gara, e lo stato finale dipende da quale è più veloce. Il risultato è imprevedibile, e il latch può perfino oscillare. Chi usa un latch SR deve garantire che S e R non siano mai a 1 insieme. Gli elementi JK e D sono stati inventati per eliminare il problema alla radice.

## Slide 23: Latch sincroni: si aggiunge un clock

In un circuito asincrono le uscite possono cambiare ogni volta che cambia un ingresso. In uno sincrono è il clock a decidere quando. Per rendere sincrono il latch SR, S e R passano per due porte AND insieme al clock. Quando il clock vale 0 entrambe le porte danno 0 e il latch non può cambiare; quando vale 1 si comporta come il latch semplice. Il clock decide quando gli ingressi vengono ascoltati.

## Slide 24: I latch JK e D

Due miglioramenti del latch. Nel latch *JK* le uscite sono riportate alle porte di ingresso, così che set e reset interni non possano mai valere 1 insieme; la combinazione J = K = 1, invece di essere vietata, inverte l'uscita: la fa commutare. Il latch *D* ha un solo ingresso: D va al set e la sua negazione al reset, quindi l'uscita prende semplicemente il valore di D finché il clock è attivo. D sta per delay, ritardo, o per dato.

## Slide 25: La sensibilità al livello e il suo problema

Un latch è *sensibile al livello*: per tutto il tempo in cui il clock è al livello attivo è trasparente, e ogni variazione degli ingressi passa alle uscite. Quindi in un ciclo di clock lo stato può cambiare più volte. In una macchina con retroazione questo è fatale: il nuovo stato fa il giro dell'anello e cambia di nuovo lo stato nello stesso ciclo. Un latch JK con entrambi gli ingressi a 1 continua a commutare finché il clock è alto. Serve un elemento che cambi al più una volta per ciclo.

## Slide 26: Flip-flop

Il flip-flop è quell'elemento: cambia su un fronte del clock, e solo allora.

## Slide 27: Il flip-flop master-slave

Il flip-flop *master-slave* è fatto di due latch in serie, controllati da livelli opposti del clock. Quando il clock vale 0 il master è aperto e segue l'ingresso, mentre lo slave è chiuso. Quando il clock passa a 1 il master si chiude, conservando ciò che aveva, e lo slave si apre e lo mostra. I due non sono mai trasparenti insieme, quindi l'ingresso non può mai correre dritto fino all'uscita. L'effetto è che l'uscita cambia solo sul fronte di salita: il flip-flop è *sensibile al fronte*.

## Slide 28: Latch o flip-flop? Guardate l'uscita

La differenza, vista sulle forme d'onda. Il clock e l'ingresso D sono gli stessi per entrambi. L'uscita del latch segue D per tutta la fase alta del clock: cambia a metà di una fase. L'uscita del flip-flop cambia solo sui fronti di salita, prendendo il valore che D ha in quell'istante; gli impulsi brevi di D tra due fronti sono ignorati. L'uscita del flip-flop è ferma per un intero periodo, che è esattamente ciò che serve a un registro di stato.

## Slide 29: Elementi di memoria: un riepilogo

Un riepilogo degli elementi di memoria. La colonna *stato prossimo* dà la regola in forma compatta, dove Q+ è lo stato dopo il cambio; l'ultima colonna dice quando il cambio può avvenire: in ogni momento per il latch semplice, durante il livello attivo per i latch sincroni, sul fronte per i flip-flop. Il flip-flop T, che commuta quando T vale 1, è un JK con i due ingressi uniti. Tenete a mente la riga del flip-flop D: è l'elemento di memoria dei processori di oggi.

## Slide 30: Ritorno alla macchina

Da un bit al processore. L'ultima parte mostra il registro, il program counter, un piccolo contatore progettato passo per passo, e il processore stesso come un'unica grande macchina sequenziale.

## Slide 31: Un registro è una fila di flip-flop

Un *registro* è una fila di flip-flop con un clock comune: un flip-flop per bit. Con un segnale di abilitazione al caricamento prende un nuovo valore solo quando gli è chiesto, e altrimenti conserva il vecchio. RISC-V ha trentadue registri di trentadue bit: 1024 flip-flop. Ora le due macchine della Lezione 11 trovano il loro posto: il decodificatore pilotato dal campo `rd` attiva l'abilitazione di un solo registro, e i multiplexer selezionano i registri da leggere.

## Slide 32: Il program counter: un registro in un anello

Il *program counter*, PC, è il registro che contiene l'indirizzo dell'istruzione in esecuzione. Il suo valore prossimo è calcolato da una piccola rete: un sommatore dà PC più 4, l'indirizzo dell'istruzione seguente, e un multiplexer sceglie tra quello e la destinazione di un salto. A ogni fronte di clock il valore prossimo diventa quello presente. Ha esattamente la forma dell'architettura generale. Con il solo percorso più 4 è un contatore, la più semplice delle macchine a stati.

## Slide 33: Esempio di sintesi: un contatore a due bit

Una sintesi completa: un contatore a due bit che fa 0, 1, 2, 3 e torna a 0. Seguite i sei passi a destra. Gli stati sono i quattro valori; il codice è il conteggio stesso; la tabella dà lo stato prossimo per ogni stato presente. Con i flip-flop D gli ingressi D1 e D0 sono semplicemente i bit dello stato prossimo. Minimizzandoli come funzioni di Q1 e Q0 si ottiene D0 = NOT Q0 e D1 = Q1 XOR Q0. Due flip-flop, un invertitore e una porta XOR.

## Slide 34: Il processore è una macchina sequenziale

L'intero processore è una macchina sequenziale. Il suo stato è il program counter, i trentadue registri e la memoria. Il suo ingresso è l'istruzione che si trova all'indirizzo contenuto nel PC, con i dati che legge. La rete dello stato prossimo è fatta di decodificatori, multiplexer e della ALU. Al fronte del clock i registri indicati dall'istruzione prendono i nuovi valori. Eseguire un programma è una passeggiata tra gli stati di una macchina a stati molto grande, e l'esecuzione passo-passo in PRG32-QT mostra quella passeggiata uno stato alla volta.

## Slide 35: Verifica la comprensione: In una macchina di Moore l'uscita dipende:

Ricordate dove si scrive l'uscita nei due tipi di diagramma. In una macchina di Moore sta dentro i nodi: appartiene allo stato, e l'ingresso non c'entra.

## Slide 36: Verifica la comprensione: Un latch SR fatto di porte NOR ha Q = 1. S e R valgono entrambi 0. Che cosa accade?

Guardate la tabella del latch SR: quale riga ha entrambi gli ingressi a 0? È la riga della memoria. La retroazione conserva il valore memorizzato, qualunque fosse.

## Slide 37: Verifica la comprensione: Che cosa distingue un flip-flop D da un latch D?

Entrambi gli elementi memorizzano un bit ed entrambi hanno un clock. La differenza è quando ascoltano: il latch per tutto il livello attivo, il flip-flop solo nell'istante di un fronte.

## Slide 38: Verifica la comprensione: Quanti flip-flop servono per una macchina a stati finiti con 10 stati?

A una macchina con N stati servono abbastanza variabili di stato da dare a ogni stato un codice diverso: il più piccolo k tale che 2 alla k sia almeno N. È la formula dei codici a lunghezza fissa della Lezione 11.

## Slide 39: Esercizi: prima su carta, poi su PRG32

Cinque esercizi. Progettate una macchina che dà 1 quando gli ultimi due ingressi erano entrambi 1, come macchina di Moore e come macchina di Mealy, e confrontate il numero di stati. Completate un diagramma temporale di un latch SR. Sintetizzate un contatore modulo 3 con due flip-flop D, e riflettete sul quarto stato, non usato. Aggiungete uno stato PAUSE al gioco del riscaldamento, disegnando prima il diagramma. E fate funzionare il pulsante A solo quando viene premuto di nuovo: è il rilevamento del fronte in software.

## Slide 40: Glossario: inglese e italiano

Dodici termini. *Feedback* è la retroazione. *Rising* e *falling edge* sono il fronte di salita e di discesa. *Level-triggered* ed *edge-triggered*, sensibile al livello e sensibile al fronte, dicono quando un elemento di memoria ascolta. *Present state* e *next state* sono i due valori attorno a un fronte di clock. *Latch* e *flip-flop* non si traducono; la parola italiana generale è bistabile.

## Slide 41: Conclusioni e letture

Cinque conclusioni. I circuiti digitali sono combinatori o sequenziali, e per i secondi contano il tempo e lo stato. Una macchina sequenziale realizza un automa a stati finiti, del tipo di Mealy o di Moore. Latch e flip-flop sono le memorie elementari, ed è la retroazione a far sì che un circuito ricordi. Il clock decide quando: i latch ascoltano durante un livello, i flip-flop su un fronte. Registri, contatori, program counter e processore sono macchine sequenziali costruite attorno a reti combinatorie.
