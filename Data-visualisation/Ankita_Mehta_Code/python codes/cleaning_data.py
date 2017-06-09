# writing label encoder
import csv , os , numpy

lst = csv.reader(open('adult.csv','r'))

count = 0
flag = 0
cleaned_lst = []
for row in lst:
   for element in row:
        if element == '?':
            count = count + 1
            flag = 1
            break
   if flag == 0:
         cleaned_lst.append(row)
   else:
      flag = 0      
           
print count , len(cleaned_lst)

rows = csv.writer(open('cleaned_adult.csv','wb'))

for row in cleaned_lst:
    rows.writerow(row)


