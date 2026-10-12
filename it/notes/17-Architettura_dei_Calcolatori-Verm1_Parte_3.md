# Lezione 17: Verm1, parte 3: un corpo, regole e stati

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; `node notes.js` controlla che ogni slide abbia la sua nota.

## Slide 1: Verm1, parte 3: un corpo, regole e stati

Il terzo tutorial trasforma Verm1 in un vero gioco. Finora il verme era una sola cella e niente poteva andare storto. Oggi nel progetto entra la memoria: il verme prende un corpo che segue la testa e cresce, mordersi fa finire la partita, e il programma acquista una schermata del titolo e una di fine partita. La frase di Brooks in copertina è il motto del giorno: scegliete bene le strutture dati, e il codice quasi si scrive da solo. Ne incontrerete due, un anello e una mappa.

## Slide 2: Che cosa avrete alla fine

Cinque risultati. Un verme con un corpo che segue la testa e cresce di una cella a ogni pasto. Un gioco che si può perdere. Tre schermate, titolo, gioco e game over, collegate dal pulsante A. Il cibo che non compare mai sul verme. E un punteggio migliore, conservato finché la cartuccia resta in memoria. È il passo più grande del progetto: il file circa raddoppia di lunghezza, quindi seguite i passi ed eseguite il programma ogni volta che una slide lo dice.

## Slide 3: Che cosa prende la Parte 3 dalle lezioni

Le idee del blocco su stato e memoria, e dove compaiono oggi. La macchina a stati finiti della Lezione 13 diventa i tre stati del gioco. Il fronte, un cambiamento e non un livello, diventa «A premuto adesso e non un frame fa». Il registro che conserva un valore per il clock successivo diventa `prev_btn`. La memoria come vettore di byte diventa il corpo e la mappa del mondo. E la differenza tra ciò che resta nel file e ciò che vive in RAM diventa `.rodata`, `.data` e il punteggio migliore.

## Slide 4: Dove state andando

Le tre schermate che state per costruire: il titolo con il suo invito, il gioco con un verme di sette celle dopo quattro pasti, e il game over. Sono un solo programma in tre stati. Partite da una Parte 2 che gira; se la vostra non gira, copiate il file di riferimento della Parte 2.

## Slide 5: Il ciclo di lavoro, di nuovo

I soliti due comandi. Oggi il file cambia moltissimo, quindi non aspettate la fine per compilare: compilate ed eseguite dopo ogni slide intitolata «Eseguite». Se qualcosa si rompe, l'errore sta nelle righe aggiunte dopo l'ultima esecuzione.

## Slide 6: Il progetto, prima del codice

Prima di qualunque codice, il progetto: due strutture dati e un diagramma. Dedicateci tempo. Se l'anello, la mappa e i tre stati sono chiari, i listati che seguono sono una trascrizione.

## Slide 7: Il corpo è un anello di 256 elementi

Il corpo è memorizzato in due vettori di 256 byte, `body_x` e `body_y`: l'elemento k contiene la colonna e la riga di un segmento. Non si sposta mai nulla. Due numeri descrivono il verme: `head_i`, l'elemento della testa, e `length`, il numero di elementi in uso; la coda è l'elemento `head_i - length + 1`. Un passo scrive un elemento nuovo dopo la testa e fa avanzare `head_i`. Se il verme ha mangiato la coda resta; altrimenti avanza anche lei. Dopo l'elemento 255 viene l'elemento 0, cioè un AND con 255: il vettore è un *anello*.

## Slide 8: Il mondo è una mappa di 960 byte

Per sapere se la nuova testa tocca il corpo, il programma potrebbe confrontarla con ogni segmento: fino a 255 confronti a ogni passo. Tiene invece una mappa del mondo: un byte per ciascuna delle 960 celle, 1 se c'è un segmento e 0 se no. La cella in colonna c della riga r è il byte numero r per 40 più c. Un passo pone a 1 un byte e ne azzera uno, e il test di collisione diventa un solo load. È il classico scambio di memoria con tempo. Il prezzo: mappa e anello devono essere sempre d'accordo.

## Slide 9: Il gioco è una macchina a tre stati

