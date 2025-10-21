import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();

export function genModel(figure) {


const canvas = document.querySelector("#c");
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas,
  alpha: true
});
const fov = 75;
const aspect = 2;
const near = 0.1;
const far = 5;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
const controls = new OrbitControls(camera, canvas);

renderer.setSize(window.innerWidth / 3, window.innerHeight / 2);
renderer.setAnimationLoop(animate);

const path = `http://localhost:3005/temp/models/`;
const modelPath = `${path}/${figure}`;
const modelType = figure.split('.').pop().toLowerCase();

if(modelType === "obj"){
  const objLoader = new OBJLoader();
  objLoader.load(
    modelPath,
    (root) => {
    scene.add(root);
  });
  
} else if(modelType === "gltf" || modelType === "glb") {
  const gltfLoader = new GLTFLoader();
  gltfLoader.load(
    modelPath, 
    (gltf) => {
    const root = gltf.scene;
    scene.add(root);
  });

  } else {
    console.warn("Tipo de modelo não suportado:", modelType);
  }

  camera.position.z = 3;

  function animate() {
    renderer.render(scene, camera);
  };

  const color = 0xffffff;
  const intensity = 2;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);

}

export function clearScene() {
  scene.traverse((child) => {
    if (child.isMesh) {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    }
  });

  scene.children = scene.children.filter(child => 
    !(child.isMesh || child.isGroup)
  );
}