import './style.scss'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import backgroundVertexShader from './shaders/background/vertex.glsl'
import backgroundFragmentShader from './shaders/background/vertex.glsl'


const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()

const textureLoader = new THREE.TextureLoader()

const gtlfLoader = new GLTFLoader()

const bakedTexture = textureLoader.load('baked.jpg')

bakedTexture.flipY = false
bakedTexture.encoding = THREE.sRGBEncoding

const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture})


const button1Material = new THREE.MeshBasicMaterial({ color: 'white'})

const button2Material = new THREE.MeshBasicMaterial({ color: 'white'})

const button3Material = new THREE.MeshBasicMaterial({ color: 'white'})

const button4Material = new THREE.MeshBasicMaterial({ color: 'white'})




let buttons = []

gtlfLoader.load(
  'buttonsDevice.glb',
  (gltf) => {
    scene.add(gltf.scene)



    const bakedMesh = gltf.scene.children.find((child) => {
      return child.name === 'box'
    })
  gltf.scene.children.map(x=> {
    if (x.name.includes('Button')){
    if (x.name.includes('1')){
      x.material = button1Material
      buttons.push(x)
    }

    if (x.name.includes('2')){
      x.material = button2Material
      buttons.push(x)
    }

    if (x.name.includes('3')){
      x.material = button3Material
      buttons.push(x)
    }

    if (x.name.includes('4')){
      x.material = button4Material
      buttons.push(x)
    }
    }
  })
    console.log(buttons)

    bakedMesh.material = bakedMaterial
  }
)


const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () =>{


  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2 ))

  //Update fireFlies
  // fireFliesMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2 )

})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.maxPolarAngle = Math.PI / 2 - 0.1
const light = new THREE.AmbientLight( 0x404040 ) // soft white light
scene.add( light )
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
})
renderer.outputEncoding = THREE.sRGBEncoding
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const raycaster = new THREE.Raycaster()

//Mouse
const mouse = new THREE.Vector2()
window.addEventListener('mousemove', function (e) {
  mouse.x = e.clientX / sizes.width * 2 - 1
  mouse.y = -( e.clientY / sizes.height * 2 -1)

  console.log(mouse)
})
window.addEventListener('click', function (e) {

  if(currentIntersect){


  }
})

let currentIntersect = null

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0
const tick = () =>
{


  const elapsedTime = clock.getElapsedTime()
  // const deltaTime = elapsedTime - previousTime
  // previousTime = elapsedTime
  //update shaders

  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(buttons)
  console.log(buttons)

  for(const object of buttons){
    object.material.color.set('#ff0000')
  }

  for(const intersect of intersects){
    intersect.object.material.color.set('#0000ff')
  }

  if(intersects.length){
    if(currentIntersect === null){
      console.log('mouse enter')
    }

    currentIntersect = intersects[0]

  }else{
    if(currentIntersect){
      console.log('mouse leave')
    }
    currentIntersect = null
  }



  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
