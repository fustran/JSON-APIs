package org.example.Practica_APIs;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;

public class Main {

    public static void main(String[] args) {

        Gson gson = new GsonBuilder().setPrettyPrinting().create();

        // Leer la API key de la variable de entorno
        String apiKey = System.getenv("NASA_API_KEY");

        // Construir la URL para 4 imágenes aleatorias
        String apiUrlKey = "https://api.nasa.gov/planetary/apod?api_key=" + apiKey + "&count=4";

        try {
            // Abrir la conexión HTTP GET
            URL url = new URL(apiUrlKey);
            HttpURLConnection conexion = (HttpURLConnection) url.openConnection();
            conexion.setRequestMethod("GET");

            // Leer la respuesta completa
            BufferedReader leer = new BufferedReader(new InputStreamReader(conexion.getInputStream()));
            StringBuilder respuesta = new StringBuilder();
            String linea;
            while ((linea = leer.readLine()) != null) {
                respuesta.append(linea);
            }
            leer.close();

            // Parsear el JSON a un array de Nasa
            Nasa[] datosArray = gson.fromJson(respuesta.toString(), Nasa[].class);

            // Mostrar por consola todos los campos de cada imagen
            System.out.println();
            for (int i = 0; i < datosArray.length; i++) {
                Nasa datos = datosArray[i];

                System.out.println("=== Imagen #" + (i + 1) + " ===");
                System.out.println("Date:             " + datos.date);
                System.out.println("Title:            " + datos.title);
                System.out.println("Explanation:      " + datos.explanation);
                System.out.println("URL:              " + datos.url);
                System.out.println("HD URL:           " + datos.hdurl);
                System.out.println("Media type:       " + datos.media_type);
                System.out.println("Service version:  " + datos.service_version);
                System.out.println();
            }

        } catch (IOException e) {
            System.out.println("Algo ha salido mal.");
            e.printStackTrace();
        }
    }
}