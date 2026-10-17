# Lezione 07: Verm1, parte 1: una testa che attraversa il mondo

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: il progetto Verm1; contratto init/update/draw; un colore è un numero; gli array in memoria; .text, .rodata, .data; indirizzo, valore, load, store; perché si salva ra; shift come moltiplicazione; la virgola fissa; le pseudo-istruzioni; l'ordine little-endian. DA UTILIZZARE OGGI: gli strumenti di PRG32, il debugger di PRG32-QT (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: formati delle istruzioni (Lezione 19). Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

Percorso. I risultati di oggi: (1) costruire una cartuccia da un file vuoto: una griglia, un titolo e una testa che si muove; (2) mettere costanti e variabili nella sezione giusta, .rodata o .data; (3) controllare una velocità con un accumulatore in virgola fissa. Si appoggia su: contratto init/update/draw (Lezione 02); un colore è un numero (Lezione 04); gli array in memoria (Lezione 04); indirizzo, valore, load, store (Lezione 02); perché si salva ra (Lezione 02). Prossimo passo: Lezione 08, Elementi di algebra di Boole.

Ponte. Nella Lezione 02 il passo 2 salvava ra sullo stack prima delle sue chiamate, e lw t1, 0(t0) leggeva una parola all'indirizzo in t0. Oggi verm1_draw salva ra e verm1_update no, e ogni variabile di Verm1 si legge con la e lw. La Lezione 18 spiega lo stack e la convenzione di chiamata; la Lezione 19 nomina i modi di indirizzamento. Richiamo: Perché verm1_draw salva ra mentre verm1_update no?

Il filo della lezione: I numeri sono diventati posizioni, colori e una velocità: l'intero blocco sull'informazione, in un gioco che gira. Prossimo passo: la logica che permetterà al giocatore di guidarlo.

## Slide 1: Verm1, parte 1: una testa che attraversa il mondo

Qui comincia il progetto del corso. È un tutorial più che una lezione: si scrive un programma passo per passo, e alla fine gira. Attinge esclusivamente alle Lezioni dalla 02 alla 06: registri e memoria, colori e stringhe come numeri, confronti e scorrimenti, virgola fissa. La copertina mostra lo stato dello schermo tra due ore: un titolo e un quadrato verde, la testa del verme, che attraversa lo schermo da solo. Lo scopo della sessione è l'integrazione: concetti studiati separatamente devono ora cooperare in un solo programma. L'implementazione di riferimento è un contributo di Giuseppe Coviello.

## Slide 2: Che cosa avrete alla fine

Cinque risultati. Una cartuccia tutta dello studente, compilata da un solo file scritto a mano. Un titolo, una griglia di 40 per 24 celle e la testa disegnata in una di esse. La testa che si muove da sola, una cella alla volta, a una velocità espressa in virgola fissa. Un mondo senza bordi, in cui la testa che esce a destra rientra da sinistra. E, più importante del programma stesso, un metodo: il ciclo di lavoro modifica, compila, esegui e osserva, con il debugger come strumento ordinario e non come ultima risorsa.

## Slide 3: Verm1: un omaggio a Snake

Verm1, che si legge "vermone", è un omaggio a Snake: un verme si muove su una griglia, mangia, cresce e non deve urtare sé stesso. L'idea risale al gioco da sala Blockade del 1976 e raggiunse grande popolarità sui telefoni Nokia del 1997. È stato scelto perché è abbastanza piccolo da essere scritto da zero in assembly e richiede tuttavia ogni argomento del corso. Ogni riga è scritta dallo studente, senza alcun motore sottostante. L'immagine a destra mostra la meta, raggiunta nella Parte 4.

## Slide 4: Il piano: quattro parti e una pubblicazione

Il piano del progetto. Ogni riga è un tutorial, ciò che aggiunge e le lezioni su cui si basa. Parte 1, oggi: una griglia, una testa, il movimento autonomo. Parte 2, Lezione 12: guida, cibo e punteggio. Parte 3, Lezione 17: un corpo che cresce e le collisioni. Parte 4, Lezione 22: il gioco finito. La Lezione 23 prepara il bundle per lo Store. Una regola vale per ogni parte: non si comincia mai da un programma che non gira. Uno studente il cui file è rotto riparte dal file di riferimento, così che ogni sessione si costruisca su una base funzionante.

## Slide 5: Che cosa prende la Parte 1 dalle lezioni

Nulla nel programma di oggi è nuovo: ogni idea è riconducibile a una lezione. Registri, `la`, `lw`, `sw`, chiamate di procedura e stack frame vengono dalla Lezione 02. Colori come numeri RGB565 e stringhe terminate da zero vengono dalla Lezione 04. Scorrimenti come moltiplicazioni, confronti e giro attorno vengono dalla Lezione 05. La virgola fissa, una frazione tenuta come intero scalato, viene dalla Lezione 06 e diventa la velocità del verme. La tabella va tenuta aperta per tutta la sessione: quando una riga di codice lascia perplessi, la sua terza colonna indica quale lezione rileggere.

