## Install

```
npm install ulid-gen
```

### ULID 
ULID is Universally Unique Lexicographically Sortable Identifier.
A ULID consists of 128 bits, Out of which 48 bits represent time and 80 bits are of randomness.

#### Deep dive :
https://github.com/ulid/spec
https://sudhir.io/uuids-ulids
https://blog.daveallie.com/ulid-primary-keys


### Usage

```javascript
const { ulid } from "ulid-gen"
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
Postgres has specific UUID type, which stores it in binary rather than string type.
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

### TODO 
- Add monotonically increasing ULIDs when created in a millisecond
