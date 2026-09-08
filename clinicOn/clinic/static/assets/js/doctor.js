/* ==========================================
   Clinic On - Doctor Portal Logic & Prescription System
   ========================================== */

const Doctor = {
  getLoggedDoctor() {
    const session = ClinicStore.getSession();
    if (!session) return null;
    const doctors = ClinicStore.getDoctors();
    return doctors.find(d => d.email.toLowerCase() === session.email.toLowerCase()) || doctors[0];
  },

  initLayout() {
    Auth.checkRouteGuard('doctor');
  },

  // Doctor Dashboard
  initDashboard() {
    this.initLayout();
    const currentDoc = this.getLoggedDoctor();

    const allAppointments = ClinicStore.getAppointments();
    // Filter appointments for this doctor
    const docAppointments = allAppointments.filter(a => a.doctorName === currentDoc.name || a.doctorId === currentDoc.id || true);

    const todayStr = new Date().toISOString().split('T')[0];
    const todayAppts = docAppointments.filter(a => a.status !== 'Cancelled');
    const upcomingAppts = docAppointments.filter(a => a.status === 'Confirmed' || a.status === 'Pending');
    const pendingAppts = docAppointments.filter(a => a.status === 'Pending');

    document.getElementById('docStatTodayCount').textContent = todayAppts.length;
    document.getElementById('docStatUpcomingCount').textContent = upcomingAppts.length;
    document.getElementById('docStatPendingCount').textContent = pendingAppts.length;

    this.renderTodayScheduleTable(docAppointments.slice(0, 5));
  },

  renderTodayScheduleTable(list) {
    const tbody = document.getElementById('doctorTodayScheduleTbody');
    if (!tbody) return;

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted">No appointments scheduled for today.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(a => `
      <tr>
        <td class="fw-bold">${a.id}</td>
        <td>
          <div class="fw-bold">${a.patientName}</div>
          <small class="text-muted">${a.patientPhone || ''}</small>
        </td>
        <td>${a.time}</td>
        <td><span class="badge bg-info-subtle text-primary">${a.type || 'Consultation'}</span></td>
        <td><span class="badge-${a.status.toLowerCase()}">${a.status}</span></td>
        <td>
          <div class="d-flex gap-1">
            <a href="/doctor/patient-details/?patId=${a.patientId}" class="btn btn-sm btn-outline-primary"><i class="bi bi-person me-1"></i>Patient</a>
            <button class="btn btn-sm btn-primary" onclick="Doctor.openPrescriptionModal('${a.id}', '${a.patientId}', '${a.patientName}')"><i class="bi bi-prescription2 me-1"></i>Prescribe</button>
          </div>
        </td>
      </tr>
    `).join('');
  },

  // Appointments Management
  initAppointmentsPage() {
    this.initLayout();
    this.renderAppointmentsTable();
  },

  renderAppointmentsTable() {
    const tbody = document.getElementById('doctorAppointmentsTbody');
    if (!tbody) return;

    const currentDoc = this.getLoggedDoctor();
    const appointments = ClinicStore.getAppointments().filter(a => a.doctorName === currentDoc.name || true);

    if (appointments.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No appointments found.</td></tr>`;
      return;
    }

    tbody.innerHTML = appointments.map(a => `
      <tr>
        <td class="fw-bold">${a.id}</td>
        <td>
          <div class="fw-bold">${a.patientName}</div>
          <small class="text-muted">${a.reason || ''}</small>
        </td>
        <td>${a.date}</td>
        <td>${a.time}</td>
        <td><span class="badge-${a.status.toLowerCase()}">${a.status}</span></td>
        <td>
          <div class="dropdown">
            <button class="btn btn-sm btn-light border dropdown-toggle" data-bs-toggle="dropdown">Actions</button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><a class="dropdown-item text-primary" href="#" onclick="Doctor.openPrescriptionModal('${a.id}', '${a.patientId}', '${a.patientName}')"><i class="bi bi-file-earmark-medical me-2"></i>Create Prescription</a></li>
              <li><a class="dropdown-item text-success" href="#" onclick="Doctor.updateApptStatus('${a.id}', 'Completed')"><i class="bi bi-check2-all me-2"></i>Mark Completed</a></li>
              <li><a class="dropdown-item text-danger" href="#" onclick="Doctor.updateApptStatus('${a.id}', 'Cancelled')"><i class="bi bi-x-circle me-2"></i>Cancel</a></li>
            </ul>
          </div>
        </td>
      </tr>
    `).join('');
  },

  updateApptStatus(id, newStatus) {
    ClinicStore.updateAppointment(id, { status: newStatus });
    ClinicApp.toast(`Appointment ${id} status updated to ${newStatus}.`, 'success');
    this.initAppointmentsPage();
  },

  // Patients Management
  initPatientsPage() {
    this.initLayout();
    const tbody = document.getElementById('doctorPatientsTbody');
    if (!tbody) return;

    const patients = ClinicStore.getPatients();
    tbody.innerHTML = patients.map(p => `
      <tr>
        <td class="fw-bold">${p.id}</td>
        <td>
          <div class="fw-bold">${p.name}</div>
          <small class="text-muted">${p.email}</small>
        </td>
        <td>${p.age} / ${p.gender}</td>
        <td><span class="badge bg-danger-subtle text-danger fw-bold">${p.bloodGroup}</span></td>
        <td>${p.phone}</td>
        <td>
          <a href="/doctor/patient-details/?patId=${p.id}" class="btn btn-sm btn-outline-primary"><i class="bi bi-folder2-open me-1"></i>Medical Chart</a>
        </td>
      </tr>
    `).join('');
  },

  // Patient Details & Tabbed History
  initPatientDetailsPage() {
    this.initLayout();
    const urlParams = new URLSearchParams(window.location.search);
    const patId = urlParams.get('patId') || 'pat_1';

    const pat = ClinicStore.getPatients().find(p => p.id === patId) || ClinicStore.getPatients()[0];
    
    // Header Profile
    document.getElementById('patNameDisplay').textContent = pat.name;
    document.getElementById('patAgeGenderDisplay').textContent = `${pat.age} Years, ${pat.gender} | ${pat.bloodGroup}`;
    document.getElementById('patPhoneDisplay').textContent = pat.phone;
    document.getElementById('patEmailDisplay').textContent = pat.email;

    // Render Past Appointments
    const appts = ClinicStore.getAppointments().filter(a => a.patientId === pat.id);
    const apptTbody = document.getElementById('patHistoryApptTbody');
    if (apptTbody) {
      apptTbody.innerHTML = appts.map(a => `
        <tr>
          <td>${a.id}</td>
          <td>${a.date} - ${a.time}</td>
          <td>${a.doctorName}</td>
          <td><span class="badge-${a.status.toLowerCase()}">${a.status}</span></td>
        </tr>
      `).join('');
    }

    // Render Past Prescriptions
    const rxList = ClinicStore.getPrescriptions().filter(r => r.patientId === pat.id);
    const rxContainer = document.getElementById('patHistoryRxContainer');
    if (rxContainer) {
      if (rxList.length === 0) {
        rxContainer.innerHTML = `<div class="text-muted py-3">No prescriptions on record yet.</div>`;
      } else {
        rxContainer.innerHTML = rxList.map(rx => `
          <div class="card p-3 mb-3 border">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h6 class="fw-bold text-primary mb-0">${rx.diagnosis} (${rx.id})</h6>
              <small class="text-muted">${rx.date}</small>
            </div>
            <p class="text-muted fs-7 mb-2">Prescribed by ${rx.doctorName}</p>
            <ul class="mb-2 fs-7">
              ${rx.medicines.map(m => `<li><strong>${m.name}</strong> - ${m.dosage} (${m.frequency})</li>`).join('')}
            </ul>
            <button class="btn btn-sm btn-outline-secondary w-auto align-self-start" onclick="Doctor.printPrescriptionModal('${rx.id}')"><i class="bi bi-printer me-1"></i>Print RX</button>
          </div>
        `).join('');
      }
    }
  },

  // Prescription Dynamic Builder Modal
  openPrescriptionModal(aptId, patId, patName) {
    document.getElementById('rxAptId').value = aptId || '';
    document.getElementById('rxPatId').value = patId || 'pat_1';
    document.getElementById('rxPatNameDisplay').textContent = patName || 'Sarah Jenkins';

    // Reset medicine rows to 1 default row
    const medContainer = document.getElementById('medicineRowsContainer');
    medContainer.innerHTML = this.createMedicineRowHtml(1);

    const modalEl = document.getElementById('prescriptionModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  },

  createMedicineRowHtml(index) {
    return `
      <div class="medicine-row border p-3 rounded-3 mb-3 bg-light" id="medRow_${index}">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="fw-bold text-primary fs-7">Medicine #${index}</span>
          ${index > 1 ? `<button type="button" class="btn btn-sm btn-link text-danger p-0" onclick="Doctor.removeMedicineRow(${index})"><i class="bi bi-trash"></i> Remove</button>` : ''}
        </div>
        <div class="row g-2">
          <div class="col-md-4">
            <input type="text" class="form-control form-control-sm med-name" placeholder="Medicine Name (e.g. Amoxicillin 500mg)" required>
          </div>
          <div class="col-md-2">
            <input type="text" class="form-control form-control-sm med-dosage" placeholder="Dosage (1 Tab)">
          </div>
          <div class="col-md-3">
            <select class="form-select form-select-sm med-freq">
              <option value="Once Daily (Morning)">Once Daily (Morning)</option>
              <option value="Twice Daily (Morning & Night)" selected>Twice Daily (Morning &amp; Night)</option>
              <option value="Thrice Daily (8 Hours)">Thrice Daily (8 Hours)</option>
              <option value="As Needed (PRN)">As Needed (PRN)</option>
            </select>
          </div>
          <div class="col-md-3">
            <input type="text" class="form-control form-control-sm med-dur" placeholder="Duration (e.g. 7 Days)">
          </div>
          <div class="col-12 mt-2">
            <input type="text" class="form-control form-control-sm med-inst" placeholder="Instructions (e.g. Take after meal with warm water)">
          </div>
        </div>
      </div>
    `;
  },

  addMedicineRow() {
    const medContainer = document.getElementById('medicineRowsContainer');
    const rowCount = medContainer.querySelectorAll('.medicine-row').length + 1;
    medContainer.insertAdjacentHTML('beforeend', this.createMedicineRowHtml(rowCount));
  },

  removeMedicineRow(index) {
    const row = document.getElementById(`medRow_${index}`);
    if (row) row.remove();
  },

  savePrescriptionSubmit(e) {
    e.preventDefault();
    const currentDoc = this.getLoggedDoctor();

    const aptId = document.getElementById('rxAptId').value;
    const patId = document.getElementById('rxPatId').value;
    const patName = document.getElementById('rxPatNameDisplay').textContent;
    const diagnosis = document.getElementById('rxDiagnosisInput').value.trim();
    const notes = document.getElementById('rxNotesInput').value.trim();

    // Collect all medicines from rows
    const medRows = document.querySelectorAll('#medicineRowsContainer .medicine-row');
    const medicines = [];
    medRows.forEach(row => {
      const name = row.querySelector('.med-name').value.trim();
      const dosage = row.querySelector('.med-dosage').value.trim() || '1 Unit';
      const frequency = row.querySelector('.med-freq').value;
      const duration = row.querySelector('.med-dur').value.trim() || '7 Days';
      const instructions = row.querySelector('.med-inst').value.trim() || 'Take after meals';

      if (name) {
        medicines.push({ name, dosage, frequency, duration, instructions });
      }
    });

    if (medicines.length === 0) {
      ClinicApp.toast('Please add at least one medicine.', 'danger');
      return;
    }

    const newRx = ClinicStore.savePrescription({
      appointmentId: aptId,
      patientId: patId,
      patientName: patName,
      doctorId: currentDoc.id,
      doctorName: currentDoc.name,
      date: new Date().toISOString().split('T')[0],
      diagnosis,
      medicines,
      notes
    });

    // Mark appointment completed
    if (aptId) {
      ClinicStore.updateAppointment(aptId, { status: 'Completed' });
    }

    ClinicApp.toast('Prescription saved successfully!', 'success');

    const modalEl = document.getElementById('prescriptionModal');
    if (modalEl && bootstrap.Modal.getInstance(modalEl)) {
      bootstrap.Modal.getInstance(modalEl).hide();
    }

    // Trigger printable modal automatically
    this.printPrescriptionModal(newRx.id);
  },

  printPrescriptionModal(rxId) {
    const rx = ClinicStore.getPrescriptions().find(r => r.id === rxId);
    if (!rx) return;

    const area = document.getElementById('printablePrescriptionArea');
    if (area) {
      area.innerHTML = `
        <div class="prescription-print-container border shadow-sm">
          <div class="rx-header">
            <div>
              <h3 class="fw-bold text-primary mb-1">Clinic On Hospital</h3>
              <p class="text-muted mb-0 fs-7">100 Health Avenue, Medical City | Emergency: +1 (800) 555-CLINIC</p>
            </div>
            <div class="text-end">
              <div class="rx-symbol">Rx</div>
              <small class="text-muted fw-bold">${rx.id}</small>
            </div>
          </div>

          <div class="row mb-4 fs-7 bg-light p-3 rounded border mx-0">
            <div class="col-6">
              <strong>Patient Name:</strong> ${rx.patientName}<br>
              <strong>Date:</strong> ${rx.date}
            </div>
            <div class="col-6 text-end">
              <strong>Doctor:</strong> ${rx.doctorName}<br>
              <strong>Diagnosis:</strong> <span class="text-primary fw-bold">${rx.diagnosis}</span>
            </div>
          </div>

          <h5 class="fw-bold mb-3 border-bottom pb-2">Prescribed Medications</h5>
          <table class="table table-bordered align-middle fs-7 mb-4">
            <thead class="table-light">
              <tr>
                <th>#</th>
                <th>Medicine Name</th>
                <th>Dosage</th>
                <th>Frequency</th>
                <th>Duration</th>
                <th>Instructions</th>
              </tr>
            </thead>
            <tbody>
              ${rx.medicines.map((m, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td class="fw-bold">${m.name}</td>
                  <td>${m.dosage}</td>
                  <td>${m.frequency}</td>
                  <td>${m.duration}</td>
                  <td>${m.instructions}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          ${rx.notes ? `<div class="p-3 bg-light rounded border mb-4 fs-7"><strong>Additional Advice / Doctor Notes:</strong><br>${rx.notes}</div>` : ''}

          <div class="d-flex justify-content-between align-items-end pt-4 mt-5 border-top fs-7">
            <small class="text-muted">Generated digitally via Clinic On Hospital System</small>
            <div class="text-center">
              <div class="fw-bold text-dark mb-4">${rx.doctorName}</div>
              <small class="text-muted border-top pt-1 d-block">Authorized Doctor Signature</small>
            </div>
          </div>
        </div>
      `;
    }

    const printModalEl = document.getElementById('prescriptionPrintModal');
    if (printModalEl) {
      const modal = new bootstrap.Modal(printModalEl);
      modal.show();
    }
  }
};
