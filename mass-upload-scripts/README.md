## Install
Before running a csv upload for the first time:
```bash
./upload-install.sh
```
This will create a new python virtual environment and install `psycopg2-binary` into it.

## Usage
Before running a csv upload:
```bash
./upload-prep.sh
```
This will activate the python virtual environment so that you don't get a `import psycopg2 module not found` error.

To run an upload, check to see if the csv has a header:
```bash
head -n 1 filename.csv
```
This will print the first line of the file.

If it has a header:
```bash
python csv-upload-withheader.py filename.csv
```

if it does not:
```bash
python csv-upload-noheader.py filename.csv
```