import { compareStyles } from './helpers.ts';

compareStyles('queries', c =>
  c('card')
    .css({ display: 'block' })
    .elements(e => ({
      body: e(),
      title: e()
    }))
    .global((s, { els }) => ({
      [els.root]: s({ color: 'black' }),
      '@container card (min-width: 400px)': s().nested({
        [els.root]: s({ flexDirection: 'column' }),
        [els.title]: s({ fontWeight: '700' })
      }),
      '@media (min-width: 1024px)': s().nested({
        [els.body]: s({ padding: '2rem' })
      }),
      '@media (min-width: 768px)': s().nested({
        [els.root]: s({ padding: '1rem' }),
        [els.title]: s({ fontSize: '1.25rem' })
      })
    })));
