import { compareStyles } from './helpers.ts';

compareStyles('nested', c =>
  c('card')
    .css({ display: 'flex' })
    .elements(e => ({
      body: e({ padding: '1rem' })
        .children({
          text: e({ lineHeight: '1.5' })
        })
        .nested((s, { els }) => ({
          '&:hover': s({ opacity: '0.9' }),
          [els.text]: s({ color: 'gray' })
        })),
      header: e()
        .children({
          title: e({ fontWeight: '700' })
        })
        .nested((s, { els }) => ({
          '& + &': s({ marginTop: '1rem' }),
          [els.title]: s({ color: 'navy' })
        }))
    }))
    .nested((s, { els }) => ({
      [els.body.root]: s({ flex: '1' }),
      [els.body.text]: s({ marginTop: '0.5rem' }),
      [els.header.root]: s({ borderBottom: '1px solid #ccc' }),
      [els.header.title]: s({ fontSize: '1.25rem' })
    }))
    .global(s => ({
      'a[href]': s({ textDecoration: 'underline' }),
      textarea: s({ resize: 'vertical' }).nested({
        '&:focus-visible': s({ outline: '2px solid navy' })
      }),
      'button, input': s({ font: 'inherit' }).nested({
        '&:focus-visible': s({ outline: '2px solid navy' })
      })
    })));
