# Lezione 17: Verm1, parte 3: un corpo, regole e stati: il codice

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: gli array in memoria; macchine a stati finiti; .text, .rodata, .data; latch e flip-flop; la virgola fissa. DA UTILIZZARE OGGI: la convenzione di chiamata (Lezione 18) e, usati senza essere studiati nel corso, gli strumenti di PRG32, il debugger di PRG32-QT. DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

Percorso. I risultati di oggi: (1) realizzare il gioco come macchina a stati con tre stati; (2) tenere il corpo in un buffer circolare e la griglia in un array di byte; (3) riconoscere una collisione leggendo la griglia. Si appoggia su: gli array in memoria (Lezione 04); macchine a stati finiti (Lezione 13); .text, .rodata, .data (Lezione 07); latch e flip-flop (Lezione 13); la virgola fissa (Lezione 06). Prossimo passo: Lezione 18, Il processore.

Il filo della lezione: Il gioco ha ora una memoria e degli stati: le macchine sequenziali della Lezione 13, scritte in software. Prossimo passo: il processore che esegue tutto questo.

## Slide 1: Verm1, parte 3: un corpo, regole e stati: il codice

Questa è la presentazione del codice della Lezione 17. Mentre la presentazione della lezione sviluppa i concetti, questa raccoglie tutto ciò che si scrive e si esegue: ogni listato con il suo commento, il programma completo della lezione, il risultato che deve produrre, e la procedura per provarlo su ciascuno dei tre host. Le due presentazioni vanno lette insieme: i concetti spiegano il codice, e il codice dà ai concetti una conseguenza osservabile.

## Slide 2: In questa presentazione

Il contenuto della presentazione, nell'ordine delle slide. Il programma della lezione è un file sorgente completo, che si può compilare ed eseguire così com'è. Il percorso consigliato è eseguirlo per primo, osservarne il comportamento, e poi tornare ai singoli listati per capire come ciascuna parte contribuisce a quel comportamento. Il programma di riferimento è ~/arc12/verm1/verm1_part3.S; tools/tests/verm1_check.py lo compila e lo gioca con un giocatore programmato, e verm1_steps.py esegue i punti di controllo intermedi.

## Slide 3: Il ciclo di lavoro, di nuovo

I soliti due comandi. Oggi il file cambia molto, quindi la compilazione non deve attendere la fine: il programma si compila e si esegue dopo ogni slide intitolata "Eseguite". Se qualcosa si rompe, il guasto sta nelle righe aggiunte dall'ultima esecuzione riuscita, il che restringe la ricerca.

## Slide 4: MODIFICATO Costanti: un pulsante, un colore, tre stati

Le nuove costanti sostituiscono quelle della Parte 2. `BODY` è un verde più scuro per i segmenti dietro la testa. `BTN_A` è la maschera del pulsante A, il bit 4 della parola dei pulsanti. I tre stati sono i numeri 0, 1 e 2, con un nome. Le righe `.section` e `.global` che chiudevano questo blocco passano alla slide successiva.

## Slide 5: MODIFICATO .rodata: ciò che resta nel file

La sezione di sola lettura: tre stringhe, per il titolo, l'invito e la fine partita, e le due tabelle `dx` e `dy` della Parte 2. Il programma qui non scrive mai. Sulla scheda questa sezione potrebbe restare nella flash; è la parte della cartuccia che sopravvivrebbe a uno spegnimento, come ha dimostrato il riscaldamento della Lezione 16.

## Slide 6: MODIFICATO .data: ciò che vive in RAM

La sezione delle variabili. `head_x` e `head_y` sono spariti: la testa vive ora nell'anello. La direttiva `.space` riserva un certo numero di byte senza nominarli uno per uno: 256 per `body_x`, 256 per `body_y`, 960 per la mappa. `best` contiene il punteggio migliore, che sopravvive da una partita all'altra ma non a uno spegnimento, perché risiede in RAM. Una cartuccia portabile non ha una memoria permanente propria, un limite qui dichiarato esplicitamente.

## Slide 7: MODIFICATO init: si parte dal titolo

`verm1_init` svolge ora un solo compito: sceglie lo stato iniziale, TITLE. Preparare una partita diventa responsabilità di una nuova funzione, `new_game`, invocata quando il giocatore preme A. Le vecchie `verm1_update`, `step` e `verm1_draw` si cancellano dal file, perché le slide successive le sostituiscono; si tengono `place_food`, `eat_sound` e `draw_cell`.

