import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

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

//Eth logo
let ethLogoMesh;
const loader = new GLTFLoader();
loader.load("models/ethLogo.gltf", (gltf) => {
  ethLogoMesh = gltf.scene;

  ethLogoMesh.position.set(1.5, -0.2, -3.5);
  ethLogoMesh.scale.set(0.6, 1, 0.5);

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

//Polyhedron
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
polyHedron.scale.set(3, 3, 3);

scene.add(polyHedron);

//Neptune
const neptuneTexture = new THREE.TextureLoader().load("./images/neptune.jpeg");

const neptune = new THREE.Mesh(
  new THREE.SphereGeometry(4, 64, 64),
  new THREE.MeshStandardMaterial({
    map: neptuneTexture,
  })
);
scene.add(neptune);
neptune.position.set(-9, 1, 300);

//Stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 50, 50);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(500));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(500).fill().forEach(addStar);

const spaceTexture = new THREE.TextureLoader().load("space-bg.avif");
scene.background = spaceTexture;

//My picture
const piaereTexture = new THREE.TextureLoader().load(["./images/piaere.jpeg"]);
const geometry = new THREE.PlaneGeometry(1, 1.25);
const material = new THREE.MeshStandardMaterial({
  map: piaereTexture,
  side: THREE.DoubleSide,
});

const piaere = new THREE.Mesh(geometry, material);
scene.add(piaere);
piaere.position.set(-0, 1, 394);
piaere.scale.set(0.8, 0.8);
piaere.rotation.x = 0.2;
piaere.rotation.y = 0.5;
piaere.rotation.z = -0.1;

//Light
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(1, 1, 1);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const controls = new OrbitControls(camera, renderer.domElement);

// Move camera on scroll
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  camera.position.z = t * -0.09;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.00025;
  camera.rotation.x = t * -0.00012;
}
document.body.onscroll = moveCamera;
moveCamera();

//Animation
function animate() {
  requestAnimationFrame(animate);

  piaere.rotation.y -= 0.01;

  ethLogoMesh.rotation.y += 0.007;

  polyHedron.rotation.x += 0.001;
  polyHedron.rotation.y += 0.0005;
  polyHedron.rotation.z += 0.0005;

  neptune.rotation.x -= 0.0005;
  neptune.rotation.z += 0.0005;
  neptune.rotation.y -= 0.007;

  renderer.render(scene, camera);
}

animate();
