import * as THREE from "https://cdn.skypack.dev/three@0.130.0";
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.130.0/examples/jsm/controls/OrbitControls.js';
import { SVGLoader } from 'https://cdn.skypack.dev/three@0.130.0/examples/jsm/loaders/SVGLoader.js';
var dragObjects = [];
const fillMaterial = new THREE.MeshBasicMaterial({ color: "blue", side: THREE.DoubleSide, depthWrite: false, opacity: 0 });
const fillMaterial2 = new THREE.MeshBasicMaterial({ color: "purple", side: THREE.DoubleSide, depthWrite: false, opacity: 1 });
const stokeMaterial = new THREE.LineBasicMaterial({
  //color: "#662483",
  color: "black",
});
const stokeMaterial2 = new THREE.LineBasicMaterial({
  color: "black",
});

let floor = 3

const colors = new Map([
  ["cls-2", "#d5cbe2"],
  ["cls-3", "#662483"],
  ["cls-4", "#b02f7c"],
  ["cls-5", "#3a53a0"],
  ["cls-6", "#f9b233"],
  ["cls-7", "#be1622"]
]);

const roomPositions = new Map();
const roomMaterials = new Map();

const renderSVG = (svg) => {
  const loader = new SVGLoader();
  const svgData = loader.parse(svg);
  const svgGroup = new THREE.Group();
  const updateMap = [];
  //console.log(svgData)
 
  svgGroup.scale.y *= -1;
  svgData.paths.forEach((path) => {
    const shapeColorCode = path.userData.node.classList[0];
    const shapeRoomCode = path.userData.node.classList[1] ?? "0";
    const shapes = SVGLoader.createShapes(path);

    shapes.forEach((shape) => {
      const meshGeometry = new THREE.ExtrudeBufferGeometry(shape, {
        depth: 20,
        bevelEnabled: false,
      });
      const linesGeometry = new THREE.EdgesGeometry(meshGeometry);
      let mesh = new THREE.Mesh(meshGeometry, new THREE.MeshBasicMaterial({ color: colors.get(shapeColorCode), side: THREE.DoubleSide, depthWrite: false }));
      let rand = Math.random(0,1)
      if (shapeRoomCode != 0) {
      roomPositions.set(shapeRoomCode, shape.currentPoint)
      }
      
      let lines = new THREE.LineSegments(linesGeometry, stokeMaterial);

      

      /*
      if (rand >= 0.5) {
        mesh = new THREE.Mesh(meshGeometry, fillMaterial2);
        lines = new THREE.LineSegments(linesGeometry, stokeMaterial2);
       }
       */

      updateMap.push({ shape, mesh, lines});
     // dragObjects.push( mesh );
      svgGroup.add(mesh, lines);
    });
  });

  const box = new THREE.Box3().setFromObject(svgGroup);
  const size = box.getSize(new THREE.Vector3());
  const yOffset = size.y / -2;
  const xOffset = size.x / -2;

  svgGroup.children.forEach((item) => {
    item.position.x = xOffset;
    item.position.y = yOffset;
  });
  svgGroup.rotateX(-Math.PI / 2);

  return {
    object: svgGroup,
    highlight(roomNo) {
      let pos = roomPositions.get(roomNo)
      if (!pos) {
        console.log("no position for roomno")
      }
      if (floor != 3) {
        return
      }
      //console.log(updateMap)
      //console.log(updateMap)
      let z = updateMap.filter(x => (x.shape.currentPoint.x === pos.x && x.shape.currentPoint.y === pos.y))
      //console.log(z)
      //console.log(updateMap)
     
      z.forEach((updateDetails) => {
        //console.log(updateDetails.shape.uuid)
        let meshMaterial = new THREE.MeshBasicMaterial({ color: "red", side: THREE.DoubleSide, depthWrite: false });
        //console.log(roomMaterials.get(roomNo))
        if (!roomMaterials.get(roomNo)) {
          //console.log("hmm")
          meshMaterial = new THREE.MeshBasicMaterial({ color: "green", side: THREE.DoubleSide, depthWrite: false });
          roomMaterials.set(roomNo, updateDetails.mesh.material)
          updateDetails.mesh.material.dispose()
          updateDetails.mesh.material = meshMaterial;
        } else {
         // console.log("hmm2")
          meshMaterial = roomMaterials.get(roomNo)
          updateDetails.mesh.material.dispose()
          updateDetails.mesh.material = meshMaterial;
          meshMaterial = roomMaterials.set(roomNo, null)
        }
      
        
        //setTimeout(() => updateDetails.mesh.material , delay)
      })
    },
    update(extrusion) {
      updateMap.forEach((updateDetails) => {
        
        const meshGeometry = new THREE.ExtrudeBufferGeometry(
          updateDetails.shape,
          {
            depth: extrusion,
            bevelEnabled: false
          }
        );
        const linesGeometry = new THREE.EdgesGeometry(meshGeometry);

        updateDetails.mesh.geometry.dispose();
        updateDetails.lines.geometry.dispose();
        updateDetails.mesh.geometry = meshGeometry;
        updateDetails.lines.geometry = linesGeometry;
      });
    }
  };
};

