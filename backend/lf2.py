def main(event, context):
    print("LF2")

    return {
        "statusCode": 200,
        "body": "{'Test': 'Test'}",
        "headers": {
            'Content-Type': 'application/json',
        }
    }
