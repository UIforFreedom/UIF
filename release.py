#!/usr/bin/env python3

import json
import os
import requests
import datetime

from urllib.parse import urlencode
from urllib.request import Request, urlopen

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
BASE_DIR = BASE_DIR.replace('\\', '/')

NOW_TIME = str(int(datetime.datetime.now().timestamp()))
TOKEN = os.getenv('GITHUB_TOKEN', default='')

repo = 'UIforFreedom/UIF'

def DeleteRelease(release_id):
    respon = requests.delete(
        'https://api.github.com/repos/UIforFreedom/UIF/releases/%s' %
        release_id,
        headers={
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': 'token ' + TOKEN
        })
    print(respon.text)


# delete all release
respon = requests.get(
    'https://api.github.com/repos/UIforFreedom/UIF/releases')
respon = json.loads(respon.text)
for item in respon:
    print(item['id'])
    DeleteRelease(item['id'])
