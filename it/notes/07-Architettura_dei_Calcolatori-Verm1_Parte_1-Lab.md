# Lezione 07: Verm1, parte 1: una testa che attraversa il mondo: il codice

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: il progetto Verm1; contratto init/update/draw; un colore è un numero; gli array in memoria; .text, .rodata, .data; indirizzo, valore, load, store; perché si salva ra; shift come moltiplicazione; la virgola fissa; le pseudo-istruzioni; l'ordine little-endian. DA UTILIZZARE OGGI: gli strumenti di PRG32, il debugger di PRG32-QT (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: formati delle istruzioni (Lezione 19). Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

Percorso. I risultati di oggi: (1) costruire una cartuccia da un file vuoto: una griglia, un titolo e una testa che si muove; (2) mettere costanti e variabili nella sezione giusta, .rodata o .data; (3) controllare una velocità con un accumulatore in virgola fissa. Si appoggia su: contratto init/update/draw (Lezione 02); un colore è un numero (Lezione 04); gli array in memoria (Lezione 04); indirizzo, valore, load, store (Lezione 02); perché si salva ra (Lezione 02). Prossimo passo: Lezione 08, Elementi di algebra di Boole.

Ponte. Nella Lezione 02 il passo 2 salvava ra sullo stack prima delle sue chiamate, e lw t1, 0(t0) leggeva una parola all'indirizzo in t0. Oggi verm1_draw salva ra e verm1_update no, e ogni variabile di Verm1 si legge con la e lw. La Lezione 18 spiega lo stack e la convenzione di chiamata; la Lezione 19 nomina i modi di indirizzamento. Richiamo: Perché verm1_draw salva ra mentre verm1_update no?

Il filo della lezione: I numeri sono diventati posizioni, colori e una velocità: l'intero blocco sull'informazione, in un gioco che gira. Prossimo passo: la logica che permetterà al giocatore di guidarlo.

## Slide 1: Verm1, parte 1: una testa che attraversa il mondo: il codice

Questa è la presentazione del codice della Lezione 07. Mentre la presentazione della lezione sviluppa i concetti, questa raccoglie tutto ciò che si scrive e si esegue: ogni listato con il suo commento, il programma completo della lezione, il risultato che deve produrre, e la procedura per provarlo su ciascuno dei tre host. Le due presentazioni vanno lette insieme: i concetti spiegano il codice, e il codice dà ai concetti una conseguenza osservabile.

## Slide 2: In questa presentazione

Il contenuto della presentazione, nell'ordine delle slide. Il programma della lezione è un file sorgente completo, che si può compilare ed eseguire così com'è. Il percorso consigliato è eseguirlo per primo, osservarne il comportamento, e poi tornare ai singoli listati per capire come ciascuna parte contribuisce a quel comportamento. Il programma di riferimento è ~/arc12/verm1/verm1_part1.S; tools/tests/verm1_check.py lo compila e lo gioca con un giocatore programmato, e verm1_steps.py esegue i punti di controllo intermedi.

## Slide 3: Compilare ed eseguire

Si crea nella cartella home una cartella chiamata `verm1`, e in essa un solo file, `verm1.S`, che crescerà da una parte all'altra. Il primo comando compila la cartuccia; il secondo la invia a PRG32-QT, in esecuzione sullo stesso computer, e la avvia. Questi due comandi sono identici in ogni tutorial, ed è proprio questo il punto: il costo di provare un'idea deve essere trascurabile. Se `localhost` non risponde, si usa l'indirizzo mostrato sulla schermata *Setup* di PRG32-QT; in alternativa il file si può importare dal menu di PRG32-QT.

## Slide 4: Passo 1: tre funzioni che ritornano

