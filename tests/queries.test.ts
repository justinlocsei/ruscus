import { queries } from '../src/index.ts';
import { compareStyles } from './helpers.ts';

const responsive = queries({
  container: '@container card (min-width: 400px)',
  desktop: '@media (min-width: 768px)',
  wide: '@media (min-width: 1024px)'
});

compareStyles('queries', c =>
  c('card')
    .css({ display: 'block' })
    .elements(e => ({
      body: e(),
      title: e()
    }))
    .global((s, { els }) => ({
      [els.root]: s({ color: 'black' }),
      ...responsive({
        container: {
          [els.root]: s({ flexDirection: 'column' }),
          [responsive.desktop]: s().nested({
            [els.title]: s({ fontWeight: '700' })
          })
        },
        desktop: {
          [els.root]: s({ padding: '1rem' }),
          [els.title]: s({ fontSize: '1.25rem' })
        },
        wide: {
          [els.body]: s({ padding: '2rem' })
        }
      })
    })));
