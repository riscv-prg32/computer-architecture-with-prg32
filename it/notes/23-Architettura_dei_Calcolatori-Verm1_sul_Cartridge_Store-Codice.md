# Lezione 23: Verm1 sul Cartridge Store: il codice

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: impacchettare e pubblicare; la cartuccia portabile. DA UTILIZZARE OGGI: gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Slide 1: Verm1 sul Cartridge Store: il codice

Questa è la presentazione del codice della Lezione 23. La presentazione della lezione contiene i concetti; questa contiene tutto ciò che si scrive e si esegue: i listati con la loro spiegazione, il programma completo, che cosa mostra, e il modo di provarlo su ciascuno dei tre host.

## Slide 2: In questa presentazione

Che cosa contiene la presentazione, nell'ordine delle slide. Il programma della lezione è un file che potete compilare ed eseguire così com'è: partite da lì, e tornate ai listati per capire ogni parte. tools/tests/verm1_store.py compila le due cartucce, allega i metadati e impacchetta il bundle; non viene caricato niente.

## Slide 3: Compilare per il kit e per QEMU

Il comando di compilazione di ogni lezione, con un'opzione in più: `--architecture` indica il target per cui viene prodotto il file, prima `esp32c6` e poi `qemu`. I file prodotti seguono una regola per i nomi: il nome del gioco, un trattino, l'architettura. Il sorgente è lo stesso per entrambi. Guardate la dimensione riportata dal builder: l'intero gioco finito è circa sei kilobyte di codice.

## Slide 4: Controllo: è portabile?

`cartridge summary` stampa ciò che un file di cartuccia dichiara di sé. Cercate una riga: `import_model` deve valere `abi-table`. Significa che la cartuccia raggiunge le funzioni del runtime attraverso una tabella, e non attraverso gli indirizzi fissi di una particolare immagine del firmware. Una cartuccia così è *portabile*: continua a funzionare quando il firmware viene aggiornato. Lo Store accetta cartucce portabili. Ripetete il controllo sul secondo file.

## Slide 5: manifest.json: chi è questo gioco?

Il manifest è un file JSON che descrive il gioco. Leggete i campi uno per uno. `id` è un nome unico al mondo. `version` sono tre numeri. `title` è ciò che legge il giocatore. `summary` è una riga per lo scaffale e `description` un paragrafo. Poi autori, licenza ed etichette. Alla fine, `assets` nomina l'icona e `architectures` dice quale file di cartuccia serve quale target. Createlo con un editor di testo nella cartella del vostro gioco.

## Slide 6: colophon.json: crediti e comandi

Il colophon è la pagina dei crediti della cartuccia; la parola viene dalla tipografia, dove indica la nota in fondo a un libro che dice chi l'ha realizzato. Elenca ruoli e nomi, i comandi, cioè che cosa fa ogni ingresso per il giocatore, e i ringraziamenti, dove resta citato il gioco di riferimento da cui siete partiti. Sostituite ovunque il nome segnaposto e impostate la data.

## Slide 7: metadata.json, e attach

Prima preparate `metadata.json`: una copia del manifest senza le due voci `assets` e `architectures`, che riguardano il bundle e non la singola cartuccia. Poi `store attach-metadata` scrive metadati, icona e colophon dentro la cartuccia: una volta per file, ciascuno con la sua architettura. Il programma non viene toccato; le informazioni vengono aggiunte in coda. Da questo momento una cartuccia copiata a mano dice ancora che cos'è e chi l'ha fatta.

## Slide 8: Rileggere

Mai fidarsi di una scrittura che non si è riletta. `store inspect-metadata` stampa ciò che c'è dentro la cartuccia: controllate id, titolo, versione e architettura, e che `trailer_present` valga true. Poi eseguite ancora una volta la cartuccia: deve funzionare esattamente come prima. Rileggere ciò che si è scritto è l'abitudine di tutto il corso, dalla vista della memoria nel debugger a questo comando.

## Slide 9: Confezionare

`store pack-bundle` legge il manifest, raccoglie i file che nomina e produce un file ZIP il cui nome porta la versione. Se un file manca o ha il nome sbagliato, lo strumento si ferma qui, sul vostro calcolatore, e non più tardi allo Store. Guardate l'elenco che stampa: il manifest, l'icona e le due cartucce. Il vostro intero gioco, per due macchine, è circa sedici kilobyte.

## Slide 10: Eseguite: provate il bundle, non la vostra cartella

Provate il bundle, non la vostra cartella. Estraetelo in una cartella vuota e lavorate da lì: importate in PRG32-QT la cartuccia per ESP32-C6 e verificate che titolo, icona e crediti siano i vostri; caricate l'altra su QEMU e giocate una partita; se avete un kit, provatela con il joystick vero. Poi chiedete a un collega di fare lo stesso su un altro calcolatore. Così si intercetta l'errore classico: un bundle costruito prima dell'ultima correzione.

## Slide 11: Pubblicare

Tre azioni. Accedete allo Store e create un token. Tenetelo in una variabile d'ambiente della vostra shell. Poi inviate il bundle con `store publish-bundle`. Il token siete voi: chi lo possiede pubblica a vostro nome. Quindi è un segreto: non va nel sorgente, né in un file sotto controllo di versione, né in una schermata. Se lo perdete o lo mostrate per errore, revocatelo e createne uno nuovo.

## Slide 12: Eseguite: che cosa dovreste vedere

Che cosa mostra il programma quando gira, e che cosa premere. Prevedete prima di eseguire: se lo schermo è diverso da questa immagine, la differenza è informazione. L'immagine è stata scritta dal test automatico, non disegnata a mano.

## Slide 13: Provatelo su PRG32-QT

La via più rapida: PRG32-QT sul vostro computer. Quattro passi, ciascuno con il suo comando. PRG32-QT si comporta come una scheda sulla porta 8080, ed è per questo che il comando di caricamento dice esp32c6. Con la modalità debug abilitata potete fermarvi su qualsiasi istruzione e leggere registri e memoria.

## Slide 14: Provatelo su QEMU

Lo stesso programma sull'emulatore. QEMU esegue il firmware vero su un chip emulato, quindi la cartuccia va compilata per l'architettura qemu. Caricate la cartuccia mentre QEMU è chiuso. Il firmware si apre sul menu Setup: scegliete Run Cartridge e lo slot. Ricordate che la tastiera è letta dal terminale, non dalla finestra con l'immagine.

## Slide 15: Provatelo sulla scheda

Lo stesso programma sul kit. Il firmware si scrive una volta, via USB; dopo, le cartucce viaggiano sul Wi-Fi. Il comando di caricamento è quello usato per PRG32-QT con l'indirizzo della scheda. È l'unico host che i test automatici non eseguono: provatelo, e riferite ciò che vedete.

## Slide 16: Se non funziona

I cinque sintomi più comuni, che cosa significa ciascuno, e che cosa fare. Leggete il messaggio prima di cambiare qualcosa: quasi sempre nomina la causa.

## Slide 17: La vostra release

La vostra release. Scegliete un id e un titolo, scrivete il manifest e il colophon della vostra variante, disegnate la vostra icona. Poi compilate, allegate, ispezionate e confezionate, e ripassate la lista di controllo con un collega come revisore. Il bundle è il prodotto da consegnare per il progetto. La pubblicazione è facoltativa e personale: se volete il vostro gioco sullo scaffale, pubblicatelo e mandate il link alla classe.
