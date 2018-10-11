import '../sass/style.scss';

import { $, $$ } from './modules/bling';
const {autocomplete} = require ('./modules/autocomplete');

autocomplete($('#address'), $('#lat'), $('#lng'));