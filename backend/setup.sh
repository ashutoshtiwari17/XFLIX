# Setup file to upload data to MongoDB 
mongo xflix --eval "db.dropDatabase()" 
mongoimport --db xflix --collection videos --drop --file ./data.json
