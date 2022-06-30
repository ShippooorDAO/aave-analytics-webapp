import cDAI from '@/assets/images/currencies/cDAI.svg';
import cETH from '@/assets/images/currencies/cETH.svg';
import cUSDC from '@/assets/images/currencies/cUSDC.svg';
import cWBTC from '@/assets/images/currencies/cWBTC.svg';
import DAI from '@/assets/images/currencies/DAI.svg';
import ETH from '@/assets/images/currencies/ETH.svg';
import nDAI from '@/assets/images/currencies/nDAI.png';
import nETH from '@/assets/images/currencies/nETH.png';
import nUSDC from '@/assets/images/currencies/nUSDC.png';
import nwBTC from '@/assets/images/currencies/nwBTC.png';
import USDC from '@/assets/images/currencies/USDC.svg';
import wBTC from '@/assets/images/currencies/wBTC.svg';
import COMP from '@/assets/images/currencies/COMP.svg';
import NOTE from '@/assets/images/currencies/NOTE.svg';

const colors = new Map([
  ['USDC', '#2775ca'],
  ['nUSDC', '#2775ca'],
  ['cUSDC', '#2775ca'],
  ['fUSDC', '#2775ca'],

  ['DAI', '#fab323'],
  ['nDAI', '#fab323'],
  ['cDAI', '#fab323'],
  ['fDAI', '#fab323'],

  ['ETH', '#607aee'],
  ['nETH', '#607aee'],
  ['cETH', '#607aee'],
  ['fETH', '#607aee'],

  ['WBTC', '#f7931a'],
  ['nWBTC', '#f7931a'],
  ['cWBTC', '#f7931a'],
  ['fWBTC', '#f7931a'],

  ['NOTE', '#055369'],
  ['COMP', '#00d362'],
]);

const userTypeColors = new Map([
  ['Lenders', '#fab664'],
  ['Borrowers', '#fab323'],
  ['Total', '#607aee'],
]);

const noteSupplyGroupColors = new Map([
  ['community', '#8884d8'],
  ['futureTeam', '#2cb5bf'],
  ['teamAndEarly', '#2c4d34'],
  ['liquidityIncentive', '#82ca9d'],
]);

const secondarySymbolColors = new Map([
  ['USDC', '#5e9ce0'],
  ['nUSDC', '#5e9ce0'],
  ['cUSDC', '#5e9ce0'],
  ['fUSDC', '#5e9ce0'],

  ['DAI', '#fae923'],
  ['nDAI', '#fae923'],
  ['cDAI', '#fae923'],
  ['fDAI', '#fae923'],

  ['ETH', '#a5b4f5'],
  ['nETH', '#a5b4f5'],
  ['cETH', '#a5b4f5'],
  ['fETH', '#a5b4f5'],

  ['WBTC', '#fab664'],
  ['nWBTC', '#fab664'],
  ['cWBTC', '#fab664'],
  ['fWBTC', '#fab664'],
]);

const icons = new Map([
  ['USDC', USDC],
  ['nUSDC', nUSDC],
  ['cUSDC', cUSDC],
  ['fUSDC', USDC],

  ['DAI', DAI],
  ['nDAI', nDAI],
  ['cDAI', cDAI],
  ['fDAI', DAI],

  ['ETH', ETH],
  ['nETH', nETH],
  ['cETH', cETH],
  ['fETH', ETH],

  ['WBTC', wBTC],
  ['nWBTC', nwBTC],
  ['cWBTC', cWBTC],
  ['fWBTC', wBTC],

  ['COMP', COMP],
  ['NOTE', NOTE],
]);

export function getSymbolIcon(symbol: string): string {
  return icons.get(symbol) || '';
}

export function getSymbolColor(symbol: string): string {
  return colors.get(symbol) || '';
}

export function getSecondarySymbolColor(symbol: string): string {
  return secondarySymbolColors.get(symbol) || '';
}

export function getUserTypeColor(userType: string): string {
  return userTypeColors.get(userType) || '';
}

export function getNoteSupplyGroupColor(group: string): string {
  return noteSupplyGroupColors.get(group) || '';
}
