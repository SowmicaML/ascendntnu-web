import React, { Component } from 'react'
import * as THREE from 'three'
import * as THREESTLLoader from 'three-stl-loader'

export class ModelRenderer extends Component {
  constructor(props) {
    super(props)
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      10000
    )
    this.camera.position.x = 0
    this.camera.position.y = 200
    this.camera.position.z = 0

    let geometry = new THREE.BoxGeometry(10, 10, 10)
    let material = new THREE.MeshNormalMaterial()
    if (this.props.wireframe) {
      material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
      })
    } else {
      material = new THREE.MeshStandardMaterial({
        color: 0xff8800,
        roughness: 0.95,
        metalness: 0.0,
      })
    }
    let mesh = new THREE.Mesh(geometry, material)
    mesh.position.x = 0
    mesh.position.y = 0
    mesh.position.z = 0
    //this.scene.add(mesh)

    var STLLoader = new THREESTLLoader(THREE)
    this.loader = new STLLoader()
    this.updateModels(props.models || [])

    var light = new THREE.HemisphereLight(0xffffff, 0x444444, 1)
    this.scene.add(light)

    this.fitToContainerHandler = this.fitToContainerHandler.bind(this)
  }

  componentDidMount() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
    })

    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.fitToContainerHandler()
    window.addEventListener('resize', this.fitToContainerHandler)

    if (this.props.autospin) {
      this.raf = window.requestAnimationFrame(this.animationStep.bind(this))
    } else {
      this.updateRendering()
    }
  }

  animationStep(timestamp) {
    this.updateRendering()
    window.requestAnimationFrame(this.animationStep.bind(this))
  }

  componentWillUnmount() {
    if (this.raf) window.cancelAnimationFrame(this.raf)
    window.removeEventListener('resize', this.fitToContainerHandler)
  }

  fitToContainerHandler(evt) {
    this.renderer.setSize(
      this.canvas.clientWidth,
      this.canvas.clientHeight,
      false
    )
    this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight
    this.camera.updateProjectionMatrix()
  }

  updateModels(models) {
    try {
      models.forEach(model => {
        this.loader.load(model, geometry => {
          var meshMaterial = null
          if (this.props.wireframe) {
            meshMaterial = new THREE.MeshBasicMaterial({
              color: 0xffffff,
              wireframe: true,
            })
          } else {
            meshMaterial = new THREE.MeshStandardMaterial({
              color: 0xff8800,
              roughness: 0.95,
              metalness: 0.0,
              side: THREE.DoubleSide,
            })
          }
          //if (geometry.hasColors) {
          //  meshMaterial = new THREE.MeshPhongMaterial({ opacity: geometry.alpha, vertexColors: THREE.VertexColors })
          //}
          geometry.translate(-360, 0, -300)
          var mesh = new THREE.Mesh(geometry, meshMaterial)
          mesh.position.set(0, 0, 0)
          mesh.rotation.set(0, 0, 0)
          let scale = 0.5
          mesh.scale.set(scale, scale, scale)
          mesh.castShadow = true
          mesh.receiveShadow = true
          this.scene.add(mesh)
          this.updateRendering()
        })
      })
    } catch (ex) {
      console.error(
        'Mangler modellen(e): ' +
          models.join(', ') +
          ', eller så kan THREE.js være utdatert.'
      )
    }
  }

  updateRendering() {
    if (typeof this.props.process === 'number') {
      let process = this.props.autospin
        ? Date.now()
        : this.props.process || Date.now()
      this.camera.position.x = 200 * Math.sin(process / 4000)
      this.camera.position.z = 200 * Math.cos(process / 4000)
      this.camera.position.y = 200 * Math.cos(process / 5000)
    } else {
      let process = this.props.process
      this.camera.position.x = process[0]
      this.camera.position.z = process[1]
      this.camera.position.y = process[2]
    }
    this.camera.lookAt(this.scene.position)
    this.renderer.render(this.scene, this.camera)
    this.renderer.setClearColor(0, 0)
  }

  render() {
    return (
      <canvas
        className="model-renderer"
        ref={c => {
          this.canvas = c
        }}
        style={this.props.style}
      />
    )
  }
}
