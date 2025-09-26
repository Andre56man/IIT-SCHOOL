// Student data
let students = [
    { 
        id: 1, 
        name: 'Ahmed Benali', 
        email: 'ahmed.benali@iit.edu', 
        program: 'Génie Informatique', 
        year: 2, 
        status: 'actif', 
        absences: 3,
        payments: [
            { amount: 150000, date: '2024-01-15', description: 'Premier versement' },
            { amount: 100000, date: '2024-02-20', description: 'Deuxième versement' }
        ],
        totalDue: 350000,
        enrollmentDate: '2023-09-15'
    },
    { 
        id: 2, 
        name: 'Fatima Zohra', 
        email: 'fatima.zohra@iit.edu', 
        program: 'Cybersécurité', 
        year: 3, 
        status: 'actif', 
        absences: 1,
        payments: [
            { amount: 200000, date: '2024-01-10', description: 'Paiement complet' }
        ],
        totalDue: 200000,
        enrollmentDate: '2022-09-10'
    },
    { 
        id: 3, 
        name: 'Karim Mansouri', 
        email: 'karim.mansouri@iit.edu', 
        program: 'IA & Machine Learning', 
        year: 1, 
        status: 'suspendu', 
        absences: 8,
        payments: [
            { amount: 50000, date: '2024-09-10', description: 'Acompte' }
        ],
        totalDue: 300000,
        enrollmentDate: '2024-09-05'
    },
    { 
        id: 4, 
        name: 'Leila Benmohamed', 
        email: 'leila.benmohamed@iit.edu', 
        program: 'Data Science', 
        year: 4, 
        status: 'actif', 
        absences: 0,
        payments: [
            { amount: 250000, date: '2024-01-05', description: 'Paiement complet' }
        ],
        totalDue: 250000,
        enrollmentDate: '2021-09-12'
    },
    { 
        id: 5, 
        name: 'Youssef Belkacem', 
        email: 'youssef.belkacem@iit.edu', 
        program: 'Cloud Computing', 
        year: 2, 
        status: 'actif', 
        absences: 2,
        payments: [
            { amount: 120000, date: '2024-01-20', description: 'Premier versement' }
        ],
        totalDue: 280000,
        enrollmentDate: '2023-09-18'
    }
];

let currentStudentId = null;

// DOM Elements
const tabButtons = document.querySelectorAll('.nav-tab');
const tabContents = document.querySelectorAll('.tab-content');
const addStudentBtn = document.getElementById('add-student-btn');
const addInscriptionBtn = document.getElementById('add-inscription-btn');
const addStudentModal = document.getElementById('add-student-modal');
const addAbsenceModal = document.getElementById('add-absence-modal');
const removeAbsenceModal = document.getElementById('remove-absence-modal');
const addPaymentModal = document.getElementById('add-payment-modal');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    updateDashboardStats();
    renderStudentsTable();
    renderInscriptionsList();
    renderScolariteDetails();
    renderAbsencesContent();
    
    // Tab navigation
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            setActiveTab(tabId);
        });
    });

    // Modal handlers
    addStudentBtn.addEventListener('click', () => {
        addStudentModal.classList.add('active');
    });

    addInscriptionBtn.addEventListener('click', () => {
        addStudentModal.classList.add('active');
    });

    document.getElementById('cancel-add-student').addEventListener('click', () => {
        addStudentModal.classList.remove('active');
        document.getElementById('add-student-form').reset();
    });

    document.getElementById('cancel-add-absence').addEventListener('click', () => {
        addAbsenceModal.classList.remove('active');
        document.getElementById('add-absence-form').reset();
    });

    document.getElementById('cancel-remove-absence').addEventListener('click', () => {
        removeAbsenceModal.classList.remove('active');
        document.getElementById('remove-absence-form').reset();
    });

    document.getElementById('cancel-add-payment').addEventListener('click', () => {
        addPaymentModal.classList.remove('active');
        document.getElementById('add-payment-form').reset();
    });

    // Form submissions
    document.getElementById('add-student-form').addEventListener('submit', handleAddStudent);
    document.getElementById('add-absence-form').addEventListener('submit', handleAddAbsence);
    document.getElementById('remove-absence-form').addEventListener('submit', handleRemoveAbsence);
    document.getElementById('add-payment-form').addEventListener('submit', handleAddPayment);

    // Search and filter
    document.getElementById('student-search').addEventListener('input', filterStudents);
    document.getElementById('student-status-filter').addEventListener('change', filterStudents);
});

