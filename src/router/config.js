import { TYPE_ALIAS } from '@/tools/constants'

const threeBasicConfigList = [
  {
    path: '/base',
    title: '基本场景',
    componentName: 'BasicScene'
  },
  {
    path: '/room',
    title: '黑夜中的小屋',
    componentName: 'RoomScene'
  },
  {
    path: '/earth',
    title: '地球天体',
    componentName: 'EarthScene'
  },
  {
    path: '/fly',
    title: '飞舞的光点',
    componentName: 'FlyScene'
  },
  {
    path: '/glow',
    title: '场景部分模型辉光',
    componentName: 'GlowScene'
  },
  {
    path: '/renderTarget',
    title: '渲染目标对象',
    componentName: 'RenderTarget'
  },
  {
    path: '/audio',
    title: '音频可视化',
    componentName: 'AudioScene'
  },
  {
    path: '/viewport',
    title: '分屏绘制',
    componentName: 'ViewportScene'
  },
  {
    path: '/surroundLight',
    title: '具象化灯光',
    componentName: 'SurroundLight'
  },
  {
    path: '/preview',
    title: '场景预览的N种实现方法',
    componentName: 'PreviewScene'
  },
  {
    path: '/panorama',
    title: '全景图',
    componentName: 'PanoramaScene'
  },
  {
    path: '/keyboard',
    title: '键盘控制物体移动',
    componentName: 'KeyboardScene'
  },
  {
    path: '/motion',
    title: '曲线运动Flow方案',
    componentName: 'CurveMotion'
  },
  {
    path: '/camera',
    title: '视角切换',
    componentName: 'CameraView'
  },
  {
    path: '/label',
    title: '标签的N种实现方法',
    componentName: 'LabelScene'
  },
  {
    path: '/points',
    title: '粒子形状变换',
    componentName: 'PointsTransform'
  },
  {
    path: '/map',
    title: '中国地图',
    componentName: 'MapScene'
  },
  {
    path: '/wireframe',
    title: '线框化的N种实现方式',
    componentName: 'WireframeScene'
  },
  {
    path: '/city',
    title: '城市建筑模型加载',
    componentName: 'CityScene'
  },
  {
    path: '/flow',
    title: '纹理流动',
    componentName: 'FlowScene'
  },
  {
    path: '/lineWidth',
    title: '有宽度的线条',
    componentName: 'LineWidthScene'
  }
]

const shaderConfigList = [
  {
    path: '/shaderBasic',
    title: 'shader之最小逻辑',
    componentName: 'BasicShader'
  },
  {
    path: '/shaderDot',
    title: 'shader之圆点粒子',
    componentName: 'DotShader'
  },
  {
    path: '/shaderFrag',
    title: 'shader之场景分割',
    componentName: 'FragShader'
  },
  {
    path: '/shaderPeriodic',
    title: 'shader之周期运动',
    componentName: 'PeriodicShader'
  },
  {
    path: '/shaderMix',
    title: 'shader之颜色渐变',
    componentName: 'MixShader'
  },
  {
    path: '/shaderStep',
    title: 'shader之step函数',
    componentName: 'StepShader'
  },
  {
    path: '/shaderTexture',
    title: 'shader之纹理映射',
    componentName: 'TextureShader'
  },
  {
    path: '/shaderUV',
    title: 'shader之同心圆环',
    componentName: 'UVShader'
  },
  {
    path: '/shaderNormal',
    title: 'shader之六色立方体',
    componentName: 'NormalShader'
  },
  {
    path: '/shaderFragUV',
    title: 'shader之FragCoord与UV',
    componentName: 'FragUVShader'
  },
  {
    path: '/shaderGlow',
    title: 'shader之外发光',
    componentName: 'GlowShader'
  },
  {
    path: '/shaderInner',
    title: 'shader之内发光',
    componentName: 'InnerGlowShader'
  },
  {
    path: '/flashing',
    title: 'shader之闪烁效果',
    componentName: 'FlashingShader'
  },
  {
    path: '/shaderRotate',
    title: 'shader之旋转圆环',
    componentName: 'RotateShader'
  },
  {
    path: '/shaderSpread',
    title: 'shader之涟漪扩散',
    componentName: 'SpreadShader'
  },
  {
    path: '/shaderShape',
    title: 'shader之二维图形',
    componentName: 'ShapeShader'
  },
  {
    path: '/shaderTransform',
    title: 'shader之变换矩阵',
    componentName: 'TransformShader'
  },
  {
    path: '/shaderSweep',
    title: 'shader之扇形扫描',
    componentName: 'SweepShader'
  },
  {
    path: '/shaderRise',
    title: 'shader之缓动上升',
    componentName: 'RiseShader'
  },
  {
    path: '/shaderTrail',
    title: 'shader之拖尾飘动',
    componentName: 'TrailShader'
  },
  {
    path: '/shaderVortex',
    title: 'shader之旋涡扭曲',
    componentName: 'VortexShader'
  },
  {
    path: '/shaderNoise',
    title: 'shader之随机与噪声',
    componentName: 'NoiseShader'
  },
  {
    path: '/shaderFBM',
    title: 'shader之分形布朗运动',
    componentName: 'FBMShader'
  }
]

const effectConfigList = [
  {
    path: '/particleEffect',
    title: '粒子引擎应用',
    componentName: 'ParticleEffect'
  },
  {
    path: '/flyLineEffect',
    title: '飞线效果',
    componentName: 'FlyLineEffect'
  },
  {
    path: '/transitionEffect',
    title: '转场过渡',
    componentName: 'TransitionEffect'
  },
  {
    path: '/cityGrowEffect',
    title: '城市建筑生长效果',
    componentName: 'CityGrowEffect'
  },
  {
    path: '/cityEffect',
    title: '城市特效应用',
    componentName: 'CityEffect'
  }
]

const configList = [
  {
    type: TYPE_ALIAS.basic,
    list: [...threeBasicConfigList]
  },
  {
    type: TYPE_ALIAS.shaders,
    list: [...shaderConfigList]
  },
  {
    type: TYPE_ALIAS.effects,
    list: [...effectConfigList]
  }
]

export default configList
