AFRAME.registerComponent('stairs', {
  schema: {
    width: { type: 'number', default: 1 },
    height: { type: 'number', default: 1 },
    depth: { type: 'number', default: 1 },
    steps: { type: 'number', default: 3 },
    stepWidth: { type: 'number', default: 7 },
    verticalStepHeight: { type: 'number', default: 3 },
    stepThickness: { type: 'number', default: 1 },
    horizontalStepDepth: { type: 'number', default: 3 },
    rotationY: { type: 'number', default: 0 },
    rotationX: { type: 'number', default: 0 },
    rotationZ: { type: 'number', default: 0 },
    positionZ: { type: 'number', default: 0 },
    color: { type: 'color', default: '#AAA' },
  },

  init: function () {
    var scene = this.el.sceneEl.object3D;
    var data = this.data;
    var el = this.el;

    this.material = new THREE.MeshLambertMaterial({
      color: data.color,
      side: THREE.DoubleSide,
    });

    //define the dimension of the steps
    var stepWidth = data.stepWidth;
    var verticalStepHeight = data.verticalStepHeight;
    var stepThickness = data.stepThickness;
    var horizontalStepDepth = data.horizontalStepDepth;

    //change the number of step ups to change the steps
    for (var stepUp = 0; stepUp < data.steps; stepUp++) {
      var theChange = stepUp;

      var stepVertical = new THREE.BoxBufferGeometry(
        stepWidth,
        verticalStepHeight,
        stepThickness
      );
      var stepHorizontal = new THREE.BoxBufferGeometry(
        stepWidth,
        stepThickness,
        horizontalStepDepth
      );
      var stepMesh = new THREE.Mesh(stepVertical, this.material);

      stepMesh.position.x = 0;
      stepMesh.position.y = theChange * verticalStepHeight - stepThickness;
      stepMesh.position.z =
        -horizontalStepDepth * theChange + stepThickness + data.positionZ;
      // stepMesh.rotation.x = data.rotationX;
      // stepMesh.rotation.y = data.rotationY;
      // stepMesh.rotation.z = data.rotationZ;
      stepMesh.rotation.x = theChange * (theChange * (data.steps / theChange));
      stepMesh.rotation.y = theChange * (data.steps / theChange);
      stepMesh.rotation.z = theChange * (theChange * (data.steps / theChange));

      scene.add(stepMesh);

      var stepMesh = new THREE.Mesh(stepHorizontal, this.material);

      stepMesh.position.x = 0;
      stepMesh.position.y = theChange * verticalStepHeight + stepThickness;
      stepMesh.position.z =
        -horizontalStepDepth * theChange + stepThickness + data.positionZ;
      // stepMesh.rotation.x = data.rotationX;
      // stepMesh.rotation.y = data.rotationY;
      // stepMesh.rotation.z = data.rotationZ;
      stepMesh.rotation.x = theChange * (theChange * (data.steps / theChange));
      stepMesh.rotation.y = theChange * (data.steps / theChange);
      stepMesh.rotation.z = theChange * (theChange * (data.steps / theChange));

      // With three.js
      // el.object3D.rotation.set(
      //   THREE.Math.degToRad(0),
      //   THREE.Math.degToRad(0),
      //   THREE.Math.degToRad(90)
      // );

      scene.add(stepMesh);
    }

    this.mesh = stepMesh;

    // this.geometry = new THREE.BoxBufferGeometry(
    //   data.width,
    //   data.height,
    //   data.depth
    // );

    el.setObject3D('mesh', this.mesh);
    // el.getObject3D('mesh').rotation.y += Math.PI;
    // el.getObject3D('mesh').set(
    //   THREE.Math.degToRad(0),
    //   THREE.Math.degToRad(90),
    //   THREE.Math.degToRad(0)
    // );

    el.setAttribute('rotation', { x: 90, y: 90, z: 90 });
  },

  /**
   * Update the mesh in response to property updates.
   */
  update: function (oldData) {
    var data = this.data;
    var el = this.el;

    // If `oldData` is empty, then this means we're in the initialization process.
    // No need to update.
    if (Object.keys(oldData).length === 0) {
      return;
    }

    // Geometry-related properties changed. Update the geometry.
    if (
      data.width !== oldData.width ||
      data.height !== oldData.height ||
      data.depth !== oldData.depth
    ) {
      el.getObject3D('mesh').geometry = new THREE.BoxBufferGeometry(
        data.width,
        data.height,
        data.depth
      );
    }

    // Material-related properties changed. Update the material.
    if (data.color !== oldData.color) {
      el.getObject3D('mesh').material.color = new THREE.Color(data.color);
    }
  },
});

function test() {
  var el = this.el;
}
