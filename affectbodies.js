// let intervalID = setTimeout(startScript, 3000);

// function startScript() {
//   console.log('started');
//   let intervalID = setInterval(applyForce, 1000);

//   function applyForce() {
//     const impulse = new Ammo.btVector3(0, 3, 0);
//     const pos = rig_entity.el
//       .getObject3D('mesh')
//       .getWorldPosition(worldPosition);
//     rig_entity.el.body.applyImpulse(impulse, pos);
//   }
// }

// let intervalID;
// let playerPositionInterval;

// var playerPositionInterval = setInterval(playerPosition, 100);

let lastpos = 0;
let curpos = 0;

let goUp = true;

//
let rig_entity = document.querySelector('#rig').object3D.el;

let meshes = document.querySelector('#world').object3D.children;

console.log(meshes);
// let intervalID;
// let intervalID = setInterval(
//   playerPosition,
//   100,
//   rig_entity.el.getObject3D('mesh')
// );

setTimeout(function () {
  for (let i = 0; i < meshes.length; i++) {
    if (
      meshes[i].type == 'Group' &&
      meshes[i].el.id &&
      meshes[i].el.id != 'song'
    ) {
      setInterval(function () {
        let worldPosition = new THREE.Vector3();
        let body = meshes[i].el.getObject3D('mesh');
        let pos = body.getWorldPosition(worldPosition);
        // console.log(pos.y);
        let intervalID;
        if (pos.y > 300) {
          Down();
        } else if (pos.y < 150) {
          Up();
        }
        function Up() {
          const impulse = new Ammo.btVector3(0, 1, 0);
          let pos = body.getWorldPosition(worldPosition);
          meshes[i].el.body.applyImpulse(impulse, pos);
        }
        function Down() {
          const impulse = new Ammo.btVector3(0, -3, 0);
          let pos = body.getWorldPosition(worldPosition);
          meshes[i].el.body.applyImpulse(impulse, pos);
        }
      }, 100);
    }
  }
}, 10000);

// function playerPosition(meshBody) {
//   // let pos = rig_entity.el.getObject3D('mesh').getWorldPosition(worldPosition);
//   let pos = meshBody.getWorldPosition(worldPosition);
//   console.log(pos.y);
//   // curpos = pos.y;
//   if (pos.y > 100) {
//     // if (lastpos != 0 && curpos != 0) {
//     //   if (curpos - lastpos < 0) {
//     //     console.log('decreasing');
//     //     clearInterval(intervalID);
//     //   }
//     // }
//     clearInterval(intervalID);
//     if (goUp == true) {
//       Down(meshBody);
//       goUp = false;
//     }
//   } else if (pos.y < -100) {
//     // if (lastpos != 0 && curpos != 0) {
//     //   if (curpos - lastpos > 0) {
//     //     console.log('increasing');
//     //     clearInterval(intervalID);
//     //   }
//     // }
//     clearInterval(intervalID);
//     if (goUp == false) {
//       Up(meshBody);
//       goUp = true;
//     }
//   }
//   // lastpos = pos.y;
// }

// function switchDirection() {
//   clearInterval(intervalID);
//   if (goUp == true) {
//     console.log('going Up');
//     Up();
//   } else {
//     console.log('going Down');
//     Down();
//   }
// }

// function Up(meshBody) {
//   // console.log('upppp');
//   let intervalID = setInterval(applyForce, 450);

//   function applyForce() {
//     const impulse = new Ammo.btVector3(0, 2, 0);
//     // let pos = rig_entity.el.getObject3D('mesh').getWorldPosition(worldPosition);
//     let pos = meshBody.getWorldPosition(worldPosition);
//     rig_entity.el.body.applyImpulse(impulse, pos);
//   }
// }
// function Down(meshBody) {
//   // console.log('downnn');
//   let intervalID = setInterval(applyForce, 500);

//   function applyForce() {
//     const impulse = new Ammo.btVector3(0, -2, 0);
//     // let pos = rig_entity.el.getObject3D('mesh').getWorldPosition(worldPosition);
//     let pos = meshBody.getWorldPosition(worldPosition);
//     rig_entity.el.body.applyImpulse(impulse, pos);
//   }
// }
