// Family toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const toggleSwitch = document.getElementById('familyToggle');
    if (!toggleSwitch) return;

    let isGroomSelected = true;

    toggleSwitch.addEventListener('click', function() {
        isGroomSelected = !isGroomSelected;
        toggleSwitch.classList.toggle('active', !isGroomSelected);
        switchFamilyImages(isGroomSelected ? 'groom' : 'bride');
    });

    function switchFamilyImages(side) {
        const familyImages = document.querySelectorAll('#family .memory-card img');
        const baseIndex = side === 'groom' ? 5 : 9;

        familyImages.forEach((img, index) => {
            img.src = `images/gallery/pic${baseIndex + index}.jpg`;
            img.alt = `${side === 'groom' ? 'Groom' : 'Bride'} family member ${index + 1}`;
        });
    }
});