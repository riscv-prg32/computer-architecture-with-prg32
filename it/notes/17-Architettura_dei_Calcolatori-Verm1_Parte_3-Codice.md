# Lezione 17: Verm1, parte 3: un corpo, regole e stati: il codice

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

## Slide 1: Verm1, parte 3: un corpo, regole e stati: il codice

Questa è la presentazione del codice della Lezione 17. La presentazione della lezione contiene i concetti; questa contiene tutto ciò che si scrive e si esegue: i listati con la loro spiegazione, il programma completo, che cosa mostra, e il modo di provarlo su ciascuno dei tre host.

## Slide 2: In questa presentazione

Che cosa contiene la presentazione, nell'ordine delle slide. Il programma della lezione è un file che potete compilare ed eseguire così com'è: partite da lì, e tornate ai listati per capire ogni parte. Il programma di riferimento è ~/arc12/verm1/verm1_part3.S; tools/tests/verm1_check.py lo compila e lo gioca con un giocatore programmato, e verm1_steps.py esegue i punti di controllo intermedi.

## Slide 3: Il ciclo di lavoro, di nuovo

I soliti due comandi. Oggi il file cambia moltissimo, quindi non aspettate la fine per compilare: compilate ed eseguite dopo ogni slide intitolata «Eseguite». Se qualcosa si rompe, l'errore sta nelle righe aggiunte dopo l'ultima esecuzione.

## Slide 4: MODIFICATO Costanti: un pulsante, un colore, tre stati

Le nuove costanti sostituiscono quelle della Parte 2. `BODY` è un verde più scuro per i segmenti dietro la testa. `BTN_A` è la maschera del pulsante A, il bit 4 della parola dei pulsanti. I tre stati sono semplicemente i numeri 0, 1 e 2, con un nome. Le righe `.section` e `.global`, che chiudevano questo blocco, passano alla slide successiva.

## Slide 5: MODIFICATO .rodata: ciò che resta nel file

La sezione di sola lettura: tre stringhe, per il titolo, l'invito e il game over, e le due tabelle `dx` e `dy` della Parte 2. Il programma qui non scrive mai. Sulla scheda questa sezione potrebbe restare nella flash; è la parte della cartuccia che sopravvivrebbe a uno spegnimento.

## Slide 6: MODIFICATO .data: ciò che vive in RAM

La sezione delle variabili. `head_x` e `head_y` sono sparite: la testa ora vive nell'anello. La direttiva `.space` riserva un certo numero di byte senza dare un nome a ciascuno: 256 per `body_x`, 256 per `body_y`, 960 per la mappa. `best` contiene il punteggio migliore: sopravvive da una partita alla successiva, ma non a uno spegnimento, perché vive in RAM. Una cartuccia portabile non ha una memoria permanente propria: un limite onesto.

## Slide 7: MODIFICATO init: si parte dal titolo

`verm1_init` ora fa una cosa sola: sceglie il primo stato, TITLE. Preparare la partita è compito di una funzione nuova, `new_game`, chiamata quando il giocatore preme A. Cancellate dal vostro file le vecchie `verm1_update`, `step` e `verm1_draw`: le prossime slide le sostituiscono. Tenete `place_food`, `eat_sound` e `draw_cell`.

## Slide 8: MODIFICATO update: i pulsanti, e i loro fronti

La prima metà della nuova `verm1_update` legge i pulsanti e ne calcola i fronti. `s0` contiene i pulsanti di questo frame; `prev_btn`, in memoria, quelli del frame precedente. L'espressione «adesso AND NOT prima» dà un 1 solo nelle posizioni in cui una pressione è appena cominciata, e il risultato va in `s1`. Poi si aggiorna `prev_btn`. È il rilevatore di fronte della Lezione 13: un registro che ritarda di un clock, e una porta AND con un ingresso invertito.

## Slide 9: MODIFICATO update: un ramo per stato

La seconda metà è la tabella delle transizioni, riga per riga. Lo stato si legge per primo, e decide chi guarda gli ingressi. In TITLE una nuova pressione di A chiama `new_game`. In OVER una nuova pressione di A memorizza TITLE. In PLAY si passano a `play_update` i pulsanti tenuti premuti, i livelli e non i fronti, perché la guida deve funzionare mentre un pulsante resta giù. Qui le etichette hanno un nome, `u_play`, `u_start`, `u_done`, perché con i numeri sarebbe difficile orientarsi.

## Slide 10: MODIFICATO draw: che cosa mostrare in ogni stato

`verm1_draw` mostra un'immagine diversa in ogni stato. La riga del titolo si disegna sempre. In TITLE compare solo l'invito PRESS A, centrato: 132 è la x che centra sette caratteri da 8 pixel. In PLAY e OVER la funzione disegna punteggio, verme e cibo. Notate che `draw` non modifica nulla: la sua uscita dipende solo dallo stato e dalla memoria, come in una macchina di Moore.

## Slide 11: MODIFICATO draw: il game over, e draw_text

