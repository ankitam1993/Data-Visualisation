
from flask_cors import CORS, cross_origin
# -*- coding: utf-8 -*-
from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json
from bson import json_util
from bson.json_util import dumps

app = Flask(__name__)
CORS(app)

MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
DBS_NAME = 'mydb'
COLLECTION_NAME = 'adult'
#FIELDS = {'school_state': True, 'resource_type': True, 'poverty_level': True, 'date_posted': True, 'total_donations': True, '_id': False}
#FIELDS =  {'age':True, 'workclass':True, 'fnlwgt': False, 'education': True, 'education-num': True, 'martial-status': True, 'occupation': True, 'relationship': True, 'race': True, 'sex': True,
#'capital-gain': True, 'capital-loss': True,'hours-per-week': True, 'origin': True,'income': True,'_id': False}

FIELDS = {'_id': False}

#@app.route("/")
def index():
    return render_template("index.html")

@app.route("/not_encoded",methods=['GET'])
def projects():
    connection = MongoClient()
    collection = connection[DBS_NAME]['not_encoded']
    projects = collection.find(projection=FIELDS)
    
    json_projects = []
    for project in projects:
        json_projects.append(project)
    json_projects = json.dumps(json_projects, default=json_util.default)
    connection.close()
    return json_projects

@app.route("/par",methods=['GET'])
def projects2():
    connection = MongoClient()
    collection = connection[DBS_NAME]['par']
    projects2 = collection.find(projection=FIELDS)

    json_projects2 = []
    for project in projects2:
        json_projects2.append(project)

    json_projects2 = json.dumps(json_projects2, default=json_util.default)
    connection.close()
    return json_projects2

@app.route("/encoded",methods=['GET'])
def projects3():
    connection = MongoClient()
    collection = connection[DBS_NAME]['encoded']
    projects3 = collection.find(projection=FIELDS)

    json_projects3 = []
    for project in projects3:
        json_projects3.append(project)

    json_projects3 = json.dumps(json_projects3, default=json_util.default)
    connection.close()
    return json_projects3
    '''
    client = MongoClient()
    db = client.mydb
    cursor = db.adult.find({},{"_id":0})
    return dumps(cursor)
    '''
@app.route("/roc",methods=['GET'])
def projects4():
    connection = MongoClient()
    collection = connection[DBS_NAME]['roc']
    projects4 = collection.find(projection=FIELDS)

    json_projects4 = []
    for project in projects4:
        json_projects4.append(project)

    json_projects4 = json.dumps(json_projects4, default=json_util.default)
    connection.close()
    return json_projects4

@app.route("/acc",methods=['GET'])
def projects5():
    connection = MongoClient()
    collection = connection[DBS_NAME]['acc']
    projects5 = collection.find(projection=FIELDS)

    json_projects5 = []
    for project in projects5:
        json_projects5.append(project)

    json_projects5 = json.dumps(json_projects5, default=json_util.default)
    connection.close()
    return json_projects5
if __name__ == "__main__":
    app.run(host='128.119.243.147',port=19000,debug=True,threaded = 2)
