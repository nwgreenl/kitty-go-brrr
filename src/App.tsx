import React, { useState, MouseEvent, ChangeEvent, FocusEvent } from 'react';

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

  const handleFocusOut = (): void => {
    let dim: keyof typeof dims;

    let err = false;

    for (dim in dims) {
      let dimElem = document.getElementById(`${dim}-input`);
      if (dims[dim] >= INPUT_RESTRICTIONS.MIN && dims[dim] <= INPUT_RESTRICTIONS.MAX) {
        dimElem!.className = '';
      } else {
        dimElem!.className = 'error';
        err = true;
      }
    }

    let errorElem = document.getElementById('error-msg');

    if (err) {
      errorElem!.className = 'error-msg-active';
      setIsValid(false);
    } else {
      errorElem!.className = '';
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();

    const { name, value }: { name: 'height' | 'width'; value: number } = e.target as any;

    if (value === dims[name]) return;

    let newDims = { ...dims };

    if (aspectInfo.isLocked) {
      switch (name) {
        case 'width':
          let height = round(value / aspectInfo.ratio);
          newDims = {
            width: round(value),
            height,
          };
          break;
        case 'height':
          let width = round(value * aspectInfo.ratio);
          newDims = {
            width,
            height: round(value),
          };
          break;
        default:
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
          min={INPUT_RESTRICTIONS.MIN}
          max={INPUT_RESTRICTIONS.MAX}
          value={dims.width}
          onChange={handleChange}
          onBlur={handleFocusOut}
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
          onBlur={handleFocusOut}
        />

        <AspectIcon isAspectLocked={aspectInfo.isLocked} handleClick={handleClick} />

        <br />

        <p id='error-msg' className=''>
          Width and height must be between {INPUT_RESTRICTIONS.MIN} & {INPUT_RESTRICTIONS.MAX}px
        </p>

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
