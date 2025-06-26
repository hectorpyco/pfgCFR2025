// Variables globales
let allData = [];
let filteredData = [];
let charts = {};

// Colores para gráficos
const colorPalette = [
    '#c45a10', '#d0d0d0', '#949494',
    
];

const colorPalette2 = [
    '#1e88e5', '#26a69a', '#7e57c2'
];

// Depuración: Mostrar mensajes de consola visibles en la interfaz si hay errores
window.onerror = function(message, source, lineno, colno, error) {
    const errorDiv = document.createElement('div');
    errorDiv.style.position = 'fixed';
    errorDiv.style.bottom = '10px';
    errorDiv.style.right = '10px';
    errorDiv.style.backgroundColor = '#f44336';
    errorDiv.style.color = 'white';
    errorDiv.style.padding = '10px';
    errorDiv.style.borderRadius = '5px';
    errorDiv.style.zIndex = '1000';
    errorDiv.innerHTML = `<strong>Error:</strong> ${message}<br>Línea: ${lineno}`;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
    
    return false;
};

// Función para cargar y procesar los datos del Excel (versión local)
async function loadData() {
    try {
        // Mostrar pantalla de carga
        document.getElementById('loadingOverlay').style.display = 'flex';
        
        console.log("Intentando cargar dashboard_chicho.xlsx...");
        
        // Cargar el archivo Excel usando fetch (versión local)
        const response = await fetch('./data/dashboard_chicho.xlsx');
        const excelData = await response.arrayBuffer();
        
        console.log("Archivo Excel cargado correctamente, procesando datos...");
        
        // Procesar el archivo con SheetJS
        const workbook = XLSX.read(new Uint8Array(excelData), {
            cellDates: true,
            cellNF: true,
            cellStyles: true
        });
        
        // Mostrar información sobre el libro Excel
        console.log("Información del libro Excel:");
        console.log("- Hojas disponibles:", workbook.SheetNames);
        
        // Obtener datos de la primera hoja
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        
        // Convertir a JSON con opciones para manejar fechas correctamente
        allData = XLSX.utils.sheet_to_json(sheet, {
            raw: false,
            dateNF: 'yyyy-mm-dd',
            defval: ''  // Valor por defecto para celdas vacías
        });
        
        // Validar la estructura de los datos
        validateExcelData(allData);
        
        console.log(`Datos cargados exitosamente: ${allData.length} registros`);
        console.log("Muestra de datos:", allData.slice(0, 2));
        
        // Inicializar los filtros
        initializeFilters();
        
        // Aplicar filtros iniciales (mostrar todo)
        filteredData = [...allData];
        
        // Actualizar las estadísticas y gráficos
        updateStats();
        createCharts();
        
        // Ocultar pantalla de carga
        document.getElementById('loadingOverlay').style.display = 'none';
    } catch (error) {
        console.error("Error cargando datos:", error);
        
        // Mostrar un mensaje de error más descriptivo
        let errorMessage = "Error al cargar los datos: ";
        
        if (error.message) {
            errorMessage += error.message;
        } else {
            errorMessage += "Verifique que el archivo Excel tenga el formato correcto.";
        }
        
        // Crear un elemento de alerta en la página
        const alertDiv = document.createElement('div');
        alertDiv.className = "error-message";
        alertDiv.innerHTML = `<strong>Error:</strong> ${errorMessage}<br>Asegúrate de que el archivo 'dashboard_chicho.xlsx' está en la carpeta '/data'<br><button id="retryBtn">Reintentar</button>`;
        
        // Reemplazar el contenido del dashboard con el mensaje de error
        const dashboardEl = document.getElementById('dashboard');
        dashboardEl.innerHTML = '';
        dashboardEl.appendChild(alertDiv);
        
        // Agregar opción para usar carga manual de archivo
        const fileInputContainer = document.createElement('div');
        fileInputContainer.className = "file-input-container";
        fileInputContainer.innerHTML = `
            <label for="excelFile">Cargar archivo Excel manualmente:</label>
            <input type="file" id="excelFile" accept=".xlsx, .xls">
        `;
        dashboardEl.appendChild(fileInputContainer);
        
        // Agregar evento para el input de archivo
        document.getElementById('excelFile').addEventListener('change', handleFileUpload);
        
        // Agregar evento para reintentar
        document.getElementById('retryBtn').addEventListener('click', () => {
            location.reload();
        });
        
        // Ocultar pantalla de carga
        document.getElementById('loadingOverlay').style.display = 'none';
    }
}

