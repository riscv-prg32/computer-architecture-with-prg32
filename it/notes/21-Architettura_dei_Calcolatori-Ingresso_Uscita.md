# Lezione 21: Ingresso e uscita

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: polling, interruzioni, DMA; display CRT e LCD; tastiera e mouse; le stampanti. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

Percorso. I risultati di oggi: (1) descrivere come funzionano display, tastiere e stampanti; (2) confrontare il polling con le interruzioni per leggere un dispositivo. Si appoggia su: solo ciò che ha preparato la Lezione 01. Prossimo passo: Lezione 22, Verm1, parte 4: il gioco finito.

Il filo della lezione: Leggere il joystick una volta per frame è polling: semplice, e cieco tra due letture. Prossimo passo: il gioco finito.

## Slide 1: Ingresso e uscita

Questa lezione riguarda il confine tra la macchina e il mondo: i dispositivi attraverso cui l'informazione entra ed esce. Mostra come si forma un'immagine su uno schermo, che cosa accade tra un tasto e il processore, che cosa comunica un mouse, e come funziona una stampante laser. Il filo conduttore è che ciascuno di questi dispositivi è internamente composto da macchine già progettate in questo corso, encoder, contatori, registri a scorrimento e controllori. La lezione comincia e finisce sul kit, con il dispositivo usato dalla prima sessione di laboratorio: un pulsante.

## Slide 2: Che cosa saprete fare alla fine

Cinque risultati di apprendimento. Descrivere come si forma un'immagine su un tubo catodico e su un display a cristalli liquidi, e che cosa aggiunge una matrice attiva. Spiegare il percorso della pressione di un tasto: matrice, encoder, registro a scorrimento, interfaccia seriale. Dire che cosa invia un mouse al calcolatore e con quale frequenza. Descrivere le fasi della stampa laser. E spiegare come il kit legge il suo joystick, confrontando tre tecniche: polling, interruzioni e accesso diretto alla memoria.

## Slide 3: Il video: un'introduzione

Un display grafico è una matrice di punti, i *pixel*, ciascuno acceso con una propria intensità; un'immagine si compone accendendo e spegnendo i pixel. I primi display mostravano solo caratteri, in bianco e nero. La densità dei pixel determina la risoluzione, e i bit per pixel il numero di colori, da 256 a sedici milioni e oltre. La dimensione di un display è la lunghezza della sua diagonale, in pollici. Il display del kit misura 2,8 pollici, con 320 per 240 pixel.

## Slide 4: Il tubo a raggi catodici: una breve storia

Il tubo a raggi catodici ha una storia di più di un secolo. Nacque come strumento di laboratorio con Crookes negli anni Settanta dell'Ottocento; Braun ne fece un oscilloscopio nel 1897, la sua prima applicazione pratica; Rosing nel 1907 lo usò per mostrare forme a partire da un segnale ricevuto, l'origine della televisione; e nel 1934 il primo televisore con un tubo catodico arrivò sul mercato. Dagli anni Settanta agli anni Novanta fu il display di ogni terminale e personal computer.

## Slide 5: Come funziona un CRT

Il funzionamento di un tubo catodico. Un catodo, riscaldato fino all'incandescenza, emette elettroni. Un'alta tensione tra catodo e anodo li accelera in un fascio, che altri campi mettono a fuoco. Campi magnetici o elettrici deflettono il fascio, che colpisce un punto dello schermo; la superficie interna è rivestita di fosfori, e il punto emette luce. Spazzando il fascio riga per riga, molte volte al secondo, l'intera immagine viene dipinta prima che l'occhio percepisca che i primi punti si sono spenti, contando sulla persistenza della visione.

## Slide 6: I display a cristalli liquidi

I display a cristalli liquidi hanno sostituito il tubo quasi ovunque, offrendo un'immagine migliore, meno ingombro, peso e consumo, e meno affaticamento visivo. I cristalli liquidi sono molecole organiche che scorrono come un liquido conservando però una struttura ordinata. Un campo elettrico ne altera l'orientamento, e con esso il modo in cui ruotano la polarizzazione della luce che li attraversa. L'immagine dell'ultima riga è calzante: un cristallo è una valvola per la luce, aperta e chiusa da una tensione.

