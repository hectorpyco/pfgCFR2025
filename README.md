# Evaluación Descriptiva de la Oferta Académica y Egreso en Carreras del Área de Salud: Una Aproximación desde Data Analytics

## Descriptive Evaluation of Academic Offerings and Graduation in Health-Related Careers: A Data Analytics Approach

Este repositorio contiene el código y los recursos asociados al Proyecto Final de Grado (PFG) de Ingeniería Informática, desarrollado para la Facultad de Ciencias y Tecnologías (FCyT) de la Universidad Nacional de Caaguazú (UNCA). El proyecto aborda la problemática de la fragmentación de información sobre la educación superior en salud en Paraguay, utilizando análisis de datos para generar una visión integral del sector.

---

## 📄 Resumen del Proyecto

Este estudio se enfoca en el análisis descriptivo de la oferta académica y las tasas de egreso en carreras del área de la salud dentro del sistema de educación superior paraguayo. Mediante la aplicación de técnicas de **Data Analytics** sobre datos abiertos, se busca comprender el panorama actual de la formación de profesionales de la salud, identificando tendencias, patrones y posibles disparidades.

La investigación contribuye directamente a los Objetivos de Desarrollo Sostenible (ODS) de la Agenda 2030, específicamente al **ODS 3: Salud y Bienestar** (fortalecimiento de la fuerza laboral en salud y cobertura universal) y al **ODS 4: Educación de Calidad** (acceso equitativo a la educación superior).

### 🎯 Objetivos

**Objetivo General:**
* Analizar descriptivamente la oferta académica y egreso en carreras de Medicina del Paraguay mediante técnicas de Data Analytics aplicadas a datos abiertos del sistema de educación superior.

**Objetivos Específicos:**
* Diseñar e implementar un pipeline para el procesamiento y limpieza de datos.
* Aplicar métodos estadísticos y técnicas de análisis descriptivo para caracterizar los patrones en la oferta académica y las tasas de egreso en carreras del área de Salud.
* Desarrollar gráficos y visualizaciones interactivas que integren los resultados obtenidos.

---

## ✨ Características Principales

* **Análisis Descriptivo:** Caracterización de la oferta académica y las tasas de egreso en el sector salud paraguayo.
* **Datos Abiertos:** Utilización de fuentes de datos oficiales y de acceso público para asegurar la transparencia y reproducibilidad.
* **Pipeline de Procesamiento:** Implementación de un flujo modular para la limpieza, transformación y agrupamiento de datos.
* **Dashboard Interactivo:** Visualización dinámica de los resultados que permite a los usuarios explorar los hallazgos mediante filtros y gráficos interactivos.

---

## 📊 Metodología y Fuentes de Datos

La investigación se enmarcó en un enfoque **cuantitativo, descriptivo y no experimental**, fundamentado en el análisis de datos secundarios (Hernández-Sampieri y otros, 2014). Este enfoque permitió la recopilación y análisis de grandes volúmenes de datos numéricos para identificar patrones y tendencias, sin manipulación de variables, describiendo el fenómeno educativo en su contexto natural. El estudio buscó caracterizar la oferta educativa y el egreso en salud en Paraguay, proporcionando información actualizada y organizada.

### Fuentes de Datos
Los datos provienen de fuentes oficiales del Ministerio de Educación y Ciencias (MEC) de Paraguay:
* **Registro Nacional de Carreras (RNC):** Información sobre carreras de grado y posgrado habilitadas, incluyendo detalles institucionales, geográficos y de clasificación.
* **Registro Nacional de Títulos de Educación Superior (RTES):** Datos oficiales sobre egresados registrados anualmente desde 2012, incluyendo nombre, carrera, institución y sexo.

### Instrumentos y Tecnologías
* **Python:** Lenguaje de programación principal para el procesamiento y análisis de datos.
    * **Polars:** Biblioteca para manipulación eficiente de grandes volúmenes de datos.
    * **gender-guesser:** Biblioteca utilizada para la inferencia de género a partir de los nombres de los egresados.
