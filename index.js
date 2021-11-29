const btn = document.getElementById('btn');
const urlInput = document.getElementById('url');
const coefInput = document.getElementById('coef');

const btnHandler = async(event) => {
  event.preventDefault();
  // btn.classList.add('form__btn_disable');
  btn.disabled = true;
  console.log('urlInput.value',urlInput.value)
  const data = {
    url: urlInput.value,
    coef: coefInput.value,
  };
  
  await fetch('http://localhost:3000',{
  // await fetch('https://scraper-for-hanna.herokuapp.com/',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(data)
  }).then(res => res.text())
  .then(res => alert(res))
  .catch(err => alert('Error: ' + err.message))
  
  btn.disabled = false;
  // btn.classList.remove('form__btn_disable');
}

btn.addEventListener('click', btnHandler);