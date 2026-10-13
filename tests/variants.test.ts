import { compareStyles } from './helpers.ts';

compareStyles('variants', c =>
  c('card')
    .css({ display: 'flex' })
    .elements(e => ({
      body: e({ display: 'block' })
        .variants(s => ({
          compact: s({ padding: '0.5rem' }),
          large: s({ padding: '2rem' })
        }))
        .nested((s, { variant: v }) => ({
          [v('compact')]: s({ gap: '0.25rem' }),
          [v('compact', 'large')]: s({ gap: '1rem' })
        })),
      title: e({ fontSize: '1.25rem' }).variants(s => ({
        emphasis: s({ color: 'blue' })
      }))
    }))
    .variants(s => ({
      compact: s({ padding: '0.5rem' }),
      large: s({ padding: '2rem' })
    }))
    .nested((s, { els, variant: v }) => ({
      [v('compact')]: s({ gap: '0.25rem' }),
      [v('compact', 'large')]: s({ gap: '1rem' }),
      [els.title]: s({ fontWeight: '700' })
    })));