Il diagramma degli stati del gioco, come nella Lezione 13: TITLE va a PLAY quando si preme A; PLAY va a OVER quando il verme si morde; OVER torna a TITLE quando si preme A. La tabella aggiunge l'azione di ogni transizione. Un dettaglio decide se la macchina funziona: «A premuto» significa giù adesso e su un frame fa, un fronte e non un livello. Altrimenti tenendo premuto A si attraverserebbero gli stati uno per frame.

## Slide 10: Passo 1: la memoria del gioco

Il passo 1 dichiara la memoria del gioco: nuove costanti, ciò che resta nel file della cartuccia, e ciò che vive in RAM. Ancora nulla gira in modo diverso.

## Slide 11: MODIFICATO Costanti: un pulsante, un colore, tre stati

Le nuove costanti sostituiscono quelle della Parte 2. `BODY` è un verde più scuro per i segmenti dietro la testa. `BTN_A` è la maschera del pulsante A, il bit 4 della parola dei pulsanti. I tre stati sono semplicemente i numeri 0, 1 e 2, con un nome. Le righe `.section` e `.global`, che chiudevano questo blocco, passano alla slide successiva.

## Slide 12: MODIFICATO .rodata: ciò che resta nel file

La sezione di sola lettura: tre stringhe, per il titolo, l'invito e il game over, e le due tabelle `dx` e `dy` della Parte 2. Il programma qui non scrive mai. Sulla scheda questa sezione potrebbe restare nella flash; è la parte della cartuccia che sopravvivrebbe a uno spegnimento.

## Slide 13: MODIFICATO .data: ciò che vive in RAM

La sezione delle variabili. `head_x` e `head_y` sono sparite: la testa ora vive nell'anello. La direttiva `.space` riserva un certo numero di byte senza dare un nome a ciascuno: 256 per `body_x`, 256 per `body_y`, 960 per la mappa. `best` contiene il punteggio migliore: sopravvive da una partita alla successiva, ma non a uno spegnimento, perché vive in RAM. Una cartuccia portabile non ha una memoria permanente propria: un limite onesto.

## Slide 14: Passo 2: tre stati

Il passo 2 costruisce prima la macchina a tre stati, con le funzioni che fanno il vero lavoro sostituite da funzioni vuote. Lo scheletro gira prima che dentro ci sia qualcosa.

## Slide 15: MODIFICATO init: si parte dal titolo

`verm1_init` ora fa una cosa sola: sceglie il primo stato, TITLE. Preparare la partita è compito di una funzione nuova, `new_game`, chiamata quando il giocatore preme A. Cancellate dal vostro file le vecchie `verm1_update`, `step` e `verm1_draw`: le prossime slide le sostituiscono. Tenete `place_food`, `eat_sound` e `draw_cell`.

## Slide 16: MODIFICATO update: i pulsanti, e i loro fronti

La prima metà della nuova `verm1_update` legge i pulsanti e ne calcola i fronti. `s0` contiene i pulsanti di questo frame; `prev_btn`, in memoria, quelli del frame precedente. L'espressione «adesso AND NOT prima» dà un 1 solo nelle posizioni in cui una pressione è appena cominciata, e il risultato va in `s1`. Poi si aggiorna `prev_btn`. È il rilevatore di fronte della Lezione 13: un registro che ritarda di un clock, e una porta AND con un ingresso invertito.

## Slide 17: MODIFICATO update: un ramo per stato

La seconda metà è la tabella delle transizioni, riga per riga. Lo stato si legge per primo, e decide chi guarda gli ingressi. In TITLE una nuova pressione di A chiama `new_game`. In OVER una nuova pressione di A memorizza TITLE. In PLAY si passano a `play_update` i pulsanti tenuti premuti, i livelli e non i fronti, perché la guida deve funzionare mentre un pulsante resta giù. Qui le etichette hanno un nome, `u_play`, `u_start`, `u_done`, perché con i numeri sarebbe difficile orientarsi.

## Slide 18: MODIFICATO draw: che cosa mostrare in ogni stato

