/* ==========================================================================
   Clinic On - Main JavaScript, ClinicStore & 2026 SaaS System Features
   ========================================================================== */

const STORAGE_KEYS = {
  DOCTORS: 'clinic_doctors',
  PATIENTS: 'clinic_patients',
  APPOINTMENTS: 'clinic_appointments',
  PRESCRIPTIONS: 'clinic_prescriptions',
  DEPARTMENTS: 'clinic_departments',
  MEDICAL_RECORDS: 'clinic_medical_records',
  USERS: 'clinic_users',
  SESSION: 'clinic_session',
  THEME: 'clinic_theme'
};

// Seed Data Definition
const SEED_DATA = {
  users: [
    { id: 'usr_admin', email: 'admin@example.com', password: 'admin123', name: 'System Admin', role: 'admin' },
    { id: 'usr_doc1', email: 'doctor@example.com', password: 'doctor123', name: 'Dr. John Smith', role: 'doctor', docId: 'doc_1' },
    { id: 'usr_pat1', email: 'patient@example.com', password: 'patient123', name: 'Sarah Jenkins', role: 'patient', patId: 'pat_1' }
  ],
  departments: [
    { id: 'dept_1', name: 'Cardiology', icon: 'bi-heart-pulse', desc: 'Comprehensive heart care, diagnostics, and cardiac rehabilitation.', head: 'Dr. John Smith', doctorsCount: 4 },
    { id: 'dept_2', name: 'Neurology', icon: 'bi-box-seam', desc: 'Advanced treatment for brain, nerve, and spine disorders.', head: 'Dr. Robert Miller', doctorsCount: 3 },
    { id: 'dept_3', name: 'Orthopedics', icon: 'bi-person-arms-up', desc: 'Specialized bone, joint, fracture, and sports injury care.', head: 'Dr. David Clark', doctorsCount: 5 },
    { id: 'dept_4', name: 'Pediatrics', icon: 'bi-emoji-smile', desc: 'Compassionate pediatric healthcare for newborns, kids, and teens.', head: 'Dr. Emily Wong', doctorsCount: 4 },
    { id: 'dept_5', name: 'Dermatology', icon: 'bi-droplet', desc: 'Clinical skin care, allergy treatment, and cosmetic procedures.', head: 'Dr. Sophia Davis', doctorsCount: 3 },
    { id: 'dept_6', name: 'General Medicine', icon: 'bi-hospital', desc: 'Primary health consultations, preventive checkups, and wellness.', head: 'Dr. Lisa Ray', doctorsCount: 6 }
  ],
  doctors: [
    {
      id: 'doc_1',
      name: 'Dr. John Smith',
      specialization: 'Cardiologist',
      department: 'Cardiology',
      experience: '12 Years',
      education: 'MD - Cardiology, Harvard Medical School',
      phone: '+1 (555) 234-5678',
      email: 'doctor@example.com',
      fee: '$150',
      rating: 4.9,
      reviewsCount: 124,
      status: 'Active',
      days: ['Mon', 'Wed', 'Fri'],
      hours: '09:00 AM - 04:00 PM',
      about: 'Dr. John Smith is a renowned Cardiologist with over 12 years of clinical excellence in cardiovascular surgery and preventative heart care.',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80'
    },
    {
      id: 'doc_2',
      name: 'Dr. Emily Wong',
      specialization: 'Pediatric Specialist',
      department: 'Pediatrics',
      experience: '8 Years',
      education: 'MD - Pediatrics, Johns Hopkins University',
      phone: '+1 (555) 345-6789',
      email: 'emily.wong@example.com',
      fee: '$120',
      rating: 4.8,
      reviewsCount: 98,
      status: 'Active',
      days: ['Tue', 'Thu', 'Sat'],
      hours: '10:00 AM - 05:00 PM',
      about: 'Dedicated pediatrician focused on child health, growth tracking, and adolescent medicine.',
      image: 'https://images.unsplash.com/photo-1594824813566-88855ce789c0?w=400&auto=format&fit=crop&q=80'
    },
    {
      id: 'doc_3',
      name: 'Dr. Robert Miller',
      specialization: 'Consultant Neurologist',
      department: 'Neurology',
      experience: '15 Years',
      education: 'PhD & MD - Neurology, Oxford University',
      phone: '+1 (555) 456-7890',
      email: 'robert.m@example.com',
      fee: '$180',
      rating: 5.0,
      reviewsCount: 165,
      status: 'Active',
      days: ['Mon', 'Tue', 'Thu'],
      hours: '09:30 AM - 03:30 PM',
      about: 'Expert in treating neurological disorders, migraine therapy, and spinal nerve management.',
      image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80'
    },
    {
      id: 'doc_4',
      name: 'Dr. Sophia Davis',
      specialization: 'Dermatologist',
      department: 'Dermatology',
      experience: '9 Years',
      education: 'MD - Dermatology, Stanford Medicine',
      phone: '+1 (555) 567-8901',
      email: 'sophia.d@example.com',
      fee: '$140',
      rating: 4.7,
      reviewsCount: 88,
      status: 'Active',
      days: ['Wed', 'Fri', 'Sat'],
      hours: '11:00 AM - 06:00 PM',
      about: 'Specialized in clinical skin care, laser dermatology, and treatment of skin conditions.',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80'
    },
    {
      id: 'doc_5',
      name: 'Dr. David Clark',
      specialization: 'Orthopedic Surgeon',
      department: 'Orthopedics',
      experience: '14 Years',
      education: 'MS - Orthopedics, Mayo Clinic',
      phone: '+1 (555) 678-9012',
      email: 'david.c@example.com',
      fee: '$165',
      rating: 4.9,
      reviewsCount: 142,
      status: 'Active',
      days: ['Mon', 'Wed', 'Thu'],
      hours: '08:00 AM - 02:00 PM',
      about: 'Specialist in joint replacement, sports injury rehabilitation, and arthroscopic procedures.',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=80'
    },
    {
      id: 'doc_6',
      name: 'Dr. Lisa Ray',
      specialization: 'Family Physician',
      department: 'General Medicine',
      experience: '10 Years',
      education: 'MD - General Medicine, UCLA',
      phone: '+1 (555) 789-0123',
      email: 'lisa.r@example.com',
      fee: '$100',
      rating: 4.8,
      reviewsCount: 110,
      status: 'Active',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      hours: '09:00 AM - 05:00 PM',
      about: 'Providing primary health consultations, preventive checkups, and holistic family care.',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&auto=format&fit=crop&q=80'
    }
  ],
  patients: [
    {
      id: 'pat_1',
      name: 'Sarah Jenkins',
      age: 34,
      gender: 'Female',
      dob: '1992-05-14',
      phone: '+1 (555) 987-6543',
      email: 'patient@example.com',
      bloodGroup: 'O+',
      address: '742 Evergreen Terrace, Springfield',
      lastAppointment: '2026-08-25',
      status: 'Active'
    },
    {
      id: 'pat_2',
      name: 'Michael Brown',
      age: 45,
      gender: 'Male',
      dob: '1981-11-20',
      phone: '+1 (555) 876-5432',
      email: 'michael.b@example.com',
      bloodGroup: 'A+',
      address: '123 Elm Street, Cityville',
      lastAppointment: '2026-08-28',
      status: 'Active'
    },
    {
      id: 'pat_3',
      name: 'Emma Watson',
      age: 28,
      gender: 'Female',
      dob: '1998-03-08',
      phone: '+1 (555) 765-4321',
      email: 'emma.w@example.com',
      bloodGroup: 'B-',
      address: '456 Oak Avenue, Metropolis',
      lastAppointment: '2026-08-30',
      status: 'Active'
    },
    {
      id: 'pat_4',
      name: 'James Wilson',
      age: 62,
      gender: 'Male',
      dob: '1964-09-15',
      phone: '+1 (555) 654-3210',
      email: 'james.w@example.com',
      bloodGroup: 'AB+',
      address: '890 Pine Road, Gotham',
      lastAppointment: '2026-08-18',
      status: 'Active'
    }
  ],
  appointments: [
    {
      id: 'APT-1001',
      patientId: 'pat_1',
      patientName: 'Sarah Jenkins',
      patientPhone: '+1 (555) 987-6543',
      doctorId: 'doc_1',
      doctorName: 'Dr. John Smith',
      department: 'Cardiology',
      date: '2026-09-05',
      time: '10:30 AM',
      type: 'Follow-up Consultation',
      reason: 'Routine cardiac checkup & ECG review.',
      status: 'Confirmed',
      createdAt: '2026-08-30'
    },
    {
      id: 'APT-1002',
      patientId: 'pat_2',
      patientName: 'Michael Brown',
      patientPhone: '+1 (555) 876-5432',
      doctorId: 'doc_3',
      doctorName: 'Dr. Robert Miller',
      department: 'Neurology',
      date: '2026-09-06',
      time: '11:00 AM',
      type: 'New Consultation',
      reason: 'Recurring migraine headache evaluation.',
      status: 'Pending',
      createdAt: '2026-08-31'
    },
    {
      id: 'APT-1003',
      patientId: 'pat_3',
      patientName: 'Emma Watson',
      patientPhone: '+1 (555) 765-4321',
      doctorId: 'doc_4',
      doctorName: 'Dr. Sophia Davis',
      department: 'Dermatology',
      date: '2026-08-28',
      time: '02:30 PM',
      type: 'General Checkup',
      reason: 'Skin allergy assessment.',
      status: 'Completed',
      createdAt: '2026-08-25'
    },
    {
      id: 'APT-1004',
      patientId: 'pat_1',
      patientName: 'Sarah Jenkins',
      patientPhone: '+1 (555) 987-6543',
      doctorId: 'doc_2',
      doctorName: 'Dr. Emily Wong',
      department: 'Pediatrics',
      date: '2026-08-20',
      time: '09:30 AM',
      type: 'General Checkup',
      reason: 'Child immunization consultation.',
      status: 'Completed',
      createdAt: '2026-08-15'
    }
  ],
  prescriptions: [
    {
      id: 'RX-901',
      appointmentId: 'APT-1004',
      patientId: 'pat_1',
      patientName: 'Sarah Jenkins',
      doctorId: 'doc_1',
      doctorName: 'Dr. John Smith',
      date: '2026-08-25',
      diagnosis: 'Mild Essential Hypertension',
      medicines: [
        { name: 'Amlodipine 5mg', dosage: '1 Tablet', frequency: 'Once Daily (Morning)', duration: '30 Days', instructions: 'Take after breakfast with water.' },
        { name: 'Multivitamin Complex', dosage: '1 Capsule', frequency: 'Once Daily (Night)', duration: '30 Days', instructions: 'Take after dinner.' }
      ],
      notes: 'Maintain low sodium diet. Avoid strenuous activity for 1 week.'
    }
  ],
  medicalRecords: [
    {
      id: 'REC-501',
      patientId: 'pat_1',
      patientName: 'Sarah Jenkins',
      doctorName: 'Dr. John Smith',
      date: '2026-08-25',
      diagnosis: 'Mild Hypertension',
      symptoms: 'Occasional mild dizziness, elevated blood pressure (135/88).',
      treatment: 'Lifestyle modification, low-sodium diet, Amlodipine 5mg prescribed.',
      attachments: 'ECG_Report_Aug2026.pdf'
    }
  ]
};

