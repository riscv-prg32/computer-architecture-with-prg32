# Lezione 12: Verm1, parte 2: la guida, il cibo e un punteggio

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: le maschere di bit; i codici; gli array in memoria; gli ingressi con pull-up; l'algebra di Boole; la virgola fissa; i multiplexer; istruzioni con o senza segno; comparatori e parità; gli argomenti in a0 ... a7. DA UTILIZZARE OGGI: la convenzione di chiamata (Lezione 18) e, usati senza essere studiati nel corso, gli strumenti di PRG32, le chiamate del runtime PRG32, il debugger di PRG32-QT. DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Slide 1: Verm1, parte 2: la guida, il cibo e un punteggio

Il secondo tutorial del progetto. Alla fine della Parte 1 la testa attraversava lo schermo da sola; oggi entra in gioco il giocatore. Si aggiunge la guida con il joystick, insieme a un cibo che compare a caso, un punteggio e un suono. Tutto poggia sulle quattro lezioni del blocco di logica: un pulsante è un bit selezionato da una maschera, la regola che vieta l'inversione a U è un solo XOR, e il movimento si legge da una tabella come lo selezionerebbe un multiplexer. La frase di Sid Meier in copertina nomina ciò che si aggiunge: scelte che contano.

## Slide 2: Che cosa avrete alla fine

Cinque risultati: una testa guidata in quattro direzioni; una regola che vieta l'inversione a U, scritta con uno XOR e un confronto; un movimento preso da due piccole tabelle invece che da quattro salti; un cibo che compare in una cella casuale, viene mangiato e ricompare; e un punteggio, disegnato come piccole tacche accanto al titolo, con un suono a ogni boccone. Tre dei cinque riguardano lo scrivere bene il programma più che il farlo semplicemente funzionare, e questa enfasi sulla qualità di una soluzione è voluta.

## Slide 3: Che cosa prende la Parte 2 dalle lezioni

Ogni riga collega un'idea delle lezioni di logica a un punto del programma di oggi. L'AND come maschera seleziona un pulsante dalla parola dei pulsanti. Una tavola di verità diventa il codice delle quattro direzioni. Lo XOR, che vale 1 dove due bit differiscono, fornisce sia la regola dell'inversione a U sia il test di uguaglianza. Il pull-up della Lezione 10 spiega perché un pulsante premuto arriva come 1. Il comparatore, il multiplexer e la ROM della Lezione 11 diventano il test "testa sul cibo" e le tabelle `dx` e `dy`. Il tutorial è dunque un'applicazione dell'intero blocco, non di una singola lezione.

## Slide 4: Partire da una Parte 1 che gira

La sessione parte da una Parte 1 che gira: si apre e si compila il file, e si verifica che la testa attraversi lo schermo. Se non lo fa, si usa al suo posto il file di riferimento della Parte 1. Oggi il file cambia in tre passi, e si esegue dopo il secondo e dopo il terzo. La quarta riga enuncia la convenzione di ogni tutorial da qui in avanti: una slide marcata CHANGED sostituisce codice già presente, e una slide marcata NEW aggiunge codice.

## Slide 5: Un codice scelto con cura: le quattro direzioni

I codici delle direzioni sono stati scelti di proposito. Il bit 0 dice se il movimento è verticale; il bit 1 se è "all'indietro", verso coordinate minori. Di conseguenza una direzione e la sua opposta differiscono nel bit 1 e solo in quello: RIGHT è 00 e LEFT è 10, DOWN è 01 e UP è 11. Lo XOR di due direzioni opposte vale quindi sempre 10, cioè 2. Una codifica ben scelta riduce una regola a una sola porta, una lezione della Lezione 11 applicata direttamente. La didascalia ricorda una convenzione dello schermo: y cresce verso il basso, quindi DOWN è +1.

## Slide 6: Dal dito al bit

Il percorso di un pulsante, riassunto dalla Lezione 10. Il piedino è tenuto a 3,3 V da una resistenza di pull-up; premendo il pulsante lo si collega alla massa, quindi il piedino legge 0 quando è premuto. Il runtime inverte i livelli e impacchetta tutti i pulsanti in una parola, con 1 che significa premuto. La tabella dà la maschera di ogni pulsante di direzione. Ne seguono due conseguenze usate subito: UP e RIGHT premuti insieme danno 0x04 OR 0x02, cioè 0x06; e `a0` AND 0x04 vale zero esattamente quando UP non è premuto.

