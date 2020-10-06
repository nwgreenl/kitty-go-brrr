import React, { useState, MouseEvent, ChangeEvent } from 'react';

import { BASE_URL, DEFAULT_DIMS, DEFAULT_URL, DEFAULT_ASPECT_STATE } from './settings';
import AspectIcon from './icons/AspectIcon';
import './App.scss';

// util
const round = (num: number, precision = 0): number =>
  !precision ? Math.round(num) : parseFloat(num.toFixed(precision));

const App = () => {
  const [isActive, setIsActive] = useState(false);
  const [catUrl, setCatUrl] = useState(DEFAULT_URL);
  const [dims, setDims] = useState(DEFAULT_DIMS);
  const [isAspectLocked, setIsAspectLocked] = useState(DEFAULT_ASPECT_STATE);
  const [aspectRatio, setAspectRatio] = useState(
    round(DEFAULT_DIMS.width / DEFAULT_DIMS.height, 2)
  );

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    e.stopPropagation();

    setIsActive(true);
    setCatUrl(`${BASE_URL}/${dims.width}/${dims.height}`);
    setTimeout(() => setIsActive(false), 1500);
  };

  const handleClick = (e: MouseEvent<SVGSVGElement>): void => {
    e.preventDefault();
    e.stopPropagation();

    setIsAspectLocked(!isAspectLocked);
    setAspectRatio(round(dims.width / dims.height, 2));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();

    const { name, value }: { name: 'height' | 'width'; value: number } = e.target as any;

    if (value === dims[name]) return;

    let newDims = { ...dims };

    if (isAspectLocked) {
      switch (name) {
        case 'width':
          newDims = {
            width: round(value),
            height: round(value / aspectRatio),
          };
          break;
        case 'height':
          newDims = {
            width: round(value * aspectRatio),
            height: round(value),
          };
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
      <img src={catUrl} alt='cat' className={isActive ? 'cat-go-brrr' : 'cat-stay'} />

      <br />

      <label htmlFor='width'>Width:</label>
      <input name='width' type='number' value={dims.width} onChange={handleChange} />

      <label htmlFor='height'>Height:</label>
      <input name='height' type='number' value={dims.height} onChange={handleChange} />

      <AspectIcon isAspectLocked={isAspectLocked} handleClick={handleClick} />

      <br />

      <button className='brrr' onClick={handleSubmit} disabled={isActive}>
        Go Brrr
      </button>
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
