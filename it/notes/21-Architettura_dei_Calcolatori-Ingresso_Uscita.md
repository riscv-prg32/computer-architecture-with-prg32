# Lezione 21: Ingresso e uscita

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

## Slide 1: Ingresso e uscita

Questa lezione riguarda il confine tra la macchina e il mondo: i dispositivi attraverso cui l'informazione entra ed esce. Vedrete come si forma un'immagine su uno schermo, che cosa succede tra un tasto e il processore, che cosa dice un mouse, come funziona una stampante laser. Il filo che li lega è che ciascuno di questi dispositivi, dentro, è fatto di macchine che avete già progettato. E la lezione comincia e finisce sul kit, con il dispositivo che usate dal primo laboratorio: un pulsante.

## Slide 2: Che cosa saprete fare alla fine

Cinque obiettivi. Descrivere come si forma un'immagine su un tubo a raggi catodici e su un display a cristalli liquidi, e che cosa aggiunge una matrice attiva. Spiegare il percorso della pressione di un tasto: matrice, codificatore, registro a scorrimento, interfaccia seriale. Dire che cosa invia un mouse al calcolatore e con quale frequenza. Descrivere le fasi della stampa laser. Spiegare come il kit legge il joystick, e confrontare tre tecniche: polling, interruzioni e accesso diretto alla memoria.

## Slide 3: Il video: un'introduzione

Un display grafico è una matrice di punti, i *pixel*, ciascuno acceso con la propria intensità; un'immagine si compone accendendo e spegnendo i pixel. I primi display mostravano solo caratteri, in bianco e nero. La densità dei pixel dà la risoluzione, i bit per pixel danno il numero di colori, da 256 a sedici milioni e oltre. La dimensione è la lunghezza della diagonale, in pollici. Il display del kit misura 2,8 pollici, con 320 per 240 pixel.

## Slide 4: Il tubo a raggi catodici: una breve storia

Il tubo a raggi catodici ha una storia di oltre un secolo. Nasce come strumento di laboratorio con Crookes, negli anni Settanta dell'Ottocento; Braun ne fa un oscilloscopio nel 1897, il suo primo uso pratico; Rosing nel 1907 lo usa per mostrare forme da un segnale ricevuto, la radice della televisione; nel 1934 arriva sul mercato il primo televisore con CRT. Dagli anni Settanta ai Novanta del Novecento è stato il display di ogni terminale e personal computer.

## Slide 5: Come funziona un CRT

Come funziona un CRT. Un catodo, riscaldato fino all'incandescenza, emette elettroni. Un'alta tensione tra catodo e anodo li accelera in un fascio, che altri campi mettono a fuoco. Campi magnetici o elettrici deflettono il fascio, che colpisce un punto dello schermo: la superficie interna è rivestita di fosforo, e il punto si illumina. Facendo scorrere il fascio riga per riga, molte volte al secondo, si dipinge l'intera immagine prima che l'occhio si accorga che i primi punti si sono spenti.

## Slide 6: I display a cristalli liquidi

I display a cristalli liquidi hanno sostituito il tubo quasi ovunque: immagine migliore, meno ingombro, peso e consumo, meno affaticamento per gli occhi. I cristalli liquidi sono molecole organiche che scorrono come un liquido ma conservano una struttura ordinata. Un campo elettrico ne cambia l'orientamento, e con esso il modo in cui ruotano la polarizzazione della luce che li attraversa. L'immagine utile è l'ultima riga della slide: un cristallo è una valvola per la luce, aperta e chiusa da una tensione.

## Slide 7: Dentro un pannello LCD

Dentro un pannello ci sono molte celle, ciascuna con i suoi contatti, poste tra due filtri polarizzatori con assi perpendicolari, e una luce dietro. Quando i cristalli di una cella non sono pilotati ruotano la luce, che quindi supera il filtro anteriore; quando sono pilotati la luce viene bloccata. In uno schermo a colori ogni cella è divisa in tre, con un filtro rosso, uno verde e uno blu: sono i sub-pixel della fotografia, e i tre campi di un colore RGB finiscono lì come tre tensioni.

## Slide 8: Pilotare le celle: dai segmenti alla matrice attiva

Come si pilotano milioni di celle? Una calcolatrice ha un contatto per segmento, cosa impossibile per uno schermo. Una *matrice passiva* ha contatti per riga e per colonna: si pilota un solo pixel alla volta, e gli altri devono ricordare da soli il proprio stato, cosa che fanno male; da qui scie e diafonia. Una *matrice attiva* mette un transistor in ogni cella, in un film sottile sul vetro: il transistor conserva lo stato del suo pixel mentre gli altri vengono aggiornati. È il TFT, la tecnologia del display del kit.

## Slide 9: La tastiera

La tastiera deriva da quella della macchina per scrivere ed è il principale dispositivo per immettere caratteri. I suoi tasti sono raggruppati: alfanumerici, speciali, frecce e funzioni. Ricordate un fatto, già incontrato nella lezione precedente: la tastiera e il video non sono collegati tra loro. Quando una lettera che battete compare sullo schermo, è perché un programma ha letto un codice dalla tastiera e ha disegnato un carattere. Oggi le tastiere si collegano via USB o via radio.

## Slide 10: Il percorso della pressione di un tasto

Il percorso della pressione di un tasto, da sinistra a destra. I tasti sono interruttori disposti in righe e colonne: premere D chiude un incrocio. Un *codificatore* trasforma la combinazione di riga e colonna in un codice di n bit. Un *registro a scorrimento* trasforma quegli n bit in parallelo in n bit in serie. Un'*interfaccia seriale*, per esempio un controller USB, consegna il codice al bus di sistema e alza un'interruzione. Il codificatore è quello della Lezione 11, il registro a scorrimento quello della Lezione 14: avete progettato ogni blocco di questa slide.

