# Lezione 07: Verm1, parte 1: una testa che attraversa il mondo

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; `node notes.js` controlla che ogni slide abbia la sua nota.

## Slide 1: Verm1, parte 1: una testa che attraversa il mondo

Qui comincia il progetto del corso. È un tutorial, non una lezione: scrivete un programma, passo per passo, e alla fine gira. Usa solo ciò che hanno insegnato le lezioni da 02 a 06: registri e memoria, colori e stringhe come numeri, confronti e scorrimenti, virgola fissa. L'immagine in copertina è ciò che avrete sullo schermo tra due ore: un titolo e un quadrato verde, la testa del verme, che attraversa lo schermo da solo. L'implementazione di riferimento è un contributo di Giuseppe Coviello.

## Slide 2: Che cosa avrete alla fine

Cinque risultati. Una cartuccia vostra, compilata da un solo file scritto da voi. Un titolo, una griglia di 40 per 24 celle e la testa disegnata in una di esse. La testa che si muove da sola, una cella alla volta, a una velocità fissata in virgola fissa. Un mondo senza bordi, in cui la testa che esce a destra rientra da sinistra. E un'abitudine, che conta più del programma: il ciclo di lavoro modificare, compilare, eseguire, guardare, con il debugger come strumento normale.

## Slide 3: Il progetto

Prima il progetto nel suo insieme: che cos'è il gioco, come si divide in quattro parti, e che cosa questa parte prende dalle lezioni che avete seguito.

## Slide 4: Verm1: un omaggio a Snake

Verm1, si legge "vermone", è un omaggio a Snake: un verme che si muove su una griglia, mangia, cresce e non deve mordersi. L'idea risale all'arcade Blockade del 1976 ed è diventata celebre sui telefoni Nokia del 1997. È stato scelto perché è abbastanza piccolo da essere scritto da zero in assembly eppure richiede ogni argomento del corso. Scrivete ogni riga voi; sotto non c'è alcun motore. L'immagine a destra è il punto a cui arriverete nella Parte 4.

## Slide 5: Il piano: quattro parti e una pubblicazione

Il piano del progetto. Ogni riga è un tutorial, ciò che vi si aggiunge e le lezioni che usa. Parte 1, oggi: una griglia, una testa, il movimento automatico. Parte 2, Lezione 12: la guida, il cibo, un punteggio. Parte 3, Lezione 17: un corpo che cresce e le collisioni. Parte 4, Lezione 22: il gioco finito. La Lezione 23 prepara il bundle per lo Store. Una regola vale per ogni parte: mai cominciare con un programma che non gira; se il vostro è rotto, partite dal file di riferimento.

## Slide 6: Che cosa prende la Parte 1 dalle lezioni

Nel programma di oggi non c'è nulla di nuovo: ogni idea viene da una lezione. I registri, `la`, `lw`, `sw`, le chiamate e il frame di stack vengono dalla Lezione 02. I colori come numeri RGB565 e le stringhe terminate da zero vengono dalla Lezione 04. Gli scorrimenti usati come moltiplicazioni, i confronti e il ritorno a capo vengono dalla Lezione 05. La virgola fissa, una frazione tenuta come intero scalato, viene dalla Lezione 06, e diventa la velocità del verme. Tenete aperta questa tabella: quando una riga di codice vi lascia perplessi, la terza colonna dice quale lezione rileggere.

## Slide 7: Passo 0: il ciclo di lavoro

Il passo 0 non è codice: è la routine che ripeterete dopo ogni modifica. Modificare il file, compilare la cartuccia, eseguirla, guardare il risultato. Più questo ciclo è rapido, più si impara.

## Slide 8: Compilare ed eseguire

Create nella vostra home una cartella `verm1` e tenetevi un solo file, `verm1.S`, che crescerà di parte in parte. Il primo comando compila la cartuccia; il secondo la invia a PRG32-QT in esecuzione sullo stesso computer e la avvia. Questi due comandi sono identici in ogni tutorial. Se `localhost` non risponde, usate l'indirizzo mostrato nella schermata *Setup* di PRG32-QT. In alternativa si può importare il file dal menu di PRG32-QT.

## Slide 9: Passo 1: tre funzioni che ritornano

Il passo 1 è lo scheletro della Lezione 02 con il prefisso `verm1`: tre etichette globali e tre funzioni che ritornano e basta. Scrivetelo, compilatelo, eseguitelo. Il risultato giusto è uno schermo nero: dimostra che gli strumenti funzionano e che il firmware trova le vostre funzioni. Se qui la compilazione fallisce il problema è l'installazione, non il programma, e va risolto prima di proseguire. L'ultima nota è la regola di tutto il progetto: aggiungere una cosa, eseguire, guardare. Mai due cose insieme.

## Slide 10: Passo 2: una griglia e una testa

Il passo 2 aggiunge ciò che serve per vedere qualcosa: nomi per i numeri, variabili in memoria, e un rettangolo sullo schermo. Alla fine del passo la testa è disegnata ma non si muove ancora.

## Slide 11: Costanti: i colori e la griglia

