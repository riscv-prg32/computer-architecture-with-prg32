# Lezione 18: Il processore

*Note delle slide della specifica che non sono in nessuna delle due presentazioni (decks/plan.js, drop): il loro contenuto è nel libro di testo.*

## In che cosa i processori reali differiscono dal modello

I processori reali differiscono dal modello in vari modi: più o meno registri generici, registri che in realtà sono locazioni di memoria, una sezione di ingresso/uscita che manca ed è delegata ad altri chip, un'unità aritmetica semplice estesa da chip dedicati. La colonna di destra dice come RISC-V sul kit risolve ciascun punto: trentadue registri in un banco, nessuna sezione di I/O, estensioni facoltative al posto di chip aggiuntivi. L'estensione M aggiunge moltiplicazione e divisione; l'estensione in virgola mobile sul kit non c'è.

## Parole o byte: la lunghezza delle parole di macchina

Quanto è lunga una parola di macchina? Nei processori *a parola* tutte le istruzioni hanno la stessa lunghezza, dimensionata sull'informazione più lunga: le istruzioni RISC-V sono tutte di 32 bit, o di 16 nella forma compressa. Nei processori *a carattere* la lunghezza varia a multipli di un byte: le istruzioni x86 vanno da 1 a 15 byte. Una lunghezza fissa spreca un po' di spazio ma rende semplice la decodifica, e questo conta per la velocità.

## Tipi di registri

I registri possono essere specializzati o generici. I registri specializzati richiedono istruzioni diverse per la stessa operazione su banchi diversi; quelli generici danno più flessibilità. Si possono organizzare come una piccola memoria indirizzabile, un banco in cui si seleziona il registro numero i, oppure come registri separati con un proprio nome. RISC-V sceglie un unico banco di trentadue registri, ciascuno selezionato da cinque bit dentro l'istruzione. I nomi `t0`, `a0`, `sp` sono soltanto convenzioni.

## L'unità aritmetico-logica

La ALU svolge le operazioni aritmetiche e logiche tra operandi: è la macchina combinatoria della Lezione 11, con due ingressi e un'uscita. Nelle architetture semplici sta interamente dentro il processore; in quelle complesse le operazioni più sofisticate sono delegate a unità separate. In RISC-V queste unità sono le estensioni: M per moltiplicazione e divisione, F e D per la virgola mobile.