// Función para manejar la carga de archivos manual
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Mostrar pantalla de carga
    document.getElementById('loadingOverlay').style.display = 'flex';
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, {
                cellDates: true,
                cellNF: true,
                cellStyles: true
            });
            
            // Obtener datos de la primera hoja
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            allData = XLSX.utils.sheet_to_json(sheet, {
                raw: false,
                dateNF: 'yyyy-mm-dd',
                defval: ''
            });
            
            // Validar la estructura de los datos
            validateExcelData(allData);
            
            // Inicializar los filtros
            initializeFilters();
            
            // Aplicar filtros iniciales (mostrar todo)
            filteredData = [...allData];
            
            // Restaurar el dashboard
            document.getElementById('dashboard').innerHTML = `
                <div class="chart-container">
                    <h3 class="chart-title">Distribución por Tipo de Institución</h3>
                    <canvas id="institutionTypeChart"></canvas>
                </div>
                <div class="chart-container">
                    <h3 class="chart-title">Distribución por Género</h3>
                    <canvas id="genderChart"></canvas>
                </div>
                <div class="chart-container large-chart">
                    <h3 class="chart-title">Evolución de Títulos por Año</h3>
                    <canvas id="yearTrendChart"></canvas>
                </div>
                <div class="chart-container large-chart">
                    <h3 class="chart-title">Distribución por Género y Año</h3>
                    <canvas id="genderYearChart"></canvas>
                </div>
                <div class="chart-container">
                    <h3 class="chart-title">Top 10 Carreras</h3>
                    <canvas id="careersChart"></canvas>
                </div>
                <div class="chart-container">
                    <h3 class="chart-title">Distribución por Tipo de Gestión</h3>
                    <canvas id="managementTypeChart"></canvas>
                </div>
                <div class="chart-container large-chart">
                    <h3 class="chart-title">Top 10 Instituciones</h3>
                    <canvas id="institutionsChart"></canvas>
                </div>
                <div class="chart-container large-chart">
                    <h3 class="chart-title">Tendencia Mensual de Títulos</h3>
                    <canvas id="monthlyTrendChart"></canvas>
                </div>
            `;
            
            // Actualizar las estadísticas y gráficos
            updateStats();
            createCharts();
            
            // Ocultar pantalla de carga
            document.getElementById('loadingOverlay').style.display = 'none';
        } catch (error) {
            console.error("Error al procesar el archivo:", error);
            alert("Error al procesar el archivo: " + error.message);
            document.getElementById('loadingOverlay').style.display = 'none';
        }
    };
    
    reader.onerror = function(error) {
        console.error("Error al leer el archivo:", error);
        alert("Error al leer el archivo.");
        document.getElementById('loadingOverlay').style.display = 'none';
    };
    
    reader.readAsArrayBuffer(file);
}

// Función auxiliar para manejar casos donde los datos pueden ser inconsistentes
function safeGetProperty(obj, prop, defaultValue = '') {
    if (!obj || obj[prop] === undefined || obj[prop] === null) {
        return defaultValue;
    }
    return obj[prop];
}