## Slide 8: MODIFICATO update: i pulsanti, e i loro fronti

La prima metà della nuova `verm1_update` legge i pulsanti e ne calcola i fronti. `s0` contiene i pulsanti del frame corrente; `prev_btn`, in memoria, quelli del frame precedente. L'espressione "ora AND NOT prima" dà 1 solo nelle posizioni in cui una pressione è appena cominciata, e il risultato si pone in `s1`. Poi si aggiorna `prev_btn`. È il rilevatore di fronti della Lezione 13: un registro che ritarda di un periodo di clock, seguito da una porta AND con un ingresso negato. Poiché `s0` e `s1` devono sopravvivere alle chiamate che seguono, si salvano nel frame.

## Slide 9: MODIFICATO update: un ramo per stato

La seconda metà è la tabella delle transizioni, scritta riga per riga. Lo stato si legge per primo, e determina quali ingressi si considerano. In TITLE, una nuova pressione di A chiama `new_game`. In OVER, una nuova pressione di A memorizza TITLE. In PLAY, i pulsanti tenuti premuti, livelli e non fronti, si passano a `play_update`, perché la guida deve rispondere finché un pulsante resta premuto. Le etichette hanno un nome, `u_play`, `u_start`, `u_done`, perché etichette numeriche sarebbero difficili da seguire in una funzione di queste dimensioni.

## Slide 10: MODIFICATO draw: che cosa mostrare in ogni stato

`verm1_draw` mostra un'immagine diversa per ogni stato. La riga del titolo si disegna sempre. In TITLE compare solo l'invito PRESS A, centrato: x = 132 centra sette caratteri da 8 pixel. In PLAY e OVER la funzione disegna il punteggio, il verme e il cibo. `draw` non cambia nulla: la sua uscita dipende solo dallo stato e dalla memoria, esattamente come l'uscita di una macchina di Moore dipende solo dal suo stato.

## Slide 11: MODIFICATO draw: il game over, e draw_text

La fine di `verm1_draw`: nello stato OVER due parole si scrivono sopra la scena. Un piccolo aiutante, `draw_text`, fornisce i due argomenti di colore, bianco su nero, e passa avanti i primi tre, risparmiando due righe a ogni chiamata che disegna testo. Piccoli aiutanti di questo tipo rendono un programma più breve e più facile da modificare in modo coerente.

## Slide 12: Per ora: quattro funzioni che non fanno nulla

Quattro *stub*: funzioni che esistono solo di nome e ritornano subito, tranne `new_game`, che si limita a memorizzare PLAY. Grazie a esse il programma si compila, e la macchina a stati si può mettere alla prova prima che le sue parti siano scritte. È il metodo della prima lezione di programmazione applicato su scala maggiore: cominciare con funzioni che non fanno nulla, poi aggiungere una cosa alla volta.

## Slide 13: Eseguite: una macchina con niente dentro

Eseguire. Compaiono la riga del titolo e PRESS A. Premendo A l'invito scompare e una cella rossa compare nell'angolo in alto a sinistra, perché le variabili del cibo valgono ancora zero. Nulla si muove e la partita non può finire, perché PLAY non ha ancora regole. Nel debugger si può individuare la variabile `state` e vederla passare da 0 a 1 quando si preme A: la macchina funziona, ed è vuota.

## Slide 14: NUOVO new_game: svuotare la mappa, posare il verme

La prima metà della vera `new_game`. Un ciclo azzera i 960 byte della mappa, uno `sb` alla volta. Poi si stende il verme: tre segmenti nelle colonne 3, 4 e 5 della riga 12. Ogni segmento si scrive due volte, colonna e riga nell'anello e un 1 nella mappa, il che stabilisce l'invariante che anello e mappa concordino. L'espressione `grid+12*COLS` è valutata dall'assemblatore. Poiché ogni voce è di un byte, l'indice si somma all'indirizzo base senza scalatura.

## Slide 15: NUOVO new_game: le variabili, il cibo, PLAY

La seconda metà inizializza le variabili: `head_i` = 2 e `length` = 3, che insieme descrivono il verme appena steso; direzione, timer e punteggio partono da zero; si piazza il primo cibo. L'ultima istruzione memorizza PLAY nello stato. L'ordine è voluto: la transizione si completa solo quando tutto ciò che richiede è pronto, così che nessun'altra parte del programma possa osservare una partita inizializzata a metà.

