'use strict';

// Replace with your deployed Worker URL after running: npx wrangler deploy
const WORKER_URL = 'https://silicon-forge-scores.aaronschnarrman.workers.dev';

// ================================================================
//  ITEMS
// ================================================================
const ITEMS = {
  mlcc:       { name:'Bulk MLCCs',         short:'Ceramic caps 0402, strip/100',        learn:'A capacitor stores a burst of electricity and releases it instantly — like a spring for power. MLCCs are in every phone, laptop, and circuit board by the hundreds. During the 2020 chip shortage, MLCCs costing ₿0.002 each were selling for ₿0.50 — a 25,000% markup. That\'s why everyone stockpiles them.',                              minPrice:5,    maxPrice:38,    unit:'strip',   maxCarry:20 },
  artix7:     { name:'Artix-7 FPGA',       short:'Xilinx mid-range programmable chip',  learn:'An FPGA (Field-Programmable Gate Array) literally rewires itself based on your design. Unlike a CPU that runs software, an FPGA becomes the circuit you describe in code. They\'re in radar systems, stock trading servers, medical devices, and satellites. The Artix-7 is the workhorse — capable, affordable, everywhere.',              minPrice:90,   maxPrice:450,   unit:'board',   maxCarry:8  },
  tangnano:   { name:'Tang Nano 9K',        short:'Budget FPGA dev board, OSS tools',   learn:'Same concept as the Artix-7 but designed to be affordable. The "9K" means ~9,000 logic cells — configurable building blocks you program into circuits. Works with free open-source tools. Popular for learning because breaking one is a ₿15 mistake, not a ₿450 one.',                                                                  minPrice:14,   maxPrice:65,    unit:'board',   maxCarry:15 },
  resistors:  { name:'Resistor Pack 1%',    short:'Precision 0603, pack/500',            learn:'A resistor controls how much current flows — like a narrow section in a pipe. The "1%" means each is within 1% of its stated value. Cheap resistors can be off by 5%: fine for an LED, catastrophic for a precision sensor. Engineers argue about 0402 vs 0603 size forever.',                                                            minPrice:2,    maxPrice:16,    unit:'pack',    maxCarry:30 },
  ipcores:    { name:'Custom IP Cores',     short:'Pre-built HDL blocks, licensed',      learn:'IP cores are pre-designed circuit blocks you drop into your chip design. Need a USB controller? PCIe interface? License an IP core instead of spending months building one. It\'s the hardware equivalent of software libraries — except way more expensive and harder to debug when they fail.',                                             minPrice:200,  maxPrice:1800,  unit:'license', maxCarry:5  },
  bga:        { name:'BGA Reballs',         short:'E-waste chips, reballed, resold',     learn:'BGA (Ball Grid Array) chips connect via a grid of solder balls on their underside. "Reballing" means pulling a chip from old hardware, attaching new balls, and reselling it. Legit reballing is fine. Bootleg reballs on unknown chips are a gamble — intermittent failures that drive clients insane.',                                 minPrice:10,   maxPrice:90,    unit:'chip',    maxCarry:25 },
  rfmodule:   { name:'RF Module 2.4GHz',    short:'Wireless transceiver, FCC/CE TBD',   learn:'RF modules handle wireless communication on the 2.4GHz band — shared with WiFi, Bluetooth, and microwave ovens. These need FCC/CE certification to legally sell in the US/EU. Uncertified modules are cheaper but legally restricted to development use only.',                                                                            minPrice:45,   maxPrice:280,   unit:'module',  maxCarry:12 },
  milspec_ic: { name:'Mil-Spec IC',         short:'MIL-PRF-38535 qualified, −55°C/125°C', learn:'Mil-spec ICs are tested to military performance standards: temperature range −55°C to 125°C, radiation tolerance, and vibration resistance. They cost 10–100× civilian parts for the same function. The paperwork (traceability, certificates of conformance) can cost more than the part.',                                           minPrice:300,  maxPrice:2500,  unit:'unit',    maxCarry:10, opMin:2 },
  tapeout:    { name:'Tapeout Slot',        short:'Reserved fab time, 180nm PDK',        learn:'A tapeout slot is reserved time at a semiconductor fab to manufacture your custom chip design. "Taping out" means you\'re done designing — the masks get made and the silicon gets etched. Shuttle runs share a wafer across many small designs, dramatically reducing cost. A private tapeout on modern nodes costs $5–50M.',                 minPrice:800,  maxPrice:5000,  unit:'slot',    maxCarry:3,  opMin:2 },
  custom_asic:{ name:'Custom ASIC Die',     short:'Taped-out 180nm CMOS, 1mm², wafer-cut', learn:'A custom ASIC is a chip designed for exactly one purpose. At 180nm you\'re doing analog/mixed-signal or simple digital — fast enough for control systems, cheap enough for small volumes. Each die is ~1mm². One 100mm wafer yields a few thousand die at this scale. The value is the IP baked into the silicon, not the silicon itself.',  minPrice:2000, maxPrice:15000, unit:'die',     maxCarry:5,  opMin:3 },
  wafer_lot:  { name:'Wafer Lot (100mm)',   short:'25 wafers, IHP SG13G2, partial yield', learn:'A wafer lot is a batch of semiconductor wafers from a single fab run. IHP SG13G2 is a 130nm BiCMOS process popular for RF/mmWave designs. Buying a lot means betting on the yield and reselling to design houses who missed the shuttle. A contamination event can write off the whole lot — every die on 25 wafers gone.',             minPrice:5000, maxPrice:28000, unit:'lot',     maxCarry:2,  opMin:3 },
  gds_package:  { name:'GDS-II Package',       short:'Complete IC layout, mask-ready GDSII', learn:'GDS-II is the industry-standard file format for integrated circuit layouts — the precise geometric description of every polygon on every metal layer of a chip. When a design is GDS-II complete it means the layout is done and ready to generate photomasks. One design package can be worth millions if it solves a hard problem. Buying someone\'s GDS-II is like buying their entire engineering team\'s work.',               minPrice:3000,  maxPrice:20000, unit:'package', maxCarry:3,  opMin:4 },
  test_fixture: { name:'Bringup Test Fixture', short:'Custom PCB, probes, JTAG scripts',     learn:'First silicon bringup is the highest-stakes debugging session in hardware engineering. You have one shot to find out if the chip works before committing to production. A test fixture is custom hardware built to exercise every pin, measure every supply, and check every register on the new die. A good fixture catches power-sequencing issues, clock startup problems, and pin-to-pin shorts before they become manufacturing disasters.',  minPrice:1500,  maxPrice:9000,  unit:'fixture', maxCarry:4,  opMin:4 },
  bringup_board:{ name:'Bringup Board',        short:'First silicon eval, custom PCB',       learn:'A bringup board is the first PCB designed to host a newly taped-out chip. Every signal is broken out to test points. Power rails are individually monitored. The schematic is simpler than a production design — because you need to understand what\'s wrong when it doesn\'t work. Getting a chip to boot for the first time on its bringup board is one of the best moments in hardware engineering.',                               minPrice:800,   maxPrice:5000,  unit:'board',   maxCarry:6,  opMin:4 },
};

// ================================================================
//  CITIES
// ================================================================
const CITIES = {
  shenzhen:  { name:'Shenzhen',  code:'SZX', desc:'Huaqiangbei market. Millions of parts in 6 blocks. Cheapest anywhere. Counterfeit risk is real.',                                priceMultiplier:0.70, variance:0.34, counterfeits:0.18, shopItems:['storage_rack'] },
  austin:    { name:'Austin',    code:'AUS', desc:'TI headquarters, NXP design center, solid distributors. Stable. Reliable. Boring in the best way.',                              priceMultiplier:1.00, variance:0.12, counterfeits:0,    shopItems:['storage_rack','rework_station'] },
  toronto:   { name:'Toronto',   code:'YYZ', desc:'FPGA trainer market, open-source culture. Makers and universities who actually pay net-30.',                                      priceMultiplier:1.08, variance:0.20, counterfeits:0,    shopItems:['usb_scope'],                   repBonus:true, specialBias:{ tangnano:1.4, ipcores:1.3 } },
  tokyo:     { name:'Tokyo',     code:'TYO', desc:'Akihabara Electronics District. Precision components and RF. Premium prices, premium quality.',                                   priceMultiplier:1.14, variance:0.16, counterfeits:0,    shopItems:['usb_scope','rework_station'],   languageBarrier:true, specialBias:{ rfmodule:1.7, resistors:1.2 } },
  pentagon:  { name:'Pentagon',  code:'DCA', desc:'DoD contracting district. Mil-spec margins are real. So is ITAR exposure. Every transaction is logged.',                         priceMultiplier:1.40, variance:0.08, counterfeits:0,    shopItems:[],                              itar:true, specialBias:{ milspec_ic:2.0, tapeout:2.5, ipcores:1.5 }, opMin:2 },
  singapore: { name:'Singapore', code:'SIN', desc:'GlobalFoundries Southeast Asia. ASIC shuttle hub. Strict IP laws, zero counterfeits. Fastest customs in Asia.',                  priceMultiplier:1.55, variance:0.10, counterfeits:0,    shopItems:[],                              specialBias:{ custom_asic:2.2, wafer_lot:2.0, tapeout:1.8, ipcores:1.4 }, opMin:3 },
  tsmc_hq:   { name:'TSMC HQ',        code:'TSM', desc:'Hsinchu Science Park. The world\'s most advanced foundry. Allocation is everything. Margins are enormous. NDA required at the gate.',  priceMultiplier:2.10, variance:0.06, counterfeits:0,    shopItems:[],                              specialBias:{ gds_package:2.8, tapeout:3.2, bringup_board:2.0, test_fixture:2.5 }, opMin:4 },
  ihp_shuttle:{ name:'IHP Shuttle Hub', code:'IHP', desc:'Frankfurt open-access fab. SG13G2 BiCMOS, 130nm. Academic and startup pricing. No NDA. Community shuttle every 6 months.',          priceMultiplier:1.35, variance:0.18, counterfeits:0,    shopItems:[],                              specialBias:{ gds_package:1.9, bringup_board:1.7, test_fixture:1.6, wafer_lot:1.8 }, opMin:4 },
};

// ================================================================
//  ROUTE BASE COSTS (bus ₿ base — plane is ~3.2×)
// ================================================================
const ROUTE_BASE = {
  shenzhen:   { austin:70, toronto:75, tokyo:30, pentagon:90, singapore:25, tsmc_hq:35, ihp_shuttle:80 },
  austin:     { shenzhen:70, toronto:25, tokyo:80, pentagon:20, singapore:85, tsmc_hq:90, ihp_shuttle:90 },
  toronto:    { shenzhen:75, austin:25, tokyo:80, pentagon:25, singapore:90, tsmc_hq:90, ihp_shuttle:85 },
  tokyo:      { shenzhen:30, austin:80, toronto:80, pentagon:90, singapore:20, tsmc_hq:20, ihp_shuttle:85 },
  pentagon:   { shenzhen:90, austin:20, toronto:25, tokyo:90, singapore:95, tsmc_hq:95, ihp_shuttle:95 },
  singapore:  { shenzhen:25, austin:85, toronto:90, tokyo:20, pentagon:95, tsmc_hq:30, ihp_shuttle:90 },
  tsmc_hq:    { shenzhen:35, austin:90, toronto:90, tokyo:20, pentagon:95, singapore:30, ihp_shuttle:85 },
  ihp_shuttle:{ shenzhen:80, austin:90, toronto:85, tokyo:85, pentagon:95, singapore:90, tsmc_hq:85 },
};

// ================================================================
//  EQUIPMENT
// ================================================================
const EQUIPMENT = {
  usb_scope:      { name:'USB Oscilloscope',      short:'Tektronix TDS2012B, battered',   icon:'〜', cost:200, effect:'Unlocks scope hints on repair jobs (+40% payout)',  learn:'An oscilloscope measures voltage over time. Essential for real debugging. Without it you\'re basically guessing.',  onBuy(s){ s.hasScope=true; } },
  storage_rack:   { name:'ESD Storage Rack',      short:'48-drawer antistatic organizer', icon:'▦', cost:300, effect:'Carry capacity ×2',                                 learn:'ESD-safe storage uses conductive plastic that dissipates static slowly. 48 drawers means significantly more inventory — organized, labeled, and protected.',                                      onBuy(s){ s.carryMultiplier=Math.max(s.carryMultiplier,2); } },
  rework_station: { name:'Hot Air Rework Station', short:'Hakko FR-810B, 850W',           icon:'♨', cost:450, effect:'BGA carry +10, sell value +25%',                    learn:'Hot air rework lets you remove and replace BGA chips without destroying the board. The Hakko FR-810B is the industry standard.',                                                               onBuy(s){ s.reworkStation=true; } },
};

// ================================================================
//  MUSIC ENGINE  (Web Audio API procedural chiptune)
// ================================================================
// Note frequencies used across all tracks
const N = {
  C3:130.81, D3:146.83, Eb3:155.56, E3:164.81, F3:174.61, G3:196.00, A3:220.00, Bb3:233.08, B3:246.94,
  C4:261.63, D4:293.66, Eb4:311.13, E4:329.63, F4:349.23, G4:392.00, A4:440.00, Bb4:466.16, B4:493.88,
  C5:523.25, D5:587.33, E5:659.25, F5:698.46, G5:784.00,
};

const TRACKS = [
  {
    name: 'GRID RUNNER',
    bpm: 132,
    melody: [
      N.C4,  N.G3,  N.Eb4, N.C4,  N.G3,  0,     N.Bb3, N.C4,
      N.Eb4, N.F4,  N.Eb4, N.C4,  N.G3,  N.Bb3, N.C4,  0,
      N.C4,  N.Eb4, N.G4,  N.Eb4, N.C4,  N.G3,  N.Bb3, N.C4,
      N.F4,  N.Eb4, N.C4,  N.Bb3, N.G3,  N.Eb3, N.C4,  0,
    ],
    bass: [
      N.C3,  0, N.G3,  0, N.C3,  0, N.G3,  0,
      N.Bb3, 0, N.F3,  0, N.G3,  0, N.Eb3, 0,
      N.C3,  0, N.G3,  0, N.C3,  0, N.G3,  0,
      N.F3,  0, N.Bb3, 0, N.G3,  0, N.C3,  0,
    ],
    melType: 'square', bassType: 'triangle',
  },
  {
    name: 'SILICON DRIFT',
    bpm: 112,
    melody: [
      N.E4,  N.G4,  N.A4,  0,     N.B4,  N.A4,  N.G4,  N.E4,
      N.D4,  N.E4,  N.G4,  N.A4,  N.G4,  0,     N.E4,  0,
      N.A4,  N.B4,  N.C5,  N.B4,  N.A4,  N.G4,  N.E4,  N.D4,
      N.E4,  N.G4,  N.A4,  N.G4,  N.E4,  N.D4,  N.E4,  0,
    ],
    bass: [
      N.A3,  0, N.E3,  0, N.A3,  0, N.E3,  0,
      N.D3,  0, N.A3,  0, N.E3,  0, N.D3,  0,
      N.A3,  0, N.E3,  0, N.A3,  0, N.E3,  0,
      N.D3,  0, N.A3,  0, N.E3,  0, N.A3,  0,
    ],
    melType: 'sawtooth', bassType: 'triangle',
  },
  {
    name: 'TARIFF SPIKE',
    bpm: 158,
    melody: [
      N.G4,  N.G4,  N.Bb4, N.G4,  N.F4,  0,     N.Eb4, N.F4,
      N.G4,  N.Bb4, N.G4,  N.F4,  N.Eb4, N.F4,  N.G4,  0,
      N.Bb4, N.G4,  N.F4,  N.Eb4, N.F4,  N.G4,  N.Bb4, N.C5,
      N.Bb4, N.G4,  N.F4,  N.Eb4, N.F4,  N.G4,  N.Eb4, 0,
    ],
    bass: [
      N.G3,  0, N.G3,  N.Bb3, N.G3,  0, N.F3,  0,
      N.Eb3, 0, N.Bb3, 0,     N.G3,  0, N.F3,  0,
      N.G3,  0, N.G3,  N.Bb3, N.G3,  0, N.F3,  0,
      N.Eb3, 0, N.Bb3, 0,     N.G3,  0, N.G3,  0,
    ],
    melType: 'square', bassType: 'sawtooth',
  },
  {
    name: 'DEEP TRACE',
    bpm: 96,
    melody: [
      N.D4,  0,     N.F4,  N.A4,  0,     N.A4,  N.C5,  N.A4,
      N.F4,  N.D4,  0,     N.E4,  N.F4,  N.A4,  0,     0,
      N.A4,  N.C5,  N.D5,  N.C5,  N.A4,  0,     N.F4,  N.A4,
      N.C5,  N.A4,  N.F4,  N.D4,  N.E4,  N.F4,  N.D4,  0,
    ],
    bass: [
      N.D3,  0, N.A3,  0, N.D3,  0, N.A3,  0,
      N.F3,  0, N.C3,  0, N.A3,  0, N.F3,  0,
      N.D3,  0, N.A3,  0, N.D3,  0, N.A3,  0,
      N.F3,  0, N.C3,  0, N.D3,  0, N.A3,  0,
    ],
    melType: 'triangle', bassType: 'sine',
  },
];

