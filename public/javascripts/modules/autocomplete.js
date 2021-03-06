function autocomplete(input, latInput, lngInput) {
    if (!input) return; // skip this fn from running if there is not input on the page

    const dropdown = new google.maps.places.Autocomplete(input);

    dropdown.addListener('place_changed', () => {
        const place = dropdown.getPlace();
        latInput.value = place.geometry.location.lat();
        lngInput.value = place.geometry.location.lng();
    });
    //if someone hits enter on address field, don't submit the form

    input.on('keydown', (e) => {
        if (e === 13) e.preventDefault();
    });
}

module.exports = {
    autocomplete
};