import { initialize } from 'lib';

const $input = document.getElementById('number-input') as HTMLInputElement;
const $output = document.getElementById('number-output') as HTMLSpanElement;

const api = await initialize();

function update() {
  const a = parseInt($input.value ?? 0, 10);
  $output.innerHTML = api.exports.multiply(a).toString();
}

$input?.addEventListener('change', update);
update();
