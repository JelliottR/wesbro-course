import '../sass/style.scss';

import { $, $$ } from './modules/bling';
const {typeAhead} = require('./modules/typeAhead');
const {autocomplete} = require ('./modules/autocomplete');

autocomplete($('#address'), $('#lat'), $('#lng'));
typeAhead($('.search'));