# Lezione 20: I bus e la scheda video

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: il frame buffer; i controllori delle periferiche; bus e banda; la scheda video; GPU e GPGPU. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Slide 1: I bus e la scheda video

Con questa lezione il corso lascia il processore e si volge a ciò che lo circonda. L'argomento è il percorso di un'immagine, da un numero in memoria a un punto di luce sullo schermo. Lungo la strada si incontrano due idee generali, il controllore di periferica e il bus, insieme a una macchina specifica, la scheda video e il suo processore, la GPU. Il kit non ha alcuna scheda video, e a fini didattici questo è un vantaggio: ogni passo che una scheda nasconderebbe è eseguito da codice che si può leggere, e di cui si può misurare il costo.

## Slide 2: Che cosa saprete fare alla fine

Cinque risultati di apprendimento. Spiegare che cos'è un controllore di periferica e perché i dispositivi vanno sincronizzati con il processore. Caratterizzare un bus per larghezza, velocità e velocità di trasferimento. Descrivere la funzione di una scheda video: frame buffer, risoluzione, profondità di colore e interfaccia di uscita. Calcolare la memoria che un frame richiede e il tempo necessario a inviarlo su un bus. E spiegare che cosa fa una GPU e che cosa significa usarla per il calcolo di uso generale.

## Slide 3: Dispositivi di ingresso/uscita

Le periferiche servono all'interazione tra l'utente e il sistema. Godono di un'autonomia limitata, essendo controllate e coordinate dal processore. E operano in modo *asincrono*, al proprio ritmo, quindi servono meccanismi di sincronizzazione: per sapere quando un dato di ingresso è disponibile, e quando un dispositivo di uscita ha completato il suo compito. Il terminale, lo strumento di interazione più comune, consiste in realtà di due dispositivi indipendenti, una tastiera e un display; è il processore a copiare sul display ciò che arriva dalla tastiera.

## Slide 4: I controller

Una periferica non è mai collegata direttamente al processore: si interpone un *controllore*. Nello schema processore e memoria stanno sul bus, e così i controllori, ciascuno con il suo dispositivo dall'altro lato. Il controllore gestisce il dialogo con il dispositivo e presenta sul bus alcuni registri, che il processore legge e scrive come memoria, con l'I/O mappato in memoria della Lezione 15. Al completamento di un'operazione il controllore di norma solleva un'interruzione, come nella lezione precedente. La scheda video è il controllore del monitor.

## Slide 5: Che cosa caratterizza un bus

Un bus è un canale di comunicazione condiviso da più unità, e le sue caratteristiche determinano le prestazioni dell'intero sistema. La sua *larghezza* è il numero di bit del bus dati; la sua *velocità* è la frequenza a cui opera; il loro prodotto è la *velocità di trasferimento*. Un bus a 32 bit a 66 MHz porta 4 byte 66 milioni di volte al secondo, 264 megabyte al secondo. Un bus è anche uno standard: segnali, connettori e un protocollo su cui tutte le unità collegate concordano.

## Slide 6: I bus: vantaggi e svantaggi

Pregi e costi dei bus. I vantaggi: si aggiungono facilmente nuovi dispositivi; una periferica si può spostare su un altro calcolatore con lo stesso bus; un solo insieme di fili collega molte periferiche; il costo per byte trasferito è basso. Gli svantaggi: la banda del bus limita la velocità di trasferimento; la velocità massima diminuisce man mano che il bus si allunga e che vi si collegano più dispositivi; e, essendo condiviso, il bus porta un solo trasferimento alla volta, la limitazione già osservata per il bus comune della Lezione 14.

## Slide 7: I bus negli anni

Quarant'anni di bus in una tabella, da leggere per colonne. I primi bus, ISA, PCI, AGP per la sola scheda video, IDE e SCSI per i dischi, erano paralleli, con molti fili affiancati. I loro successori, PCI Express, Serial ATA e USB, sono seriali: pochi fili, velocità molto più alte. È la tendenza enunciata nella Lezione 14, ora documentata storicamente. L'ultima riga è il kit: SPI, I2C e I2S sono i piccoli bus seriali che collegano chip sulla stessa scheda.

## Slide 8: Che cosa fa una scheda video

La funzione di una scheda video è fornire al monitor l'informazione da mostrare. Traduce la rappresentazione dell'immagine prodotta dal processore in una forma che il monitor può rendere. Ha una memoria propria, la *memoria video*, che contiene il frame, il frame buffer. A ogni aggiornamento dello schermo la scheda legge quella memoria ed emette il segnale che codifica il colore di ogni pixel. Ha anche una propria capacità di elaborazione, che l'ultima parte della lezione esamina.

## Slide 9: Monitor analogici e digitali

Due generazioni di monitor. Un monitor a tubo catodico ha un ingresso analogico: la scheda deve convertire l'immagine digitale in segnali analogici con un componente chiamato RAMDAC, e lungo il cavo entrano rumore e distorsione. Un monitor a cristalli liquidi ha un ingresso digitale: la scheda adatta colori e risoluzione, e ogni pixel di uscita corrisponde esattamente a un pixel del pannello. La conversione in analogico, e i suoi difetti, scompaiono, un caso del vantaggio della rappresentazione digitale sostenuto nella Lezione 10.

## Slide 10: Uscite video

Le uscite, in ordine cronologico. VGA, analogica, per i monitor a tubo catodico. DVI, la prima uscita digitale, arrivata con i monitor LCD. HDMI, digitale, che porta anche l'audio. DisplayPort, digitale, che può viaggiare anche su connettori USB-C. L'ultima riga è il kit: il display si raggiunge su un bus SPI, e il chip sul modulo del display, un ILI9341, fa la parte dell'elettronica del monitor per un pannello di 320 per 240 pixel, con una sua memoria per il frame.

