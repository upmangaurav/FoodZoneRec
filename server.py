import os
import json
import pandas as pd
import numpy as np
import dill as pickle
from flask import Flask, render_template, jsonify, request, redirect, url_for
from flaskext.mysql import MySQL

app = Flask(__name__)
os.chdir("./dataset/")

'''
This function concatenates all the feature vectors for input and flattens the Label data
'''
def concat_bin_vectors(binVec, Multioutput):
    outputConVec = []
    outputLabelVec = []
    for entry in binVec:
        rowVec = []
        for item in entry:
            if item == 'attribute_postal_code':
                if(not Multioutput):
                    #Convert the list-attribute to a string and remove from binary feature vector
                    outputLabelVec.append(''.join(map(str, entry[item])))
                else:
                    #Convert the list-attribute to a string and remove from binary feature vector
                    outputLabelVec.append(entry[item])
            else:
                rowVec.extend(entry[item])
        outputConVec.append(rowVec)
    return outputConVec, outputLabelVec

'''
Function to convert business attributes to binary vectors
'''
def generate_binary_vectors(businesses):
    
    with open('attributeLists.json', 'r') as f:
        attributeLists = json.load(f)
    with open('attributeDicts.json', 'r') as f:
        attributeDicts = json.load(f)
    
    #Converting the attribute lists into binary vectors
    for entry in businesses:
        for param in attributeLists:
            if param in entry:
                encodedEntry = []

                # Single valued alphanumerical attributes, will be converted to n-bit vectors
                # with a single bit as '1'
                for value in attributeLists[param]:
                    if entry[param] == value:
                        encodedEntry.append(1)
                    else:
                        encodedEntry.append(0)
            else:
                encodedEntry = [0] * len(attributeLists[param])
            entry[param] = encodedEntry

        for param in attributeDicts:
            # Multi valued binary attributes, will be converted to n-bit vectors 
            # with possibly multiple bits as '1' 
            if param in entry:
                encodedEntry = []
                # Checking whether the binary sub-attribute value is True
                for value in attributeDicts[param]:
                    if entry[param][value]:
                        encodedEntry.append(1)
                    else:
                        encodedEntry.append(0)
            else:
                encodedEntry = [0] * len(attributeDicts[param])

            entry[param] = encodedEntry

        # At this stage we dont need the original attributes parameter        
    #     del entry['attributes']

    return businesses

# MySQL config starts here...
app = Flask(__name__)
mysql = MySQL()
app.config['MYSQL_DATABASE_USER'] = 'ruyelp'
app.config['MYSQL_DATABASE_PASSWORD'] = 'ruyelp'
app.config['MYSQL_DATABASE_DB'] = 'yelp_db'
app.config['MYSQL_DATABASE_HOST'] = 'ec2-13-58-178-201.us-east-2.compute.amazonaws.com'
mysql.init_app(app)
# MySQL config ends ...


@app.route('/welcome')
def welcome():
    return render_template('index.html')  # render a template

@app.route('/predict', methods=['GET', 'POST'])
# @app.route('/predict/<string:parameters>')
def apicall():
    try:
        categories = ['Restaurants', 'Food', 'Nightlife', 'Bars', 'Active Life', 'Sandwiches',
                                  'Fast Food', 'American (Traditional)', 'Pizza', 'Coffee & Tea', 
                                  'Hotels & Travel', 'Italian', 'Burgers', 'Breakfast & Brunch', 
                                  'Mexican', 'Chinese', 'Specialty Food', 'Bakeries', 'Cafes', 
                                  'Chicken Wings', 'Beer', 'Wine & Spirits', 'Steakhouses', 
                                  'Dance Clubs', 'Cocktail Bars', 'Pubs', 'Adult Entertainment']
        BusinessParking = ['lot', 'street', 'valet', 'validated', 'garage']
        
        retrievedBusinessParking = {}
        for cat in BusinessParking:
            if cat == request.args.get('BusinessParking', ''):
                retrievedBusinessParking[cat] = True
            else:
                retrievedBusinessParking[cat] = False

        retrievedCategories = {}
        for cat in categories:
            if cat in request.args.getlist('category'):
                retrievedCategories[cat] = True
            else:
                retrievedCategories[cat] = False
            
        requestList = {}
#         requestList['attributes'] = {}
        requestList['attribute_Smoking'] = request.args.get('Smoking', '')
        requestList['attribute_AgesAllowed'] = request.args.get('AgesAllowed', '')
        requestList['attribute_Alcohol'] = request.args.get('Alcohol', '')
        requestList['attribute_BusinessParking'] = retrievedBusinessParking
        requestList['attribute_categories'] = retrievedCategories
        
#         print(generate_binary_vectors([requestList]))
        
        features, label = concat_bin_vectors(generate_binary_vectors([requestList]), False)
        
        clf = 'Model_v0.2.pkl'

        #Load the saved model
        print("Loading the model...")
        loaded_model = None
        with open('../models/'+clf,'rb') as f:
            loaded_model = pickle.load(f)

        print("The model has been loaded...Making predictions now...")
#         predictions = loaded_model.predict(featureData)
        
        probabilities = loaded_model.predict_proba(features)
        best_n = np.argsort(-probabilities, axis = 1)

        with open('attributeLists.json', 'r') as f:
            attributeLists = json.load(f)
        n_top = 10
        topZips = []
        for index in best_n[0][:n_top]:
            topZips.append(attributeLists['attribute_postal_code'][index])
        
        conn = mysql.connect()
        cursor =conn.cursor()
        cursor._defer_warnings = True        
        cats = tuple(request.args.getlist('category'))
        if(len(request.args.getlist('category'))==1):
            query = "select business.latitude, business.longitude from business, category where category.business_id = business.id and postal_code in(" + ",".join(map(str, topZips)) + ") and category = '" + cats[0] + "'"

        else:
            query = 'select business.latitude, business.longitude from business, category where category.business_id = business.id and postal_code in(' + ','.join(map(str, topZips)) + ') and category in {0} '.format(cats)
                
        print(query)
        
        cursor.execute(query)

        data = cursor.fetchall()
        
#         return redirect(url_for('recommendations', coordinates = data, recommendations = topZips))
        return render_template("the_zip_map.html", coordinates = data, recommendations = topZips)
    
#         return jsonify(data)

        

    except Exception as e:
        raise e

@app.route('/recommendations')
def recommendations():
    return render_template('the_zip_map.html', zips=request.args.get('recommendations'), coords=request.args.get('coordinates'))  # render a template


@app.errorhandler(400)
def bad_request(error=None):
    message = {
            'status': 400,
            'message': 'Bad Request: ' + request.url + '--> Please check your data payload...',
    }
    resp = jsonify(message)
    resp.status_code = 400

    return resp
