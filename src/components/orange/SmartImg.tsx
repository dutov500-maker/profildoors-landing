import { ImgHTMLAttributes, useState } from "react";
import { PLACEHOLDER, type Photo } from "./orangeData";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & { photo?: Photo };

const SmartImg = ({ photo, ...rest }: Props) => {
  const [broken, setBroken] = useState(false);
  const src = !photo?.src || broken ? PLACEHOLDER : photo.src;
  return <img {...rest} src={src} draggable={false} onError={() => !broken && setBroken(true)} />;
};

export default SmartImg;
