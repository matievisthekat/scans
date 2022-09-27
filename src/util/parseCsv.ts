export function csvToArray(str: string): string[][] {
  // Check to see if the delimiter is defined. If not,
  // then default to comma.
  const delimiter = ",";

  // Create a regular expression to parse the CSV values.
  const objPattern = new RegExp(
    (
      // Delimiters.
      "(\\" + delimiter + "|\\r?\\n|\\r|^)" +

      // Quoted fields.
      "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

      // Standard fields.
      "([^\"\\" + delimiter + "\\r\\n]*))"
    ),
    "gi"
  );


  // Create an array to hold our data. Give the array
  // a default empty first row.
  const arrData: any[][] = [[]];

  // Create an array to hold our individual pattern
  // matching groups.
  let arrMatches = null;


  // Keep looping over the regular expression matches
  // until we can no longer find a match.

  // eslint-disable-next-line no-cond-assign
  while (arrMatches = objPattern.exec(str)) {

    // Get the delimiter that was found.
    // @ts-ignore
    const strMatchedDelimiter = arrMatches[ 1 ];

    // Check to see if the given delimiter has a length
    // (is not the start of string) and if it matches
    // field delimiter. If id does not, then we know
    // that this delimiter is a row delimiter.
    if (
      strMatchedDelimiter.length &&
      (strMatchedDelimiter !== delimiter)
    ){

      // Since we have reached a new row of data,
      // add an empty row to our data array.
      arrData.push( [] );

    }

    let strMatchedValue;


    // Now that we have our delimiter out of the way,
    // let's check to see which kind of value we
    // captured (quoted or unquoted).
    if (arrMatches[ 2 ]){

      // We found a quoted value. When we capture
      // this value, unescape any double quotes.
      strMatchedValue = arrMatches[ 2 ].replace(
        new RegExp( "\"\"", "g" ),
        "\""
      );

    } else {

      // We found a non-quoted value.
      strMatchedValue = arrMatches[ 3 ];

    }


    // Now that we have our value string, let's add
    // it to the data array.
    arrData[ arrData.length - 1 ].push( strMatchedValue );
  }

  // Return the parsed data.
  return arrData;
}

export default function parseCsv(str: string): Record<string, string>[] {
  const arr = csvToArray(str);
  const headers = arr[0].map((h) => h.toLowerCase().replace(/ +/g, '_'));
  const res: Record<string, string>[] = [];

  arr.shift();
  arr.forEach((row: string[]) => {
    const obj: Record<string, string> = {};
    row.forEach((v: string, i: number) => {
      obj[headers[i]] = v;
    });
    res.push(obj);
  });

  return res;
}