## Slide 11: Il mouse

Il mouse è stato inventato negli anni Sessanta da Douglas Engelbart: una scatola di legno con due ruote sotto e un filo che esce da dietro, come una coda. Le due ruote misuravano il movimento lungo i due assi. Nel mouse meccanico una pallina fa girare due rulli, ciascuno collegato a un contatore. Nel mouse ottico una luce e una minuscola telecamera osservano la superficie sottostante e misurano come si muove. In tutti e tre, il movimento diventa due numeri.

## Slide 12: Che cosa invia un mouse

Che cosa invia un mouse. Ogni volta che si sposta di una distanza minima, circa un centesimo di pollice, invia tre byte: lo spostamento lungo x dall'ultimo rapporto, lo spostamento lungo y, e lo stato dei pulsanti. Notate che invia spostamenti, non posizioni: è il programma a tenere la posizione del puntatore, sommando. Dentro, come a destra: due contatori, un registro a scorrimento, un'interfaccia seriale. Il software che parla con il dispositivo è il suo driver di periferica.

## Slide 13: La stampante

Una stampante si descrive con la sua velocità, in righe o pagine al minuto, e con la sua risoluzione, in punti per pollice. Le tecnologie, in ordine storico: le stampanti a margherita e a catena, che battevano caratteri interi e sono in disuso; ad aghi, in cui degli aghi colpiscono un nastro inchiostrato; a getto d'inchiostro, con minuscole gocce; laser. Una stampante è anche un piccolo calcolatore, con processore, memoria e firmware propri.

## Slide 14: La stampante laser

La stampante laser deriva dalla fotocopiatrice. Un tamburo viene caricato a circa mille volt. Un raggio laser, riflesso da uno specchio rotante, scandisce il tamburo per la sua lunghezza, acceso e spento per disegnare una riga di punti; i punti che colpisce perdono la carica. Il toner è attratto dai punti ancora carichi. Il tamburo viene premuto contro la carta e vi trasferisce il toner, che dei rulli riscaldati fissano. Seguite nella figura il percorso della carta. La pagina esiste prima come bitmap nella memoria della stampante.

## Slide 15: I dispositivi del kit PRG32

I dispositivi del kit in una tabella: per ciascuno, la direzione, il collegamento e le funzioni con cui una cartuccia lo usa. Il joystick e i pulsanti sono ingressi, un interruttore per piedino. Il display è un'uscita su un bus SPI. L'amplificatore con il suo altoparlante è un'uscita su un bus I2S. La radio Wi-Fi e la porta USB lavorano in entrambe le direzioni. Notate che non avete mai toccato direttamente nessuno di questi collegamenti: lo fa il runtime, e vi offre delle funzioni.

## Slide 16: Tre modi di gestire un dispositivo

Tre modi di gestire un dispositivo. *Polling*: il programma chiede al dispositivo, ancora e ancora, se ha qualcosa; semplice, e uno spreco quando non succede nulla. *Interruzioni*: il dispositivo chiede attenzione quando gli serve, come nella Lezione 19. *Accesso diretto alla memoria*, DMA: il dispositivo scambia da solo interi blocchi di dati con la memoria, e il processore viene soltanto avvisato quando ha finito. Sul kit sono all'opera tutti e tre: voi interrogate il joystick, il timer interrompe, il display e l'audio sono alimentati in DMA.

## Slide 17: Verifica la comprensione: Che cosa fa il codificatore di un controller di tastiera? / In un LCD a colori, un pixel è fatto di:

Pensate allo schema della pressione di un tasto: che cosa entra nel codificatore, e che cosa ne esce?

Ricordate la fotografia dei pixel sotto la lente: quanti elementi colorati compongono un pixel?

## Slide 18: Verifica la comprensione: Perché un LCD a matrice passiva mostra scie dietro gli oggetti in movimento? / Un gioco PRG32 legge il joystick una volta per frame. Questa tecnica si chiama:

La risposta sta in ciò che manca a una matrice passiva: qualcosa, in ogni cella, che ne conservi lo stato mentre si pilotano le altre.

Chi prende l'iniziativa, il programma o il dispositivo? Nel riscaldamento è il programma, una volta per frame.

## Slide 19: Glossario: inglese e italiano

Dieci termini. *Cathode-ray tube* è il tubo a raggi catodici; *backlight* è la retroilluminazione. Un *pointing device*, periferica di puntamento, è qualunque dispositivo che, come il mouse, indica una posizione. Le stampanti *dot-matrix* e *ink-jet* sono quelle ad aghi e a getto d'inchiostro. *Polling* è l'interrogazione ciclica, anche se la parola in uso è quella inglese.

## Slide 20: Conclusioni e letture

Cinque conclusioni. I dispositivi di ingresso/uscita sono una parte fondamentale dei calcolatori. La tecnologia dei display è passata da un fascio di elettroni a un transistor dietro ogni pixel. Tastiera, mouse e stampante sono cambiati poco fuori, e dentro sono fatti di codificatori, contatori e registri a scorrimento. Un dispositivo raggiunge il processore tramite un controller e un bus, ed è gestito con il polling, le interruzioni o il DMA. E sul kit l'intera catena, da un interruttore a un pixel, si può seguire istruzione per istruzione. Ora viene l'ultima parte di Verm1.
