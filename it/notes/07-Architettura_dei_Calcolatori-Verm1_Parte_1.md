# Lezione 07: Verm1, parte 1: una testa che attraversa il mondo

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

## Slide 1: Verm1, parte 1: una testa che attraversa il mondo

Qui comincia il progetto del corso. È un tutorial, non una lezione: scrivete un programma, passo per passo, e alla fine gira. Usa solo ciò che hanno insegnato le lezioni da 02 a 06: registri e memoria, colori e stringhe come numeri, confronti e scorrimenti, virgola fissa. L'immagine in copertina è ciò che avrete sullo schermo tra due ore: un titolo e un quadrato verde, la testa del verme, che attraversa lo schermo da solo. L'implementazione di riferimento è un contributo di Giuseppe Coviello.

## Slide 2: Che cosa avrete alla fine

Cinque risultati. Una cartuccia vostra, compilata da un solo file scritto da voi. Un titolo, una griglia di 40 per 24 celle e la testa disegnata in una di esse. La testa che si muove da sola, una cella alla volta, a una velocità fissata in virgola fissa. Un mondo senza bordi, in cui la testa che esce a destra rientra da sinistra. E un'abitudine, che conta più del programma: il ciclo di lavoro modificare, compilare, eseguire, guardare, con il debugger come strumento normale.

## Slide 3: Verm1: un omaggio a Snake

Verm1, si legge "vermone", è un omaggio a Snake: un verme che si muove su una griglia, mangia, cresce e non deve mordersi. L'idea risale all'arcade Blockade del 1976 ed è diventata celebre sui telefoni Nokia del 1997. È stato scelto perché è abbastanza piccolo da essere scritto da zero in assembly eppure richiede ogni argomento del corso. Scrivete ogni riga voi; sotto non c'è alcun motore. L'immagine a destra è il punto a cui arriverete nella Parte 4.

## Slide 4: Il piano: quattro parti e una pubblicazione

Il piano del progetto. Ogni riga è un tutorial, ciò che vi si aggiunge e le lezioni che usa. Parte 1, oggi: una griglia, una testa, il movimento automatico. Parte 2, Lezione 12: la guida, il cibo, un punteggio. Parte 3, Lezione 17: un corpo che cresce e le collisioni. Parte 4, Lezione 22: il gioco finito. La Lezione 23 prepara il bundle per lo Store. Una regola vale per ogni parte: mai cominciare con un programma che non gira; se il vostro è rotto, partite dal file di riferimento.

## Slide 5: Che cosa prende la Parte 1 dalle lezioni

Nel programma di oggi non c'è nulla di nuovo: ogni idea viene da una lezione. I registri, `la`, `lw`, `sw`, le chiamate e il frame di stack vengono dalla Lezione 02. I colori come numeri RGB565 e le stringhe terminate da zero vengono dalla Lezione 04. Gli scorrimenti usati come moltiplicazioni, i confronti e il ritorno a capo vengono dalla Lezione 05. La virgola fissa, una frazione tenuta come intero scalato, viene dalla Lezione 06, e diventa la velocità del verme. Tenete aperta questa tabella: quando una riga di codice vi lascia perplessi, la terza colonna dice quale lezione rileggere.

## Slide 6: Il mondo di Verm1

Il verme non vive nei pixel: vive nelle celle. Una posizione è una colonna da 0 a 39 e una riga da 0 a 23, e la testa parte dalla colonna 5 della riga 12, la cella chiara nel disegno. Per disegnare una cella le sue coordinate si trasformano in pixel: x è la colonna per 8, uno scorrimento a sinistra di 3; y è la riga per 8 più 8, perché prima viene la riga del titolo. Pensare in celle rende semplici tutte le regole successive: muoversi è sommare 1, e due cose si scontrano quando le loro celle sono uguali.

## Slide 7: A che velocità deve andare un verme?