`verm1_draw` mostra un'immagine diversa in ogni stato. La riga del titolo si disegna sempre. In TITLE compare solo l'invito PRESS A, centrato: 132 è la x che centra sette caratteri da 8 pixel. In PLAY e OVER la funzione disegna punteggio, verme e cibo. Notate che `draw` non modifica nulla: la sua uscita dipende solo dallo stato e dalla memoria, come in una macchina di Moore.

## Slide 19: MODIFICATO draw: il game over, e draw_text

La fine di `verm1_draw`: nello stato OVER si scrivono due parole sopra la scena. Una piccola funzione di servizio, `draw_text`, riempie i due argomenti di colore, bianco su nero, e lascia passare i primi tre, così ogni chiamata per disegnare testo richiede due righe in meno. Funzioni di servizio come questa rendono un programma più corto e più facile da modificare.

## Slide 20: Per ora: quattro funzioni che non fanno nulla

Quattro *stub*: funzioni che esistono solo di nome e ritornano subito, tranne `new_game`, che memorizza soltanto PLAY. Grazie a loro il programma si compila e la macchina si può provare prima che le sue parti siano scritte. È il metodo della prima lezione: si parte da funzioni che non fanno nulla, poi si aggiunge una cosa alla volta.

## Slide 21: Eseguite: una macchina con niente dentro

Eseguite. Vedete la riga del titolo e PRESS A. Premete A: l'invito scompare e nell'angolo in alto a sinistra compare una cella rossa, perché le variabili del cibo valgono ancora zero. Nulla si muove e la partita non può finire: PLAY non ha ancora regole. Nel debugger trovate la variabile `state` e guardatela passare da 0 a 1 quando premete A: la macchina funziona, ed è vuota.

## Slide 22: Passo 3: un verme in memoria

Il passo 3 mette un verme in memoria, in entrambe le strutture, e lo disegna. Ancora non si muove.

## Slide 23: NUOVO new_game: svuotare la mappa, posare il verme

La prima metà della vera `new_game`. Un ciclo pone a zero i 960 byte della mappa, una `sb` alla volta. Poi si posa il verme: tre segmenti nelle colonne 3, 4 e 5 della riga 12. Ogni segmento è scritto due volte: colonna e riga nell'anello, e un 1 nella mappa. L'espressione `grid+12*COLS` è calcolata dall'assemblatore. Poiché ogni elemento è un byte, l'indice si somma all'indirizzo base senza alcuno scorrimento.

## Slide 24: NUOVO new_game: le variabili, il cibo, PLAY

La seconda metà imposta le variabili: `head_i` vale 2 e `length` vale 3, che insieme descrivono il verme appena posato; direzione, timer e punteggio partono da zero; si piazza il primo cibo. L'ultima istruzione memorizza PLAY nello stato. L'ordine è voluto: la transizione è completa solo quando tutto è pronto.

## Slide 25: NUOVO draw_worm: percorrere l'anello all'indietro

`draw_worm` percorre l'anello all'indietro a partire dalla testa: il segmento numero i è l'elemento `head_i - i`, mascherato con 255. Colonna e riga si caricano con `lbu`, che legge un byte come numero senza segno, e si passano a `draw_cell`. Il segmento 0, la testa, è disegnato in un verde più chiaro degli altri. Il ciclo finisce quando i raggiunge la lunghezza.

## Slide 26: NUOVO draw_score: le tacche della Parte 2

`draw_score` è il ciclo che nella Parte 2 stava dentro `verm1_draw`, ora una funzione a sé: una piccola tacca per ogni punto. Usa `s0` come contatore, quindi lo salva all'inizio e lo ripristina alla fine.

## Slide 27: Resta uno stub

Dei quattro stub ne resta uno: `play_update`, che ancora non fa nulla. Il verme esiste in memoria e sullo schermo, e sta fermo.

## Slide 28: Eseguite: un verme che sta fermo

Eseguite e premete A: un verme di tre celle nella riga 12, con la testa più chiara a destra, e il cibo in una cella a caso. Ora guardate la memoria con il debugger. All'indirizzo di `body_x` i primi byte sono 03 04 05. Nella mappa, alla riga 12 per 40 più 3, ci sono tre byte a 01 in un mare di zeri. State guardando le due strutture della slide 7 e della slide 8, riempite.

## Slide 29: Passo 4: le regole

