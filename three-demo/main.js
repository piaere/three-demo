import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { WireframeGeometry } from "three";

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

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

let ethLogoMesh;
const loader = new GLTFLoader();
loader.load("models/ethLogo.gltf", (gltf) => {
  ethLogoMesh = gltf.scene;

ethLogoMesh.position.set(2,-0.2,-3)
ethLogoMesh.scale.set(0.6,1,0.5)

  let g = ethLogoMesh.children[0].geometry;
  let m = ethLogoMesh.children[0].material;
  let p = g.attributes.position;
  let c = new THREE.Color();
  let colors = [];
  for (let i = 0; i < p.count; i++) {
    c.set(Math.random() < 0.1 ? 0xff00ff : 0x0000ff);
    colors.push(c.r, c.g, c.b);
  }
  g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  m.vertexColors = true;

  scene.add(ethLogoMesh);
});

//Eth logo
const geometry = new THREE.OctahedronGeometry(1, 0, 0);
const material = new THREE.MeshStandardMaterial({ color: 0x9900ff });
const octaHedron = new THREE.Mesh(geometry, material);
// scene.add(octaHedron);
octaHedron.position.set(1, 0, 1);

const verticesOfCube = [
  -0, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1, -1, -1, 1, 1, -1, 1, 1, 1, 1, -1,
  1, 1,
];

const indicesOfFaces = [
  2, 1, 0, 0, 3, 2, 0, 4, 7, 7, 3, 0, 0, 1, 5, 5, 4, 0, 1, 2, 6, 6, 5, 1, 2, 3,
  7, 7, 6, 2, 4, 5, 6, 6, 7, 4,
];

const geometry2 = new THREE.PolyhedronGeometry(
  verticesOfCube,
  indicesOfFaces,
  16,
  2
);
const material2 = new THREE.MeshStandardMaterial({
  color: 0x9900ff,
  wireframe: true,
});
const polyHedron = new THREE.Mesh(geometry2, material2);

scene.add(polyHedron);

//Moon
const moonTexture = new THREE.TextureLoader().load("moon.png");
const normalTexture = new THREE.TextureLoader().load("moon-texture.jpeg");
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(4, 64, 64),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalTexture: normalTexture,
  })
);
scene.add(moon);
moon.position.set(-6, 4, 45);

//Light
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(1, 1, 1);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

//Helpers
// const lightHelper = new THREE.PointLightHelper(pointLight);
// const gridHelper = new THREE.GridHelper(20, 50);
// scene.add(lightHelper, gridHelper);

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

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  // moon.rotation.x += 0.05;
  // moon.rotation.y += 0.075;
  // moon.rotation.z += 0.05;

  // jeff.rotation.y += 0.01;
  // jeff.rotation.z += 0.01;

  camera.position.z = t * -0.09;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0005;
  camera.rotation.x = t * -0.0005;
  
}

document.body.onscroll = moveCamera;
moveCamera();

function animate() {
  requestAnimationFrame(animate);

  

  // octaHedron.rotation.x += 0.0005;
  // octaHedron.rotation.z -= 0.0005;
  ethLogoMesh.rotation.y += 0.007;
  polyHedron.rotation.x += 0.001;
  polyHedron.rotation.y += 0.0005;
  polyHedron.rotation.z += 0.0005;

  moon.rotation.x -= 0.0005;
  moon.rotation.z += 0.0005;
  moon.rotation.y -= 0.007;
  // controls.update();
  renderer.render(scene, camera);
}

animate();
