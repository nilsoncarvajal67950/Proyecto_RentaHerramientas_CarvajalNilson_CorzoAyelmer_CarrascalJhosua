
import App from './components/App.js';

document.addEventListener('DOMContentLoaded', () => {

    const app = new App();


    showToast('Bienvenido a AlkileApp', 'info');
});


window.showToast = function (message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = '';
    switch (type) {
        case 'success':
            icon = '<i class="fas fa-check-circle toast-icon"></i>';
            break;
        case 'error':
            icon = '<i class="fas fa-exclamation-circle toast-icon"></i>';
            break;
        case 'warning':
            icon = '<i class="fas fa-exclamation-triangle toast-icon"></i>';
            break;
        default:
            icon = '<i class="fas fa-info-circle toast-icon"></i>';
    }

    toast.innerHTML = `${icon}<span>${message}</span>`;
    toastContainer.appendChild(toast);


    setTimeout(() => {
        toast.remove();
    }, 3000);
};


window.showToast = (message, type = "success") => {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 5000);
};

window.navigateToPage = (pageId) => {

    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });


    const page = document.getElementById(pageId);
    if (page) {
        page.classList.add('active');
    }


    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.page === pageId);
    });
};

window.showLoading = (show) => {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.style.display = show ? 'flex' : 'none';
    }
};


window.showLoading = function (show = true) {
    document.getElementById('loading-spinner').style.display = show ? 'flex' : 'none';
};