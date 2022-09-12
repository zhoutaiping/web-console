import { labelView, byteView, bitsView, numView, formatNumber, priceView, formatSeconds } from '../filter'

test('labelView -> 1', () => {
  expect(labelView(1, [{label: 'one', value: 1}])).toBe('one')
})

test('numView', () => {
  expect(numView(20000)).toBe('2.00 万')
  expect(numView(200000000)).toBe('2.00 亿')
})

test('byteView', () => {
  expect(byteView(1)).toBe('1 B')
  expect(byteView(1000)).toBe('1000 B')
  expect(byteView(1024 * 1024)).toBe('1.00 MB')
  expect(byteView(1024 * 1024 * 1024)).toBe('1.00 GB')
  expect(byteView(1024 * 1024 * 1024 * 1024)).toBe('1.00 TB')
})

test('bitsView', () => {
  expect(bitsView(1)).toBe('1 bps')
  expect(bitsView(1000)).toBe('1.00 Kbps')
  expect(bitsView(1000000)).toBe('1.00 Mbps')
  expect(bitsView(1000000000)).toBe('1.00 Gbps')
  expect(bitsView(1000000000000)).toBe('1.00 Tbps')
})

test('formatNumber', () => {
  expect(formatNumber(1)).toBe('1')
  expect(formatNumber(1000)).toBe('1,000')
  expect(formatNumber(1000000)).toBe('1,000,000')
  expect(formatNumber(1000000000)).toBe('1,000,000,000')
  expect(formatNumber(1000000000000)).toBe('1,000,000,000,000')
})

test('priceView', () => {
  expect(priceView(1)).toBe('1.00')
  expect(priceView(1000)).toBe('1,000.00')
  expect(priceView(1000000)).toBe('1,000,000.00')
  expect(priceView(1000000000)).toBe('1,000,000,000.00')
  expect(priceView(1000000000000)).toBe('1,000,000,000,000.00')
})

test('formatSeconds', () => {
  expect(formatSeconds(1)).toBe('1秒')
  expect(formatSeconds(60)).toBe('60秒')
  expect(formatSeconds(61)).toBe('1分1秒')
  expect(formatSeconds(7200)).toBe('2小时0秒')
})