// Función para comprobar si la estructura de datos del Excel es la esperada
function validateExcelData(data) {
    if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Los datos del Excel no son válidos o están vacíos");
    }
    
    // Verificar que al menos algunas propiedades clave estén presentes
    const requiredFields = ['anio', 'mes', 'carrera', 'sexo', 'tipo_institucion', 'institucion'];
    const sampleRow = data[0];
    
    const missingFields = requiredFields.filter(field => sampleRow[field] === undefined);
    if (missingFields.length > 0) {
        console.warn(`Advertencia: Faltan algunos campos esperados en los datos: ${missingFields.join(', ')}`);
        alert(`Advertencia: El archivo Excel no tiene todos los campos esperados. Algunas visualizaciones pueden no funcionar correctamente. Campos faltantes: ${missingFields.join(', ')}`);
    }
    
    return true;
}

// Inicializar filtros
function initializeFilters() {
    console.log("Inicializando filtros con datos reales");
    
    // Filtros por año (desde y hasta)
    const yearFilterFrom = document.getElementById('yearFilterFrom');
    const yearFilterTo = document.getElementById('yearFilterTo');
    
    // Limpiar opciones existentes
    yearFilterFrom.innerHTML = '<option value="all">Desde</option>';
    yearFilterTo.innerHTML = '<option value="all">Hasta</option>';
    
    // Obtener años ordenados
    const years = [...new Set(allData.map(item => item.anio))].sort((a, b) => a - b);
    
    // Llenar ambos selectores con los años disponibles
    years.forEach(year => {
        // Para el filtro "desde"
        const optionFrom = document.createElement('option');
        optionFrom.value = year;
        optionFrom.textContent = year;
        yearFilterFrom.appendChild(optionFrom);
        
        // Para el filtro "hasta"
        const optionTo = document.createElement('option');
        optionTo.value = year;
        optionTo.textContent = year;
        yearFilterTo.appendChild(optionTo);
    });
    
    // Filtro por tipo de institución
    const institutionTypeFilter = document.getElementById('institutionTypeFilter');
    institutionTypeFilter.innerHTML = '<option value="all">Todos los tipos</option>'; // Limpiar opciones existentes
    const institutionTypes = [...new Set(allData.map(item => item.tipo_institucion))].sort();
    institutionTypes.forEach(type => {
        if (type) { // Verificar que no sea undefined o null
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            institutionTypeFilter.appendChild(option);
        }
    });
    
    // Filtro por carrera
    const careerFilter = document.getElementById('careerFilter');
    careerFilter.innerHTML = '<option value="all">Todas las carreras</option>'; // Limpiar opciones existentes
    const careers = [...new Set(allData.map(item => item.carrera))].sort();
    careers.forEach(career => {
        if (career) { // Verificar que no sea undefined o null
            const option = document.createElement('option');
            option.value = career;
            option.textContent = career;
            careerFilter.appendChild(option);
        }
    });
    
    // Filtro por tipo de gestión
    const managementTypeFilter = document.getElementById('managementTypeFilter');
    managementTypeFilter.innerHTML = '<option value="all">Todos los tipos</option>'; // Limpiar opciones existentes
    const managementTypes = [...new Set(allData.map(item => item.tipo_gestion))].sort();
    managementTypes.forEach(type => {
        if (type) { // Verificar que no sea undefined o null
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            managementTypeFilter.appendChild(option);
        }
    });
    
    // Evento para aplicar filtros
    document.getElementById('applyFilters').addEventListener('click', applyFilters);
}

