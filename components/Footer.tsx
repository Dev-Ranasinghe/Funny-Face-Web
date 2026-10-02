import { site } from '@/lib/content';
import { Icon, Logo } from './Marks';

export default function Footer() {
  return (
    <footer className="foot">
      <span>© {new Date().getFullYear()} {site.name}</span>
      <Logo className="foot__logo" />
      <a href="#top" className="foot__top">
        Back to top <Icon name="arrow" />
      </a>
    </footer>
  );
}
