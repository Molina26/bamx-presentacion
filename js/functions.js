
const HOST_API = 'https://api-pwa-production.up.railway.app/api';

const login = () => {
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const response = fetch(`${HOST_API}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "email": email,
            "password": password
        })
    }).then((data) => {
        console.log('inicio de sesión correcto');
        return data.json()
    }).catch((e) => {
        console.error('error to login' + e);
    })

    response.then((jsonData) => {
        if (jsonData.access_token) {
            localStorage.setItem("access_token", jsonData.access_token)
            window.location.href = '../pages/recolections.html'
        } else {
            console.log('Error al iniciar sesión');
        }
    }).catch((e) => {
        console.log(e);
    })
}

const confirmSession = () => {
    if (localStorage.getItem("access_token") == null) {
        console.log('sesión no activa');
        window.location.href = '../pages/login.html';
    } else {
        if (localStorage.getItem('user') == null) {
            const response = fetch(`${HOST_API}/user-profile`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("access_token"),
                },
            })
                .then((data) => {
                    return data.json();
                })
                .catch((e) => {
                    window.location.href = '../pages/login.html'
                });

            response.then((response) => {
                const { data } = response;
                localStorage.setItem('user', JSON.stringify(data[0]));

                document.getElementById('usernameNav').innerHTML = data[0].email;
                document.getElementById('usernameMenu').innerHTML = `${data[0].people.name} ${data[0].people.last_name}`;
                return;
            });
        } else {
            const data = JSON.parse(localStorage.getItem('user'))
            console.log(data);
            document.getElementById('usernameNav').innerHTML = data.email;
            document.getElementById('usernameMenu').innerHTML = `${data.people.name} ${data.people.last_name}`;
            return;
        }

    }
}

const closeSession = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    window.location.href = '../pages/login.html'
}

const getCollections = () => {
    const response = fetch(`${HOST_API}/products-picking`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
        },
    })
        .then((data) => {
            return data.json();
        })
        .catch((e) => {
            console.error(e);
        });

    response.then((response) => {
        const collectionsList = document.getElementById('collectionsList')
        let body = ''
        console.log(response.data.length);
        response.data.forEach(item => {
            body += createCard(item)
        });
        collectionsList.innerHTML = body
    });
}

const goDetailCollection = (id) => {
    localStorage.setItem('collectionId', id)
    window.location.href = '/pages/recolectionDetail.html'
}

const getColLectionById = () => {
    const collectionId = localStorage.getItem('collectionId')

    const response = fetch(`${HOST_API}/products-picking`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
        },
    })
        .then((data) => {
            return data.json();
        })
        .catch((e) => {
            console.error(e);
        });


    const collection = response.then((response) => {
        return response.data.filter(item => item.id == collectionId)[0];
    });

    const productos = collection.then((resp) => {
        let items = '';

        const container = document.getElementById("listProducts")

        resp.products.forEach((item) => {
            items += productDetail(item);
        })

        container.innerHTML = items;

        return resp.products;

    })

    productos.then((images) => {

        images.forEach(async (item) => {

            console.log(item);
            let id = `product-carousel-${item.id}`;
            const carousel = await getPictureByService(item.id)
            console.log(carousel);
            console.log('******');
            const element = document.getElementById(id)
            console.log(element);
            element.innerHTML = '';
            element.innerHTML = carousel;
        })
    })

}

const setProductId = (id) => localStorage.setItem('productId', id);

const showPicture = () => {
    const productId = localStorage.getItem('productId');

    const divPhoto = document.getElementById(`product-image-${productId}}`)

    const image = document.getElementById('lastPhoto').src;

    const response = fetch(`${HOST_API}/photo/${productId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
        body: JSON.stringify({
            "photo": image,
        })
    })
        .then((data) => {
            return data.json();
        })
        .catch((e) => {
            window.location.href = '../pages/login.html'
        });

    response.then((resp) => {
        console.log(resp);
        getPictureByService(productId);
    })

}

const getPictureByService = (id) => {
    const response = fetch(`${HOST_API}/photo-product/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
    })
        .then((data) => {
            return data.json();
        })
        .catch((e) => {
            console.log('error to get');
        });

    const html = response.then((pictures) => {
        let carousel = '';
        let images = '';


        console.log(pictures);

        pictures.data.forEach((item) => {
            images += `
            <div class="carousel-item">
                <img class="d-block w-100" src="${item.photo}" alt="Second slide">
            </div>
            `

        })
        carousel = `
        <div id="carouselExampleSlidesOnly" class="carousel slide" data-ride="carousel">
            <div class="carousel-inner">
                ${images}
            </div>
        </div>
        `

        return carousel;
    })

    console.log(html)


}


//Components Section
const createCard = (element) => {
    return `
    <div class="col">
        <div class="card mx-auto mb-5" style="width: 18rem">
            <div class="card-body">
                <h5 class="card-title">Tienda #${element.chain_stores.name}</h5>
                <p class="card-text">
                    ${'Suit' === 'Suit' ? 'Suit amplia con todos los servicios incluidos.' : 'Habitación familiar para disfrutar con toda la familia'}
                </p>
            <ul class="list-group list-group-flush">
            <li class="list-group-item">Teléfono: ${element.chain_stores.phone} </li>
                <li class="list-group-item">Dirección: ${element.chain_stores.address}
                </li>
                <li class="list-group-item">Total productos por recolectar: ${element.products.length}</li>
            </ul>
            <button style="background-color: #637cff; color: white" class="btn mt-3" type="button" onclick="goDetailCollection(${element.id})">Seleccionar</button>
        </div>
    </div>
</div>`
}

const productDetail = (element) => {
    let carouselId = `product-carousel-${element.id}`;
    console.log(carouselId);
    return `
        <div class="row">
            <div class="col my-2">
                <div class="card">

                    <div id="${carouselId}">
                        hola ${element.id}
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">
                            Producto ${element.name}
                        </h5>
                        <p>
                            Cantidad por recolectar ${element.amount}
                        </p>
                        <div class="row">
                            <div class="col">
                                <div class="mb-3">
                                    <label for="textObs" class="form-label"><b>Agregar observación</b></label>
                                    <textarea class="form-control" id="comment_${element.id}"></textarea>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col text-start">
                            <button type="button" class="btn btn-primary" id="btnCamera" onclick="initCamera(${element.id})">
                            <i class="fa-solid fa-camera"  data-bs-toggle="modal" data-bs-target="#exampleModal"></i>
                            </button>
                            </div>
                            <div class="col text-end">
                                <button type="button" class="btn btn-sm btn-success" onclick="saveInfo(${element.id})">Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <card class="mt-5 mx-auto">
                    <card-text>
                    </card-text>
                    <card id="image">
                    </card>
                </card>
            </div>
        </div>
    </div>`
}

const saveInfo = (id) => {
    Promise.all([updateComment(id)]).then((resp) => { })
}

const updateComment = (id) => {
    const comment = document.getElementById('comment_' + id).value

    console.log(comment);

    const response = fetch(`${HOST_API}/product/update-comments/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "comments": comment,
        })
    }).then((data) => {
        console.log('inicio de sesión correcto');
        return data.json()
    }).catch((e) => {
        console.error('error to login' + e);
    })

    response.then((resp) => {
        console.log(resp);
        alert('Información guardada')
    })

}