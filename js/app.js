if (navigator.serviceWorker) {
  const enviroment = window.location.href;
  const pathInit = enviroment.includes('localhost') ? '/sw.js' : 'https://molina26.github.io/bamx-presentacion/sw.js'
  navigator.serviceWorker.register(pathInit);
}

const btnCamera = document.getElementById("btnCamera");
const btnMakePhoto = document.getElementById("btnMakePhoto");

const video = document.getElementById("video");
const itemPhoto = document.getElementById("itemPhoto");

let pictures = [];

const camera = new Camera(video);

btnCamera.addEventListener("click", () => {
  console.log("Abriendo camara");
  camera.power();
});

const initCamera = (id) => {
  camera.power();
  setProductId(id)
}

btnMakePhoto.addEventListener("click", () => {
  console.log("Tomando foto");
  let picture = camera.takePhoto();
  console.log(picture.valueOf);
  pictures.push(picture);

  itemPhoto.innerHTML = '';

  itemPhoto.innerHTML += `
  <div class="carousel-item active">
    <img  id="lastPhoto" src="${pictures[pictures.length - 1]
    }" class="d-block w-100" alt="...">
  </div>
`;
  camera.off();
});




var conecction = false;

function isOnline() {
  if (navigator.onLine) {
    if (conecction) {
      conecction = false;
      alert('Conexión disponible')
      // toastr.success('En Línea', '', toastr.options);
    }
  } else {
    alert('Modo Outline Activado')
    conecction = true;
    // toastr.error('Sin Conexión', '', toastr.options);
  }
}

window.addEventListener('online', (event) => {
  isOnline();
});

window.addEventListener('offline', (event) => {
  isOnline();
});

isOnline();