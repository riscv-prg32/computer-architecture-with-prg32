# Lezione 20: I bus e la scheda video

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; `node notes.js` controlla che ogni slide abbia la sua nota.

## Slide 1: I bus e la scheda video

Con questa lezione il corso lascia il processore e si rivolge a ciò che lo circonda. L'argomento è il percorso di un'immagine: da un numero in memoria a un punto di luce sullo schermo. Lungo la strada incontrate due idee generali, il controller di una periferica e il bus, e una macchina specifica, la scheda video, con il suo processore, la GPU. Il kit non ha alcuna scheda video, ed è un vantaggio: ogni passaggio che una scheda nasconderebbe è svolto da codice che potete leggere.

## Slide 2: Che cosa saprete fare alla fine

Cinque obiettivi. Spiegare che cos'è il controller di una periferica e perché i dispositivi vanno sincronizzati con il processore. Caratterizzare un bus per larghezza, velocità e velocità di trasferimento. Descrivere il compito di una scheda video: frame buffer, risoluzione, profondità di colore e interfaccia di uscita. Calcolare quanta memoria serve a un frame e quanto tempo occorre per inviarlo lungo un bus. E spiegare che cosa fa una GPU e che cosa significa usarla per il calcolo generico.

## Slide 3: Riscaldamento sulla macchina

Il riscaldamento segue un singolo pixel, dalla chiamata che lo disegna al posto in cui viene memorizzato.

## Slide 4: Un pixel, per favore

Le prime quattro righe sono vostre: x in `a0`, y in `a1`, un colore in `a2`, e una chiamata a `prg32_gfx_pixel`. La seconda metà mostra, in linea di principio, che cosa ne fa il runtime: moltiplica y per 320, somma x, somma l'indirizzo del frame buffer, e vi memorizza un byte. Lo schermo è un array in memoria con un elemento per pixel, e disegnare un pixel è uno store. Non compare nulla finché il frame non viene inviato al display. Su un PC, conservare il frame e inviarlo sono il compito della scheda video.

## Slide 5: Periferiche e controller

Prima della scheda video, il caso generale: come una periferica qualunque è collegata al processore.

## Slide 6: Dispositivi di ingresso/uscita

Le periferiche servono all'interazione tra l'utente e il sistema. Hanno un'autonomia limitata: il processore le controlla e le coordina. E lavorano in modo *asincrono*, al proprio ritmo, quindi servono meccanismi di sincronizzazione: per sapere quando è disponibile un dato in ingresso, e quando un dispositivo di uscita ha finito. Il terminale, lo strumento di interazione più comune, è in realtà due dispositivi indipendenti, una tastiera e un video; è il processore a copiare sul video ciò che arriva dalla tastiera.

## Slide 7: I controller

Una periferica non è mai collegata direttamente al processore: in mezzo c'è un *controller*. Guardate lo schema: il processore e la memoria stanno sul bus, e così i controller; ogni controller ha il proprio dispositivo dall'altra parte. Il controller gestisce il dialogo con il dispositivo e presenta sul bus pochi registri, che il processore legge e scrive come memoria. Quando un'operazione termina, di solito alza un'interruzione, come nella lezione precedente. La scheda video è il controller del monitor.

## Slide 8: I bus

Tutte le unità dello schema condividono la stessa strada. Le prossime slide dicono che cos'è un bus, come si misura e perché diventa un collo di bottiglia.

## Slide 9: Che cosa caratterizza un bus

Un bus è un canale di comunicazione condiviso da più unità, e le sue caratteristiche decidono le prestazioni dell'intero sistema. La sua *larghezza* è il numero di bit del bus dati. La sua *velocità* è la frequenza a cui lavora. Il loro prodotto è la *velocità di trasferimento*: un bus a 32 bit a 66 MHz porta 4 byte 66 milioni di volte al secondo, 264 megabyte al secondo. Un bus è anche uno standard: segnali, connettori e un protocollo su cui tutte le unità concordano.

## Slide 10: I bus: vantaggi e svantaggi

Perché i bus, e che cosa costano. I vantaggi: si aggiungono facilmente nuovi dispositivi; una periferica può passare a un altro calcolatore con lo stesso bus; un solo insieme di fili collega molte periferiche; il costo per byte è basso. Gli svantaggi: la banda del bus limita la velocità di trasferimento; la velocità massima cala quando il bus si allunga e quando i dispositivi collegati aumentano; e, essendo condiviso, il bus porta un solo trasferimento alla volta.

