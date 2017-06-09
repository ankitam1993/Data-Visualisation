import numpy as np , csv
import collections
import matplotlib.pyplot as plt


from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import GaussianNB
from sklearn.ensemble import RandomForestClassifier
from sklearn import svm
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn import metrics
from sklearn.metrics import accuracy_score 
from sklearn.metrics import roc_auc_score



#initialise lists having mean scores of 2 hyperparameters of SVR after their cross-validation
C_score = []

csv_path = '../csv_files/encoded_adult_3.csv'

reader = csv.reader(open(csv_path, "rb"), delimiter=",")

XY = list(reader)

Y_TEMP = [row[-1] for row in XY]

X_TEMP = [row[:-1] for row in XY]

Y = np.array(Y_TEMP[1:]).astype(int)
X = np.array(X_TEMP[1:]).astype(int)


#Randomly split the dataset into train and test.
X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.33, random_state=42)


svc = svm.SVC(C=1.0,probability=True)

gnb = GaussianNB()
knn = KNeighborsClassifier(n_neighbors=23)
dtrees = DecisionTreeClassifier(criterion='gini')
rfc = RandomForestClassifier(n_estimators=100)


roc_file_path = '../csv_files/roc_results.csv'

roc_file = open(roc_file_path,'w')

r_file = csv.writer(roc_file, delimiter = ',')

r_file.writerow(["Fpr", "Tpr","Classifier"])

acc_file_path = '../csv_files/acc_results.csv'

acc_file = open(acc_file_path,'w')

a_file = csv.writer(acc_file, delimiter = ',')

a_file.writerow(["Accuracy","Area under Curve","Classifier"])


for clf,name in [(gnb, 'Naive Bayes'),(knn,'KNN'),(dtrees,'Decision_Trees'), (rfc, 'Random Forest'),(svc, 'Support Vector Classification')]:

     clf.fit(X_train,Y_train)
     
     
     Y_pred=clf.predict_proba(X_test)[:, 1]
     
     Y_acc = clf.predict(X_test)
     
     fpr, tpr, thresholds = metrics.roc_curve(Y_test, Y_pred)
     
     for i in range(0,len(fpr)):
         row = [fpr[i],tpr[i],name]
         r_file.writerow(row)
     
     acc_score = accuracy_score(Y_test, Y_acc, normalize=True)     
     area_uc   = roc_auc_score(Y_test, Y_pred)
     
     print "accuracy score for classifier " , name, " is " , acc_score   

     print "area under curve is for classifier " , name , " is : " , area_uc 
     
     print fpr , tpr
     acc_row = [acc_score,area_uc,name]
     a_file.writerow(acc_row)
     
     print "done with " , name
     
     print "----------------------------------------\n"
     
     plt.figure(1)
     plt.plot([0, 1], [0, 1], 'k--')
     plt.plot(fpr, tpr, label=name)
     plt.xlabel('False positive rate')
     plt.ylabel('True positive rate')
     plt.title('ROC curve (zoomed in at top left)')
     plt.legend(loc='best')
     plt.show()
 
     
roc_file.close()
acc_file.close()