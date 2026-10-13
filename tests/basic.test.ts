import { compareStyles } from './helpers.ts';

compareStyles('basic', c =>
  c('card')
    .css({
      display: 'flex',
      flexDirection: 'column'
    })
    .elements(e => ({
      body: e({
        margin: '0',
        padding: '1rem'
      }),
      title: e().css({
        fontSize: '1.25rem',
        fontWeight: '700'
      })
    })));
