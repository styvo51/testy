import psycopg2
import csv

# Config
config = {
'PGHOST': 'localhost',
'PGDATABASE': 'defaultdb', 
'PGUSER':'postgres',
'PGPASSWORD':'admin', 
'PGPORT':'5432',
'PGTABLE':'qld70to79',
'TARGETFILE':'../mockdata.csv'}

## ****** LOAD PSQL DATABASE ***** ##
# Set up a connection to the postgres server.
conn_string = "host="+ config['PGHOST'] +" port="+ config['PGPORT'] +" dbname="+ config['PGDATABASE'] +" user=" + config['PGUSER'] \
+" password="+ config['PGPASSWORD']
conn=psycopg2.connect(conn_string)
print("Connected!")

# Create a cursor object
cursor = conn.cursor()
# cursor.execute("INSERT INTO "+config.PGTABLE +" (first_name, last_name, email, address, address2, postcode, dob, telephone, url, ip) VALUES (" +")");
f = open(config['TARGETFILE'], 'r')
cursor.copy_from(f, config['PGTABLE'], sep=',')
f.close()

# commit changes, close the connection
conn.commit()
print("Records inserted successfully")
conn.close()