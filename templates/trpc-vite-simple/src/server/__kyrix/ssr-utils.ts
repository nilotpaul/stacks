import { type Metadata } from './metadata';

type HandleSSRArgs = {
  initialData?: any;
  meta: Metadata;
};

export const handleSSR = ({ meta, initialData }: HandleSSRArgs) => {
  // Do something before returning if necessary.
  return {
    meta,
    initialData,
  };
};
