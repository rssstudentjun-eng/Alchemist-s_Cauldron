import './cauldron.scss';
import { INGREDIENTS } from '../../data/ingredients';
import { state } from '../../state/game-state';
import { brewCheck } from '../../logic/brew-check';

export function createCauldron(onChange: () => void): HTMLElement {
  const cauldron = document.createElement('div');
  cauldron.classList.add('cauldron');

  const cauldronTitle = document.createElement('h2');
  cauldronTitle.classList.add('cauldronTitle');
  cauldronTitle.textContent = 'Cauldron';

  const cauldronList = document.createElement('ul');
  cauldronList.classList.add('cauldronList');

  if (!state.isStarted) {
    cauldron.append(cauldronTitle, cauldronList);
    return cauldron;
  }

  state.cauldronIngredients.forEach((id) => {
    const li = document.createElement('li');
    li.textContent = INGREDIENTS.find((ingredient) => ingredient.id === id)?.name ?? id;
    cauldronList.appendChild(li);
  });
  // ========
  const cleanButton = document.createElement('button');
  cleanButton.type = 'button';
  cleanButton.disabled = !state.isStarted || state.cauldronIngredients.length === 0;
  cleanButton.classList.add('cauldronButton');
  cleanButton.textContent = 'Clean Cauldron';
  cleanButton.addEventListener('click', () => {
    if (!state.isStarted || state.isPaused) return;
    state.cauldronIngredients = [];
    onChange();
  });

  const brewButton = document.createElement('button');
  brewButton.type = 'button';
  brewButton.disabled = !state.isStarted || state.cauldronIngredients.length === 0;
  brewButton.classList.add('cauldronButton');
  brewButton.textContent = 'Brew';
  brewButton.addEventListener('click', () => {
    brewCheck();
    onChange();
  });
  // ========
  // let users = [
  //   { id: 1, name: 'Alex' },
  //   { id: 2, name: 'John' },
  //   { id: 3, name: 'Mike' },
  // ];
  //
  // function renderUserList() {
  //   const list = document.createElement('ul');
  //
  //   list.addEventListener('click', (event) => {
  //     if (!(event.target instanceof HTMLButtonElement)) return;
  //
  //     const item = event.target.closest('li');
  //     if (!item || !list.contains(item)) return;
  //     const id = item.id;
  //     deleteUser(id);
  //   });
  //
  //   function deleteUser(id) {
  //     updateList();
  //     console.log(id);
  //   }
  //
  //   function updateList() {
  //     list.replaceChildren();
  //
  //     users.forEach((user) => {
  //       const li = document.createElement('li');
  //
  //       li.dataset.id = user.id;
  //
  //       const userDeleteBtn = document.createElement('button');
  //       userDeleteBtn.textContent = 'Delete user';
  //       userDeleteBtn.type = 'button';
  //
  //       li.textContent = user.name;
  //       li.appendChild(userDeleteBtn);
  //
  //       list.appendChild(li);
  //     });
  //   }
  //   updateList();
  //   return list;
  // }

  // =====
  cauldron.append(cauldronTitle, cleanButton, brewButton, cauldronList);
  return cauldron;
}
