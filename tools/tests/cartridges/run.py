"""Build the programs of the lectures (../../../code/lNN.S), run them on the PRG32-QT headless runner
with scripted input and check pixels of the final frame.  Every program is also built for the
architectures esp32c6 (the board) and qemu, and the QEMU cartridge is staged into a copy of the flash
image of the emulator (if PRG32_HOME/build-qemu has one): the same source gives a cartridge for each
host.  What QEMU and the board then show is not checked here: the emulator needs its window, and
there is no board on the test machine.

    export PRG32_HOME=~/PRG32  PRG32QT_HEADLESS=~/PRG32-QT/build-macos/prg32qt-headless
    python3 cartridges/run.py             # needs riscv32-esp-elf-gcc on the PATH

Exit code 0 means that every check passed.  The final frame of each program is written, as a PNG, to
../../assets/lab_lNN.png: the code decks and the textbook show these pictures.
"""
import os,struct,subprocess,sys,tempfile,zlib
from pathlib import Path
PRG=os.environ['PRG32_HOME']; HL=os.environ['PRG32QT_HEADLESS']
here=Path(__file__).resolve().parent
CODE=here.parent.parent.parent/'code'; ASSETS=here.parent.parent/'assets'
TMP=Path(tempfile.mkdtemp())
BUILT={}
def build(name,prefix=None,text=None,arch=None):
    key=(name,arch,text)
    if key in BUILT: return BUILT[key]
    src=CODE/(name+'.S')
    if text is not None:
        src=TMP/(name+'_variant%d.S'%len(BUILT)); src.write_text(text)
    cart=TMP/('%s_%d.prg32'%(name,len(BUILT)))
    cmd=[sys.executable,'-m','prg32','cartridge','build',str(src),'--portable','--entry-prefix',prefix or name,'--name',name,'--out',str(cart)]
    if arch: cmd+=['--architecture',arch]
    r=subprocess.run(cmd,cwd=PRG,capture_output=True,text=True)
    if r.returncode or not cart.exists(): raise SystemExit(f'{name} BUILD FAILED\n{r.stdout[-800:]}{r.stderr[-800:]}')
    BUILT[key]=cart
    return cart
def run(name,frames,inputs=(),prefix=None,text=None):
    cart=build(name,prefix,text)
    args=[HL,str(cart),str(frames)]
    for a,b,m in inputs:
        for f in range(a,b): args+=['--input',f'{f}:{m}']
    ppm=TMP/'frame.ppm'; args+=['--dump-ppm',str(ppm)]
    r=subprocess.run(args,capture_output=True,text=True)
    if r.returncode: raise SystemExit(f'{name} RUN FAILED\n{r.stdout[-600:]}{r.stderr[-600:]}')
    d=ppm.read_bytes(); h=d.split(b'\n',3); w,hh=map(int,h[1].split()); px=h[3]
    return w,hh,px,(r.stdout+r.stderr).strip()[-200:]
def at(res,x,y):
    w,h,px,_=res; i=(y*w+x)*3; return tuple(px[i:i+3])
def bbox(res,pred,y0=0,y1=None):
    w,h,px,_=res; xs=[];ys=[]
    for y in range(y0,y1 or h):
        row=px[y*w*3:(y+1)*w*3]
        for x in range(w):
            if pred(row[x*3],row[x*3+1],row[x*3+2]): xs.append(x); ys.append(y)
    return (min(xs),min(ys),max(xs),max(ys)) if xs else None
def png(name,res,scale=2):
    w,h,px,_=res; rows=[]
    for y in range(h):
        row=px[y*w*3:(y+1)*w*3]
        rows+=[b'\x00'+b''.join(row[i:i+3]*scale for i in range(0,len(row),3))]*scale
    ch=lambda t,d: struct.pack('>I',len(d))+t+d+struct.pack('>I',zlib.crc32(t+d))
    (ASSETS/name).write_bytes(b'\x89PNG\r\n\x1a\n'+ch(b'IHDR',struct.pack('>IIBBBBB',w*scale,h*scale,8,2,0,0,0))+ch(b'IDAT',zlib.compress(b''.join(rows),9))+ch(b'IEND',b''))
FAIL=[]
def check(what,got,want):
    ok=got==want
    print(f"  {'ok  ' if ok else 'FAIL'} {what}: {got}"+('' if ok else f'  (expected {want})'),flush=True)
    if not ok: FAIL.append(what)
