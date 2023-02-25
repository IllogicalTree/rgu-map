import * as THREE from "https://cdn.skypack.dev/three@0.130.0";
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.130.0/examples/jsm/controls/OrbitControls.js';
import { SVGLoader } from 'https://cdn.skypack.dev/three@0.130.0/examples/jsm/loaders/SVGLoader.js';

// svg.js
const fillMaterial = new THREE.MeshBasicMaterial({ color: "#F3FBFB" });
const stokeMaterial = new THREE.LineBasicMaterial({
  color: "#00A5E6",
});
const renderSVG = (svg) => {
  const loader = new SVGLoader();
  const svgData = loader.parse(svg);
  const svgGroup = new THREE.Group();
  const updateMap = [];

  svgGroup.scale.y *= -1;
  svgData.paths.forEach((path) => {
    const shapes = SVGLoader.createShapes(path);

    shapes.forEach((shape) => {
      const meshGeometry = new THREE.ExtrudeBufferGeometry(shape, {
        depth: 3,
        bevelEnabled: false,
      });
      const linesGeometry = new THREE.EdgesGeometry(meshGeometry);
      const mesh = new THREE.Mesh(meshGeometry, fillMaterial);
      const lines = new THREE.LineSegments(linesGeometry, stokeMaterial);

      updateMap.push({ shape, mesh, lines });
      svgGroup.add(mesh, lines);
    });
  });

  const box = new THREE.Box3().setFromObject(svgGroup);
  const size = box.getSize(new THREE.Vector3());
  const yOffset = size.y / -2;
  const xOffset = size.x / -2;

  // Offset all of group's elements, to center them
  svgGroup.children.forEach((item) => {
    item.position.x = xOffset;
    item.position.y = yOffset;
  });
  svgGroup.rotateX(-Math.PI / 2);

  return {
    object: svgGroup,
  };
};
// scene.js
const setupScene = (container) => {
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.01,
    1e5
  );
  const ambientLight = new THREE.AmbientLight("#888888");
  const pointLight = new THREE.PointLight("#ffffff", 2, 800);
  const controls = new OrbitControls(camera, renderer.domElement);
  const animate = () => {
    renderer.render(scene, camera);
    controls.update();

    requestAnimationFrame(animate);
  };

  renderer.setSize(window.innerWidth, window.innerHeight);
  scene.add(ambientLight, pointLight);
  camera.position.z = 50;
  camera.position.x = 50;
  camera.position.y = 50;
  controls.enablePan = false;

  container.append(renderer.domElement);
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  animate();

  return scene;
};
// svg.js

/*
const svg = `<svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" height="100%" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" xml:space="preserve" width="100%" version="1.1" viewBox="0 0 24 24">
<defs/>
<g id="Untitled">
<path d="M7.15256e-07+7.15256e-07L24+7.15256e-07L24+24L7.15256e-07+24L7.15256e-07+7.15256e-07M6.30667+20.0533C6.84+21.1867+7.89333+22.12+9.69333+22.12C11.6933+22.12+13.0667+21.0533+13.0667+18.72L13.0667+11.0133L10.8+11.0133L10.8+18.6667C10.8+19.8133+10.3333+20.1067+9.6+20.1067C8.82667+20.1067+8.50667+19.5733+8.14667+18.9467L6.30667+20.0533M14.28+19.8133C14.9467+21.12+16.2933+22.12+18.4+22.12C20.5333+22.12+22.1333+21.0133+22.1333+18.9733C22.1333+17.0933+21.0533+16.2533+19.1333+15.4267L18.5733+15.1867C17.6+14.7733+17.1867+14.4933+17.1867+13.8267C17.1867+13.28+17.6+12.8533+18.2667+12.8533C18.9067+12.8533+19.3333+13.1333+19.72+13.8267L21.4667+12.6667C20.7333+11.3867+19.6933+10.8933+18.2667+10.8933C16.2533+10.8933+14.96+12.1733+14.96+13.8667C14.96+15.7067+16.04+16.5733+17.6667+17.2667L18.2267+17.5067C19.2667+17.96+19.88+18.24+19.88+19.0133C19.88+19.6533+19.28+20.12+18.3467+20.12C17.24+20.12+16.6+19.5467+16.12+18.7467L14.28+19.8133Z" opacity="1" fill="#000000"/>
</g>
</svg>`;
*/