const MUSIC = {
  ctx: null, masterGain: null,
  playing: false, schedulerID: null,
  nextNoteTime: 0, currentNote: 0,
  trackIndex: 0,

  get track() { return TRACKS[this.trackIndex]; },

  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = SETTINGS.volume;
      this.masterGain.connect(this.ctx.destination);
    } catch(e) { console.warn('Web Audio not available:', e); }
  },

  playNote(freq, startTime, duration, type, gainVal) {
    if (!freq || !this.ctx) return;
    try {
      const osc  = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(gainVal, startTime + 0.01);
      gain.gain.setValueAtTime(gainVal, startTime + duration * 0.7);
      gain.gain.linearRampToValueAtTime(0, startTime + duration - 0.01);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch(e) {}
  },

  schedule() {
    if (!this.playing) return;
    const t = this.track;
    const spn = (60 / t.bpm) / 2;
    while (this.nextNoteTime < this.ctx.currentTime + 0.15) {
      const idx = this.currentNote % t.melody.length;
      this.playNote(t.melody[idx], this.nextNoteTime, spn * 0.82, t.melType,  0.07);
      this.playNote(t.bass[idx],   this.nextNoteTime, spn * 0.92, t.bassType, 0.10);
      this.nextNoteTime += spn;
      this.currentNote++;
    }
    this.schedulerID = setTimeout(() => this.schedule(), 50);
  },

  start() {
    if (this.playing) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    this.playing = true;
    this.currentNote = 0;
    this.nextNoteTime = this.ctx.currentTime + 0.1;
    this.schedule();
    updateSettingsUI();
  },

  stop() {
    this.playing = false;
    if (this.schedulerID) { clearTimeout(this.schedulerID); this.schedulerID = null; }
    updateSettingsUI();
  },

  nextTrack() {
    const wasPlaying = this.playing;
    this.stop();
    this.trackIndex = (this.trackIndex + 1) % TRACKS.length;
    SETTINGS.trackIndex = this.trackIndex;
    saveSettings();
    updateSettingsUI();
    if (wasPlaying) this.start();
  },

  setVolume(v) { if (this.masterGain) this.masterGain.gain.value = v; },
};

// ================================================================
//  SETTINGS
// ================================================================
let SETTINGS = { music: true, volume: 0.18, sfx: true, scanlines: true, trackIndex: 0 };

function loadSettings() {
  try {
    const saved = localStorage.getItem('sf_settings');
    if (saved) Object.assign(SETTINGS, JSON.parse(saved));
    MUSIC.trackIndex = SETTINGS.trackIndex || 0;
  } catch(e) {}
}

function saveSettings() {
  localStorage.setItem('sf_settings', JSON.stringify(SETTINGS));
}

function applySettings() {
  qs('#scanlines').style.display = SETTINGS.scanlines ? '' : 'none';
  MUSIC.setVolume(SETTINGS.volume);
  updateSettingsUI();
}

function updateSettingsUI() {
  const setBtn = (id, on) => {
    const el = qs(id);
    if (!el) return;
    el.textContent = on ? 'ON' : 'OFF';
    el.className = 'toggle-btn' + (on ? ' active' : '');
  };
  setBtn('#sett-music', MUSIC.playing);
  setBtn('#sett-sfx',   SETTINGS.sfx);
  setBtn('#sett-scan',  SETTINGS.scanlines);
  const volEl = qs('#sett-vol');
  if (volEl) volEl.value = Math.round(SETTINGS.volume * 100);
  const trackEl = qs('#sett-track-name');
  if (trackEl) trackEl.textContent = MUSIC.track.name;
}

function toggleMusic() {
  if (MUSIC.playing) MUSIC.stop(); else MUSIC.start();
  SETTINGS.music = MUSIC.playing;
  saveSettings();
}
function setVolume(v) { SETTINGS.volume = v / 100; MUSIC.setVolume(SETTINGS.volume); saveSettings(); }
function toggleSfx()  { SETTINGS.sfx = !SETTINGS.sfx; updateSettingsUI(); saveSettings(); }
function toggleScanlines() {
  SETTINGS.scanlines = !SETTINGS.scanlines;
  qs('#scanlines').style.display = SETTINGS.scanlines ? '' : 'none';
  updateSettingsUI(); saveSettings();
}