ON=lambda p: p[0]>200 and p[1]>200 and p[2]<80           # a lit lamp (yellow)
WHITE=lambda a,b,c:a>200 and b>200 and c>200
RED=lambda a,b,c:a>200 and b<60 and c<60
GREENP=lambda a,b,c:a<60 and b>200 and c<60
YELLOW=lambda a,b,c:a>200 and b>200 and c<80
BLUE,GREEN,PURE_RED,PURE_WHITE,PURE_YELLOW,CYAN=(0,0,255),(0,255,0),(255,0,0),(255,255,255),(255,255,0),(0,255,255)
box=lambda x,y,w,h=None:(x,y,x+w-1,y+(h or w)-1)
word=lambda r,y: sum(1<<(31-i) for i in range(32) if ON(at(r,16+9*i+4,y+4)))      # a row drawn by lamps32
A=lambda a,b:((a,b,0x10),)

print('lecture 00: the first program')
r=run('l00',10); png('lab_l00.png',r)
check('blue screen, white text',(at(r,10,10),bbox(r,WHITE) is not None and bbox(r,WHITE)[1]),(BLUE,88))
print('lecture 01: the test pattern')
r=run('l01',10); png('lab_l01.png',r)
check('bars red, green, blue, white',[at(r,40+64*i+24,90) for i in range(4)],[PURE_RED,GREEN,BLUE,PURE_WHITE])
print('lecture 02: first contact')
r=run('l02',100,prefix='first'); png('lab_l02.png',r)
w=bbox(r,GREENP)
check('the bar is one pixel per frame',(w[0],w[1],w[3],90<=w[2]-w[0]+1<=101),(32,60,67,True))
n1=bbox(run('l02',300,prefix='first'),GREENP); check('and starts again after 256',n1[2]-n1[0]+1<60,True)
print('lecture 03: the stored program')
r=run('l03',10); png('lab_l03.png',r)
check('the instruction read as data',(hex(word(r,60)),at(r,160,108)),('0x130313',GREEN))
print('lecture 04: an array')
r=run('l04',10); png('lab_l04.png',r)
check('bar widths 32, 11, 34, 22 times four',[bbox(r,lambda a,b,c:a>200 and b>200,30+32*i,46+32*i)[2]-19 for i in range(4)],[128,44,136,88])
check('element 2 is yellow',at(r,30,30+64+8),PURE_YELLOW)
print('lecture 05: integers')
r=run('l05',20); check('marker_x starts at 2',word(r,96),2)
check('LEFT for 2 frames: 0',word(run('l05',20,((0,2,1),)),96),0)
r=run('l05',20,((0,3,1),)); png('lab_l05.png',r)
check('LEFT for 3 frames: -1, every lamp lit',hex(word(r,96)),'0xffffffff')
print('lecture 06: fixed point, 96/256 of a pixel per frame')
r=run('l06',60); check('frame size',(r[0],r[1]),(320,200)); png('lab_l06.png',r)
for frames in (60,300): check(f'white box after {frames} frames',bbox(run('l06',frames),WHITE),box(frames*96>>8,100,8))
print('lecture 08: Boolean algebra')
lamps=lambda r:[ON(at(r,48+32*i+12,52)) for i in range(7)]
r=run('l08',10); check('no input: lamps off, idle, marker in the middle',(lamps(r),at(r,160,158),bbox(r,WHITE,100,116)),([False]*7,GREEN,box(152,100,16)))
r=run('l08',10,((0,10,0x11),)); png('lab_l08.png',r)
check('LEFT+A for 10 frames: lamps 0 and 4, not idle, marker 20 pixels to the left',(lamps(r),at(r,160,158),bbox(r,WHITE,100,116)),([True,False,False,False,True,False,False],PURE_RED,box(132,100,16)))
check('RIGHT alone is not idle either',at(run('l08',10,((0,10,0x02),)),160,158),PURE_RED)
print('lecture 09: the full adder')
r=run('l09',10); png('lab_l09.png',r)
lit=lambda r,c,row: at(r,60+32*c+12,20+20*row+7)[1]>200
check('S    for the rows 000 ... 111',[int(lit(r,4,k)) for k in range(8)],[0,1,1,0,1,0,0,1])
check('Cout for the rows 000 ... 111',[int(lit(r,5,k)) for k in range(8)],[0,0,0,1,0,1,1,1])
check('the inputs count from 0 to 7',[4*lit(r,0,k)+2*lit(r,1,k)+lit(r,2,k) for k in range(8)],list(range(8)))
print('lecture 10: one button, one bit')
check('released: grey',ON(at(run('l10',10),160,100)),False)
r=run('l10',10,((0,10,1),)); png('lab_l10.png',r); check('LEFT held: yellow',at(r,160,100),PURE_YELLOW)
print('lecture 11: the multiplexer')
r=run('l11',10); png('lab_l11.png',r); check('bars red, green, blue, yellow',[at(r,100,20+32*i+8) for i in range(4)],[(255,0,0),(0,255,0),(0,0,255),(255,255,0)])
print('lecture 13: the state machine')
src=(CODE/'l13.S').read_text(); start=lambda s: src.replace('state: .word TITLE','state: .word '+s); assert start('OVER')!=src
png('lab_l13.png',run('l13',30,A(10,12)))
for st,inp,want,what in [('TITLE',(),BLUE,'no input: TITLE'),('TITLE',A(10,12),GREEN,'A: PLAY'),('OVER',(),PURE_RED,'started in OVER, no input: OVER'),
                        ('OVER',A(10,12),GREEN,'OVER, A for two frames: TITLE, then PLAY one frame later (the bug discussed in the notes)'),
                        ('OVER',A(10,11),BLUE,'OVER, A for one frame: TITLE'),('PLAY',A(10,12),GREEN,'PLAY ignores A')]:
    check(what,at(run('l13',30,inp,text=None if st=='TITLE' else start(st)),160,100),want)
