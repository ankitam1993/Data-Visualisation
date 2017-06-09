# This file handles the missing values in Facebook Dataset 

import os, sys, csv,re
import pandas as pd

fields = ['Type','Page total likes','Category','Post Month', 'Post Weekday', 'Post Hour', 'Paid', 'Lifetime Post Total Reach', 'Lifetime Post Total Impressions','Lifetime Engaged Users','Lifetime Post Consumers','Lifetime Post Consumptions','Lifetime Post Impressions by people who have liked your Page','Lifetime Post reach by people who like your Page','Lifetime People who have liked your Page and engaged with your post','comment','like','share','Total Interactions']

df = pd.read_csv("dataset_Facebook-table.csv",skipinitialspace=True, usecols=fields)

print df.isnull().sum().sum()

df.fillna(0,inplace = True)

df.to_csv('facebook_output.csv', columns = fields)            
                   
                