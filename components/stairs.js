AFRAME.registerComponent('stairs', {
  schema: {
    width: { type: 'number', default: 1 },
    height: { type: 'number', default: 1 },
    depth: { type: 'number', default: 1 },
    steps: { type: 'number', default: 3 },
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
    var stepWidth = 7;
    var verticalStepHeight = 3;
    var stepThickness = 1;
    var horizontalStepDepth = 3;

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
      stepMesh.position.z = -horizontalStepDepth * theChange + stepThickness;

      scene.add(stepMesh);

      var stepMesh = new THREE.Mesh(stepHorizontal, this.material);

      var stepHalfTickness = stepThickness / 2;

      stepMesh.position.x = 0;
      stepMesh.position.y = verticalStepHeight * theChange + stepThickness;
      stepMesh.position.z = -horizontalStepDepth * theChange;

      scene.add(stepMesh);
    }

    // this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh = stepMesh;

    this.geometry = new THREE.BoxBufferGeometry(
      data.width,
      data.height,
      data.depth
    );

    el.setObject3D('mesh', this.mesh);
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
