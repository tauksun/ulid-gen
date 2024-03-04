function monotonicIncrease({
  str,
  base,
  encoding,
}: {
  str: string;
  base: number;
  encoding: string;
}): string {
  let carry: number | null = null;
  let incrementedPostion = 0;
  let increasedSTR = "";
  for (let i = str.length - 1; i >= 0; i--) {
    // No more bytes to increase value of
    if (carry === 0) {
      break;
    }

    let chunk = str.charAt(i);
    let increasedEncodingPosition = encoding.indexOf(chunk) + 1;

    if (increasedEncodingPosition >= encoding.length) {
      // Loop this byte from starting of encoding
      // Set carry to increase the next byte
      carry = 1;
      increasedEncodingPosition = 0;
    } else {
      carry = 0;
    }

    let increasedByteValue = encoding?.charAt(increasedEncodingPosition);
    increasedSTR = increasedByteValue.toString() + increasedSTR;
    incrementedPostion++;
  }

  increasedSTR = str.slice(0, str.length - incrementedPostion) + increasedSTR;
  return increasedSTR;
}

export default monotonicIncrease;
