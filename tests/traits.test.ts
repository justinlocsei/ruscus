import { defineTrait } from '../src/traits.ts';
import { compareStyles } from './helpers.ts';

const accent = defineTrait(s => s({ color: 'crimson' }));

const focused = defineTrait(s =>
  s().nested({
    '&:focus-visible': s({ outline: '2px solid blue' })
  })
);

const interactive = defineTrait(s =>
  s({ cursor: 'pointer' }).nested({
    '&:hover': s({ opacity: '0.8' })
  })
);

const padded = defineTrait(s => s({ padding: '0.5rem' }));

const hovered = defineTrait(s =>
  s().nested({
    '&:hover': s({ textDecoration: 'underline' })
  })
);

compareStyles('traits', c =>
  c('control')
    .css({ display: 'inline-flex' })
    .is(padded, interactive)
    .elements(e => ({
      label: e({ fontSize: '1rem' })
        .is(accent, focused)
        .variants(s => ({
          emphasized: s({ fontWeight: '700' })
            .is(interactive, hovered),
          ghost: s().is(padded, accent).nested({
            '&:hover': s({ opacity: '0.6' })
          })
        }))
        .nested((s, { variants: v }) => ({
          [v('emphasized')]: s({ letterSpacing: '0.02em' }).nested({
            '&:hover': s({ fontStyle: 'italic' })
          })
        }))
    })));