// ================================================================
//  PUZZLES
// ================================================================
const PUZZLES = [
  {
    id:'power_filter', title:'FIX: POWER SUPPLY RIPPLE',
    client:'Makespace YYZ', rewardBase:400,
    problem:'STM32 resets randomly under load. Power filter stage missing. Place the right component in the filter slot.',
    scopeHint:'Scope on VCC: 200mV p-p ripple at ~1kHz. Load transient causes brownout. Need C > 100µF. Place bulk cap across rail.',
    schematic:`  VCC ──[FUSE 500mA]──┬──── VCC_CLEAN\n                       │\n                    [SLOT A]\n                       │\n                      GND`,
    slots:[{ id:'sA', label:'SLOT A — Filter stage (VCC → GND)', accepts:'cap_100uf' }],
    components:[
      { id:'cap_100uf', type:'cap_100uf', label:'◎ CAP 100µF',   hint:'Bulk filter, smooths ripple' },
      { id:'res_1k',    type:'res_1k',    label:'⧖ RES 1kΩ',     hint:'Limits current flow' },
      { id:'diode',     type:'diode',     label:'◁ DIODE 1N4148', hint:'Prevents reverse current' },
      { id:'led',       type:'led',       label:'★ LED RED',      hint:'Emits light when current flows' },
    ],
    learn:'A bulk capacitor stores charge and releases it during load spikes. Without it, VCC dips when the MCU runs high-current ops (like flash writes), causing a brownout reset. 100µF is standard for small microcontroller rails.',
  },
  {
    id:'led_driver', title:'FIX: LED BURNS OUT INSTANTLY',
    client:'Austin Robotics Club', rewardBase:350,
    problem:'Indicator LED burns out in seconds. No current limiting. Place a current-limiting component between VCC and the LED anode.',
    scopeHint:'Current probe: 380mA forward. LED rating is 15mA. That\'s 25× rated power. Fix: R = (5 − 2.2) / 0.015 = 187Ω. Use 220Ω.',
    schematic:`  VCC ──[SLOT A]──┤►├──── GND\n                   LED (Vf = 2.2V)\n\n  Supply: 5V  Target current: 15mA`,
    slots:[{ id:'sA', label:'SLOT A — Current limiter (VCC → LED)', accepts:'res_220' }],
    components:[
      { id:'res_220',    type:'res_220',    label:'⧖ RES 220Ω',    hint:'Sets LED current via Ohm\'s Law' },
      { id:'cap_100uf',  type:'cap_100uf',  label:'◎ CAP 100µF',   hint:'Bulk filter capacitor' },
      { id:'diode',      type:'diode',      label:'◁ DIODE 1N4148', hint:'Blocks reverse current' },
      { id:'transistor', type:'transistor', label:'▲ NPN 2N2222',  hint:'Current amplifier' },
    ],
    learn:'Every LED needs a current-limiting resistor. Ohm\'s Law: R = (Vsupply − Vforward) / Idesired = (5 − 2.2) / 0.015 = 187Ω → use 220Ω. This is one of the first things hardware engineers memorize.',
  },
  {
    id:'pull_up', title:'FIX: BUTTON READS GARBAGE',
    client:'Shenzhen Proto House', rewardBase:500,
    problem:'Floating GPIO pin reads random 1s and 0s with no button press. The pin needs to be defined when the button circuit is open.',
    scopeHint:'Pin voltage floats between 1.4V and 3.3V — classic floating input noise. Pull-up to VCC (10kΩ): button open → pin HIGH. Pressed → pin LOW.',
    schematic:`  VCC ──[SLOT A]──┬── MCU_PIN (GPIO input)\n                   │\n               [BUTTON]\n                   │\n                  GND\n\n  Button open → pin must be defined HIGH`,
    slots:[{ id:'sA', label:'SLOT A — Pull-up resistor (VCC → pin)', accepts:'res_10k' }],
    components:[
      { id:'res_10k',   type:'res_10k',   label:'⧖ RES 10kΩ',    hint:'Defines floating pin state' },
      { id:'cap_100uf', type:'cap_100uf', label:'◎ CAP 100µF',   hint:'Power filter capacitor' },
      { id:'led',       type:'led',       label:'★ LED RED',      hint:'Emits light when current flows' },
      { id:'diode',     type:'diode',     label:'◁ DIODE 1N4148', hint:'Prevents reverse current' },
    ],
    learn:'A floating input reads random values because it\'s sensitive to electromagnetic noise. A pull-up connects the pin to VCC through a resistor, forcing it HIGH when open. Pressing the button grounds the pin → reads LOW.',
  },
  {
    id:'uart_idle', title:'FIX: UART TX STUCK LOW',
    client:'Tokyo Proto Lab', rewardBase:450,
    problem:'UART communication fails immediately. TX line idles LOW — protocol requires idle HIGH.',
    scopeHint:'TX line at 0V between bytes. UART idle state must be logic HIGH (MARK state). 10kΩ pull-up to VCC defines idle state without fighting the driver.',
    schematic:`  VCC ──[SLOT A]──┬── TX_LINE → remote RX\n                   │\n              [MCU UART TX]\n\n  Idle state: must be HIGH between bytes`,
    slots:[{ id:'sA', label:'SLOT A — Pull-up (VCC → TX line)', accepts:'res_10k' }],
    components:[
      { id:'res_10k',   type:'res_10k',   label:'⧖ RES 10kΩ',   hint:'Defines idle state via pull-up' },
      { id:'cap_100uf', type:'cap_100uf', label:'◎ CAP 100µF',  hint:'Bulk power filter' },
      { id:'led',       type:'led',       label:'★ LED RED',     hint:'Emits light when current flows' },
      { id:'diode',     type:'diode',     label:'◁ DIODE 1N4148',hint:'Reverse current protection' },
    ],
    learn:'UART idles HIGH — called the "MARK" state. When the line idles low, receivers misinterpret every silence as framing errors. A 10kΩ pull-up guarantees the line returns HIGH when not driven.',
  },
  {
    id:'bypass_cap', title:'FIX: MCU CRASHES UNDER ADC LOAD',
    client:'Austin Robotics Club', rewardBase:380,
    problem:'MCU runs fine at low speed but crashes when the ADC fires. Need a high-frequency bypass cap right at the IC VDD pin.',
    scopeHint:'Probe VDD during ADC conversion: 120mV spike, ~50ns wide. 100nF placed within 2mm of VDD pin reduces this to <10mV.',
    schematic:`  VCC_3V3 ──[FUSE]──┬──── IC VDD\n                      │\n                   [SLOT A]\n                      │\n                     GND\n\n  Cap must be near IC (minimize trace inductance)`,
    slots:[{ id:'sA', label:'SLOT A — Bypass cap (VDD → GND)', accepts:'cap_100nf' }],
    components:[
      { id:'cap_100nf', type:'cap_100nf', label:'◎ CAP 100nF',  hint:'High-freq bypass, kills VDD spikes' },
      { id:'res_10k',   type:'res_10k',   label:'⧖ RES 10kΩ',  hint:'Pull-up resistor, wrong type here' },
      { id:'cap_100uf', type:'cap_100uf', label:'◎ CAP 100µF',  hint:'Bulk storage — too slow for IC spikes' },
      { id:'led',       type:'led',       label:'★ LED RED',    hint:'Indicator light' },
    ],
    learn:'Decoupling capacitors are the most-placed component in electronics. Every IC needs one right at its power pin. The 100nF handles high-frequency current spikes; 100µF bulk cap is too slow for MHz-range transients.',
  },
  {
    id:'flyback_diode', title:'FIX: MOSFET DIES DRIVING MOTOR',
    client:'Shenzhen Proto House', rewardBase:520,
    problem:'MOSFET keeps blowing up when the motor is switched off. Inductive kick spikes the drain voltage above 100V.',
    scopeHint:'MOSFET drain at motor-off: 87V spike, 2µs duration. VDS max rating is 40V. Flyback diode clamps to Vsupply + 0.7V.',
    schematic:`  VCC_12V ──┬──── MOTOR (+)\n             │          │\n          [SLOT A]   MOTOR COIL\n             │          │\n            MOSFET ─── MOTOR (−)\n\n  Motor off → coil dumps energy → MOSFET dies`,
    slots:[{ id:'sA', label:'SLOT A — Flyback clamp (VCC ← inductive kick)', accepts:'diode' }],
    components:[
      { id:'diode',     type:'diode',     label:'◁ DIODE 1N4148', hint:'Clamps inductive kickback' },
      { id:'cap_100uf', type:'cap_100uf', label:'◎ CAP 100µF',   hint:'Bulk filter' },
      { id:'res_220',   type:'res_220',   label:'⧖ RES 220Ω',   hint:'Current limiter' },
      { id:'led',       type:'led',       label:'★ LED RED',     hint:'Indicator' },
    ],
    learn:'When a motor is suddenly disconnected, the magnetic field collapses and generates a voltage spike — L × (dI/dt). On 12V motors this easily hits 100V+. A flyback diode clamps this: when the MOSFET turns off, the diode conducts the kickback energy back into VCC.',
  },
  {
    id:'i2c_pullup', title:'FIX: I2C BUS STUCK LOW',
    client:'Toronto Maker Hub', rewardBase:480,
    problem:'I2C bus shows SDA stuck at 0V. I2C is open-drain — it needs external pull-ups to define the HIGH state.',
    scopeHint:'SDA line: constant 0V. I2C is open-drain: devices can only pull low, never drive high. Standard: 4.7kΩ to VCC for up to 400kHz.',
    schematic:`  VCC ──[SLOT A]──── SDA (I2C data)\n                         │\n                   [Device 1] [Device 2]\n                   (open-drain outputs)\n\n  Without pull-up: SDA stuck LOW permanently`,
    slots:[{ id:'sA', label:'SLOT A — SDA pull-up (VCC → SDA)', accepts:'res_4k7' }],
    components:[
      { id:'res_4k7',   type:'res_4k7',   label:'⧖ RES 4.7kΩ',   hint:'I2C standard pull-up value' },
      { id:'res_10k',   type:'res_10k',   label:'⧖ RES 10kΩ',    hint:'Too high for I2C at 400kHz' },
      { id:'cap_100nf', type:'cap_100nf', label:'◎ CAP 100nF',   hint:'Bypass capacitor' },
      { id:'diode',     type:'diode',     label:'◁ DIODE 1N4148', hint:'Directional only' },
    ],
    learn:'I2C uses open-drain outputs: devices can only pull lines LOW. The HIGH state is created by pull-up resistors to VCC. 4.7kΩ is standard for 400kHz. Without pull-ups, both SDA and SCL sit at 0V regardless of software.',
  },
  {
    id:'crystal_load', title:'FIX: OSCILLATOR NOT STARTING',
    client:'Austin Chip District', rewardBase:550,
    problem:'MCU clock source is a 16MHz crystal but the chip never starts. Crystal requires specific load caps on both XTAL pins.',
    scopeHint:'XTAL1 and XTAL2 show no oscillation. Crystal spec: 16MHz, CL=12pF. Formula: C = 2×CL − stray ≈ 22pF.',
    schematic:`  XTAL1 ──[SLOT A]──── GND\n      │\n  [16MHz XTAL]   MCU\n      │\n  XTAL2 ──[22pF]──── GND\n\n  Crystal needs matched load caps to oscillate`,
    slots:[{ id:'sA', label:'SLOT A — Load cap (XTAL1 → GND)', accepts:'cap_22pf' }],
    components:[
      { id:'cap_22pf',  type:'cap_22pf',  label:'◎ CAP 22pF',  hint:'Crystal load cap (matched pair)' },
      { id:'cap_100nf', type:'cap_100nf', label:'◎ CAP 100nF', hint:'Too large — kills oscillation' },
      { id:'res_10k',   type:'res_10k',   label:'⧖ RES 10kΩ', hint:'Wrong type for oscillator' },
      { id:'cap_100uf', type:'cap_100uf', label:'◎ CAP 100µF', hint:'Way too large for crystal' },
    ],
    learn:'Crystals are precision mechanical resonators. Load capacitors tune the resonant frequency and control startup gain. Too low → doesn\'t start. Too high → starts but runs off-frequency. The 22pF comes from the crystal\'s CL spec and board stray capacitance.',
  },
  {
    id:'esd_protect', title:'FIX: USB PORT KILLS HOST CHIPS',
    client:'Shenzhen Proto House', rewardBase:600,
    problem:'USB device occasionally destroys host controller chips. ESD on the connector is coupling through to the data lines.',
    scopeHint:'ESD simulator: 4kV contact discharge on USB shell. Without protection: 380V spike on D+, 8ns rise time. With TVS: clamped to 5.6V in <1ns.',
    schematic:`  USB_D+ ──┬──── MCU USB PHY\n            │\n         [SLOT A]\n            │\n           GND\n\n  ESD couples: USB shell → data lines → host IC`,
    slots:[{ id:'sA', label:'SLOT A — ESD clamp (D+ → GND)', accepts:'tvs_diode' }],
    components:[
      { id:'tvs_diode', type:'tvs_diode', label:'◁◁ TVS DIODE', hint:'Bidirectional ESD clamp, <1ns' },
      { id:'diode',     type:'diode',     label:'◁ DIODE 1N4148',hint:'Too slow for ESD (4ns switch time)' },
      { id:'res_220',   type:'res_220',   label:'⧖ RES 220Ω',  hint:'Wrong type for ESD protection' },
      { id:'cap_100nf', type:'cap_100nf', label:'◎ CAP 100nF', hint:'Not fast enough for ESD transients' },
    ],
    learn:'ESD events are 4,000–15,000 volts in nanoseconds. A standard diode switches in ~4ns — too slow. A TVS responds in under 1 picosecond by avalanche breakdown. Every USB, HDMI, and Ethernet port needs TVS protection.',
  },
  // ── Two-slot circuit repair ────────────────────────────────────
  {
    id:'two_stage_filter', title:'FIX: TWO-STAGE POWER FILTER MISSING',
    client:'Austin Robotics Club', rewardBase:620,
    problem:'ADC reads are noisy at high speed AND the MCU resets under load. Both a bulk filter cap and a bypass cap are missing from the power rail.',
    scopeHint:'VCC under load: 180mV p-p ripple at 1kHz (bulk cap missing) + 90mV spike at 10MHz during ADC (bypass missing). Fix: 100µF bulk + 100nF bypass, placed in series from VCC to GND.',
    schematic:`  VCC ──┬──── VCC_CLEAN\n        │\n     [SLOT A]      ← Bulk filter (handles kHz transients)\n        │\n     [SLOT B]      ← Bypass (handles MHz ADC spikes)\n        │\n       GND\n\n  Both stages required — different frequency roles`,
    slots:[
      { id:'sA', label:'SLOT A — Bulk filter (VCC rail, low-freq)', accepts:'cap_100uf' },
      { id:'sB', label:'SLOT B — Bypass decoupling (VCC pin, high-freq)', accepts:'cap_100nf' },
    ],
    components:[
      { id:'cap_100uf', type:'cap_100uf', label:'◎ CAP 100µF',  hint:'Bulk storage — handles kHz transients' },
      { id:'cap_100nf', type:'cap_100nf', label:'◎ CAP 100nF',  hint:'Bypass — handles MHz IC switching noise' },
      { id:'res_10k',   type:'res_10k',   label:'⧖ RES 10kΩ',  hint:'Pull-up resistor — wrong type here' },
      { id:'diode',     type:'diode',     label:'◁ DIODE 1N4148',hint:'Reverse protection — wrong here' },
      { id:'led',       type:'led',       label:'★ LED RED',    hint:'Indicator — not for filtering' },
    ],
    learn:'Power filtering is hierarchical. The 100µF bulk cap handles large, slow transients from load switching. The 100nF bypass handles fast, small spikes from IC digital switching. They operate at different frequencies and cannot substitute for each other. Every IC needs both.',
  },
  {
    id:'half_bridge_drive', title:'FIX: HALF-BRIDGE DRIVER MISSING COMPONENTS',
    client:'Shenzhen Proto House', rewardBase:680,
    problem:'A half-bridge MOSFET driver is oscillating at turn-on and the high-side gate charge is unstable. Both a gate resistor and a bootstrap capacitor are missing.',
    scopeHint:'Gate waveform: 40V/ns ringing at turn-on (no gate R). High-side gate-source voltage collapses mid-conduction (bootstrap cap empty). Need: 10Ω gate resistor to damp ringing, 100nF bootstrap cap to supply high-side charge pump.',
    schematic:`  VCC_12V ──[BOOTSTRAP CAP SLOT]──┬── High-side gate supply\n                                    │\n                             [Gate driver IC]\n                                    │\n                         [GATE RES SLOT]── HI_MOSFET gate\n                                    │\n                               HI_MOSFET drain ── LOAD ── VCC\n                                    │\n                               HI_MOSFET source\n\n  Bootstrap: charges from VCC when low-side on\n  Gate R: slows dV/dt to prevent ringing`,
    slots:[
      { id:'sA', label:'SLOT A — Bootstrap cap (high-side charge pump)', accepts:'cap_100nf' },
      { id:'sB', label:'SLOT B — Gate resistor (damps switching ringing)', accepts:'res_10k' },
    ],
    components:[
      { id:'cap_100nf',  type:'cap_100nf',  label:'◎ CAP 100nF',   hint:'Bootstrap charge pump — supplies high-side gate' },
      { id:'res_10k',    type:'res_10k',    label:'⧖ RES 10kΩ',    hint:'Gate resistor — controls dV/dt and ringing' },
      { id:'cap_100uf',  type:'cap_100uf',  label:'◎ CAP 100µF',   hint:'Too large — wrong frequency range' },
      { id:'tvs_diode',  type:'tvs_diode',  label:'◁◁ TVS DIODE',  hint:'ESD clamp — not a charge pump' },
      { id:'led',        type:'led',        label:'★ LED RED',      hint:'Indicator — wrong application' },
    ],
    learn:'Half-bridge drivers float the high-side gate above VCC — it needs its own charge supply (the bootstrap cap). Without it, gate drive collapses mid-cycle. Gate resistors limit the dV/dt at turn-on: too fast → ringing and EMI; too slow → switching losses. Both are mandatory for reliable operation.',
  },
  {
    id:'rs485_bias', title:'FIX: RS-485 BUS NOT DRIVING',
    client:'Tokyo Proto Lab', rewardBase:590,
    problem:'RS-485 bus fails when all transmitters are disabled — the bus floats to an indeterminate state. Both a pull-up on A (non-inverting) and a pull-down on B (inverting) are needed to bias the bus to a known MARK state.',
    scopeHint:'Bus idle: A and B both floating near 1.5V — receiver sees differential near 0V, interprets as line contention. With bias: A pulled to VCC through 4.7kΩ, B pulled to GND through 4.7kΩ → differential = +VCC, valid MARK state.',
    schematic:`  VCC ──[SLOT A]──── A-LINE (+) ────── to remote\n                                  │\n                          [RS-485 Bus]\n                                  │\n  GND ──[SLOT B]──── B-LINE (−) ────── to remote\n\n  Idle state: A must be HIGH, B must be LOW\n  Without bias: bus floats → garbage on idle`,
    slots:[
      { id:'sA', label:'SLOT A — Pull-up on A-line (A → VCC via resistor)', accepts:'res_4k7' },
      { id:'sB', label:'SLOT B — Pull-down on B-line (B → GND via resistor)', accepts:'res_4k7b' },
    ],
    components:[
      { id:'res_4k7a',  type:'res_4k7',    label:'⧖ RES 4.7kΩ (pull-up)',    hint:'RS-485 standard A-line bias' },
      { id:'res_4k7b',  type:'res_4k7b',   label:'⧖ RES 4.7kΩ (pull-down)',  hint:'RS-485 standard B-line bias' },
      { id:'res_10k',   type:'res_10k',    label:'⧖ RES 10kΩ',               hint:'Too high — insufficient bias current' },
      { id:'cap_100nf', type:'cap_100nf',  label:'◎ CAP 100nF',              hint:'Bypass cap — wrong for bias network' },
      { id:'diode',     type:'diode',      label:'◁ DIODE 1N4148',           hint:'Wrong type — no rectification needed here' },
    ],
    learn:'RS-485 is a differential bus — the line state is the voltage difference between A and B. When all drivers tri-state (disable), the bus floats. Failsafe bias resistors pull A high and B low to guarantee a known MARK state. Without them, receivers see a ~0V differential and interpret it as framing errors.',
  },
  // ── Additional single-slot repairs ────────────────────────────
  {
    id:'spi_cs_float', title:'FIX: SPI CHIP SELECT FLOATING',
    client:'Toronto Maker Hub', rewardBase:440,
    problem:'SPI peripheral activates randomly with no software trigger. Chip Select (CS) is active-low — when floating it dips below the threshold and enables the chip spuriously.',
    scopeHint:'CS line: oscillates between 0.8V–2.4V at rest with no SPI traffic. CS threshold: 1.8V. Floating input causes random selection. Pull-up to VCC ensures CS idles HIGH (deselected).',
    schematic:`  VCC ──[SLOT A]──── CS_LINE → SPI peripheral\n                         │\n                    [MCU GPIO / open-drain]\n\n  CS is active-low: HIGH = deselected (safe)\n  Floating CS dips LOW → spurious activation`,
    slots:[{ id:'sA', label:'SLOT A — Pull-up on CS (deselects chip at idle)', accepts:'res_10k' }],
    components:[
      { id:'res_10k',   type:'res_10k',   label:'⧖ RES 10kΩ',    hint:'Holds CS HIGH when not driven' },
      { id:'cap_100nf', type:'cap_100nf', label:'◎ CAP 100nF',   hint:'Decoupling — wrong for CS idle state' },
      { id:'diode',     type:'diode',     label:'◁ DIODE 1N4148', hint:'Reverse protection — wrong here' },
      { id:'led',       type:'led',       label:'★ LED RED',      hint:'Indicator — wrong application' },
    ],
    learn:'SPI uses active-low chip select — the device is selected when CS is LOW. A floating CS can drift below the logic threshold and enable the chip with no software action. Pull-up resistors guarantee the idle state is HIGH (safe/deselected) until the MCU deliberately drives it low.',
  },
  {
    id:'mosfet_gate_pulldown', title:'FIX: MOSFET WON\'T TURN OFF',
    client:'Austin Chip District', rewardBase:510,
    problem:'N-channel MOSFET stays partially on even when the gate driver output is disabled (high-impedance). Gate charge has nowhere to drain — the FET stays in linear region and heats up.',
    scopeHint:'Gate voltage when driver disabled: 2.8V (above Vth = 2.0V). Driver is tri-state, not actively pulling low. 10kΩ pull-down bleeds gate charge to GND: turn-off time ~10µs, gate drops to 0.3V.',
    schematic:`  Gate driver ──── MOSFET GATE ──[SLOT A]──── GND\n                       │\n                   MOSFET\n                       │\n                      GND\n\n  Driver disabled → gate floats at Vgs > Vth\n  Pull-down ensures gate goes to 0V on disable`,
    slots:[{ id:'sA', label:'SLOT A — Gate pull-down (GATE → GND)', accepts:'res_10k' }],
    components:[
      { id:'res_10k',   type:'res_10k',   label:'⧖ RES 10kΩ',    hint:'Bleeds gate charge — ensures full turn-off' },
      { id:'cap_100nf', type:'cap_100nf', label:'◎ CAP 100nF',   hint:'Stores charge — makes problem worse' },
      { id:'diode',     type:'diode',     label:'◁ DIODE 1N4148', hint:'Wrong direction — doesn\'t drain gate' },
      { id:'cap_100uf', type:'cap_100uf', label:'◎ CAP 100µF',   hint:'Far too slow for gate switching' },
    ],
    learn:'N-channel MOSFETs turn on when Vgs exceeds threshold (~2V). Gate charge is stored capacitively — if the driver tri-states without actively pulling the gate low, the gate floats above Vth and the FET stays partially on. A pull-down resistor (10–100kΩ) ensures the gate discharges to 0V whenever the driver is not actively driving it.',
  },
  // ── Diagnosis ─────────────────────────────────────────────────
  {
    id:'diag_baud', title:'DIAGNOSE: GARBLED UART OUTPUT', type:'diagnosis',
    client:'Toronto Maker Hub', rewardBase:420,
    problem:'Customer reports: "Serial monitor shows garbage characters. Code was working yesterday." You plug in the scope. What is the root cause?',
    scopeHint:'TX bit period measured: 87µs. Expected at 9600 baud: 104µs. Mismatch detected. Framing errors on every byte. Recent change: firmware update yesterday touched the peripheral clock tree.',
    scenario:`SCOPE READING — UART TX LINE:\n  Bit period measured:  87µs\n  Expected at 9600 baud: 104µs\n  Framing errors: YES — every byte\n  Signal amplitude: normal (3.3V swing)\n  Data pattern: regular, not random noise\n\nRecent change: firmware update yesterday`,
    choices:[
      { text:'Baud rate mismatch — transmitter shifted to ~11520 baud, receiver still at 9600', correct:true,  explain:'Correct. 1/87µs = 11,494 ≈ 11520 baud. The firmware update changed the clock divider for the UART peripheral. Fix: match both sides or roll back firmware.' },
      { text:'Broken TX wire — signal corrupting in transit', correct:false, explain:'A broken wire shows irregular noise or a flat line, not regular bit patterns with consistent period.' },
      { text:'Ground loop — voltage offset corrupting logic levels', correct:false, explain:'A ground loop creates a DC offset — level-shifted waveforms, not framing errors at correct signal amplitude.' },
      { text:'UART FIFO overflow — data being dropped by software', correct:false, explain:'FIFO overflow drops bytes but bit timing on TX would still be correct. The scope shows incorrect bit period — that\'s a clock issue.' },
    ],
    learn:'UART has no clock line — both sides must agree on baud rate. A 10% mismatch causes framing errors; >15% is guaranteed failure. Observe bit period on scope: frequency = 1/period. Always recalculate UART dividers after any clock configuration change.',
  },
  {
    id:'diag_thermal', title:'DIAGNOSE: IC THERMAL SHUTDOWN', type:'diagnosis',
    client:'Austin Robotics Club', rewardBase:450,
    problem:'A 5V LDO regulator shuts down after 30 seconds under load. Recovers after cooling. Diagnose the root cause.',
    scopeHint:'Thermal camera: regulator package 142°C at shutdown. Input: 12V, Output: 5V at 800mA. Power: (12−5)×0.8 = 5.6W. SOT-223 θJA = 22°C/W. Junction temp: 25 + (5.6×22) = 148°C.',
    scenario:`SYSTEM MEASUREMENTS:\n  VIN: 12V    VOUT: 5V    ILOAD: 800mA\n  Package: SOT-223 (no heatsink)\n  Ambient: 25°C\n  Time to shutdown: ~30 seconds\n  Recovery: full after 3 min cooling\n\n  Datasheet: TJ_max = 125°C, θJA = 22°C/W`,
    choices:[
      { text:'Excessive power dissipation — (12−5)×0.8 = 5.6W in SOT-223 exceeds TJ_max', correct:true,  explain:'Correct. P = 5.6W. θJA=22°C/W → TJ = 25+5.6×22 = 148°C > 125°C max. Fix: heatsink, pre-regulate VIN, or switch to a buck regulator (95%+ efficient vs LDO\'s 42%).' },
      { text:'Faulty output capacitor causing LDO oscillation and heating', correct:false, explain:'LDO oscillation causes output instability but not 30-second-to-failure thermal shutdown with clean recovery.' },
      { text:'Undervoltage lockout — 12V supply drooping under load', correct:false, explain:'UVLO triggers below ~3.5V on a 12V supply. You\'d need to drop 8V+ at 800mA — very unlikely.' },
      { text:'Reverse leakage — output cap discharging back through the regulator', correct:false, explain:'Reverse leakage is a startup/shutdown issue. It doesn\'t cause thermal runaway during steady-state operation.' },
    ],
    learn:'LDO regulators burn excess voltage as heat: P = (VIN−VOUT)×ILOAD. At 5.6W, the SOT-223 heats the junction to 148°C above 125°C max. Switch to a buck regulator for high input-output differentials.',
  },
  {
    id:'diag_ground', title:'DIAGNOSE: ANALOG READINGS NOISY', type:'diagnosis',
    client:'Tokyo Proto Lab', rewardBase:390,
    problem:'ADC readings show 50Hz noise pickup despite hardware filtering. The noise disappears when you touch the metal enclosure. Diagnose the problem.',
    scopeHint:'ADC FFT: dominant spike at exactly 50Hz. Amplitude: 180mV p-p. Disappears when hand touches chassis. Sensor cable: 2m unshielded.',
    scenario:`ADC NOISE ANALYSIS:\n  Frequency:   50Hz (exactly mains)\n  Amplitude:   180mV p-p\n  Behavior:    disappears when hand touches chassis\n  Cable type:  2m unshielded twisted pair\n  Grounding:   PCB GND → single wire → chassis\n  Power:       lab bench supply (properly grounded)`,
    choices:[
      { text:'Floating chassis / ground loop — chassis has no defined earth reference, acting as a 50Hz antenna', correct:true,  explain:'Correct. Touching the chassis provides your body as a path to earth. The chassis is capacitively coupled to mains with no defined ground reference. Fix: single-point earth the chassis.' },
      { text:'MCU switching noise — digital clock harmonics coupling into analog input', correct:false, explain:'MCU switching noise appears at MHz multiples of clock frequency, not exactly 50Hz. The 50Hz signature is the giveaway — it\'s mains frequency.' },
      { text:'ADC reference instability — VREF rail has 50Hz ripple from power supply', correct:false, explain:'This would cause correlated noise on all ADC channels. A properly filtered bench supply has <1mV ripple on VREF.' },
      { text:'DMA timing glitch — firmware creates periodic sampling errors at 50Hz', correct:false, explain:'A DMA timing issue creates glitches at the DMA frequency, not specifically 50Hz. Also "disappears when touching" is a physical phenomenon — no firmware change could cause that.' },
    ],
    learn:'Ground loops and floating shields are among the most common noise sources in analog electronics. Mains frequency (50/60Hz) couples into circuits through capacitive coupling from power wiring. The "hand touch" test is a classic field diagnostic: if touching the enclosure changes the noise, your shield is floating.',
  },
  {
    id:'diag_spi_mode', title:'DIAGNOSE: SPI DATA READS ALL 0xFF', type:'diagnosis',
    client:'Austin Chip District', rewardBase:470,
    problem:'SPI sensor returns 0xFF on every read. Scope shows MOSI transmitting correctly, SCK is clean, CS toggles properly. MISO line shows data but it\'s being sampled at the wrong moment.',
    scopeHint:'MISO waveform valid — data transitions appear. SCK: 4MHz. Data stable period: 30ns after falling SCK edge. MCU sampling on rising SCK edge — samples during transition, not stable window. Sensor\'s SPI mode is CPOL=1, CPHA=1 (Mode 3).',
    scenario:`SPI CAPTURE — SENSOR READ:\n  SCK frequency:  4MHz\n  CS: toggles correctly before/after read\n  MOSI: transmit command correct (0x80)\n  MISO: waveform present, transitions visible\n  MCU SPI config: Mode 0 (CPOL=0, CPHA=0)\n  Sensor datasheet: "SPI Mode 3 (CPOL=1, CPHA=1)"\n  Return value: always 0xFF regardless of input`,
    choices:[
      { text:'SPI clock polarity/phase mismatch — MCU in Mode 0, sensor expects Mode 3; sampling in noise window', correct:true,  explain:'Correct. Mode 0 samples MISO on the rising SCK edge; Mode 3 drives MISO on the rising edge and expects sampling on the falling edge. The MCU samples mid-transition, reading indeterminate data that settles to the bus pull-up (0xFF). Fix: set MCU SPI to CPOL=1, CPHA=1.' },
      { text:'MISO line too long — signal reflection from 50Ω impedance mismatch causing data corruption', correct:false, explain:'Reflections cause bit errors scattered across the byte, not a consistent 0xFF. Also the symptom is mode-related (wrong edge sampling), not length-related.' },
      { text:'CS held too short — peripheral deselects before completing data transfer', correct:false, explain:'A short CS pulse would corrupt the last bits — you\'d see some correct bits and some garbage. The consistent 0xFF across all reads points to a sampling-edge issue, not a timing window issue.' },
      { text:'MISO floating — no pull-up, line defaults to VCC when sensor not driving', correct:false, explain:'A floating MISO would be random, not a constant 0xFF. Also the scope shows valid MISO transitions — the data is there, just being sampled at the wrong clock edge.' },
    ],
    learn:'SPI has four clock modes defined by CPOL (clock polarity at idle) and CPHA (which edge data is sampled on). CPOL=0,CPHA=0 (Mode 0) samples on rising edge; CPOL=1,CPHA=1 (Mode 3) samples on falling edge. Mismatched modes cause the MCU to sample exactly when the line is transitioning — metastability results. Always check the sensor\'s datasheet for its SPI mode before initializing.',
  },
  // ── Op4: 3-slot circuit repair ────────────────────────────────
  {
    id:'ldo_bringup', title:'FIX: POWER RAIL SEQUENCE FOR FIRST SILICON', opMin:4,
    client:'TSMC Bringup Lab', rewardBase:950,
    problem:'New chip bringup: power rail won\'t sequence correctly. LDO core rail needs input bulk cap, output bypass cap, and a gate pull-down for the enable FET. All three components missing.',
    scopeHint:'CORE_VDD: oscillates 120mV at startup (no output bypass). ENABLE pin floats HIGH without gate pull-down — LDO enables immediately, before input bulk cap charges. VIN: sags 800mV (no bulk cap). Fix: 100µF input bulk + 100nF output bypass + 10kΩ gate pull-down.',
    schematic:`  VIN ──[SLOT A]──┬──── LDO_VIN\n                  │\n                 GND\n\n  LDO_VOUT ──[SLOT B]──── CORE_VDD\n                │\n               GND\n\n  ENABLE ──[SLOT C]──── GND\n     │         (gate pull-down)\n  [FET gate]`,
    slots:[
      { id:'sA', label:'SLOT A — Input bulk cap (VIN rail, prevents sag)', accepts:'cap_100uf' },
      { id:'sB', label:'SLOT B — Output bypass (CORE_VDD, kills oscillation)', accepts:'cap_100nf' },
      { id:'sC', label:'SLOT C — Enable gate pull-down (FET off at power-on)', accepts:'res_10k' },
    ],
    components:[
      { id:'cap_100uf', type:'cap_100uf', label:'◎ CAP 100µF',    hint:'Bulk storage — handles input sag' },
      { id:'cap_100nf', type:'cap_100nf', label:'◎ CAP 100nF',    hint:'Output bypass — kills LDO oscillation' },
      { id:'res_10k',   type:'res_10k',   label:'⧖ RES 10kΩ',    hint:'Gate pull-down — holds enable LOW at startup' },
      { id:'diode',     type:'diode',     label:'◁ DIODE 1N4148', hint:'Reverse protection — wrong here' },
      { id:'led',       type:'led',       label:'★ LED RED',       hint:'Indicator — wrong for power bringup' },
    ],
    learn:'Power rail sequencing is critical on first silicon. The LDO needs: (1) input bulk cap to prevent VIN sag during inrush, (2) output bypass cap to prevent LDO oscillation on light loads, (3) enable pull-down to hold the chip in reset until VIN is stable. Miss any one of these and your first silicon boot will fail.',
  },
  // ── Op4: FPGA Arena ───────────────────────────────────────────
  {
    id:'fpga_arena_v1', title:'FPGA ARENA — PROGRAM THE BOT', type:'arena', opMin:4,
    client:'Singapore Arena Server', rewardBase:1100,
    problem:'You\'ve rented time on the Singapore Arena Server. Program your bot\'s 3-state FSM to defeat the opponent. The opponent bot runs: ATTACK → BOOST → ATTACK. Select the optimal state sequence.',
    scopeHint:'Opponent FSM: [ATTACK, BOOST, ATTACK]. DEFEND blocks full damage from ATTACK. BOOST amplifies next attack. Optimal counter: absorb boosted attack with DEFEND, then end with boosted ATTACK.',
    schematic:`  YOUR BOT FSM:\n  State 0 → State 1 → State 2 → (loop)\n\n  OPPONENT FSM:\n  [ATTACK] → [BOOST] → [ATTACK]\n\n  Battle resolution per round:\n    ATTACK vs ATTACK  → both take 2 dmg\n    ATTACK vs DEFEND  → defender absorbs all\n    BOOST             → next state deals +2\n    WAIT              → skip, regen 1 energy\n\n  Win condition: bot HP ≤ 0 by end of state 2`,
    slots:[
      { id:'s0', label:'STATE 0 — First move (vs opponent ATTACK)', accepts:'fsm_defend' },
      { id:'s1', label:'STATE 1 — Second move (vs opponent BOOST)', accepts:'fsm_boost' },
      { id:'s2', label:'STATE 2 — Final move (vs opponent ATTACK, you boosted)', accepts:'fsm_attack' },
    ],
    components:[
      { id:'atk', type:'fsm_attack', label:'⚡ FSM: ATTACK',  hint:'Deal 2 damage (4 if boosted)' },
      { id:'def', type:'fsm_defend', label:'🛡 FSM: DEFEND',  hint:'Block all incoming damage this state' },
      { id:'bst', type:'fsm_boost',  label:'▲ FSM: BOOST',   hint:'Next state deals +2 extra damage' },
      { id:'wai', type:'fsm_wait',   label:'⏸ FSM: WAIT',    hint:'Skip attack, regen 1 energy' },
    ],
    learn:'Finite State Machines are the foundation of digital logic. Every state has a defined action and a transition to the next state. The key insight: a good FSM designer reads the opponent\'s sequence first, then constructs a counter-sequence. DEFEND→BOOST→ATTACK absorbs the opening ATTACK, amplifies your final strike past the bot\'s 10 HP.',
  },
  // ── Op4: Silicon Foundry Sim ──────────────────────────────────
  {
    id:'foundry_sim_v1', title:'SILICON FOUNDRY SIM — OPTIMIZE WAFER RUN', type:'foundry', opMin:4,
    client:'IHP Shuttle Consortium', rewardBase:1200,
    problem:'Manage a 100mm wafer run for the IHP SG13G2 shuttle. Tune three process parameters to maximize gross margin. Target: > 60% margin on the run.',
    schematic:`  100mm WAFER — SG13G2 130nm BiCMOS\n  ┌─────────────────────────────┐\n  │  ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○   │\n  │  ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○   │\n  │  ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○   │\n  │  ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○   │\n  │  ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○   │\n  └─────────────────────────────┘\n  Target margin: > 60%\n  Tune: litho quality, test coverage, throughput`,
    targetMargin: 0.60,
    learn:'Semiconductor economics are brutal. Yield (good die / total die) determines your cost per die. Higher litho quality improves yield but slows throughput. More test coverage catches defects before shipping but adds cost. Optimizing all three simultaneously is the core challenge of fab economics — and why TSMC\'s process engineers are some of the highest-paid in tech.',
  },
  {
    id:'diag_gpio_ringing', title:'DIAGNOSE: GPIO EDGE CAUSING SYSTEM RESETS', type:'diagnosis',
    client:'Shenzhen Proto House', rewardBase:490,
    problem:'A GPIO toggling at 10MHz is causing intermittent system resets elsewhere on the board. The scope shows a clean GPIO signal but the RESET line occasionally dips below threshold.',
    scopeHint:'GPIO trace: 15cm, no series resistor. Rise time: 2ns (strong CMOS drive). RESET line: normally 3.3V, dips to 1.8V (below 2.0V threshold) for 5ns during GPIO transitions. Coupling: ~3pF capacitive between parallel traces. With 33Ω series resistor on GPIO: rise time 8ns, RESET coupling <0.3V.',
    scenario:`SIGNAL MEASUREMENTS:\n  GPIO: 10MHz square wave, 3.3V swing, 2ns rise time\n  GPIO trace length: 15cm, no series termination\n  RESET line: parallel to GPIO trace for 8cm\n  RESET dip: −1.5V from 3.3V during GPIO edge\n  Reset threshold: 2.0V (MCP809 supervisor)\n  Coupling capacitance: ~3pF between traces`,
    choices:[
      { text:'Capacitive crosstalk from fast GPIO edge coupling into parallel RESET trace — fix with series resistor to slow rise time', correct:true,  explain:'Correct. A 2ns rise time on a 15cm trace is fast enough to couple into adjacent traces through parasitic capacitance. The coupled voltage = C × (dV/dt). Adding a 33Ω series resistor on GPIO slows dV/dt from 1.6V/ns to 0.4V/ns — coupling drops below reset threshold.' },
      { text:'Power supply rail noise — GPIO switching current causes VCC to dip, starving the supervisor', correct:false, explain:'A VCC dip would affect all VCC-dependent circuits simultaneously and show as a global VCC droop. The scope shows RESET-specific coupling during GPIO transitions, not a board-wide power issue.' },
      { text:'Reset supervisor oscillating — MCP809 threshold near 3.3V rail, thermal drift triggering false resets', correct:false, explain:'Supervisor oscillation would produce periodic resets unrelated to GPIO activity. The symptom is correlated with GPIO edges — a temporal relationship that points to coupling, not supervisor drift.' },
      { text:'Firmware bug — GPIO ISR inadvertently writing to RESET register in software', correct:false, explain:'A software reset would assert a controlled reset sequence. The scope shows a sub-threshold analog dip on the RESET pin, not a clean digital reset pulse. This is a hardware signal integrity issue.' },
    ],
    learn:'Crosstalk is capacitive or inductive coupling between adjacent traces. Capacitive crosstalk is proportional to dV/dt and coupling capacitance. Fast CMOS edges (2ns rise time) on unterminated traces generate enormous dV/dt — enough to disturb parallel signals. Three fixes: add series resistor to slow the edge, increase spacing between traces, or route RESET away from high-speed signals.',
  },
];

