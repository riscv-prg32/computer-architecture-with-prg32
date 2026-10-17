# Lezione 23: Verm1 sul Cartridge Store: il codice

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: impacchettare e pubblicare; la cartuccia portabile. DA UTILIZZARE OGGI: gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

Percorso. I risultati di oggi: (1) compilare cartucce portabili e verificarle; (2) impacchettare un bundle con i metadati e pubblicarlo in sicurezza. Si appoggia su: solo ciò che ha preparato la Lezione 01. Prossimo passo: Lezione 24, Oltre un solo core: RISC-V superscalare, HPC, GPU e FPGA.

Il filo della lezione: Un gioco è finito quando qualcun altro può eseguirlo: una cartuccia portabile, metadati onesti, un bundle provato su un altro computer e un token tenuto segreto. Prossimo passo: macchine più veloci di un solo core.

## Slide 1: Verm1 sul Cartridge Store: il codice

Questa è la presentazione del codice della Lezione 23. Mentre la presentazione della lezione sviluppa i concetti, questa raccoglie tutto ciò che si scrive e si esegue: ogni listato con il suo commento, il programma completo della lezione, il risultato che deve produrre, e la procedura per provarlo su ciascuno dei tre host. Le due presentazioni vanno lette insieme: i concetti spiegano il codice, e il codice dà ai concetti una conseguenza osservabile.

## Slide 2: In questa presentazione

Il contenuto della presentazione, nell'ordine delle slide. Il programma della lezione è un file sorgente completo, che si può compilare ed eseguire così com'è. Il percorso consigliato è eseguirlo per primo, osservarne il comportamento, e poi tornare ai singoli listati per capire come ciascuna parte contribuisce a quel comportamento. tools/tests/verm1_store.py compila le due cartucce, allega i metadati e impacchetta il bundle; non viene caricato niente.

## Slide 3: Compilare per il kit e per QEMU

Il comando di compilazione di ogni lezione, con un'opzione in più: `--architecture` nomina il target per cui si produce il file, prima `esp32c6` e poi `qemu`. I file prodotti seguono una regola di denominazione: il nome del gioco, un trattino, l'architettura. Il sorgente è identico per entrambi. La dimensione riportata dal compilatore merita di essere notata: l'intero gioco finito ammonta a circa sei kilobyte di codice.

## Slide 4: Controllo: è portabile?

`cartridge summary` stampa ciò che un file di cartuccia dichiara di sé. Una riga è decisiva: `import_model` deve valere `abi-table`. Significa che la cartuccia raggiunge le funzioni del runtime attraverso una tabella, non attraverso gli indirizzi fissi di una particolare immagine del firmware. Una cartuccia così è *portabile*: continua a funzionare quando il firmware viene aggiornato, perché l'interfaccia è la tabella, non gli indirizzi. È il principio dell'interfaccia stabile incontrato per la prima volta nella Lezione 01. Lo Store accetta cartucce portabili, e la verifica si ripete sul secondo file.

## Slide 5: manifest.json: chi è questo gioco?

Il manifesto è un file JSON che descrive il gioco; JSON è un formato di testo semplice per dati strutturati, in cui ogni valore si scrive dopo il suo nome, tra parentesi graffe. I suoi campi vanno letti uno per uno. `id` è un nome unico al mondo. `version` consiste di tre numeri. `title` è ciò che il giocatore legge. `summary` è una descrizione di una riga per lo scaffale, `description` un paragrafo. Seguono autori, licenza e tag. In fondo, `assets` nomina l'icona e `architectures` dice quale file di cartuccia serve quale target. Il file si crea con un editor di testo nella cartella del gioco.

## Slide 6: colophon.json: crediti e comandi

Il colophon è la pagina dei crediti della cartuccia; la parola viene dalla tipografia, dove indica la nota alla fine di un libro che registra chi l'ha fatto. Elenca ruoli e nomi, i comandi, cioè che cosa fa ogni ingresso per il giocatore, e i ringraziamenti, in cui resta citato il gioco di riferimento da cui lo studente è partito. Il nome segnaposto si sostituisce ovunque e si imposta la data.

## Slide 7: metadata.json, e attach

Si prepara prima `metadata.json`: una copia del manifesto senza le due voci `assets` e `architectures`, che riguardano il bundle e non una singola cartuccia. `store attach-metadata` scrive poi metadati, icona e colophon dentro la cartuccia, una volta per file, ciascuno con la sua architettura. Il programma stesso non viene toccato; l'informazione si accoda dopo di esso. Da quel momento una cartuccia copiata a mano dichiara ancora che cosa è e chi l'ha fatta.

