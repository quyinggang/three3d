import * as THREE from 'three'

export const generateRandomColor = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

export const generateRandomXYZ = (spread) => {
  const x = THREE.MathUtils.randFloatSpread(spread.x)
  const y = THREE.MathUtils.randFloatSpread(spread.y)
  const z = THREE.MathUtils.randFloatSpread(spread.z)
  return [x, y, z]
}
