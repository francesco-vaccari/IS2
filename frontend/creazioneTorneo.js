$.datepicker.regional['it'] = {
    monthNames: ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno',   'Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'], // set month names
    monthNamesShort: ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'], // set short month names
    dayNames: ['Domenica','Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato'], // set days names
    dayNamesShort: ['Dom','Lun','Mar','Mer','Gio','Ven','Sab'], // set short day names
    dayNamesMin: ['Do','Lu','Ma','Me','Gio','Ve','Sa'], // set more short days names
    dateFormat: 'dd/mm/yy' // set format date
};
$.datepicker.setDefaults($.datepicker.regional['it']);
$("#dataInizioTorneo").datepicker();
$("#dataFineTorneo").datepicker();
   