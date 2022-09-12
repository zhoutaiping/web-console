import { isRepeat, maxSection, isArray, arrRemove, arrayIsEqual, arrayRange, arraySum } from '../array'

test('isRepeat -> true', () => {
  expect(isRepeat([1, 1, 1])).toBe(true)
})

test('isRepeat -> false', () => {
  expect(isRepeat([1, 2, 3])).toBe(false)
})

test('isArray -> true', () => {
  expect(isArray([1, 2, 3])).toBe(true)
})

test('arrRemove', () => {
  expect(arrRemove([1, 2, 3], 1)).toEqual([2, 3])
})

test('arraySum', () => {
  expect(arraySum([1, 2, 3])).toBe(6)
})

test('arrayIsEqual', () => {
  expect(arrayIsEqual([1, 2, 3], [1, 2, 3])).toBe(true)
  expect(arrayIsEqual([1, 2, 3], [1, 3, 4])).toBe(false)
})

test('arrayRange', () => {
  expect(arrayRange(1, 4)).toEqual([1, 2, 3, 4])
})

test('maxSection', () => {
  expect(maxSection(0.8)).toBe(1.2)
  expect(maxSection(401)).toBe(500)
  expect(maxSection(701)).toBe(750)
})