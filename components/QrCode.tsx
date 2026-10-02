import QRCode from 'qrcode';

/** Real, scannable QR of the site URL, drawn as crisp SVG modules. */
export default function QrCode({ value, className }: { value: string; className?: string }) {
  const { modules } = QRCode.create(value, { errorCorrectionLevel: 'M' });
  const size = modules.size;
  let d = '';
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) if (modules.get(y, x)) d += `M${x} ${y}h1v1h-1z`;
  return (
    <svg className={className} viewBox={`0 0 ${size} ${size}`} shapeRendering="crispEdges" role="img" aria-label={`QR code for ${value}`}>
      <path d={d} fill="currentColor" />
    </svg>
  );
}
