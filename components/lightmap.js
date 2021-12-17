AFRAME.registerComponent('mouse-to-world', {
  init: function () {
    document.addEventListener('click', (e) => {
      let mouse = new THREE.Vector2();
      let camera = AFRAME.scenes[0].camera;
      let rect = document.querySelector('body').getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      let vector = new THREE.Vector3(mouse.x, mouse.y, -1).unproject(camera);
      console.log(vector);
    });
  },
});