La fine di `verm1_draw`: nello stato OVER si scrivono due parole sopra la scena. Una piccola funzione di servizio, `draw_text`, riempie i due argomenti di colore, bianco su nero, e lascia passare i primi tre, così ogni chiamata per disegnare testo richiede due righe in meno. Funzioni di servizio come questa rendono un programma più corto e più facile da modificare.

## Slide 12: Per ora: quattro funzioni che non fanno nulla

Quattro *stub*: funzioni che esistono solo di nome e ritornano subito, tranne `new_game`, che memorizza soltanto PLAY. Grazie a loro il programma si compila e la macchina si può provare prima che le sue parti siano scritte. È il metodo della prima lezione: si parte da funzioni che non fanno nulla, poi si aggiunge una cosa alla volta.

## Slide 13: Eseguite: una macchina con niente dentro

Eseguite. Vedete la riga del titolo e PRESS A. Premete A: l'invito scompare e nell'angolo in alto a sinistra compare una cella rossa, perché le variabili del cibo valgono ancora zero. Nulla si muove e la partita non può finire: PLAY non ha ancora regole. Nel debugger trovate la variabile `state` e guardatela passare da 0 a 1 quando premete A: la macchina funziona, ed è vuota.

## Slide 14: NUOVO new_game: svuotare la mappa, posare il verme

La prima metà della vera `new_game`. Un ciclo pone a zero i 960 byte della mappa, una `sb` alla volta. Poi si posa il verme: tre segmenti nelle colonne 3, 4 e 5 della riga 12. Ogni segmento è scritto due volte: colonna e riga nell'anello, e un 1 nella mappa. L'espressione `grid+12*COLS` è calcolata dall'assemblatore. Poiché ogni elemento è un byte, l'indice si somma all'indirizzo base senza alcuno scorrimento.

## Slide 15: NUOVO new_game: le variabili, il cibo, PLAY

La seconda metà imposta le variabili: `head_i` vale 2 e `length` vale 3, che insieme descrivono il verme appena posato; direzione, timer e punteggio partono da zero; si piazza il primo cibo. L'ultima istruzione memorizza PLAY nello stato. L'ordine è voluto: la transizione è completa solo quando tutto è pronto.

## Slide 16: NUOVO draw_worm: percorrere l'anello all'indietro

`draw_worm` percorre l'anello all'indietro a partire dalla testa: il segmento numero i è l'elemento `head_i - i`, mascherato con 255. Colonna e riga si caricano con `lbu`, che legge un byte come numero senza segno, e si passano a `draw_cell`. Il segmento 0, la testa, è disegnato in un verde più chiaro degli altri. Il ciclo finisce quando i raggiunge la lunghezza.

## Slide 17: NUOVO draw_score: le tacche della Parte 2

`draw_score` è il ciclo che nella Parte 2 stava dentro `verm1_draw`, ora una funzione a sé: una piccola tacca per ogni punto. Usa `s0` come contatore, quindi lo salva all'inizio e lo ripristina alla fine.

## Slide 18: Resta uno stub

Dei quattro stub ne resta uno: `play_update`, che ancora non fa nulla. Il verme esiste in memoria e sullo schermo, e sta fermo.

## Slide 19: Eseguite: un verme che sta fermo

Eseguite e premete A: un verme di tre celle nella riga 12, con la testa più chiara a destra, e il cibo in una cella a caso. Ora guardate la memoria con il debugger. All'indirizzo di `body_x` i primi byte sono 03 04 05. Nella mappa, alla riga 12 per 40 più 3, ci sono tre byte a 01 in un mare di zeri. State guardando le due strutture della presentazione della lezione, l'anello e la mappa, riempite.

## Slide 20: MODIFICATO play_update: la vostra update della Parte 2

`play_update` è la vostra `verm1_update` della Parte 2 con un nome nuovo: i quattro test dei pulsanti e la regola dell'inversione a U. Una differenza: i pulsanti arrivano come argomento in `a0`, quindi non c'è alcuna chiamata per leggerli.

## Slide 21: MODIFICATO play_update: il timer

La fine di `play_update` è esattamente il timer della Parte 2: si somma la velocità, e quando si è accumulata una cella intera si chiama `step`.

## Slide 22: MODIFICATO step: tre registri da conservare

L'inizio di `step`. Tre registri devono conservare il valore attraverso le chiamate che seguono: `s0` e `s1` per la cella della nuova testa, `s2` per il risultato del test del cibo. Il frame salva quindi `ra` e tre registri `s`. La ricerca di `dx` e `dy` è quella della Parte 2.

## Slide 23: MODIFICATO step: dove sarà la testa?

Dove sarà la testa? La testa attuale è l'elemento `head_i` dell'anello: colonna e riga si caricano con `lbu`, si sommano `dx` e `dy`, e il risultato rientra ai bordi come nella Parte 2. La nuova cella ora sta in `s0` e `s1`. Non è stato scritto nulla: prima il programma deve guardare.

## Slide 24: MODIFICATO step: mangiare, o muovere la coda