// ClinicStore API
const ClinicStore = {
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.DOCTORS)) localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(SEED_DATA.doctors));
    if (!localStorage.getItem(STORAGE_KEYS.PATIENTS)) localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(SEED_DATA.patients));
    if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(SEED_DATA.appointments));
    if (!localStorage.getItem(STORAGE_KEYS.PRESCRIPTIONS)) localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(SEED_DATA.prescriptions));
    if (!localStorage.getItem(STORAGE_KEYS.DEPARTMENTS)) localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(SEED_DATA.departments));
    if (!localStorage.getItem(STORAGE_KEYS.MEDICAL_RECORDS)) localStorage.setItem(STORAGE_KEYS.MEDICAL_RECORDS, JSON.stringify(SEED_DATA.medicalRecords));
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_DATA.users));
  },

  getDoctors() { return JSON.parse(localStorage.getItem(STORAGE_KEYS.DOCTORS) || '[]'); },
  saveDoctor(doc) {
    const list = this.getDoctors();
    const idx = list.findIndex(d => d.id === doc.id);
    if (idx >= 0) list[idx] = doc; else { if (!doc.id) doc.id = 'doc_' + Date.now(); list.unshift(doc); }
    localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(list));
    return doc;
  },
  deleteDoctor(id) {
    localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(this.getDoctors().filter(d => d.id !== id)));
  },

  getPatients() { return JSON.parse(localStorage.getItem(STORAGE_KEYS.PATIENTS) || '[]'); },
  savePatient(pat) {
    const list = this.getPatients();
    const idx = list.findIndex(p => p.id === pat.id);
    if (idx >= 0) list[idx] = pat; else { if (!pat.id) pat.id = 'pat_' + Date.now(); list.unshift(pat); }
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(list));
    return pat;
  },
  deletePatient(id) {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(this.getPatients().filter(p => p.id !== id)));
  },

  getAppointments() { return JSON.parse(localStorage.getItem(STORAGE_KEYS.APPOINTMENTS) || '[]'); },
  saveAppointment(apt) {
    const list = this.getAppointments();
    if (!apt.id) apt.id = 'APT-' + Math.floor(1000 + Math.random() * 9000);
    list.unshift(apt);
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(list));
    return apt;
  },
  updateAppointment(id, fields) {
    const list = this.getAppointments();
    const idx = list.findIndex(a => a.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...fields };
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(list));
      return list[idx];
    }
    return null;
  },

  getPrescriptions() { return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRESCRIPTIONS) || '[]'); },
  savePrescription(rx) {
    const list = this.getPrescriptions();
    if (!rx.id) rx.id = 'RX-' + Math.floor(100 + Math.random() * 900);
    list.unshift(rx);
    localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(list));
    return rx;
  },

  getDepartments() { return JSON.parse(localStorage.getItem(STORAGE_KEYS.DEPARTMENTS) || '[]'); },
  saveDepartment(dept) {
    const list = this.getDepartments();
    const idx = list.findIndex(d => d.id === dept.id);
    if (idx >= 0) list[idx] = dept; else { if (!dept.id) dept.id = 'dept_' + Date.now(); list.push(dept); }
    localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(list));
    return dept;
  },
  deleteDepartment(id) {
    localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(this.getDepartments().filter(d => d.id !== id)));
  },

  getMedicalRecords() { return JSON.parse(localStorage.getItem(STORAGE_KEYS.MEDICAL_RECORDS) || '[]'); },
  saveMedicalRecord(rec) {
    const list = this.getMedicalRecords();
    if (!rec.id) rec.id = 'REC-' + Math.floor(100 + Math.random() * 900);
    list.unshift(rec);
    localStorage.setItem(STORAGE_KEYS.MEDICAL_RECORDS, JSON.stringify(list));
    return rec;
  },

  getUsers() { return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]'); },
  saveUser(usr) {
    const list = this.getUsers();
    list.push(usr);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(list));
  },
  getSession() { return JSON.parse(sessionStorage.getItem(STORAGE_KEYS.SESSION) || localStorage.getItem(STORAGE_KEYS.SESSION) || 'null'); },
  setSession(usr, remember = true) {
    if (remember) localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(usr));
    else sessionStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(usr));
  },
  clearSession() {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    sessionStorage.removeItem(STORAGE_KEYS.SESSION);
  }
};