* **Microsoft Excel:** Herramienta utilizada para la organización inicial y creación de tablas dinámicas y gráficos.
* **Tecnologías Web (HTML, CSS, JavaScript):** Para el desarrollo del dashboard interactivo.

### Pipeline de Procesamiento
Se implementó un flujo de trabajo modular, dividiendo el análisis en fases claras y exportando resultados intermedios. Esta decisión garantizó transparencia, trazabilidad, facilidad de revisión y replicabilidad del estudio. Los pasos principales incluyeron:
1.  Descarga y preparación de datasets.
2.  Filtrado de datos relacionados con el área de salud.
3.  Agrupamiento temático de carreras.
4.  Inferencia de género.
5.  Incorporación del tipo de gestión institucional.
6.  Limpieza de formatos y normalización de datos.
7.  Análisis descriptivo y generación de visualizaciones.

#### Visualización de Resultados

La visualización de datos fue crucial para comunicar los hallazgos. Se utilizaron tablas dinámicas y gráficos generados en Microsoft Excel. Posteriormente, se desarrolló un **dashboard interactivo** utilizando tecnologías web (HTML, CSS y JavaScript), disponible públicamente en [https://hectorpyco.github.io/pfgCFR2025/](https://hectorpyco.github.io/pfgCFR2025/). Este dashboard permite la exploración dinámica de los datos mediante filtros por año, tipo de institución, carrera, género y tipo de gestión, incluyendo diversas representaciones gráficas para facilitar la interpretación de los patrones y tendencias identificados.

---

## 🔑 Hallazgos Clave (Ejemplos)

El análisis reveló insights significativos sobre el sistema de formación sanitaria en Paraguay, incluyendo:
* **Marcada Privatización:** Un alto porcentaje de títulos proviene del sector privado.
* **Feminización Significativa:** Predominancia de mujeres entre los egresados.
* **Concentración Geográfica:** La oferta académica se concentra en un número limitado de departamentos.
* **Predominio de Enfermería:** Enfermería supera a Medicina en el número de títulos otorgados, estableciendo una proporción de enfermeros por cada médico.
* **Disparidades Institucionales:** Diferencias notables entre instituciones en términos de oferta académica y producción de egresados.

---

## 📁 Estructura del Repositorio

* `data/`: Contiene los datasets originales y los archivos procesados intermedios.
* `scripts/`: Scripts Python utilizados para el procesamiento, limpieza y análisis de datos.
* `dashboard/`: Archivos HTML, CSS y JavaScript del dashboard interactivo.
* `docs/`: Documentación adicional o informes.
* `output/`: Resultados finales, tablas y gráficos generados.
* `README.md`: Este archivo.

---

## 🎓 Autor

**Carlos Federico Rodríguez Fernandez**
* **Correo Electrónico:** [cfrodriguez@fctunca.edu.py](mailto:cfrodriguez@fctunca.edu.py)
* **Grado:** Egresado de Ingeniería Informática
* **Institución:** Facultad de Ciencias y Tecnologías (FCyT), Universidad Nacional de Caaguazú (UNCA)
* **Año de Graduación:** 2025

---

## 👨‍🏫 Tutor del Proyecto

**Hector Ramiro Estigarribia Barreto**
* **Correo Electrónico:** [hestigarribia64@fctunca.edu.py](mailto:hestigarribia64@fctunca.edu.py)
* **Nota:** Este repositorio se encuentra alojado en el perfil de GitHub del tutor.

---

## 📄 Licencia

Este proyecto está bajo la Licencia Creative Commons Atribución-NoComercial 2.0 Genérica (CC BY-NC 2.0).
Puedes encontrar el texto completo de la licencia aquí:
[https://creativecommons.org/licenses/by-nc/2.0/deed.es](https://creativecommons.org/licenses/by-nc/2.0/deed.es)

---

## 🙏 Agradecimientos

Agradecimientos a la Universidad Nacional de Caaguazú (UNCA) y a la Facultad de Ciencias y Tecnologías (FCyT) por el apoyo brindado en la realización de este proyecto.

---
```