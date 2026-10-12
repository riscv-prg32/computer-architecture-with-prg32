# Lezione 23: Verm1 sul Cartridge Store

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; `node notes.js` controlla che ogni slide abbia la sua nota.

## Slide 1: Verm1 sul Cartridge Store

Il progetto finisce oggi, con il passo che trasforma un programma in un prodotto. Il vostro Verm1 gira sulla vostra scrivania; alla fine di questa lezione sarà un unico file che chiunque può installare, sul kit, su QEMU o su PRG32-QT, con un nome, un'icona e la vostra firma. La citazione, dal gruppo che costruì il primo Macintosh, dice che un lavoro è finito solo quando è stato consegnato.

## Slide 2: Che cosa avrete alla fine

Cinque risultati. Il vostro gioco compilato per due architetture dallo stesso sorgente. Un manifest che gli dà un'identità: id, titolo, versione, autori, licenza. Un'icona e un colophon con crediti e comandi. Un bundle, un solo file ZIP, controllato e pronto per il Cartridge Store. E un'idea chiara di che cosa succede dopo la pubblicazione, e di che cosa rispondete.

## Slide 3: Perché pubblicare?

Perché pubblicare? Un programma che gira solo sul calcolatore del suo autore è un esercizio; uno che altri possono installare è un prodotto. Pubblicare vi obbliga a rispondere a domande che un esercizio lascia saltare: come si chiama, chi l'ha fatto, su che cosa gira, che cosa possono farne gli altri. Il Cartridge Store è lo scaffale di PRG32, e ogni cartuccia che vi si trova è stata scritta da qualcuno che ha cominciato da dove avete cominciato voi.

## Slide 4: Dal sorgente allo scaffale

Il percorso dal sorgente allo scaffale in sei tappe: il vostro file sorgente; due cartucce, una per architettura; i metadati, cioè identità, icona e crediti; il bundle; la revisione di un redattore; lo Store. I primi quattro passi di oggi avvengono interamente sul vostro calcolatore. Solo il quinto parla con lo Store: fino ad allora nulla lascia la vostra macchina.

## Slide 5: Prima di confezionare: è finito?

Prima di confezionare, chiedetevi se il gioco è finito. Sei controlli, ciascuno con un metodo e uno strumento. Parte, si gioca e finisce: giocate tre partite intere. Nessun frame è in ritardo: guardate la telemetria. La memoria è coerente: mettete in pausa a caso e confrontate anello, mappa e schermo. Gira sulla seconda architettura, QEMU, e sul kit vero se ne avete uno. Ed è vostro: ha qualcosa che il riferimento non ha. Una cartuccia mai eseguita su un target non va pubblicata per quel target.

## Slide 6: Passo 1: un sorgente, due cartucce

Il primo passo: da un sorgente, due cartucce, e un controllo su ciò che è stato compilato.

## Slide 7: Compilare per il kit e per QEMU

Il comando di compilazione di ogni lezione, con un'opzione in più: `--architecture` indica il target per cui viene prodotto il file, prima `esp32c6` e poi `qemu`. I file prodotti seguono una regola per i nomi: il nome del gioco, un trattino, l'architettura. Il sorgente è lo stesso per entrambi. Guardate la dimensione riportata dal builder: l'intero gioco finito è circa sei kilobyte di codice.

## Slide 8: Controllo: è portabile?

`cartridge summary` stampa ciò che un file di cartuccia dichiara di sé. Cercate una riga: `import_model` deve valere `abi-table`. Significa che la cartuccia raggiunge le funzioni del runtime attraverso una tabella, e non attraverso gli indirizzi fissi di una particolare immagine del firmware. Una cartuccia così è *portabile*: continua a funzionare quando il firmware viene aggiornato. Lo Store accetta cartucce portabili. Ripetete il controllo sul secondo file.

## Slide 9: Passo 2: un'identità

Il secondo passo dà al gioco un'identità, con tre piccoli file che scrivete voi: un manifest, un'icona e un colophon.

## Slide 10: manifest.json: chi è questo gioco?