const setupScene = (container) => {
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  const camera = new THREE.PerspectiveCamera(
    50,
    (window.innerWidth -300 )/ window.innerHeight,
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
  camera.position.z = 500;
  camera.position.x = 50;
  camera.position.y = 1000;
  controls.enablePan = false;

  container.append(renderer.domElement);
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth/ window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  animate();

  return scene;
};

const svg3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1563.59 604.1">
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
    class="cls-3 N309"
    d="M503.31,274.47c29.05,40.36,63.14,80.71,92.18,121.07,22-15.59,39-31.18,61-46.78L544.59,212.1Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="N310">
  <path
    class="cls-3 N310"
    d="M609.48,391.34l62.67,76.43,47.09-37L656,355.26Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="Main_Atrium" data-name="Main Atrium">
  <circle class="cls-3 Main_Atrium" cx="177.69" cy="329.67" r="107.94" />
</g>
<g id="N311">
  <path
    class="cls-3 N311"
    d="M664.36,480.61c9.23,10.45,24.09,27.12,50.14,38.75a155.29,155.29,0,0,0,84.61,11.7q-7.23-37.5-14.45-75a54.2,54.2,0,0,1-61.91-22C702.57,449.66,684.54,465,664.36,480.61Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="N318">
  <path
    class="cls-3 N318"
    d="M836.94,568.89l-15.82-45.4-18.57,4.82q-6.88-35.08-13.76-70.17a98.17,98.17,0,0,0,37.83-16.51l47.47,57.78-8.94,6.2,28.2,33a95.71,95.71,0,0,1-56.41,30.27Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="N317">
  <path
    class="cls-3 N317"
    d="M764.94,536.1q-2.3,20.64-4.58,41.28a113.54,113.54,0,0,0,71.54-8.26q-6.2-21.33-12.38-42.65a87.77,87.77,0,0,1-54.58,9.63Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="N318a">
  <path
    class="cls-3 N318a"
    d="M872.25,505.26c4.74,6.42,11.78,13.42,16.51,19.84l32.11-22.48q-9.18-11.91-18.35-23.84C893.2,487.8,881.58,496.24,872.25,505.26Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="N319">
  <path
    class="cls-3 N319"
    d="M905.73,475.57l17,23.84,7.34-3.66,7.79,10.08,10.55-9.63q-14-17.88-28-35.77Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="N320">
  <path
    class="cls-3 N320"
    d="M947.92,456.31,967.64,482l65.12-52.74L1002,392.56l-43.11,36.23L972.23,449l-9.17,6-5-5.5Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="N325">
  <path
    class="cls-3 N325"
    d="M1041,267.59,1074.5,313l5.5-4.12,9.17,12.84a647,647,0,0,1,50.91-40.36c15.54-11.1,30.62-20.83,44.94-29.35q-17-34.86-33.94-69.71A679.46,679.46,0,0,0,1041,267.59Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="N328">
  <path
    class="cls-3 N328"
    d="M1154.52,180.46q16.29,33.82,32.56,67.64a184.41,184.41,0,0,1,60.77-16.74l-4.59-59.16,3-.91q2.52,29.93,5,59.84a121.64,121.64,0,0,1,60.53,6.42l5.73-18.34-6.65-3.44q7-28,14-56a244.61,244.61,0,0,0-170.37,20.64Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="N331">
  <path
    class="cls-3 N331"
    d="M1363.87,233.84q17.39-35.44,34.78-70.88l84,39.63q-5.31,11.29-10.61,22.57l14.15,6.66q-12.24,24.87-24.46,49.76Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="N334">
  <path
    class="cls-3 N334"
    d="M1466.9,287.08l25.38-52.58,30.57,14.06-26,52.28Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="N336">
  <path
    class="cls-4 N336"
    d="M1493.2,318l41,19.87q16.65-33.78,33.32-67.56l-40.66-20.49Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="N329">
  <path
    class="cls-4 N329"
    d="M1335.13,288.31c13.35,6.52,28.23,14.26,41.58,20.79,5.81-11.62,11.62-25.07,17.43-36.69-13.66-7.34-27.31-12.84-41-20.18C1347.67,264.66,1340.64,275.87,1335.13,288.31Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="N332">
  <path
    class="cls-4 N332"
    d="M1381.15,310.78c8.46,4.28,18.14,10.39,26.6,14.67l19.56-36.38-30-14.37C1392.36,287.34,1386.14,298.14,1381.15,310.78Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="N339">
  <path
    class="cls-3 N339"
    d="M1205,469a80,80,0,0,1-16.81-40.05,82.82,82.82,0,0,1,7-43.41,85.15,85.15,0,0,1,32.41-36.69l28.74,16.2Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="N340">
  <path
    class="cls-3 N340"
    d="M1236.08,417q11.76-25.83,23.54-51.67l101.2,49.53a67,67,0,0,1-14.68,57.17Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="N341">
  <path
    class="cls-3 N341"
    d="M1208.25,472.05a59.5,59.5,0,0,0,28.13,19l-7,11.92a80,80,0,0,0,21.71,8.87c35.66,8.67,65-11,69.09-13.76a88.75,88.75,0,0,0,22.93-23.24l-110.06-55Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="N346">
  <path
    class="cls-4 N346"
    d="M840.15,659.46Q838.1,642.73,836,626l78-11q2.06,17.88,4.12,35.77Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="N345">
  <path
    class="cls-3 N345"
    d="M820,639.75l10.55-2.3,6.42,28,88-13.3q-1.83-16.29-3.67-32.56h16.06l14.67,99.51L836,738.8Q828,689.27,820,639.75Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="N344">
  <path
    class="cls-3 N344"
    d="M940.43,618.5l20.49-2.45q2,13.76,4,27.52l110.68-15.9q6,37.46,11.92,74.9L957.86,723.36Z"
    transform="translate(-192 -147.9)"
  />
  <path
    class="cls-3 N344"
    d="M1078.17,609q6.87,45.4,13.75,90.8l43.11-7.34,41.73-75.21-7.79-45.4-74.29,11.93.45,10.54-12.84.92q1.38,6.42,2.75,12.84Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="bathroom_1" data-name="bathroom 1">
  <path
    class="cls-5 bathroom_1"
    d="M624,508.43l26.29,26.3q14.84-17.28,29.66-34.55L659.46,480Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="bathroom_2" data-name="bathroom 2">
  <path
    class="cls-5 bathroom_2"
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
    class="cls-6 accessible_toilet_1"
    d="M673.68,525.1l21.1,14.21L703,519.13l-17.88-11.92Q679.41,516.15,673.68,525.1Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="Accessible_toilet_2" data-name="Accessible toilet 2">
  <path
    class="cls-6 accessible_toilet_2"
    d="M1207.49,272.87l5.5,16.05,23.39-6.88q-2.3-9.18-4.58-18.35Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="Accessible_toilet_3" data-name="Accessible toilet 3">
  <path
    class="cls-6 accessible_toilet_3"
    d="M1417.07,317.35l11,6.42q6.18-10.32,12.38-20.64l-14.22-4.58Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="lift_1" data-name="lift 1">
  <path
    class="cls-7 lift_1"
    d="M516.38,546.19l11,16.51,21.09-16.05c-4-4.75-8.23-11.11-12-15.36C530.18,535.26,522.65,542.22,516.38,546.19Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="lift_2" data-name="lift 2">
  <path
    class="cls-7 lift_2"
    d="M583.8,442.09l15.28,18.65,16.21-12.23q-7.35-9-14.68-18Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="lift_3" data-name="lift 3">
  <path
    class="cls-7 lift_3"
    d="M1046.37,387.36l7.34,11.47,17.58-12.23L1063,375.44Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="lift_4" data-name="lift 4">
  <path
    class="cls-7 lift_4"
    d="M1306.24,349.61l4.59-11,19.87,8.86-4.89,11.62Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="lift_5" data-name="lft 5">
  <path
    class="cls-7 lift_5"
    d="M1432.05,327.52q7,4.28,14.06,8.56l9.18-21.4-14.37-7.34Q1436.48,317.42,1432.05,327.52Z"
    transform="translate(-192 -147.9)"
  />
</g>
<g id="lift_6" data-name="lift 6">
  <path
    class="cls-7 lift_6"
    d="M969.86,610.24l1.53,12.84,19-3.36V606.88Z"
    transform="translate(-192 -147.9)"
  />
</g>
</svg>`
const svg4 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1563.59 604.1">
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
                <g id="Layer_2" data-name="Layer 2">
                    <polyline class="cls-1" points="-261.4 -140.16 -261.4 -140.16 -261.4 -140.16" />
                    <path class="cls-2"
                        d="M1010.18,557.08C988.47,595.91,967.68,638,946,676.78l569.58-91.72q2.07-4.12,4.13-8.26l12.84-1.37,11-17.89-132.08-71.08C1278,511.07,1143.63,532.47,1010.18,557.08Z"
                        transform="translate(-261.4 -140.16)" />
                    <path class="cls-2"
                        d="M1318.35,370.83l55.38-111.9-94.15-44q6.45-12.84,12.92-25.68l-91.39-44.94q-7.38,16.5-14.77,33a204.5,204.5,0,0,0-56.3-21.1q.45-5.5.92-11A322.8,322.8,0,0,0,866,215.82L783,292,646.33,408.43c-6.58,7.16-24.86,25-53.54,29.35-7.69,1.16-22.73,3.24-39.69-3.67-24.74-10.08-35.27-31.83-37.85-37.6L337.1,192l-14.77-10.09L261.4,280,392.48,451.54l-96,75.67,30.46,44.71,36.69-27.51,24.24,25.45q-29.78,31.29-59.54,62.6a296.19,296.19,0,0,0,70.61,58.47c59.44,35.25,117.24,39.41,155.78,42,32.52,2.15,56.52-.17,104.54-4.82,45.5-4.4,72.54-9.55,178.61-28.2C879,692.64,914,686.56,940.34,682l90.69-185a100.92,100.92,0,0,0,54.7,5.5c40.5-7.41,61.43-37.83,65.07-43.33,7.83-11.82,21.71-38.29,15.24-71.55-8.11-41.64-41.87-61.68-47.08-64.66q8.31-20.52,16.61-41Zm-223.67-62.6a103.68,103.68,0,0,0-41.28-2.3c-7.89,1.17-33.52,5.35-55.49,27.06a102.73,102.73,0,0,0-25.68,44.94c-2.8,10.21-8.2,36,3.21,65.12a103.46,103.46,0,0,0,29.81,41.28q-17,35.78-33.94,71.54L604,615.49a256.72,256.72,0,0,1-43.56.46c-17.94-1.35-54.15-4.43-94-25.69a219.31,219.31,0,0,1-74.29-65.12l38.52-27.51a191.58,191.58,0,0,0,69.25,53.65c66.15,29.86,128.22,10.81,145.84,4.59,19.89-7,34.66-17.07,64.2-37.15,38.48-26.15,54.05-41.7,116-94.93,108.89-93.51,77.55-59.88,119.23-98.14,22.71-20.84,38.09-36.4,66-47.69,11-4.46,45.06-17.69,85.76-9.17a132,132,0,0,1,15.13,4.12Q1103.39,290.58,1094.68,308.23Z"
                        transform="translate(-261.4 -140.16)" />
                </g>
                <g id="N405">
                    <path class="cls-1" d="M441.82,404.06l43.57-31.64-89-104.1-41.27,32.1Z"
                        transform="translate(-261.4 -140.16)" />
                </g>
                <g id="N403">
                    <path class="cls-1"
                        d="M267.94,277.11c14.21,20.64,32.1,41.27,46.31,61.91l29.36-23.39-57.33-71.08C281.39,255.4,272.83,266.25,267.94,277.11Z"
                        transform="translate(-261.4 -140.16)" />
                </g>
                <g id="N402">
                    <path class="cls-1" d="M319.76,249.13l34.39,42.65,39.44-31.64-48.15-56.41Z"
                        transform="translate(-261.4 -140.16)" />
                </g>
                <g id="N407">
                    <path class="cls-1" d="M445.64,409.18l28.44,33.48,43.1-34.85-28.43-33.94Z"
                        transform="translate(-261.4 -140.16)" />
                </g>
                <g id="N410">
                    <path class="cls-1"
                        d="M476.37,449.31a126.29,126.29,0,0,0,44,35.77l25.23-50.9a78.18,78.18,0,0,1-26.14-22.47Z"
                        transform="translate(-261.4 -140.16)" />
                </g>
                <g id="N412">
                    <path class="cls-1"
                        d="M529.57,486a82.6,82.6,0,0,0,50.9,13.3q-1.14-28.44-2.29-56.87a61.09,61.09,0,0,1-27.52-5.5Z"
                        transform="translate(-261.4 -140.16)" />
                </g>
                <g id="N414">
                    <path class="cls-1"
                        d="M588.27,498.84a88.43,88.43,0,0,0,53.19-14.67q-13.51-24.76-27.05-49.53a69.79,69.79,0,0,1-14.22,5,69,69,0,0,1-17,1.84Q585.74,470.17,588.27,498.84Z"
                        transform="translate(-261.4 -140.16)" />
                </g>
                <g id="N415">
                    <path class="cls-1" d="M624,435.86l25.22,45.86L761.62,395.5l-36.69-46.77Z"
                        transform="translate(-261.4 -140.16)" />
                </g>
                <g id="N419">
                    <path class="cls-1" d="M732.27,348.65q16.5,21.33,33,42.65l110.06-88.05-39.44-42.19Z"
                        transform="translate(-261.4 -140.16)" />
                </g>
                <g id="N424">
                    <path class="cls-1"
                        d="M840.5,252.11l35.31,43.11L957.9,230.1l-32.56-46.32c-15,10.09-29.43,20-43.72,31.49A538.79,538.79,0,0,0,840.5,252.11Z"
                        transform="translate(-261.4 -140.16)" />
                </g>
                <g id="Architecture_2nd_Floor" data-name="Architecture 2nd Floor">
                    <path class="cls-1"
                        d="M967.41,660.5l46.78-93.56,388.89-69.7,128.41,62.37c-.92,3-1.83,6.11-2.75,9.17l-18.8,1.37q-1.85,4.82-3.67,9.63Z"
                        transform="translate(-261.4 -140.16)" />
                </g>
                <g id="Staff_Areas" data-name="Staff Areas">
                    <path class="cls-1"
                        d="M997.93,350.42c-14.83,20.94-15.08,42.74-15.19,52.13a94.7,94.7,0,0,0,4.91,31.8,90,90,0,0,0,27.31,39l-34.87,71.6,18.06-1.82,31.5-59.1a94.31,94.31,0,0,0,29.71,6.28c7.3.33,35.29,1.16,61-18.83,8.15-6.35,24.84-21.62,31.56-47.49,2.1-8.08,6.93-31.46-4.62-57.19s-32.5-37.94-41.53-42.35S1076,311.81,1050.22,317C1043.49,318.37,1016.13,324.73,997.93,350.42Z"
                        transform="translate(-261.4 -140.16)" />
                </g>
                <g id="N426b">
                    <path class="cls-1" d="M931.3,184.7l11.46,15.59,22.48-10.54-9.18-22.48Z"
                        transform="translate(-261.4 -140.16)" />
                </g>
                <g id="N426a">
                    <path class="cls-1" d="M962.48,227.35l17-8.71L968,193.87,944.6,204Z"
                        transform="translate(-261.4 -140.16)" />
                </g>
                <g id="N426">
                    <path class="cls-1"
                        d="M962,168.65l23.23,50.29a206.87,206.87,0,0,1,92.49-17.42l-1.23-34.86-35.16.61q-1.53-11-3-22A180.79,180.79,0,0,0,962,168.65Z"
                        transform="translate(-261.4 -140.16)" />
                </g>
                <g id="N426a-2" data-name="N426a">
                    <path class="cls-1" d="M1042.28,147.86l1.83,17.43,33.18-.16.46-18.95Z"
                        transform="translate(-261.4 -140.16)" />
                </g>
                <g id="SOC_Office" data-name="SOC Office">
                    <path class="cls-3"
                        d="M1081,176.29q.32-15.51.61-31l45.56,3.82-1.53,8.26,4.13,1.68q-2.91,13.14-5.81,26.29Z"
                        transform="translate(-261.4 -140.16)" />
                </g>
                <g id="Tech_Support" data-name="Tech Support">
                    <path class="cls-3"
                        d="M995.79,237.15l16.05,38.53a113,113,0,0,1,52.74-12.39q-.46-20.63-.92-41.27a156.88,156.88,0,0,0-67.87,15.13Z"
                        transform="translate(-261.4 -140.16)" />
                </g>
                <g id="N432a">
                    <path class="cls-1" d="M1127.43,183.78q2.74-12.22,5.5-24.46l43,15.6q-5.28,12.69-10.55,25.37Z"
                        transform="translate(-261.4 -140.16)" />
                </g>
                <g id="Staff_Room" data-name="Staff Room">
                    <path class="cls-3"
                        d="M1135.22,273.67,1150.36,240l7.79,2.75,19.49-38.29-7.56-4.13q5-10.89,10.09-21.78l8.25,3,16-32.56,83.47,41-12.39,26.37L1368,260.83l-50.44,103.41Z"
                        transform="translate(-261.4 -140.16)" />
                </g>
                <g id="Lift_1" data-name="Lift 1">
                    <path class="cls-4" d="M386.94,427.76l14.37,16.81,16.51-11.92-15-17.43Z"
                        transform="translate(-261.4 -140.16)" />
                </g>
                <g id="Lift_2" data-name="Lift 2">
                    <path class="cls-4"
                        d="M319.68,531.1c3.06,4.17,7.34,10.8,10.4,15q10.23-8.26,20.48-16.51l-12.84-13.46C330.69,521.31,325.29,525.29,319.68,531.1Z"
                        transform="translate(-261.4 -140.16)" />
                </g>
                <g id="Lift_3" data-name="Lift 3">
                    <path class="cls-4"
                        d="M1112.1,534.65c.63,3.56,1.27,9,1.89,12.59l18.09-3.73q-2-6.21-3.92-12.41C1122.1,532.08,1117.45,532.83,1112.1,534.65Z"
                        transform="translate(-261.4 -140.16)" />
                </g>
                <g id="Toilets">
                    <path class="cls-5"
                        d="M799.22,399.32c6.12,7.42,13.15,15.52,19.26,22.93l17.43-14.67L825.36,397l-6,5.51q-5.39-5.62-10.78-11.24C805.8,394.2,802.05,396.42,799.22,399.32Z"
                        transform="translate(-261.4 -140.16)" />
                </g>
                <g id="Toilets_2" data-name="Toilets 2">
                    <path class="cls-5" d="M825.36,375.94,835,388.09l-7.56,7.34,9.86,10.32,18.34-14.45-19.49-24.08Z"
                        transform="translate(-261.4 -140.16)" />
                </g>
                <g id="Engineering_Office" data-name="Engineering Office">
                    <path class="cls-1"
                        d="M348.19,636.93l68.68-74.58a214.71,214.71,0,0,0,94.34,55.83,217.7,217.7,0,0,0,99.54,4.26C692.26,606.9,755.22,602,787.68,595.59c42.82-8.5,105.33-19.51,183.44-28.13q-27.81,55-55.64,109.95c-26.61,4.62-183.11,31.7-292.12,46a346.39,346.39,0,0,1-67,3c-59.2-3.21-102.35-21.19-116.06-27.27A317.18,317.18,0,0,1,348.19,636.93Z"
                        transform="translate(-261.4 -140.16)" />
                </g>
                `
const svg2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1563.59 604.1">
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
<g id="Layer_2" data-name="Layer 2">
                        <path class="cls-1"
                            d="M88.51,526q.46,9.87.92,19.72L238,503.08a120.69,120.69,0,0,0,28.44,74.75l21.09-13.29a81.84,81.84,0,0,0,21.56,20.17c29.14,18.62,61.31,12.5,72.45,9.63,37.33-9.6,56-38.34,60.08-44.94L471,557.66l73.38,89.42-24.31,25.68A369.1,369.1,0,0,0,645.71,748c40.47,14.36,73.11,18,80.25,18.81,30.89,3.26,55.56.69,103.65-4.59,55.93-6.14,97.51-14,101.35-14.67,44.82-8.1,110.54-19.55,198.57-33.48L1158,663.13l76.13,36.69L1723,620.94q12.27-27.3,12.84-27.05c.12.05-.18,1.12-.92,3.21l-138-70.17-329.73,51.36,1.83,9.17-82.55,11.93q17-32.79,33.94-65.58a107.83,107.83,0,0,0,49.53,1.37c10.23-2.15,39.54-8.78,59.62-36.22,17.18-23.49,17.45-48.15,17.42-55.5,0-8.15-.45-31.07-16.51-53.19a87.85,87.85,0,0,0-35.31-28.44q11.48-22.69,22.93-45.4l181.15,85.3q25.9-52.5,51.82-105l-179.77-89-27.06,52.73L1301,245.81q5.74-30,11.47-60.08a252.67,252.67,0,0,0-90.34-6c-46.23,5.38-78.84,22.34-96.31,31.64a301.62,301.62,0,0,0-64.66,46.32l-18.35-18.8L885.1,364.13c-43.22,32.58-62.42,50-71.55,60.07A76.76,76.76,0,0,1,770,449q1.83,11.68,3.67,23.39a61,61,0,0,1-22.48,0c-14.6-2.82-25.47-10.84-34.85-19.72C697.6,434.9,658.74,389,611.77,325.15l12.84-11,53.2,64.66L757.15,316l-11-37.14,21.55-16.51q-15.81-20.41-31.64-40.82l61-47.69,53.66,67.87,86.22-70.16,11.92,12.84,56.41-45q-19.5-24.3-39-48.61l-64.66-6.42L460.89,443c-6.09-11.06-20.43-33.3-47.69-47.7-39.41-20.8-90.14-16.93-126.58,10.55-36.18,27.29-44.13,67.22-45.86,77.5Z"
                            transform="translate(-88.51 -84.38)" />
                    </g>
                    <g id="Cantine">
                        <path class="cls-2"
                            d="M532,670.47l19.27-20.64L521.43,609l44.94-35.31L576.92,587a230.5,230.5,0,0,0,72.46,56.4c62.3,30.79,121.13,24.06,144,20.18l7.33,32.56,294-44.94,46.77,22-17.88,38.53L811.26,759.44a318.09,318.09,0,0,1-50,4.59,322.59,322.59,0,0,1-146.75-33.48A315.78,315.78,0,0,1,532,670.47Z"
                            transform="translate(-88.51 -84.38)" />
                    </g>
                    <g id="N200a">
                        <path class="cls-3"
                            d="M393.48,520.51q-.92,10.77-1.84,21.55l23.85,30.27A87.55,87.55,0,0,0,444.38,526Z"
                            transform="translate(-88.51 -84.38)" />
                    </g>
                    <g id="N204">
                        <path class="cls-3"
                            d="M294,559.52a84.43,84.43,0,0,0,22.47,19.72c5.48,3.29,30.39,17.36,61.46,10.09a81.74,81.74,0,0,0,32.56-16.05L386.6,548.06q1.14-14.68,2.29-29.35l-66.5-7.8q.24,12.62.46,25.22Z"
                            transform="translate(-88.51 -84.38)" />
                    </g>
                    <g id="N203">
                        <path class="cls-3"
                            d="M288.23,483.9a64.38,64.38,0,0,1,11.92-26.6,63.64,63.64,0,0,1,15.14-14.21l-27.06-33.48a114.36,114.36,0,0,1,14.22-9.17A113,113,0,0,1,381.32,389c8.52,1.83,32.29,7.26,53.66,27.52a106.65,106.65,0,0,1,21.56,28.89l-48.16,38.06v12.84Z"
                            transform="translate(-88.51 -84.38)" />
                    </g>
                    <g id="Link_to_Sir_Ishbel_Gordon_Building" data-name="Link to Sir Ishbel Gordon Building">
                        <path class="cls-3" d="M94.93,528.31l-1.38,11.46,143.09-39.9q1.37-6.18,2.75-12.38Z"
                            transform="translate(-88.51 -84.38)" />
                    </g>
                    <g id="Costa">
                        <path class="cls-4" d="M862.62,781.45" transform="translate(-88.51 -84.38)" />
                        <path class="cls-5"
                            d="M583.34,582.42a162.18,162.18,0,0,0,57.48,47.39Q655.94,602.9,671.08,576a107.5,107.5,0,0,1-41.88-31.8Z"
                            transform="translate(-88.51 -84.38)" />
                    </g>
                    <g id="Jamie_Olivers_Deli" data-name="Jamie Olivers Deli">
                        <path class="cls-6"
                            d="M683.31,641.43q8.27-24.91,16.51-49.84a169,169,0,0,0,55.64,9.17q-1.22,29.82-2.44,59.62c-11.31,0-24.62-1.08-36.38-4.28C705.17,653,694.32,647.54,683.31,641.43Z"
                            transform="translate(-88.51 -84.38)" />
                    </g>
                    <g id="POCO_Roast_Coffee" data-name="POCO Roast Coffee">
                        <path class="cls-7" d="M1071.29,649.53l-4.59-36.08,39.13-6.42q.93,6.27,1.84,12.54l-12.23,27.21Z"
                            transform="translate(-88.51 -84.38)" />
                    </g>
                    <g id="N242">
                        <path class="cls-3" d="M1184.1,456.31l36.69-74.76,123.36,57.79-38.52,77.5Z"
                            transform="translate(-88.51 -84.38)" />
                    </g>
                    <g id="bathrooms_1" data-name="bathrooms 1">
                        <path class="cls-8" d="M858.5,591.9q4.28,26.13,8.56,52.28l34.85-4.59-9.78-54.11Z"
                            transform="translate(-88.51 -84.38)" />
                        <path class="cls-8"
                            d="M905.27,622.47l22.93-2.75q1.08,6.88,2.14,13.76l15.29-1.84Q943.8,621.1,942,610.55l15.59-2.14-1.83-23.85-14.06,3.06q-2.76-15.14-5.51-30.27l-38.52,5.2Q901.46,592.51,905.27,622.47Z"
                            transform="translate(-88.51 -84.38)" />
                    </g>
                    <g id="lift_1" data-name="lift 1">
                        <path class="cls-9" d="M954.8,632.56q1.08,6.42,2.14,12.84l20.49-3.67-1.53-13.45Z"
                            transform="translate(-88.51 -84.38)" />
                    </g>
                    <g id="Architecture_Department" data-name="Architecture Department">
                        <path class="cls-3"
                            d="M1174.47,656.77q11.19-24.32,22.37-48.61l83-12.9c-.29-2.87-.57-5.74-.86-8.61l302-48.6,122.15,62.8-8.17,18.49-451.63,72.27Z"
                            transform="translate(-88.51 -84.38)" />
                    </g>
                </svg>
`
// main.js
const app = document.querySelector("#app");
const scene = setupScene(app);
//console.log(window.location.href)
let svg = svg3;

if (window.location.href.includes("four")) {
  svg = svg4
  floor = 4;
}
if (window.location.href.includes("two")) {
  svg = svg2
  floor = 2
}
const { object, highlight } = renderSVG(svg);

//highlight("N309", true);

scene.add(object);

export default highlight;
window.highlight = highlight;