Il passo 1 è lo scheletro della Lezione 02 con il prefisso `verm1`: tre etichette globali e tre funzioni che si limitano a ritornare. Lo si scrive, lo si compila e lo si esegue. Il risultato corretto è uno schermo nero, che dimostra che gli strumenti funzionano e che il firmware trova i tre punti di ingresso. Un errore di compilazione a questo punto indica un problema di installazione, non del programma, e va risolto prima di proseguire. L'ultimo richiamo enuncia la regola di metodo dell'intero progetto: aggiungere una cosa, eseguire, osservare; mai due cose insieme, così che ogni guasto abbia una sola causa candidata.

## Slide 5: Costanti: i colori e la griglia

Queste righe sostituiscono l'inizio dello scheletro. Ogni `.equ` lega un nome a un numero e non occupa memoria: l'assemblatore si limita a sostituire il valore dovunque compaia il nome. Si definiscono tre colori in RGB565. Poi la geometria: una cella misura 8 per 8 pixel, quindi i 320 pixel di larghezza contengono 40 colonne; gli 8 pixel in alto sono riservati al titolo, e i restanti 192 contengono 24 righe. `SPEED_Q8`, la velocità in virgola fissa, si usa nel passo 3. Costanti con un nome rendono il programma leggibile e i suoi parametri facili da cambiare in un solo punto.

## Slide 6: Variabili e una stringa

Questo blocco va alla fine del file. La sezione `.rodata` contiene ciò che non cambia mai: il titolo, una stringa terminata da un byte zero grazie a `.asciz`. La sezione `.data` contiene le variabili, una parola a 32 bit ciascuna: la colonna della testa, la sua riga e la frazione di passo accumulata finora. I valori iniziali scritti qui sono solo un punto di partenza; `init` li assegna di nuovo esplicitamente, per una ragione data nella prossima slide.

## Slide 7: init: la testa al suo posto

`verm1_init` mette la testa nella sua posizione di partenza. Per ogni variabile lo schema è identico: `la` carica l'indirizzo, `li` il valore, e `sw` memorizza il valore all'indirizzo. L'accumulatore `step_q8` si azzera memorizzando direttamente il registro `zero`. La funzione non chiama nulla, quindi è una *foglia* e non richiede stack frame. Perché assegnare valori che `.data` contiene già? Perché `init` può essere invocata di nuovo per ricominciare il gioco; il principio generale è di non fare mai affidamento sul contenuto precedente della memoria.

## Slide 8: draw: titolo e testa

`verm1_draw` fa tre chiamate: pulisce lo schermo, scrive il titolo, disegna la testa. Perciò salva `ra` in uno stack frame all'ingresso e lo ripristina all'uscita, come nella Lezione 02. La conversione da cella a pixel merita attenzione: la colonna si carica in `a0` e si fa scorrere a sinistra di 3; la riga si carica in `a1`, si fa scorrere e si sposta di `TOP`. Gli argomenti rimanenti sono larghezza, altezza e colore. Gli argomenti si passano da `a0` ad `a4`, nell'ordine in cui la funzione chiamata li attende.

## Slide 9: Eseguite: una testa sulla griglia

Compilare ed eseguire. In alto a sinistra deve comparire la parola VERM1, e un quadrato verde fermo nella colonna 5 della riga 12. La schermata della slide è stata presa dalla Parte 1 finita, quindi la sua testa sta più a destra; la differenza è attesa. Se il quadrato è nel posto sbagliato, le prime cose da controllare sono i due scorrimenti e la somma di `TOP`.

## Slide 10: update: accumulare, avanzare, rientrare

`verm1_update` si legge meglio in due metà. Prima il timer: si carica `step_q8`, si somma la velocità e si confronta la somma con 256. Se è minore, si salta all'etichetta 2, si memorizza l'accumulatore e si ritorna: in questo frame non si muove nulla. Altrimenti si sottrae 256, si conserva il resto e lo si memorizza. Poi il passo: si carica `head_x`, lo si incrementa e lo si confronta con `COLS`; se la colonna è arrivata a 40 torna a 0, e la testa rientra da sinistra. Le etichette `1:` e `2:` sono etichette locali, e `1f` significa "la prossima etichetta 1, cercando in avanti".

