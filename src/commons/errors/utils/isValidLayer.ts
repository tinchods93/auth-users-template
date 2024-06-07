import { ErrorLayersEnum } from '../enums/errorLayersEnum';

export default function isValidLayer(input) {
  return !!Object.values(ErrorLayersEnum).find((layer) => {
    const prefix = layer.includes('#') ? `${layer.split('#')[0]}#` : layer;
    return input?.includes(prefix);
  });
}
