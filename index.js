const btn = document.getElementById('btn');
const urlInput = document.getElementById('url');
const coefInput = document.getElementById('coef');

const btnHandler = async(event) => {
  event.preventDefault();
  btn.classList.add('form__btn_disable');
  console.log('urlInput.value',urlInput.value)
  const data = {
    url: urlInput.value,
    coef: coefInput.value,
  };
  fetch('http://localhost:3000',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  }).then(res => {
    if(res.ok) alert('Your message have been send');
    console.log(res.ok)
  })
  btn.classList.remove('form__btn_disable');

}
btn.addEventListener('click', btnHandler);