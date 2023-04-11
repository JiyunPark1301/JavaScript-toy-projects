const $btn = document.querySelector('button');
const $root = document.querySelector(':root');
const $bgColor = document.querySelector('#bg-color');

const isHex = () => {
  const num = Math.floor(Math.random() * 2);
  if (num === 0) return false;
  return true;
};

const setColor = (type, color) => {
  if (type === 'hex') {
    $bgColor.textContent = `#${color}`;
    $root.style.setProperty(`--main-color`, `#${color}`);
    return;
  }
  if (type === 'origin' || type === 'rgba') {
    $bgColor.textContent = color.slice(0, 1).toUpperCase() + color.slice(1);
    $root.style.setProperty(`--main-color`, color);
  }
};

const generateRandomColor = () => {
  if (isHex()) {
    let color = '';
    for (let i = 0; i < 6; i++) {
      let num = Math.floor(Math.random() * 16);
      if (num >= 10) num = String.fromCharCode(num + 55);
      color += num;
    }
    setColor('hex', color);
    return;
  }
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);

  if (red === 0 && green === 0 && blue === 0)
    $root.style.setProperty(`--sub-color`, '#fff');

  if (red === 255 && green === 0 && blue === 0) {
    setColor('origin', 'red');
  } else if (red === 0 && green === 255 && blue === 0) {
    setColor('origin', 'green');
  } else if (red === 0 && green === 0 && blue === 255) {
    setColor('origin', 'blue');
  } else {
    setColor('rgba', `rgba(${red}, ${green}, ${blue})`);
  }
};

$btn.addEventListener('click', generateRandomColor);
