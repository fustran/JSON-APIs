package org.example;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;

public class Main {

    public static void main(String[] args) {

        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        Bicis bicis = new Bicis("orbea", "kao", 1000, Arrays.asList("David","Iván","Pepito","Menganito"));

        String json = gson.toJson(bicis);

        System.out.println();
        System.out.println(json);

        try (FileWriter file = new FileWriter("src/main/resources/BicisJson/Bicis.json")){
            gson.toJson(bicis, file);
        } catch (IOException e) {
            System.out.println("Algo ha salido mal.");
            e.printStackTrace();
        }

        System.out.println();

        Bicis bicis2 = gson.fromJson(json, Bicis.class);
        System.out.println(bicis2.getMarca() + ", " + bicis2.getModelo() + ", " + bicis2.getPrecio() + ", " + bicis2.getCorredores());

        try {
            FileReader objetoLeido = new FileReader("src/main/resources/BicisJson/Bicis.json");
            Bicis bici3 = gson.fromJson(objetoLeido, Bicis.class);
            System.out.println(bici3.getMarca() + ", " + bici3.getModelo() + ", " + bici3.getPrecio() + ", " + bici3.getCorredores());
        } catch (FileNotFoundException e) {
            System.out.println("Algo ha salido mal.");
            e.printStackTrace();
        }

        ArrayList<Bicis> listaBicis = new ArrayList<>();
        listaBicis.add(new Bicis("Trek", "mcn", 2500, Arrays.asList("Pepote","David", "Mengano")));
        listaBicis.add(new Bicis("caca", "fnb", 2500, Arrays.asList("javi","pepe", "mario")));
        listaBicis.add(new Bicis("cacota", "zas", 2500, Arrays.asList("yo","cesar", "adam")));
        listaBicis.add(new Bicis("coper", "vbn", 2500, Arrays.asList("mauro","lucas", "antonio")));

        String jsonLista = gson.toJson(listaBicis);
        System.out.println(jsonLista);

    }
}