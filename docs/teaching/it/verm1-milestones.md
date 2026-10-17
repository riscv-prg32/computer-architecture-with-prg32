# Verm1: le quattro tappe

Verm1 (si legge "vermone") si costruisce in quattro parti, una dopo ogni blocco di quattro lezioni, e si pubblica nella
Lezione 23. Ogni parte parte dal file finito della precedente e si chiude con un gioco che gira. Questa guida dà, per
ogni parte, che cosa sapere prima di cominciare, che cosa lo studente deve vedere a ogni punto di controllo, gli errori
più frequenti e come recuperare, i concetti coinvolti (id di `tools/concepts/registry.json`) e una breve riflessione finale.

**I programmi di riferimento** sono `verm1/verm1_partN.S` (nel materiale del corso, `~/arc12/verm1/`). I punti di
controllo qui sotto sono le slide "Eseguite" di ogni presentazione del codice; `tools/tests/verm1_check.py` compila e
gioca ogni parte con un giocatore automatico, e `tools/tests/verm1_steps.py` compila e verifica i programmi intermedi
delle Parti 2 e 3.

**Percorso di recupero, per ogni parte.** Chi ha perso la parte precedente, o ha un file che non funziona, parte dal file
di riferimento della parte precedente (la Parte 1 parte dallo scheletro della Lezione 02). Lo copia, lo compila, lo esegue
e controlla che mostri ciò con cui la parte precedente si chiudeva. Poi continua il tutorial dal passo 1 della nuova parte.
Nulla in una parte dipende da una variante aggiunta in "Fatelo vostro".

## Parte 1, Lezione 07: una testa che attraversa il mondo

- **Prima di cominciare.** Lezione 02 (il contratto, `la`/`lw`/`sw`, salvare `ra`), Lezione 04 (i colori in RGB565, gli
  array), Lezione 05 (shift come moltiplicazioni), Lezione 06 (virgola fissa).
- **Concetti.** comprendere: `verm1.project`, `prg32.contract`, `info.rgb565`, `data.array`, `mem.sections`,
  `mem.load-store`, `abi.return-address`, `num.shift-multiply`, `num.fixed-point`, `asm.pseudo`, `mem.endianness`;
  utilizzare: `tool.prg32-cli`, `tool.debugger`.
- **Punti di controllo.**
  1. Passo 2: il titolo VERM1 e una griglia con una testa verde alla colonna 5 della riga 12.
  2. Passo 3: la testa si muove a destra, circa cinque celle al secondo, esce dalla colonna 39 e rientra dalla colonna 0.
  3. Cambiare `SPEED_Q8` cambia la velocità come previsto: 256 è una cella per frame.
  4. Passo 4: in PRG32-QT, `step_q8` cresce di `SPEED_Q8` a ogni frame e ricomincia a 256.
- **Errori comuni e recupero.**
  - La testa è disegnata nel posto sbagliato: la cella è `colonna x 8` e `riga x 8 + 8`; controllare i due `slli` di 3.
  - Il programma torna nel posto sbagliato o si blocca: `verm1_draw` chiama funzioni e deve salvare `ra` (prologo ed
    epilogo); confrontare con il riferimento.
  - La testa non rientra mai: il confronto con `COLS` va fatto dopo l'incremento, con il salto giusto.
  - Una variabile messa in `.rodata` non cambia mai: le variabili vanno in `.data`.
- **Riflessione e verifica.** Biglietto d'uscita della Lezione 07 (A07.1, A07.2). Riflettere: "Quale riga decide la velocità, e perché è una frazione?"

## Parte 2, Lezione 12: guida, cibo e punteggio

- **Prima di cominciare.** La Parte 1 che gira; Lezione 08 (maschere, AND, OR, XOR), Lezione 09 (funzioni booleane),
  Lezione 10 (ingressi con pull-up), Lezione 11 (codici, multiplexer, comparatori).
- **Concetti.** comprendere: `logic.bitmask`, `comb.codes`, `data.array`, `elec.pullup`, `logic.boolean-algebra`,
  `num.fixed-point`, `comb.mux`, `num.signed-unsigned`, `comb.comparator-parity`, `abi.call-args`; utilizzare: `prg32.api`,
  `abi.calling-convention`, `tool.prg32-cli`, `tool.debugger`.
- **Punti di controllo.**
  1. Passo 2: tenendo DOWN la testa gira in basso al passo successivo, rientrando dalla riga 23 alla riga 0.
  2. Mentre la testa va a destra, tenere LEFT non fa nulla: l'inversione a U è rifiutata.
  3. DOWN poi LEFT: due svolte, e la testa va a sinistra.
  4. Passo 3: una cella rossa di cibo; mangiarla la sposta, suona una nota e aggiunge una tacca accanto a VERM1.
