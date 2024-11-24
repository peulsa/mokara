import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, get, child } from "firebase/database";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC8Tol5jT4jNW6hF3UXQ6GLmgALvyLOXlA",
  authDomain: "mokara-27.firebaseapp.com",
  projectId: "mokara-27",
  storageBucket: "mokara-27.firebasestorage.app",
  messagingSenderId: "485132268141",
  appId: "1:485132268141:web:376444960dbf2051a40564",
  measurementId: "G-L3MH7DMVDX"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Datos de la planta (inicialmente vacíos)
let temperature = 25;
let humidity = 60;
let plantStatus = "Saludable"; // El estado de la planta

// Actualizar la planta con datos aleatorios cada 5 segundos
function updatePlantData() {
  temperature = Math.floor(Math.random() * (35 - 15 + 1)) + 15; // Entre 15°C y 35°C
  humidity = Math.floor(Math.random() * (100 - 30 + 1)) + 30;    // Entre 30% y 100%
  plantStatus = (humidity > 50) ? "Saludable" : "Seca"; // Ejemplo de estado según humedad

  console.log(`Datos de planta actualizados: Temperatura: ${temperature}°C, Humedad: ${humidity}%, Estado: ${plantStatus}`);

  // Actualizar los valores mostrados en el HTML
  document.getElementById("plantTemperature").innerText = temperature;
  document.getElementById("plantHumidity").innerText = humidity;
  document.getElementById("plantStatus").innerText = plantStatus;
}

// Llamar a la función cada 5 segundos para actualizar los datos de la planta
setInterval(updatePlantData, 5000);

// Función para registrar el riego programado
function scheduleIrrigation(event) {
  event.preventDefault(); // Evitar el comportamiento por defecto del formulario

  const irrigationDate = document.getElementById("irrigationDate").value;
  const irrigationTime = document.getElementById("irrigationTime").value;

  if (!irrigationDate || !irrigationTime) {
    alert("Por favor seleccione la fecha y hora.");
    return;
  }

  // Guardar la programación de riego en Firebase
  const irrigationRef = ref(database, 'irrigation_schedule');
  push(irrigationRef, {
    irrigationDate,
    irrigationTime
  }).then(() => {
    console.log("Programación de riego guardada.");
  }).catch((error) => {
    console.error("Error al guardar la programación de riego:", error);
  });

  // Guardar los datos del histórico de riego
  const historicRef = ref(database, 'historic_records');
  push(historicRef, {
    temperature,
    humidity,
    irrigation: { date: irrigationDate, time: irrigationTime }
  }).then(() => {
    console.log("Registro histórico de riego guardado.");
  }).catch((error) => {
    console.error("Error al guardar el histórico de riego:", error);
  });

  alert("Regado agendado.");
}

// Obtener datos históricos al cargar la página
window.onload = () => {
  const historicRef = ref(database, 'historic_records');
  get(historicRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const childData = childSnapshot.val();
          const listItem = document.createElement("li");
          listItem.textContent = `Fecha: ${childData.irrigation.date}, Hora: ${childData.irrigation.time}, Temp: ${childData.temperature}°C, Humedad: ${childData.humidity}%`;
          document.getElementById("historic_records").appendChild(listItem);
        });
      } else {
        console.log("No hay datos históricos.");
      }
    })
    .catch((error) => {
      console.error("Error al obtener los datos históricos:", error);
    });
};

// Evento del formulario para programar riego
document.getElementById("irrigation_schedule").addEventListener("submit", scheduleIrrigation);
