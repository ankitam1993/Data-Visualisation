#import Kaggle file to write test the data in kaggle format 
import numpy as np , csv
import pandas as pd

#import Support Vector Regressor, SelectKbest Feature Selection and Cross validation score
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split
from sklearn.cross_validation import cross_val_score
from sklearn.metrics import f1_score
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

Y = Y_TEMP[1:]
X = X_TEMP[1:]

#print len(Y) , len(X) , X[1] , Y[1]
#X = [[int(j) for j in i] for i in X]

#Y = [[int(j) for j in i] for i in Y]

Y = np.array(Y_TEMP[1:])
X = np.array(X_TEMP[1:])

X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.33, random_state=42)

print "Training x " , len(X_train) , len(Y_train) , len(X_test) , len(Y_test)

print type(X_train)

grid = np.arange(3,30,1)
for K in grid: 
    
    knn = KNeighborsClassifier(n_neighbors=K)

#Calculate the mean scores for each value of hyperparameter C
    scores = cross_val_score(knn,X_train,Y_train,cv=10)
    C_score.append(scores.mean())
    
    print "score at N = " , K , " is : " , C_score[-1]
#Display the maximum score achieved at which hyperparameter value
print " max score is " , max(C_score) , " at C = " , grid[C_score.index(max(C_score))]

#Define the Regressor for the optimized value of C and epsilon and predict the test data
knn = KNeighborsClassifier(n_neighbors=grid[C_score.index(max(C_score))]).fit(X_train,Y_train) 

Y_pred=knn.predict(X_test)

print len(Y_pred) , len(Y_test)
#print "F1 score: %f" % f1_score(Y_test, Y_pred,pos_label=2,average="binary")
print "accuracy score is " , accuracy_score(Y_test, Y_pred, normalize=True)





'''
#df = pd.read_csv(csv_path,skipinitialspace=True, names = fields)
#Load the RobotArm Data


#print df.columns.values

#X = df[df.columns.difference(['income'])]
#Y = df[df.columns[-1]]

#print Y

XY = np.recfromcsv(csv_path,delimiter=',')


end = len(XY[0])
#X = col[:end]
#Y = col[-1]
X = XY[:end]
Y = XY[-1]

print list(Y)

'''