
document.addEventListener("DOMContentLoaded", function () {
    // Seleccionar todos los elementos textarea
    const textareas = document.querySelectorAll("textarea");

    // Añadir un evento de entrada a cada textarea
    textareas.forEach((textarea) => {
        textarea.addEventListener("input", function () {
            // Establecer la altura del textarea en 'auto' para calcular la altura correcta
            this.style.height = "auto";
            // Establecer la altura del textarea en su scrollHeight para ajustar la altura
            this.style.height = this.scrollHeight + "px";
        });
    });

    document.getElementById("archivoPDF").addEventListener("change", function (event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {

            const base64String = e.target.result.split(',')[1];

            const inputNamePdf = document.getElementById('archivoNamePDF');
            const inputBase64Pdf = document.getElementById('archivoBase64PDF');

            inputNamePdf.value = file.name;
            inputBase64Pdf.value = base64String;
        }

        reader.readAsDataURL(file);
    });

});



// Selecciona todos los textareas con la clase "auto-numbering"
const textareas = document.querySelectorAll('.auto-numbering');

textareas.forEach(textarea => {
    textarea.addEventListener('keydown', function (event) {
        // Verifica si la tecla presionada es "Enter"
        if (event.key === 'Enter') {
            // Evita que se añada un salto de línea en el textarea
            event.preventDefault();

            // Obtiene el valor actual del textarea
            let currentValue = this.value;

            // Divide el valor actual en líneas
            const lines = currentValue.split('\n');

            // Verifica si el textarea está vacío o tiene solo espacios en blanco
            if (currentValue.trim() === '') {
                // Si está vacío o tiene solo espacios en blanco, inicializa con el número 1
                currentValue = '1.';
            } else {
                // Encuentra el número actual en la última línea
                const lastLine = lines[lines.length - 1];
                const match = lastLine.match(/^\d+\./);

                // Si la última línea ya tiene un número, aumenta en uno
                if (match) {
                    const currentNumber = parseInt(match[0]);
                    const nextNumber = currentNumber + 1;
                    lines.push(nextNumber + '.');
                } else {
                    // Si no hay un número en la última línea, añade el número 1
                    lines.push('2.');
                }

                // Actualiza el valor del textarea con las líneas actualizadas
                currentValue = lines.join('\n');
            }

            // Actualiza el valor del textarea
            this.value = currentValue;

            // Pone el cursor al final del textarea
            this.scrollTop = this.scrollHeight;
        }
    });
});


var signaturePad1 = new SignaturePad(document.getElementById('signature-pad1'), {
    backgroundColor: 'rgba(255, 255, 255, 0)',
    penColor: 'rgb(0, 0, 0)'
});

var clearButton1 = document.getElementById('clear1');

clearButton1.addEventListener('click', function (event) {
    signaturePad1.clear();
});

var signaturePad2 = new SignaturePad(document.getElementById('signature-pad2'), {
    backgroundColor: 'rgba(255, 255, 255, 0)',
    penColor: 'rgb(0, 0, 0)'
});

var clearButton2 = document.getElementById('clear2');

clearButton2.addEventListener('click', function (event) {
    signaturePad2.clear();
});