## Slide 7: La regola dell'inversione a U, come tabella di verità

La regola espressa come tavola di verità, di cui sono mostrate sei delle sedici righe. Con la testa che va a destra, una richiesta di RIGHT dà 00 e la testa prosegue; una richiesta di DOWN o UP dà 01 o 11, e la testa gira; una richiesta di LEFT dà 10, cioè 2, e viene rifiutata. Lo stesso vale per DOWN e UP. Completando la tavola e contando i rifiuti se ne trovano quattro, uno per direzione. Con codici scelti a caso la stessa regola richiederebbe quattro confronti separati: la codifica ha assorbito la complessità.

## Slide 8: Cogliere al lavoro la regola dell'inversione a U

Si esegue la cartuccia in modalità debug con `verm1_update` visualizzata. Prima si osserva la telemetria tenendo premuto un pulsante: la maschera d'ingresso vale 0x04 per UP e 0x01 per LEFT. Si imposta poi un breakpoint su `xor t3, t2, t1`. Tenendo premuto LEFT mentre la testa va a destra e riprendendo l'esecuzione, il programma si ferma sullo XOR. I registri valgono `t1` = 0, la direzione, e `t2` = 2, la richiesta. Un passo porta `t3` a 2; altri due mostrano il salto eseguito e lo `sw` saltato. La regola si osserva così operare su valori reali.

## Slide 9: Che cosa si legge nei registri

I contenuti attesi dei registri, con la testa che va a destra. Senza nulla premuto, la richiesta è quella precedente e lo XOR vale 0. Con DOWN vale 1, con UP 3, ed entrambe vengono memorizzate. Con LEFT vale 2, l'inversione a U, e nulla viene memorizzato. L'ultima riga rivela la priorità tra i test: con UP e RIGHT insieme prevale UP, perché è verificato per ultimo. `a0` va letto alla prima istruzione dopo la chiamata, perché più avanti nel frame viene sovrascritto, un caso della convenzione sui registri salvati dal chiamante studiata nella Lezione 18.

## Slide 10: Leggere le variabili in memoria

Le variabili si possono leggere anche in memoria. Dopo `la t0, dir`, `t0` contiene l'indirizzo di `dir`, che si inserisce nel campo *Memory*. Le variabili si susseguono nell'ordine del file, quattro byte ciascuna: `dir`, `want`, `step_q8`, `score`, `food_x`, `food_y`. Dopo che il verme ha mangiato una volta, si mette in pausa il programma e si legge il punteggio: 01 00 00 00, il byte meno significativo per primo. Si legge poi la posizione del cibo e la si confronta con la cella rossa sullo schermo, chiudendo il cerchio tra memoria e display.

## Slide 11: Verifica la comprensione: Il giocatore tiene premuti insieme DOWN e RIGHT: prg32_input_read restituisce / Il verme va verso UP (3). Quale desiderio viene rifiutato?

Per la prima domanda: un bit per pulsante, DOWN vale 0x08 e RIGHT 0x02. Premuti insieme, entrambi i bit valgono 1, quindi il valore è l'OR delle due maschere.

Per la seconda si applica la regola: la richiesta rifiutata è quella il cui XOR con la direzione corrente vale 2. La direzione è 3, 11 in binario; la domanda è quale codice ne differisca nel solo bit 1.

## Slide 12: Verifica la comprensione: Perché slli t1, t1, 2 prima di sommare all'indirizzo di dx? / xor t1, t1, t4 dà zero esattamente quando

Per la prima domanda: le tabelle sono fatte di parole, e una parola è di quattro byte. La voce k si trova a 4k byte dall'inizio della tabella, e uno scorrimento a sinistra di 2 moltiplica per 4.

Per la seconda: lo XOR dà 1 in ogni posizione in cui i due bit differiscono, quindi un risultato tutto a zero significa che nessuna posizione differisce, cioè che i due valori sono uguali.

## Slide 13: Dove siamo, e che cosa viene dopo

La situazione attuale. Il giocatore è ora nel gioco: una richiesta, una regola, un movimento, una ricompensa. La logica di quattro lezioni è diventata istruzioni: bit e maschere, lo XOR come comparatore, una tabella come selettore. Eppure il verme non ha corpo, nulla può andare storto, e il gioco non finisce mai. Il prossimo blocco, su stato e memoria, fornisce i concetti necessari, e la Parte 3 aggiunge un corpo che cresce, le collisioni, una schermata del titolo e una di fine partita.
