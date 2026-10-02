import { ImgHTMLAttributes, useEffect, useState } from "react";
import type { Photo } from "./orangeData";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & { photo: Photo };

const SmartImg = ({ photo, ...rest }: Props) => {
  const [src, setSrc] = useState(photo.src);
  useEffect(() => setSrc(photo.src), [photo.src]);
  return (
    <img
      {...rest}
      src={src}
      draggable={false}
      onError={() => photo.fallback && src !== photo.fallback && setSrc(photo.fallback)}
    />
  );
};

export default SmartImg;
