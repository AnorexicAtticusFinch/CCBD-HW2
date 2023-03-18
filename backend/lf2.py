import json
import datetime
import boto3

def lambda_handler(event, context):
    print("LF2")

    photos = []

    txt = event['messages'][0]['query']
    print("txt", txt)

    client = boto3.client("lexv2-runtime")
    response = client.recognize_text(botId='ERUDNYDIAN', botAliasId='USVXTEBHZN', localeId='en_US', sessionId='test_session', text=txt)
    print("RESP", response)


    return {
        "statusCode": 200,
        "body": "{'Test': 'Test'}",
        "headers": {
            'Content-Type': 'application/json',
        }
    }
