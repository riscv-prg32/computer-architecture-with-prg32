# Lezione 19: Istruzioni e interruzioni

*Note delle slide della specifica che non sono in nessuna delle due presentazioni (decks/plan.js, drop): il loro contenuto è nel libro di testo.*

## Istruzioni di lunghezza fissa o variabile

Le istruzioni possono essere di lunghezza fissa o variabile. Con una lunghezza *fissa* ogni istruzione ha lo stesso numero di bit, la successiva è sempre a PC più una costante, e prelievo e decodifica sono semplici: è la scelta RISC. Con una lunghezza *variabile* il processore scopre quanto è lunga un'istruzione solo dopo averne decodificato la prima parte: i programmi sono più compatti, la decodifica più difficile; è la scelta CISC. RISC-V con l'estensione compressa mescola 16 e 32 bit, e i due bit più bassi li distinguono.

## Chi ha interrotto? Due soluzioni

Con più dispositivi, chi ha interrotto? Due soluzioni. Con l'*interrogazione ciclica* (polling) ogni dispositivo ha un registro di stato; la routine di servizio interroga i dispositivi in ordine di priorità e serve il primo che ha il bit a 1. È semplice, ma spreca tempo su dispositivi che non hanno chiesto nulla. Con le interruzioni *vettorizzate* la sorgente fornisce la propria identità insieme alla richiesta, e il processore salta direttamente alla routine corrispondente. È efficiente, e il numero di bit del vettore limita il numero di sorgenti.

## Priorità e annidamento

Le priorità, in due processori. Quando arriva una richiesta mentre se ne sta servendo un'altra serve una regola: si accettano solo richieste di priorità più alta. Il Motorola 68000 codifica il livello di una richiesta su tre linee e lo confronta con una maschera nel registro di stato; il livello 7 non si può mascherare. RISC-V delega le priorità a un controllore delle interruzioni con una soglia, e in partenza disabilita tutte le interruzioni durante un gestore. Servire un'interruzione dentro un'altra si chiama *annidamento*. Le ultime righe confrontano come si identifica la sorgente e come si ritorna.