// Aplicar filtros
function applyFilters() {
    const yearFilterFrom = document.getElementById('yearFilterFrom').value;
    const yearFilterTo = document.getElementById('yearFilterTo').value;
    const institutionTypeFilter = document.getElementById('institutionTypeFilter').value;
    const careerFilter = document.getElementById('careerFilter').value;
    const managementTypeFilter = document.getElementById('managementTypeFilter').value;
    const genderFilter = document.getElementById('genderFilter').value;
    
    // Mostrar los filtros seleccionados en la consola para depuración
    console.log("Filtros aplicados:", {
        añoDesde: yearFilterFrom,
        añoHasta: yearFilterTo,
        tipoInstitución: institutionTypeFilter,
        carrera: careerFilter,
        tipoGestión: managementTypeFilter,
        género: genderFilter
    });
    
    // Aplicar el filtrado de datos
    filteredData = allData.filter(item => {
        // Filtro de año con rango desde-hasta
        const yearMatch = (yearFilterFrom === 'all' || (item.anio && item.anio >= parseInt(yearFilterFrom))) &&
                        (yearFilterTo === 'all' || (item.anio && item.anio <= parseInt(yearFilterTo)));
        
        return yearMatch &&
               (institutionTypeFilter === 'all' || item.tipo_institucion === institutionTypeFilter) &&
               (careerFilter === 'all' || item.carrera === careerFilter) &&
               (managementTypeFilter === 'all' || item.tipo_gestion === managementTypeFilter) &&
               (genderFilter === 'all' || item.sexo === genderFilter);
    });
    
    console.log(`Datos filtrados: ${filteredData.length} registros de ${allData.length} totales`);
    
    // Actualizar estadísticas y gráficos
    updateStats();
    updateCharts();
}

// Actualizar estadísticas principales
function updateStats() {
    const statsContainer = document.getElementById('statsContainer');
    statsContainer.innerHTML = '';
    
    // Total de títulos
    const totalTitles = filteredData.length;
    
    // Total por género
    const genderCounts = {};
    filteredData.forEach(item => {
        genderCounts[item.sexo] = (genderCounts[item.sexo] || 0) + 1;
    });
    
    // Total por tipo de institución
    const institutionTypeCounts = {};
    filteredData.forEach(item => {
        institutionTypeCounts[item.tipo_institucion] = (institutionTypeCounts[item.tipo_institucion] || 0) + 1;
    });
    
    // Total de carreras únicas
    const uniqueCareers = new Set(filteredData.map(item => item.carrera)).size;
    
    // Crear tarjetas de estadísticas
    createStatCard(statsContainer, 'Total de Títulos', totalTitles);
    createStatCard(statsContainer, 'Mujeres', genderCounts['MUJER'] || 0);
    createStatCard(statsContainer, 'Hombres', genderCounts['HOMBRE'] || 0);
    createStatCard(statsContainer, 'Carreras Únicas', uniqueCareers);
}

// Crear tarjeta de estadística
function createStatCard(container, label, value) {
    const card = document.createElement('div');
    card.className = 'stat-card';
    
    const valueEl = document.createElement('div');
    valueEl.className = 'stat-value';
    valueEl.textContent = value.toLocaleString();
    
    const labelEl = document.createElement('div');
    labelEl.className = 'stat-label';
    labelEl.textContent = label;
    
    card.appendChild(valueEl);
    card.appendChild(labelEl);
    container.appendChild(card);
}

// Crear todos los gráficos
function createCharts() {
    createInstitutionTypeChart();
    createGenderChart();
    createYearTrendChart();
    createGenderYearChart();
    createCareersChart();
    createManagementTypeChart();
    createInstitutionsChart();
    createMonthlyTrendChart();
}

// Actualizar todos los gráficos
function updateCharts() {
    // Destruir gráficos existentes para recrearlos
    Object.values(charts).forEach(chart => chart.destroy());
    charts = {};
    
    // Recrear todos los gráficos
    createCharts();
}

// Crear gráfico de tipo de institución
function createInstitutionTypeChart() {
    const ctx = document.getElementById('institutionTypeChart').getContext('2d');
    
    // Contar por tipo de institución
    const counts = {};
    filteredData.forEach(item => {
        counts[item.tipo_institucion] = (counts[item.tipo_institucion] || 0) + 1;
    });
    
    const labels = Object.keys(counts);
    const data = Object.values(counts);
    
    charts.institutionType = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colorPalette2,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            }
        }
    });
}

// Crear gráfico de género
function createGenderChart() {
    const ctx = document.getElementById('genderChart').getContext('2d');
    
    // Contar por género
    const counts = {};
    filteredData.forEach(item => {
        counts[item.sexo] = (counts[item.sexo] || 0) + 1;
    });
    
    const labels = Object.keys(counts);
    const data = Object.values(counts);
    
    charts.gender = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: ['rgba(255,201,219,255)', 'rgba(136,167,217,255)'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            }
        }
    });
}