Il manifest è un file JSON che descrive il gioco. Leggete i campi uno per uno. `id` è un nome unico al mondo. `version` sono tre numeri. `title` è ciò che legge il giocatore. `summary` è una riga per lo scaffale e `description` un paragrafo. Poi autori, licenza ed etichette. Alla fine, `assets` nomina l'icona e `architectures` dice quale file di cartuccia serve quale target. Createlo con un editor di testo nella cartella del vostro gioco.

## Slide 11: I campi, e a che cosa vi impegnano

Ogni campo vi impegna a qualcosa. L'`id` è per consuetudine un nome di dominio rovesciato, e non cambia mai: metteteci il vostro nome, perché due studenti non possono pubblicare lo stesso. La `version` segue lo schema major, minor, patch, e una versione pubblicata si considera permanente: un errore si corregge con una nuova versione. Gli `authors` sono tutti quelli che hanno scritto il gioco. La `license` dice che cosa possono farne gli altri. I `tags` sono il modo in cui verrà trovato.

## Slide 12: Un'icona

L'icona è una piccola immagine PNG che rappresenta il gioco sullo scaffale. Quella di riferimento è di 64 per 64 pixel: un verme e un pezzo di cibo con i colori del gioco. La pixel art si addice a una macchina di questa risoluzione: disegnate in grande, cella per cella, con qualunque editor che salvi PNG. Salvatela come `icon.png` accanto al manifest. E disegnatela voi: un'immagine presa dal web è il lavoro di qualcun altro.

## Slide 13: colophon.json: crediti e comandi

Il colophon è la pagina dei crediti della cartuccia; la parola viene dalla tipografia, dove indica la nota in fondo a un libro che dice chi l'ha realizzato. Elenca ruoli e nomi, i comandi, cioè che cosa fa ogni ingresso per il giocatore, e i ringraziamenti, dove resta citato il gioco di riferimento da cui siete partiti. Sostituite ovunque il nome segnaposto e impostate la data.

## Slide 14: Un omaggio non è una copia

Un omaggio non è una copia. Verm1 è un omaggio a Snake: l'idea di un verme che cresce è vecchia quanto Blockade, del 1976, e appartiene a tutti. Il nome, il codice, l'icona e i suoni sono nostri. Le regole di un gioco non sono protette; codice, immagini, musica e nomi sì. Quindi, prima di pubblicare, chiedetevi di ogni pezzo: l'ho fatto io? Se no, la sua licenza mi permette di pubblicarlo, e ho citato l'autore? Sopra c'è il vostro nome: pubblicate solo ciò che firmereste.

## Slide 15: Passo 3: la cartuccia porta con sé i documenti

Il terzo passo scrive l'identità dentro ogni file di cartuccia, così che il file porti con sé i suoi documenti.

## Slide 16: metadata.json, e attach

Prima preparate `metadata.json`: una copia del manifest senza le due voci `assets` e `architectures`, che riguardano il bundle e non la singola cartuccia. Poi `store attach-metadata` scrive metadati, icona e colophon dentro la cartuccia: una volta per file, ciascuno con la sua architettura. Il programma non viene toccato; le informazioni vengono aggiunte in coda. Da questo momento una cartuccia copiata a mano dice ancora che cos'è e chi l'ha fatta.

## Slide 17: Rileggere

Mai fidarsi di una scrittura che non si è riletta. `store inspect-metadata` stampa ciò che c'è dentro la cartuccia: controllate id, titolo, versione e architettura, e che `trailer_present` valga true. Poi eseguite ancora una volta la cartuccia: deve funzionare esattamente come prima. Rileggere ciò che si è scritto è l'abitudine di tutto il corso, dalla vista della memoria nel debugger a questo comando.

## Slide 18: Passo 4: il bundle

Il quarto passo raccoglie tutto in un unico file: il bundle.

## Slide 19: Confezionare

