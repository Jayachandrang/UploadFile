import { Component, ViewChild } from '@angular/core';
import { CSVRecord } from './CSVRecord';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AppReadCSV';
  public records: any[] = [];
  @ViewChild('csvReader', { static: true }) csvReader: any; // static true resolves before change detection runs.

  // Method is used to upload the file
  uploadListener($event: any): void {
    const files = $event.srcElement.files;
    if (this.isValidCSVFile(files[0])) {
      const input = $event.target;
      const reader = new FileReader();
      reader.readAsText(input.files[0]);
      reader.onload = () => {
        const csvData = reader.result;
        const csvRecordsArray = (csvData as string).split(/\r\n|\n/);
        const headersRow = this.getHeaderArray(csvRecordsArray);
        this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
      };
      reader.onerror = () => {
        console.log('error is occured while reading file!');
      };
    } else {
      alert('Please import valid .csv file.');
      this.fileReset();
    }
  }

  // Method to get the data from Records Array.
  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    const csvArr = [];

    for (let i = 1; i < csvRecordsArray.length; i++) {
      const currentRecord = (csvRecordsArray[i] as string).split(',');
      if (currentRecord.length === headerLength) {
        const csvRecord: CSVRecord = new CSVRecord();
        csvRecord.firstName = currentRecord[0];
        csvRecord.surName = currentRecord[1];
        csvRecord.issueCnt = currentRecord[2];
        csvRecord.dob = currentRecord[3];
        csvArr.push(csvRecord);
      }
    }
    return csvArr;
  }

  // Method to return the header array.
  getHeaderArray(csvRecordsArr: any) {
    const headers = (csvRecordsArr[0] as string).split(',');
    const headerArray = [];
    for (let headArr = 0; headArr < headers.length; headArr++) {
      headerArray.push(headers[headArr]);
    }
    return headerArray;
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith('.csv');
  }

  fileReset() {
    this.csvReader.nativeElement.value = '';
    this.records = [];
  }
}