## Slide 16: NUOVO draw_worm: percorrere l'anello all'indietro

`draw_worm` percorre l'anello all'indietro a partire dalla testa: il segmento i è la voce `head_i - i`, mascherata con 255. Colonna e riga si caricano con `lbu`, che legge un byte come numero senza segno, e si passano a `draw_cell`. Il segmento 0, la testa, si disegna in un verde più brillante degli altri. Il ciclo termina quando i raggiunge la lunghezza. `lbu` e non `lb` dichiara che una colonna non è mai negativa, come spiega la nota sulla Lezione 05.

## Slide 17: NUOVO draw_score: le tacche della Parte 2

`draw_score` è il ciclo che nella Parte 2 stava dentro `verm1_draw`, ora una funzione a sé: una piccola tacca per punto. Poiché usa `s0` come contatore, salva quel registro all'ingresso e lo ripristina all'uscita.

## Slide 18: Resta uno stub

Dei quattro stub ne resta uno solo: `play_update`, che ancora non fa nulla. Il verme esiste in memoria e sullo schermo, e sta fermo.

## Slide 19: Eseguite: un verme che sta fermo

Eseguire e premere A: un verme di tre celle nella riga 12, con la testa più brillante a destra, e il cibo in una cella casuale. Ora si può ispezionare la memoria con il debugger. All'indirizzo di `body_x` i primi byte sono 03 04 05. Nella mappa, allo spiazzamento 12 × 40 + 3, tre byte uguali a 01 spiccano tra gli zeri. Sono le due strutture dati della presentazione della lezione, l'anello e la mappa, ora popolate.

## Slide 20: MODIFICATO play_update: la vostra update della Parte 2

`play_update` è la `verm1_update` della Parte 2 con un nuovo nome: i quattro test sui pulsanti e la regola dell'inversione a U. Una differenza: i pulsanti arrivano come argomento in `a0`, quindi non serve alcuna chiamata per leggerli.

## Slide 21: MODIFICATO play_update: il timer

La fine di `play_update` è esattamente il timer della Parte 2: si somma la velocità, e quando si è accumulata una cella intera si chiama `step`.

## Slide 22: MODIFICATO step: tre registri da conservare

L'inizio di `step`. Tre registri devono conservare i loro valori attraverso le chiamate che seguono: `s0` e `s1` per la cella della nuova testa, `s2` per il risultato del test sul cibo. Il frame salva quindi `ra` e tre registri `s`, quattro parole in tutto. La consultazione di `dx` e `dy` è quella della Parte 2.

## Slide 23: MODIFICATO step: dove sarà la testa?

Dove sarà la testa? La testa attuale è la voce `head_i` dell'anello: si caricano colonna e riga con `lbu`, si sommano `dx` e `dy`, e il risultato fa il giro ai bordi come nella Parte 2. La nuova cella è ora in `s0` e `s1`. Nulla è stato ancora scritto: il programma deve osservare prima di agire.

## Slide 24: MODIFICATO step: mangiare, o muovere la coda

Mangiare, o spostare la coda. Il comparatore della Parte 2 lascia il suo risultato in `s2`, zero se la nuova testa sta sul cibo. Se il verme mangia, la lunghezza cresce di uno e la coda resta al suo posto. Altrimenti la coda deve andarsene: la sua voce è `head_i - length + 1`, e se ne caricano colonna e riga. Crescere e non spostare la coda sono una sola e medesima operazione, che è tutto il trucco di Snake.

## Slide 25: NUOVO step: liberare la coda, esaminare la testa

Ora la mappa. L'indice di un byte è riga × 40 + colonna, calcolato con `mul` e `add`; `mul` appartiene all'estensione M, che l'ESP32-C6 implementa. Prima si azzera il byte della coda, poi si verifica il byte della nuova testa. L'ordine conta: nello stesso passo la coda si allontana, quindi la testa può legittimamente entrare nella cella che la coda ha appena lasciato. Se il byte vale 1 il verme si è morso: lo stato diventa OVER e il punteggio migliore viene aggiornato.

## Slide 26: NUOVO step: scrivere la nuova testa

