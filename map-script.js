const campusMap = document.getElementById('campusMap');
const lotsList = document.getElementById('lotsList');
const occupancyText = document.getElementById('occupancyText');
const openSpacesText = document.getElementById('openSpacesText');
const updateTimeText = document.getElementById('updateTimeText');

const lots = [
  { name: 'North Lot', status: 'available', spaces: 18, x: 28, y: 20, label: '1' },
  { name: 'West Lot', status: 'busy', spaces: 7, x: 18, y: 41, label: '2' },
  { name: 'Student Center Lot', status: 'full', spaces: 2, x: 46, y: 63, label: '3' },
  { name: 'South Lot', status: 'available', spaces: 12, x: 66, y: 74, label: '4' },
  { name: 'Engineering Lot', status: 'busy', spaces: 6, x: 72, y: 34, label: '5' },
  { name: 'Library Lot', status: 'available', spaces: 14, x: 62, y: 49, label: '6' },
  { name: 'Admin Lot', status: 'full', spaces: 1, x: 54, y: 19, label: '7' }
];

const buildings = [
  { name: 'SZH', x: 23, y: 15 },
  { name: 'J1', x: 52, y: 15 },
  { name: 'Student Hub', x: 72, y: 15 },
  { name: 'J2', x: 25, y: 42 },
  { name: 'Sport Complex', x: 77, y: 60 },
  { name: 'Female Hostel', x: 28, y: 60 },
  { name: 'Mosque', x: 52, y: 71 },
  { name: 'Gate 1', x: 75, y: 89 },
  { name: 'Gate 2', x: 46, y: 89 },
  { name: 'Gate 3', x: 22, y: 89 }
];

const initialCampusLayout = () => {
  const shapes = `
    <div class="campus-shape campus-shape--main"></div>
    <div class="road road--north"></div>
    <div class="road road--west"></div>
    <div class="road road--east"></div>
    <div class="road road--south"></div>
    <div class="campus-label" style="left: 38%; top: 7%;">Ajman University</div>
  `;

  campusMap.insertAdjacentHTML('beforeend', shapes);

  buildings.forEach((building) => {
    if (building.name.startsWith('Gate')) {
      const gate = document.createElement('div');
      gate.className = 'gate-label';
      gate.style.left = `${building.x}%`;
      gate.style.top = `${building.y}%`;
      gate.textContent = building.name;
      campusMap.appendChild(gate);
      return;
    }

    const buildingEl = document.createElement('div');
    buildingEl.className = 'building-label';
    buildingEl.style.left = `${building.x}%`;
    buildingEl.style.top = `${building.y}%`;
    buildingEl.textContent = building.name;
    campusMap.appendChild(buildingEl);
  });

  lots.forEach((lot) => {
    const lotEl = document.createElement('div');
    lotEl.className = `parking-pin ${lot.status}`;
    lotEl.style.left = `${lot.x}%`;
    lotEl.style.top = `${lot.y}%`;
    lotEl.title = `${lot.name}: ${lot.status}`;
    lotEl.textContent = lot.label;
    campusMap.appendChild(lotEl);
  });
};

const renderLotCards = () => {
  const totalSpaces = lots.reduce((sum, lot) => sum + lot.spaces, 0);
  const fullLots = lots.filter((lot) => lot.status === 'full').length;
  const availableCount = lots.reduce((sum, lot) => sum + (lot.status === 'full' ? 0 : lot.spaces), 0);
  const occupancy = Math.round(((totalSpaces - availableCount) / totalSpaces) * 100);

  occupancyText.textContent = `${occupancy}%`;
  openSpacesText.textContent = `${availableCount}`;

  lotsList.innerHTML = lots
    .map((lot) => `
      <div class="lot-card">
        <div>
          <strong>${lot.name}</strong>
          <small>${lot.spaces} spaces</small>
        </div>
        <span class="lot-status ${lot.status}">${lot.status === 'available' ? 'Available' : lot.status === 'busy' ? 'Busy' : 'Full'}</span>
      </div>
    `)
    .join('');

  updateTimeText.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const updateLiveParking = () => {
  lots.forEach((lot) => {
    const randomRoll = Math.random();
    if (randomRoll > 0.82) lot.status = 'full';
    else if (randomRoll > 0.48) lot.status = 'busy';
    else lot.status = 'available';

    lot.spaces = Math.max(1, Math.min(26, lot.spaces + (Math.random() > 0.5 ? 1 : -1)));
  });

  const pins = document.querySelectorAll('.parking-pin');
  pins.forEach((pin, index) => {
    const status = lots[index].status;
    pin.className = `parking-pin ${status}`;
  });

  renderLotCards();
};

initialCampusLayout();
renderLotCards();
setInterval(updateLiveParking, 6000);
