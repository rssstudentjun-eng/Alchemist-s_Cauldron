import './bar-item.scss';
import type { BarItemValue } from '../bars';

export function createBarItem(val: BarItemValue) {
  const barItem = document.createElement('div');
  barItem.classList.add('bar-item');

  const barTitle = document.createElement('h4');
  barTitle.textContent = val.title;
  barItem.appendChild(barTitle);

  const barLine = document.createElement('p');
  barLine.classList.add('bar-line');
  barLine.textContent = val.barValue.toString();
  barItem.appendChild(barLine);

  return barItem;
}