// Crear gráfico de tendencia por año
function createYearTrendChart() {
    const ctx = document.getElementById('yearTrendChart').getContext('2d');
    
    // Contar por año
    const counts = {};
    filteredData.forEach(item => {
        if (item.anio) { // Verificar que exista el año
            counts[item.anio] = (counts[item.anio] || 0) + 1;
        }
    });
    
    // Ordenar por año
    const sortedYears = Object.keys(counts).sort((a, b) => a - b);
    const data = sortedYears.map(year => counts[year]);
    
    charts.yearTrend = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sortedYears,
            datasets: [{
                label: 'Número de Títulos',
                data: data,
                borderColor: '#c45a10',
                backgroundColor: 'rgba(196,90,16,0.1)',
                fill: true,
                tension: 0.1,
                borderWidth: 2,
                pointRadius: 4,
                pointBackgroundColor: '#c45a10'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Número de Títulos'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Año'
                    }
                }
            }
        }
    });
}

// Crear gráfico de género por año
function createGenderYearChart() {
    const ctx = document.getElementById('genderYearChart').getContext('2d');
    
    // Contar por año y género
    const countsByYearAndGender = {};
    filteredData.forEach(item => {
        if (!item.anio || !item.sexo) return; // Omitir registros sin año o género
        
        const year = item.anio;
        const gender = item.sexo;
        
        if (!countsByYearAndGender[year]) {
            countsByYearAndGender[year] = {};
        }
        
        countsByYearAndGender[year][gender] = (countsByYearAndGender[year][gender] || 0) + 1;
    });
    
    // Ordenar por año
    const sortedYears = Object.keys(countsByYearAndGender).sort((a, b) => a - b);
    
    // Preparar datos para mujer y hombre
    const womenData = sortedYears.map(year => countsByYearAndGender[year]['MUJER'] || 0);
    const menData = sortedYears.map(year => countsByYearAndGender[year]['HOMBRE'] || 0);
    
    charts.genderYear = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedYears,
            datasets: [
                {
                    label: 'Mujeres',
                    data: womenData,
                    backgroundColor: 'rgba(255,201,219,255)',
                    borderColor: '#ff7043',
                    borderWidth: 1
                },
                {
                    label: 'Hombres',
                    data: menData,
                    backgroundColor: 'rgba(136,167,217,255)',
                    borderColor: '#26a69a',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Número de Títulos'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Año'
                    }
                }
            }
        }
    });
}

function createCareersChart() {
    const ctx = document.getElementById('careersChart').getContext('2d');
    
    // Contar por carrera
    const counts = {};
    filteredData.forEach(item => {
        if (item.carrera) {
            counts[item.carrera] = (counts[item.carrera] || 0) + 1;
        }
    });
    
    // Ordenar y obtener top 10
    const sortedCareers = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    
    const labels = sortedCareers.map(item => item[0]);
    const data = sortedCareers.map(item => item[1]);
    
    // Acortar nombres largos de carreras para visualización
    const shortLabels = labels.map(label => {
        if (label.length > 25) {
            return label.substring(0, 22) + '...';
        }
        return label;
    });
    
    // Destruir el gráfico si ya existe
    if (charts.careers) {
        charts.careers.destroy();
    }
    
    // Crear el gráfico horizontal de barras
    charts.careers = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: shortLabels,
            datasets: [{
                label: 'Número de Títulos',
                data: data,
                backgroundColor: '#c45a10',  
                borderColor: '#c45a10',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',  
            responsive: true,
            maintainAspectRatio: false,  
            layout: {
                padding: {
                    left: 10,
                    right: 30,
                    top: 0,
                    bottom: 0
                }
            },
            plugins: {
                legend: {
                    display: false  
                },
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                                            const index = tooltipItems[0].dataIndex;
                            return labels[index];
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Número de Títulos',
                        font: {
                            size: 11
                        }
                    },
                    grid: {
                        display: true,
                        color: "rgba(0, 0, 0, 0.05)"
                    }
                },
                y: {
                    ticks: {
                        font: {
                            size: 10  
                        },
                        color: '#333'
                    },
                    grid: {
                        display: false  
                    }
                }
            }
        }
    });
}

