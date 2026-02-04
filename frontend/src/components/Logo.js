import React from 'react';

const Logo = ({ alt = 'PositiveHills logo', className = '', style = {}, height }) => {
  const defaultStyle = {
    height: height || 'clamp(40px, 6vw, 64px)',
    width: 'auto',
    display: 'block',
    objectFit: 'contain',
  };

  return (
    <img
      src="/images/logo_Nobg.png"
      alt={alt}
      className={className}
      style={{ ...defaultStyle, ...style }}
    />
  );
};

export default Logo;
