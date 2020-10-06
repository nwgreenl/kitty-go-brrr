import round from './utils/round';

export const BASE_URL = 'https://placekitten.com/';
export const DEFAULT_DIMS = {
  width: 200,
  height: 300,
};
export const DEFAULT_URL = `${BASE_URL}/${DEFAULT_DIMS.width}/${DEFAULT_DIMS.height}`;
export const INPUT_MIN = 25;
export const INPUT_MAX = 3000;
export const DEFAULT_ASPECT_STATE = {
  ratio: round(DEFAULT_DIMS.width / DEFAULT_DIMS.height, 2),
  isLocked: true,
};