Se la cella è libera, si scrive la nuova testa: un 1 nella mappa, `head_i` incrementato e mascherato con 255, e colonna e riga memorizzate nella nuova voce dell'anello. Poi, se `s2` vale zero, la ricompensa: un punto, un nuovo cibo, un suono. Dopo una collisione la funzione salta tutto questo, così lo schermo mostra il verme com'era prima del passo fatale.

## Slide 27: MODIFICATO place_food: non sul verme

`place_food` è corretta: estrae una cella a caso, ne esamina il byte nella mappa, e se la cella è occupata estrae di nuovo, finché non esce una cella libera. La colonna attende in `s0` mentre si chiede il secondo numero casuale. Il ciclo è breve: anche con il verme più lungo, 255 celle su 960, servono in media meno di due tentativi.

## Slide 28: Eseguite: Verm1, Parte 3

Eseguire: è Verm1, Parte 3. Il verme segue la testa e cresce a ogni pasto; girare dentro il corpo pone fine alla partita; A riporta al titolo, e A di nuovo avvia una nuova partita. Le due schermate vengono dal test automatico: sette celle e quattro tacche dopo quattro pasti, e la schermata di fine partita.

## Slide 29: Appendice: due funzioni che non sono cambiate

Due funzioni sono invariate rispetto alla Parte 2: `eat_sound` e `draw_cell`. Sono ristampate nelle due slide successive, marcate UNCHANGED, così che questa presentazione contenga l'intero programma. Il file completo è l'unione delle slide marcate NEW e CHANGED, insieme a queste due.

## Slide 30: INVARIATO eat_sound

`eat_sound`, come nella Parte 2: cinque argomenti e una chiamata a `prg32_audio_note`, che produce una nota di 60 millisecondi.

## Slide 31: INVARIATO draw_cell

`draw_cell`, come nella Parte 2: riceve colonna, riga e colore, converte le coordinate di cella in pixel, e disegna un rettangolo.

## Slide 32: Eseguite: che cosa dovreste vedere

Il comportamento atteso del programma, e l'ingresso che richiede. Il risultato va previsto prima di eseguire: ogni differenza tra la previsione e lo schermo è un'informazione sul proprio modello della macchina, e conviene spiegarla prima di correggerla. L'immagine è stata prodotta dal test automatico, non disegnata a mano.

## Slide 33: Provatelo su PRG32-QT

La via più diretta: PRG32-QT sul proprio computer, in quattro passi, ciascuno con il suo comando. Per gli strumenti PRG32-QT si presenta come una scheda in ascolto sulla porta 8080, ed è per questo che il comando di caricamento nomina l'esp32c6. Con la modalità debug attiva si può fermare l'esecuzione su qualsiasi istruzione e ispezionare registri e memoria.

## Slide 34: Provatelo su QEMU

Lo stesso programma sull'emulatore. QEMU esegue il firmware vero su un chip emulato, quindi la cartuccia va compilata per l'architettura qemu e caricata mentre QEMU non è in esecuzione. Il firmware si avvia sul menu Setup, da cui si scelgono Run Cartridge e lo slot. La tastiera è letta dal terminale da cui QEMU è stato avviato, non dalla finestra che mostra l'immagine.

## Slide 35: Provatelo sulla scheda

Lo stesso programma sul kit fisico. Il firmware si scrive una volta, via USB; da quel momento le cartucce viaggiano sul Wi-Fi con lo stesso comando di caricamento usato per PRG32-QT, indirizzato alla scheda. È l'unico host non esercitato dai test automatici, quindi le osservazioni fatte sulla scheda sono particolarmente preziose e vanno riferite.

## Slide 36: Se non funziona

I cinque sintomi più frequenti, il loro significato e il rimedio. Il messaggio di errore va letto per intero prima di cambiare qualsiasi cosa: quasi sempre nomina la causa. Quando si chiede aiuto, vanno riportati alla lettera il comando e il messaggio completo.

## Slide 37: Fatelo vostro

Quattro modifiche ideate dallo studente. Muri: il verme muore al bordo invece di fare il giro. Un verme iniziale più lungo, magari dipendente dal punteggio migliore. Veleno: una seconda cella, blu, che accorcia il verme di uno, il che richiede alla coda di avanzare due volte preservando l'invariante tra anello e mappa. E il punteggio migliore mostrato come tacche sulla schermata di fine partita. Ognuna tocca una o due funzioni. Va prima conservata una copia della Parte 3 funzionante.
