const seats = document.querySelectorAll('.seat');
const selectedSeatsSpan = document.getElementById('selected-seats');
const selectedSeatsCountSpan = document.getElementById('selected-seats-count');
const infoSection = document.getElementById('info-section');
const addButton = document.getElementById('btn-ekle');
const maleRadio = document.getElementById('male');
const femaleRadio = document.getElementById('female');
const ul = document.getElementById('list-ul')
const spanTotal = document.getElementById('total')
const save = document.getElementById('btn-kaydet')

let price = 0
let total = 0
let seatsArr = [...seats]
let selectedSeats = [];

const storedManSeatsIndexes = localStorage.getItem('manSeatsIndexes'); //LocalStorage daki veriyi al 
let manSeatsIndexes = storedManSeatsIndexes ? JSON.parse(storedManSeatsIndexes) : []; //LocalStorage da veri varsa al(JSON formatından stringe  dönüştürerek) yoksa boş dizi kabul et

seatsArr.forEach((seat, index) => {
    if (manSeatsIndexes.includes(index)) { //LocalStorage daki koltuk indexiyle aynı indexe sahip olan koltuklara 'man-seat' classını ekle
        seat.classList.add('man-seat');
    }
});

const storedWomanSeatsIndexes = localStorage.getItem('womanSeatsIndexes')
let womanSeatsIndexes = storedWomanSeatsIndexes ? JSON.parse(storedWomanSeatsIndexes) : []

seatsArr.forEach((seat, index) => {
    if (womanSeatsIndexes.includes(index)) {
        seat.classList.add('woman-seat');
    }
});

seats.forEach(seat => {
    seat.addEventListener('click', () => {
        if (!seat.classList.contains('man-seat') && !seat.classList.contains('woman-seat') && !seat.classList.contains('for-man') && !seat.classList.contains('for-woman')) {
            const isSelected = seat.classList.contains('selected-seat');

            if (selectedSeats.length >= 4 && !isSelected) {
                alert('En fazla 4 koltuk seçebilirsiniz!');
                return;
            }

            seat.classList.toggle('selected-seat');

            if (isSelected) {
                selectedSeats = selectedSeats.filter(selectedSeat => selectedSeat !== seat);
            } else {
                selectedSeats = [...selectedSeats, seat]
            }

            updateSelectedNumbers()
        }
    });
});

addButton.addEventListener('click', () => {
    if (selectedSeats.length === 0) {
        alert('Lütfen boş bir koltuk seçiniz!');
        return;
    }
    if (!maleRadio.checked && !femaleRadio.checked) {
        alert('Lütfen bir cinsiyet seçiniz!');
        return;
    }

    const lastSelectedSeat = selectedSeats[selectedSeats.length - 1];
    const lastSelectedSeatIndex = seatsArr.indexOf(lastSelectedSeat)

    if (maleRadio.checked) {
        if (lastSelectedSeat.classList.contains('for-woman')) {
            lastSelectedSeat.classList.remove('for-woman')
        }
        if (lastSelectedSeatIndex < 13) {
            if (!seatsArr[lastSelectedSeatIndex + 13].classList.contains('woman-seat')) {
                lastSelectedSeat.classList.add('for-man');
                addList(lastSelectedSeat)
                manSeatsIndexes = [...manSeatsIndexes, lastSelectedSeatIndex]
                console.log(manSeatsIndexes)
            } else {
                alert('Bu koltuk kadın yolcular için ayrılmıştır')
                lastSelectedSeat.classList.remove('selected-seat', 'for-man')
                selectedSeats = selectedSeats.filter(selectedSeat => selectedSeat !== lastSelectedSeat)
                updateSelectedNumbers()
            }
        }
        if (lastSelectedSeatIndex >= 13 && lastSelectedSeatIndex < 26) {
            if (!seatsArr[lastSelectedSeatIndex - 13].classList.contains('woman-seat')) {
                lastSelectedSeat.classList.add('for-man');
                addList(lastSelectedSeat)
                manSeatsIndexes = [...manSeatsIndexes, lastSelectedSeatIndex]
                console.log(manSeatsIndexes)
            } else {
                alert('Bu koltuk kadın yolcular için ayrılmıştır')
                lastSelectedSeat.classList.remove('selected-seat', 'for-man')
                selectedSeats = selectedSeats.filter(selectedSeat => selectedSeat !== lastSelectedSeat)
                updateSelectedNumbers()
            }
        } else if (lastSelectedSeatIndex > 25) {
            lastSelectedSeat.classList.add('for-man');
            addList(lastSelectedSeat)
            manSeatsIndexes = [...manSeatsIndexes, lastSelectedSeatIndex]
            console.log(manSeatsIndexes)
        }
    } else if (femaleRadio.checked) {
        if (lastSelectedSeat.classList.contains('for-man')) {
            lastSelectedSeat.classList.remove('for-man')
        }
        if (lastSelectedSeatIndex < 13) {
            if (!seatsArr[lastSelectedSeatIndex + 13].classList.contains('man-seat')) {
                lastSelectedSeat.classList.add('for-woman');
                addList(lastSelectedSeat)
                womanSeatsIndexes = [...womanSeatsIndexes, lastSelectedSeatIndex]
            } else {
                alert('Bu koltuk erkek yolcular için ayrılmıştır')
                lastSelectedSeat.classList.remove('selected-seat', 'for-woman')
                selectedSeats = selectedSeats.filter(selectedSeat => selectedSeat !== lastSelectedSeat)
                updateSelectedNumbers()
            }
        }
        if (lastSelectedSeatIndex >= 13 && lastSelectedSeatIndex < 26) {
            if (!seatsArr[lastSelectedSeatIndex - 13].classList.contains('man-seat')) {
                lastSelectedSeat.classList.add('for-woman');
                addList(lastSelectedSeat)
                womanSeatsIndexes = [...womanSeatsIndexes, lastSelectedSeatIndex]
            } else {
                alert('Bu koltuk erkek yolcular için ayrılmıştır')
                lastSelectedSeat.classList.remove('selected-seat', 'for-woman')
                selectedSeats = selectedSeats.filter(selectedSeat => selectedSeat !== lastSelectedSeat)
                updateSelectedNumbers()
            }
        } else if (lastSelectedSeatIndex > 25) {
            lastSelectedSeat.classList.add('for-woman');
            addList(lastSelectedSeat)
            womanSeatsIndexes = [...womanSeatsIndexes, lastSelectedSeatIndex]
        }
    }
    maleRadio.checked = false;
    femaleRadio.checked = false;

    //Kaydet butonuna tıklandığında yapılacaklar
    save.addEventListener('click', () => {
        if (selectedSeats.length > 0) {
            selectedSeats.forEach((seat) => {
                seat.classList.remove('selected-seat')
                if (seat.classList.contains('for-man')) {
                    seat.classList.remove('for-man')
                    seat.classList.add('man-seat')
                } else if (seat.classList.contains('for-woman')) {
                    seat.classList.remove('for-woman')
                    seat.classList.add('woman-seat')
                }
            })
            localStorage.setItem('manSeatsIndexes', JSON.stringify(manSeatsIndexes)) //localStorage a kaydet
            localStorage.setItem('womanSeatsIndexes', JSON.stringify(womanSeatsIndexes))

            selectedSeats = []
            price = 0
            total = 0
            ul.innerHTML = ''; // Liste içeriğini temizle
            spanTotal.textContent = 'Toplam : 0 TL';
            infoSection.style.visibility = 'hidden';
        }
    })
});

