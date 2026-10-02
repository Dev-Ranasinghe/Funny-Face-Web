import { nav, site, social } from '@/lib/content';
import { Icon, Logo } from './Marks';
import QrCode from './QrCode';
import Scramble from './Scramble';
import Status from './Status';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  return (
    <header className="head">
      <a href="#top" className="head__logo cell" aria-label={`${site.name}, back to top`}>
        <Logo />
      </a>
      <Status lines={site.status} />
      <nav className="head__nav cell" aria-label="Primary">
        <ul>
          {nav.map((item) => (
            <li key={item.href}>
              <Scramble href={item.href} text={item.label.toUpperCase()} className="head__link" />
            </li>
          ))}
        </ul>
      </nav>
      <ul className="head__social cell">
        {social.map((s) => (
          <li key={s.label}>
            <a href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}>
              <Icon name={s.icon} />
            </a>
          </li>
        ))}
      </ul>
      <ThemeToggle />
      <div className="head__tag cell">
        <p>{site.location}</p>
        <p>
          {site.availability} → <a href="#contact">Hire me</a>
        </p>
      </div>
      <div className="head__qr cell">
        <QrCode value={site.url} />
      </div>
    </header>
  );
}
