# This file cleans the table all races and stores the cleaned data in file "updated 3" 
# which is then renamed manually.

import os, sys, csv,re

direc = './csv1'

list_csv = os.listdir(direc)

j = 3
for name in list_csv:

 if not (name.startswith('.')):
    csv_name = os.path.join(direc, name)
    f = open(csv_name, 'r')

    updated_name = "updated" + str(j) + ".csv"
    j = j + 1
    file = csv.reader(f)
    os.remove(updated_name)
    f2 = open(updated_name, 'a')
    wr = csv.writer(f2, dialect='excel')
    
    for row in file:
        arr = []
        lst = []
        for data in row:
             if re.match('(\d+),?(\d+),*(\d*)$',data):
                x = re.findall('(\d+),*(\d+),*(\d*)$',data)
                #for words in x:
                #   lst.append(''.join(words))
                data = x[0][0]+x[0][1]+x[0][2]
                print data
        
             arr.append(data)  
        wr.writerow(arr)
                  
                 
                   
                