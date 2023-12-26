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

// 三维坐标转屏幕坐标
export const transform3DTo2D = (camera, worldVector, viewSize) => {
  const vector = worldVector.project(camera)
  const halfWidth = viewSize.width / 2
  const halfHeight = viewSize.height / 2
  return {
    x: Math.round(vector.x * halfWidth + halfWidth),
    y: Math.round(-vector.y * halfHeight + halfHeight)
  }
}
