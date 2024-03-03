const prepend = "ULID-GEN : ";
function log(...data: any) {
  console.log(...data);
}

log.error = (...data: any) => {
  log(prepend, "ERROR : ", ...data);
};

log.info = (...data: any) => {
  log(prepend, "INFO : ", ...data);
};

export default log;
