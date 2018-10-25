import '../sass/style.scss';

import { $, $$ } from './modules/bling';
const {typeAhead} = require('./modules/typeAhead');
const {autocomplete} = require ('./modules/autocomplete');
const {makeMap} = require('./modules/map');
import ajaxHeart from './modules/heart';

autocomplete($('#address'), $('#lat'), $('#lng'));
typeAhead($('.search'));

makeMap($('#map'));

const heartForms = $$('form.heart');
heartForms.on('submit', ajaxHeart);