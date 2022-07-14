import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});
// document.body.appendChild(renderer.domElement);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 5;

//Eth logo
const geometry = new THREE.OctahedronGeometry(1, 0, 0);
const material = new THREE.MeshStandardMaterial({ color: 0x9900ff });
const octaHedron = new THREE.Mesh(geometry, material);
scene.add(octaHedron);

//Moon
const moonTexture = new THREE.TextureLoader().load("moon.png");
const normalTexture = new THREE.TextureLoader().load("moon-texture.jpeg");
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(2, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalTexture: normalTexture,
  })
);
scene.add(moon);
moon.position.set(4, 4, 4);

//Light
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20, 20, 20);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

//Helpers
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(20, 50);
scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(500));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

const spaceTexture = new THREE.TextureLoader().load("space-bg.avif");
scene.background = spaceTexture;

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  octaHedron.rotation.x += 0.0005;
  octaHedron.rotation.z -= 0.0005;
  octaHedron.rotation.y += 0.007;
  moon.rotation.x -= 0.0005;
  moon.rotation.z += 0.0005;
  moon.rotation.y -= 0.007;
  controls.update();
}

animate();
