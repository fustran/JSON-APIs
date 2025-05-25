package org.example;

import lombok.Getter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Getter
@ToString
public class Bicis {

    private String marca;
    private String modelo;
    private double precio;
    private List<String> corredores;

    public Bicis(String marca, String modelo, double precio, List<String> corredores) {
        this.marca = marca;
        this.modelo = modelo;
        this.precio = precio;
        this.corredores = new ArrayList<>(corredores);
    }

    public Bicis(){

    }

}