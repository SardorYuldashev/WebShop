const box = document.querySelector('.main__content-box');
const modal = document.querySelector('.main__modal');
const modalClose = document.querySelector('.main__modal-button');
const modalImg = document.querySelector('.main__modal-img');
const modalTitle = document.querySelector('.main__modal-title');
const modalDescription = document.querySelector('.main__modal-description');
const modalPrice = document.querySelector('.main__modal-price');
const headerPrice = document.querySelector('.header__nav-price');
const modalPartPrice = document.querySelector('.main__part-price');


let partArr = JSON.parse(localStorage.getItem('partArr'));
if (!partArr) { partArr = [] }

function summPrice(arr) {
  let summ = arr.reduce((acc, item) => { return acc += item.price }, 0);
  headerPrice.textContent = `Total: ${summ}$`;
  modalPartPrice.textContent = `Total: ${summ}$`;
}

summPrice(partArr)

async function getData() {
  let response = await fetch("https://fakestoreapi.com/products");
  let data = await response.json();
  console.log(data);

  data.forEach(item => {
    createCard(item.image, item.title, item.price, item.id)
  })

  box.addEventListener('click', (e) => {
    if (e.target.classList.contains('main__content-btn')) {
      const id = e.target.dataset.id
      const item = data.find(item => item.id == id);
      modalImg.setAttribute('src', item.image);
      modalTitle.textContent = item.title;
      modalDescription.textContent = item.description;
      modalPrice.textContent = `${item.price} $`;
      modal.classList.add('active')
      document.body.style.overflow = 'hidden';
    }
  });

  const cardAddBtn = document.querySelectorAll('.main__content-icon');

  cardAddBtn.forEach(btn => {
    btn.addEventListener('click', (e) => {
      let card = e.target.closest('.main__content-card');
      let title = card.querySelector('.main__content-title').textContent;

      let product;
      data.filter(item => {
        if (item.title === title) {
          product = item;
        }
      });
      partArr.push(product);
      summPrice(partArr);
      localStorage.setItem('partArr', JSON.stringify(partArr));
    });
  });
};

getData()

function createCard(itemImg, itemTitle, itemPrice, itemID) {
  const card = document.createElement('div');
  card.classList.add('main__content-card');
  const imgBox = document.createElement('div');
  imgBox.classList.add('main__content-imgBox');
  const img = document.createElement('img');
  img.classList.add('main__content-img');
  img.setAttribute('src', itemImg);
  imgBox.appendChild(img);
  card.appendChild(imgBox);
  const title = document.createElement('h2');
  title.classList.add('main__content-title');
  title.textContent = itemTitle;
  card.appendChild(title);
  const footer = document.createElement('div');
  footer.classList.add('main__content-footer');
  const price = document.createElement('p');
  price.classList.add('main__content-price');
  price.textContent = `${itemPrice} $`;
  const button = document.createElement('button');
  button.classList.add('main__content-btn');
  button.setAttribute('data-id', itemID);
  button.textContent = "OPEN";
  const cart = document.createElement('i');
  cart.classList.add('fa-solid', 'fa-cart-shopping', 'main__content-icon');
  footer.appendChild(price);
  footer.appendChild(button);
  footer.appendChild(cart);
  card.appendChild(footer);
  box.appendChild(card);
}

modalClose.addEventListener('click', () => {
  modal.classList.remove('active');
  document.body.style.overflow = 'scroll';
})


const partModal = document.querySelector('.main__part');
const partBox = document.querySelector('.main__part-content');
const partBtn = document.querySelector('.header__nav-icon');
const partClose = document.querySelector('.main__part-close');

partClose.addEventListener('click', () => {
  partBox.innerHTML = '';
  document.body.style.overflow = 'scroll';
  partModal.style.display = 'none';
})

partBtn.addEventListener('click', () => {
  document.body.style.overflow = 'hidden';
  partBox.innerHTML = '';
  partModal.style.display = 'flex';

  partArr.forEach(item => {
    createPartCards(item.image, item.title)
  })
});

function createPartCards(itemUrl, itemTitle) {
  const card = document.createElement('div');
  card.classList.add('main__part-card');

  const imgBox = document.createElement('div');
  imgBox.classList.add('main__part-imgBox');

  const img = document.createElement('img');
  img.classList.add('main__part-img');
  img.setAttribute('src', itemUrl);

  const title = document.createElement('h2');
  title.classList.add('main__part-title');
  title.textContent = itemTitle;

  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('main__part-deleteBtn');
  deleteBtn.textContent = 'DELETE';

  imgBox.appendChild(img);
  card.appendChild(imgBox);
  card.appendChild(title);
  card.appendChild(deleteBtn);

  partBox.appendChild(card)
};

partBox.addEventListener('click', (e) => {
  let card = e.target.closest('.main__part-card');
  let title = card.querySelector('.main__part-title').textContent;

  let item = partArr.find(item => item.title === title);

  let indexItem = partArr.indexOf(item);

  partArr.splice(indexItem, 1);
  summPrice(partArr);
  localStorage.setItem('partArr', JSON.stringify(partArr));
  partBox.innerHTML = '';

  partArr.forEach(item => {
    createPartCards(item.image, item.title)
  })
});