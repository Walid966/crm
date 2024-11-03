document.addEventListener('DOMContentLoaded', () => {
    const supervisorAccountSelect = document.getElementById('supervisorAccount');
    const supervisorNameInput = document.getElementById('supervisorName');
    const representativeAccountSelect = document.getElementById('representativeAccount');
    const representativeNameInput = document.getElementById('representativeName');
    const serviceTypeSelect = document.getElementById('serviceType');
    const subServiceSelect = document.getElementById('subService');
    const receivedRepliesDiv = document.getElementById('receivedReplies');

    // Load supervisors and representatives from JSON file
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            // Populate supervisor accounts
            data.supervisors.forEach(supervisor => {
                const option = document.createElement('option');
                option.value = supervisor.accountNumber;
                option.text = supervisor.accountNumber;
                supervisorAccountSelect.appendChild(option);
            });

            // Populate representatives
            const representatives = data.representatives;

            supervisorAccountSelect.addEventListener('change', () => {
                const selectedSupervisor = data.supervisors.find(supervisor => supervisor.accountNumber === supervisorAccountSelect.value);
                supervisorNameInput.value = selectedSupervisor ? selectedSupervisor.name : '';
                
                representativeAccountSelect.innerHTML = '<option value="" selected>اختر رقم حساب المندوب</option>';
                representativeAccountSelect.disabled = !selectedSupervisor;
                
                if (selectedSupervisor) {
                    selectedSupervisor.representatives.forEach(repAccount => {
                        const rep = representatives.find(rep => rep.accountNumber === repAccount);
                        if (rep) {
                            const option = document.createElement('option');
                            option.value = rep.accountNumber;
                            option.text = rep.accountNumber;
                            representativeAccountSelect.appendChild(option);
                        }
                    });
                }

                representativeAccountSelect.value = '';
                representativeNameInput.value = '';
            });

            representativeAccountSelect.addEventListener('change', () => {
                const selectedRepresentative = representatives.find(rep => rep.accountNumber === representativeAccountSelect.value);
                representativeNameInput.value = selectedRepresentative ? selectedRepresentative.name : '';
            });

            // Load service types from services.json
            fetch('services.json')
                .then(response => response.json())
                .then(serviceTypes => {
                    // Populate service types
                    serviceTypes.forEach(service => {
                        const option = document.createElement('option');
                        option.value = service.type;
                        option.text = service.type;
                        serviceTypeSelect.appendChild(option);
                    });
                    
                    // Add event listener for service types
                    serviceTypeSelect.addEventListener('change', () => {
                        const selectedService = serviceTypes.find(service => service.type === serviceTypeSelect.value);
                        subServiceSelect.innerHTML = '<option value="" selected>اختر الخدمة الفرعية</option>';
                        subServiceSelect.disabled = !selectedService;

                        if (selectedService) {
                            selectedService.subServices.forEach(subService => {
                                const option = document.createElement('option');
                                option.value = subService;
                                option.text = subService;
                                subServiceSelect.appendChild(option);
                            });
                        }

                        subServiceSelect.value = '';
                    });
                })
                .catch(error => console.error('Error loading service types:', error));
        })
        .catch(error => console.error('Error loading data:', error));

    document.getElementById('complaintForm').addEventListener('submit', event => {
        event.preventDefault();
        const formData = new FormData(event.target);
        localStorage.setItem('complaint_' + Date.now(), JSON.stringify(Object.fromEntries(formData.entries())));
        alert('تم إرسال الشكوى بنجاح');
        loadReplies();  // Reload replies after a new complaint is added
    });

    const loadReplies = () => {
        receivedRepliesDiv.innerHTML = '';
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('complaint_')) {
                const complaint = JSON.parse(localStorage.getItem(key));
                if (complaint.reply) {
                    const replyDiv = document.createElement('div');
                    replyDiv.className = 'reply';
                    replyDiv.innerHTML = `
                        <p><strong>رقم الشكوى:</strong> ${key}</p>
                        <p><strong>الرد:</strong> ${complaint.reply}</p>
                        <button class="deleteReplyButton" data-key="${key}">حذف الرد</button>
                    `;
                    receivedRepliesDiv.appendChild(replyDiv);
                }
            }
        });

        document.querySelectorAll('.deleteReplyButton').forEach(button => {
            button.addEventListener('click', event => {
                const key = event.target.dataset.key;
                const complaint = JSON.parse(localStorage.getItem(key));
                delete complaint.reply;
                localStorage.setItem(key, JSON.stringify(complaint));
                loadReplies();  // Reload replies after a reply is deleted
            });
        });
    };

    loadReplies();
});
