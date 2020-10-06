import React from 'react';
import LockedIcon from './paths/LockedIcon';
import UnlockedIcon from './paths/UnlockedIcon';

interface AspectIconProps {
  isAspectLocked: boolean;
  handleClick: Function;
}

// todo make props not be any
export default function ({ isAspectLocked, handleClick }: AspectIconProps) {
  return (
    <div className='aspect-icon-baseline'>
      <svg
        className={`aspect-icon${isAspectLocked ? '-active' : ''}`}
        viewBox='0 0 24 24'
        aria-hidden='true'
        onClick={(e) => handleClick(e)}
      >
        {isAspectLocked ? <LockedIcon /> : <UnlockedIcon />}
      </svg>
    </div>
  );
}