function setActiveTab(tabId) {
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(tabId).classList.add('active');
}

function updateDashboardStats() {
    const totalStudents = students.length;
    const activeStudents = students.filter(s => s.status === 'actif').length;
    const totalAbsences = students.reduce((sum, student) => sum + student.absences, 0);
    const totalCollected = students.reduce((sum, student) => 
        sum + student.payments.reduce((pSum, payment) => pSum + payment.amount, 0), 0
    );

    document.getElementById('total-students').textContent = totalStudents;
    document.getElementById('active-students').textContent = activeStudents;
    document.getElementById('total-absences').textContent = totalAbsences;
    document.getElementById('total-collected').textContent = totalCollected.toLocaleString();
}

function renderStudentsTable() {
    const tbody = document.getElementById('students-table-body');
    const searchTerm = document.getElementById('student-search').value.toLowerCase();
    const statusFilter = document.getElementById('student-status-filter').value;
    
    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm) ||
                            student.email.toLowerCase().includes(searchTerm) ||
                            student.program.toLowerCase().includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (filteredStudents.length === 0) {
        document.getElementById('students-empty').style.display = 'block';
        tbody.innerHTML = '';
        return;
    }

    document.getElementById('students-empty').style.display = 'none';
    tbody.innerHTML = '';

    filteredStudents.forEach(student => {
        const totalPaid = student.payments.reduce((sum, payment) => sum + payment.amount, 0);
        const remaining = student.totalDue - totalPaid;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div><strong>${student.name}</strong></div>
                <div style="color: #6b7280; font-size: 0.875rem;">${student.email}</div>
                <div style="color: #9ca3af; font-size: 0.75rem; margin-top: 0.25rem;">${student.enrollmentDate}</div>
            </td>
            <td>
                <div>${student.program}</div>
                <div style="color: #6b7280; font-size: 0.875rem;">${student.year}ère année</div>
            </td>
            <td>
                <div style="font-weight: 500;">${totalPaid.toLocaleString()} / ${student.totalDue.toLocaleString()} FCFA</div>
                ${remaining > 0 ? 
                    `<div style="color: #ef4444; font-weight: 500; font-size: 0.875rem; margin-top: 0.25rem;">${remaining.toLocaleString()} FCFA restants</div>` :
                    `<div style="color: #10b981; font-weight: 500; font-size: 0.875rem; margin-top: 0.25rem;">Solde payé</div>`
                }
            </td>
            <td>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="font-weight: 500;">${student.absences}</span>
                    ${student.absences > 5 ? '<i class="fas fa-exclamation-triangle" style="color: #ef4444;"></i>' : ''}
                </div>
            </td>
            <td>
                <span class="status-badge ${student.status === 'actif' ? 'status-active' : student.status === 'suspendu' ? 'status-suspended' : 'status-graduated'}">
                    ${student.status === 'actif' ? 'Actif' : student.status === 'suspendu' ? 'Suspendu' : 'Gradué'}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn add" onclick="openAddAbsenceModal(${student.id})">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="action-btn remove" onclick="openRemoveAbsenceModal(${student.id})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <button class="action-btn pay" onclick="openAddPaymentModal(${student.id})">
                        <i class="fas fa-credit-card"></i>
                    </button>
                    <button class="action-btn edit">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderInscriptionsList() {
    const container = document.getElementById('inscriptions-list');
    container.innerHTML = '';

    students.slice(0, 8).forEach(student => {
        const studentDiv = document.createElement('div');
        studentDiv.className = 'student-item';
        studentDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <div style="width: 2.5rem; height: 2.5rem; background-color: #fee2e2; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <span style="color: #ef4444; font-weight: bold;">${student.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div>
                        <p style="font-weight: 500;">${student.name}</p>
                        <p style="color: #6b7280; font-size: 0.875rem;">${student.program} • ${student.year}ère année</p>
                    </div>
                </div>
                <div style="text-align: right;">
                    <span class="status-badge ${student.status === 'actif' ? 'status-active' : student.status === 'suspendu' ? 'status-suspended' : 'status-graduated'}">
                        ${student.status === 'actif' ? 'Actif' : student.status === 'suspendu' ? 'Suspendu' : 'Gradué'}
                    </span>
                    <p style="color: #9ca3af; font-size: 0.75rem; margin-top: 0.25rem;">${student.enrollmentDate}</p>
                </div>
            </div>
        `;
        container.appendChild(studentDiv);
    });
}

function renderScolariteDetails() {
    const container = document.getElementById('payment-details');
    container.innerHTML = '';

    students.forEach(student => {
        const totalPaid = student.payments.reduce((sum, payment) => sum + payment.amount, 0);
        const remaining = student.totalDue - totalPaid;
        
        const paymentDiv = document.createElement('div');
        paymentDiv.className = 'payment-item';
        paymentDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.75rem;">
                <div>
                    <h4 style="font-weight: 500;">${student.name}</h4>
                    <p style="color: #6b7280; font-size: 0.875rem;">${student.program}</p>
                </div>
                <div style="text-align: right;">
                    <p style="font-weight: 500;">${totalPaid.toLocaleString()} / ${student.totalDue.toLocaleString()} FCFA</p>
                    ${remaining > 0 ? 
                        `<span style="color: #ef4444; font-size: 0.875rem;">Reste: ${remaining.toLocaleString()} FCFA</span>` :
                        `<span style="color: #10b981; font-size: 0.875rem;">Solde payé</span>`
                    }
                </div>
            </div>
            ${student.payments.length > 0 ? `
                <div style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid #e5e7eb;">
                    <h5 style="font-weight: 500; color: #374151; margin-bottom: 0.5rem; font-size: 0.875rem;">Historique des paiements:</h5>
                    ${student.payments.map(payment => `
                        <div style="display: flex; justify-content: space-between; font-size: 0.875rem; margin-bottom: 0.25rem;">
                            <span>${payment.description} (${payment.date})</span>
                            <span style="font-weight: 500;">+${payment.amount.toLocaleString()} FCFA</span>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            <div style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid #e5e7eb;">
                <button onclick="openAddPaymentModal(${student.id})" style="color: #ef4444; background: none; border: none; font-size: 0.875rem; font-weight: 500; cursor: pointer;">
                    + Ajouter paiement
                </button>
            </div>
        `;
        container.appendChild(paymentDiv);
    });
}

function renderAbsencesContent() {
    const container = document.getElementById('absences-content');
    container.innerHTML = '';

    // Students with absences
    const studentsWithAbsences = students
        .filter(student => student.absences > 0)
        .sort((a, b) => b.absences - a.absences);

    if (studentsWithAbsences.length > 0) {
        studentsWithAbsences.forEach(student => {
            const absenceDiv = document.createElement('div');
            absenceDiv.className = 'absence-item';
            absenceDiv.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div style="width: 3rem; height: 3rem; background-color: #fee2e2; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                            <span style="color: #ef4444; font-weight: bold; font-size: 1.125rem;">${student.name.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <div>
                            <p style="font-weight: 500;">${student.name}</p>
                            <p style="color: #6b7280; font-size: 0.875rem;">${student.program} • ${student.year}ère année</p>
                            <p style="color: #9ca3af; font-size: 0.75rem;">Inscrit le: ${student.enrollmentDate}</p>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                            <i class="fas fa-clock" style="color: #ef4444;"></i>
                            <span style="font-weight: bold; color: #ef4444; font-size: 1.125rem;">${student.absences} absences</span>
                        </div>
                        ${student.absences > 5 ? `
                            <span style="display: inline-flex; align-items: center; gap: 0.25rem; color: #ef4444; font-weight: 500; font-size: 0.875rem; margin-bottom: 0.5rem;">
                                <i class="fas fa-exclamation-triangle"></i>
                                Alert niveau élevé
                            </span>
                        ` : ''}
                        <div style="display: flex; gap: 0.5rem;">
                            <button onclick="openAddAbsenceModal(${student.id})" style="color: #ef4444; background: #fee2e2; border: none; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.875rem; font-weight: 500; cursor: pointer;">
                                + Ajouter
                            </button>
                            <button onclick="openRemoveAbsenceModal(${student.id})" style="color: #10b981; background: #ecfdf5; border: none; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.875rem; font-weight: 500; cursor: pointer;">
                                - Retirer
                            </button>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(absenceDiv);
        });
    }

    // Students without absences
    const studentsWithoutAbsences = students.filter(student => student.absences === 0);
    if (studentsWithoutAbsences.length > 0) {
        const noAbsenceSection = document.createElement('div');
        noAbsenceSection.style.marginTop = '2rem';
        noAbsenceSection.style.paddingTop = '1.5rem';
        noAbsenceSection.style.borderTop = '1px solid #e5e7eb';
        
        const title = document.createElement('h4');
        title.textContent = 'Étudiants sans absences';
        title.style.fontWeight = '500';
        title.style.color = '#111827';
        title.style.marginBottom = '1rem';
        title.style.fontSize = '1rem';
        
        const grid = document.createElement('div');
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
        grid.style.gap = '1rem';
        
        studentsWithoutAbsences.forEach(student => {
            const studentCard = document.createElement('div');
            studentCard.style.display = 'flex';
            studentCard.style.alignItems = 'center';
            studentCard.style.gap = '0.75rem';
            studentCard.style.padding = '0.75rem';
            studentCard.style.backgroundColor = '#ecfdf5';
            studentCard.style.borderRadius = '0.5rem';
            
            const avatar = document.createElement('div');
            avatar.style.width = '2rem';
            avatar.style.height = '2rem';
            avatar.style.backgroundColor = '#d1fae5';
            avatar.style.borderRadius = '50%';
            avatar.style.display = 'flex';
            avatar.style.alignItems = 'center';
            avatar.style.justifyContent = 'center';
            
            const avatarText = document.createElement('span');
            avatarText.textContent = student.name.split(' ').map(n => n[0]).join('');
            avatarText.style.color = '#10b981';
            avatarText.style.fontWeight = 'bold';
            avatarText.style.fontSize = '0.875rem';
            
            avatar.appendChild(avatarText);
            
            const info = document.createElement('div');
            
            const name = document.createElement('p');
            name.textContent = student.name;
            name.style.fontWeight = '500';
            name.style.color = '#111827';
            name.style.fontSize = '0.875rem';
            
            const program = document.createElement('p');
            program.textContent = student.program;
            program.style.color = '#6b7280';
            program.style.fontSize = '0.75rem';
            
            info.appendChild(name);
            info.appendChild(program);
            
            studentCard.appendChild(avatar);
            studentCard.appendChild(info);
            grid.appendChild(studentCard);
        });
        
        noAbsenceSection.appendChild(title);
        noAbsenceSection.appendChild(grid);
        container.appendChild(noAbsenceSection);
    }
}

function filterStudents() {
    renderStudentsTable();
}

function handleAddStudent(e) {
    e.preventDefault();
    
    const newStudent = {
        id: students.length + 1,
        name: document.getElementById('student-name').value,
        email: document.getElementById('student-email').value,
        program: document.getElementById('student-program').value,
        year: parseInt(document.getElementById('student-year').value),
        status: document.getElementById('student-status').value,
        absences: 0,
        payments: [],
        totalDue: parseInt(document.getElementById('student-total-due').value),
        enrollmentDate: new Date().toISOString().split('T')[0]
    };

    students.push(newStudent);
    updateDashboardStats();
    renderStudentsTable();
    renderInscriptionsList();
    renderScolariteDetails();
    renderAbsencesContent();
    
    document.getElementById('add-student-form').reset();
    addStudentModal.classList.remove('active');
}

function openAddAbsenceModal(studentId) {
    currentStudentId = studentId;
    const student = students.find(s => s.id === studentId);
    document.getElementById('absence-student-name').textContent = student.name;
    addAbsenceModal.classList.add('active');
}

function openRemoveAbsenceModal(studentId) {
    currentStudentId = studentId;
    const student = students.find(s => s.id === studentId);
    document.getElementById('remove-absence-student-name').textContent = student.name;
    document.getElementById('current-absences').textContent = `Absences actuelles: ${student.absences}`;
    const countInput = document.getElementById('remove-absence-count');
    countInput.max = student.absences;
    countInput.value = Math.min(1, student.absences);
    removeAbsenceModal.classList.add('active');
}

function openAddPaymentModal(studentId) {
    currentStudentId = studentId;
    const student = students.find(s => s.id === studentId);
    const totalPaid = student.payments.reduce((sum, payment) => sum + payment.amount, 0);
    const remaining = student.totalDue - totalPaid;
    
    document.getElementById('payment-student-name').textContent = student.name;
    document.getElementById('payment-due-amount').textContent = `Montant total dû: ${student.totalDue.toLocaleString()} FCFA`;
    
    addPaymentModal.classList.add('active');
}

function handleAddAbsence(e) {
    e.preventDefault();
    
    const absenceCount = parseInt(document.getElementById('absence-count').value);
    const studentIndex = students.findIndex(s => s.id === currentStudentId);
    
    if (studentIndex !== -1) {
        students[studentIndex].absences += absenceCount;
        updateDashboardStats();
        renderStudentsTable();
        renderAbsencesContent();
    }
    
    document.getElementById('add-absence-form').reset();
    addAbsenceModal.classList.remove('active');
}

function handleRemoveAbsence(e) {
    e.preventDefault();
    
    const absenceCount = parseInt(document.getElementById('remove-absence-count').value);
    const studentIndex = students.findIndex(s => s.id === currentStudentId);
    
    if (studentIndex !== -1) {
        students[studentIndex].absences = Math.max(0, students[studentIndex].absences - absenceCount);
        updateDashboardStats();
        renderStudentsTable();
        renderAbsencesContent();
    }
    
    document.getElementById('remove-absence-form').reset();
    removeAbsenceModal.classList.remove('active');
}

function handleAddPayment(e) {
    e.preventDefault();
    
    const paymentAmount = parseInt(document.getElementById('payment-amount').value);
    const paymentDescription = document.getElementById('payment-description').value;
    const studentIndex = students.findIndex(s => s.id === currentStudentId);
    
    if (studentIndex !== -1) {
        students[studentIndex].payments.push({
            amount: paymentAmount,
            description: paymentDescription,
            date: new Date().toISOString().split('T')[0]
        });
        updateDashboardStats();
        renderStudentsTable();
        renderScolariteDetails();
    }
    
    document.getElementById('add-payment-form').reset();
    addPaymentModal.classList.remove('active');
}

// Make functions globally available for onclick handlers
window.openAddAbsenceModal = openAddAbsenceModal;
window.openRemoveAbsenceModal = openRemoveAbsenceModal;
window.openAddPaymentModal = openAddPaymentModal;