Mangiare, o muovere la coda. Il comparatore della Parte 2 lascia il risultato in `s2`: zero se la nuova testa è sul cibo. Se il verme mangia, la lunghezza cresce di uno e la coda resta dov'è. Se no, la coda deve andarsene: il suo elemento è `head_i - length + 1`, e se ne caricano colonna e riga. Crescere e non muovere la coda sono la stessa cosa: è tutto qui il trucco di Snake.

## Slide 25: NUOVO step: liberare la coda, esaminare la testa

Ora la mappa. Il numero di un byte è riga per 40 più colonna, calcolato con `mul` e `add`. Prima si azzera il byte della coda; poi si esamina il byte della nuova testa. L'ordine conta: nello stesso passo la coda si sposta, quindi la testa può entrare nella cella che la coda ha appena lasciato. Se il byte vale 1 il verme si è morso: lo stato diventa OVER e il punteggio migliore viene aggiornato.

## Slide 26: NUOVO step: scrivere la nuova testa

Se la cella è libera, si scrive la nuova testa: un 1 nella mappa, `head_i` più 1 mascherato con 255, e colonna e riga nel nuovo elemento dell'anello. Poi, se `s2` vale zero, la ricompensa: un punto, nuovo cibo, un suono. Dopo una collisione la funzione salta tutto questo, così lo schermo mostra il verme com'era prima del passo fatale.

## Slide 27: MODIFICATO place_food: non sul verme

`place_food` viene corretta: estrae una cella a caso, guarda il suo byte nella mappa, e se la cella è occupata estrae di nuovo, finché non ne esce una libera. La colonna aspetta in `s0` mentre si chiede il secondo numero casuale. Il ciclo è breve: anche con il verme più lungo servono in media meno di due tentativi.

## Slide 28: Eseguite: Verm1, Parte 3

Eseguite: questo è Verm1, Parte 3. Il verme segue la testa e cresce a ogni pasto; girare contro il corpo fa finire la partita; A riporta al titolo, e A di nuovo avvia una nuova partita. Le due schermate vengono dal test automatico: sette celle e quattro tacche dopo quattro pasti, e la schermata di game over.

## Slide 29: Appendice: due funzioni che non sono cambiate

Due funzioni non sono cambiate rispetto alla Parte 2: `eat_sound` e `draw_cell`. Sono ristampate nelle due slide successive, con la scritta INVARIATO, così questa presentazione contiene l'intero programma. Il file completo è la somma delle slide con NUOVO e MODIFICATO, più queste due.

## Slide 30: INVARIATO eat_sound

`eat_sound`, come nella Parte 2: cinque argomenti e una chiamata a `prg32_audio_note`, per una nota di 60 millisecondi.

## Slide 31: INVARIATO draw_cell

`draw_cell`, come nella Parte 2: entrano colonna, riga e colore, le coordinate della cella sono convertite in pixel, e si disegna un rettangolo.

## Slide 32: Eseguite: che cosa dovreste vedere

Che cosa mostra il programma quando gira, e che cosa premere. Prevedete prima di eseguire: se lo schermo è diverso da questa immagine, la differenza è informazione. L'immagine è stata scritta dal test automatico, non disegnata a mano.

## Slide 33: Provatelo su PRG32-QT

La via più rapida: PRG32-QT sul vostro computer. Quattro passi, ciascuno con il suo comando. PRG32-QT si comporta come una scheda sulla porta 8080, ed è per questo che il comando di caricamento dice esp32c6. Con la modalità debug abilitata potete fermarvi su qualsiasi istruzione e leggere registri e memoria.

## Slide 34: Provatelo su QEMU

Lo stesso programma sull'emulatore. QEMU esegue il firmware vero su un chip emulato, quindi la cartuccia va compilata per l'architettura qemu. Caricate la cartuccia mentre QEMU è chiuso. Il firmware si apre sul menu Setup: scegliete Run Cartridge e lo slot. Ricordate che la tastiera è letta dal terminale, non dalla finestra con l'immagine.

## Slide 35: Provatelo sulla scheda

Lo stesso programma sul kit. Il firmware si scrive una volta, via USB; dopo, le cartucce viaggiano sul Wi-Fi. Il comando di caricamento è quello usato per PRG32-QT con l'indirizzo della scheda. È l'unico host che i test automatici non eseguono: provatelo, e riferite ciò che vedete.

## Slide 36: Se non funziona

I cinque sintomi più comuni, che cosa significa ciascuno, e che cosa fare. Leggete il messaggio prima di cambiare qualcosa: quasi sempre nomina la causa.

## Slide 37: Fatelo vostro

Quattro modifiche vostre. Muri: il verme muore al bordo invece di rientrare. Un verme più lungo all'inizio, magari in funzione del punteggio migliore. Veleno: una seconda cella, blu, che accorcia il verme di una cella. E il punteggio migliore mostrato come tacche nella schermata di game over. Ognuna tocca una o due funzioni. Prima tenete una copia della Parte 3 funzionante.
