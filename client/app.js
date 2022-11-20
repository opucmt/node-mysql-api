
let addBtn = document.getElementById('addBtn');
let productContainer = document.getElementById('product__container');
let closeModalBtn = document.getElementById('closeModalBtn');

window.addEventListener('load', displayProducts);


closeModalBtn.addEventListener('click', () => {
    document.getElementById('product__name').value = '';
    document.getElementById('product__price').value = '';
    document.getElementById('product__image').value = '';
})


productContainer.addEventListener('click', e => {
    e.target.classList.forEach(elementClass => {
        if(elementClass.includes('deleteBtn')) {
            let productToDelete = e.target.dataset.id;

            fetch('http://localhost:4000/product/' + productToDelete, {
                method: 'DELETE'
            })
            .then(res => res.json())
            .then(res => {
                if(res.success) {
                    e.target.parentElement.parentElement.parentElement.remove();
                }
            })
            .catch(err => {
                console.log(err);
            })
        }
    })
})



function displayProducts() {
    fetch('http://localhost:4000/products')
    .then(res => res.json())
    .then(products => {
        productContainer.innerHTML = '';

        products.forEach(product => {
            productContainer.innerHTML += createProductElement(product);
        })
    })
    .catch(err => {
        console.log(err.message);
    })
}


addBtn.addEventListener('click', e => {
    let name = document.getElementById('product__name').value;
    let price = document.getElementById('product__price').value;
    let image = document.getElementById('product__image').value;

    if(!name.trim() || !price.trim() || !image.trim()) {
        return alert('Fill all the fields');
    }

    fetch('http://localhost:4000/product', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({ name, price, image })
    })
    .then(res => res.json())
    .then(res => {
        if(res.success) {
            let myModalEl = document.getElementById('exampleModal');
            let modal = bootstrap.Modal.getInstance(myModalEl);
            modal.hide();

            document.getElementById('product__name').value = '';
            document.getElementById('product__price').value = '';
            document.getElementById('product__image').value = '';

            let obj = {
                id: res.insertId,
                name,
                price,
                image
            }

            let product = createProductElement(obj);
            productContainer.innerHTML += product;
        }
    })
    .catch(err => {
        console.log(err.message);
    })
})


function createProductElement({ id, name, price, image }) {
    let html = `
    <div class="col-md-4 col-sm-6">
        <div class="card w-100">
            <img src="${image}" class="card-img-top">
            <div class="card-body">
                <div class="d-flex">
                    <h5 class="card-title">${name}</h5>
                    <h5 class="text-end bg-primary text-light price">$${price}</h5>
                </div>

                <button class="btn btn-danger w-100 mt-3 deleteBtn" data-id="${id}">Delete</button>
            </div>
        </div>
    </div>
    `;

    return html;
}