## Slide 11: I bus negli anni

Quarant'anni di bus in una tabella. Leggetela per colonne. I primi bus, ISA, PCI, AGP per la sola scheda video, IDE e SCSI per i dischi, erano paralleli: molti fili affiancati. I loro successori, PCI Express, Serial ATA, USB, sono seriali: pochi fili, molto più veloci. È la lezione della Lezione 14. L'ultima riga è il kit: SPI, I2C e I2S sono i piccoli bus seriali che collegano i chip sulla stessa scheda.

## Slide 12: La scheda video

Ora la scheda video vera e propria: che cosa fa, come è collegata al monitor, e i due numeri che descrivono un'immagine, risoluzione e profondità di colore.

## Slide 13: Che cosa fa una scheda video

La funzione di una scheda video è inviare al monitor le informazioni da visualizzare. Traduce la rappresentazione dell'immagine prodotta dal processore in una forma che il monitor può mostrare. Ha una memoria propria, la *memoria video*, che conserva il frame: il frame buffer. Ogni volta che lo schermo viene ridisegnato, la scheda legge quella memoria e invia il segnale per il colore di ogni pixel. E ha una capacità di elaborazione propria, che l'ultima parte della lezione esamina.

## Slide 14: Monitor analogici e digitali

Due generazioni di monitor. Un monitor a tubo catodico ha un ingresso analogico: la scheda deve convertire l'immagine digitale in segnali analogici con un componente detto RAMDAC, e lungo il cavo entrano rumore e distorsione. Un monitor a cristalli liquidi ha un ingresso digitale: la scheda adatta colori e risoluzione, e ogni pixel dell'uscita corrisponde esattamente a un pixel dello schermo. La conversione in analogico, con i suoi difetti, scompare.

## Slide 15: Uscite video

Le uscite, in ordine di tempo. VGA, analogica, per i monitor a tubo catodico. DVI, la prima uscita digitale, arrivata con i monitor LCD. HDMI, digitale, che porta anche l'audio. DisplayPort, digitale, che viaggia anche sui connettori USB-C. L'ultima riga è il kit: il display si raggiunge attraverso un bus SPI, e il chip sul modulo del display, un ILI9341, fa la parte dell'elettronica del monitor per un pannello di 320 per 240 pixel.

## Slide 16: Risoluzione: la dimensione della griglia di pixel

La *risoluzione* è la dimensione della griglia di pixel, colonne per righe. La tabella va da 320 per 200, 64.000 pixel, la risoluzione del Commodore 64 e del viewport di PRG32, al 4K con più di otto milioni. La terza colonna è il rapporto d'aspetto: il tradizionale 4:3 ha lasciato il posto al 16:9. La risoluzione determina la definizione dell'immagine, e anche quanti pixel vanno memorizzati e inviati per ogni frame.

## Slide 17: Profondità di colore: bit per pixel

La *profondità di colore* è il numero di bit per pixel. Con 4 bit ci sono 16 colori; con 8 bit, 256, e ogni valore di solito è un indice in una tabella di colori, la *palette*; con 16 bit, 65.536, nel formato RGB565 che conoscete; con 24 bit, più di sedici milioni, 256 sfumature per ogni primario. La memoria per un frame è pixel per byte per pixel. PRG32 usa insieme le due righe centrali: un frame buffer a 8 bit di indici e una palette di 256 colori RGB565.

## Slide 18: Seguire il pixel su PRG32

Il percorso del pixel sul kit, in cinque blocchi: il vostro codice, il frame buffer in RAM, la palette che trasforma un indice in un colore, il bus SPI, il display. La tabella fa i conti. Un frame a un byte per pixel sono 64.000 byte; a due byte sarebbe un quarto della RAM del chip. Sul bus ogni pixel viaggia come 16 bit: circa un milione di bit per frame, 38 millisecondi a 27 MHz. Da qui le due risposte ingegneristiche: un frame buffer indicizzato, e inviare solo ciò che è cambiato.

## Slide 19: Memoria e banda: la pressione sull'hardware video

