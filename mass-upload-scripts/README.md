Before running a csv upload for the first time:
```bash
./upload-install.sh
```
This will create a new python virtual environment and install `psycopg2-binary` into it.

Before running a csv upload in general:
```bash
./upload-prep.sh
```
This will activate the python virtual environment so that you don't get a `import psycopg2 module not found` error.