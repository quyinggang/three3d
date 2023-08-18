/**
 * @author Lee Stemkoski   http://www.adelphi.edu/~stemkoski/
 * 在Lee Stemkoski作者提供的最初版本基础上进行兼容重构
 * Todo：进一步重构以及功能扩展
 */

import * as THREE from 'three'

const particleVertexShader = `
  attribute vec3  customColor;
  attribute float customOpacity;
  attribute float customSize;
  attribute float customAngle;
  attribute float customVisible;

  varying vec4 vColor;
  varying float vAngle;
  
  void main() {
    if ( customVisible > 0.5 ) {
      vColor = vec4( customColor, customOpacity );
    } else {
      vColor = vec4(0.0, 0.0, 0.0, 0.0);
    }
    vAngle = customAngle;

    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_PointSize = customSize * ( 300.0 / length( mvPosition.xyz ) );
    gl_Position = projectionMatrix * mvPosition;
  }
`

const particleFragmentShader = `
  uniform sampler2D customTexture;

  varying vec4 vColor;
  varying float vAngle;

  void main() {
    float cosValue = cos(vAngle);
    float sinValue = sin(vAngle);
    vec2 coord = gl_PointCoord.xy - vec2(0.5);
    vec2 rotatedUV = vec2(cosValue * coord.x + sinValue * coord.y + 0.5, cosValue * coord.y - sinValue * coord.x + 0.5);
    gl_FragColor = vColor * texture2D(customTexture, rotatedUV);
  }
`

function Tween(timeArray, valueArray) {
  this.times = timeArray || []
  this.values = valueArray || []
}

Tween.prototype.lerp = function (t) {
  let i = 0
  let n = this.times.length
  while (i < n && t > this.times[i]) i++
  if (i == 0) return this.values[0]
  if (i == n) return this.values[n - 1]
  let p = (t - this.times[i - 1]) / (this.times[i] - this.times[i - 1])
  if (this.values[0] instanceof THREE.Vector3)
    return this.values[i - 1].clone().lerp(this.values[i], p)
  // its a float
  else return this.values[i - 1] + p * (this.values[i] - this.values[i - 1])
}

class Particle {
  constructor() {
    this.position = new THREE.Vector3()
    this.velocity = new THREE.Vector3() // units per second
    this.acceleration = new THREE.Vector3()

    this.angle = 0
    this.angleVelocity = 0 // degrees per second
    this.angleAcceleration = 0 // degrees per second, per second

    this.size = 16.0

    this.color = new THREE.Color()
    this.opacity = 1.0

    this.age = 0
    this.alive = 0
  }
  update(dt) {
    this.position.add(this.velocity.clone().multiplyScalar(dt))
    this.velocity.add(this.acceleration.clone().multiplyScalar(dt))

    // convert from degrees to radians: 0.01745329251 = Math.PI/180
    this.angle += this.angleVelocity * 0.01745329251 * dt
    this.angleVelocity += this.angleAcceleration * 0.01745329251 * dt

    this.age += dt

    // if the tween for a given attribute is nonempty,
    //  then use it to update the attribute's value

    if (this.sizeTween.times.length > 0) this.size = this.sizeTween.lerp(this.age)

    if (this.colorTween.times.length > 0) {
      let colorHSL = this.colorTween.lerp(this.age)
      this.color = new THREE.Color().setHSL(colorHSL.x, colorHSL.y, colorHSL.z)
    }

    if (this.opacityTween.times.length > 0) this.opacity = this.opacityTween.lerp(this.age)
  }
}

const Type = Object.freeze({ CUBE: 1, SPHERE: 2 })

const randomValue = (base, spread) => {
  return base + spread * (Math.random() - 0.5)
}

const randomVector3 = (base, spread) => {
  let rand3 = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
  return new THREE.Vector3().addVectors(base, new THREE.Vector3().multiplyVectors(spread, rand3))
}

