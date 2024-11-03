document.addEventListener('DOMContentLoaded', () => {
    const complaintsContainer = document.getElementById('complaintsContainer');

    const loadComplaints = () => {
        complaintsContainer.innerHTML = '';
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('complaint_')) {
                const complaint = JSON.parse(localStorage.getItem(key));
                const complaintDiv = document.createElement('div');
                complaintDiv.className = 'complaint';
                complaintDiv.innerHTML = `
                    <p>رقم حساب المشرف: ${complaint.supervisorAccount}</p>
                    <p>اسم المشرف: ${complaint.supervisorName}</p>
                    <p>رقم حساب المندوب: ${complaint.representativeAccount}</p>
                    <p>اسم المندوب: ${complaint.representativeName}</p>
                    <p>رقم حساب التاجر: ${complaint.traderAccount}</p>
                    <p>رقم العملية: ${complaint.operationNumber}</p>
                    <p>ملاحظة: ${complaint.note}</p>
                    <p>رد: ${complaint.reply || 'لا يوجد رد'}</p>
                    <button class="replyButton" data-key="${key}">رد على الشكوى</button>
                    <button class="deleteButton" data-key="${key}">حذف الشكوى</button>
                `;
                complaintsContainer.appendChild(complaintDiv);
            }
        });

        document.querySelectorAll('.deleteButton').forEach(button => {
            button.addEventListener('click', event => {
                localStorage.removeItem(event.target.dataset.key);
                loadComplaints();
            });
        });

        document.querySelectorAll('.replyButton').forEach(button => {
            button.addEventListener('click', event => {
                const reply = prompt('اكتب الرد على الشكوى:');
                if (reply) {
                    const complaint = JSON.parse(localStorage.getItem(event.target.dataset.key));
                    complaint.reply = reply;
                    localStorage.setItem(event.target.dataset.key, JSON.stringify(complaint));
                    loadComplaints();
                }
            });
        });
    };

    loadComplaints();
});