print('lecture 14: serial and parallel')
r=run('l14',10); png('lab_l14.png',r)
bits=lambda r,y:''.join('1' if ON(at(r,36+32*i+12,y+12)) else '0' for i in range(8))
check('0xA5 on the wire, the byte rebuilt, equal',(bits(r,40),bits(r,100),at(r,160,158)),('10100101','10100101',GREEN))
print('lecture 15: memory')
r=run('l15',10); png('lab_l15.png',r)
check('the word, then the bytes at A ... A+3',[hex(word(r,y)) for y in (20,60,84,108,132)],['0x12345678','0x78','0x56','0x34','0x12'])
print('lecture 16: permanent memory')
gw=lambda r,y,pred:(lambda b:0 if b is None else b[2]-b[0]+1)(bbox(r,pred,y,y+12))
r=run('l16',60,A(0,40)); png('lab_l16.png',r)
check('A held 40 frames, then released: score 0, best 40',(gw(r,60,GREENP),gw(r,100,YELLOW)),(0,40))
check('while A is held both bars grow',(lambda r:(gw(r,60,GREENP),gw(r,100,YELLOW)))(run('l16',30,A(0,30))),(30,30))
check('a fresh start: best is zero, the title is there',(gw(run('l16',5),100,YELLOW),bbox(run('l16',5),WHITE,20,28) is not None),(0,True))
print('lecture 18: the processor')
r=run('l18',10); png('lab_l18.png',r)
check('x = 5, y = 7, z = 12 (eight pixels each)',[gw(r,40,WHITE),gw(r,72,WHITE),gw(r,120,GREENP)],[40,56,96])
print('lecture 19: instructions')
r=run('l19',10); png('lab_l19.png',r)
check('the four words in memory',[hex(word(r,30+32*i)) for i in range(4)],['0x2a303','0x130313','0x62a023','0x8067'])
check('each equal to the encoding worked out by hand',[at(r,310,34+32*i) for i in range(4)],[GREEN]*4)
print('lecture 20: the frame buffer')
r=run('l20',10); png('lab_l20.png',r); check('a single red pixel',bbox(r,RED),(100,50,100,50))
print('lecture 21: the pad')
r=run('l21',30); check('no input',bbox(r,YELLOW),box(152,100,16))
r=run('l21',30,((0,20,0x01),)); png('lab_l21.png',r); check('LEFT held 20 frames',bbox(r,YELLOW),box(112,100,16))
check('LEFT+A held 20 frames (s0 survives the sound call)',bbox(run('l21',30,((0,20,0x11),)),YELLOW),box(112,100,16))
print('lecture 24: the loop that empties the map')
r=run('l24',10); png('lab_l24.png',r); check('960 bytes, all zero',at(r,160,100),GREEN)
print('every program builds for the other two architectures, and QEMU accepts it')
names=sorted(p.stem for p in CODE.glob('l*.S'))
flash=Path(PRG)/'build-qemu'/'qemu_flash.bin'; staged=0
if flash.exists():
    import shutil; image=TMP/'qemu_flash.bin'; shutil.copy(flash,image)      # a copy: the emulator's own image is not touched
for n in names:
    p='first' if n=='l02' else None
    build(n,p,arch='esp32c6'); cart=build(n,p,arch='qemu')
    if flash.exists():
        r=subprocess.run([sys.executable,'-m','prg32','qemu','upload',str(cart),'--flash',str(image)],cwd=PRG,capture_output=True,text=True)
        if r.returncode: print(f'  FAIL {n}: not accepted by the QEMU flash image\n{r.stdout[-300:]}{r.stderr[-300:]}'); FAIL.append(n+' staging')
        else: staged+=1
check('cartridges built for esp32c6 and for qemu',len(names),20)
if flash.exists(): check('cartridges staged into a copy of the QEMU flash image',staged,len(names))
else: print('  skip staging into the QEMU flash image: run "python3 -m prg32 qemu build" in PRG32_HOME first')
print('FAILED: '+', '.join(FAIL) if FAIL else 'all cartridge checks passed')
sys.exit(1 if FAIL else 0)