ClinicStore.init();

// Dark / Light Theme Manager
const ThemeManager = {
  init() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    this.setTheme(savedTheme);
  },
  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    
    // Update theme toggle button icons
    const btns = document.querySelectorAll('.theme-toggle-btn');
    btns.forEach(btn => {
      btn.innerHTML = theme === 'dark' ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon-stars"></i>';
      btn.setAttribute('title', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    });
  },
  toggle() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    this.setTheme(current === 'dark' ? 'light' : 'dark');
  }
};

// Global Command Palette (Ctrl + K / Cmd + K)
const CommandPalette = {
  init() {
    this.injectPaletteMarkup();
    this.bindEvents();
  },

  injectPaletteMarkup() {
    if (document.getElementById('commandPaletteBackdrop')) return;

    const html = `
      <div id="commandPaletteBackdrop" class="command-palette-backdrop">
        <div class="command-palette-modal">
          <div class="command-search-header">
            <i class="bi bi-search text-muted"></i>
            <input type="text" id="commandSearchInput" placeholder="Search patients, doctors, appointments..." autocomplete="off">
            <span class="badge bg-light text-muted border">ESC</span>
          </div>
          <div class="command-results-list" id="commandResultsContainer">
            <!-- Results rendered dynamically -->
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
  },

  bindEvents() {
    // Keybindings: Ctrl+K or Cmd+K
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.toggle();
      }
      if (e.key === 'Escape') {
        this.close();
      }
    });

    const backdrop = document.getElementById('commandPaletteBackdrop');
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) this.close();
      });
    }

    const input = document.getElementById('commandSearchInput');
    if (input) {
      input.addEventListener('input', () => this.performSearch(input.value));
    }

    // Bind all trigger buttons (.command-palette-trigger)
    document.addEventListener('click', (e) => {
      if (e.target.closest('.command-palette-trigger')) {
        this.open();
      }
    });
  },

  open() {
    const backdrop = document.getElementById('commandPaletteBackdrop');
    const input = document.getElementById('commandSearchInput');
    if (backdrop) {
      backdrop.classList.add('show');
      if (input) {
        input.value = '';
        input.focus();
        this.performSearch('');
      }
    }
  },

  close() {
    const backdrop = document.getElementById('commandPaletteBackdrop');
    if (backdrop) backdrop.classList.remove('show');
  },

  toggle() {
    const backdrop = document.getElementById('commandPaletteBackdrop');
    if (backdrop && backdrop.classList.contains('show')) this.close();
    else this.open();
  },

  performSearch(query) {
    const container = document.getElementById('commandResultsContainer');
    if (!container) return;

    const q = query.toLowerCase().trim();

    const doctors = ClinicStore.getDoctors().filter(d => !q || d.name.toLowerCase().includes(q) || d.specialization.toLowerCase().includes(q));
    const patients = ClinicStore.getPatients().filter(p => !q || p.name.toLowerCase().includes(q) || p.phone.includes(q));
    const appts = ClinicStore.getAppointments().filter(a => !q || a.patientName.toLowerCase().includes(q) || a.doctorName.toLowerCase().includes(q) || a.id.toLowerCase().includes(q));

    let html = '';

    if (doctors.length > 0) {
      html += `<div class="sidebar-label px-2 my-1">Doctors</div>`;
      doctors.slice(0, 3).forEach(d => {
        html += `
          <div class="command-item" onclick="window.location.href='/doctors/?dept=${encodeURIComponent(d.department)}'">
            <div>
              <i class="bi bi-person-badge text-primary me-2"></i>
              <strong>${d.name}</strong> <small class="text-muted">(${d.specialization})</small>
            </div>
            <span class="badge bg-light text-dark border">Doctor</span>
          </div>
        `;
      });
    }

    if (patients.length > 0) {
      html += `<div class="sidebar-label px-2 my-1">Patients</div>`;
      patients.slice(0, 3).forEach(p => {
        html += `
          <div class="command-item" onclick="window.location.href='/admin/patients/'">
            <div>
              <i class="bi bi-person text-success me-2"></i>
              <strong>${p.name}</strong> <small class="text-muted">(${p.phone})</small>
            </div>
            <span class="badge bg-light text-dark border">Patient</span>
          </div>
        `;
      });
    }

    if (appts.length > 0) {
      html += `<div class="sidebar-label px-2 my-1">Appointments</div>`;
      appts.slice(0, 3).forEach(a => {
        html += `
          <div class="command-item" onclick="window.location.href='/admin/appointments/'">
            <div>
              <i class="bi bi-calendar-event text-warning me-2"></i>
              <strong>${a.id}</strong> - ${a.patientName} with ${a.doctorName}
            </div>
            <span class="badge-${a.status.toLowerCase()}">${a.status}</span>
          </div>
        `;
      });
    }

    if (!html) {
      html = `<div class="text-muted p-3 text-center fs-7">No results matching "${query}"</div>`;
    }

    container.innerHTML = html;
  },

  getRelativePrefix() {
    return window.location.pathname.includes('/admin/') || window.location.pathname.includes('/doctor/') || window.location.pathname.includes('/patient/') ? '../' : './';
  }
};

// Global App Helpers & Toast System
const ClinicApp = {
  toast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
      document.body.appendChild(container);
    }

    const toastId = 'toast_' + Date.now();
    const bgClass = type === 'success' ? 'bg-success' : type === 'danger' ? 'bg-danger' : type === 'warning' ? 'bg-warning' : 'bg-primary';
    
    const html = `
      <div id="${toastId}" class="toast align-items-center text-white ${bgClass} border-0 shadow" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body d-flex align-items-center gap-2">
            <i class="bi ${type === 'success' ? 'bi-check-circle-fill' : type === 'danger' ? 'bi-x-circle-fill' : 'bi-info-circle-fill'} fs-5"></i>
            <span>${message}</span>
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', html);

    const toastEl = document.getElementById(toastId);
    if (window.bootstrap && bootstrap.Toast) {
      const bsToast = new bootstrap.Toast(toastEl, { delay: 3500 });
      bsToast.show();
    }
  },

  setupSidebarToggle() {
    const toggleBtn = document.querySelector('.sidebar-toggle-btn');
    const sidebar = document.querySelector('.sidebar');
    
    if (toggleBtn && sidebar) {
      let backdrop = document.querySelector('.sidebar-backdrop');
      if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'sidebar-backdrop';
        document.body.appendChild(backdrop);
      }

      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('show');
        backdrop.classList.toggle('show');
      });

      backdrop.addEventListener('click', () => {
        sidebar.classList.remove('show');
        backdrop.classList.remove('show');
      });
    }
  },

  highlightActiveLinks() {
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll('.nav-link, .nav-link-item');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        const cleanHref = href.split('?')[0];
        if (cleanHref === currentPath || (cleanHref !== '/' && cleanHref !== '' && currentPath.startsWith(cleanHref))) {
          link.classList.add('active');
        }
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  CommandPalette.init();
  ClinicApp.setupSidebarToggle();
  ClinicApp.highlightActiveLinks();

  // Bind theme toggle buttons
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => ThemeManager.toggle());
  });
});