Queste righe sostituiscono l'inizio dello scheletro. Ogni `.equ` dà un nome a un numero e non usa memoria: l'assemblatore sostituisce semplicemente il numero. Tre colori in RGB565. Poi la geometria: una cella è di 8 per 8 pixel, quindi i 320 pixel di larghezza contengono 40 colonne; gli 8 pixel in alto sono riservati al titolo, e i 192 restanti contengono 24 righe. `SPEED_Q8` è la velocità in virgola fissa e si userà nel passo 3. Le costanti con un nome rendono il programma leggibile e facile da modificare.

## Slide 12: Il mondo di Verm1

Il verme non vive nei pixel: vive nelle celle. Una posizione è una colonna da 0 a 39 e una riga da 0 a 23, e la testa parte dalla colonna 5 della riga 12, la cella chiara nel disegno. Per disegnare una cella le sue coordinate si trasformano in pixel: x è la colonna per 8, uno scorrimento a sinistra di 3; y è la riga per 8 più 8, perché prima viene la riga del titolo. Pensare in celle rende semplici tutte le regole successive: muoversi è sommare 1, e due cose si scontrano quando le loro celle sono uguali.

## Slide 13: Variabili e una stringa

Questo va in fondo al file. La sezione `.rodata` contiene ciò che non cambia mai: il titolo, una stringa che `.asciz` termina con un byte a zero. La sezione `.data` contiene le variabili, una parola di 32 bit ciascuna: la colonna della testa, la sua riga, e la frazione di passo accumulata finora. I valori iniziali scritti qui sono solo un punto di partenza: `init` li imposterà di nuovo in modo esplicito.

## Slide 14: init: la testa al suo posto

`verm1_init` mette la testa al suo posto. Per ogni variabile lo schema è lo stesso: `la` carica l'indirizzo, `li` carica il valore, `sw` memorizza il valore all'indirizzo. La frazione `step_q8` si azzera memorizzando direttamente il registro `zero`. La funzione non chiama nulla, quindi è una *foglia* e non le serve un frame di stack. Perché impostare valori che `.data` contiene già? Perché `init` può essere chiamata di nuovo per ricominciare la partita: mai fidarsi di ciò che la memoria conteneva.

## Slide 15: draw: titolo e testa

`verm1_draw` fa tre chiamate: cancella lo schermo, scrive il titolo, disegna la testa. Salva quindi `ra` in un frame di stack all'inizio e lo ripristina alla fine, come nella Lezione 02. Guardate come la cella diventa pixel: la colonna è caricata in `a0` e scorsa a sinistra di 3; la riga è caricata in `a1`, scorsa e aumentata di `TOP`. Gli argomenti restanti sono larghezza, altezza e colore. Gli argomenti viaggiano da `a0` ad `a4`, nell'ordine in cui la funzione li aspetta.

## Slide 16: Eseguite: una testa sulla griglia

Compilate ed eseguite. Dovreste vedere la parola VERM1 in alto a sinistra e un quadrato verde fermo nella colonna 5 della riga 12. La schermata sulla slide è stata presa più tardi, dalla Parte 1 finita, quindi la sua testa è più a destra: non preoccupatevi della differenza. Se il vostro quadrato è nel posto sbagliato, controllate per prima cosa i due scorrimenti e la somma di `TOP`.

## Slide 17: Passo 3: il movimento

Il passo 3 fa muovere la testa. Il problema è la velocità: il passo naturale, una cella per frame, è di gran lunga troppo veloce, e il processore ha solo gli interi. La soluzione è la virgola fissa della Lezione 06, usata come timer.

## Slide 18: A che velocità deve andare un verme?

`update` viene eseguita circa trenta volte al secondo. A una cella per frame la testa attraverserebbe le quaranta colonne in poco più di un secondo. Vogliamo una frazione di cella per frame. Teniamo quindi una frazione in unità di 1/256 di cella, le sommiamo la velocità a ogni frame, e facciamo un passo ogni volta che si è accumulata una cella intera, 256. Con `SPEED_Q8` uguale a 40 la testa avanza di 40/256 di cella per frame: un passo ogni sei frame circa. Il resto si conserva, quindi in media la velocità è esatta.

## Slide 19: update: accumulare, avanzare, rientrare

Leggete `verm1_update` in due metà. Prima il timer: si carica `step_q8`, si somma la velocità, si confronta con 256. Se è minore si salta all'etichetta 2, si memorizza la frazione e si ritorna: in questo frame nulla si muove. Altrimenti si sottrae 256, tenendo il resto, e lo si memorizza. Poi il passo: si carica `head_x`, si somma 1, si confronta con `COLS`; se la colonna è arrivata a 40 diventa 0, e la testa rientra da sinistra. Le etichette `1:` e `2:` sono etichette locali: `1f` significa «la prossima etichetta 1 in avanti».

## Slide 20: Tracciare a mano