## Slide 6: Il mondo di Verm1

Il verme abita celle, non pixel. Una posizione è una colonna da 0 a 39 e una riga da 0 a 23, e la testa parte dalla colonna 5 della riga 12, la cella evidenziata. Per disegnare una cella, le sue coordinate si trasformano in pixel: x è la colonna per 8, uno scorrimento a sinistra di 3; y è la riga per 8 più 8, per lasciare posto alla riga del titolo. Questo cambio di sistema di coordinate è una decisione di modellazione con benefici duraturi: in coordinate di cella ogni regola successiva è semplice, perché muoversi è sommare 1 e due oggetti si scontrano esattamente quando le loro celle sono uguali.

## Slide 7: A che velocità deve andare un verme?

`update` gira circa trenta volte al secondo. A una cella per frame la testa attraverserebbe le quaranta colonne in poco più di un secondo, il che è ingiocabile. Serve una frazione di cella per frame. La soluzione tiene un accumulatore in unità di 1/256 di cella, vi somma la velocità a ogni frame e avanza di una cella ogni volta che si è accumulata una cella intera, 256 unità. Con `SPEED_Q8` uguale a 40 la testa avanza di 40/256 di cella per frame, un passo circa ogni sei frame. Poiché il resto viene conservato e non scartato, la velocità media è esatta.

## Slide 8: Tracciare a mano

Un tracciamento a mano, l'esercizio più istruttivo del tutorial. A ogni frame si somma 40 all'accumulatore. Nei frame da 1 a 6 la somma resta sotto 256 e la testa non si muove. Al frame 7 arriva a 280: si è accumulata una cella intera, si sottrae 256, resta 24, e la testa passa dalla colonna 5 alla colonna 6. I passi avvengono quindi ogni sei o sette frame, e il resto assorbe la differenza, un po' come il giorno in più di un anno bisestile riconcilia il calendario con l'anno solare. I frame da 8 a 12 sono lasciati da completare.

## Slide 9: Fermare il programma e leggere la macchina

Una procedura di debug precisa. Si abilita la modalità debug in *Settings* e si esegue la cartuccia. *Update* mostra `verm1_update` nel listato; un clic nel margine accanto alla sua prima istruzione imposta un breakpoint, su cui il programma si ferma al frame successivo. Avanzando un'istruzione alla volta, si osservano i registri. Dopo le due istruzioni in cui si espande `la`, `t0` contiene un indirizzo; inserendolo nel campo *Memory* si vedono i byte di `step_q8`. Ogni *Resume* esegue un frame, e il valore cresce di 40, cioè 0x28.

## Slide 10: Leggere la memoria: little-endian, dal vivo

La vista della memoria mostra 128 byte in esadecimale a partire dall'indirizzo inserito. Una parola occupa quattro byte, il meno significativo per primo: quando `step_q8` vale 240 la vista mostra F0 00 00 00. È l'ordine little-endian della Lezione 04, ora osservato direttamente. Le variabili compaiono in memoria nell'ordine in cui il file le dichiara, `head_x`, `head_y`, `step_q8`, quindi la colonna della testa sta otto byte prima dell'accumulatore. Il debugger osserva soltanto; per cambiare il programma si modifica, si compila e si esegue di nuovo.

## Slide 11: Verifica la comprensione: Con SPEED_Q8 = 64, quanti frame passano tra due passi della testa? / Quale pixel è l'angolo in alto a sinistra della cella in colonna 10, riga 3?

Per la prima domanda: 64 su 256 è un quarto di cella per frame, e la domanda è quanti quarti fanno una cella intera. I due numeri grandi sono distrattori: 64 è la velocità stessa, e 256 è la dimensione di una cella nelle unità dell'accumulatore.

Per la seconda valgono le due formule della griglia: x è la colonna per 8; y è la riga per 8 più gli 8 pixel della riga del titolo. L'opzione che dimentica la riga del titolo rappresenta l'errore più comune.

## Slide 12: Verifica la comprensione: Perché verm1_draw salva ra e verm1_update no?

La risposta non dipende dalla lunghezza della funzione. Una chiamata scrive l'indirizzo di ritorno in `ra`, quindi una funzione che fa chiamate deve preservare il proprio `ra` sullo stack. `verm1_update` è una funzione *foglia*: non chiama nulla, quindi `ra` contiene ancora l'indirizzo corretto quando si raggiunge `ret`, e non serve alcuno stack frame.

## Slide 13: Dove siamo, e che cosa viene dopo

La situazione attuale. Lo studente ha una cartuccia che gira e che comprende riga per riga. Mostra già la struttura comune a ogni gioco: uno stato in memoria, una regola che lo trasforma a ogni frame e una funzione che lo rappresenta. Manca il giocatore: la testa va dove le pare. Le prossime quattro lezioni forniscono i mezzi per leggere il joystick e prendere decisioni, cioè bit, maschere, regole booleane e tabelle, e la Parte 2 li applica per aggiungere guida, cibo e punteggio.