`store pack-bundle` legge il manifest, raccoglie i file che nomina e produce un file ZIP il cui nome porta la versione. Se un file manca o ha il nome sbagliato, lo strumento si ferma qui, sul vostro calcolatore, e non più tardi allo Store. Guardate l'elenco che stampa: il manifest, l'icona e le due cartucce. Il vostro intero gioco, per due macchine, è circa sedici kilobyte.

## Slide 20: Eseguite: provate il bundle, non la vostra cartella

Provate il bundle, non la vostra cartella. Estraetelo in una cartella vuota e lavorate da lì: importate in PRG32-QT la cartuccia per ESP32-C6 e verificate che titolo, icona e crediti siano i vostri; caricate l'altra su QEMU e giocate una partita; se avete un kit, provatela con il joystick vero. Poi chiedete a un collega di fare lo stesso su un altro calcolatore. Così si intercetta l'errore classico: un bundle costruito prima dell'ultima correzione.

## Slide 21: Passo 5: la pubblicazione

Il quinto passo è l'unico che lascia il vostro calcolatore: la pubblicazione.

## Slide 22: Pubblicare

Tre azioni. Accedete allo Store e create un token. Tenetelo in una variabile d'ambiente della vostra shell. Poi inviate il bundle con `store publish-bundle`. Il token siete voi: chi lo possiede pubblica a vostro nome. Quindi è un segreto: non va nel sorgente, né in un file sotto controllo di versione, né in una schermata. Se lo perdete o lo mostrate per errore, revocatelo e createne uno nuovo.

## Slide 23: Che cosa succede dopo

Che cosa succede dopo, in quattro tappe. *In attesa*: il bundle è conservato come invio, e non è ancora sullo scaffale. *Revisione*: un redattore controlla che si installi, giri, sia descritto onestamente e non contenga nulla che non sia vostro. *Pubblicato*: il gioco compare nello Store per le architetture dichiarate. E se trovate un errore: correggetelo, portate la versione a 1.0.1, confezionate e inviate di nuovo; la versione 1.0.0 resta com'era.

## Slide 24: La lista di controllo per l'invio

La lista di controllo per l'invio, sette punti: giocato fino alla fine su ogni architettura; `abi-table` per ogni file; id unico e vostro, versione nuova, descrizioni oneste; autori, licenza e colophon completi; i metadati giusti dentro ogni cartuccia; il bundle provato su un altro calcolatore; il token in nessun file. Una lista di controllo non è burocrazia: è lo strumento con cui gli esperti evitano gli errori degli esperti.

## Slide 25: Verifica la comprensione: Avete pubblicato la versione 1.0.0 e trovato un errore. Che cosa fate?

Ricordate la regola sulle versioni: ciò che è stato pubblicato si considera permanente.

## Slide 26: Verifica la comprensione: Perché metadata.json non contiene la voce architectures?

Pensate a dove finiscono i metadati: dentro un file di cartuccia. Quante architetture ha un file di cartuccia?

## Slide 27: Verifica la comprensione: Dove va tenuto il token dello Store?

Un token è una credenziale, come una password. Quale dei quattro posti non è un file che viene condiviso?

## Slide 28: La vostra release

La vostra release. Scegliete un id e un titolo, scrivete il manifest e il colophon della vostra variante, disegnate la vostra icona. Poi compilate, allegate, ispezionate e confezionate, e ripassate la lista di controllo con un collega come revisore. Il bundle è il prodotto da consegnare per il progetto. La pubblicazione è facoltativa e personale: se volete il vostro gioco sullo scaffale, pubblicatelo e mandate il link alla classe.

## Slide 29: Che cosa avete costruito in questo corso

Che cosa avete costruito in questo corso. Un gioco di seicento righe di assembly, cresciuto da tre funzioni che si limitavano a ritornare. Con esso, ogni livello della macchina: bit e numeri, porte e tabelle, stato e memoria, il processore, lo schermo, i dispositivi. Un metodo: un passo eseguibile alla volta, e uno sguardo dentro ogni volta che qualcosa vi sorprende. E l'ultimo passo, che ne fa ingegneria: un prodotto con un nome, una versione e un autore. La prossima lezione guarda oltre il kit.
