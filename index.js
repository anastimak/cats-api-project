const $wrapper = document.querySelector('[data-wrapper]')
const $addBtn = document.querySelector('[data-add_button]')
const $modalAdd = document.querySelector('[data-modal]')
const $spinner = document.querySelector('[data-spinner]')
const $formErrorMsg = document.querySelector('[data-errmsg]')

const HIDDEN_CLASS = 'hidden'

const generateCatCard = (cat) => {
    return (
    `<div data-card_id=${cat.id} class="card mx-2" style="width: 30rem">
        <img src="${cat.image}" class="card-img-top" alt="">
        <div class="card-body">
        <h5 class="card-title">${cat.name}</h5>
        <p class="card-text">${cat.description}</p>
        <button type="button" class="btn btn-outline-success">Open</button>
        <button type="button" data-action="edit" class="btn btn-outline-warning">Edit</button>
        <button type="button" data-action="delete" class="btn btn-outline-danger">Delete</button>
        </div>
    </div>`
    )
}

$wrapper.addEventListener('click', async (event) => {
    const action = event.target.dataset.action;
  
    switch (action) {
      case 'delete':
        const $currentCard = event.target.closest('[data-card_id]');
        const catId = $currentCard.dataset.card_id;
        try {
          const res = await api.deleteCat(catId);
          const responce = await res.json();
          if (!res.ok) throw Error(responce.message)
          $currentCard.remove()
        } catch (error) {
          console.log(error);
        }
        break;
  
      case 'open':

        break;

      case 'edit':
        break;

      default:
        break;
    }
  })

$addBtn.addEventListener('click', () => {
    $modalAdd.classList.remove(HIDDEN_CLASS) // открываем модалку
})

document.forms.add_cats_form.addEventListener('submit', async (event) => {
    event.preventDefault();
    $formErrorMsg.innerText = '';
    const data = Object.fromEntries(new FormData(event.target).entries());
  
    data.id = Number(data.id)
    data.age = Number(data.age)
    data.rate = Number(data.rate)
    data.favorite = data.favorite == 'on'
  
    const res = await api.addNewCat(data)

    if (res.ok) {
      $wrapper.replaceChildren();
      getCatsFunc()
      $modalAdd.classList.add(HIDDEN_CLASS)
      return event.target.reset()
    } else {
      const responce = await res.json();
      $formErrorMsg.innerText = responce.message
      return;
    }
})

const firstGettingCats = async() =>{
    const res = await api.getAllCats();
    const data = await res.json();
    data.forEach(cat => {
        $wrapper.insertAdjacentHTML('afterbegin', generateCatCard(cat))
    }); 
}
firstGettingCats();

const getCatsFunc = async () => {
  $spinner.classList.remove(HIDDEN_CLASS)
  const res = await api.getAllCats();

  if (res.status !== 200) {
    const $errorMessage = document.createElement('p');
    $errorMessage.classList.add('error-msg');
    $errorMessage.innerText = 'Произошла ошибка, попробуйте выполнить запрос позже';

    return $wrapper.appendChild($errorMessage);
  }

  const data = await res.json();

  if (data.length === 0) {
    const $notificationMessage = document.createElement('p');
    $notificationMessage.innerText = 'Список котов пуст, добавьте первого котика';

    return $wrapper.appendChild($notificationMessage);
  }

  setTimeout(() => {
    $spinner.classList.add(HIDDEN_CLASS)
    data.forEach(cat => {
      $wrapper.insertAdjacentHTML('afterbegin', generateCatCard(cat))
    });
  }, 1000);
}
getCatsFunc();