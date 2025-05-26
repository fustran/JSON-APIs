package org.example.Practica_JSON;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class Videojuego {

    private String nombre;
    private Plataforma plataforma;
    private double precio;
    private boolean disponible;
    private List<Genero> generos;

    public Videojuego(String nombre, Plataforma plataforma, double precio, boolean disponible, List<Genero> generos) {
        this.nombre = nombre;
        this.plataforma = plataforma;
        this.precio = precio;
        this.disponible = disponible;
        this.generos = generos;
    }

    @Override
    public String toString() {
        return nombre + " [" + plataforma + "] - " + precio + "€"
                + (disponible ? " (disponible)" : " (agotado)")
                + " géneros=" + generos;
    }
}