## Slide 11: Risoluzione: la dimensione della griglia di pixel

La *risoluzione* è la dimensione della griglia di pixel, colonne per righe. La tabella va da 320 per 200, 64.000 pixel, la risoluzione del Commodore 64 e dell'area di gioco di PRG32, al 4K, con più di otto milioni. La terza colonna dà il rapporto d'aspetto, dove il tradizionale 4:3 ha lasciato il posto al 16:9. La risoluzione determina la definizione dell'immagine, e anche il numero di pixel da memorizzare e trasmettere per ogni frame.

## Slide 12: Profondità di colore: bit per pixel

La *profondità di colore* è il numero di bit per pixel. Con 4 bit ci sono 16 colori; con 8 bit, 256, ciascun valore di solito un indice in una tabella di colori, la *palette*; con 16 bit, 65.536, nel familiare formato RGB565; con 24 bit, più di sedici milioni, con 256 livelli per ogni primario. La memoria richiesta da un frame è il numero di pixel per i byte per pixel. PRG32 combina le due righe centrali: un frame buffer a 8 bit di indici e una palette di 256 colori RGB565, scambiando libertà di colore con memoria.

## Slide 13: Seguire il pixel su PRG32

Il percorso di un pixel sul kit, in cinque stadi: il programma, il frame buffer in RAM, la palette che trasforma un indice in un colore, il bus SPI, il display. La tabella svolge l'aritmetica. Un frame a un byte per pixel occupa 64.000 byte; a due byte consumerebbe un quarto della RAM del chip. Sul bus ogni pixel viaggia come 16 bit, circa un milione di bit per frame, cioè 38 millisecondi a 27 MHz. Ne seguono due risposte ingegneristiche: un frame buffer indicizzato, e trasmettere solo ciò che è cambiato, che la Parte 4 di Verm1 realizza.

## Slide 14: Memoria e banda: la pressione sull'hardware video

La stessa aritmetica alla scala di un PC spiega la storia dell'hardware video. Una definizione maggiore richiede più memoria per frame, e il flusso di dati verso la scheda minaccia di saturare il bus. Le due risposte sono state più memoria sulla scheda stessa e un bus più largo o dedicato: prima AGP, oggi PCI Express. La cifra a destra rende la scala: uno schermo 4K a 60 frame al secondo equivale a circa un gigabyte e mezzo di pixel ogni secondo.

## Slide 15: L'unità di elaborazione grafica

Con la diffusione delle interfacce grafiche, il calcolo delle immagini ha assorbito una quota crescente del tempo del processore. Per alleggerire la CPU, le schede video hanno acquisito processori dedicati, le *unità di elaborazione grafica*, che accelerano le operazioni raster, come la copia di blocchi di pixel, e la grafica 3D: trasformazioni, texture, illuminazione. I programmi le raggiungono attraverso librerie, e un *driver di dispositivo* adatta il software alle primitive di ciascuna GPU. Il kit non ha GPU: un rettangolo è un ciclo di memorizzazioni eseguito dal core RISC-V, e il suo costo è direttamente osservabile.

## Slide 16: Calcolo generico su GPU

Una GPU applica in parallelo la stessa operazione a intere matrici di pixel, e nulla richiede che quei numeri siano pixel: il *GPGPU* è l'uso dei processori grafici per il calcolo generale. Una GPU contiene un numero molto grande di core semplici e si programma con modelli come CUDA e OpenCL. Simulazione scientifica, analisi dei dati e, soprattutto oggi, addestramento e inferenza delle reti neurali girano su GPU. L'immagine richiama la somma parallela della Lezione 04: una sola operazione applicata a molti dati insieme. La Lezione 24 torna su questo modello di calcolo.

## Slide 17: Verifica la comprensione: Quanta memoria serve a un frame di 640 x 480 pixel in True Color (24 bit)? / Un bus a 16 bit lavora a 50 MHz, un trasferimento per ciclo. Qual è la sua velocità di trasferimento?

Per la prima domanda: la memoria richiesta da un frame è il numero di pixel per i byte per pixel. Si calcolano prima i pixel, poi si ricorda quanti byte rappresentano 24 bit.

Per la seconda: la velocità di trasferimento è larghezza per frequenza, con la larghezza convertita in byte prima di moltiplicare.

## Slide 18: Verifica la comprensione: In un frame buffer indicizzato a 8 bit, il byte di un pixel contiene: / Che cos'è il GPGPU?

Per la prima domanda "indicizzato" è la parola chiave: il byte non descrive il colore ma indica dove trovarlo.

Per la seconda si espande l'acronimo: le sue prime due lettere stanno per "general-purpose", di uso generale.

## Slide 19: Glossario: inglese e italiano

Dieci termini. Una *peripheral* è una *periferica*; il suo *controller* conserva il nome inglese. *Bus width* e *transfer rate* sono *larghezza del bus* e *velocità di trasferimento*. *Colour depth* è *profondità di colore*. Una *palette* è una *tavolozza*, anche se i programmatori dicono palette. Un *device driver* è il software che adatta i programmi a uno specifico dispositivo.

## Slide 20: Conclusioni e letture

Cinque conclusioni. I dispositivi di ingresso/uscita sono una parte fondamentale di un calcolatore. Ciascuno è gestito da un controllore che lo interfaccia al bus. Un bus è caratterizzato da larghezza, velocità e velocità di trasferimento, e la sua banda è un vincolo che i progetti devono rispettare. Una scheda video mostra grafica e testo attraverso un frame buffer, una risoluzione, una profondità di colore e un'interfaccia di uscita. E i suoi processori, le GPU, si usano oggi per il calcolo ad alte prestazioni. La prossima lezione tratta gli altri dispositivi di ingresso e di uscita.
