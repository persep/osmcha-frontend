import React from 'react';

export function Button({ onClick, children, iconName, className }: Object) {
  return (
    <button
      onClick={onClick}
      className={`${className ||
        ''} btn btn--s border border--1 border--darken5 border--darken25-on-hover round bg-darken10 bg-darken5-on-hover color-gray transition ${iconName &&
        children
        ? 'pl12 pr6'
        : ''}`}
    >
      {children}
      {iconName &&
        <svg
          className={`icon inline-block align-middle ${children
            ? 'pl3 pb3'
            : 'pb3'}`}
        >
          <use xlinkHref={`#icon-${iconName}`} />
        </svg>}
    </button>
  );
}
