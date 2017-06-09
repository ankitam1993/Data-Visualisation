# This file cleans the table 2a and 2j and stores the cleaned data in file "updated 1,2" 
# which is then renamed manually.

import os, sys, csv

direc = './csv files'

list_csv = os.listdir(direc)

j = 1
for name in list_csv:

 if not (name.startswith('.')):
    csv_name = os.path.join(direc, name)
    f = open(csv_name, 'r')

    updated_name = "updated" + str(j) + ".csv"
    j = j + 1
    f2 = open(updated_name, 'w')
    
    for line in f.readlines():
         phrase = line.split(',')
         if (len(phrase[0]) >=10 and len(phrase[0]) <=23 and phrase[0] != ('Footnotes:')):
             for i in range(0,len(line)):
                if line[i] == '$':
                   pass
                else:
                   if line[i] == ',' and line[i-1].isdigit():
                      pass
                   else:
                       f2.write(line[i])