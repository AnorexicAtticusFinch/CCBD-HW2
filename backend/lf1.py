import json
import time
import boto3
import os
import requests


def main(event, context):
    print("LF1")

    s3_client = boto3.client('s3')
    s3 = event['Records'][0]['s3']
    bucket_name = s3['bucket']['name']
    file_key_name = s3['object']['key']
    file_name = file_key_name.split(".")[0]

    r = s3_client.head_object(Bucket=bucket_name, Key=file_key_name)

    client = boto3.client('rekognition', region_name='us-east-1')
    response = client.detect_labels(Image={'S3Object':{'Bucket':bucket_name,'Name':file_key_name}}, MaxLabels=5)
    
    labels = list(map(lambda x:x['Name'],response['Labels']))

    if r["Metadata"]:
        customlabels = r["Metadata"]["customlabels"]
        customlabels = customlabels.split(',')
        customlabels = list(map(lambda x: x.lower(), customlabels))
        print("customlabels : ", customlabels)
        for cl in customlabels:
            cl = cl.lower().strip()
            if cl not in labels:
                labels.append(cl)

    print(labels)

    obj = {
        'objectKey': file_key_name,
        'bucket': bucket_name,
        'createdTimestamp': int(time.time()),
        'labels': labels
    }

    host = "https://" + os.environ.get('OPENSEARCH_LINK')
    index = 'photos'
    url = host + '/' + index + '/' + '_doc/'
    headers = { "Content-Type": "application/json", "Authorization": "Basic bWFzdGVyVXNlckNDQkRIVzI6SUxpa2VCaWdNdXR0c0FuZElDYW5ub3RMMTMh" }

    resp = requests.put(url + str(file_name), json=obj, headers=headers)

    print("Result: ", resp.text)
    print("Status code: ", resp.status_code)
    return labels

