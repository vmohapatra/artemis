#!/bin/sh
#http://stackoverflow.com/questions/6753330/specify-which-database-to-use-in-mongodb-js-script
#mongo <name of db> --eval "db.runCommand( <js in here> );"
#Drop these preexisting tables if they exist
mongo bonvoyage_db --eval 'db.lxApiResponse.drop()'
#import from csv files the preloaded tag data
mongoimport -d prototype -c lxApiResponse --type csv --file lxApiResponse.csv --headerline
