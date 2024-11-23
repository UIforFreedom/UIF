import {
  BuildTestNodeTemplate
} from '@/uif/template/speedtest';

import {
  MyWS
} from '@/utils';

function CheckNetflixOrigin(data) {

}

function CheckNetflixFull(data) {

}

function CheckChatGPT(data) {

}

function CheckGemini(data) {

}

function CheckScholar(data) {

}

export function BuildCheck(uifStyleNodeConfig) {
  domainList = {
    'https://www.netflix.com/title/70143836': CheckNetflixFull,
    'https://www.netflix.com/title/70242311': CheckNetflixOrigin,
    'https://chatgpt.com': CheckChatGPT,
    'https://gemini.google.com': CheckGemini,
    'https://scholar.google.com': CheckScholar,
  }
  var tags = []
  var config = BuildTestNodeTemplate(uifStyleNodeConfig)
  for (var item in domainList) {
    tags.push(item)
  }

  MyWS(state.apiAddress + '/delay', {
    config: JSON.stringify(config),
    is_ip_info: true,
    tags: tags,
  }, function(response) {
    var data = JSON.parse(response.data)
    var i = data['tag']
    domin[i].cb(data)
  }, function(error) {
    console.log(error)
  });
}
