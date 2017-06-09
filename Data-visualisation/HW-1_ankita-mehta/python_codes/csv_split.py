
# This file splits the all races file into 3 files - named as "updated 4,5,6" 
# which are then manually renamed as "Both,Male,Female"

import os, sys, csv,re

j = 4

f = open('updated3.csv', 'r')
file = csv.reader(f)
header = []
 
for row in file:
   
    #print "hello", row[0]  
    if(row[0] == ''):
      for i in range(1,len(row)):
         header.append(row[i])
    else:
        if row[0] == 'Both Sexes' or row[0] == 'Male' or row[0] == 'Female':
            
            updated_name = "updated" + str(j) + ".csv"
            j = j + 1
    
            os.remove(updated_name)
            f2 = open(updated_name, 'a')
            wr = csv.writer(f2, dialect='excel')
            
            k = 1
            header.insert(0,row[0])
            print header
            wr.writerow(header)
            header = header[1:]          
        else:
            if k<15:
                k = k + 1 
                wr.writerow(row) 
            
        