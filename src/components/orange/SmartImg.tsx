import { ImgHTMLAttributes } from "react";
import type { Photo } from "./orangeData";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & { photo: Photo };

const SmartImg = ({ photo, ...rest }: Props) => <img {...rest} src={photo.src} draggable={false} />;

export default SmartImg;
