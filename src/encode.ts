function encoder({
  num,
  base,
  encoding,
}: {
  num: number;
  base: number;
  encoding: string;
}) {
  let encoded = "";
  while (num > 0) {
    let remainder = num % base;
    num = Math.floor(num / base);
    encoded = encoding.charAt(remainder) + encoded;
  }

  return encoded;
}

export default encoder;
