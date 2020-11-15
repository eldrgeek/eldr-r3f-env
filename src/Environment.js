import { useEffect } from 'react'
import * as THREE from 'three'
import { useThree, useLoader } from 'react-three-fiber'
import { HDRCubeTextureLoader } from 'three/examples/jsm/loaders/HDRCubeTextureLoader'


export default function Environment({ background = false }) {
  const { gl, scene } = useThree()

  var urls = [0, 1, 2, 3, 4, 5].map(n => `./3072_${n}.jpg`);

  const [cubeMap] = useLoader(THREE.CubeTextureLoader, [
    urls
  ], loader => {
    loader.setPath('/sanders/')
  })
  useEffect(() => {
    const gen = new THREE.PMREMGenerator(gl)
    gen.compileEquirectangularShader()
    const hdrCubeRenderTarget = gen.fromCubemap(cubeMap)
    cubeMap.dispose()
    gen.dispose()
    if (background) scene.background = hdrCubeRenderTarget.texture
    scene.environment = hdrCubeRenderTarget.texture
    return () => (scene.environment = scene.background = null)
  }, [gl, background, scene.background, scene.environment, cubeMap])
  return null
}
