import json
import datetime
import boto3
import os
import requests
import time 

def main(event, context):
    print("LF2")

    photos = []

    txt = event['q']
    print("txt", txt)

    client = boto3.client("lexv2-runtime")
    response = client.recognize_text(botId='ERUDNYDIAN', botAliasId='USVXTEBHZN', localeId='en_US', sessionId='test_session' + str(time.time()), text=txt)
    print("RESP", response['sessionState']['intent']['slots'])
    response_slots = response['sessionState']['intent']['slots']

    query = []
    if response_slots['query_term1'] != None:
        query.append(response_slots['query_term1']['value']['interpretedValue'])
    if response_slots['query_term2'] != None:
        query.append(response_slots['query_term2']['value']['interpretedValue'])


    #OpenSearch query
    host = "https://" + os.environ.get('OPENSEARCH_LINK')
    index = 'photos'
    url = host + '/' + index + '/' + '_search'
    headers = { "Content-Type": "application/json", "Authorization": "Basic bWFzdGVyVXNlckNDQkRIVzI6SUxpa2VCaWdNdXR0c0FuZElDYW5ub3RMMTMh" }

    query = set(query)
    esq = {
        "query": {
            "match": {
                "labels": " ".join(query),
                "operator": "and"
            }
        }
    }
    # for q in query:
    #     query = {
    #         "size": 5,
    #         "query" : {
    #             "match" : {
    #               "labels": q
    #             }
    #         }
    #     }
 
    r = requests.get(url, json=esq, headers=headers)
    r.raise_for_status()
    body = r.json()
    items = body["hits"]["hits"]
    for item in items:
        bucket = item["_source"]["bucket"]
        key = item["_source"]["objectKey"]
        photoURL = "https://{0}.s3.amazonaws.com/{1}".format(bucket,key)
        photos.append(photoURL)        

    print("Photos count: ", len(photos))

    return {
        "statusCode": 200,
        "body": json.dumps(photos),
        "headers": {
            'Content-Type': 'application/json',
        }
    }