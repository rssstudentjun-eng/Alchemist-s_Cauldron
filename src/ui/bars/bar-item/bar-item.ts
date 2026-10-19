import './bar-item.scss';
import type { BarItemValue } from '../bars';

export function createBarItem(value: BarItemValue): HTMLElement {
  const barItem = document.createElement('div');
  barItem.classList.add('barItem');
  barItem.id = `bar-${value.id}`;

  const barTitle = document.createElement('h4');
  barTitle.classList.add('barTitle');
  barTitle.textContent = value.title;

  const barValue = document.createElement('p');
  barValue.classList.add('barValue');

  const barLine = document.createElement('div');
  barLine.classList.add('barLine');
  barLine.setAttribute('aria-hidden', 'true');

  const barZero = document.createElement('div');
  barZero.classList.add('barZero');

  const barTarget = document.createElement('div');
  barTarget.classList.add('barTarget');

  const barMarker = document.createElement('div');
  barMarker.classList.add('barMarker');

  const barLabels = document.createElement('div');
  barLabels.classList.add('barLabels');
  [-100, 0, 100].forEach((value) => {
    const label = document.createElement('span');
    label.textContent = value.toString();
    barLabels.append(label);
  });

  barLine.append(barTarget, barZero, barMarker);
  barItem.append(barTitle, barValue, barLine, barLabels);
  return barItem;
}