//Eklenmiş koltukların  gösterileceği listeye html elemanlarının oluşturulup eklenmesi ve içeriklerinin düzenlenmesi
function addList(lastSelectedSeat) {
    const li = document.createElement('li')
    const spanNumber = document.createElement('span')
    spanNumber.style.backgroundColor = lastSelectedSeat.classList.contains('for-woman') ? '#FF9B9B' : '#75C2F6'
    spanNumber.classList.add('list-number')
    spanNumber.textContent = lastSelectedSeat.querySelector('.number').textContent
    const spanGender = document.createElement('span')
    spanGender.classList.add('list-span')
    spanGender.textContent = lastSelectedSeat.classList.contains('for-man') ? 'Erkek' : 'Kadın'
    const spanPrice = document.createElement('span')
    spanPrice.classList.add('list-price')
    price = seatsArr.indexOf(lastSelectedSeat) < 26 ? 500 : 550
    total = total + price
    spanTotal.textContent = 'Toplam : ' + total + ' TL'
    spanPrice.textContent = price + ' TL'
    const button = document.createElement('button')
    button.textContent = 'ÇIKAR'
    button.classList.add('list-btn')
    li.appendChild(spanNumber)
    li.appendChild(spanGender)
    li.appendChild(spanPrice)
    li.appendChild(button)
    ul.appendChild(li)

    //Çıkar butonuna tıklandığında olacaklar
    button.addEventListener('click', () => {
        ul.removeChild(li)
        selectedSeats = selectedSeats.filter(selectedSeat => selectedSeat !== lastSelectedSeat)
        updateSelectedNumbers()
        lastSelectedSeat.classList.remove('for-man', 'for-woman', 'selected-seat');
        price = seatsArr.indexOf(lastSelectedSeat) < 26 ? 500 : 550
        total -= price;
        spanTotal.textContent = 'Toplam : ' + total + ' TL';
    })
}

function updateSelectedNumbers() {
    const selectedSeatNumbers = selectedSeats.map(selectedSeat => selectedSeat.querySelector('.number').textContent);
    selectedSeatsSpan.textContent = selectedSeatNumbers.sort((a, b) => a - b).join(', ');
    selectedSeatsCountSpan.innerText = selectedSeats.length > 0 ? '(' + selectedSeats.length + ' Koltuk )' : '';
    infoSection.style.visibility = selectedSeats.length > 0 ? 'visible' : 'hidden';
}