`update` viene eseguita circa trenta volte al secondo. A una cella per frame la testa attraverserebbe le quaranta colonne in poco più di un secondo. Vogliamo una frazione di cella per frame. Teniamo quindi una frazione in unità di 1/256 di cella, le sommiamo la velocità a ogni frame, e facciamo un passo ogni volta che si è accumulata una cella intera, 256. Con `SPEED_Q8` uguale a 40 la testa avanza di 40/256 di cella per frame: un passo ogni sei frame circa. Il resto si conserva, quindi in media la velocità è esatta.

## Slide 8: Tracciare a mano

Una traccia a mano, l'esercizio più utile del tutorial. A ogni frame si somma 40 alla frazione. Nei frame da 1 a 6 la somma resta sotto 256 e la testa non si muove. Al frame 7 arriva a 280: si è accumulata una cella intera, si sottrae 256, resta 24, e la testa passa dalla colonna 5 alla colonna 6. I passi arrivano ogni sei o sette frame, e il resto porta con sé la differenza, come il giorno in più di un anno bisestile. Compilate voi i frame da 8 a 12.

## Slide 9: Fermare il programma e leggere la macchina

Una procedura precisa. Attivate la modalità debug in *Settings* ed eseguite la cartuccia. Premete *Update*: il listato mostra `verm1_update`. Cliccate nel margine accanto alla sua prima istruzione per mettere un breakpoint: il programma si ferma lì al frame successivo. Ora avanzate, un'istruzione alla volta, e osservate i registri. Dopo le due istruzioni che realizzano `la`, `t0` contiene un indirizzo: scrivetelo nel campo *Memory* e vedrete i byte di `step_q8`. Ogni *Resume* esegue un frame, e il valore cresce di 40, 0x28.

## Slide 10: Leggere la memoria: little-endian, dal vivo

La vista della memoria mostra 128 byte in esadecimale a partire dall'indirizzo scritto. Una parola occupa quattro byte, il meno significativo per primo: quando `step_q8` vale 240 si legge F0 00 00 00. È l'ordine little-endian della Lezione 04, visto dal vivo. Le variabili stanno in memoria nell'ordine del file: `head_x`, `head_y`, `step_q8`, quindi la colonna della testa sta otto byte prima della frazione. Il debugger osserva soltanto: per cambiare il programma si modifica, si compila e si esegue.

## Slide 11: Verifica la comprensione: Con SPEED_Q8 = 64, quanti frame passano tra due passi della testa? / Quale pixel è l'angolo in alto a sinistra della cella in colonna 10, riga 3?

64 su 256 è un quarto di cella per frame. Quanti quarti fanno una cella intera? I due numeri grandi sono distrattori: 64 è la velocità stessa, e 256 è la dimensione di una cella nelle unità del timer.

Applicate le due formule della griglia: x è la colonna per 8; y è la riga per 8, più gli 8 pixel della riga del titolo. L'opzione che dimentica la riga del titolo è l'errore più comune.

## Slide 12: Verifica la comprensione: Perché verm1_draw salva ra e verm1_update no?

Non è questione di lunghezza. Una chiamata scrive in `ra` l'indirizzo di ritorno, quindi una funzione che fa chiamate deve mettere al sicuro sullo stack il proprio `ra`. `verm1_update` è una foglia: non chiama nulla, e quando arriva a `ret` il registro `ra` contiene ancora l'indirizzo giusto.

## Slide 13: Dove siamo, e che cosa viene dopo

Dove siete. Avete una cartuccia che gira e che capite riga per riga. Ha già la forma di ogni gioco: uno stato in memoria, una regola che lo cambia a ogni frame, e una funzione che lo disegna. Manca il giocatore: la testa va dove vuole lei. Le prossime quattro lezioni danno gli strumenti per leggere il joystick e per decidere, bit, maschere e tabelle, e la Parte 2 li usa per aggiungere la guida, il cibo e un punteggio.