Il passo 4 scrive le regole. Un passo del verme ha tre fasi, e tutto sta nel loro ordine: decidere dove andrà la testa, guardare che cosa c'è, e solo allora scrivere.

## Slide 30: MODIFICATO play_update: la vostra update della Parte 2

`play_update` è la vostra `verm1_update` della Parte 2 con un nome nuovo: i quattro test dei pulsanti e la regola dell'inversione a U. Una differenza: i pulsanti arrivano come argomento in `a0`, quindi non c'è alcuna chiamata per leggerli.

## Slide 31: MODIFICATO play_update: il timer

La fine di `play_update` è esattamente il timer della Parte 2: si somma la velocità, e quando si è accumulata una cella intera si chiama `step`.

## Slide 32: MODIFICATO step: tre registri da conservare

L'inizio di `step`. Tre registri devono conservare il valore attraverso le chiamate che seguono: `s0` e `s1` per la cella della nuova testa, `s2` per il risultato del test del cibo. Il frame salva quindi `ra` e tre registri `s`. La ricerca di `dx` e `dy` è quella della Parte 2.

## Slide 33: MODIFICATO step: dove sarà la testa?

Dove sarà la testa? La testa attuale è l'elemento `head_i` dell'anello: colonna e riga si caricano con `lbu`, si sommano `dx` e `dy`, e il risultato rientra ai bordi come nella Parte 2. La nuova cella ora sta in `s0` e `s1`. Non è stato scritto nulla: prima il programma deve guardare.

## Slide 34: MODIFICATO step: mangiare, o muovere la coda

Mangiare, o muovere la coda. Il comparatore della Parte 2 lascia il risultato in `s2`: zero se la nuova testa è sul cibo. Se il verme mangia, la lunghezza cresce di uno e la coda resta dov'è. Se no, la coda deve andarsene: il suo elemento è `head_i - length + 1`, e se ne caricano colonna e riga. Crescere e non muovere la coda sono la stessa cosa: è tutto qui il trucco di Snake.

## Slide 35: NUOVO step: liberare la coda, esaminare la testa

Ora la mappa. Il numero di un byte è riga per 40 più colonna, calcolato con `mul` e `add`. Prima si azzera il byte della coda; poi si esamina il byte della nuova testa. L'ordine conta: nello stesso passo la coda si sposta, quindi la testa può entrare nella cella che la coda ha appena lasciato. Se il byte vale 1 il verme si è morso: lo stato diventa OVER e il punteggio migliore viene aggiornato.

## Slide 36: NUOVO step: scrivere la nuova testa

Se la cella è libera, si scrive la nuova testa: un 1 nella mappa, `head_i` più 1 mascherato con 255, e colonna e riga nel nuovo elemento dell'anello. Poi, se `s2` vale zero, la ricompensa: un punto, nuovo cibo, un suono. Dopo una collisione la funzione salta tutto questo, così lo schermo mostra il verme com'era prima del passo fatale.

## Slide 37: MODIFICATO place_food: non sul verme

`place_food` viene corretta: estrae una cella a caso, guarda il suo byte nella mappa, e se la cella è occupata estrae di nuovo, finché non ne esce una libera. La colonna aspetta in `s0` mentre si chiede il secondo numero casuale. Il ciclo è breve: anche con il verme più lungo servono in media meno di due tentativi.

## Slide 38: Eseguite: Verm1, Parte 3

Eseguite: questo è Verm1, Parte 3. Il verme segue la testa e cresce a ogni pasto; girare contro il corpo fa finire la partita; A riporta al titolo, e A di nuovo avvia una nuova partita. Le due schermate vengono dal test automatico: sette celle e quattro tacche dopo quattro pasti, e la schermata di game over.

## Slide 39: Passo 5: guardare la memoria muoversi

Il passo 5 usa il debugger per osservare le strutture dati al lavoro: l'anello che gira, il fronte di un pulsante, il byte che decide una collisione.

## Slide 40: Guardare l'anello girare

