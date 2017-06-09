#import Kaggle file to write test the data in kaggle format 
import numpy as np , csv
import pandas as pd

#import Support Vector Regressor, SelectKbest Feature Selection and Cross validation score
from sklearn import svm
from sklearn.feature_selection import SelectKBest
from sklearn.model_selection import train_test_split
from sklearn.cross_validation import cross_val_score
from sklearn.ensemble import RandomForestClassifier
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

#l = len(Y)

#Y_new = Y.reshape((l, 1))

print "error again" , Y.shape

X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.33, random_state=42)

print "Training x " , len(X_train) , len(Y_train) , len(X_test) , len(Y_test)

print "hiiii" , type(X_train) , X_train.shape , Y_train.shape


#Define the range of hyperparameter C
grid = np.arange(100,200,10)
for K in grid: 
    
    rfc = RandomForestClassifier(n_estimators=K)

#Calculate the mean scores for each value of hyperparameter C
    scores = cross_val_score(rfc,X_train,Y_train,cv=10)
    C_score.append(scores.mean())
    print "score at k = " , K , " is: " , scores.mean()
#Display the maximum score achieved at which hyperparameter value
print " max score is " , max(C_score) , " at C = " , grid[C_score.index(max(C_score))]


#Define the Regressor for the optimized value of C and epsilon and predict the test data
rfc = RandomForestClassifier(n_estimators=grid[C_score.index(max(C_score))]).fit(X_train,Y_train) 

Y_pred = rfc.predict(X_test)


#print "F1 score: %f" % f1_score(Y_test, Y_pred,pos_label=2)
print "accuracy score is " , accuracy_score(Y_test, Y_pred, normalize=True)

