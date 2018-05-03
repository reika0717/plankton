$(function () {
  var url = window.location;
  var path = url.href.split('/');
  var file_name = path.pop();
  if (file_name === 'index.html') {
    //topのアニメーション
    var camera, scene, renderer, particles, particle, material, particleCount, points, texture;
    var xSpeed, ySpeed;
    xSpeed = 0.00005;
    ySpeed = 0.00005;
    var winWidth, winHeight;
    winWidth = window.innerWidth;
    winHeight = window.innerHeight;

    init();
    animate();

    function init() {
      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2('#222', 0.001);

      camera = new THREE.PerspectiveCamera(75, winWidth / winHeight, 1, 1000);
      camera.position.z = 500;

      // particle
      // transparentとblendingたぶん効いてない
      material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 1,
        transparent: true,
        blending: THREE.AdditiveBlending
      });

      particleCount = 5000;
      particles = new THREE.Geometry();

      for (var i = 0; i < particleCount; i++) {
        var px = Math.random() * 2000 - 1000;
        var py = Math.random() * 2000 - 1000;
        var pz = Math.random() * 2000 - 1000;
        particle = new THREE.Vector3(px, py, pz);
        particle.velocity = new THREE.Vector3(0, Math.random(), 0);
        particles.vertices.push(particle);
      }

      points = new THREE.Points(particles, material);
      points.sortParticles = true;
      scene.add(points);

      renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      renderer.setSize(winWidth, winHeight);
      renderer.setClearColor('#222', 1);
      var canvas = document.getElementById('home__main')
      canvas.appendChild(renderer.domElement);
    }

    function animate() {
      requestAnimationFrame(animate);

      scene.rotation.y += xSpeed;

      // パーティクル上下移動
      var i = particleCount;
      while (i--) {
        var particle = particles.vertices[i];

        // y
        if (particle.y > 1000) {
          particle.y = -1000;
          particle.velocity.y = Math.random();
        }
        particle.velocity.y += Math.random() * ySpeed;

        particle.add(particle.velocity);
      }
      points.geometry.verticesNeedUpdate = true;

      render();
    }

    function render() {
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    }

  }

  $('.scroll-btn').on('click', function (e) {
    e.preventDefault();
    $('html, body').animate({
      scrollTop: $($(this).attr('href')).offset().top
    }, 500, 'linear');
  });

  $('#footer').load('../src/footer.html')

  //URLのハッシュ値を取得
  var urlHash = location.hash;
  //ハッシュ値があればページ内スクロール
  if (urlHash) {
    //スクロールを0に戻す
    $('body,html').stop().scrollTop(0);
    setTimeout(function () {
      //ロード時の処理を待ち、時間差でスクロール実行
      scrollToAnker(urlHash);
    }, 100);
  }

  //通常のクリック時
  $('a[href^="#"]').click(function () {
    //ページ内リンク先を取得
    var href = $(this).attr("href");
    //リンク先が#か空だったらhtmlに
    var hash = href == "#" || href == "" ? 'html' : href;
    //スクロール実行
    scrollToAnker(hash);
    //リンク無効化
    return false;
  });

  // 関数：スムーススクロール
  // 指定したアンカー(#ID)へアニメーションでスクロール
  function scrollToAnker(hash) {
    var target = $(hash);
    var position = target.offset().top;
    $('body,html').stop().animate({
      scrollTop: position
    }, 500);
  }
});