Mettete un breakpoint sulla prima istruzione di `step` e riprendete: il programma ora si ferma una volta per passo del verme. Aprite la memoria all'indirizzo di `body_x`: dopo l'iniziale 03 04 05 compare un byte nuovo a ogni passo. Girate verso il basso: `body_x` ripete la stessa colonna, mentre `body_y`, 256 byte più avanti, conta le righe. Mangiate, e confrontate `head_i` e `length` prima e dopo: sono cresciuti entrambi di uno. I vecchi byte non vengono mai cancellati: l'anello conserva la storia degli ultimi 256 passi.

## Slide 41: Cogliere il fronte del pulsante A

Il fronte del pulsante A, frame per frame. Finché A è su tutto vale zero. Nel frame in cui A scende, `s0` vale 0x10 e `prev_btn` vale ancora 0: l'AND con la negazione dà 0x10, e la transizione avviene. Nei frame successivi A è ancora giù, ma ora anche `prev_btn` vale 0x10, e il risultato è zero. Un fronte, una transizione, per quanto a lungo si tenga premuto il pulsante.

## Slide 42: Tre domande per il debugger

Tre domande a cui rispondere con il debugger. Dov'è `state`, e che cosa contiene mentre giocate e perdete? La mappa è coerente con l'anello: il byte alla riga per 40 più la colonna della testa contiene 1? Che cosa ha visto il passo fatale: alla `lbu` dopo la seconda `mul` in `step`, `t1` vale 1 una volta sola, al morso. L'ultima riga è un principio: un programma è giusto quando è giusta la sua memoria.

## Slide 43: Verifica la comprensione: head_i = 1 e length = 4. Quali elementi dell'anello contengono il verme?

Calcolate prima la coda: `head_i - length + 1` è 1 meno 4 più 1, cioè meno 2. Mascherato con 255 diventa 254. Da lì contate quattro elementi in avanti, rientrando dopo il 255.

## Slide 44: Verifica la comprensione: Quale byte di grid descrive la cella in colonna 7 della riga 3?

La formula della mappa: riga per 40 più colonna. Non scambiate le due: l'opzione con 283 è 7 per 40 più 3.

## Slide 45: Verifica la comprensione: Il giocatore tiene premuto A per due secondi sulla schermata del titolo. Che cosa accade?

Ragionate in termini di fronti. A è giù per molti frame, ma solo nel primo è «giù adesso e su un frame fa».

## Slide 46: Verifica la comprensione: Perché il byte della coda viene azzerato prima di esaminare quello della testa?

In un passo la coda lascia una cella e la testa ne occupa una. Se sono la stessa cella, quale delle due operazioni va fatta per prima perché la mossa sia lecita?

## Slide 47: Fatelo vostro

Quattro modifiche vostre. Muri: il verme muore al bordo invece di rientrare. Un verme più lungo all'inizio, magari in funzione del punteggio migliore. Veleno: una seconda cella, blu, che accorcia il verme di una cella. E il punteggio migliore mostrato come tacche nella schermata di game over. Ognuna tocca una o due funzioni. Prima tenete una copia della Parte 3 funzionante.

## Slide 48: Appendice: due funzioni che non sono cambiate

Due funzioni non sono cambiate rispetto alla Parte 2: `eat_sound` e `draw_cell`. Sono ristampate nelle due slide successive, con la scritta INVARIATO, così questa presentazione contiene l'intero programma. Il file completo è la somma delle slide con NUOVO e MODIFICATO, più queste due.

## Slide 49: INVARIATO eat_sound

`eat_sound`, come nella Parte 2: cinque argomenti e una chiamata a `prg32_audio_note`, per una nota di 60 millisecondi.

## Slide 50: INVARIATO draw_cell

`draw_cell`, come nella Parte 2: entrano colonna, riga e colore, le coordinate della cella sono convertite in pixel, e si disegna un rettangolo.

## Slide 51: Dove siamo, e che cosa viene dopo

Dove siete. Verm1 ora è un gioco, con uno scopo, un rischio, un inizio e una fine, e ne sapete spiegare ogni riga. È logica sequenziale e memoria scritte come programma: una macchina a tre stati, un anello di byte, una mappa. Tre cose sono ancora grezze: l'intero schermo viene ridisegnato a ogni frame, il punteggio è una fila di tacche, la velocità non cambia mai. Le prossime quattro lezioni aprono la macchina che esegue il vostro codice, e la Parte 4 finisce il gioco.
