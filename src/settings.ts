import round from './utils/round';

export const BASE_URL = 'https://placekitten.com/';
export const DEFAULT_STATE_DIMS = {
  width: 200,
  height: 300,
};
export const DEFAULT_STATE_ASPECT = {
  ratio: round(DEFAULT_STATE_DIMS.width / DEFAULT_STATE_DIMS.height, 2),
  isLocked: true,
};
export const DEFAULT_URL = `${BASE_URL}/${DEFAULT_STATE_DIMS.width}/${DEFAULT_STATE_DIMS.height}`;
export const INPUT_MIN = 25;
export const INPUT_MAX = 3000;