Una traccia a mano, l'esercizio più utile del tutorial. A ogni frame si somma 40 alla frazione. Nei frame da 1 a 6 la somma resta sotto 256 e la testa non si muove. Al frame 7 arriva a 280: si è accumulata una cella intera, si sottrae 256, resta 24, e la testa passa dalla colonna 5 alla colonna 6. I passi arrivano ogni sei o sette frame, e il resto porta con sé la differenza, come il giorno in più di un anno bisestile. Compilate voi i frame da 8 a 12.

## Slide 21: Eseguite: la testa attraversa il mondo

Eseguite. La testa va verso destra a circa cinque celle al secondo, esce dalla colonna 39 e rientra dalla colonna 0. Poi sperimentate con la velocità: prima di ogni esecuzione, prevedete che cosa vedrete. Con 8 la testa è lenta; con 128 fa un passo ogni due frame; con 256, un passo per frame. Provate un valore più grande e scoprite un limite di questo programma: `update` fa al più un passo per frame.

## Slide 22: Passo 4: guardare dentro con PRG32-QT

Il passo 4 non usa codice nuovo. Fermate il vostro programma in PRG32-QT e lo guardate dall'interno. In questo corso il debugger fa parte del metodo, e si usa quando le cose funzionano come quando non funzionano.

## Slide 23: Fermare il programma e leggere la macchina

Una procedura precisa. Attivate la modalità debug in *Settings* ed eseguite la cartuccia. Premete *Update*: il listato mostra `verm1_update`. Cliccate nel margine accanto alla sua prima istruzione per mettere un breakpoint: il programma si ferma lì al frame successivo. Ora avanzate, un'istruzione alla volta, e osservate i registri. Dopo le due istruzioni che realizzano `la`, `t0` contiene un indirizzo: scrivetelo nel campo *Memory* e vedrete i byte di `step_q8`. Ogni *Resume* esegue un frame, e il valore cresce di 40, 0x28.

## Slide 24: Il listato: il vostro codice dopo l'assemblatore

Il debugger non mostra il vostro sorgente: mostra ciò che l'assemblatore ha prodotto. I nomi sono spariti: le etichette sono diventate indirizzi e `SPEED_Q8` è diventato il numero 40. Le pseudo-istruzioni sono espanse: `la` è `auipc` seguita da `addi`, `li` è una `addi` da `zero`, `ret` è un salto a `ra`. Alcune istruzioni cominciano con `c.`: sono le forme compresse, a 16 bit, delle stesse istruzioni, la C di RV32IMAC. Riconoscere il proprio programma in questo listato è un'abilità che cresce con la pratica.

## Slide 25: Leggere la memoria: little-endian, dal vivo

La vista della memoria mostra 128 byte in esadecimale a partire dall'indirizzo scritto. Una parola occupa quattro byte, il meno significativo per primo: quando `step_q8` vale 240 si legge F0 00 00 00. È l'ordine little-endian della Lezione 04, visto dal vivo. Le variabili stanno in memoria nell'ordine del file: `head_x`, `head_y`, `step_q8`, quindi la colonna della testa sta otto byte prima della frazione. Il debugger osserva soltanto: per cambiare il programma si modifica, si compila e si esegue.

## Slide 26: Verifica la comprensione: Con SPEED_Q8 = 64, quanti frame passano tra due passi della testa?

64 su 256 è un quarto di cella per frame. Quanti quarti fanno una cella intera? I due numeri grandi sono distrattori: 64 è la velocità stessa, e 256 è la dimensione di una cella nelle unità del timer.

## Slide 27: Verifica la comprensione: Quale pixel è l'angolo in alto a sinistra della cella in colonna 10, riga 3?

Applicate le due formule della griglia: x è la colonna per 8; y è la riga per 8, più gli 8 pixel della riga del titolo. L'opzione che dimentica la riga del titolo è l'errore più comune.

## Slide 28: Verifica la comprensione: Perché verm1_draw salva ra e verm1_update no?

Non è questione di lunghezza. Una chiamata scrive in `ra` l'indirizzo di ritorno, quindi una funzione che fa chiamate deve mettere al sicuro sullo stack il proprio `ra`. `verm1_update` è una foglia: non chiama nulla, e quando arriva a `ret` il registro `ra` contiene ancora l'indirizzo giusto.

## Slide 29: Fatelo vostro

Quattro modifiche per fare vostro il programma, ciascuna di poche righe. Fate muovere la testa verso sinistra: la somma diventa una sottrazione, e il bordo si rileva sul segno del risultato. Fatela muovere verso il basso. Disegnate una seconda cella, più scura, dietro la testa. Scrivete il vostro nome accanto al titolo in un colore calcolato a mano. Prima di sperimentare tenete una copia della Parte 1 funzionante: la Parte 2 parte da lì.

## Slide 30: Dove siamo, e che cosa viene dopo

Dove siete. Avete una cartuccia che gira e che capite riga per riga. Ha già la forma di ogni gioco: uno stato in memoria, una regola che lo cambia a ogni frame, e una funzione che lo disegna. Manca il giocatore: la testa va dove vuole lei. Le prossime quattro lezioni danno gli strumenti per leggere il joystick e per decidere, bit, maschere e tabelle, e la Parte 2 li usa per aggiungere la guida, il cibo e un punteggio.
