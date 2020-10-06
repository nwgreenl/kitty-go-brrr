import React, { useState, MouseEvent, ChangeEvent } from 'react';

import {
  BASE_URL,
  DEFAULT_URL,
  DEFAULT_STATE_DIMS,
  DEFAULT_STATE_ASPECT,
  INPUT_RESTRICTIONS,
} from './settings';
import round from './utils/round';
import AspectIcon from './icons/AspectIcon';
import './App.scss';

const App = () => {
  const [shouldBrrr, setShouldBrrr] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [catUrl, setCatUrl] = useState(DEFAULT_URL);
  const [dims, setDims] = useState(DEFAULT_STATE_DIMS);
  const [aspectInfo, setAspectInfo] = useState(DEFAULT_STATE_ASPECT);

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    e.stopPropagation();

    setShouldBrrr(true);
    setIsValid(false);

    setCatUrl(`${BASE_URL}/${dims.width}/${dims.height}`);

    setTimeout(() => setShouldBrrr(false), 1500);
    setTimeout(() => setIsValid(true), 1500);
  };

  const handleClick = (e: MouseEvent<SVGSVGElement>): void => {
    e.preventDefault();
    e.stopPropagation();

    setAspectInfo((prevState) => ({
      ratio: round(dims.width / dims.height, 2),
      isLocked: !prevState.isLocked,
    }));
  };

  // edge case where aspect ratio is locked and input puts other over max
  const handleError = (input: string, output: string) => {
    alert(
      `ERROR: Desired input value of '${input}' (with locked aspect ratio) will put '${output}' over the max value of ${INPUT_RESTRICTIONS.MAX}.`
    );
    document.getElementById(`${input}-input`)!.className = 'error';
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();

    const { name, value }: { name: 'height' | 'width'; value: number } = e.target as any;

    if (value === dims[name]) return;

    setIsValid(value >= INPUT_RESTRICTIONS.MIN && value <= INPUT_RESTRICTIONS.MAX);

    value >= INPUT_RESTRICTIONS.MIN && value <= INPUT_RESTRICTIONS.MAX
      ? (e.target.className = '')
      : (e.target.className = 'error');

    let newDims = { ...dims };

    if (aspectInfo.isLocked) {
      switch (name) {
        case 'width':
          let height = round(value / aspectInfo.ratio);
          height <= INPUT_RESTRICTIONS.MAX
            ? (newDims = {
                width: round(value),
                height,
              })
            : handleError(name, 'height');
          break;
        case 'height':
          let width = round(value * aspectInfo.ratio);
          width <= INPUT_RESTRICTIONS.MAX
            ? (newDims = {
                width,
                height: round(value),
              })
            : handleError(name, 'width');
          break;
      }
    } else {
      newDims = {
        ...dims,
        [name]: round(value),
      };
    }

    setDims(newDims);
  };

  return (
    <div className='App'>
      <header>
        <h1>Welcome to Kitty Go Brrr</h1>
        <p>
          This app will make a kitty of a set size{' '}
          <i>
            (between {INPUT_RESTRICTIONS.MIN} & {INPUT_RESTRICTIONS.MAX}px)
          </i>{' '}
          go <i>brrr.</i>
        </p>
      </header>
      <img src={catUrl} alt='cat' className={shouldBrrr ? 'cat-go-brrr' : 'cat-stay'} />

      <br />

      <form>
        <label htmlFor='width'>Width:</label>
        <input
          name='width'
          id='width-input'
          type='number'
          min={INPUT_RESTRICTIONS.MIN}
          max={INPUT_RESTRICTIONS.MAX}
          value={dims.width}
          onChange={handleChange}
        />

        <label htmlFor='height'>Height:</label>
        <input
          name='height'
          id='height-input'
          type='number'
          min={INPUT_RESTRICTIONS.MIN}
          max={INPUT_RESTRICTIONS.MAX}
          value={dims.height}
          onChange={handleChange}
        />

        <AspectIcon isAspectLocked={aspectInfo.isLocked} handleClick={handleClick} />

        <br />

        <button className='brrr' type='submit' onClick={handleSubmit} disabled={!isValid}>
          Go Brrr
        </button>
      </form>

      <footer>
        <hr />
        <i>
          Changing the height or width before making kitty go brrr <u>usually</u> results in a
          transforming kitty.
          <br />
          <br />
          Brrr powered by <a href={BASE_URL}>placekitten.</a>
        </i>
      </footer>
    </div>
  );
};

export default App;
