const $utils = document.querySelector('.utils');
const $num = document.querySelector('#num');
let num = 0;

const renderNum = () => {
  $num.textContent = num;
};

$utils.addEventListener('click', (e) => {
  if (e.target.classList.contains('increase-btn')) {
    num++;
  } else if (e.target.classList.contains('reset-btn')) {
    num = 0;
  } else if (e.target.classList.contains('decrease-btn')) {
    num--;
  }

  $num.classList.remove('green', 'red');
  if (num > 0) {
    $num.classList.add('green');
  } else if (num < 0) {
    $num.classList.add('red');
  }
  renderNum();
});
