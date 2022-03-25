import csv from 'csv-parser';
import fs from 'fs';
import { createObjectCsvWriter } from 'csv-writer';
const csvWriter = createObjectCsvWriter({
  path: './output.csv',
  header: [
    { id: 'date', title: 'Date' },
    { id: 'externalId', title: 'External ID' },
    { id: 'internalId', title: 'Internal ID' },
  ],
});

const results: any[] = [];

fs.createReadStream('./csv/1.csv')
  .pipe(
    csv({
      mapHeaders: ({ header, index }) => {
        if (index === 0) return 'date';
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
    results.sort((a, b) => (a.date > b.date ? 1 : -1));
    csvWriter.writeRecords(results).then(() => {
      console.log('Created output.csv');
    });
  });