## Slide 8: Rileggere

Di una scrittura non riletta non ci si deve mai fidare. `store inspect-metadata` stampa ciò che la cartuccia contiene: si verificano identificatore, titolo, versione e architettura, insieme a `trailer_present` uguale a true. La cartuccia si esegue poi ancora una volta e deve comportarsi esattamente come prima. Rileggere ciò che si è scritto è un'abitudine coltivata per tutto il corso, dalla vista della memoria del debugger a questo comando.

## Slide 9: Confezionare

`store pack-bundle` legge il manifesto, raccoglie i file che nomina e produce un file ZIP il cui nome porta la versione. Se un file manca o ha un nome sbagliato, lo strumento si ferma qui, sul computer dello studente, e non più tardi allo Store, così che gli errori si colgano dove correggerli costa meno. L'elenco che stampa mostra il manifesto, l'icona e le due cartucce: l'intero gioco, per due macchine, occupa circa sedici kilobyte.

## Slide 10: Eseguite: provate il bundle, non la vostra cartella

Si prova il bundle, non la cartella di lavoro. Lo si decomprime in una cartella vuota e lo si usa da lì: la cartuccia ESP32-C6 si importa in PRG32-QT per verificare che titolo, icona e crediti siano quelli dell'autore; l'altra si carica su QEMU e si gioca una partita; su un kit si prova il joystick vero. Si chiede poi a un collega di ripetere la procedura su un altro computer. Questo coglie l'errore classico di un bundle costruito prima dell'ultima correzione.

## Slide 11: Pubblicare

Tre azioni. L'autore accede allo Store e crea un token, lo tiene in una variabile d'ambiente della shell, e propone il bundle con `store publish-bundle`. Il token rappresenta il suo titolare: chi lo possiede pubblica a nome del titolare. È quindi un segreto, e non va né nel sorgente, né in alcun file sotto controllo di versione, né in una schermata. Un token perso o esposto per errore si revoca e si sostituisce. È l'unico passo non eseguito per queste slide, perché richiede un account personale.

## Slide 12: Eseguite: che cosa dovreste vedere

Il comportamento atteso del programma, e l'ingresso che richiede. Il risultato va previsto prima di eseguire: ogni differenza tra la previsione e lo schermo è un'informazione sul proprio modello della macchina, e conviene spiegarla prima di correggerla. L'immagine è stata prodotta dal test automatico, non disegnata a mano.

## Slide 13: Provatelo su PRG32-QT

La via più diretta: PRG32-QT sul proprio computer, in quattro passi, ciascuno con il suo comando. Per gli strumenti PRG32-QT si presenta come una scheda in ascolto sulla porta 8080, ed è per questo che il comando di caricamento nomina l'esp32c6. Con la modalità debug attiva si può fermare l'esecuzione su qualsiasi istruzione e ispezionare registri e memoria.

## Slide 14: Provatelo su QEMU

Lo stesso programma sull'emulatore. QEMU esegue il firmware vero su un chip emulato, quindi la cartuccia va compilata per l'architettura qemu e caricata mentre QEMU non è in esecuzione. Il firmware si avvia sul menu Setup, da cui si scelgono Run Cartridge e lo slot. La tastiera è letta dal terminale da cui QEMU è stato avviato, non dalla finestra che mostra l'immagine.

## Slide 15: Provatelo sulla scheda

Lo stesso programma sul kit fisico. Il firmware si scrive una volta, via USB; da quel momento le cartucce viaggiano sul Wi-Fi con lo stesso comando di caricamento usato per PRG32-QT, indirizzato alla scheda. È l'unico host non esercitato dai test automatici, quindi le osservazioni fatte sulla scheda sono particolarmente preziose e vanno riferite.

## Slide 16: Se non funziona

I cinque sintomi più frequenti, il loro significato e il rimedio. Il messaggio di errore va letto per intero prima di cambiare qualsiasi cosa: quasi sempre nomina la causa. Quando si chiede aiuto, vanno riportati alla lettera il comando e il messaggio completo.

## Slide 17: La vostra release

Il rilascio. Lo studente sceglie un identificatore e un titolo, scrive il manifesto e il colophon della sua variante, e disegna l'icona. Poi si compila la cartuccia, si allegano i metadati, si ispeziona e si impacchetta, e si completa la lista di controllo con un collega nel ruolo di revisore. Il bundle è il prodotto consegnato del progetto. La pubblicazione vera e propria è facoltativa e personale: chi desidera che il proprio gioco stia sullo scaffale lo pubblica e ne condivide il collegamento con la classe.