## Slide 11: Eseguite: la testa attraversa il mondo

Eseguire. La testa si muove verso destra a circa cinque celle al secondo, esce dalla colonna 39 e ricompare nella colonna 0. Si fa poi variare la velocità, prevedendo il risultato prima di ogni esecuzione: con 8 la testa è lenta; con 128 fa un passo ogni due frame; con 256 uno per frame. Un valore maggiore rivela un limite di questo programma: `update` fa al più un passo per frame, quindi le velocità oltre 256 saturano. Scoprire un limite del genere per previsione ed esperimento è esattamente l'abitudine che il corso vuole formare.

## Slide 12: Il listato: il vostro codice dopo l'assemblatore

Il debugger non mostra il sorgente ma ciò che l'assemblatore ne ha ricavato. I nomi simbolici sono spariti: le etichette sono diventate indirizzi, e `SPEED_Q8` è diventato il numero 40. Le pseudo-istruzioni sono state espanse: `la` in `auipc` seguita da `addi`, `li` in un `addi` da `zero`, `ret` in un salto tramite `ra`. Alcune istruzioni portano il prefisso `c.`: sono le codifiche compresse a 16 bit delle stesse operazioni, la C di RV32IMAC. Riconoscere il proprio programma in questo listato è un'abilità che si acquisisce con la pratica; i formati delle istruzioni che stanno dietro si studiano nella Lezione 19.

## Slide 13: Eseguite: che cosa dovreste vedere

Il comportamento atteso del programma, e l'ingresso che richiede. Il risultato va previsto prima di eseguire: ogni differenza tra la previsione e lo schermo è un'informazione sul proprio modello della macchina, e conviene spiegarla prima di correggerla. L'immagine è stata prodotta dal test automatico, non disegnata a mano.

## Slide 14: Provatelo su PRG32-QT

La via più diretta: PRG32-QT sul proprio computer, in quattro passi, ciascuno con il suo comando. Per gli strumenti PRG32-QT si presenta come una scheda in ascolto sulla porta 8080, ed è per questo che il comando di caricamento nomina l'esp32c6. Con la modalità debug attiva si può fermare l'esecuzione su qualsiasi istruzione e ispezionare registri e memoria.

## Slide 15: Provatelo su QEMU

Lo stesso programma sull'emulatore. QEMU esegue il firmware vero su un chip emulato, quindi la cartuccia va compilata per l'architettura qemu e caricata mentre QEMU non è in esecuzione. Il firmware si avvia sul menu Setup, da cui si scelgono Run Cartridge e lo slot. La tastiera è letta dal terminale da cui QEMU è stato avviato, non dalla finestra che mostra l'immagine.

## Slide 16: Provatelo sulla scheda

Lo stesso programma sul kit fisico. Il firmware si scrive una volta, via USB; da quel momento le cartucce viaggiano sul Wi-Fi con lo stesso comando di caricamento usato per PRG32-QT, indirizzato alla scheda. È l'unico host non esercitato dai test automatici, quindi le osservazioni fatte sulla scheda sono particolarmente preziose e vanno riferite.

## Slide 17: Se non funziona

I cinque sintomi più frequenti, il loro significato e il rimedio. Il messaggio di errore va letto per intero prima di cambiare qualsiasi cosa: quasi sempre nomina la causa. Quando si chiede aiuto, vanno riportati alla lettera il comando e il messaggio completo.

## Slide 18: Fatelo vostro

Quattro modifiche che rendono il programma dello studente, ciascuna di poche righe. Far muovere la testa verso sinistra: la somma diventa una sottrazione, e il bordo si rileva dal segno del risultato. Farla muovere verso il basso. Disegnare una seconda cella, più scura, dietro la testa. Scrivere il proprio nome accanto al titolo, in un colore calcolato a mano. Prima di sperimentare va conservata una copia della Parte 1 funzionante, perché la Parte 2 riparte da essa.