- **Errori comuni e recupero.**
  - Un pulsante non ha effetto: la maschera non corrisponde al bit del pulsante; guardare i pulsanti nel debugger (`a0` in update).
  - L'inversione a U è accettata: le direzioni sono RIGHT 0, DOWN 1, LEFT 2, UP 3, e due direzioni sono opposte quando il
    loro XOR vale 2; controllare la costante confrontata con `t3`.
  - Il cibo non viene mai mangiato: il confronto usa indirizzi invece di valori (`la` senza `lw`).
  - Il punteggio non si azzera: `init` deve memorizzare zero in `score`.
- **Riflessione e verifica.** Biglietto d'uscita della Lezione 12 (A12.1). Riflettere: "Quale regola del gioco è una sola istruzione logica?"

## Parte 3, Lezione 17: un corpo, regole e stati

- **Prima di cominciare.** La Parte 2 che gira; Lezione 13 (macchine a stati finiti, flip-flop), Lezione 14 (registri),
  Lezione 15 (memoria, indirizzi), Lezione 16 (la gerarchia di memoria).
- **Concetti.** comprendere: `data.array`, `seq.fsm`, `mem.sections`, `seq.latch-ff`, `num.fixed-point`; utilizzare:
  `abi.calling-convention`, `tool.prg32-cli`, `tool.debugger`.
- **Punti di controllo.**
  1. Passo 2: la riga del titolo e PRESS A; premere A toglie l'invito, il cibo compare alla colonna 0 della riga 0, e
     nulla si muove. Nel debugger `state` passa da 0 a 1.
  2. Passo 3: dopo A, un verme di tre celle nella riga 12, colonne da 3 a 5; in memoria `body_x` comincia con 03 04 05 e
     la griglia ha tre byte a 01 a partire da `grid + 12 x 40 + 3`.
  3. Passo 4: il verme si muove, cresce quando mangia, e la partita finisce quando si morde (stato 2, OVER); A riporta al titolo.
- **Errori comuni e recupero.**
  - Si legge o si scrive la cella sbagliata della griglia: l'indice è `riga x 40 + colonna`; controllare la moltiplicazione con gli shift.
  - Si scrive oltre la fine del corpo: l'indice dell'anello va ridotto con `andi ..., 255` dopo ogni incremento.
  - Il verme si morde quando non dovrebbe: la coda va cancellata dalla griglia prima di scrivere la testa.
  - Il gioco non lascia mai TITLE: confrontare `state` con la costante `PLAY`, non con il valore del pulsante.
- **Riflessione e verifica.** Biglietto d'uscita della Lezione 17 (A17.1, A17.2). Riflettere: "Dove si trova in memoria lo stato del gioco, e che cosa lo cambia?"

## Parte 4, Lezione 22: il gioco finito

- **Prima di cominciare.** La Parte 3 che gira; Lezione 18 (stack, convenzione di chiamata), Lezione 19 (istruzioni, il
  ciclo del processore), Lezione 20 (il frame buffer), Lezione 21 (ingresso e uscita).
- **Concetti.** comprendere: `num.division`, `info.text`, `num.fixed-point`, `abi.calling-convention`, `data.array`,
  `seq.fsm`, `io.framebuffer`, `cpu.cycle`; utilizzare: `tool.prg32-cli`, `tool.debugger`.
- **Punti di controllo.**
  1. Passo 1: VERM1 000 e BEST 000; mangiando si ottiene 001, 002; dopo una sconfitta BEST mostra il punteggio.
     `score_txt` contiene 30 30 33 00 dopo tre pasti.
  2. Passo 2: il verme parte più lento e accelera a ogni pasto; a punteggio 0, otto frame tra due passi.
  3. Passo 3: mordersi suona una nota lunga e bassa; `erase_x` ed `erase_y` seguono la coda.
  4. Passo 4: si disegnano solo le celle cambiate: il gioco ha lo stesso aspetto, e il passo 5 misura quanto lavoro risparmia ogni frame.
- **Errori comuni e recupero.**
  - Le cifre compaiono nell'ordine sbagliato: `to_decimal` produce per prime le unità e le memorizza all'offset 2.
  - Caratteri strani al posto delle cifre: non è stato aggiunto 48, il codice di '0'.
  - Il verme sembra fermo mentre il gioco prosegue: `dirty` non viene impostato dopo un passo, quindi `verm1_draw` non disegna nulla.
  - Il gioco diventa ingiocabile: la velocità deve fermarsi a `SPEED_MAX`.
- **Riflessione e verifica.** Biglietto d'uscita della Lezione 22 (A22.1, A22.2). Riflettere: "Quale lezione del corso usa ciascuna parte del vostro gioco?"

## Dopo la Parte 4

La Lezione 23 trasforma il gioco in un bundle per il Cartridge Store; la lista di controllo e il biglietto d'uscita della
Lezione 23 sono le ultime verifiche. La pubblicazione è facoltativa e personale.