//import svg from './test.svg'
//const svg = require("./test.svg")
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1563.59 604.1">
<defs>
  <style>
    .cls-1,
    .cls-3 {
      fill: #662483;
    }
    .cls-1 {
      opacity: 0.55;
    }
    .cls-2 {
      fill: #d5cbe2;
    }
   
    .cls-4 {
      fill: #b02f7c;
    }
    .cls-5 {
      fill: #3a53a0;
    }
    .cls-6 {
      fill: #f9b233;
    }
    .cls-7 {
      fill: #be1622;
    }
    .cls-2:hover, .cls-3:hover, .cls-4:hover, .cls-5:hover, .cls-6:hover, .cls-7:hover {
      opacity: 0.5;
    }
  </style>
</defs>
<g id="whole">
  <path
    class="cls-1"
    d="M192,279.21l95.62,107.31c-6,5.23-41.8,37.2-42.65,88.74-1.15,69,61.36,105.17,64,106.63,35.66,19.83,84.91,23.75,123.14-1.38,23.21-15.26,44.48-47.92,46.77-48.15q37.84,45.74,75.67,91.49l-24.07,24.76a319.42,319.42,0,0,0,85.3,64c90.28,46.33,177.88,35.76,212.56,29.58l3.44,7.56L1741.83,603.9q6.89-16.51,13.76-33-70.5-37.15-141-74.29l-337.75,53.65q1.37,4.47,2.75,8.94l-79.8,9.64,28.89-55c9.77,3.83,35.1,12.22,64.66,4.13,39.66-10.85,70.91-46.95,75-88.74.38-4,4-48.48-28.21-79.79a91.5,91.5,0,0,0-28.2-18.58l20.64-38.52,185.73,90.11,57.78-114.19-97.68-45.4,14.45-22.7-97-46.09-38.52,77.74L1314,215.24q7.92-29.58,15.82-59.16a251.8,251.8,0,0,0-94.93-6.19c-58.31,7.47-99.21,34.06-116.25,45.4-7.31,4.86-13.16,9.24-17.2,12.38L829.68,427.11c-2.89,3.52-19.92,23.61-48.84,25.45-36.13,2.3-58.17-26-59.85-28.2L549.71,213.86l-35.09-26.14q-12.72,24.76-25.45,49.53Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="_2nd_Floor" data-name="2nd Floor">
  <path
    class="cls-2"
    d="M1015.8,484.28q7.22,44,14.44,88.05L1183,553.07l26.82-54.34a103.05,103.05,0,0,1-31-37.15c-1.93-4-22-47,0-88.74A92.12,92.12,0,0,1,1202.9,344l-8.94-5.5Z"
    transform="translate(-192 -147.9)"
  />
  <path
    class="cls-2"
    d="M575.66,547,598.36,571q-5.83,8.26-11.69,16.51A261.79,261.79,0,0,0,810.92,657c5.74,27.74,9,63,14.76,90.73-31.49,5.64-97.31,9.17-173.76-12.88C591.1,717.32,550,674.72,527.82,654.19c9.4-9.17,14.67-15.59,24.07-24.76-12.15-12.84-18-23.68-30.2-36.53C537.74,578.92,559.61,560.94,575.66,547Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="N309">
  <path
    class="cls-3"
    d="M503.31,274.47c29.05,40.36,63.14,80.71,92.18,121.07,22-15.59,39-31.18,61-46.78L544.59,212.1Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="N310">
  <path
    class="cls-3"
    d="M609.48,391.34l62.67,76.43,47.09-37L656,355.26Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="Main_Atrium" data-name="Main Atrium">
  <circle class="cls-3" cx="177.69" cy="329.67" r="107.94" />
