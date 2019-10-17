import psycopg2
import csv
import sys

# Config
config = {
'PGHOST': 'localhost',
'PGDATABASE': 'defaultdb', 
'PGUSER':'postgres',
'PGPASSWORD':'admin', 
'PGPORT':'5432',
'PGTABLE':'qld70to79',
'TARGETFILE':sys.argv[1]}

## ****** LOAD PSQL DATABASE ***** ##
# Set up a connection to the postgres server.
conn_string = "host="+ config['PGHOST'] +" port="+ config['PGPORT'] +" dbname="+ config['PGDATABASE'] +" user=" + config['PGUSER'] \
+" password="+ config['PGPASSWORD']
conn=psycopg2.connect(conn_string)
print("Connected!")
cursor = conn.cursor()
# queryString = f'INSERT INTO {config["PGTABLE"]} (title, first_name, last_name, email, address, address2, postcode, dob, telephone, url, ip) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)'
recordCount = 0
with open(config['TARGETFILE'], 'r') as f:
	csv = csv.reader(f, delimiter=',')    
	for row in csv:
		# print(row)
		if recordCount == 0:
			print(f'Column names are {", ".join(row)}')
			recordCount += 1
		else:
			cursor.execute(f"INSERT INTO {config['PGTABLE']} (title, first_name, last_name, email, address, address2, postcode, dob, telephone, url, ip) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",(row[0],row[1],row[2],row[3],row[4],row[5],row[6],row[7],row[8],row[9],row[10]))
			recordCount += 1
			print(f"{recordCount}: {row[0]}, {row[1]}, {row[2]}, {row[3]}, {row[4]}, {row[5]}, {row[6]}, {row[7]}, {row[8]}, {row[9]}, {row[10]}")
	
conn.commit()
# print(f"{recordCount} records inserted successfully")
conn.close()