/* 
	Particle Engine options:
	
	positionBase   : new THREE.Vector3(),
	positionStyle : Type.CUBE or Type.SPHERE,

	// for Type.CUBE
	positionSpread  : new THREE.Vector3(),

	// for Type.SPHERE
	positionRadius  : 10,
	
	velocityStyle : Type.CUBE or Type.SPHERE,

	// for Type.CUBE
	velocityBase       : new THREE.Vector3(),
	velocitySpread     : new THREE.Vector3(), 

	// for Type.SPHERE
	speedBase   : 20,
	speedSpread : 10,
		
	accelerationBase   : new THREE.Vector3(),
	accelerationSpread : new THREE.Vector3(),
		
	particleTexture : THREE.ImageUtils.loadTexture( 'images/star.png' ),
		
	// rotation of image used for particles
	angleBase               : 0,
	angleSpread             : 0,
	angleVelocityBase       : 0,
	angleVelocitySpread     : 0,
	angleAccelerationBase   : 0,
	angleAccelerationSpread : 0,
		
	// size, color, opacity 
	//   for static  values, use base/spread
	//   for dynamic values, use Tween
	//   (non-empty Tween takes precedence)
	sizeBase   : 20.0,
	sizeSpread : 5.0,
	sizeTween  : new Tween( [0, 1], [1, 20] ),
			
	// colors stored in Vector3 in H,S,L format
	colorBase   : new THREE.Vector3(0.0, 1.0, 0.5),
	colorSpread : new THREE.Vector3(0,0,0),
	colorTween  : new Tween( [0.5, 2], [ new THREE.Vector3(0, 1, 0.5), new THREE.Vector3(1, 1, 0.5) ] ),

	opacityBase   : 1,
	opacitySpread : 0,
	opacityTween  : new Tween( [2, 3], [1, 0] ),
	
	blendStyle    : THREE.NormalBlending (default), THREE.AdditiveBlending

	particlesPerSecond : 200,
	particleDeathAge   : 2.0,		
	emitterDeathAge    : 60	
*/
class ParticleEngine {
  constructor() {
    this.positionStyle = Type.CUBE
    this.positionBase = new THREE.Vector3()
    // cube shape data
    this.positionSpread = new THREE.Vector3()
    // sphere shape data
    this.positionRadius = 0 // distance from base at which particles start

    this.velocityStyle = Type.CUBE
    // cube movement data
    this.velocityBase = new THREE.Vector3()
    this.velocitySpread = new THREE.Vector3()
    // sphere movement data
    //   direction vector calculated using initial position
    this.speedBase = 0
    this.speedSpread = 0

    this.accelerationBase = new THREE.Vector3()
    this.accelerationSpread = new THREE.Vector3()

    this.angleBase = 0
    this.angleSpread = 0
    this.angleVelocityBase = 0
    this.angleVelocitySpread = 0
    this.angleAccelerationBase = 0
    this.angleAccelerationSpread = 0

    this.sizeBase = 0.0
    this.sizeSpread = 0.0
    this.sizeTween = new Tween()

    this.colorBase = new THREE.Vector3(0.0, 1.0, 0.5)
    this.colorSpread = new THREE.Vector3(0.0, 0.0, 0.0)
    this.colorTween = new Tween()

    this.opacityBase = 1.0
    this.opacitySpread = 0.0
    this.opacityTween = new Tween()

    this.blendStyle = THREE.NormalBlending

    this.particleArray = []
    this.particlesPerSecond = 100
    this.particleDeathAge = 1.0

    ////////////////////////
    // EMITTER PROPERTIES //
    ////////////////////////

    this.emitterAge = 0.0
    this.emitterAlive = true
    this.emitterDeathAge = 60 // time (seconds) at which to stop creating particles.

    // How many particles could be active at any time?
    this.particleCount =
      this.particlesPerSecond * Math.min(this.particleDeathAge, this.emitterDeathAge)

    this.customBufferAttributes = Object.freeze({
      customVisible: { array: [], size: 1 },
      customAngle: { array: [], size: 1 },
      customSize: { array: [], size: 1 },
      customColor: { array: [], size: 3 },
      customOpacity: { array: [], size: 1 }
    })
    this.particleGeometry = new THREE.BufferGeometry()
    this.particleMesh = new THREE.Points()
    this.particleTexture = null
    this.particleMaterial = null
  }

