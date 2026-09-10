/* ==========================================
   Clinic On - Patient Portal & Booking Flow
   ========================================== */

const Patient = {
  getLoggedPatient() {
    const session = ClinicStore.getSession();
    const sessionName = document.querySelector('.user-display-name')?.textContent?.trim();
    if (sessionName && sessionName !== 'Sarah Jenkins') {
      return {
        id: session ? session.id || session.user_id : 'pat_1',
        name: sessionName,
        email: session ? session.email : ''
      };
    }
    if (!session) return { id: 'pat_1', name: 'Patient', email: '' };
    const patients = ClinicStore.getPatients();
    return patients.find(p => p.email && p.email.toLowerCase() === session.email.toLowerCase()) || {
      id: session.id || session.user_id || 'pat_1',
      name: session.name || 'Patient',
      email: session.email || ''
    };
  },

  initLayout() {
    Auth.checkRouteGuard('patient');
  },

  // Patient Dashboard Overview
  initDashboard() {
    this.initLayout();
    const pat = this.getLoggedPatient();

    const allAppointments = ClinicStore.getAppointments();
    const myAppts = allAppointments.filter(a => a.patientId === pat.id || a.patientName === pat.name);

    const upcoming = myAppts.filter(a => a.status === 'Confirmed' || a.status === 'Pending');
    const completed = myAppts.filter(a => a.status === 'Completed');
    const myRx = ClinicStore.getPrescriptions().filter(r => r.patientId === pat.id || r.patientName === pat.name);

    document.getElementById('patStatUpcomingCount').textContent = upcoming.length;
    document.getElementById('patStatCompletedCount').textContent = completed.length;
    document.getElementById('patStatRxCount').textContent = myRx.length;

    // Render Next Upcoming Appointment Widget
    const nextApptCard = document.getElementById('patNextApptCard');
    if (nextApptCard) {
      if (upcoming.length > 0) {
        const nextApt = upcoming[0];
        nextApptCard.innerHTML = `
          <div class="d-flex align-items-center justify-content-between mb-3">
            <div>
              <span class="badge badge-success-custom mb-1"><i class="bi bi-clock me-1"></i>${nextApt.time}</span>
              <h5 class="fw-bold mb-0">${nextApt.doctorName}</h5>
              <small class="text-muted">${nextApt.department || 'Consultation'}</small>
            </div>
            <div class="text-end">
              <span class="badge bg-soft-primary text-primary px-3 py-2 rounded-pill fs-8"><i class="bi bi-calendar3 me-1"></i>${nextApt.date}</span>
            </div>
          </div>
          <div class="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
            <div>
              <small class="text-muted d-block">Reason</small>
              <strong class="fs-7">${nextApt.reason || 'General Consultation'}</strong>
            </div>
            <span class="badge bg-primary text-white">${nextApt.status}</span>
          </div>
        `;
      } else {
        nextApptCard.innerHTML = `
          <div class="text-center py-4">
            <div class="stat-icon-wrapper stat-icon-teal mx-auto mb-3" style="width:56px; height:56px; border-radius:50%;">
              <i class="bi bi-calendar-check fs-3"></i>
            </div>
            <h6 class="fw-bold text-foreground mb-1">No Upcoming Consultations</h6>
            <p class="text-muted fs-7 mb-3 mx-auto" style="max-width:320px;">You don't have any scheduled appointments at the moment.</p>
            <a href="/patient/book-appointment/" class="btn btn-emerald-pill btn-sm px-3">
              <i class="bi bi-calendar-plus me-1"></i>Book New Consultation
            </a>
          </div>
        `;
      }
    }
  },

  // Appointment Booking Page Flow
  initBookingPage() {
    this.initLayout();

    const deptSelect = document.getElementById('bookDeptSelect');
    const docSelect = document.getElementById('bookDocSelect');
    const dateInput = document.getElementById('bookDateInput');
    const slotsContainer = document.getElementById('bookTimeSlotsContainer');
    const reasonInput = document.getElementById('bookReasonInput');

    // Populate Departments if not pre-rendered
    const depts = ClinicStore.getDepartments();
    if (deptSelect && deptSelect.options.length <= 1) {
      deptSelect.innerHTML = `<option value="">-- Select Department --</option>` + depts.map(d => `<option value="${d.name}">${d.name}</option>`).join('');
    }

    // Check query param for docId or dept
    const urlParams = new URLSearchParams(window.location.search);
    const preDocId = urlParams.get('docId');
    const preDept = urlParams.get('dept');

    if (preDept && deptSelect) {
      deptSelect.value = preDept;
    }

    // Populate Doctors based on selected department
    const updateDoctorsDropdown = () => {
      // If server already rendered real doctors from DB, keep them unless user filtered department
      if (docSelect.options.length > 1 && !deptSelect.value) {
        return;
      }
      const selectedDept = deptSelect.value;
      const allDocs = ClinicStore.getDoctors();
      const filteredDocs = selectedDept ? allDocs.filter(d => d.department === selectedDept) : allDocs;

      if (filteredDocs.length > 0) {
        docSelect.innerHTML = `<option value="">-- Select Doctor --</option>` + filteredDocs.map(d => `<option value="${d.id}" data-name="${d.name}" data-dept="${d.department}">${d.name} (${d.specialization})</option>`).join('');
      }

      if (preDocId) {
        docSelect.value = preDocId;
      }
    };

    deptSelect.addEventListener('change', updateDoctorsDropdown);
    if (docSelect && docSelect.options.length <= 1) {
      updateDoctorsDropdown();
    }

    // Default Date to Tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDateStr = tomorrow.toISOString().split('T')[0];
    dateInput.min = minDateStr;
    dateInput.value = minDateStr;

    // Time Slot Generator
    const availableSlotTemplates = [
      '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', 
      '11:00 AM', '02:00 PM', '02:30 PM', '03:00 PM', 
      '03:30 PM', '04:00 PM', '04:30 PM'
    ];

    const generateTimeSlots = () => {
      const docId = docSelect.value;
      const selectedDate = dateInput.value;
      slotsContainer.innerHTML = '';

      if (!docId || !selectedDate) {
        slotsContainer.innerHTML = `<div class="text-muted fs-7">Please select a doctor and date to view open slot times.</div>`;
        return;
      }

      // Check collision against existing appointments
      const existingAppts = ClinicStore.getAppointments().filter(a => a.doctorId === docId && a.date === selectedDate && a.status !== 'Cancelled');
      const bookedTimes = existingAppts.map(a => a.time);

      slotsContainer.innerHTML = availableSlotTemplates.map(slotTime => {
        const isBooked = bookedTimes.includes(slotTime);
        return `
          <div class="col-4 col-sm-3 col-md-2">
            <input type="radio" class="btn-check" name="timeSlot" id="slot_${slotTime.replace(/[\s:]/g, '')}" value="${slotTime}" ${isBooked ? 'disabled' : ''} required>
            <label class="btn ${isBooked ? 'btn-outline-secondary opacity-50' : 'btn-outline-primary'} w-100 py-2 fs-8 fw-semibold" for="slot_${slotTime.replace(/[\s:]/g, '')}">
              ${slotTime}
              ${isBooked ? '<br><small class="text-danger fw-bold">(Booked)</small>' : ''}
            </label>
          </div>
        `;
      }).join('');
    };

    docSelect.addEventListener('change', generateTimeSlots);
    dateInput.addEventListener('change', generateTimeSlots);
    generateTimeSlots();

    // Form Submit
    const form = document.getElementById('bookAppointmentForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const pat = this.getLoggedPatient();
      const selectedDocOpt = docSelect.options[docSelect.selectedIndex];

      const docId = docSelect.value;
      const docName = selectedDocOpt ? selectedDocOpt.dataset.name : 'Dr. Doctor';
      const department = deptSelect.value || (selectedDocOpt ? selectedDocOpt.dataset.dept : 'General Medicine');
      const date = dateInput.value;
      const selectedSlotEl = document.querySelector('input[name="timeSlot"]:checked');
      const time = selectedSlotEl ? selectedSlotEl.value : null;
      const reason = reasonInput.value.trim() || 'General Consultation';

      if (!docId || !date || !time) {
        ClinicApp.toast('Please select doctor, date, and time slot.', 'danger');
        return;
      }

      // Final Collision Double Check
      const collision = ClinicStore.getAppointments().find(a => a.doctorId === docId && a.date === date && a.time === time && a.status !== 'Cancelled');
      if (collision) {
        ClinicApp.toast('This slot was just booked! Please select another time.', 'warning');
        generateTimeSlots();
        return;
      }

      // Save Appointment
      const newApt = ClinicStore.saveAppointment({
        patientId: pat.id,
        patientName: pat.name,
        patientPhone: pat.phone,
        doctorId: docId,
        doctorName: docName,
        department: department,
        date: date,
        time: time,
        type: 'Online Reservation',
        reason: reason,
        status: 'Pending',
        createdAt: new Date().toISOString().split('T')[0]
      });

      ClinicApp.toast(`Appointment ${newApt.id} successfully booked!`, 'success');

      setTimeout(() => {
        window.location.href = '/patient/appointments/';
      }, 700);
    });
  },

  // Appointments List (Tabs: Upcoming | Completed | Cancelled)
  initAppointmentsPage() {
    this.initLayout();
    this.renderPatientAppointments();
  },

  renderPatientAppointments() {
    const pat = this.getLoggedPatient();
    const myAppts = ClinicStore.getAppointments().filter(a => a.patientId === pat.id || a.patientName === pat.name);

    const upcomingList = myAppts.filter(a => a.status === 'Confirmed' || a.status === 'Pending');
    const completedList = myAppts.filter(a => a.status === 'Completed');
    const cancelledList = myAppts.filter(a => a.status === 'Cancelled');

    this.renderApptTabContent('upcomingApptContainer', upcomingList, true);
    this.renderApptTabContent('completedApptContainer', completedList, false);
    this.renderApptTabContent('cancelledApptContainer', cancelledList, false);
  },

  renderApptTabContent(containerId, list, allowCancel = false) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (list.length === 0) {
      container.innerHTML = `
        <div class="empty-state p-4 card">
          <i class="bi bi-calendar-x empty-state-icon"></i>
          <h6>No appointments found</h6>
        </div>
      `;
      return;
    }

    container.innerHTML = list.map(a => `
      <div class="card p-3 mb-3 shadow-sm border">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <div>
            <span class="badge bg-primary-subtle text-primary fw-bold mb-1">${a.department}</span>
            <h5 class="fw-bold mb-0">${a.doctorName}</h5>
          </div>
          <span class="badge-${a.status.toLowerCase()}">${a.status}</span>
        </div>
        <div class="row g-2 fs-7 text-muted my-2 bg-light p-2 rounded">
          <div class="col-md-6"><i class="bi bi-calendar me-1"></i>Date: <strong>${a.date}</strong></div>
          <div class="col-md-6"><i class="bi bi-clock me-1"></i>Time: <strong>${a.time}</strong></div>
          <div class="col-12"><i class="bi bi-chat-text me-1"></i>Reason: ${a.reason || 'N/A'}</div>
        </div>
        ${allowCancel ? `
          <div class="text-end">
            <button class="btn btn-sm btn-outline-danger" onclick="Patient.cancelAppointment('${a.id}')"><i class="bi bi-x-circle me-1"></i>Cancel Appointment</button>
          </div>
        ` : ''}
      </div>
    `).join('');
  },

  cancelAppointment(id) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      ClinicStore.updateAppointment(id, { status: 'Cancelled' });
      ClinicApp.toast('Appointment cancelled.', 'info');
      
      if (window.location.pathname.includes('dashboard')) {
        this.initDashboard();
      } else {
        this.renderPatientAppointments();
      }
    }
  }
};
