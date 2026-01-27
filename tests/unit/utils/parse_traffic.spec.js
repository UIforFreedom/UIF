import {
  ParseTraffic,
  ParseURL
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

  it('GB', () => {
    expect(ParseTraffic(3222111000)).toBe('3GB')
    expect(ParseTraffic(123999999000)).toBe('123GB')
  })

  it('GB', () => {
    expect(ParseTraffic(3222111000111)).toBe('3TB')
    expect(ParseTraffic(123999999000111)).toBe('123TB')
  })
})

describe('Utils:ParseURL', () => {

  it('url', () => {
    expect(ParseURL('http://abc.com//')).toBe('http://abc.com')
    expect(ParseURL('http://abc.com//path')).toBe('http://abc.com')
    expect(ParseURL('http://abc.com/path')).toBe('http://abc.com')
    expect(ParseURL('http://abc.com:80/path')).toBe('http://abc.com')
    expect(ParseURL('http://abc.com:80/')).toBe('http://abc.com')

    expect(ParseURL('http://abc.com:443/')).toBe('http://abc.com:443')
    expect(ParseURL('http://abc.com:1999/')).toBe('http://abc.com:1999')
    expect(ParseURL('https://abc.com:443/')).toBe('https://abc.com')
    expect(ParseURL('https://abc.com:443/abcpath')).toBe('https://abc.com')
    expect(ParseURL('https://127.0.0.1:443/abcpath')).toBe('https://127.0.0.1')
    expect(ParseURL('http://127.0.0.1:443/abcpath')).toBe('http://127.0.0.1:443')
  })
})
