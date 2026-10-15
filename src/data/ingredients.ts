import causticAcid from '../assets/icons/causticAcid.svg';
import dragonTears from '../assets/icons/dragoneTears.svg';
import essenceOfTheVoid from '../assets/icons/essenseOfTheVoid.svg';
import fairyDust from '../assets/icons/fairyDust.svg';
import frostLotus from '../assets/icons/frostLotus.svg';
import mandrakeRoot from '../assets/icons/mandrakeRoot.svg';
import phoenixFeather from '../assets/icons/phoenixFeather.svg';
import toadSmile from '../assets/icons/toadSmile.svg';

export interface Ingredient {
  id: string;
  name: string;
  temperature: number;
  density: number;
  magicPower: number;
  image: string;
}

export const INGREDIENTS: Ingredient[] = [
  {
    id: 'dragon-tears',
    name: 'Dragon Tears',
    temperature: 25,
    density: 8,
    magicPower: 10,
    image: dragonTears,
  },
  {
    id: 'fairy-dust',
    name: 'Fairy Dust',
    temperature: 12,
    density: 9,
    magicPower: 12,
    image: fairyDust,
  },
  {
    id: 'frost-lotus',
    name: 'Frost Lotus',
    temperature: -18,
    density: 4,
    magicPower: 14,
    image: frostLotus,
  },
  {
    id: 'mandrake-root',
    name: 'Mandrake Root',
    temperature: -5,
    density: 20,
    magicPower: 8,
    image: mandrakeRoot,
  },
  {
    id: 'caustic-acid',
    name: 'Caustic Acid',
    temperature: 10,
    density: 14,
    magicPower: 22,
    image: causticAcid,
  },
  {
    id: 'essence-of-the-void',
    name: 'Essence of the Void',
    temperature: -20,
    density: -10,
    magicPower: 40,
    image: essenceOfTheVoid,
  },
  {
    id: 'phoenix-feather',
    name: 'Phoenix Feather',
    temperature: 50,
    density: -10,
    magicPower: 30,
    image: phoenixFeather,
  },
  {
    id: 'toad-slime',
    name: 'Toad Slime',
    temperature: 5,
    density: 30,
    magicPower: 0,
    image: toadSmile,
  },
];
