import './cauldron.scss';

export const cauldronItemsMass: string[] = [];

export function updateCauldron(): void {
  const list = document.querySelector<HTMLUListElement>('.cauldronList');

  if (!list) {
    return;
  }

  const items = cauldronItemsMass.map((name) => {
    const li = document.createElement('li');
    li.textContent = name;
    return li;
  });

  list.replaceChildren(...items);
}

export function createCauldron(): HTMLElement {
  const cauldron = document.createElement('div');

  const cauldronTitle = document.createElement('h2');
  cauldronTitle.classList.add('cauldronTitle');
  cauldronTitle.textContent = 'Cauldron';
  cauldron.appendChild(cauldronTitle);

  const cauldronList = document.createElement('ul');
  cauldronList.classList.add('cauldronList');

  cauldronItemsMass.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    cauldronList.appendChild(li);
  });

  cauldron.classList.add('cauldron');
  cauldron.appendChild(cauldronList);
  return cauldron;
}
