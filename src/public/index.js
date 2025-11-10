window.deleteIdea = async function (id) {
    try {
        const response = await fetch(`/delete/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.redirect) {
            window.location = result.redirect;
        }

    } catch (err) {
        console.error('Erro ao deletar ideia:', err);
        window.location = '/centro';
    }
};


window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('#flash-container sl-alert').forEach(alert => {
        alert.toast();
    });
});