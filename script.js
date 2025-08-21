const tecnicos = [
  'Wesley', 'Daniel', 'Pablo', 'Matheus', 'Grazi', 'Douglas',
  'Douglas G', 'Lucas', 'Fagner', 'Eliana','Jackson', 
];

let selectedDate = null;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

const calendar = document.getElementById('calendar');
const monthYear = document.getElementById('monthYear');
const selectedDateTitle = document.getElementById('selectedDateTitle');
const tecnicosContainer = document.getElementById('tecnicos');
const areaEntrega = document.getElementById('areaEntrega');

function getDateKey(date) {
  return date.toISOString().split('T')[0];
}

function renderCalendar() {
  calendar.innerHTML = "";
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  monthYear.innerText = `${firstDay.toLocaleString('default', { month: 'long' })} ${currentYear}`;

  const startDay = firstDay.getDay(); // dia da semana (0 = domingo)
  for (let i = 0; i < startDay; i++) {
    const empty = document.createElement('div');
    calendar.appendChild(empty);
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(currentYear, currentMonth, d);
    const cell = document.createElement('div');
    cell.classList.add('calendar-day');
    cell.innerText = d;

    cell.onclick = () => {
      document.querySelectorAll('.calendar-day').forEach(el => el.classList.remove('selected'));
      cell.classList.add('selected');
      selectedDate = date;
      selectedDateTitle.innerText = `Entregas do dia ${getDateKey(selectedDate)}`;
      renderCards();
    };

    calendar.appendChild(cell);
  }
}

function changeMonth(offset) {
  currentMonth += offset;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  } else if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar();
}

function loadCounters() {
  if (!selectedDate) return {};
  const data = JSON.parse(localStorage.getItem(getDateKey(selectedDate)) || '{}');
  return data;
}

function saveCounters(data) {
  if (!selectedDate) return;
  localStorage.setItem(getDateKey(selectedDate), JSON.stringify(data));
}

function renderCards() {
  tecnicosContainer.innerHTML = '';
  const counters = loadCounters();

  tecnicos.forEach((nome, index) => {
    const cardColor = ["#ff6f61", "#6b5b95", "#88b04b", "#f7cac9", "#92a8d1", "#955251", "#b565a7", "#009b77", "#dd4124", "#45b8ac"][index % 10];
    const card = document.createElement('div');
    card.classList.add('card');
    card.style.backgroundColor = cardColor;
    card.style.color = '#fff';
    card.setAttribute('draggable', true);
    card.setAttribute('id', nome);

    const nomeElem = document.createElement('h3');
    nomeElem.innerText = nome;

    const counterDiv = document.createElement('div');
    counterDiv.classList.add('counter');

    const btnMinus = document.createElement('button');
    btnMinus.innerText = '-';
    const btnPlus = document.createElement('button');
    btnPlus.innerText = '+';

    const countDisplay = document.createElement('span');
    countDisplay.innerText = counters[nome] || '0';

    btnMinus.onclick = () => {
      let current = parseInt(countDisplay.innerText);
      if (current > 0) {
        current--;
        countDisplay.innerText = current;
        counters[nome] = current;
        saveCounters(counters);
      }
    };

    btnPlus.onclick = () => {
      let current = parseInt(countDisplay.innerText);
      current++;
      countDisplay.innerText = current;
      counters[nome] = current;
      saveCounters(counters);
    };

    counterDiv.appendChild(btnMinus);
    counterDiv.appendChild(countDisplay);
    counterDiv.appendChild(btnPlus);

    card.appendChild(nomeElem);
    card.appendChild(counterDiv);

    card.addEventListener('dragstart', () => {
      card.classList.add('dragging');
    });

    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
    });

    tecnicosContainer.appendChild(card);
  });
}

areaEntrega.addEventListener('dragover', (e) => {
  e.preventDefault();
});

areaEntrega.addEventListener('drop', () => {
  if (!selectedDate) return;
  const dragging = document.querySelector('.dragging');
  if (dragging) {
    const counters = loadCounters();
    let current = parseInt(counters[dragging.id] || 0);
    current++;
    counters[dragging.id] = current;
    saveCounters(counters);
    renderCards();
  }
});

renderCalendar();