// ================================================================
//  EVENTS
// ================================================================
const EVENTS = [
  {
    id:'customs_seizure', title:'CUSTOMS SEIZED YOUR SHIPMENT', type:'bad', weight:13,
    learn:'Export controls on electronics are serious. The US and EU regulate which chips ship where — especially FPGAs with military applications. Companies and individuals have faced criminal charges and multi-million-dollar fines for violations.',
    fire(state) {
      const items = Object.entries(state.inventory).filter(([,v])=>v>0);
      if (!items.length) return null;
      const [itemId,qty] = items[Math.floor(Math.random()*items.length)];
      const seized = Math.max(1,Math.floor(qty*(0.3+Math.random()*0.2)));
      return {
        message:`CBP flagged your ${ITEMS[itemId].name} shipment. ${seized} unit${seized>1?'s':''} seized pending "inspection." They're not coming back.`,
        effectText:`Lost ${seized}× ${ITEMS[itemId].name}`,
        positive:false,
        apply(s){ s.inventory[itemId]-=seized; reduceMeta(s,itemId,seized); },
      };
    },
  },
  {
    id:'esd_event', title:'ESD EVENT — BOARD FRIED', type:'bad', weight:9,
    learn:'ESD (Electrostatic Discharge) destroys semiconductors invisibly. The static from walking on carpet is 10,000+ volts — enough to vaporize microscopic transistor gates.',
    fire(state) {
      const boards = ['artix7','tangnano','bga'].filter(k=>state.inventory[k]>0);
      if (!boards.length) return null;
      const itemId = boards[Math.floor(Math.random()*boards.length)];
      return {
        message:`You reached for a board without grounding yourself. A 15kV discharge arced through the I/O pins. One ${ITEMS[itemId].name} is now very expensive e-waste. Classic.`,
        effectText:`Lost 1× ${ITEMS[itemId].name} to static discharge`,
        positive:false,
        apply(s){ s.inventory[itemId]=Math.max(0,s.inventory[itemId]-1); reduceMeta(s,itemId,1); },
      };
    },
  },
  {
    id:'mlcc_shortage', title:'SUBSTRATE SHORTAGE — MLCC SPIKE', type:'bad', weight:11,
    learn:'MLCC shortages cascade from a handful of substrate suppliers. The 2020–2022 chip shortage started exactly like this. Factory disruptions → component scarcity → prices 100× normal. It cost the auto industry $210 billion.',
    fire() {
      return {
        message:'Major MLCC substrate supplier down 14 weeks. Spot prices climbing. If you\'re holding stock, now is the time to be a seller.',
        effectText:'MLCC price ×2.5 for 3 days', positive:false,
        apply(s){ s.marketMod.mlcc=(s.marketMod.mlcc||1)*2.5; s.marketModExp.mlcc=s.day+3; },
      };
    },
  },
  {
    id:'client_paid', title:'CLIENT PAID EARLY', type:'good', weight:10,
    learn:'Net-30 means clients pay 30 days after invoice. In hardware, waiting 60–90 days is common. Cash-flow problems from slow payment kill more hardware startups than bad products do.',
    fire() {
      const bonus = 150+Math.floor(Math.random()*400);
      return {
        message:`Net-30 invoice paid on day 3. Either they're flush with Series A cash or AP made a mistake. Either way, it's in your account.`,
        effectText:`+₿${bonus} early payment received`, positive:true,
        apply(s){ s.cash+=bonus; },
      };
    },
  },
  {
    id:'tariff_hike', title:'TARIFF HIKE — SHENZHEN +25%', type:'bad', weight:11, cityOnly:'shenzhen',
    learn:'Section 301 tariffs are US trade penalties on imports. The US–China trade war put 7.5–25% tariffs on billions in electronics. Companies shifted supply chains to Vietnam and Mexico.',
    fire() {
      return {
        message:'Commerce Dept: new Section 301 tariffs, effective immediately. 25% additional duty on Shenzhen components.',
        effectText:'Shenzhen prices +25% for 4 days', positive:false,
        apply(s){ s.cityMod.shenzhen=(s.cityMod.shenzhen||1)*1.25; s.cityModExp.shenzhen=s.day+4; },
      };
    },
  },
  {
    id:'language_barrier', title:'LANGUAGE BARRIER — OVERPAID', type:'bad', weight:10, cityOnly:'tokyo',
    learn:'Akihabara vendors price-discriminate against tourists. Prices in Japanese are often 15–30% lower than the English quote.',
    fire(state) {
      const tax = Math.floor(state.cash*0.12);
      if (tax<10) return null;
      return {
        message:'You navigated the Akihabara negotiation mostly by nodding. Pretty sure you agreed to a 12% gaijin premium.',
        effectText:`−₿${tax} language barrier surcharge`, positive:false,
        apply(s){ s.cash=Math.max(0,s.cash-tax); },
      };
    },
  },
  {
    id:'fpga_price_drop', title:'YIELD BREAKTHROUGH — FPGA PRICES DROP', type:'good', weight:7,
    learn:'A yield improvement from 75% to 90% cuts cost-per-chip by ~17% overnight. Fabs invest billions in process control to push yield up.',
    fire() {
      return {
        message:'TSMC announced a yield breakthrough on 28nm. FPGA cost per die dropping. Good time to buy boards before retailers reprice.',
        effectText:'Artix-7 and Tang Nano −35% for 3 days', positive:true,
        apply(s){
          s.marketMod.artix7  =(s.marketMod.artix7  ||1)*0.65; s.marketModExp.artix7  =s.day+3;
          s.marketMod.tangnano=(s.marketMod.tangnano||1)*0.65; s.marketModExp.tangnano=s.day+3;
        },
      };
    },
  },
  {
    id:'scope_offer', title:'OLD SCOPE FOR SALE', type:'offer', weight:7,
    learn:'An oscilloscope measures voltage over time — the fundamental debugging tool. The Tektronix TDS2012B is a 2-channel, 100MHz scope. Still perfectly capable.',
    fire(state) {
      if (state.hasScope) return null;
      const cost = 180+Math.floor(Math.random()*60);
      return {
        message:`An engineer clearing their lab has a Tektronix TDS2012B for sale. "Works fine, just upgrading." ₿${cost}. Battered but functional.`,
        effectText:`Buy USB oscilloscope for ₿${cost}?`,
        positive:true, offerEquipId:'usb_scope', offerCost:cost,
        apply(){},
      };
    },
  },
  {
    id:'itar_violation', title:'ITAR VIOLATION WARNING', type:'bad', weight:14, cityOnly:'pentagon',
    learn:'ITAR (International Traffic in Arms Regulations) controls export of defense technology. Violations carry criminal penalties: up to $1M per violation and 20 years in prison.',
    fire(state) {
      const controlled = ['milspec_ic','tapeout'].filter(k=>state.inventory[k]>0);
      if (!controlled.length) {
        const fine = 400+Math.floor(Math.random()*800);
        return {
          message:`DCSA inspector flagged your import documentation. ₿${fine} compliance assessment.`,
          effectText:`ITAR compliance fine: −₿${fine}`, positive:false,
          apply(s){ s.cash=Math.max(0,s.cash-fine); },
        };
      }
      const itemId = controlled[Math.floor(Math.random()*controlled.length)];
      const seized = Math.max(1,Math.floor(state.inventory[itemId]*0.5));
      return {
        message:`DCSA flagged your ${ITEMS[itemId].name} transfer. ${seized} unit${seized>1?'s':''} held pending review.`,
        effectText:`Lost ${seized}× ${ITEMS[itemId].name} to ITAR hold`, positive:false,
        apply(s){ s.inventory[itemId]-=seized; reduceMeta(s,itemId,seized); },
      };
    },
  },
  {
    id:'dod_contract', title:'DOD PRIORITY CONTRACT', type:'good', weight:9, cityOnly:'pentagon',
    learn:'Defense contracts pay 3–5× market rate but require extensive paperwork and full component traceability.',
    fire() {
      const bonus = 1000+Math.floor(Math.random()*1500);
      return {
        message:`Program manager approved emergency procurement. Payment: ₿${bonus} on delivery confirmation.`,
        effectText:`+₿${bonus} DoD emergency payment`, positive:true,
        apply(s){ s.cash+=bonus; s.reputation+=25; },
      };
    },
  },
  {
    id:'tapeout_windfall', title:'TAPEOUT SLOT VALUED UP', type:'good', weight:6, cityOnly:'pentagon',
    learn:'When new nodes are oversubscribed, existing shuttle slots on older nodes spike in secondary value.',
    fire(state) {
      if (!state.inventory.tapeout) return null;
      return {
        message:'TSMC 180nm shuttle oversubscribed. Secondary market for existing slots spiked.',
        effectText:'Tapeout Slot price ×2.8 for 4 days', positive:true,
        apply(s){ s.marketMod.tapeout=(s.marketMod.tapeout||1)*2.8; s.marketModExp.tapeout=s.day+4; },
      };
    },
  },
  {
    id:'wafer_contamination', title:'WAFER LOT — CONTAMINATION EVENT', type:'bad', weight:10, opMin:3,
    learn:'Wafer yield: a single particle of contamination during photolithography can destroy an entire layer. Contamination events affecting a full lot wipe out millions in value overnight.',
    fire(state) {
      if (!state.inventory.wafer_lot) return null;
      const lost = Math.max(1,Math.floor(state.inventory.wafer_lot*0.6));
      return {
        message:`Fab QC detected particle contamination. ${lost} wafer lot${lost>1?'s':''} written off. Fab takes no liability.`,
        effectText:`Lost ${lost}× Wafer Lot to contamination`, positive:false,
        apply(s){ s.inventory.wafer_lot=Math.max(0,s.inventory.wafer_lot-lost); reduceMeta(s,'wafer_lot',lost); },
      };
    },
  },
  {
    id:'asic_acquisition', title:'IP ACQUISITION OFFER', type:'good', weight:7, opMin:3,
    learn:'Fabless semiconductor startups are frequently acquired for their IP portfolio. The "acqui-hire" model: buy the team and the IP, fold both into the acquirer\'s roadmap.',
    fire(state) {
      if (!state.inventory.custom_asic) return null;
      const bonus = 2000+Math.floor(Math.random()*4000);
      return {
        message:`Corporate M&A team evaluated your ASIC design. IP acquisition offer: ₿${bonus}. Cash offer, closes in 24 hours.`,
        effectText:`+₿${bonus} IP acquisition payment`, positive:true,
        apply(s){ s.cash+=bonus; s.reputation+=30; },
      };
    },
  },
  {
    id:'node_scarcity', title:'180nm CAPACITY FULLY BOOKED', type:'bad', weight:8, opMin:3,
    learn:'Legacy nodes (180nm, 130nm) are in high demand. Nobody is building new 180nm fabs — capacity is fixed. When automotive demand spikes, everyone else gets squeezed out.',
    fire() {
      return {
        message:'Automotive OEM block-booked all remaining 180nm capacity through Q3. ASIC and tapeout prices spiking.',
        effectText:'ASIC and Tapeout prices ×2.2 for 5 days', positive:false,
        apply(s){
          s.marketMod.custom_asic=(s.marketMod.custom_asic||1)*2.2; s.marketModExp.custom_asic=s.day+5;
          s.marketMod.tapeout   =(s.marketMod.tapeout   ||1)*2.2; s.marketModExp.tapeout   =s.day+5;
        },
      };
    },
  },
  // ── Op4 Events ──────────────────────────────────────────────────
  {
    id:'tapeout_missed', title:'TAPEOUT DEADLINE MISSED — SLOT FORFEITED', type:'bad', weight:10, opMin:4,
    learn:'Tapeout slots at major fabs are booked 6–18 months in advance. Missing the GDS-II submission deadline by even one day forfeits your reservation. The slot is immediately resold to the next team on the waitlist. You lose the deposit and your months of design work goes back to the queue.',
    fire(state) {
      if (!state.inventory.tapeout) return null;
      const lost = 1;
      const deposit = Math.floor((ITEMS.tapeout.minPrice + ITEMS.tapeout.maxPrice)/2 * 0.3);
      return {
        message:`Your design didn't make the GDS-II submission cutoff — ${lost} tapeout slot forfeited. The fab resold it in 4 hours. You also lose your ₿${fmt(deposit)} deposit.`,
        effectText:`Lost 1× Tapeout Slot + ₿${fmt(deposit)} deposit`, positive:false,
        apply(s){ s.inventory.tapeout=Math.max(0,s.inventory.tapeout-lost); reduceMeta(s,'tapeout',lost); s.cash=Math.max(0,s.cash-deposit); },
      };
    },
  },
  {
    id:'shuttle_partner_drops', title:'SHUTTLE PARTNER WITHDREW', type:'bad', weight:8, opMin:4,
    learn:'Multi-project wafer (MPW) shuttles share fabrication costs across many small designs. When a partner drops out — due to funding, acquisition, or NDA conflict — the cost per remaining team rises. In academic shuttles, one dropout can double everyone else\'s bill.',
    fire(state) {
      const hit = Math.floor(state.cash * 0.12);
      if (hit < 200) return null;
      return {
        message:`A shuttle partner withdrew their design three days before tape-in. Cost reallocation hits you for ₿${fmt(hit)}.`,
        effectText:`−₿${fmt(hit)} shuttle reallocation fee`, positive:false,
        apply(s){ s.cash=Math.max(0,s.cash-hit); },
      };
    },
  },
  {
    id:'process_node_canceled', title:'PROCESS NODE DISCONTINUED', type:'bad', weight:7, opMin:4,
    learn:'Fabs regularly sunset older process nodes to free up capacity for advanced nodes. When a node is discontinued, any IP designed for it becomes stranded — you must port to a new process (expensive) or find a remaining specialty fab (also expensive). GDS-II packages for canceled nodes lose most of their value overnight.',
    fire(state) {
      if (!state.inventory.gds_package) return null;
      const dropped = Math.floor((state.inventory.gds_package) * 0.5);
      if (!dropped) return null;
      return {
        message:'TSMC announced 180nm node end-of-life in 6 months. Your GDS-II packages lost half their resale value.',
        effectText:'GDS-II package value −50%', positive:false,
        apply(s){ s.marketMod.gds_package=(s.marketMod.gds_package||1)*0.5; s.marketModExp.gds_package=s.day+10; },
      };
    },
  },
  {
    id:'yield_surprise', title:'YIELD SURPRISE — BONUS DIE!', type:'good', weight:7, opMin:4,
    learn:'Semiconductor yields are probabilistic. Sometimes a process run comes out cleaner than expected — fewer defects, higher yields, more good die per wafer than projected. A "yield excursion upward" can mean 20–40% more sellable product than the model predicted.',
    fire(state) {
      if (!state.cash) return null;
      const bonus = Math.floor(2200 + Math.random() * 2800);
      return {
        message:`Wafer yield on the latest IHP run came in at 91% — 16 points above projection. Bonus die available for spot market resale. ₿${fmt(bonus)} windfall.`,
        effectText:`+₿${fmt(bonus)} yield bonus`, positive:true,
        apply(s){ s.cash+=bonus; s.totalEarned+=bonus; s.todayIncome+=bonus; },
      };
    },
  },
  {
    id:'nda_leak', title:'NDA LEAK — DESIGN EXPOSED', type:'bad', weight:6, opMin:4,
    learn:'NDAs in the semiconductor industry protect everything from process parameters to circuit schematics. A leak can expose your design to competitors months before your product ships. The damage isn\'t just legal — it destroys the first-mover advantage you spent years building.',
    fire(state) {
      const repLoss = 25 + Math.floor(Math.random() * 20);
      const cashLoss = Math.floor(state.cash * 0.08);
      return {
        message:`A junior engineer emailed your SPICE netlist to the wrong address. Competitor has your analog front-end. Reputation damage, legal fees incoming.`,
        effectText:`−${repLoss} REP, −₿${fmt(cashLoss)} legal fees`, positive:false,
        apply(s){ s.reputation=Math.max(0,s.reputation-repLoss); s.cash=Math.max(0,s.cash-cashLoss); },
      };
    },
  },
];

