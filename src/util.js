import { MathUtils } from 'three'

export const generateRandomColor = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

export const generateRandomXYZ = (spread) => {
  const x = MathUtils.randFloatSpread(spread.x)
  const y = MathUtils.randFloatSpread(spread.y)
  const z = MathUtils.randFloatSpread(spread.z)
  return [x, y, z]
}