## Slide 7: Dentro un pannello LCD

Un pannello contiene molte celle, ciascuna con i suoi contatti, poste tra due filtri polarizzatori ad assi perpendicolari, con una sorgente di luce dietro. Quando i cristalli di una cella non sono pilotati ruotano la luce, che allora attraversa il filtro anteriore; quando sono pilotati la luce viene bloccata. In uno schermo a colori ogni cella è suddivisa in tre, con filtri rosso, verde e blu: sono i sottopixel visibili nella fotografia, e i tre campi di un colore RGB, dalla Lezione 04, finiscono lì come tre tensioni.

## Slide 8: Pilotare le celle: dai segmenti alla matrice attiva

Come si pilotano milioni di celle? Una calcolatrice ha un contatto per segmento, un approccio impossibile alla scala di uno schermo. Una *matrice passiva* ha contatti per riga e per colonna: si pilota un solo pixel alla volta, e gli altri devono conservare da soli il loro stato, cosa che fanno male, producendo scie e diafonia. Una *matrice attiva* pone un transistor in ogni cella, in un film sottile sul vetro, e il transistor mantiene lo stato del suo pixel mentre gli altri vengono aggiornati. È il TFT, la tecnologia del display del kit; il transistor funge da memoria di un pixel, un'idea riconoscibile dalla Lezione 13.

## Slide 9: La tastiera

La tastiera deriva da quella della macchina per scrivere ed è il dispositivo principale per inserire caratteri. I suoi tasti si raggruppano in tasti alfanumerici, tasti speciali, frecce e tasti funzione. Un fatto, già incontrato nella lezione precedente, merita di essere ripetuto: tastiera e display non sono collegati tra loro. Quando una lettera digitata compare sullo schermo, è perché un programma ha letto un codice dalla tastiera e ha disegnato un carattere. Oggi le tastiere si collegano via USB o via radio.

## Slide 10: Il percorso della pressione di un tasto

Il percorso della pressione di un tasto, da sinistra a destra. I tasti sono interruttori disposti in righe e colonne, così che premere D chiuda un incrocio. Un *encoder* converte la combinazione di riga e colonna in un codice di n bit. Un *registro a scorrimento* converte quegli n bit paralleli in n bit seriali. Un'*interfaccia seriale*, per esempio un controllore USB, consegna il codice al bus di sistema e solleva un'interruzione. L'encoder è quello della Lezione 11 e il registro a scorrimento quello della Lezione 14: ogni blocco di questa slide è già stato progettato nel corso.

## Slide 11: Il mouse

Il mouse fu inventato negli anni Sessanta da Douglas Engelbart: una scatola di legno con due rotelle sotto e un cavo che usciva dal retro, come una coda. Le due rotelle misuravano il movimento lungo i due assi. Nel mouse meccanico una sfera fa girare due rulli, ciascuno collegato a un contatore. Nel mouse ottico una sorgente di luce e una minuscola telecamera osservano la superficie sottostante e ne misurano lo spostamento. In ogni caso il movimento viene convertito in due numeri.

## Slide 12: Che cosa invia un mouse

Che cosa trasmette un mouse. Ogni volta che si sposta di una distanza minima, circa un centesimo di pollice, invia tre byte: lo spostamento lungo x dall'ultimo rapporto, lo spostamento lungo y, e lo stato dei pulsanti. Invia spostamenti, non posizioni: è il programma a mantenere la posizione del puntatore accumulandoli. Internamente, come mostrato a destra, ci sono due contatori, un registro a scorrimento e un'interfaccia seriale. Il software che comunica con il dispositivo è il suo driver.

## Slide 13: La stampante

Una stampante è caratterizzata dalla sua velocità, in righe o pagine al minuto, e dalla sua risoluzione, in punti per pollice. Le tecnologie, in ordine storico: le stampanti a margherita e a catena, che battevano caratteri interi e sono ormai in disuso; le stampanti ad aghi, in cui degli aghi colpiscono un nastro inchiostrato; le stampanti a getto d'inchiostro, che proiettano goccioline minuscole; e le stampanti laser. Una stampante è essa stessa un piccolo calcolatore, con un proprio processore, una propria memoria e un proprio firmware.