// ================================================================
//  STATE
// ================================================================
let G = {};
let tradeCtx = null;
let pendingEvent = null;
let infoExpanded = {};
let activePuzzle = null;
let activeReward = 0;
let puzzleFills = {};
let puzzleSelected = null;
let puzzleChecked = false;
let activeChoice = null;

const OP_CONFIG = {
  1: { cash:3000,  debt:2000,  debtRate:100,  days:20, eventChance:0.55, goalDesc:'Pay off debt and achieve positive net worth.',       goalCheck:(nw)=>nw>0 },
  2: { cash:5000,  debt:4000,  debtRate:150,  days:30, eventChance:0.65, goalDesc:'Reach ₿15,000 net worth in 30 days.',               goalCheck:(nw)=>nw>=15000 },
  3: { cash:12000, debt:10000, debtRate:400,  days:40, eventChance:0.70, goalDesc:'Reach ₿50,000 net worth in 40 days.',               goalCheck:(nw)=>nw>=50000 },
  4: { cash:30000, debt:25000, debtRate:1000, days:35, eventChance:0.75, goalDesc:'Reach ₿150,000 net worth in 35 days.',              goalCheck:(nw)=>nw>=150000 },
};

const OP_LABEL = { 1:'OP1 — TRADE', 2:'OP2 — CLASSIFIED', 3:'OP3 — ASIC STARTUP', 4:'OP4 — TAPEOUT & BRINGUP' };

function initGame(operation=1) {
  const cfg = OP_CONFIG[operation];
  G = {
    operation, day:1, maxDays:cfg.days,
    cash:cfg.cash, debt:cfg.debt, debtRate:cfg.debtRate,
    city:'shenzhen',
    inventory:Object.fromEntries(Object.keys(ITEMS).map(k=>[k,0])),
    inventoryMeta:{},
    prices:{}, prevPrices:{},
    marketMod:{}, marketModExp:{},
    cityMod:{}, cityModExp:{},
    reputation:0, carryMultiplier:1,
    hasScope:false, reworkStation:false, ownedEquipment:[],
    availableJobs:[], lastJobId:null,
    totalEarned:0, todayIncome:0, jobsDoneToday:0,
    travelPrices:{},
    log:[], concepts:{},
    flightsToday:0,
    gameOver:false,
  };
  infoExpanded={};
  pendingEvent=null; tradeCtx=null;
  activePuzzle=null; puzzleFills={}; puzzleSelected=null; puzzleChecked=false; activeChoice=null;

  genPrices();
  refreshJobs();

  if (operation===1) {
    addLog(`₿${fmt(cfg.cash)} starting capital. ₿${fmt(cfg.debt)} debt at ₿${cfg.debtRate}/day. ${cfg.days} days.`,'info');
    addLog('Shenzhen cheapest. Austin safest. Toronto/Tokyo premium. Repair jobs always available.','dim');
  } else if (operation===2) {
    addLog(`OPERATION 2. ₿${fmt(cfg.cash)} capital. ₿${fmt(cfg.debt)} debt at ₿${cfg.debtRate}/day. ${cfg.days} days.`,'info');
    addLog('Pentagon access unlocked. Mil-Spec ICs and Tapeout Slots available. ITAR exposure active.','warn');
    addLog('Goal: reach ₿15,000 net worth by day 30.','info');
  } else if (operation===3) {
    addLog(`OPERATION 3 — ASIC STARTUP. ₿${fmt(cfg.cash)} capital. ₿${fmt(cfg.debt)} at ₿${cfg.debtRate}/day.`,'info');
    addLog('Singapore fab access unlocked. Custom ASIC Dies and Wafer Lots available.','warn');
    addLog('Goal: reach ₿50,000 net worth by day 40.','info');
  } else {
    addLog(`OPERATION 4 — TAPEOUT & BRINGUP. ₿${fmt(cfg.cash)} capital. ₿${fmt(cfg.debt)} at ₿${cfg.debtRate}/day.`,'info');
    addLog('TSMC HQ and IHP Shuttle Hub unlocked. GDS-II packages, test fixtures, bringup boards available.','warn');
    addLog('FPGA Arena and Silicon Foundry Sim mini-games now active. Goal: reach ₿150,000 by day 35.','info');
  }
  render();
}

// ================================================================
//  PRICES
// ================================================================
function visibleItems()  { return Object.entries(ITEMS).filter(([,i])=>!i.opMin||i.opMin<=G.operation); }
function visibleCities() { return Object.entries(CITIES).filter(([,c])=>!c.opMin||c.opMin<=G.operation); }

function genTravelPrices() {
  G.travelPrices = {};
  for (const [fromId] of visibleCities()) {
    G.travelPrices[fromId] = {};
    for (const [toId] of visibleCities()) {
      if (fromId===toId) continue;
      const base = (ROUTE_BASE[fromId]?.[toId]) ?? 50;
      G.travelPrices[fromId][toId] = {
        bus:   Math.max(10, Math.round(base * (0.8 + Math.random()*0.4))),
        plane: Math.max(30, Math.round(base * 3.2 * (0.7 + Math.random()*0.6))),
      };
    }
  }
}

function genPrices() {
  G.prevPrices={};
  for (const id in G.prices) G.prevPrices[id]={...G.prices[id]};
  G.prices={};
  for (const [itemId] of visibleItems()) {
    G.prices[itemId]={};
    for (const [cityId] of visibleCities()) G.prices[itemId][cityId]=computePrice(itemId,cityId);
  }
  genTravelPrices();
}

function computePrice(itemId,cityId) {
  const item=ITEMS[itemId]; const city=CITIES[cityId];
  let p=item.minPrice+Math.random()*(item.maxPrice-item.minPrice);
  p*=city.priceMultiplier;
  p*=1-city.variance/2+Math.random()*city.variance;
  if (city.specialBias?.[itemId]) p*=0.7+0.45*city.specialBias[itemId];
  if (G.marketMod[itemId]) p*=G.marketMod[itemId];
  if (G.cityMod[cityId])   p*=G.cityMod[cityId];
  if (itemId==='bga'&&G.reworkStation) p*=1.25;
  return Math.max(1,Math.round(p));
}

