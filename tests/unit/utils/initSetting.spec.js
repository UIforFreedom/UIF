import {
  InitSetting
} from '@/utils/index.js'

describe('Utils:initSetting', () => {

  it('recursive', () => {
    var res = InitSetting({
      a: {
        a: 1
      }
    }, {
      a: {
        a: 2
      }
    })
    expect(res['a']['a']).toBe(1)

    res = InitSetting({
      a: {
        a: 1
      }
    }, {
      a: {
        a: {
          a: 2
        }
      }
    })
    expect(res['a']['a']['a']).toBe(2)

    res = InitSetting({
      a: {
        a: {
          a: 1
        }
      }
    }, {
      a: {
        a: {
          a: 2
        }
      }
    })
    expect(res['a']['a']['a']).toBe(1)

    res = InitSetting({
      a: {
        a: {
          a: 1,
          b: 2
        }
      }
    }, {
      a: {
        a: {
          a: 2
        }
      }
    })
    expect(res['a']['a']['a']).toBe(1)
    expect(res['a']['a']['b']).toBe(undefined)

    res = InitSetting({
      a: {
        a: {
          a: 1
        }
      }
    }, {
      a: {
        a: {
          a: 2,
          b: 1
        }
      }
    })
    expect(res['a']['a']['a']).toBe(1)
    expect(res['a']['a']['b']).toBe(1)

    res = InitSetting({
      a: {
        a: {
          a: 1
        }
      }
    }, {
      a: {
        a: {
          a: {
            a: 1
          },
          b: 2
        }
      }
    })
    expect(res['a']['a']['a']['a']).toBe(1)
    expect(res['a']['a']['b']).toBe(2)
  })

  it('not in defaultValue', () => {
    var res = InitSetting({
      a: 1
    }, {
      b: 2
    })
    expect(res).toStrictEqual({
      b: 2
    })
  })

  it('complex', () => {
    var res = InitSetting({
      d: {
        e: 2
      }
    }, {
      b: 2,
      c: [],
      d: {
        e: 1
      }
    })
    expect(res).toStrictEqual({
      b: 2,
      c: [],
      d: {
        e: 2
      }
    })
  })

  it('in defaultValue', () => {
    var res = InitSetting({
      b: 1
    }, {
      b: 2
    })
    expect(res).toStrictEqual({
      b: 1
    })
  })

  it('wrong type', () => {
    var res = InitSetting({
      b: 1
    }, {
      b: '2'
    })
    expect(res).toStrictEqual({
      b: '2'
    })
  })

  it('wrong type', () => {
    var res = InitSetting({
      b: 1
    }, {
      b: '2',
      a: 2
    })
    expect(res).toStrictEqual({
      b: '2',
      a: 2
    })
  })

  it('less input', () => {
    var res = InitSetting({
      b: 1
    }, {
      b: 1,
      a: 2
    })
    expect(res).toStrictEqual({
      b: 1,
      a: 2
    })
  })

  it('logger input', () => {
    var res = InitSetting({
      b: 1,
      a: 1
    }, {
      a: 2
    })
    expect(res).toStrictEqual({
      a: 1
    })
  })

  it('logger input but wrong type', () => {
    var res = InitSetting({
      b: 1,
      a: '1'
    }, {
      a: 2
    })
    expect(res).toStrictEqual({
      a: 2
    })
  })

  it('logger input with different key', () => {
    var res = InitSetting({
      b: 1,
      a: 1
    }, {
      a: 2,
      c: 1
    })
    expect(res).toStrictEqual({
      a: 1,
      c: 1
    })
  })

  it('array object', () => {
    var res = InitSetting({
      b: 2,
    }, {
      b: [],
    })
    expect(res).toStrictEqual({
      b: [],
    })

    res = InitSetting({
      b: ['abc'],
    }, {
      b: [],
    })
    expect(res).toStrictEqual({
      b: ['abc'],
    })

    res = InitSetting({
      b: ['abc'],
    }, {
      b: ['a'],
    })
    expect(res).toStrictEqual({
      b: ['abc'],
    })

    res = InitSetting({
      b: ['abc', 1],
    }, {
      b: ['a'],
    })
    expect(res).toStrictEqual({
      b: ['abc', 1],
    })
  })
})