  setValues(parameters) {
    if (!parameters) {
      throw new Error('setValues method need parameters')
    }

    // clear any previous tweens that might exist
    this.sizeTween = new Tween()
    this.colorTween = new Tween()
    this.opacityTween = new Tween()

    for (let key in parameters) this[key] = parameters[key]

    // attach tweens to particles
    Particle.prototype.sizeTween = this.sizeTween
    Particle.prototype.colorTween = this.colorTween
    Particle.prototype.opacityTween = this.opacityTween

    // calculate/set derived particle engine values
    this.particleArray = []
    this.emitterAge = 0.0
    this.emitterAlive = true
    this.particleCount =
      this.particlesPerSecond * Math.min(this.particleDeathAge, this.emitterDeathAge)

    this.particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        customTexture: { value: this.particleTexture }
      },
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      transparent: true,
      blending: THREE.NormalBlending,
      depthTest: false,
      depthWrite: false
    })
  }

  createParticle() {
    const { positionStyle, velocityStyle } = this
    const particle = new Particle()

    if (positionStyle == Type.CUBE)
      particle.position = randomVector3(this.positionBase, this.positionSpread)
    if (positionStyle == Type.SPHERE) {
      let z = 2 * Math.random() - 1
      let t = 6.2832 * Math.random()
      let r = Math.sqrt(1 - z * z)
      let vec3 = new THREE.Vector3(r * Math.cos(t), r * Math.sin(t), z)
      particle.position = new THREE.Vector3().addVectors(
        this.positionBase,
        vec3.multiplyScalar(this.positionRadius)
      )
    }

    if (velocityStyle == Type.CUBE) {
      particle.velocity = randomVector3(this.velocityBase, this.velocitySpread)
    } else if (velocityStyle == Type.SPHERE) {
      let direction = new THREE.Vector3().subVectors(particle.position, this.positionBase)
      let speed = randomValue(this.speedBase, this.speedSpread)
      particle.velocity = direction.normalize().multiplyScalar(speed)
    }

    particle.acceleration = randomVector3(this.accelerationBase, this.accelerationSpread)
    particle.angle = randomValue(this.angleBase, this.angleSpread)
    particle.angleVelocity = randomValue(this.angleVelocityBase, this.angleVelocitySpread)
    particle.angleAcceleration = randomValue(
      this.angleAccelerationBase,
      this.angleAccelerationSpread
    )

    particle.size = randomValue(this.sizeBase, this.sizeSpread)

    const color = randomVector3(this.colorBase, this.colorSpread)
    particle.color = new THREE.Color().setHSL(color.x, color.y, color.z)

    particle.opacity = randomValue(this.opacityBase, this.opacitySpread)

    particle.age = 0
    particle.alive = 0 // particles initialize as inactive

    return particle
  }

  initialize(group) {
    const {
      particleCount,
      particleArray,
      particleGeometry,
      particleMaterial,
      blendStyle,
      customBufferAttributes
    } = this
    if (!particleMaterial || !particleGeometry || !particleCount) {
      throw new Error('please call setValues before initialize')
    }
    if (!(group instanceof THREE.Object3D)) {
      throw new Error('parameter must be Object3D')
    }
    const geometryPosition = []
    const { customVisible, customColor, customOpacity, customSize, customAngle } =
      customBufferAttributes
    for (let index = 0; index < particleCount; index++) {
      const particle = this.createParticle()
      const { position, color, opacity, size, angle, alive } = particle
      geometryPosition.push(position.x, position.y, position.z)
      customColor.array.push(color.r, color.g, color.b)
      customVisible.array.push(alive)
      customOpacity.array.push(opacity)
      customSize.array.push(size)
      customAngle.array.push(angle)
      particleArray.push(particle)
    }
    particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(geometryPosition, 3))
    for (const [key, value] of Object.entries(customBufferAttributes)) {
      particleGeometry.setAttribute(key, new THREE.Float32BufferAttribute(value.array, value.size))
    }

    particleMaterial.blending = blendStyle
    if (blendStyle != THREE.NormalBlending) {
      particleMaterial.depthTest = false
    }

    this.particleMesh = new THREE.Points(particleGeometry, particleMaterial)
    group.add(this.particleMesh)
  }
  update(dt) {
    const recycleIndices = []
    const { particleArray, particleGeometry, particleCount, particleDeathAge } = this
    const { customVisible, customColor, customOpacity, customSize, customAngle, position } =
      particleGeometry.attributes
    // update particle data
    for (let index = 0; index < particleCount; index++) {
      const currentParticle = particleArray[index]
      if (currentParticle.alive) {
        currentParticle.update(dt)
        // check if particle should expire
        // could also use: death by size<0 or alpha<0.
        if (currentParticle.age > particleDeathAge) {
          currentParticle.alive = 0.0
          recycleIndices.push(index)
        }

        // 更新几何体属性
        const { alive, color, opacity, size, angle, position: particlePosition } = currentParticle
        position.setXYZ(index, particlePosition.x, particlePosition.y, particlePosition.z)
        customColor.setXYZ(index, color.r, color.g, color.b)
        customVisible.setX(index, alive)
        customOpacity.setX(index, opacity)
        customSize.setX(index, size)
        customAngle.setX(index, angle)
      }
    }
    particleGeometry.attributes.position.needsUpdate = true
    particleGeometry.attributes.customVisible.needsUpdate = true
    particleGeometry.attributes.customColor.needsUpdate = true
    particleGeometry.attributes.customOpacity.needsUpdate = true
    particleGeometry.attributes.customSize.needsUpdate = true
    particleGeometry.attributes.customAngle.needsUpdate = true

    // check if particle emitter is still running
    if (!this.emitterAlive) return

    // if no particles have died yet, then there are still particles to activate
    if (this.emitterAge < particleDeathAge) {
      // determine indices of particles to activate
      let startIndex = Math.round(this.particlesPerSecond * (this.emitterAge + 0))
      let endIndex = Math.round(this.particlesPerSecond * (this.emitterAge + dt))
      if (endIndex > this.particleCount) endIndex = this.particleCount

      for (let i = startIndex; i < endIndex; i++) this.particleArray[i].alive = 1.0
    }

    // if any particles have died while the emitter is still running, we imediately recycle them
    recycleIndices.forEach((itemIndex) => {
      this.particleArray[itemIndex] = this.createParticle()
      this.particleArray[itemIndex].alive = 1.0 // activate right away
      const { x, y, z } = this.particleArray[itemIndex].position
      position.setXYZ(itemIndex, x, y, z)
    })

    if (recycleIndices.length > 0) {
      particleGeometry.attributes.position.needsUpdate = true
    }

    // stop emitter?
    this.emitterAge += dt
    if (this.emitterAge > this.emitterDeathAge) this.emitterAlive = false
  }

  destroy(group) {
    if (!(group instanceof THREE.Object3D)) return
    this.particleMesh && group.remove(this.particleMesh)
    this.particleMesh = null
  }
}

export { ParticleEngine, Type as ParticleType, Tween, Particle }
