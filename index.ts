import csv from 'csv-parser';
import fs from 'fs';
import { createObjectCsvWriter } from 'csv-writer';

const csvWriter = createObjectCsvWriter({
  path: './csv/result.csv',
  header: [
    { id: 'createdAt', title: 'createdAt' },
    { id: 'externalId', title: 'externalId' },
    { id: 'userId', title: 'userId' },
  ],
});

const newData: any[] = [];
const filteredData: any[] = [];

fs.createReadStream('./csv/new_sql_out.csv')
  .pipe(csv())
  .on('data', (row) => {
    newData.push(row);
  })
  .on('end', () => {
    const newIds = newData.map((e) => e.user_id);
    // read old data with mapping
    fs.createReadStream('./csv/mapper.csv')
      .pipe(csv())
      .on('data', (row) => {
        if (newIds.includes(row.userId)) {
          filteredData.push(row);
        }
      })
      .on('end', () => {
        const oldIds = filteredData.map((e) => e.userId);
        // get new IDs that are not in the old mapper
        const missingIds = newIds.filter((id) => !oldIds.includes(id));
        console.log(missingIds);
        filteredData.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
        csvWriter.writeRecords(filteredData).then(() => {
          console.log('Created result.csv');
        });
      });
  });
