import os
import MySQLdb
import cgi
import cgitb

cgitb.enable()

env = os.getenv('SERVER_SOFTWARE')
if (env and env.startswith('Google App Engine/')):
  # Connecting from App Engine
  db = MySQLdb.connect(
    unix_socket='/cloudsql/flint-water-project:flint-water-project-db',
    db='waterdata',
    user='root'
    )
else:
  # Connecting from an external network.
  # Make sure your network is whitelisted
  db = MySQLdb.connect(
    host='173.194.225.157',
    port=3306,
    user='root'
  )
    
form = cgi.FieldStorage()
print "Content-Type: text/html"
print

print "test 1"

if (form.getvalue("type") == "lead"):
    print "test 2"
    cursor = db.cursor()
    cursor.execute("USE waterdata")
    cursor.execute("SELECT * FROM waterCondition  ORDER BY latitude")
    all_rows = cursor.fetchall()

print(all_rows)