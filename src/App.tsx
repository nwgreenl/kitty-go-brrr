import React, { useState, MouseEvent, ChangeEvent } from 'react';

import {
  BASE_URL,
  DEFAULT_DIMS,
  DEFAULT_URL,
  DEFAULT_ASPECT_STATE,
  INPUT_MIN,
  INPUT_MAX,
} from './settings';
import AspectIcon from './icons/AspectIcon';
import './App.scss';

// util
const round = (num: number, precision = 0): number =>
  !precision ? Math.round(num) : parseFloat(num.toFixed(precision));

const App = () => {
  const [shouldBrrr, setShouldBrrr] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [catUrl, setCatUrl] = useState(DEFAULT_URL);
  const [dims, setDims] = useState(DEFAULT_DIMS);
  const [isAspectLocked, setIsAspectLocked] = useState(DEFAULT_ASPECT_STATE);
  const [aspectRatio, setAspectRatio] = useState(
    round(DEFAULT_DIMS.width / DEFAULT_DIMS.height, 2)
  );

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

    setIsAspectLocked(!isAspectLocked);
    setAspectRatio(round(dims.width / dims.height, 2));
  };

  // edge case where aspect ratio is locked and input puts other over max
  const handleError = (input: string, output: string) => {
    alert(
      `ERROR: Desired input value of '${input}' (with locked aspect ratio) will put '${output}' over the max value of ${INPUT_MAX}.`
    );
    document.getElementById(`${input}-input`)!.style.border = '2px solid darkred';
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();

    const { name, value }: { name: 'height' | 'width'; value: number } = e.target as any;

    if (value === dims[name]) return;

    setIsValid(value >= INPUT_MIN && value <= INPUT_MAX);

    value >= INPUT_MIN && value <= INPUT_MAX
      ? (e.target.style.border = '')
      : (e.target.style.border = '2px solid darkred');

    let newDims = { ...dims };

    if (isAspectLocked) {
      switch (name) {
        case 'width':
          let height = round(value / aspectRatio);
          height <= INPUT_MAX
            ? (newDims = {
                width: round(value),
                height,
              })
            : handleError(name, 'height');
          break;
        case 'height':
          let width = round(value * aspectRatio);
          width <= INPUT_MAX
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
          This app will make a kitty of a set size go <i>brrr.</i>
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
          min={INPUT_MIN}
          max={INPUT_MAX}
          value={dims.width}
          onChange={handleChange}
        />

        <label htmlFor='height'>Height:</label>
        <input
          name='height'
          id='height-input'
          type='number'
          min={INPUT_MIN}
          max={INPUT_MAX}
          value={dims.height}
          onChange={handleChange}
        />

        <AspectIcon isAspectLocked={isAspectLocked} handleClick={handleClick} />

        <br />

        <button className='brrr' type='submit' onClick={handleSubmit} disabled={!isValid}>
          Go Brrr
        </button>
      </form>

      <footer>
        <hr />
        <i>
          Changing the size before making it go brrr <u>usually</u> results in a random kitty.
          <br />
          <br />
          Brrr powered by <a href={BASE_URL}>placekitten.</a>
        </i>
      </footer>
    </div>
  );
};

export default App;
