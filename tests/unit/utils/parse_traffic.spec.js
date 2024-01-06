import {
  ParseTraffic
} from '@/utils/index.js'

describe('Utils:ParseTraffic', () => {

  it('byte', () => {
    expect(ParseTraffic(999)).toBe('999B')
    expect(ParseTraffic(1)).toBe('1B')
    expect(ParseTraffic(0)).toBe('0B')
    expect(ParseTraffic(22)).toBe('22B')
  })

  it('KB', () => {
    expect(ParseTraffic(1999)).toBe('1KB')
    expect(ParseTraffic(1000)).toBe('1KB')
    expect(ParseTraffic(123000)).toBe('123KB')
  })

  it('MB', () => {
    expect(ParseTraffic(3222111)).toBe('3MB')
    expect(ParseTraffic(123999999)).toBe('123MB')
  })
})