Gli stessi conti, alla scala di un PC, spiegano la storia dell'hardware video. Più definizione significa più memoria per ogni frame, e il flusso di dati verso la scheda rischia di saturare il bus. Le due risposte sono state più memoria sulla scheda stessa, e un bus più largo o dedicato: prima AGP, oggi PCI Express. La cifra a destra dà la scala: uno schermo 4K a 60 frame al secondo è circa un gigabyte e mezzo di pixel ogni secondo.

## Slide 20: GPU e GPGPU

L'ultima parte: il processore della scheda video, costruito per i pixel e oggi usato per molto altro.

## Slide 21: L'unità di elaborazione grafica

Con il diffondersi delle interfacce grafiche, calcolare immagini ha occupato una quota crescente del tempo di processore. Per alleggerire la CPU, le schede video hanno ricevuto processori dedicati: le *unità di elaborazione grafica*, GPU. Accelerano le operazioni raster, come la copia di blocchi di pixel, e la grafica 3D: trasformazioni, texture, illuminazione. I programmi le raggiungono tramite librerie, e un *driver di periferica* adatta il software alle primitive di ogni GPU. Sul kit non c'è una GPU: un rettangolo è un ciclo di store eseguito dal core RISC-V, e ne potete vedere il costo.

## Slide 22: Calcolo generico su GPU

Una GPU applica la stessa operazione, in parallelo, a intere matrici di pixel. Nulla obbliga quei numeri a essere pixel: il *GPGPU* è l'uso dei processori grafici per il calcolo generico. Una GPU ha un numero molto grande di core semplici, e si programma con modelli come CUDA e OpenCL. Simulazione scientifica, analisi dei dati e, oggi soprattutto, addestramento e uso delle reti neurali girano su GPU. La figura richiama la somma parallela della Lezione 04: la stessa operazione su molti dati insieme.

## Slide 23: Verifica la comprensione: Quanta memoria serve a un frame di 640 x 480 pixel in True Color (24 bit)?

La memoria per un frame è il numero di pixel per i byte per pixel. Prima calcolate i pixel, poi ricordate quanti byte sono 24 bit.

## Slide 24: Verifica la comprensione: Un bus a 16 bit lavora a 50 MHz, un trasferimento per ciclo. Qual è la sua velocità di trasferimento?

La velocità di trasferimento è larghezza per frequenza. Convertite la larghezza in byte prima di moltiplicare.

## Slide 25: Verifica la comprensione: In un frame buffer indicizzato a 8 bit, il byte di un pixel contiene:

«Indicizzato» è la parola chiave. Il byte non descrive il colore: dice dove trovarlo.

## Slide 26: Verifica la comprensione: Che cos'è il GPGPU?

Sciogliete l'acronimo: le prime due lettere stanno per «general-purpose».

## Slide 27: Esercizi: prima su carta, poi su PRG32

Cinque esercizi. Calcolate la memoria di un frame 4K in True Color e i byte al secondo a 60 frame. Calcolate quanto impiega il bus del display di PRG32 a inviare 20 righe. Disegnate una linea diagonale pixel per pixel. Riempite lo schermo una volta con una sola chiamata e una volta con 64.000 chiamate, e confrontate le frequenze dei frame. Infine cambiate a ogni frame una voce della palette: tutti i pixel che la usano cambiano insieme, senza essere ridisegnati.

## Slide 28: Glossario: inglese e italiano

Dieci termini. *Peripheral* è la periferica; il suo *controller* conserva il nome inglese. *Bus width* e *transfer rate* sono larghezza del bus e velocità di trasferimento. *Colour depth* è la profondità di colore. *Palette* è la tavolozza, anche se i programmatori dicono palette. Un *device driver* è il software che adatta i programmi a un dispositivo specifico.

## Slide 29: Conclusioni e letture

Cinque conclusioni. I dispositivi di ingresso/uscita sono una parte fondamentale di un calcolatore. Ciascuno è gestito da un controller che lo interfaccia al bus. Un bus è caratterizzato da larghezza, velocità e velocità di trasferimento, e la sua banda è un limite di cui il progetto deve tenere conto. Una scheda video visualizza grafica e testo: un frame buffer, una risoluzione, una profondità di colore, un'uscita. E i suoi processori, le GPU, si usano oggi per il calcolo ad alte prestazioni. La prossima lezione tratta gli altri dispositivi di ingresso e di uscita.
