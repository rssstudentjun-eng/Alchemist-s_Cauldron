import './styles/styles.scss';
import { createShelf } from './ui/shelf';
import { createCauldron } from './ui/cauldron';

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  app.textContent = "Alchemist's Cauldron";
  app.append(createShelf());
  app.append(createCauldron());
}