function curPrice(itemId) { return (G.prices[itemId]||{})[G.city]||0; }
function maxCarryFor(itemId) {
  let cap=Math.floor(ITEMS[itemId].maxCarry*G.carryMultiplier);
  if (itemId==='bga'&&G.reworkStation) cap+=10;
  return cap;
}
function invValue() { return Object.entries(G.inventory).reduce((s,[id,qty])=>s+qty*(curPrice(id)||0),0); }
function netWorth() { return G.cash+invValue()-G.debt; }

// ================================================================
//  BUY / SELL
// ================================================================
function updateMeta(itemId,qty,price) {
  if (!G.inventoryMeta[itemId]) G.inventoryMeta[itemId]={pricePaid:0,qty:0};
  const m=G.inventoryMeta[itemId];
  m.pricePaid=m.qty>0?(m.pricePaid*m.qty+price*qty)/(m.qty+qty):price;
  m.qty+=qty;
}
function reduceMeta(state,itemId,qty) {
  const m=state.inventoryMeta[itemId];
  if (!m) return;
  m.qty=Math.max(0,m.qty-qty);
  if (m.qty===0) m.pricePaid=0;
}

function doBuy(itemId,qty) {
  const p=curPrice(itemId); const cost=p*qty;
  const item=ITEMS[itemId]; const have=G.inventory[itemId]; const cap=maxCarryFor(itemId);
  if (cost>G.cash)  { addLog(`Need ₿${fmt(cost)}, have ₿${fmt(G.cash)}.`,'danger'); return false; }
  if (have+qty>cap) { addLog(`Carry limit: ${cap} ${item.unit}s for ${item.name}.`,'danger'); return false; }
  G.cash-=cost;
  G.inventory[itemId]+=qty;
  updateMeta(itemId,qty,p);
  G.concepts[itemId]=ITEMS[itemId];
  if (CITIES[G.city].counterfeits&&Math.random()<CITIES[G.city].counterfeits) {
    addLog(`Bought ${qty}× ${item.name} @ ₿${fmt(p)} ea. ⚠ Counterfeit risk.`,'warn');
  } else {
    addLog(`Bought ${qty}× ${item.name} @ ₿${fmt(p)} ea. Paid ₿${fmt(cost)}.`,'success');
  }
  if (CITIES[G.city].repBonus) G.reputation+=Math.floor(qty*0.3);
  render(); return true;
}

function doSell(itemId,qty) {
  const p=curPrice(itemId); const revenue=p*qty; const item=ITEMS[itemId];
  if (G.inventory[itemId]<qty) { addLog(`Only ${G.inventory[itemId]}× ${item.name} in stock.`,'danger'); return false; }
  G.cash+=revenue;
  G.totalEarned+=revenue; G.todayIncome+=revenue;
  G.inventory[itemId]-=qty;
  reduceMeta(G,itemId,qty);
  if (CITIES[G.city].repBonus) G.reputation+=Math.floor(qty*0.5);
  addLog(`Sold ${qty}× ${item.name} @ ₿${fmt(p)} ea. Revenue: ₿${fmt(revenue)}.`,'success');
  render(); return true;
}

// ================================================================
//  TRAVEL
// ================================================================
function openTravelModal(cityId) {
  if (cityId===G.city||G.gameOver) return;
  const city = CITIES[cityId];
  const prices = G.travelPrices?.[G.city]?.[cityId] || { bus:0, plane:0 };
  const canBus   = G.cash >= prices.bus;
  const flightsLeft = 2 - (G.flightsToday || 0);
  const canPlane = G.cash >= prices.plane && flightsLeft > 0;
  const planeLabel = flightsLeft <= 0 ? 'LIMIT REACHED (2/day)' : (G.cash < prices.plane ? 'NEED ₿'+fmt(prices.plane) : 'BOOK FLIGHT');
  qs('#travel-dest-name').textContent = `→ ${city.name} (${city.code}) — ${city.desc}`;
  qs('#travel-options').innerHTML = `
    <div class="travel-option">
      <div class="travel-mode">🚌 BUS / GROUND FREIGHT</div>
      <div class="travel-detail dim">1 day travel · market prices change · events may fire</div>
      <button class="${canBus?'btn-primary':''}" ${canBus?'':'disabled'} onclick="doTravel('${cityId}','bus')">
        ${canBus?'BOOK BUS':'NEED ₿'+fmt(prices.bus)} — ₿${fmt(prices.bus)}
      </button>
    </div>
    <div class="travel-option" style="margin-top:12px">
      <div class="travel-mode">✈ PLANE / EXPRESS</div>
      <div class="travel-detail dim">No day used · prices refresh · no event risk · costs more · <span class="${flightsLeft<=0?'danger':'warn'}">${flightsLeft} flight${flightsLeft!==1?'s':''} left today</span></div>
      <button class="${canPlane?'btn-primary':''}" style="${canPlane?'border-color:var(--amber)!important;color:var(--amber)':''}" ${canPlane?'':'disabled'} onclick="doTravel('${cityId}','plane')">
        ${planeLabel} — ₿${fmt(prices.plane)}
      </button>
    </div>`;
  show('travel-modal');
}

function doTravel(cityId, mode) {
  if (cityId===G.city||G.gameOver) return;
  const prices = G.travelPrices?.[G.city]?.[cityId];
  const cost   = mode==='plane' ? prices?.plane : prices?.bus;
  if (!cost && cost !== 0) { addLog('No route available.','danger'); return; }
  if (G.cash < cost) { addLog(`Can't afford ₿${fmt(cost)} ${mode} ticket.`,'danger'); return; }
  if (mode==='plane' && (G.flightsToday||0) >= 2) {
    addLog('Flight limit reached — max 2 flights per day. Take the bus or end the day.','danger');
    hide('travel-modal'); return;
  }
  G.cash -= cost;
  const from = CITIES[G.city].name;
  G.city = cityId;
  hide('travel-modal');
  if (mode==='plane') {
    G.flightsToday = (G.flightsToday||0) + 1;
    addLog(`✈ Flew ${from} → ${CITIES[cityId].name}. Ticket ₿${fmt(cost)}. No day lost. (${G.flightsToday}/2 flights today)`,'info');
    genPrices(); render();
  } else {
    addLog(`🚌 Bus to ${CITIES[cityId].name}. Ticket ₿${fmt(cost)}. 1 day travel.`,'info');
    advanceDay();
  }
}

function endDay() { if (!G.gameOver) advanceDay(); }

function advanceDay() {
  G.day++;
  G.todayIncome=0;
  G.jobsDoneToday=0;
  G.flightsToday=0;

  if (G.debt>0) {
    if (G.cash>=G.debtRate) {
      G.cash-=G.debtRate;
      addLog(`Day ${G.day}: Interest −₿${G.debtRate}. Debt: ₿${fmt(G.debt)}.`,'warn');
    } else {
      G.debt+=G.debtRate;
      addLog(`Day ${G.day}: MISSED PAYMENT. Debt grew to ₿${fmt(G.debt)}.`,'danger');
    }
  }

  for (const k in G.marketModExp) { if (G.marketModExp[k]<=G.day){ delete G.marketMod[k]; delete G.marketModExp[k]; } }
  for (const k in G.cityModExp)   { if (G.cityModExp[k]  <=G.day){ delete G.cityMod[k];   delete G.cityModExp[k];   } }

  genPrices();
  refreshJobs();

  if (!G.gameOver&&Math.random()<OP_CONFIG[G.operation].eventChance){ fireEvent(); return; }
  checkOver(); render();
}

// ================================================================
//  JOBS BOARD
// ================================================================
function refreshJobs() {
  const usedIds = G.availableJobs.map(j=>j.puzzle.id);
  const pool = PUZZLES.filter(p=>!usedIds.includes(p.id)&&p.id!==G.lastJobId&&(!p.opMin||p.opMin<=G.operation));
  while (G.availableJobs.length<2&&pool.length) {
    const puzzle = pool.splice(Math.floor(Math.random()*pool.length),1)[0];
    const reward = G.hasScope ? Math.floor(puzzle.rewardBase*1.4) : puzzle.rewardBase;
    G.availableJobs.push({puzzle,reward});
  }
}
function startJob(idx) {
  const job=G.availableJobs[idx];
  if (!job) return;
  G.lastJobId = job.puzzle.id;
  G.availableJobs.splice(idx,1);
  openMiniGame(job.puzzle,job.reward);
}

// ================================================================
//  EVENTS
// ================================================================
function fireEvent() {
  const eligible = EVENTS.filter(ev=>{
    if (ev.cityOnly&&ev.cityOnly!==G.city) return false;
    if (ev.opMin&&ev.opMin>G.operation) return false;
    return true;
  });
  const total = eligible.reduce((s,e)=>s+e.weight,0);
  let r = Math.random()*total;
  let sel = eligible[eligible.length-1];
  for (const ev of eligible){ r-=ev.weight; if (r<=0){sel=ev;break;} }

  const cashBefore = G.cash;
  const result = sel.fire(G);
  if (!result){ checkOver(); render(); return; }

  result.apply(G);
  const cashGain = G.cash-cashBefore;
  if (cashGain>0){ G.totalEarned+=cashGain; G.todayIncome+=cashGain; }

  G.concepts[sel.id]=sel;
  addLog(`Day ${G.day}: ${sel.title}${result.offerEquipId?'':' — '+result.effectText}`,result.positive?(result.offerEquipId?'info':'success'):'danger');

  pendingEvent={ev:sel,result};
  renderEventModal();
}

function renderEventModal() {
  if (!pendingEvent) return;
  const {ev,result}=pendingEvent;
  qs('#event-header').textContent=result.positive?'✦ INCOMING SIGNAL — POSITIVE':'⚠ INCOMING SIGNAL — ALERT';
  qs('#event-header').className=`event-header ${result.positive?'success':'warn'}`;
  qs('#event-title').textContent=ev.title;
  qs('#event-msg').textContent=result.message;
  qs('#event-effect').textContent=result.effectText;
  qs('#event-effect').className=`event-effect ${result.positive?'positive':''}`;
  qs('#event-learn').textContent=ev.learn;
  qs('#event-learn').classList.add('hidden');
  const actEl=qs('#event-actions');
  if (result.offerEquipId) {
    actEl.innerHTML=`
      <button class="btn-primary" onclick="acceptEquipOffer()">BUY — ₿${result.offerCost}</button>
      <button onclick="toggleEventLearn()">WHAT IS THIS? ▾</button>
      <button onclick="dismissEvent()">DECLINE</button>`;
  } else {
    actEl.innerHTML=`
      <button onclick="toggleEventLearn()">WHAT IS THIS? ▾</button>
      <button class="btn-primary" onclick="dismissEvent()">ACKNOWLEDGED ›</button>`;
  }
  show('event-modal');
}

function toggleEventLearn(){ qs('#event-learn').classList.toggle('hidden'); }

function acceptEquipOffer() {
  if (!pendingEvent?.result?.offerEquipId) return;
  const {result}=pendingEvent;
  const eq=EQUIPMENT[result.offerEquipId];
  if (G.cash<result.offerCost){ addLog(`Can't afford ₿${result.offerCost} for ${eq.name}.`,'danger'); dismissEvent(); return; }
  G.cash-=result.offerCost;
  G.ownedEquipment.push(result.offerEquipId);
  eq.onBuy(G);
  G.concepts[result.offerEquipId]=eq;
  addLog(`Purchased ${eq.name} for ₿${result.offerCost}. ${eq.effect}.`,'success');
  refreshJobs();
  dismissEvent();
}

function dismissEvent(){ hide('event-modal'); pendingEvent=null; checkOver(); render(); }

// ================================================================
//  MINI-GAME ROUTER
// ================================================================
function openMiniGame(puzz,reward) {
  if (puzz.type==='diagnosis') openDiagnosisGame(puzz,reward);
  else if (puzz.type==='foundry') openFoundryGame(puzz,reward);
  else if (puzz.type==='arena')   openCircuitGame(puzz,reward);
  else openCircuitGame(puzz,reward);
}

function openCircuitGame(puzz,reward) {
  activePuzzle=puzz; activeReward=reward;
  puzzleFills={}; puzzleSelected=null; puzzleChecked=false; activeChoice=null;
  qs('#mg-title').textContent=puzz.title;
  qs('#mg-client').textContent=`${puzz.client} — ₿${fmt(reward)} reward${G.hasScope?' (scope enhanced)':''}`;
  qs('#mg-problem').textContent=puzz.problem;
  qs('#mg-schem-label').textContent='SCHEMATIC:';
  qs('#mg-schematic').textContent=puzz.schematic;
  const scopeEl=qs('#mg-scope-hint');
  if (G.hasScope){ scopeEl.textContent='〜 SCOPE READING: '+puzz.scopeHint; scopeEl.classList.remove('hidden'); }
  else scopeEl.classList.add('hidden');
  qs('#mg-tray-label').innerHTML='COMPONENT BIN <span class="dim">(tap to select):</span>';
  const slotsEl=qs('#mg-slots');
  slotsEl.innerHTML=''; slotsEl.style.display='';
  puzz.slots.forEach(slot=>{
    const div=document.createElement('div');
    div.className='mg-slot'; div.dataset.slotId=slot.id;
    div.innerHTML=`<div class="mg-slot-label">${slot.label}</div><div class="mg-slot-empty">[ empty — select component, then tap here ]</div>`;
    div.addEventListener('click',()=>fillSlot(slot.id));
    slotsEl.appendChild(div);
  });
  const compsEl=qs('#mg-components');
  compsEl.innerHTML='';
  [...puzz.components].sort(()=>Math.random()-0.5).forEach(comp=>{
    const div=document.createElement('div');
    div.className='mg-component'; div.dataset.compId=comp.id; div.dataset.compType=comp.type;
    div.innerHTML=`<div class="mg-comp-name">${comp.label}</div><div class="mg-comp-hint">${comp.hint}</div>`;
    div.addEventListener('click',()=>selectComponent(comp.id));
    compsEl.appendChild(div);
  });
  qs('#mg-result').classList.add('hidden');
  qs('#mg-result').className='mg-result hidden';
  qs('#mg-modal .modal-actions').innerHTML=`
    <button class="btn-primary" onclick="checkCircuit()">CHECK CIRCUIT</button>
    <button onclick="skipMinigame()">SKIP JOB</button>`;
  show('mg-modal');
}

function selectComponent(compId) {
  if (puzzleChecked) return;
  const el=document.querySelector(`[data-comp-id="${compId}"]`);
  if (!el||el.classList.contains('placed')) return;
  document.querySelectorAll('.mg-component').forEach(e=>e.classList.remove('selected'));
  if (puzzleSelected===compId){ puzzleSelected=null; return; }
  puzzleSelected=compId;
  el.classList.add('selected');
}

function fillSlot(slotId) {
  if (!puzzleSelected||puzzleChecked) return;
  const slot=activePuzzle.slots.find(s=>s.id===slotId);
  if (!slot) return;
  const compEl=document.querySelector(`[data-comp-id="${puzzleSelected}"]`);
  if (!compEl||compEl.classList.contains('placed')) return;
  const prev=puzzleFills[slotId];
  if (prev){ const p=document.querySelector(`[data-comp-id="${prev}"]`); if (p) p.classList.remove('placed'); }
  puzzleFills[slotId]=puzzleSelected;
  compEl.classList.add('placed'); compEl.classList.remove('selected');
  puzzleSelected=null;
  const slotEl=document.querySelector(`[data-slot-id="${slotId}"]`);
  slotEl.classList.add('has-component');
  slotEl.innerHTML=`<div class="mg-slot-label">${slot.label}</div><div class="mg-slot-fill">${compEl.querySelector('.mg-comp-name').textContent}</div>`;
  slotEl.addEventListener('click',()=>fillSlot(slotId));
}

function checkCircuit() {
  if (!activePuzzle) return;
  let allCorrect=true;
  activePuzzle.slots.forEach(slot=>{
    const slotEl=document.querySelector(`[data-slot-id="${slot.id}"]`);
    const filledId=puzzleFills[slot.id];
    if (!filledId){ slotEl?.classList.add('wrong'); allCorrect=false; return; }
    const type=document.querySelector(`[data-comp-id="${filledId}"]`)?.dataset.compType;
    if (type===slot.accepts) slotEl?.classList.add('correct');
    else { slotEl?.classList.add('wrong'); allCorrect=false; }
  });
  const resultEl=qs('#mg-result');
  resultEl.classList.remove('hidden');
  if (allCorrect) {
    G.cash+=activeReward; G.reputation+=15;
    G.totalEarned+=activeReward; G.todayIncome+=activeReward;
    G.jobsDoneToday++;
    G.concepts['circuit_'+activePuzzle.id]={name:activePuzzle.title,learn:activePuzzle.learn};
    resultEl.className='mg-result win';
    const dayWarn = G.jobsDoneToday>=3 ? '<br><span class="warn">⚠ 3 JOBS DONE — day will advance when you collect.</span>' : '';
    resultEl.innerHTML=`✓ CIRCUIT VERIFIED — ₿${fmt(activeReward)} transferred. +15 REP.<br><br><strong>What you fixed:</strong> ${activePuzzle.learn}${dayWarn}`;
    addLog(`Repair complete: ${activePuzzle.title}. Earned ₿${fmt(activeReward)}.`,'success');
    qs('#mg-modal .modal-actions').innerHTML=`<button class="btn-primary" onclick="closeMiniGame()">COLLECT ₿${fmt(activeReward)} ›</button>`;
    render();
  } else {
    puzzleChecked=false;
    resultEl.className='mg-result fail';
    resultEl.textContent='✗ INCORRECT — check highlighted slots and try again.';
  }
}

