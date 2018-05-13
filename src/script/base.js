$(function () {
  var container; // canvasを格納する
  var camera, scene, renderer;
  var wrapper;
  var geometry = []; // ジオメトリー格納配列
  var fixedArray = []; // 円筒座標格納配列
  var fixedArray2 = []; // 読み込み座標格納配列
  var fractalArray = [];
  var rndArray = []; // ランダム配置座標格納配列
  var particlePositionArray = []; // パーティクルの移動先座標格納配列
  var particles; // PointCloud
  var materials; // PointCloudMaterial
  var fractalVertices = []

  // 画像のピクセルデータ読み取り用
  var imgPS, imgCanvas, imgCanvasContext, imgW, imgH, imgPixelArray = [];

  /* functions
   ---------------------------------------------------- */
  var fileName = window.location.href.split('/').pop();
  if (fileName === 'index.html') {
    init();
  }

  function init() {

    startRender(); // レンダリングスタート

    // レンダリングスタート
    function startRender() {

      // scene
      scene = new THREE.Scene();

      container = document.getElementById('home__main'); // canvasを入れる器を定義

      // camera
      var aspect = container.offsetWidth / container.offsetHeight;
      camera = new THREE.PerspectiveCamera(15, aspect, 1, 2000);
      camera.position.z = 900; //cameraの引き具合

      wrapper = new THREE.Group(); //wrapperにparticle達を格納
      scene.add(wrapper);

      setParticle(); // パーティクル生成

      // WebGLRenderer
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
      });
      renderer.setSize(container.offsetWidth, container.offsetHeight);
      renderer.setClearColor('red', 0); //背景色の設定
      container.appendChild(renderer.domElement);

      // リサイズ処理
      window.addEventListener('resize', onWindowResize, false);

      animate();
    }

    // パーティクル生成
    function setParticle() {
      var gm = new THREE.Geometry(); // ジオメトリー
      var pp = []; // 球座標配列
      var pp2 = []; // ランダム配置用座標配列
      var pp3 = []; // 移動先座標配列
      var pp_img = []; // 読み込み画像座標配列
      var pp_fractal = [];

      // 画像のピクセル数により位置決め
      const SIZE = 1000 //particleが形どる立方体のサイズ
      for (var x = 0; x < 2000 + 1; x++) {
        // ランダム配置
        var px2 = SIZE * (Math.random() - 0.4);
        var py2 = SIZE * (Math.random() - 0.4);
        var pz2 = SIZE * (Math.random() - 0.4);
        pp2.push({
          x: px2,
          y: py2,
          z: pz2
        });

        var vertex = new THREE.Vector3(px2, py2, pz2); //
        gm.vertices.push(vertex); // ジオメトリーに格納
      }
      rndArray.push(pp2); // ランダム配置座標を配列に格納
      geometry = gm; // ジオメトリーを配列に格納

    }
    //パーティクルを円形に
    function createCircleTexture(color, size) {
      var matCanvas = document.createElement('canvas');
      matCanvas.width = matCanvas.height = size;
      var matContext = matCanvas.getContext('2d');
      // create texture object from canvas.
      var texture = new THREE.Texture(matCanvas);
      // Draw a circle
      var center = size / 2;
      matContext.beginPath();
      matContext.arc(center, center, size / 2, 0, 2 * Math.PI, false);
      matContext.closePath();
      matContext.fillStyle = color;
      matContext.fill();
      // need to set needsUpdate
      texture.needsUpdate = true;
      // return a texture made from the canvas
      return texture;
    }

    // PointCloudMaterial
    materials = new THREE.PointsMaterial({
      size: 4,
      map: createCircleTexture('white', 8),
      blending: THREE.AdditiveBlending,
      depthTest: true,
      transparent: true,
      opacity: 0.8
    });

    // PointCloud
    particles = new THREE.Points(geometry, materials);

    wrapper.add(particles);
  }

  //  ステージリサイズ対応
  function onWindowResize() {
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(container.offsetWidth, container.offsetHeight);
  }
  var windowHeight = window.innerHeight

  function animate() {
    requestAnimationFrame(animate);
    render();
  }

  // render
  function render() {
    // カメラ制御
    camera.position.x += (500 - camera.position.x);
    camera.position.y += (500 - camera.position.y) * 0.04;
    camera.lookAt(scene.position);

    // パーティクルの移動
    geometry.verticesNeedUpdate = true; // ジオメトリーの位置更新

    // パーティクル全体の移動
    // wrapper.rotation.x += 0.0001;
    wrapper.rotation.x -= 0.0002;
    renderer.render(scene, camera);
  }

  $('.scroll-btn').on('click', function (e) {
    e.preventDefault();
    $('html, body').animate({
      scrollTop: $($(this).attr('href')).offset().top
    }, 500, 'linear');
  });

  $('.hamburger').on('click', function () {
    console.log('ハンバーガー')
    $('#global-nav').slideToggle()
  })
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