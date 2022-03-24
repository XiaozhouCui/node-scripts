import csv from 'csv-parser';
import fs from 'fs';

const results: any[] = [];

fs.createReadStream('./csv/1.csv')
  .pipe(
    csv({
      mapHeaders: ({ header, index }) => {
        if (index === 0) return 'Date';
        if (index === 1) return 'externalId';
        if (index === 2) return 'internalId';
        return header;
      },
    })
  )
  .on('data', (row) => {
    results.push(row);
  })
  .on('end', () => {
    console.log(results);
  });
