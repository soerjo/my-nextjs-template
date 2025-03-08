import { SVGProps } from 'react';

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}
