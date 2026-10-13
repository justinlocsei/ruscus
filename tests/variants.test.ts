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
        .nested((s, { variants: v }) => ({
          [v('compact')]: s({ gap: '0.25rem' }).nested({
            '&:hover': s({ opacity: '0.9' })
          }),
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
    .nested((s, { els, variants: v }) => ({
      [v('compact')]: s({ gap: '0.25rem' }),
      [v('compact', 'large')]: s({ gap: '1rem' }),
      [els.root]: s({ borderStyle: 'solid' }),
      [els.title]: s({ fontWeight: '700' })
    })));