// Crear gráfico de tipo de gestión
function createManagementTypeChart() {
    const ctx = document.getElementById('managementTypeChart').getContext('2d');
    
    // Contar por tipo de gestión
    const counts = {};
    filteredData.forEach(item => {
        if (item.tipo_gestion) {
            counts[item.tipo_gestion] = (counts[item.tipo_gestion] || 0) + 1;
        }
    });
    
    const labels = Object.keys(counts);
    const data = Object.values(counts);
    
    charts.managementType = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colorPalette,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            }
        }
    });
}

// Crear gráfico de top instituciones
function createInstitutionsChart() {
    const ctx = document.getElementById('institutionsChart').getContext('2d');
    
    // Contar por institución
    const counts = {};
    filteredData.forEach(item => {
        if (item.institucion) {
            counts[item.institucion] = (counts[item.institucion] || 0) + 1;
        }
    });
    
    // Ordenar y obtener top 10
    const sortedInstitutions = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    
    const labels = sortedInstitutions.map(item => item[0]);
    const data = sortedInstitutions.map(item => item[1]);
    
    // Acortar nombres largos de instituciones para visualización
    const shortLabels = labels.map(label => {
        if (label.length > 30) {
            return label.substring(0, 27) + '...';
        }
        return label;
    });
    
    charts.institutions = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: shortLabels,
            datasets: [{
                label: 'Número de Títulos',
                data: data,
                backgroundColor: 'rgba(196,90,16,255)',
                borderColor: '#ffa726',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            // Mostrar el nombre completo en el tooltip
                            const index = tooltipItems[0].dataIndex;
                            return labels[index];
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Número de Títulos'
                    }
                }
            }
        }
    });
}

// Crear gráfico de tendencia mensual
function createMonthlyTrendChart() {
    const ctx = document.getElementById('monthlyTrendChart').getContext('2d');
    
    // Contar por año y mes
    const countsByYearMonth = {};
    filteredData.forEach(item => {
        if (!item.anio || !item.mes) return;
        
        const year = item.anio;
        const month = item.mes;
        const yearMonth = `${year}-${month.toString().padStart(2, '0')}`;
        
        countsByYearMonth[yearMonth] = (countsByYearMonth[yearMonth] || 0) + 1;
    });
    
    // Ordenar por año y mes
    const sortedYearMonths = Object.keys(countsByYearMonth).sort();
    const data = sortedYearMonths.map(yearMonth => countsByYearMonth[yearMonth]);
    
    // Formatear etiquetas para mostrar solo cada 6 meses por legibilidad
    const formattedLabels = sortedYearMonths.map((yearMonth, index) => {
        if (index % 6 === 0) {
            return yearMonth;
        }
        return '';
    });
    
    charts.monthlyTrend = new Chart(ctx, {
        type: 'line',
        data: {
            labels: formattedLabels,
            datasets: [{
                label: 'Número de Títulos por Mes',
                data: data,
                borderColor: '#c45a10',
                backgroundColor: 'rgba(196,90,16,0.1)',
                fill: true,
                tension: 0.1,
                borderWidth: 1,
                pointRadius: 2,
                pointBackgroundColor: '#c45a10'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            // Mostrar el año-mes en el tooltip
                            const index = tooltipItems[0].dataIndex;
                            const yearMonth = sortedYearMonths[index];
                            const [year, month] = yearMonth.split('-');
                            const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                            return `${monthNames[parseInt(month) - 1]} ${year}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Número de Títulos'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Año-Mes'
                    }
                }
            }
        }
    });
}

// Cargar datos al iniciar
window.addEventListener('DOMContentLoaded', loadData);