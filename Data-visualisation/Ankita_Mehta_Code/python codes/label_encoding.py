from sklearn import preprocessing
import pandas as pd , csv,numpy as np
from io import StringIO

#fields =['age', 'workclass', 'fnlwgt', 'education', 'education-num', 'martial-status', 'occupation', 'relationship', 'race', 'sex', 'capital-gain', 'capital-loss','hours-per-week', 'origin','income']

nominal =['workclass','marital-status', 'occupation', 'relationship', 'race', 'sex', 'origin','income']
#df = pd.read_csv(StringIO('cleaned_adult.csv'),skipinitialspace=True, sep=',' , keep_default_na = False, na_values=[''], usecols = fields)

f = csv.reader(open('cleaned_adult.csv','r'))
columns = zip(*f)

le = preprocessing.LabelEncoder()
enc_list = []

for col in columns:
    temp = []
    if col[0] in nominal:
        #temp = col[0] + le.fit_transform(col[1:])
        temp = list(le.fit_transform(col[1:]))
        temp.insert(0, col[0])
        enc_list.append(temp) 
    else:
        enc_list.append(col)

#print enc_list[0]
final_features = []
      
for i in range(0,len(enc_list[0])):
     #column = c_features[:][i]
     column = [row[i] for row in enc_list]
     final_features.append(column)
                   
rows = csv.writer(open('encoded_adult.csv','wb'))

for row in final_features:
    rows.writerow(row)




