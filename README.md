# punk.bid

## Usage

## Binary Format of a cart

```
ve: version (8bits)
in: instruction (1 bit): 0=remove, 1=add
st: step type (1bit): 0=filter, 1=id
id: punk id (14bits)
ty: type (3bits)
sc: skin color (3bits)
ac: number of attribute (4bits)
ha: hair & headgear (6bits)
ey: eyes & eyewear (5bits)
ch: cheeks (2bits)
fa: facial hair (4bits)
mo: mouth (3bits)
ma: mouth accessories (4bits)
ne: neck (2bits)
cl: clown nose (1bit)
ea: earring (1bit)
```

Format of a serialized cart:

```
+----+----------------+
| ve | array of steps |
| 8  |  var. length   |
+----+----------------+
```

Format of an id step (2bytes):

```
+----+----+----+
| st | in | id |
| 1  | 1  | 14 |
+----+----+----+
```

Format of a filter step (5bytes):

```
+----+----+----+----+----+----+----+----+----+----+-----+----+----+----+
| st | in | ty | sc | ac | ma | ha | ch | ey | mo | fa  | ne | cl | ea |
| 1  | 1  | 3  | 3  | 4  | 4  | 6  | 2  | 5  | 3  | 4   | 2  | 1  | 1  |
|-------------------+---------+---------+---------+--------------------|
|      1 byte       | 1 byte  | 1 byte  | 1 byte  |       1 byte       |
+----+----+----+----+----+----+----+----+----+----+-----+----+----+----+
```
