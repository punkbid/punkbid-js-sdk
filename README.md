# punk.bid

A bid on punk.bid can target any number of punks, which poses a problem since
blockchain storage is expensive and storing thousands of punk ids for each bid on-chain is not economically viable.

this package exposes a Cart class which records the steps taken to fill a bidder's cart. It is then possible to serialize/deserialize those steps
in a compact data format and compute the cart's content.

There are 2 kinds of steps:

- **id step** to add/remove a punk
- **filter step** to add/remove by filter

A filter can specify up to:

- one type (Alien, Female, etc...)
- one number of attributes (1 attribute, 5 attributes, etc...)
- one skin color (Olive skin, Albino skin, etc...)
- one attribute of each category (see metadata.ts for more info)

## Installation

```
npm install @punk.bid/sdk
```

## Usage

for a complete example, see https://github.com/punkbid/punkbid-sample

```javascript
import { Cart, filter } from "@punk.bid/sdk";

const cart = new Cart();

// add punk #8
cart.add(8);

// add punk #1 and #10
cart.add([1, 10]);

// typescript offer strong typing & autocomplete on filter traits
// add all punks with only 1 attribute: a purple cap
cart.add(filter(["1 Attribute", "Purple Cap"]));

// remove all Aliens
cart.remove(filter("Alien"));

// retrieve punk ids included in the cart
const punkIds = cart.computeContent();

// serialize the cart in a compact data format
// this metadata is used as input when entering a new bid
const cartMetadata = cart.serialize();
```

## Binary Format of a cart

```
ve: version (8bits)
--
in: instruction (1 bit): 0=remove, 1=add
st: step type (1bit): 0=filter, 1=id
--
id: punk id (14bits)
--
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

Format of an id step (2 bytes):

```
+----+----+----+
| st | in | id |
| 1  | 1  | 14 |
+----+----+----+
```

Format of a filter step (5 bytes):

```
+----+----+----+----+----+----+----+----+----+----+-----+----+----+----+
| st | in | ty | sc | ac | ma | ha | ch | ey | mo | fa  | ne | cl | ea |
| 1  | 1  | 3  | 3  | 4  | 4  | 6  | 2  | 5  | 3  | 4   | 2  | 1  | 1  |
|-------------------+---------+---------+---------+--------------------|
|      1 byte       | 1 byte  | 1 byte  | 1 byte  |       1 byte       |
+----+----+----+----+----+----+----+----+----+----+-----+----+----+----+
```
