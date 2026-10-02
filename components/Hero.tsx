import { site } from '@/lib/content';
import FitText from './FitText';
import HeroLines from './HeroLines';
import { Sparkle } from './Marks';
import Ticker from './Ticker';

/** Each letter rolls inside its own clip window; copies above/below keep it seamless. */
function Word({ text, offset = 0 }: { text: string; offset?: number }) {
  return (
    <>
      {[...text].map((ch, i) => (
        <span key={i} className="char">
          <span
            className={`char__in${ch === 'I' ? ' dot-i' : ''}`}
            data-l={ch}
            style={{ '--ci': i + offset } as React.CSSProperties}
          >
            {ch}
          </span>
        </span>
      ))}
    </>
  );
}

export default function Hero() {
  const [first, second] = site.role.toUpperCase().split(' ');
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__canvas">
        <HeroLines />
      </div>
      <Ticker seed={11} />
      <h1 id="hero-title" className="hero__title">
        <span className="sr-only">
          {site.name}, {site.role}
        </span>
        <span className="hero__wide" aria-hidden="true">
          <FitText className="hero__row">
            <Word text={first} /> <Sparkle className="hero__star" /> <Word text={second} offset={first.length} />
          </FitText>
        </span>
        <span className="hero__stack" aria-hidden="true">
          <FitText className="hero__row">
            <Word text={first} />
          </FitText>
          <Sparkle className="hero__star hero__star--solo" />
          <FitText className="hero__row">
            <Word text={second} offset={first.length} />
          </FitText>
        </span>
      </h1>
      <Ticker seed={29} reverse />
    </section>
  );
}