function openDiagnosisGame(puzz,reward) {
  activePuzzle=puzz; activeReward=reward;
  puzzleChecked=false; activeChoice=null;
  puzzleFills={}; puzzleSelected=null;
  qs('#mg-title').textContent=puzz.title;
  qs('#mg-client').textContent=`${puzz.client} — ₿${fmt(reward)} reward`;
  qs('#mg-problem').textContent=puzz.problem;
  qs('#mg-schem-label').textContent='SITUATION REPORT:';
  qs('#mg-schematic').textContent=puzz.scenario;
  const scopeEl=qs('#mg-scope-hint');
  if (G.hasScope){ scopeEl.textContent='〜 SCOPE READING: '+puzz.scopeHint; scopeEl.classList.remove('hidden'); }
  else scopeEl.classList.add('hidden');
  qs('#mg-slots').innerHTML=''; qs('#mg-slots').style.display='none';
  qs('#mg-tray-label').textContent='SELECT YOUR DIAGNOSIS:';
  const compsEl=qs('#mg-components');
  compsEl.innerHTML='';
  [...puzz.choices].sort(()=>Math.random()-0.5).forEach(choice=>{
    const btn=document.createElement('button');
    btn.className='diagnosis-choice';
    btn.textContent=choice.text;
    btn.addEventListener('click',()=>selectDiagnosis(btn,choice));
    compsEl.appendChild(btn);
  });
  qs('#mg-result').classList.add('hidden');
  qs('#mg-result').className='mg-result hidden';
  qs('#mg-modal .modal-actions').innerHTML=`
    <button class="btn-primary" onclick="checkDiagnosis()">SUBMIT DIAGNOSIS</button>
    <button onclick="skipMinigame()">SKIP JOB</button>`;
  show('mg-modal');
}

function selectDiagnosis(btn,choice) {
  if (puzzleChecked) return;
  document.querySelectorAll('.diagnosis-choice').forEach(b=>b.classList.remove('selected'));
  activeChoice=choice;
  btn.classList.add('selected');
}

function checkDiagnosis() {
  if (!activePuzzle) return;
  if (!activeChoice) {
    const r=qs('#mg-result'); r.classList.remove('hidden'); r.className='mg-result fail'; r.textContent='Select a diagnosis first.';
    return;
  }
  puzzleChecked=true;
  document.querySelectorAll('.diagnosis-choice').forEach(btn=>{
    const match=activePuzzle.choices.find(c=>c.text===btn.textContent);
    if (match?.correct) btn.classList.add('correct');
    else if (btn.classList.contains('selected')) btn.classList.add('wrong');
  });
  const resultEl=qs('#mg-result');
  resultEl.classList.remove('hidden');
  if (activeChoice.correct) {
    G.cash+=activeReward; G.reputation+=15;
    G.totalEarned+=activeReward; G.todayIncome+=activeReward;
    G.jobsDoneToday++;
    G.concepts['diag_'+activePuzzle.id]={name:activePuzzle.title,learn:activePuzzle.learn};
    resultEl.className='mg-result win';
    const dayWarnD = G.jobsDoneToday>=3 ? '<br><span class="warn">⚠ 3 JOBS DONE — day will advance when you collect.</span>' : '';
    resultEl.innerHTML=`✓ CORRECT — ₿${fmt(activeReward)} transferred. +15 REP.<br><br><strong>Explanation:</strong> ${activeChoice.explain}<br><br><strong>Engineering note:</strong> ${activePuzzle.learn}${dayWarnD}`;
    addLog(`Diagnosis correct: ${activePuzzle.title}. Earned ₿${fmt(activeReward)}.`,'success');
    qs('#mg-modal .modal-actions').innerHTML=`<button class="btn-primary" onclick="closeMiniGame()">COLLECT ₿${fmt(activeReward)} ›</button>`;
    render();
  } else {
    resultEl.className='mg-result fail';
    resultEl.innerHTML=`✗ INCORRECT.<br><br>${activeChoice.explain}`;
    qs('#mg-modal .modal-actions').innerHTML=`<button class="btn-primary" onclick="closeMiniGame()">CLOSE</button>`;
  }
}

function openFoundryGame(puzz,reward) {
  activePuzzle=puzz; activeReward=reward;
  puzzleChecked=false; activeChoice=null; puzzleFills={}; puzzleSelected=null;
  qs('#mg-title').textContent=puzz.title;
  qs('#mg-client').textContent=`${puzz.client} — ₿${fmt(reward)} reward`;
  qs('#mg-problem').textContent=puzz.problem;
  qs('#mg-schem-label').textContent='WAFER DIAGRAM:';
  qs('#mg-schematic').textContent=puzz.schematic;
  const scopeEl=qs('#mg-scope-hint');
  scopeEl.classList.add('hidden');
  qs('#mg-tray-label').textContent='PROCESS PARAMETERS (drag sliders):';
  qs('#mg-slots').style.display='none';
  qs('#mg-components').innerHTML=`
    <div class="foundry-param">
      <label>LITHO QUALITY <span id="fd-litho-val" class="warn">50%</span></label>
      <input type="range" id="fd-litho" min="0" max="100" value="50" oninput="qs('#fd-litho-val').textContent=this.value+'%';updateFoundryPreview()">
      <div class="foundry-hint dim">Higher quality → better yield, higher cost</div>
    </div>
    <div class="foundry-param">
      <label>TEST COVERAGE <span id="fd-test-val" class="warn">50%</span></label>
      <input type="range" id="fd-test" min="0" max="100" value="50" oninput="qs('#fd-test-val').textContent=this.value+'%';updateFoundryPreview()">
      <div class="foundry-hint dim">More testing → fewer defects shipped, more cost</div>
    </div>
    <div class="foundry-param">
      <label>THROUGHPUT <span id="fd-thru-val" class="warn">50%</span></label>
      <input type="range" id="fd-thru" min="0" max="100" value="50" oninput="qs('#fd-thru-val').textContent=this.value+'%';updateFoundryPreview()">
      <div class="foundry-hint dim">Higher throughput → more volume, lower quality checks</div>
    </div>
    <div id="foundry-preview" class="learn-box" style="margin-top:10px;font-size:11px"></div>`;
  qs('#mg-result').classList.add('hidden');
  qs('#mg-result').className='mg-result hidden';
  qs('#mg-modal .modal-actions').innerHTML=`
    <button class="btn-primary" onclick="checkFoundry()">RUN SIMULATION</button>
    <button onclick="skipMinigame()">SKIP JOB</button>`;
  updateFoundryPreview();
  show('mg-modal');
}

function updateFoundryPreview() {
  const litho=(parseInt(qs('#fd-litho')?.value)||50)/100;
  const test=(parseInt(qs('#fd-test')?.value)||50)/100;
  const thru=(parseInt(qs('#fd-thru')?.value)||50)/100;
  const totalDie=500;
  const baseCost=40000;
  const diePrice=120;
  const yield_rate=0.55 + litho*0.35 - thru*0.12;
  const defectEscape=(1-test)*0.15;
  const goodDie=Math.floor(totalDie*Math.max(0,yield_rate)*(1-defectEscape));
  const totalCost=baseCost + litho*15000 + test*8000 + thru*(-5000);
  const revenue=goodDie*diePrice;
  const margin=revenue>0?(revenue-totalCost)/revenue:0;
  const prev=qs('#foundry-preview');
  if (prev) prev.innerHTML=`Yield est: ${(yield_rate*100).toFixed(0)}% &nbsp;|&nbsp; Good die: ${goodDie} &nbsp;|&nbsp; Revenue: ₿${fmt(revenue)} &nbsp;|&nbsp; Cost: ₿${fmt(Math.floor(totalCost))} &nbsp;|&nbsp; <strong>Margin: ${(margin*100).toFixed(0)}%</strong> ${margin>=(activePuzzle?.targetMargin||0.6)?'<span class="success">✓ TARGET MET</span>':'<span class="warn">⬡ BELOW TARGET</span>'}`;
}

function checkFoundry() {
  if (!activePuzzle||puzzleChecked) return;
  puzzleChecked=true;
  const litho=(parseInt(qs('#fd-litho')?.value)||50)/100;
  const test=(parseInt(qs('#fd-test')?.value)||50)/100;
  const thru=(parseInt(qs('#fd-thru')?.value)||50)/100;
  const totalDie=500, baseCost=40000, diePrice=120;
  const yield_rate=0.55+litho*0.35-thru*0.12;
  const defectEscape=(1-test)*0.15;
  const goodDie=Math.floor(totalDie*Math.max(0,yield_rate)*(1-defectEscape));
  const totalCost=baseCost+litho*15000+test*8000+thru*(-5000);
  const revenue=goodDie*diePrice;
  const margin=revenue>0?(revenue-totalCost)/revenue:0;
  const target=activePuzzle.targetMargin||0.60;
  const resultEl=qs('#mg-result');
  resultEl.classList.remove('hidden');
  if (margin>=target) {
    G.cash+=activeReward; G.reputation+=15;
    G.totalEarned+=activeReward; G.todayIncome+=activeReward;
    G.jobsDoneToday++;
    G.concepts['foundry_'+activePuzzle.id]={name:activePuzzle.title,learn:activePuzzle.learn};
    resultEl.className='mg-result win';
    const dayWarn=G.jobsDoneToday>=3?'<br><span class="warn">⚠ 3 JOBS DONE — day will advance when you collect.</span>':'';
    resultEl.innerHTML=`✓ RUN PROFITABLE — ${(margin*100).toFixed(0)}% margin. ₿${fmt(activeReward)} transferred. +15 REP.<br><br><strong>Engineering note:</strong> ${activePuzzle.learn}${dayWarn}`;
    addLog(`Foundry sim: ${activePuzzle.title}. ${(margin*100).toFixed(0)}% margin. Earned ₿${fmt(activeReward)}.`,'success');
    qs('#mg-modal .modal-actions').innerHTML=`<button class="btn-primary" onclick="closeMiniGame()">COLLECT ₿${fmt(activeReward)} ›</button>`;
    render();
  } else {
    puzzleChecked=false;
    resultEl.className='mg-result fail';
    resultEl.textContent=`✗ MARGIN ${(margin*100).toFixed(0)}% — target is ${(target*100).toFixed(0)}%. Retune parameters and try again.`;
  }
}

function closeMiniGame() {
  hide('mg-modal'); activePuzzle=null;
  qs('#mg-slots').style.display='';
  if (G.jobsDoneToday>=3 && !G.gameOver) {
    addLog('3 jobs completed — end of shift. Day advances.','warn');
    advanceDay();
  } else {
    refreshJobs(); render();
  }
}
function skipMinigame() {
  hide('mg-modal'); activePuzzle=null;
  qs('#mg-slots').style.display='';
  addLog('Job skipped.','dim');
  refreshJobs(); checkOver(); render();
}

// ================================================================
//  SCOREBOARD
// ================================================================
function submitGlobalScore() {
  if (!WORKER_URL) return;
  const nw = netWorth();
  if (nw <= 0) return;
  fetch(WORKER_URL + '/scores', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name:  localStorage.getItem('sf_agent_name') || 'ANONYMOUS',
      score: nw,
      op:    G.operation,
      days:  G.day,
    }),
  }).catch(() => {});
}

function saveScore() {
  const scores=JSON.parse(localStorage.getItem('sf_scores')||'[]');
  const nw=netWorth();
  scores.push({
    name: localStorage.getItem('sf_agent_name')||'ANONYMOUS',
    op: G.operation,
    opLabel: OP_LABEL[G.operation]||`OP${G.operation}`,
    nw, earned:G.totalEarned,
    days:G.day, rep:G.reputation,
    won:OP_CONFIG[G.operation].goalCheck(nw),
    date:new Date().toLocaleDateString('en-US',{month:'short',day:'numeric'}),
  });
  scores.sort((a,b)=>b.nw-a.nw);
  localStorage.setItem('sf_scores',JSON.stringify(scores.slice(0,10)));
}

function showScores() {
  const scores=JSON.parse(localStorage.getItem('sf_scores')||'[]');
  const el=qs('#scores-list');
  if (!scores.length) {
    el.innerHTML='<p class="dim" style="font-size:11px;padding:12px 0">No runs recorded yet. Finish a game to post a score.</p>';
  } else {
    el.innerHTML=scores.map((s,i)=>`
      <div class="score-row">
        <span class="score-rank dim">#${i+1}</span>
        <span class="score-name">${s.name||'ANON'}</span>
        <span class="score-op">${s.opLabel||`OP${s.op}`}</span>
        <span class="score-nw ${s.nw>=0?'success':'danger'}">₿${fmt(s.nw)}</span>
        <span class="score-earned dim">+₿${fmt(s.earned)}</span>
        <span class="score-day dim">Day&nbsp;${s.days}</span>
        <span class="score-date dim">${s.date}</span>
        <span class="${s.won?'success':'danger'}">${s.won?'✓ WIN':'✗'}</span>
      </div>`).join('');
  }

  const gEl=qs('#global-scores-list');
  if (WORKER_URL) {
    gEl.innerHTML='<div class="dim" style="font-size:11px;padding:8px 0">Fetching global scores...</div>';
    fetch(WORKER_URL+'/scores')
      .then(r=>r.json())
      .then(renderGlobalScores)
      .catch(()=>{ gEl.innerHTML='<div class="dim" style="font-size:11px;padding:8px 0">Global leaderboard unavailable.</div>'; });
  } else {
    gEl.innerHTML='';
  }
  show('scores-modal');
}

function renderGlobalScores(scores) {
  const el=qs('#global-scores-list');
  if (!scores||!scores.length){
    el.innerHTML='<div class="dim" style="font-size:11px;padding:8px 0">No scores yet — be the first!</div>';
    return;
  }
  el.innerHTML=scores.map((s,i)=>`
    <div class="score-row">
      <span class="score-rank dim">#${i+1}</span>
      <span class="score-name">${s.name||'ANON'}</span>
      <span class="score-op">${OP_LABEL[s.op]||`OP${s.op}`}</span>
      <span class="score-nw success">₿${fmt(s.score)}</span>
      <span class="score-day dim">Day&nbsp;${s.days}</span>
    </div>`).join('');
}

// ================================================================
//  FIELD MANUAL
// ================================================================
function showManual() {
  const el=qs('#manual-list');
  const seen=Object.values(G.concepts).filter(Boolean);
  if (!seen.length) {
    el.innerHTML='<p class="dim" style="font-size:11px;padding:12px 0">Tap item names in the market to add entries. Complete jobs to unlock engineering concepts.</p>';
  } else {
    el.innerHTML=seen.map(c=>{
      const name=c.name||c.title||'?';
      const desc=c.learn||c.desc||'';
      return `<div class="manual-item"><div class="manual-name">${name}</div><div class="manual-desc">${desc}</div></div>`;
    }).join('');
  }
  show('manual-modal');
}

// ================================================================
//  GAME OVER
// ================================================================
function checkOver() {
  if (G.gameOver) return;
  const nw=netWorth(); const cfg=OP_CONFIG[G.operation];
  if (G.day>G.maxDays||(G.cash<=0&&nw<0)){ G.gameOver=true; render(); saveScore(); submitGlobalScore(); showGameOver(); }
}

