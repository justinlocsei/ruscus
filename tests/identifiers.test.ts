import { compareStyles } from './helpers.ts';

compareStyles('identifiers', c =>
  c('card')
    .identifiers({
      animation: 'string',
      spacing: 'variable'
    })
    .elements((e, { ids }) => ({
      body: e({ animation: `${ids.animation} 500ms` }),
      items: e({
        display: 'flex',
        gap: `var(${ids.spacing})`
      })
    }))
    .global((s, { ids }) => ({
      [`@keyframes ${ids.animation}`]: s.rules({
        from: s({ opacity: 0 }),
        to: s({ opacity: 1 })
      })
    })));
