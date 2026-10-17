# Lezione 02, primo contatto con l'assembly: guida per il docente

La prima volta che la maggior parte degli studenti incontra un programma. La lezione tiene all'inizio un programma che
gira e divide il resto in brevi cicli: **osservare, prevedere, spiegare un concetto, eseguire o tracciare, verificare,
collegare**. I numeri di slide sono quelli della presentazione della lezione (quella del codice è indicata con *Lab*).

## Il contratto di apprendimento (slide 2)

**Prerequisiti:** solo la Lezione 01: che cos'è un programma, il terminale, PRG32-QT funzionante.

**Risultati, ciascuno con la sua verifica:**

| Risultato | Verifica |
| --- | --- |
| 1. Compilare ed eseguire una cartuccia, e dire quando il runtime chiama `init`, `update` e `draw` | punto di controllo 1 (slide 8; prova CP02.1) |
| 2. Leggere una riga di assembly: etichetta, istruzione, operandi, commento | biglietto d'uscita, domanda 1 (A02.1) |
| 3. Distinguere un indirizzo da un valore, e tracciare che cosa lasciano `la`, `lw`, `addi` e `sw` | punto di controllo 2 (slide 14; prova CP02.2) e la domanda su `la`/`lw` |

**Usati oggi, da non capire ancora** (la slide 15 li elenca con la loro lezione): esadecimale e binario in profondità
(04, 05), lo stack frame che salva `ra` (18), la convenzione di chiamata (18), la codifica di un'istruzione (19), la
maschera `andi 255` (08), le pseudo-istruzioni oltre `li`, `la`, `mv`, `ret`.

## Concetto per concetto: che cosa si chiede oggi

| Concetto | Oggi lo studente deve | Stato |
| --- | --- | --- |
| contratto init / update / draw | dire quando ciascuna è chiamata | comprendere |
| registri; calcolo, trasferimento, salto | dire che cosa contiene un registro; quali istruzioni accedono alla memoria | comprendere |
| funzioni, chiamata e ritorno | dire che cosa fanno `call` e `ret`, dove vanno gli argomenti | comprendere |
| una riga di assembly | nominare etichetta, istruzione, operandi, commento, direttiva | comprendere |
| indirizzo e valore; `la`, `lw`, `addi`, `sw` | tracciarli | comprendere |
| la traccia a mano | completare una riga della traccia | comprendere |
| pseudo-istruzioni | sapere che `li` diventa `addi` | comprendere (leggero) |
| un'istruzione è un numero | dire che un programma abita in memoria come numeri | comprendere (leggero) |
| salvare `ra`, lo stack frame | copiare lo schema; sapere che lo spiega la Lezione 18 | utilizzare (Lab) |
| la convenzione di chiamata, i registri `s` | usare `a0`-`a7` per gli argomenti | utilizzare |
| esadecimale, binario | leggere `0x1F`, riconoscere `0xFF` | utilizzare |
| il debugger | mettere in pausa, avanzare, leggere un registro | utilizzare (Lab) |

## Piano di 90 minuti

| Min | Slide | Fare | Fermarsi e chiedere | Errore probabile |
| ---: | --- | --- | --- | --- |
| 0-5 | 1-2 | Eseguire il programma finito della lezione: HELLO PRG32 e la barra verde. Leggere il contratto. | "Che cosa pensate faccia crescere la barra?" | |
| 5-15 | 3 | Binario ed esadecimale: quanto basta per leggere 0x1F. | "Quanto vale 0x10?" | 0x10 = 10 |
| 15-30 | 4-7 | La macchina, i registri, le funzioni, il contratto. | | init gira a ogni frame |
| 30-35 | 8 | **Punto di controllo 1.** Un minuto da soli, uno con il vicino, poi alzata di mano. | "Chi ha scelto 60 per init? Perché?" | add legge la memoria |
| 35-45 | 9 | Come leggere una riga; poi il passo 1 e la compilazione (Lab). | "Quale parte di questa riga l'assemblatore ignora?" | il commento viene eseguito |
| 45-60 | 10-11 | Passi 2 e 3 (Lab), indirizzo o valore (slide 10). Indicare l'etichetta sul salvataggio di `ra`: *da utilizzare oggi, Lezione 18*. | "Dopo `la`, che cosa c'è in t0?" | t0 contiene 41 |
| 60-70 | 11-13 | Passo 4, le istruzioni usate, le pseudo-istruzioni, un'istruzione è un numero. | "`li` è un'istruzione vera?" | ogni parola esiste nell'hardware |
| 70-78 | 14 | **Punto di controllo 2.** Tre minuti sulle due righe con ?, poi rivelarle passo passo in PRG32-QT. | "Chi ha scritto 256 come larghezza?" | si dimentica la maschera |
| 78-85 | 15-16 | *Non ancora* (slide 15): dire ad alta voce che oggi nulla di tutto ciò è richiesto. La mappa di chiusura (slide 16). | "Quale riquadro spiega perché la barra ricomincia?" | |
| 85-90 | 17-20 | Biglietto d'uscita, da soli, su carta (domande nelle note dell'ultima slide e in `exit-tickets.md`). | | |

## Recuperare uno studente che non completa un passo

- **La compilazione fallisce.** Leggere insieme la prima riga che dice *error*; nove volte su dieci è ESP-IDF non attivo
  (Lezione 01) o un errore di battitura in un'etichetta. Confrontare con il file `labs/05-asm-first-contact/stepN_*.S` del passo.
- **Il programma si compila ma non mostra nulla.** Controllare il prefisso dei punti di ingresso (`first`) e le tre righe `.global`.
- **Lo studente si perde nella spiegazione.** Indicare il contratto (slide 2): oggi si chiedono solo tre cose. Fargli
  completare con un vicino la traccia del punto di controllo 2: è il risultato che conta di più.
- **Lo studente finisce presto.** Gli esercizi della presentazione, o la domanda: "che cosa cambierebbe se `counter` fosse in `.rodata`?"

## Fatti della toolchain a cui la spiegazione deve corrispondere

- `li t0, 42` è emessa come `addi t0, zero, 42`; `la` come `auipc` più `addi`; `ret` come `jalr zero, 0(ra)`.
- `addi t1, t1, 1` è la parola `0x00130313`.
- Il runtime chiama `first_init` una volta e `first_update`, `first_draw` una volta per frame; il prefisso si indica con
  `--entry-prefix first`. Questi fatti sono verificati da `tools/tests` (codifiche ed esecutore headless).
