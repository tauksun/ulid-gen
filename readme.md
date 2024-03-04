## Install

```
npm install ulid-generator
```

### ULID

ULID is Universally Unique Lexicographically Sortable Identifier.
A ULID consists of 128 bits, Out of which 48 bits represent time and 80 bits are of randomness.

#### Deep dive :

- https://github.com/ulid/spec
- https://sudhir.io/uuids-ulids
- https://blog.daveallie.com/ulid-primary-keys

### Usage

```javascript
const { ulid } from "ulid-generator"
``` 
```typescript
import { ulid } from "ulid-generator"
```

### Crockford Base32 format

```
ulid()
Output: 01HR2TC52K381F3363F1SF181Y
```

### Formatted as UUID

```
ulid({encode:"uuid"})
Output: 18E05A8C-DA6F-1F23-0207-A2B4F97F7821
```

(Postgres specific) : Storing in DB as uuid format takes less space on disk.
Postgres has specific UUID type, which stores it in binary rather than string.
Thus, when stored as UUID type it take 128bits (16 Bytes) rather than 26 Bytes in 
case of ULID as Crockford base 32 format or 36 Bytes in case of UUID as string.

### Base32 format

```
ulid({encode:"base32"})
Output: 01HO2QMKRN1T1K2TD1AQ2E31C3
```

### Base64 format

```
ulid({encode:"base64"})
Output: 000c8FuzXqBdBqBmBFGBPHB4JB
```

## ULID Monotonic Increment in a millisecond

Generating mulitple ULIDs in a millisecond increments the previous ULID,
when monotonic flag is set in passed options.

```
ulid({encode:"Crockford",monotonic:true})

Output:
01HR42P8DA3H141HC3R1KA2W12
01HR42P8DA3H141HC3R1KA2W13
01HR42P8DA3H141HC3R1KA2W14

```

```
ulid({encode:"uuid",monotonic:true})

Output:
18E082B2-1A15-454D-3627-353961464139
18E082B2-1A15-454D-3627-35396146413A
18E082B2-1A15-454D-3627-35396146413B
```