function showGameOver() {
  const nw=netWorth(); const cfg=OP_CONFIG[G.operation];
  const won=cfg.goalCheck(nw);
  const titleEl=qs('#gameover-title');
  titleEl.textContent=won?`OPERATION ${G.operation} COMPLETE`:'GAME OVER';
  titleEl.className=`gameover-title ${won?'success':'danger'}`;
  const msgs={
    won1:'Debt cleared. Profitable run. The supply chain rewards those who understand it.',
    won2:'₿15,000 net worth achieved. You\'ve graduated from street trader to defense contractor.',
    won3:'₿50,000 net worth. ASIC design empire established. Your silicon is in devices worldwide.',
    won4:'₿150,000 net worth. Tapeout veteran. Your GDS-II is on a TSMC wafer. The fabs know your name.',
    lose:'Didn\'t make the target. There\'s always another run.',
    broke:'The fund\'s lawyers are filing paperwork. Your inventory is collateral.',
  };
  qs('#gameover-msg').textContent=won
    ?(msgs[`won${G.operation}`]||msgs.won1)
    :(nw<-2000?msgs.broke:msgs.lose);
  qs('#gameover-stats').innerHTML=`
    <div class="go-stat"><span>Cash</span><span>₿${fmt(G.cash)}</span></div>
    <div class="go-stat warn"><span>Debt</span><span>₿${fmt(G.debt)}</span></div>
    <div class="go-stat"><span>Inventory</span><span>₿${fmt(invValue())}</span></div>
    <div class="go-stat ${won?'success':'danger'}"><span>NET WORTH</span><span>₿${fmt(nw)}</span></div>
    <div class="go-stat info"><span>Total Earned</span><span>₿${fmt(G.totalEarned)}</span></div>
    <div class="go-stat info"><span>Reputation</span><span>${G.reputation} pts</span></div>`;
  const seen=Object.values(G.concepts).filter(Boolean);
  qs('#gameover-concepts').innerHTML=seen.length
    ?`<div class="concepts-label">CONCEPTS YOU ENCOUNTERED (${seen.length}):</div>`+seen.map(c=>{
        const name=c.name||c.title||'?';
        const desc=(c.learn||c.desc||'').slice(0,200);
        return `<div class="concept-item"><div class="concept-name">${name}</div><div class="concept-desc">${desc}${desc.length>=200?'…':''}</div></div>`;
      }).join('')
    :'<div class="dim" style="font-size:12px;margin-top:12px">Tap item names next run to learn what each component is.</div>';
  let btns=`<button class="btn-primary" style="width:100%" onclick="newGame()">PLAY AGAIN — ${OP_LABEL[G.operation]}</button>`;
  if (won&&G.operation===1){ localStorage.setItem('sf_op2_unlocked','1'); btns+=`<button class="btn-primary" style="width:100%;margin-top:8px;border-color:var(--amber)!important;color:var(--amber)" onclick="startOp(2)">▶ START OPERATION 2 — CLASSIFIED</button>`; }
  if (won&&G.operation===2){ localStorage.setItem('sf_op3_unlocked','1'); btns+=`<button class="btn-primary" style="width:100%;margin-top:8px;border-color:var(--amber)!important;color:var(--amber)" onclick="startOp(3)">▶ START OPERATION 3 — ASIC STARTUP</button>`; }
  if (won&&G.operation===3){ localStorage.setItem('sf_op4_unlocked','1'); btns+=`<button class="btn-primary" style="width:100%;margin-top:8px;border-color:var(--amber)!important;color:var(--amber)" onclick="startOp(4)">▶ START OPERATION 4 — TAPEOUT & BRINGUP</button>`; }
  if (!won&&localStorage.getItem('sf_op2_unlocked')&&G.operation!==2) btns+=`<button style="width:100%;margin-top:8px" onclick="startOp(2)">SWITCH TO OP 2</button>`;
  if (!won&&localStorage.getItem('sf_op3_unlocked')&&G.operation!==3) btns+=`<button style="width:100%;margin-top:8px" onclick="startOp(3)">SWITCH TO OP 3</button>`;
  if (!won&&localStorage.getItem('sf_op4_unlocked')&&G.operation!==4) btns+=`<button style="width:100%;margin-top:8px" onclick="startOp(4)">SWITCH TO OP 4</button>`;
  btns+=`<button style="width:100%;margin-top:8px" onclick="showScores()">VIEW SCOREBOARD</button>`;
  qs('#gameover-actions').innerHTML=btns;
  show('gameover-modal');
}

function startOp(n){ hide('gameover-modal'); initGame(n); }
function newGame() { hide('gameover-modal'); initGame(G.operation); }

// ================================================================
//  SHOP
// ================================================================
function buyEquipment(equipId) {
  const eq=EQUIPMENT[equipId];
  if (G.cash<eq.cost||G.ownedEquipment.includes(equipId)) return;
  G.cash-=eq.cost;
  G.ownedEquipment.push(equipId);
  eq.onBuy(G);
  G.concepts[equipId]=eq;
  addLog(`Purchased ${eq.name} for ₿${fmt(eq.cost)}. ${eq.effect}.`,'success');
  refreshJobs(); render();
}

// ================================================================
//  LOG
// ================================================================
function addLog(msg,type='normal') {
  G.log.unshift({msg,type});
  if (G.log.length>50) G.log.pop();
}

// ================================================================
//  RENDER
// ================================================================
function render() {
  renderHeader(); renderMarket(); renderShop();
  renderPortfolio(); renderInventory(); renderContracts();
  renderCities(); renderLog();
}

function renderHeader() {
  const daysLeft=G.maxDays-G.day+1;
  const dayEl=qs('#stat-day');
  dayEl.textContent=`${OP_LABEL[G.operation]} — DAY ${G.day}/${G.maxDays}`;
  dayEl.className=daysLeft<=3?'danger':'';
  qs('#stat-city').textContent=CITIES[G.city].code;
  const cashEl=qs('#stat-cash'); cashEl.textContent=`₿${fmt(G.cash)}`; cashEl.className=G.cash<500?'danger':'';
  const debtEl=qs('#stat-debt'); debtEl.textContent=G.debt>0?`DEBT ₿${fmt(G.debt)}`:'DEBT CLEAR'; debtEl.className=G.debt>0?'warn':'success';
  qs('#stat-rep').textContent=`REP ${G.reputation}`;
}

function renderMarket() {
  const city=CITIES[G.city];
  qs('#market-city').textContent=city.name.toUpperCase();
  qs('#market-desc').textContent=city.desc;
  const list=qs('#market-list');
  list.innerHTML='';
  for (const [itemId,item] of visibleItems()) {
    if (!G.prices[itemId]?.[G.city]) continue;
    const p=curPrice(itemId);
    const prevP=G.prevPrices[itemId]?.[G.city]??p;
    const trend=p>prevP*1.05?'▲':p<prevP*0.95?'▼':'─';
    const trendCls=trend==='▲'?'up':trend==='▼'?'down':'flat';
    const expanded=!!infoExpanded[itemId];
    const row=document.createElement('div');
    row.className='market-row';
    row.innerHTML=`
      <div class="market-main">
        <div class="market-left">
          <button class="item-name-btn" data-item="${itemId}">${item.name}${item.opMin===2?' <span style="color:var(--amber);font-size:10px">[OP2]</span>':item.opMin===3?' <span style="color:var(--red);font-size:10px">[OP3]</span>':item.opMin===4?' <span style="color:#7af;font-size:10px">[OP4]</span>':''}</button>
          <span class="item-short">${item.short}</span>
        </div>
        <div class="market-right">
          <span class="price">₿${fmt(p)}</span>
          <span class="trend ${trendCls}">${trend}</span>
          <button class="btn-buy" data-item="${itemId}">BUY</button>
        </div>
      </div>
      <div class="item-learn${expanded?'':' hidden'}">${item.learn}</div>`;
    row.querySelector('.item-name-btn').addEventListener('click',()=>{
      infoExpanded[itemId]=!infoExpanded[itemId];
      G.concepts[itemId]=item;
      row.querySelector('.item-learn').classList.toggle('hidden',!infoExpanded[itemId]);
    });
    row.querySelector('.btn-buy').addEventListener('click',()=>openTradeModal('buy',itemId));
    list.appendChild(row);
  }
}

function renderShop() {
  const city=CITIES[G.city];
  const available=(city.shopItems||[]).filter(id=>!G.ownedEquipment.includes(id));
  const sec=qs('#shop-section');
  if (!available.length){ sec.classList.add('hidden'); return; }
  sec.classList.remove('hidden');
  qs('#shop-list').innerHTML='';
  available.forEach(equipId=>{
    const eq=EQUIPMENT[equipId]; const can=G.cash>=eq.cost;
    const div=document.createElement('div');
    div.className='shop-item';
    div.innerHTML=`
      <div class="shop-item-info">
        <div class="shop-item-name">${eq.icon} ${eq.name}</div>
        <div class="shop-item-desc">${eq.short} — ${eq.effect}</div>
      </div>
      <button class="btn-shop" ${can?'':'disabled'} data-equip="${equipId}">₿${fmt(eq.cost)}</button>`;
    if (can) div.querySelector('.btn-shop').addEventListener('click',()=>buyEquipment(equipId));
    qs('#shop-list').appendChild(div);
  });
}

function renderPortfolio() {
  const nw=netWorth(); const cfg=OP_CONFIG[G.operation];
  qs('#p-cash').textContent=`₿${fmt(G.cash)}`;
  const d=qs('#p-debt'); d.textContent=G.debt>0?`₿${fmt(G.debt)} (−₿${G.debtRate}/day)`:'CLEAR'; d.className=G.debt>0?'warn':'success';
  qs('#p-inv').textContent=`₿${fmt(invValue())}`;
  const n=qs('#p-net'); n.textContent=`₿${fmt(nw)}`; n.className=nw<0?'danger':cfg.goalCheck(nw)?'success':'';
  const todayEl=qs('#p-today'); todayEl.textContent=`+₿${fmt(G.todayIncome||0)}`; todayEl.className=(G.todayIncome||0)>0?'success':'dim';
  qs('#p-earned').textContent=`+₿${fmt(G.totalEarned||0)}`;
  qs('#equipment-owned').innerHTML=G.ownedEquipment.map(id=>`<span class="equip-badge">${EQUIPMENT[id].icon} ${EQUIPMENT[id].name}</span>`).join('');
}

function renderInventory() {
  const el=qs('#inv-list');
  const items=Object.entries(G.inventory).filter(([,v])=>v>0);
  if (!items.length){ el.innerHTML='<div class="inv-empty">-- EMPTY --</div>'; return; }
  el.innerHTML='';
  for (const [itemId,qty] of items) {
    const item=ITEMS[itemId]; const nowPrice=curPrice(itemId);
    const meta=G.inventoryMeta[itemId]; const paid=meta?.pricePaid??nowPrice;
    const pnl=(nowPrice-paid)*qty;
    const pnlPct=paid>0?((nowPrice-paid)/paid*100).toFixed(0):0;
    const cap=maxCarryFor(itemId);
    const filled=Math.min(10,Math.round((qty/cap)*10));
    const bar='█'.repeat(filled)+'░'.repeat(10-filled);
    const row=document.createElement('div');
    row.className='inv-row';
    row.innerHTML=`
      <div class="inv-info">
        <div class="inv-name">${item.name}</div>
        <div class="inv-qty">×${qty} ${item.unit}s</div>
        <div class="inv-cap">[${bar}] ${qty}/${cap}</div>
        <div class="inv-paid dim">paid ₿${fmt(paid)} ea → now ₿${fmt(nowPrice)} ea</div>
        <div class="inv-pnl ${pnl>=0?'profit':'loss'}">${pnl>=0?'+':''}₿${fmt(pnl)} (${pnl>=0?'+':''}${pnlPct}%)</div>
      </div>
      <button class="btn-sell">SELL</button>`;
    row.querySelector('.btn-sell').addEventListener('click',()=>openTradeModal('sell',itemId));
    el.appendChild(row);
  }
}

function renderContracts() {
  const el=qs('#contracts-list');
  el.innerHTML='';
  if (!G.availableJobs.length) { el.innerHTML='<p class="dim" style="font-size:11px">Jobs refresh each day.</p>'; return; }
  G.availableJobs.forEach((job,idx)=>{
    const t=job.puzzle.type;
    const icon=t==='diagnosis'?'🔍':t==='foundry'?'⚗':t==='arena'?'⚔':'⚡';
    const typeName=t==='diagnosis'?'Fault Diagnosis':t==='foundry'?'Foundry Sim':t==='arena'?'FPGA Arena':'Circuit Repair';
    const div=document.createElement('div');
    div.className='contract-item ready';
    div.innerHTML=`
      <div class="contract-name">${icon} ${job.puzzle.title}</div>
      <div class="contract-detail">Client: ${job.puzzle.client} · ${typeName}</div>
      <div class="contract-reward">₿${fmt(job.reward)}${G.hasScope?' · scope enhanced':''} — tap to accept</div>`;
    div.addEventListener('click',()=>startJob(idx));
    el.appendChild(div);
  });
}

function renderCities() {
  const container=qs('#city-btns');
  container.innerHTML='';
  for (const [cityId,city] of visibleCities()) {
    if (cityId===G.city) {
      const btn=document.createElement('button');
      btn.className='btn-city active';
      btn.textContent=`${city.code} ${city.name}`;
      container.appendChild(btn);
    } else {
      const prices=G.travelPrices?.[G.city]?.[cityId];
      const minCost=prices?Math.min(prices.bus,prices.plane):0;
      const btn=document.createElement('button');
      btn.className='btn-city';
      btn.innerHTML=`${city.code} ${city.name}<span class="city-cost"> ₿${fmt(minCost)}+</span>`;
      btn.addEventListener('click',()=>openTravelModal(cityId));
      container.appendChild(btn);
    }
  }
}

function renderLog() {
  const el=qs('#log-list'); el.innerHTML='';
  G.log.slice(0,16).forEach(entry=>{
    const d=document.createElement('div');
    d.className=`log-entry ${entry.type}`;
    d.textContent=`› ${entry.msg}`;
    el.appendChild(d);
  });
}

// ================================================================
//  TRADE MODAL
// ================================================================
function openTradeModal(mode,itemId) {
  const item=ITEMS[itemId]; const p=curPrice(itemId);
  const have=G.inventory[itemId]; const cap=maxCarryFor(itemId);
  const maxQty=mode==='buy'?Math.min(cap-have,Math.floor(G.cash/p)):have;
  if (mode==='buy'&&maxQty<=0){ addLog(G.cash<p?`Need ₿${fmt(p)}, have ₿${fmt(G.cash)}.`:`Carry limit (${cap}) reached.`,'danger'); renderLog(); return; }
  if (mode==='sell'&&maxQty<=0){ addLog(`No ${item.name} in inventory.`,'danger'); renderLog(); return; }
  tradeCtx={mode,itemId,p,maxQty};
  qs('#trade-title').textContent=`${mode==='buy'?'BUY':'SELL'}: ${item.name.toUpperCase()}`;
  qs('#trade-price').textContent=`₿${fmt(p)} per ${item.unit}`;
  qs('#trade-have').textContent=mode==='buy'?`In stock: ${have}/${cap}   Can buy: ${maxQty}`:`In stock: ${have} ${item.unit}s`;
  qs('#trade-learn').textContent=item.learn;
  qs('#trade-pnl').innerHTML='';
  const qi=qs('#trade-qty'); qi.max=maxQty; qi.value=Math.min(1,maxQty);
  qs('#trade-max-btn').textContent=mode==='buy'?'BUY MAX':'SELL ALL';
  updateTradeTotal();
  show('trade-modal');
  qi.focus(); qi.select();
}

function updateTradeTotal() {
  if (!tradeCtx) return;
  const qty=Math.max(0,parseInt(qs('#trade-qty').value)||0);
  const total=qty*tradeCtx.p;
  qs('#trade-total').innerHTML=`${tradeCtx.mode==='buy'?'COST':'REVENUE'}: <span class="${tradeCtx.mode==='buy'?'warn':'success'}">₿${fmt(total)}</span>`;
  qs('#trade-confirm').textContent=`${tradeCtx.mode==='buy'?'BUY':'SELL'} ${qty}`;
  if (tradeCtx.mode==='sell') {
    const meta=G.inventoryMeta[tradeCtx.itemId];
    if (meta?.pricePaid>0) {
      const pnl=(tradeCtx.p-meta.pricePaid)*qty;
      const pct=((tradeCtx.p-meta.pricePaid)/meta.pricePaid*100).toFixed(0);
      qs('#trade-pnl').innerHTML=`P&L: <span class="${pnl>=0?'success':'danger'}">${pnl>=0?'+':''}₿${fmt(pnl)} (${pnl>=0?'+':''}${pct}%)</span>`;
    }
  }
}

function setTradeMax() {
  if (!tradeCtx) return;
  qs('#trade-qty').value=tradeCtx.maxQty;
  updateTradeTotal();
}

function confirmTrade() {
  if (!tradeCtx) return;
  const qty=Math.max(0,parseInt(qs('#trade-qty').value)||0);
  if (qty<=0) return;
  const ok=tradeCtx.mode==='buy'?doBuy(tradeCtx.itemId,qty):doSell(tradeCtx.itemId,qty);
  if (ok) closeTradeModal();
}

function closeTradeModal(){ hide('trade-modal'); tradeCtx=null; }

// ================================================================
//  UTILS + BOOT
// ================================================================
function startGame() {
  const nameEl=qs('#agent-name');
  const name=((nameEl?.value?.trim()||'ANONYMOUS').toUpperCase().slice(0,20));
  localStorage.setItem('sf_agent_name', name);
  hide('intro-modal');
  if (SETTINGS.music) MUSIC.start();
}

function qs(sel)  { return document.querySelector(sel); }
function show(id) { document.getElementById(id).classList.remove('hidden'); }
function hide(id) { document.getElementById(id).classList.add('hidden'); }
function fmt(n)   { return Math.round(n).toLocaleString(); }

document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  initGame(1);
  applySettings();
  show('intro-modal');

  // Pre-fill saved name
  const savedName=localStorage.getItem('sf_agent_name');
  if (savedName) { const el=qs('#agent-name'); if (el) el.value=savedName; }

  document.addEventListener('keydown', e => {
    if (e.key==='Escape') {
      closeTradeModal();
      ['event-modal','mg-modal','hw-modal','scores-modal','manual-modal','settings-modal','travel-modal'].forEach(id=>hide(id));
    }
  });
});