## Slide 14: La stampante laser

La stampante laser deriva dalla fotocopiatrice. Un tamburo viene caricato a circa mille volt. Un fascio laser, deviato da uno specchio rotante, percorre il tamburo per la sua lunghezza, acceso e spento per disegnare una riga di punti, e i punti che colpisce perdono la loro carica. Il toner viene attratto dai punti rimasti carichi. Il tamburo viene premuto contro la carta e vi trasferisce il toner, che rulli riscaldati poi fissano. La pagina esiste prima come bitmap nella memoria della stampante, quindi la stampa è, in fondo, un altro frame buffer letto riga per riga.

## Slide 15: I dispositivi del kit PRG32

I dispositivi del kit in una tabella: per ciascuno, la direzione, il collegamento e le funzioni con cui una cartuccia lo usa. Joystick e pulsanti sono ingressi, un interruttore per piedino. Il display è un'uscita su un bus SPI. L'amplificatore con il suo altoparlante è un'uscita su un bus I2S. La radio Wi-Fi e la porta USB operano in entrambe le direzioni. Nessuna di queste connessioni è mai stata toccata direttamente da una cartuccia: il runtime le gestisce e offre funzioni, un'astrazione il cui valore questa lezione rende evidente.

## Slide 16: Tre modi di gestire un dispositivo

Tre modi di trattare un dispositivo. *Polling*: il programma chiede ripetutamente al dispositivo se ha qualcosa; semplice, e dispendioso quando non accade nulla. *Interruzioni*: il dispositivo chiede attenzione quando ne ha bisogno, come nella Lezione 19. *Accesso diretto alla memoria*: il dispositivo scambia da sé interi blocchi di dati con la memoria, e il processore viene avvisato solo al completamento. Sul kit sono all'opera tutti e tre: il joystick viene interrogato, il timer interrompe, e display e suono sono alimentati dal DMA. La scelta tra di essi bilancia semplicità, prontezza e tempo del processore.

## Slide 17: Verifica la comprensione: Che cosa fa il codificatore di un controller di tastiera? / In un LCD a colori, un pixel è fatto di:

Per la prima domanda si considera lo schema della pressione di un tasto: che cosa entra nell'encoder, e che cosa ne esce?

Per la seconda si ricorda la fotografia dei pixel ingranditi e si conta quanti elementi colorati formano un pixel.

## Slide 18: Verifica la comprensione: Perché un LCD a matrice passiva mostra scie dietro gli oggetti in movimento? / Un gioco PRG32 legge il joystick una volta per frame. Questa tecnica si chiama:

Per la prima domanda la risposta sta in ciò che manca a una matrice passiva: un elemento in ogni cella che ne conservi lo stato mentre le altre vengono pilotate.

Per la seconda la domanda è chi prende l'iniziativa, il programma o il dispositivo. Nel riscaldamento è il programma, una volta per frame.

## Slide 19: Glossario: inglese e italiano

Dieci termini. Un *cathode-ray tube* è un *tubo a raggi catodici*; la *backlight* è la *retroilluminazione*. Un *pointing device* è un qualsiasi dispositivo, come il mouse, che indica una posizione. Le stampanti *dot-matrix* e *ink-jet* sono *ad aghi* e *a getto d'inchiostro*. Il *polling* è l'*interrogazione ciclica*, anche se nella pratica prevale il termine inglese.

## Slide 20: Conclusioni e letture

Cinque conclusioni. I dispositivi di ingresso/uscita sono una parte fondamentale dei calcolatori. La tecnologia dei display è passata da un fascio di elettroni a un transistor dietro ogni pixel. Tastiera, mouse e stampante sono cambiati poco all'esterno, e all'interno consistono di encoder, contatori e registri a scorrimento. Un dispositivo raggiunge il processore attraverso un controllore e un bus, ed è servito con polling, interruzioni o DMA. E sul kit l'intera catena, da un interruttore a un pixel, si può seguire istruzione per istruzione. Segue l'ultima parte di Verm1.
