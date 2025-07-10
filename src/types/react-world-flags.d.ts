// src/types/react-world-flags.d.ts
declare module 'react-world-flags' {
  import * as React from 'react';

  interface FlagProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    code: string; // e.g., 'US', 'IN'
  }

  const Flag: React.FC<FlagProps>;

  export default Flag;
}
