package org.example.Practica_JSON;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Scanner;

public class InventarioApp {

    public static void main(String[] args) {

        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        Scanner teclado = new Scanner(System.in);

        // Crear 2 videojuegos distintos por consola
        ArrayList<Videojuego> listaVideojuegos = new ArrayList<>();

        System.out.println();
        System.out.println("CREA 2 VIDEOJUEGOS:");
        for (int i = 1; i <= 2; i++) {
            System.out.println();
            System.out.println("Videojuego " + i + ": ");
            mensajeTeclado(teclado, listaVideojuegos);
        }

        // Guardar toda la colección en un archivo JSON
        try (FileWriter file = new FileWriter("src/main/resources/VideoJuegoJson/videojuegos.json")) {
            gson.toJson(listaVideojuegos, file);
            System.out.println("\nJSON guardado!");
        } catch (IOException e) {
            System.out.println("Algo ha salido mal.");
            e.printStackTrace();
        }

        // Leer ese archivo y mostrarlo por pantalla
        System.out.println();
        try (FileReader objetoLeido = new FileReader("src/main/resources/VideoJuegoJson/videojuegos.json")) {
            int caracter;
            while ((caracter = objetoLeido.read()) != -1) {
                System.out.print((char) caracter);
            }
            System.out.println();
        } catch (IOException e) {
            System.out.println("Algo ha salido mal.");
            e.printStackTrace();
        }

        // Reconstruir la colección de objetos Java a partir del archivo con .class
        ArrayList<Videojuego> listaLeida = new ArrayList<>();
        try {
            FileReader lector = new FileReader("src/main/resources/VideoJuegoJson/videojuegos.json");
            Videojuego[] arrayVideojuegos = gson.fromJson(lector, Videojuego[].class);
            if (arrayVideojuegos != null) {
                listaLeida.addAll(Arrays.asList(arrayVideojuegos));
            }
        } catch (FileNotFoundException e) {
            System.out.println("Algo ha salido mal.");
            e.printStackTrace();
        }

        // Añadir nuevos videojuegos mientras el usuario quiera
        addVideojuegos(teclado, listaLeida, gson);

        // Mostrar en consola los videojuegos cuyo precio sea menor a 30€
        System.out.println();
        System.out.println("VIDEOJUEGOS CON PRECIO < 30€:");
        for (Videojuego videojuego : listaLeida) {
            if (videojuego.getPrecio() < 30) {
                System.out.println(
                        "\"Nombre: " + videojuego.getNombre() + "\" - " +
                        "\"Precio: " + videojuego.getPrecio() + "€\""
                );
            }
        }

        // Volver a guardar la lista actualizada en el archivo JSON
        try (FileWriter file = new FileWriter("src/main/resources/VideoJuegoJson/videojuegos.json")) {
            gson.toJson(listaLeida, file);
            System.out.println("\nJSON guardado!");
        } catch (IOException e) {
            System.out.println("Algo ha salido mal.");
            e.printStackTrace();
        }

        teclado.close();
    }

    // Metodo para mostrar los mensajes al usuario
    private static void mensajeTeclado(Scanner teclado, ArrayList<Videojuego> listaVideojuegos) {
        System.out.print("Nombre: ");
        String nombre = teclado.nextLine();

        // Validar Plataforma
        Plataforma plataforma;
        while (true) {
            System.out.print("Plataforma --> " + Arrays.toString(Plataforma.values()) + ": ");
            String entradaPlataforma = teclado.nextLine().trim().toUpperCase();
            try {
                plataforma = Plataforma.valueOf(entradaPlataforma);
                break;
            } catch (IllegalArgumentException e) {
                System.out.println("Plataforma inválida. Por favor elige una de " + Arrays.toString(Plataforma.values()));
            }
        }

        // Precio
        System.out.print("Precio (€): ");
        double precio = Double.parseDouble(teclado.nextLine());

        // Disponible
        System.out.print("Disponible (true/false): ");
        boolean disponible = Boolean.parseBoolean(teclado.nextLine());

        // Validar Géneros
        List<Genero> generos = new ArrayList<>();
        while (true) {
            System.out.print("Géneros --> " + Arrays.toString(Genero.values()) + " separados por coma: ");
            String[] generosArray = teclado.nextLine().split("\\s*,\\s*");
            boolean todosValidos = true;
            generos.clear();

            for (String genero : generosArray) {
                try {
                    generos.add(Genero.valueOf(genero.trim().toUpperCase()));
                } catch (IllegalArgumentException e) {
                    System.out.println("Género \"" + genero + "\" inválido.");
                    todosValidos = false;
                    break;
                }
            }
            if (todosValidos) {
                break;
            } else {
                System.out.println("Introduce de nuevo la lista de géneros válida.");
            }
        }

        listaVideojuegos.add(new Videojuego(nombre, plataforma, precio, disponible, generos));
    }


    // Metodo para añadir más videojuegos
    private static void addVideojuegos(Scanner teclado, ArrayList<Videojuego> listaLeida, Gson gson) {
        String respuesta;
        do {
            System.out.println();
            System.out.print("¿Quieres añadir un nuevo videojuego? (S/N): ");
            respuesta = teclado.nextLine().trim().toUpperCase();

            if (respuesta.equals("S")) {
                mensajeTeclado(teclado, listaLeida);

                try (FileWriter file = new FileWriter("src/main/resources/VideoJuegoJson/videojuegos.json")) {
                    gson.toJson(listaLeida, file);
                    System.out.println("\nJSON actualizado!");
                } catch (IOException e) {
                    System.out.println("Algo ha salido mal.");
                    e.printStackTrace();
                }

                System.out.println();
                System.out.println("LISTA ACTUALIZADA:");
                for (Videojuego videojuego : listaLeida) {
                    System.out.println(
                            "\"Nombre: "     + videojuego.getNombre()         + "\" - " +
                            "\"Plataforma: " + videojuego.getPlataforma()     + "\" - " +
                            "\"Precio: "     + videojuego.getPrecio()         + "€\" - " +
                            "\"Estado: "     + (videojuego.isDisponible() ? "disponible" : "agotado") + "\" - " +
                            "\"Géneros: "    + videojuego.getGeneros()        + "\""
                    );
                }

            }
        } while (respuesta.equals("S"));
    }
}