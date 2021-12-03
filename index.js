const btnPaste = document.getElementById('btn-paste');
const urlInput = document.getElementById('url');
const coefInput = document.getElementById('coef');
const site = document.getElementById('site');

const btnPasteHandler = async(event) => {
  event.preventDefault();
  btnPaste.disabled = true;
  urlInput.value = await navigator.clipboard.readText().then(d => d)

  const data = {
    url: urlInput.value,
    coef: coefInput.value,
    site: site.value,
  };
  // await fetch('http://localhost:3000',{
  await fetch('https://scraper-for-hanna.herokuapp.com/',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(data)
  }).then(res => res.text())
  .then(res => alert(res))
  .catch(err => alert('Error: ' + err.message))
  
  btnPaste.disabled = false;
}

btnPaste.addEventListener('click', btnPasteHandler);