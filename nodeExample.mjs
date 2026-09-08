import csvToMarkdown from "./lib/CsvToMarkdown.mjs";

const csv = [
  "Name,Role,Location",
  "Ada Lovelace,Mathematician,London",
  "Grace Hopper,Computer scientist,New York",
].join("\n");

console.log("prettyPrint: true (default)");
console.log(csvToMarkdown(csv, ",", true));

console.log("prettyPrint: false");
console.log(csvToMarkdown(csv, ",", true, { prettyPrint: false }));
