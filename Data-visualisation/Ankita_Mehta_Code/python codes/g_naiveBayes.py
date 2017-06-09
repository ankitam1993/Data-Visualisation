#import Kaggle file to write test the data in kaggle format 
import numpy as np , csv
import pandas as pd

#import Support Vector Regressor, SelectKbest Feature Selection and Cross validation score
from sklearn.naive_bayes import GaussianNB
from sklearn.model_selection import train_test_split
from sklearn.cross_validation import cross_val_score
from sklearn.metrics import accuracy_score

fields =['age', 'workclass', 'fnlwgt', 'education-num', 'martial-status', 'occupation', 'relationship', 'race', 'sex', 'capital-gain', 'capital-loss','hours-per-week', 'origin','income']
#initialise lists having mean scores of 2 hyperparameters of SVR after their cross-validation
C_score = []

csv_path = '../csv_files/encoded_adult_3.csv'

#inp_file = open(csv_path,'r')

reader = csv.reader(open(csv_path, "rb"), delimiter=",")

XY = list(reader)

Y_TEMP = [row[-1] for row in XY]

X_TEMP = [row[:-1] for row in XY]

Y = np.array(Y_TEMP[1:])
X = np.array(X_TEMP[1:])

print len(Y) , len(X) , X[1] , Y[1]

X = [[int(j) for j in i] for i in X]

Y = [[int(j) for j in i] for i in Y]



X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.33, random_state=42)

print "Training x " , len(X_train) , len(Y_train) , len(X_test) , len(Y_test)

print type(X_train)

#Define the Regressor for the optimized value of C and epsilon and predict the test data
gnb = GaussianNB().fit(X_train,Y_train) 

Y_pred=gnb.predict(X_test)

print len(Y_pred) , len(Y_test)

#print "F1 score: %f" % f1_score(Y_test, Y_pred,pos_label=2,average="binary")
print "accuracy score is " , accuracy_score(Y_test, Y_pred, normalize=True)