</g>
<g id="N311">
  <path
    class="cls-3"
    d="M664.36,480.61c9.23,10.45,24.09,27.12,50.14,38.75a155.29,155.29,0,0,0,84.61,11.7q-7.23-37.5-14.45-75a54.2,54.2,0,0,1-61.91-22C702.57,449.66,684.54,465,664.36,480.61Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="N318">
  <path
    class="cls-3"
    d="M836.94,568.89l-15.82-45.4-18.57,4.82q-6.88-35.08-13.76-70.17a98.17,98.17,0,0,0,37.83-16.51l47.47,57.78-8.94,6.2,28.2,33a95.71,95.71,0,0,1-56.41,30.27Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="N317">
  <path
    class="cls-3"
    d="M764.94,536.1q-2.3,20.64-4.58,41.28a113.54,113.54,0,0,0,71.54-8.26q-6.2-21.33-12.38-42.65a87.77,87.77,0,0,1-54.58,9.63Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="N318a">
  <path
    class="cls-3"
    d="M872.25,505.26c4.74,6.42,11.78,13.42,16.51,19.84l32.11-22.48q-9.18-11.91-18.35-23.84C893.2,487.8,881.58,496.24,872.25,505.26Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="N319">
  <path
    class="cls-3"
    d="M905.73,475.57l17,23.84,7.34-3.66,7.79,10.08,10.55-9.63q-14-17.88-28-35.77Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="N320">
  <path
    class="cls-3"
    d="M947.92,456.31,967.64,482l65.12-52.74L1002,392.56l-43.11,36.23L972.23,449l-9.17,6-5-5.5Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="N325">
  <path
    class="cls-3"
    d="M1041,267.59,1074.5,313l5.5-4.12,9.17,12.84a647,647,0,0,1,50.91-40.36c15.54-11.1,30.62-20.83,44.94-29.35q-17-34.86-33.94-69.71A679.46,679.46,0,0,0,1041,267.59Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="N328">
  <path
    class="cls-3"
    d="M1154.52,180.46q16.29,33.82,32.56,67.64a184.41,184.41,0,0,1,60.77-16.74l-4.59-59.16,3-.91q2.52,29.93,5,59.84a121.64,121.64,0,0,1,60.53,6.42l5.73-18.34-6.65-3.44q7-28,14-56a244.61,244.61,0,0,0-170.37,20.64Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="N331">
  <path
    class="cls-3"
    d="M1363.87,233.84q17.39-35.44,34.78-70.88l84,39.63q-5.31,11.29-10.61,22.57l14.15,6.66q-12.24,24.87-24.46,49.76Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="N334">
  <path
    class="cls-3"
    d="M1466.9,287.08l25.38-52.58,30.57,14.06-26,52.28Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="N336">
  <path
    class="cls-4"
    d="M1493.2,318l41,19.87q16.65-33.78,33.32-67.56l-40.66-20.49Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="N329">
  <path
    class="cls-4"
    d="M1335.13,288.31c13.35,6.52,28.23,14.26,41.58,20.79,5.81-11.62,11.62-25.07,17.43-36.69-13.66-7.34-27.31-12.84-41-20.18C1347.67,264.66,1340.64,275.87,1335.13,288.31Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="N332">
  <path
    class="cls-4"
    d="M1381.15,310.78c8.46,4.28,18.14,10.39,26.6,14.67l19.56-36.38-30-14.37C1392.36,287.34,1386.14,298.14,1381.15,310.78Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="N339">
  <path
    class="cls-3"
    d="M1205,469a80,80,0,0,1-16.81-40.05,82.82,82.82,0,0,1,7-43.41,85.15,85.15,0,0,1,32.41-36.69l28.74,16.2Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="N340">
  <path
    class="cls-3"
    d="M1236.08,417q11.76-25.83,23.54-51.67l101.2,49.53a67,67,0,0,1-14.68,57.17Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="N341">
  <path
    class="cls-3"
    d="M1208.25,472.05a59.5,59.5,0,0,0,28.13,19l-7,11.92a80,80,0,0,0,21.71,8.87c35.66,8.67,65-11,69.09-13.76a88.75,88.75,0,0,0,22.93-23.24l-110.06-55Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="N346">
  <path
    class="cls-4"
    d="M840.15,659.46Q838.1,642.73,836,626l78-11q2.06,17.88,4.12,35.77Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="N345">
  <path
    class="cls-3"
    d="M820,639.75l10.55-2.3,6.42,28,88-13.3q-1.83-16.29-3.67-32.56h16.06l14.67,99.51L836,738.8Q828,689.27,820,639.75Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="N344">
  <path
    class="cls-3"
    d="M940.43,618.5l20.49-2.45q2,13.76,4,27.52l110.68-15.9q6,37.46,11.92,74.9L957.86,723.36Z"
    transform="translate(-192 -147.9)"
  />
  <path
    class="cls-3"
    d="M1078.17,609q6.87,45.4,13.75,90.8l43.11-7.34,41.73-75.21-7.79-45.4-74.29,11.93.45,10.54-12.84.92q1.38,6.42,2.75,12.84Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="bathroom_1" data-name="bathroom 1">
  <path
    class="cls-5"
    d="M624,508.43l26.29,26.3q14.84-17.28,29.66-34.55L659.46,480Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="bathroom_2" data-name="bathroom 2">
  <path
    class="cls-5"
    d="M725.81,572.48l30,7.34,4.59-44.33-24.16-4.28Q731,551.84,725.81,572.48Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="Layer_39" data-name="Layer 39">
  <path
    class="cls-5"
    d="M1133.66,289.53l12.23,19.57,25.37-20.49-13.76-17.43Z"
    transform="translate(-192 -147.9)"
  />
  <path
    class="cls-5"
    d="M1142.22,315.82l12.23,15.9,26.9-22.93-11.92-15.29Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="Accessible_toilet_1" data-name="Accessible toilet 1">
  <path
    class="cls-6"
    d="M673.68,525.1l21.1,14.21L703,519.13l-17.88-11.92Q679.41,516.15,673.68,525.1Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="Accessible_toilet_2" data-name="Accessible toilet 2">
  <path
    class="cls-6"
    d="M1207.49,272.87l5.5,16.05,23.39-6.88q-2.3-9.18-4.58-18.35Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="Accessible_toilet_3" data-name="Accessible toilet 3">
  <path
    class="cls-6"
    d="M1417.07,317.35l11,6.42q6.18-10.32,12.38-20.64l-14.22-4.58Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="lift_1" data-name="lift 1">
  <path
    class="cls-7"
    d="M516.38,546.19l11,16.51,21.09-16.05c-4-4.75-8.23-11.11-12-15.36C530.18,535.26,522.65,542.22,516.38,546.19Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="lift_2" data-name="lift 2">
  <path
    class="cls-7"
    d="M583.8,442.09l15.28,18.65,16.21-12.23q-7.35-9-14.68-18Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="lift_3" data-name="lift 3">
  <path
    class="cls-7"
    d="M1046.37,387.36l7.34,11.47,17.58-12.23L1063,375.44Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="lift_4" data-name="lift 4">
  <path
    class="cls-7"
    d="M1306.24,349.61l4.59-11,19.87,8.86-4.89,11.62Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="lft_5" data-name="lft 5">
  <path
    class="cls-7"
    d="M1432.05,327.52q7,4.28,14.06,8.56l9.18-21.4-14.37-7.34Q1436.48,317.42,1432.05,327.52Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="luft_6" data-name="luft 6">
  <path
    class="cls-7"
    d="M969.86,610.24l1.53,12.84,19-3.36V606.88Z"
    transform="translate(-192 -147.9)"
  />
</g>
</svg>`
// main.js
const app = document.querySelector("#app");
const scene = setupScene(app);
const { object, update } = renderSVG(svg);

scene.add(object);

