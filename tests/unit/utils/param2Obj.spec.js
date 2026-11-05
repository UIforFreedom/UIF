import {
  param2Obj
} from '@/utils/index.js'
import {
  Base64
} from 'js-base64';

describe('Utils:param2Obj', () => {
  const url = 'https://github.com/PanJiaChen/vue-element-admin?name=bill&age=29&sex=1&field=dGVzdA==&key=%E6%B5%8B%E8%AF%95'

  it('param2Obj test', () => {
    expect(param2Obj(url)).toEqual({
      name: 'bill',
      age: '29',
      sex: '1',
      field: window.btoa('test'),
      key: '测试'
    })
  })

  it('base64', () => {
    var origin = 'abc'
    var e = Base64.encode(origin)
    var d = Base64.decode(e)
    expect(d).toEqual(origin)

    d = Base64.decode(e + "\n")
    expect(d).toEqual(origin)

    d = Base64.decode('{"abc": 1}')
    console.log(d)
  })
})
